class VerticalElevatorSim extends BaseSim {
  constructor(divIdPrefix) {
    super(divIdPrefix, "M", -0.5, 2.5);
    
    this.simDurationS = 5.0;
    this.simulationTimestepS = 0.005;
    this.controllerTimestepS = 0.02;

    this.elevHeightM = 1.0;

    this.plant = new VerticalElevatorPlant(this.simulationTimestepS, this.elevHeightM);

    this.visualization = new VerticalElevatorVisualization(
      this.visualizationDrawDiv,
      this.simulationTimestepS,
      this.elevHeightM,
      () => this.iterationCount - 1,
      setpoint => this.setSetpointM(setpoint),
      () => this.begin()
    );
    this.visualization.drawStatic();

    this.timeSinceLastControllerIteration = 0.0;

    this.accumulatedError = 0.0;
    this.previousPositionError = 0.0;

    //User-configured feedback
    this.kP = 0.0;
    this.kI = 0.0;
    this.kD = 0.0;

    //User-configured Feed-Forward
    this.kG = 0.0;
    this.kV = 0.0;
    this.kA = 0.0;

    //User-configured Profiling
    this.maxVelMps = 0.0;
    this.maxAccelMps2 = 0.0;

    this.inputVolts = 0.0;

    //Default starting setpoint
    this.goal = new ProfileState(0.0, 0.0, 0.0);

    // Reset at least once right at the start
    this.resetCustom();
  }

  setSetpointM(setpoint) {
    this.goal = new ProfileState(setpoint, 0.0, 0.0);
    document.getElementById(this.divIdPrefix + "_setpoint").value = setpoint;
  }

  resetCustom() {
    this.plant.reset();
    this.timeS = Array(this.simDurationS / this.simulationTimestepS)
      .fill()
      .map((_, index) => {
        return index * this.simulationTimestepS;
      });

    this.visualization.setCurPos(0.0);
    this.visualization.setCurTime(0.0);
    this.visualization.setCurSetpoint(0.0);
    this.visualization.setCurControlEffort(0.0);

    this.accumulatedError = 0.0;
    this.previousPositionError = 0.0;
    this.inputvolts = 0.0;
    this.iterationCount = 0;

    this.makeProfile()

    this.positionDelayLine = new DelayLine(13); //models sensor lag

  }
  
  makeProfile(){
    var constraints = new ProfileConstraints(this.maxVelMps, this.maxAccelMps2);
    this.profile = new TrapezoidProfile(constraints)
    this.start = new ProfileState(0.0,0.0,0.0);
    this.setpoint = this.start;
    this.profile.init(this.start, this.goal)
  }

  iterateCustom() {

    this.curSimTimeS = this.timeS[this.iterationCount];

    let measuredPositionM = this.positionDelayLine.getSample();

    // Update controller at controller freq
    if (this.timeSinceLastControllerIteration >= this.controllerTimestepS) {
      this.setpoint = this.profile.calculate(this.curSimTimeS, this.setpoint)
      this.inputVolts = this.updateController(this.setpoint, measuredPositionM);
      this.timeSinceLastControllerIteration = this.controllerTimestepS;
    } else {
      this.timeSinceLastControllerIteration = this.timeSinceLastControllerIteration + this.simulationTimestepS;
    }

    this.plant.update(this.inputVolts);

    this.positionDelayLine.addSample(this.plant.getPositionM());

    this.visualization.setCurPos(this.plant.getPositionM());
    this.visualization.setCurTime(this.curSimTimeS);
    this.visualization.setCurSetpoint(this.setpoint.pos);
    this.visualization.setCurControlEffort(this.inputVolts);

    this.procVarActualSignal.addSample(new Sample(this.curSimTimeS, this.plant.getPositionM()));
    this.procVarDesiredSignal.addSample(new Sample(this.curSimTimeS, this.setpoint.pos));
    this.voltsSignal.addSample(new Sample(this.curSimTimeS, this.inputVolts));

    this.iterationCount++;

    if (this.iterationCount >= this.timeS.length) {
      this.end();
    }
  }

  updateController(setpoint, measurement) {

    // Calculate error, error derivative, and error integral
    let positionError = setpoint.pos - measurement;

    this.accumulatedError += positionError * this.controllerTimestepS;

    const derivativeError =
      (positionError - this.previousPositionError) / this.controllerTimestepS;

    // PID + gravity/Profiled feed-forward control law
    let controlEffortVolts =
      this.kG  +
      this.kV * setpoint.vel +
      this.kA * setpoint.accel +
      this.kP * positionError +
      this.kI * this.accumulatedError +
      this.kD * derivativeError;

    // Cap voltage at max/min of the physically possible command
    if (controlEffortVolts > 12) {
      controlEffortVolts = 12;
    } else if (controlEffortVolts < -12) {
      controlEffortVolts = -12;
    }

    this.previousPositionError = positionError;

    return controlEffortVolts;
  }

}

class VerticalArmSim extends BaseSim {
  constructor(divIdPrefix) {
    super(divIdPrefix, "Rad", -Math.PI * 1.25, Math.PI * 1.25);

    this.positionDelayLine = new DelayLine(49); //models sensor lag
    
    this.simDurationS = 5.0;
    this.simulationTimestepS = 0.005;
    this.controllerTimestepS = 0.02;

    // User-configured setpoints
    this.currentSetpointRad = 0.0;

    this.plant = new VerticalArmPlant(this.simulationTimestepS);

    this.visualization = new VerticalArmVisualization(
      this.visualizationDrawDiv,
      this.simulationTimestepS,
      () => this.iterationCount - 1,
      setpoint => this.setSetpointRad(setpoint),
      () => this.begin()
    );
    this.visualization.drawStatic();

    this.timeSinceLastControllerIteration = 0.0;

    this.accumulatedError = 0.0;
    this.previousError = 0.0;
    this.previousSetpoint = 0.0;

    //User-configured feedback
    this.kP = 0.0;
    this.kI = 0.0;
    this.kD = 0.0;

    //User-configured Feed-Forward
    this.kG = 0.0;
    this.kV = 0.0;

    this.inputVolts = 0.0;

    this.resetCustom();
  }

  setSetpointRad(setpoint) {
    this.currentSetpointRad = setpoint;
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
    this.previousError = 0.0;
    this.previousSetpoint = 0.0;
    this.inputvolts = 0.0;
    this.iterationCount = 0;

    this.positionDelayLine = new DelayLine(50); //models sensor lag

  }
  

  iterateCustom() {

    this.curSimTimeS = this.timeS[this.iterationCount];

    let measuredPositionRad = this.positionDelayLine.getSample();

    // Update controller at controller freq
    if (this.timeSinceLastControllerIteration >= this.controllerTimestepS) {
      this.inputVolts = this.updateController(this.currentSetpointRad, measuredPositionRad);
      this.timeSinceLastControllerIteration = 0;
    } else {
      this.timeSinceLastControllerIteration = this.timeSinceLastControllerIteration + this.simulationTimestepS;
    }

    this.plant.update(this.inputVolts);

    this.positionDelayLine.addSample(this.plant.getPositionRad());

    this.visualization.setCurPos(this.plant.getPositionRad());
    this.visualization.setCurTime(this.curSimTimeS);
    this.visualization.setCurSetpoint(this.currentSetpointRad);
    this.visualization.setCurControlEffort(this.inputVolts);

    this.procVarActualSignal.addSample(new Sample(this.curSimTimeS, this.plant.getPositionRad()));
    this.procVarDesiredSignal.addSample(new Sample(this.curSimTimeS, this.currentSetpointRad));
    this.voltsSignal.addSample(new Sample(this.curSimTimeS, this.inputVolts));

    this.iterationCount++;

    if (this.iterationCount >= this.timeS.length) {
      this.end();
    }
  }

  updateController(setpoint, measurement) {

    // Calculate error, error derivative, and error integral
    let error = setpoint - measurement;
    const derivativeSetpoint =
      (setpoint - this.previousSetpoint) / this.controllerTimestepS;

    this.accumulatedError += error * this.controllerTimestepS;

    const derivativeError =
      (error - this.previousError) / this.controllerTimestepS;

    // PID + cosine feed-forward control law
    let controlEffortVolts =
      this.kG * Math.cos(setpoint) +
      this.kV * derivativeSetpoint +
      this.kP * error +
      this.kI * this.accumulatedError +
      this.kD * derivativeError;

    // Cap voltage at max/min of the physically possible command
    if (controlEffortVolts > 12) {
      controlEffortVolts = 12;
    } else if (controlEffortVolts < -12) {
      controlEffortVolts = -12;
    }

    this.previousError = error;
    this.previousSetpoint = setpoint;

    return controlEffortVolts;
  }

}

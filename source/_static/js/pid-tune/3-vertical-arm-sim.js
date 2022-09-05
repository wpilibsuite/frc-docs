class VerticalArmSim extends BaseSim {
  constructor(divIdPrefix) {
    super(divIdPrefix, "Radians", -Math.PI * 1.25, Math.PI * 1.25);

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

    this.reset();
  }

  setSetpointRad(setpoint) {
    this.currentSetpointRad = setpoint;
    document.getElementById(this.divIdPrefix + "_setpoint").value = setpoint;
  }

  reset() {
    if (this.simLoopHandle) {
      clearInterval(this.simLoopHandle);
    }
    this.plant.reset();
    this.timeS = Array(this.simDurationS / this.simulationTimestepS)
      .fill()
      .map((_, index) => {
        return index * this.simulationTimestepS;
      });
    this.output = Array(
      this.simDurationS / this.simulationTimestepS
    ).fill(0);
    this.setpoint = Array(
      this.simDurationS / this.simulationTimestepS
    ).fill(0);
    this.controlEffortVolts = Array(
      this.simDurationS / this.simulationTimestepS
    ).fill(0);
    this.outputPositionRev = Array(
      this.simDurationS / this.simulationTimestepS
    ).fill(0);

    this.visualization.setPositionData(this.output);
    this.visualization.setTimeData(this.timeS);
    this.visualization.setSetpointData(this.setpoint);
    this.visualization.setControlEffortData(this.controlEffortVolts);

    this.accumulatedError = 0.0;
    this.previousError = 0.0;
    this.previousSetpoint = 0.0;
    this.inputvolts = 0.0;
    this.iterationCount = 0;

    this.positionDelayLine = new DelayLine(50); //models sensor lag

  }

  begin() {
    this.reset();
    this.simLoopHandle = setInterval(() => {this.iterate();}, this.simulationTimestepS * 1000);
  }

  end() {
    clearInterval(this.simLoopHandle);
    this.updateGraphs();
  }

  iterate() {
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

    this.controlEffortVolts[this.iterationCount] = this.inputVolts;
    this.output[this.iterationCount] = this.plant.getPositionRad();
    this.setpoint[this.iterationCount] = this.currentSetpointRad;
    this.outputPositionRev[this.iterationCount] = this.plant.getPositionRad() / 2 / Math.PI;

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

  updateGraphs() {
    this.setControlEffortData(zip(this.timeS, this.controlEffortVolts));
    this.setSetpointData(zip(this.timeS, this.setpoint));
    this.setOutputData(zip(this.timeS, this.output));
  }
}

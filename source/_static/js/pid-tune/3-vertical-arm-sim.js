class VerticalArmSim extends BaseSim {
  constructor(divIdPrefix) {
    super(divIdPrefix, "Radians", -Math.PI * 1.25, Math.PI * 1.25);

    this.positionDelayLine = new DelayLine(49); //models sensor lag

    // User-configured setpoints
    this.currentSetpointRad = 0.0;

    this.plant = new VerticalArmPlant(this.simulationTimestepS);

    this.visualization = new VerticalArmVisualization(
      this.visualizationDrawDiv,
      setpoint => this.setSetpointRad(setpoint),
      () => this.updateGraphs()
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
    setInterval(() => {this.iterate();}, this.simulationTimestepS * 1000);
  }

  setSetpointRad(setpoint) {
    this.currentSetpointRad = setpoint;
    this.visualization.setSetpointRev
  }

  reset() {
    this.plant.reset();
    this.timeS = Array(this.simulationEndTimeS / this.simulationTimestepS)
      .fill()
      .map((_, index) => {
        return index * this.simulationTimestepS;
      })
      .reverse();
    this.output = Array(
      this.simulationEndTimeS / this.simulationTimestepS
    ).fill(0);
    this.setpoint = Array(
      this.simulationEndTimeS / this.simulationTimestepS
    ).fill(0);
    this.controlEffort = Array(
      this.simulationEndTimeS / this.simulationTimestepS
    ).fill(0);
    this.outputPositionRev = Array(
      this.simulationEndTimeS / this.simulationTimestepS
    ).fill(0);

    this.visualization.setPositionData(this.output);
    this.visualization.setTimeData(this.timeS);
    this.visualization.setSetpointData(this.setpoint);

    this.accumulatedError = 0.0;
    this.previousError = 0.0;
    this.previousSetpoint = 0.0;
    this.inputvolts = 0.0;

    this.positionDelayLine = new DelayLine(50); //models sensor lag

    this.redraw();
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

    this.controlEffort.unshift(this.inputVolts);
    this.controlEffort.pop();
    this.output.unshift(this.plant.getPositionRad());
    this.output.pop();
    this.setpoint.unshift(this.currentSetpointRad);
    this.setpoint.pop();
    this.outputPositionRev.unshift(this.plant.getPositionRad() / 2 / Math.PI);
    this.outputPositionRev.pop();
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
    let controlEffort =
      this.kG * Math.cos(setpoint) +
      this.kV * derivativeSetpoint +
      this.kP * error +
      this.kI * this.accumulatedError +
      this.kD * derivativeError;

    // Cap voltage at max/min of the physically possible command
    if (controlEffort > 12) {
      controlEffort = 12;
    } else if (controlEffort < -12) {
      controlEffort = -12;
    }

    this.previousError = error;
    this.previousSetpoint = setpoint;

    return controlEffort;
  }

  updateGraphs() {
    this.setControlEffortData(zip(this.timeS, this.controlEffort));
    this.setSetpointData(zip(this.timeS, this.output));
    this.setOutputData(zip(this.timeS, this.setpoint));
    this.redraw();
  }
}

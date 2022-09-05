class FlywheelSim extends BaseSim {
  constructor(div_id_prefix) {
    super(div_id_prefix, "RPM", 0, 1800);

    this.simDurationS = 10.0;
    this.simulationTimestepS = 0.001;
    this.controllerTimestepS = 0.02;

    this.timeS = Array(this.simDurationS / this.simulationTimestepS).fill(0);
    this.output = Array(
      this.simDurationS / this.simulationTimestepS
    ).fill(0);
    this.setpoint = Array(
      this.simDurationS / this.simulationTimestepS
    ).fill(0);
    this.controlEffortVolts = Array(
      this.simDurationS / this.simulationTimestepS
    ).fill(0);
    this.outputPositionRad = Array(
      this.simDurationS / this.simulationTimestepS
    ).fill(0);

    // User-configured setpoints
    this.setpointVal = 300.0;
    this.setpointStepTime = 1.0;

    this.plant = new FlywheelPlant();

    this.visualization = new FlywheelVisualization(this.visualizationDrawDiv);
    this.visualization.drawStatic();
  }

  runSim() {
    var inputVolts = 0.0;
    var nextControllerRunTime = 0;

    this.procVarActualSignal.clearValues()
    this.procVarDesiredSignal.clearValues()
    this.voltsSignal.clearValues()

    var speed_delay_line = new DelayLine(49); //models sensor lag

    this.plant.init(this.simulationTimestepS);

    for (var index = 0.0; index < this.timeS.length; index++) {
      var currentSetpoint = 0.0;
      var currentTimeS = index * this.simulationTimestepS;
      if (currentTimeS > this.setpointStepTime) {
        currentSetpoint = this.setpointVal;
      }

      var meas_speed = speed_delay_line.getSample();

      //Simulate Controller
      if (currentTimeS >= nextControllerRunTime) {
        inputVolts = this.controllerUpdate(currentTimeS, currentSetpoint, meas_speed);
        //Maintain separate sample rate for controller
        nextControllerRunTime += this.controllerTimestepS;
      }

      this.plant.update(currentTimeS, inputVolts);

      speed_delay_line.addSample(this.plant.getCurrentSpeedRPM());


      this.procVarActualSignal.addSample(new Sample(currentTimeS, this.plant.getCurrentSpeedRPM()));
      this.procVarDesiredSignal.addSample(new Sample(currentTimeS, currentSetpoint));
      this.voltsSignal.addSample(new Sample(currentTimeS, inputVolts));

      //TODO - move all these over to be signals/samples too
      this.timeS[index] = currentTimeS;
      this.controlEffortVolts[index] = inputVolts;
      this.output[index] = this.plant.getCurrentSpeedRPM();
      this.setpoint[index] = currentSetpoint;
      this.outputPositionRad[index] = this.plant.getCurrentPositionRev() * 2 * Math.PI;
    }

    //TODO - move all these over to be signals/samples too
    this.visualization.setPositionData(this.outputPositionRad);
    this.visualization.setSetpointData(this.setpoint);
    this.visualization.setOutputData(this.output);
    this.visualization.setControlEffortData(this.controlEffortVolts);
    this.visualization.setTimeData(this.timeS);
    this.visualization.setBallTimes(
      this.plant.getBallEnterTime(),
      this.plant.getBallExitTime()
    );

  }

  drawAnimation(timeIndex, animationTimeS) {
    super.drawAnimation(timeIndex, animationTimeS);
  }

}

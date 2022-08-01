class FlywheelSim extends BaseSim {
  constructor(div_id_prefix) {
    super(div_id_prefix, "RPM", 0, 1800);

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

    var speed_delay_line = new DelayLine(49); //models sensor lag

    this.plant.init(this.simulationTimestepS);

    var idx = 0;

    for (var t = 0.0; t < this.simulationEndTimeS; t += this.simulationTimestepS) {
      var currentSetpoint = 0.0;
      if (t > this.setpointStepTime) {
        currentSetpoint = this.setpointVal;
      }

      var meas_speed = speed_delay_line.getSample();

      //Simulate Controller
      if (t >= nextControllerRunTime) {
        inputVolts = this.controllerUpdate(t, currentSetpoint, meas_speed);
        //Maintain separate sample rate for controller
        nextControllerRunTime += this.controllerTimestepS;
      }

      this.plant.update(t, inputVolts);

      speed_delay_line.addSample(this.plant.getCurrentSpeedRPM());

      this.timeS[idx] = t;
      this.controlEffort[idx] = inputVolts;
      this.output[idx] = this.plant.getCurrentSpeedRPM();
      this.setpoint[idx] = currentSetpoint;
      this.outputPositionRev[idx] = this.plant.getCurrentPositionRev();

      idx++;
    }

    var controlEffortPlotData = Array(null, this.timeS.length);
    var outputPlotData = Array(null, this.timeS.length);
    var setpointPlotData = Array(null, this.timeS.length);
    for (var idx = 0; idx < this.timeS.length; idx++) {
      controlEffortPlotData[idx] = [
        this.timeS[idx],
        this.controlEffort[idx],
      ];
      outputPlotData[idx] = [this.timeS[idx], this.outputPositionRev[idx]];
      setpointPlotData[idx] = [
        this.timeS[idx],
        this.setpoint[idx],
      ];
    }
    this.setControlEffortData(controlEffortPlotData);
    this.setSetpointData(setpointPlotData);
    this.setOutputData(outputPlotData);
    this.visualization.setPositionData(
      this.outputPositionRev
    );
    this.visualization.setSetpointData(this.setpoint);
    this.visualization.setTimeData(this.timeS);
    this.visualization.setBallTimes(
      this.plant.getBallEnterTime(),
      this.plant.getBallExitTime()
    );

    this.redraw();
  }
}

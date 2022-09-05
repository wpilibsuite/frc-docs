class BaseSim {
  constructor(divIdPrefix, processVariableUnits) {
    this.divIdPrefix = divIdPrefix;
    this.speedGraph = null;
    this.voltsGraph = null;
    this.containerDiv = document.getElementById(divIdPrefix + "_container");
    let plotDrawDivVals = document.getElementById(divIdPrefix + "_plotVals");
    let plotDrawDivVolts = document.getElementById(divIdPrefix + "_plotVolts");

    // Set up process variable chart - two signals indicating "actual" and "desired"
    // values for the simulation
    this.procVarPlot = new Plot(plotDrawDivVals);
    this.procVarActualSignal = new Signal("Actual", processVariableUnits);
    this.procVarDesiredSignal = new Signal("Desired", processVariableUnits);
    this.procVarPlot.addSignal(this.procVarActualSignal, "green");
    this.procVarPlot.addSignal(this.procVarDesiredSignal, "blue");
    this.procVarPlot.setNumValueAxes(1);


    // Set up "volts" chart - indicates control effort applied to the system
    this.voltsPlot = new Plot(plotDrawDivVolts);
    this.voltsSignal = new Signal("Control Effort", "V");
    this.voltsPlot.addSignal(this.voltsSignal, "red");
    this.voltsPlot.setNumValueAxes(1);

    this.visualizationDrawDiv = document.getElementById(divIdPrefix + "_viz");

    this.animationStartTimeS = null;
    window.requestAnimationFrame((t) => this.animate(t));

    this.controlDrawDiv = document.getElementById(divIdPrefix + "_ctrls");

    this.animationReset = true;

    this.simRunning = true;

    //Register mouseover callbacks. 
    // This is still tentative, as these won't work if the sim is running
    this.procVarPlot.chart.mouseoverAtTimeCallback = this.onChartMouseOver; 
    this.voltsPlot.chart.zoomRangeUpdateCallback = this.onChartZoomAction; 
    

  }


  resetData() {

  }

  animate(currentTimeMs) {

    //Main animation loop
    let currentTimeS = currentTimeMs / 1000.0;

    if (this.animationReset) {
      //Sim has restarted, reset things to nominal
      this.animationStartTimeS = currentTimeS;
      this.animationReset = false;
    }

    //Calculate the current time index, looping once we get past the end of the simulated duration
    let animationTimeS = (currentTimeS - this.animationStartTimeS) % this.simDurationS;
    let timeIndex = Math.floor(animationTimeS / this.simulationTimestepS);

    //Let the sim draw its animation
    this.visualization.drawDynamic(timeIndex, animationTimeS);

    //Update plot ranges and draw them
    this.procVarPlot.setDrawRange(0, this.simDurationS);
    this.procVarPlot.drawDataToChart();
    this.procVarPlot.setCursorPos(animationTimeS);

    this.voltsPlot.setDrawRange(0, this.simDurationS);
    this.voltsPlot.drawDataToChart();
    this.voltsPlot.setCursorPos(animationTimeS);

    // Tell the browser to animate another frame for us later
    window.requestAnimationFrame((t) => this.animate(t));
  }

  setControlEffortData(data) {
    this.voltsPlot.series[0].setData(data, false, false, true);
  }

  setOutputData(data) {
    this.procVarPlot.series[0].setData(data, false, false, true);
  }

  setSetpointData(data) {
    this.procVarPlot.series[1].setData(data, false, false, true);
  }

  ///////////////////////////
  // Mouse Events

  onChartMouseOver(timeAtMouse){
    if(!this.simRunning){
        this.procVarPlot.setCursorPos(timeAtMouse);
        this.voltsPlot.setCursorPos(timeAtMouse);
    }
  }


  onChartZoomAction(startTime, endTime){
    if(!this.simRunning){
      this.procVarPlot.setDrawRange(startTime, endTime);
      this.voltsPlot.setDrawRange(startTime, endTime);
    } 
  }

}

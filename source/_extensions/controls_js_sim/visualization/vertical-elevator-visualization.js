class VerticalElevatorVisualization extends BaseVisualization {
  constructor(div_in, simulationTimestepS, elevHeightM, getSimulationIndex, setSimulationSetpoint, beginSimulation) {
    super(div_in);

    this.getSimulationIndex = getSimulationIndex;

    this.draggingSetpoint = false;

    this.setSimulationSetpoint = setSimulationSetpoint;
    this.beginSimulation = beginSimulation;

    this.animatedCanvas.addEventListener("mousedown", event => this.handleMouseDown(event));

    this.elevBottom = this.height * 0.9;
    this.elevTop = this.height * 0.1;
    this.elevMaxHeightM = elevHeightM;
  }

  getCursorPosition(event) {
    const rect = this.animatedCanvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return [x, y];
  }

  setpointFromClick([x, y]) {
    return this.canvasToPos(y);
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();

    this.beginSimulation();

    const clickLocation = this.getCursorPosition(event);

    this.draggingSetpoint = true;

    this.setSimulationSetpoint(this.setpointFromClick(clickLocation));
  }

  posToCanvas(posIn){
    return posIn / this.elevMaxHeightM * (this.elevTop - this.elevBottom) + this.elevBottom;
  }

  canvasToPos(canvasYIn){
    return (canvasYIn - this.elevBottom) * this.elevMaxHeightM / (this.elevTop - this.elevBottom);
  }

  drawStaticCustom() {
    //Supports
    this.staticCanvasContext.lineWidth = 5;
    this.staticCanvasContext.strokeStyle = "#000000";
    this.staticCanvasContext.beginPath();
    this.staticCanvasContext.moveTo(this.width / 2, 0.9 * this.height);
    this.staticCanvasContext.lineTo(this.width / 2, 0.1 * this.height);
    this.staticCanvasContext.stroke();

    //Wheels
    this.staticCanvasContext.lineWidth = 5;
    this.staticCanvasContext.fillStyle = "#000000";
    this.staticCanvasContext.strokeStyle = "#444444";
    this.staticCanvasContext.beginPath();
    this.staticCanvasContext.arc(
      0.2 * this.width,
      0.92 * this.height,
      0.06 * this.height,
      0,
      2 * Math.PI,
      false
    );
    this.staticCanvasContext.fill();
    this.staticCanvasContext.stroke();
    this.staticCanvasContext.beginPath();
    this.staticCanvasContext.arc(
      0.5 * this.width,
      0.92 * this.height,
      0.06 * this.height,
      0,
      2 * Math.PI,
      false
    );
    this.staticCanvasContext.fill();
    this.staticCanvasContext.stroke();
    this.staticCanvasContext.beginPath();
    this.staticCanvasContext.arc(
      0.8 * this.width,
      0.92 * this.height,
      0.06 * this.height,
      0,
      2 * Math.PI,
      false
    );
    this.staticCanvasContext.fill();
    this.staticCanvasContext.stroke();

    //Bumpers
    this.staticCanvasContext.fillStyle = "blue";
    this.staticCanvasContext.fillRect(
      0.1 * this.width,
      0.88 * this.height,
      0.8 * this.width,
      0.07 * this.height
    );
    this.staticCanvasContext.fillStyle = "#FFFFFF";
    this.staticCanvasContext.font = "bold 22px Arial";
    this.staticCanvasContext.textAlign = "center";
    this.staticCanvasContext.fillText(
      this.teamNumber,
      0.5 * this.width,
      0.94 * this.height
    );
  }

  drawDynamicCustom() {
    // todo: systematize magic numbers

    //Time Indicator
    this.animatedCanvasContext.fillStyle = "#000000";
    this.animatedCanvasContext.font = "bold 20px Arial";
    this.animatedCanvasContext.fillText(
      "t = " + this.timeS.toFixed(2) + " sec",
      0.05 * this.width,
      0.15 * this.height
    );

    this.armStartX = 0.5 * this.width;
    this.armStartY = 0.5 * this.height;

    this.clickTolerance = 0.5 * this.height;

    const setpointDraw = this.posToCanvas(this.setpoint);
    const positionDraw = this.posToCanvas(this.position);


    // Elevator
    const elevDrawWidth = this.width * 0.2;
    const elevDrawHeight = this.height * 0.1;
    this.animatedCanvasContext.lineWidth = 6;
    this.animatedCanvasContext.fillStyle = "purple";
    this.animatedCanvasContext.fillRect(
      this.width * 0.5 - elevDrawWidth/2, 
      positionDraw - elevDrawHeight/2,
      elevDrawWidth, 
      elevDrawHeight
    );

    // Control Effort
    const controlEffortPlotScale = this.controlEffortVolts / 12.0 * this.height * 0.75;
    // Control effort indicator
    if (Math.abs(this.controlEffortVolts) > 0.01) {
      drawArrow(this.animatedCanvasContext, 
        this.width * 0.5, 
        positionDraw, 
        this.width * 0.5, 
        positionDraw-controlEffortPlotScale, 
        4, "green")
    }

    // Setpoint
    this.animatedCanvasContext.lineWidth = 3;
    this.animatedCanvasContext.strokeStyle = "red";
    this.animatedCanvasContext.beginPath();
    this.animatedCanvasContext.moveTo(this.width * 0.3, setpointDraw);
    this.animatedCanvasContext.lineTo(this.width * 0.7, setpointDraw);
    this.animatedCanvasContext.stroke();

  }



}

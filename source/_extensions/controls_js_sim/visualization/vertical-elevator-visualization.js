class VerticalElevatorVisualization extends BaseVisualization {
  constructor(div_in, simulationTimestepS, elevHeightM, getSimulationIndex, setSimulationSetpoint, beginSimulation) {
    super(div_in);

    this.getSimulationIndex = getSimulationIndex;

    this.draggingSetpoint = false;

    this.setSimulationSetpoint = setSimulationSetpoint;
    this.beginSimulation = beginSimulation;

    this.animatedCanvas.addEventListener("mousedown", event => this.handleMouseDown(event));
    this.animatedCanvas.addEventListener("mousemove", event => this.handleMouseMove(event));
    this.animatedCanvas.addEventListener("mouseup", event => this.handleMouseUp(event));

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

  handleMouseMove(event) {
    event.preventDefault();
    event.stopPropagation();

    const mouseLocation = this.getCursorPosition(event);

    if (this.draggingSetpoint) {
        this.setSimulationSetpoint(this.setpointFromClick(mouseLocation));
    }
  }

  handleMouseUp(event) {
    event.preventDefault();
    event.stopPropagation();

    this.draggingSetpoint = false;
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
    this.animatedCanvasContext.lineWidth = 6;
    this.animatedCanvasContext.strokeStyle = "grey";
    this.animatedCanvasContext.beginPath();
    this.animatedCanvasContext.moveTo(this.width * 0.4, positionDraw);
    this.animatedCanvasContext.lineTo(this.width * 0.6, positionDraw);
    this.animatedCanvasContext.stroke();

    // Setpoint
    this.animatedCanvasContext.lineWidth = 3;
    this.animatedCanvasContext.strokeStyle = "grey";
    this.animatedCanvasContext.beginPath();
    this.animatedCanvasContext.moveTo(this.width * 0.4, setpointDraw);
    this.animatedCanvasContext.lineTo(this.width * 0.6, setpointDraw);
    this.animatedCanvasContext.stroke();

  }



}

class TurretVisualization extends BaseVisualization {
  constructor(div_in, simulationTimestepS, getSimulationIndex, setSimulationSetpoint, beginSimulation) {
    super(div_in);

    // These kept as members for click-drag detection
    this.setpointX = 0.0;
    this.setpointY = 0.0;

    this.simulationTimestepS = simulationTimestepS;

    this.getSimulationIndex = getSimulationIndex;

    this.draggingSetpoint = false;

    this.setSimulationSetpoint = setSimulationSetpoint;
    this.beginSimulation = beginSimulation;

    this.animatedCanvas.addEventListener("mousedown", event => this.handleMouseDown(event));
    this.animatedCanvas.addEventListener("mousemove", event => this.handleMouseMove(event));
    this.animatedCanvas.addEventListener("mouseup", event => this.handleMouseUp(event));
  }

  getCursorPosition(event) {
    const rect = this.animatedCanvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return [x, y];
  }

  isNearSetpoint(mouseLocation) {
    return isNear(
      mouseLocation,
      [this.setpointX, this.setpointY],
      0.035 * this.height
    );
  }

  angleFromArmCenter([x, y]) {
    return -Math.atan2(y - this.turretCenterY, x - this.turretCenterX);
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();

    this.beginSimulation();

    const clickLocation = this.getCursorPosition(event);

    this.draggingSetpoint = true;

    this.setSimulationSetpoint(this.angleFromArmCenter(clickLocation));
  }

  handleMouseMove(event) {
    event.preventDefault();
    event.stopPropagation();

    const mouseLocation = this.getCursorPosition(event);

    if (this.draggingSetpoint) {
        this.setSimulationSetpoint(this.angleFromArmCenter(mouseLocation));
    }
  }

  handleMouseUp(event) {
    event.preventDefault();
    event.stopPropagation();

    this.draggingSetpoint = false;
  }

  drawStaticCustom() {
    this.turretCenterX = 0.5 * this.width;
    this.turretCenterY = 0.5 * this.height;

    this.turretRadiusPx = Math.min(this.width, this.height) * 0.4;
    this.staticCanvasContext.moveTo(this.width / 2, this.height / 2);

    // Center of turret
    this.staticCanvasContext.beginPath();
    this.staticCanvasContext.arc(
      0.5 * this.width,
      0.5 * this.height,
      0.02 * this.height,
      0,
      2 * Math.PI,
      false
    );
    this.staticCanvasContext.fillStyle = "black";
    this.staticCanvasContext.fill();
    this.staticCanvasContext.stroke();

    // Turret circumference
    this.staticCanvasContext.beginPath();
    this.staticCanvasContext.arc(
      0.5 * this.width,
      0.5 * this.height,
      this.turretRadiusPx,
      0,
      2 * Math.PI,
      false
    );
    this.staticCanvasContext.stroke();
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

    this.clickTolerance = 0.5 * this.height;
    this.setpointIndicatorRadius = 0.035 * this.height;
    this.endEffectorIndicatorRadius = 0.03 * this.height;

    const setpointRad = this.setpoint;
    const positionRad = this.positionRad;
    const controlEffortPlotScale = this.controlEffortVolts * 1.5/12 * this.turretRadiusPx;

    const turretFrontX =
      this.turretCenterX + this.turretRadiusPx * Math.cos(positionRad);
    const turretFrontY =
      this.turretCenterY - this.turretRadiusPx * Math.sin(positionRad);

    const controlEffortEndX = turretFrontX - controlEffortPlotScale * Math.sin(positionRad);
    const controlEffortEndY = turretFrontY - controlEffortPlotScale * Math.cos(positionRad);

    this.setpointX =
      this.turretCenterX + this.turretRadiusPx * Math.cos(setpointRad);
    this.setpointY =
      this.turretCenterY - this.turretRadiusPx * Math.sin(setpointRad);

    // Setpoint indicator
    this.animatedCanvasContext.beginPath();
    this.animatedCanvasContext.arc(
      this.setpointX,
      this.setpointY,
      0.035 * this.height,
      0,
      2 * Math.PI,
      false
    );
    this.animatedCanvasContext.fillStyle = "red";
    this.animatedCanvasContext.fill();

    // Control effort indicator
    if (controlEffortPlotScale * controlEffortPlotScale > 0) {
      drawArrow(this.animatedCanvasContext, turretFrontX, turretFrontY, controlEffortEndX, controlEffortEndY, 4, "green")
    }

    // Turret front
    this.animatedCanvasContext.beginPath();
    this.animatedCanvasContext.arc(
      turretFrontX,
      turretFrontY,
      0.03 * this.height,
      0,
      2 * Math.PI,
      false
    );
    this.animatedCanvasContext.fillStyle = "purple";
    this.animatedCanvasContext.fill();
  }
}

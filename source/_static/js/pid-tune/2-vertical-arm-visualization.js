class VerticalArmVisualization extends BaseVisualization {
  constructor(div_in, setSimulationSetpoint) {
    super(div_in);

    // These kept as members for click-drag detection
    this.setpointX = 0.0;
    this.setpointY = 0.0;

    this.draggingSetpoint = false;

    this.setSimulationSetpoint = setSimulationSetpoint;

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
    return -Math.atan2(y - this.armStartY, x - this.armStartX) / 2 / Math.PI;
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();

    const clickLocation = this.getCursorPosition(event);

    if (this.isNearSetpoint(clickLocation)) {
        this.draggingSetpoint = true;
    } else {
        console.log("Foo");
        this.setSimulationSetpoint(this.angleFromArmCenter(clickLocation));
    }
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
    //Supports
    this.staticCanvasContext.lineWidth = 5;
    this.staticCanvasContext.strokeStyle = "#000000";
    this.staticCanvasContext.beginPath();
    this.staticCanvasContext.moveTo(this.width / 2, this.height / 2);
    this.staticCanvasContext.lineTo(0.3 * this.width, 0.9 * this.height);
    this.staticCanvasContext.stroke();
    this.staticCanvasContext.beginPath();
    this.staticCanvasContext.moveTo(this.width / 2, this.height / 2);
    this.staticCanvasContext.lineTo(0.7 * this.width, 0.9 * this.height);
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
    this.staticCanvasContext.fillStyle = "#FF0000";
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

  drawDynamicCustom(timeIndex) {
    this.armStartX = 0.5 * this.width;
    this.armStartY = 0.5 * this.height;
    this.armLenPx = Math.min(this.width, this.height) * 0.4;

    this.clickTolerance = 0.5 * this.height;
    this.setpointIndicatorRadius = 0.035 * this.height;
    this.endEffectorIndicatorRadius = 0.03 * this.height;

    this.animatedCanvasContext.clearRect(0, 0, this.width, this.height);

    let armEndX =
      this.armStartX + this.armLenPx * Math.cos(2 * Math.PI * this.positionRev[0]);
    let armEndY =
      this.armStartY - this.armLenPx * Math.sin(2 * Math.PI * this.positionRev[0]); // y axis inverted on graphics

    this.setpointX =
      this.armStartX + this.armLenPx * Math.cos(2 * Math.PI * this.setpointRev[0]);
    this.setpointY =
      this.armStartY - this.armLenPx * Math.sin(2 * Math.PI * this.setpointRev[0]);

    // Arm
    this.animatedCanvasContext.lineWidth = 6;
    this.animatedCanvasContext.strokeStyle = "#22BB22";
    this.animatedCanvasContext.beginPath();
    this.animatedCanvasContext.moveTo(this.armStartX, this.armStartY);
    this.animatedCanvasContext.lineTo(armEndX, armEndY);
    this.animatedCanvasContext.stroke();

    // Shoulder Joint
    this.animatedCanvasContext.beginPath();
    this.animatedCanvasContext.arc(
      0.5 * this.width,
      0.5 * this.height,
      0.02 * this.height,
      0,
      2 * Math.PI,
      false
    );
    this.animatedCanvasContext.fillStyle = "grey";
    this.animatedCanvasContext.fill();

    // End Effector
    this.animatedCanvasContext.beginPath();
    this.animatedCanvasContext.arc(
      armEndX,
      armEndY,
      0.035 * this.height,
      0,
      2 * Math.PI,
      false
    );
    this.animatedCanvasContext.fillStyle = "#990099";
    this.animatedCanvasContext.fill();

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
  }

  setSetpointRev(setpointRev) {
    this.setpointRev = setpointRev;
  }
}

class BaseVisualization {
  constructor(div_in) {
    this.drawDiv = div_in;

    div_in.style.position = "relative";

    this.animatedCanvas = document.createElement("canvas");
    this.staticCanvas = document.createElement("canvas");

    this.staticCanvas.style.position = "absolute";
    this.staticCanvas.style.top = "0px";
    this.staticCanvas.style.left = "0px";

    this.animatedCanvas.style.position = "absolute";
    this.animatedCanvas.style.top = "0px";
    this.animatedCanvas.style.left = "0px";

    this.teamNumber = Math.floor(Math.random() * 9999).toFixed(0);

    this.animatedCanvasContext = this.animatedCanvas.getContext("2d");
    this.staticCanvasContext = this.staticCanvas.getContext("2d");

    div_in.appendChild(this.staticCanvas);
    div_in.appendChild(this.animatedCanvas);

    this.updateSize();

    window.addEventListener("resize", this.updateSize.bind(this));
    window.addEventListener("load", this.updateSize.bind(this));
  }

  updateSize() {
    this.width = Math.min(this.drawDiv.offsetWidth, 500);
    this.height = Math.max(this.drawDiv.offsetHeight, 100);
    this.staticCanvas.width = this.width;
    this.staticCanvas.height = this.height;
    this.animatedCanvas.width = this.width;
    this.animatedCanvas.height = this.height;
    this.drawStatic();
  }

  setCurTime(timeS) {
    this.timeS = timeS;
  }

  setCurPos(positionRad) {
    this.positionRad = positionRad;
  }

  setCurSetpoint(setpoint) {
    this.setpoint = setpoint;
  }

  setCurOutput(output) {
    this.output = output;
  }

  setCurControlEffort(controlEffortVolts) {
    this.controlEffortVolts = controlEffortVolts;
  }

  drawStatic() {
    this.staticCanvasContext.clearRect(0, 0, this.width, this.height);

    this.drawStaticCustom();
  }

  drawDynamic() {
    this.animatedCanvasContext.clearRect(0, 0, this.width, this.height);

    this.drawDynamicCustom();
  }
}

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

    this.bonks = []; // Array to store pops
    this.bonkLifetime = 35; // Duration before pop fully fades (adjust as needed)
  }

  // Method to draw a jagged polygon (comic-book punch style) around the text
  drawJaggedPolygon(x, y, radius, numVertices) {
    var fixedRandList = [0.234,0,0.523,0,0.692,0,0.442,0,0.2643,0,0.5962,0,0.343,0,0.7954,0];
    const context = this.animatedCanvasContext;
    context.fillStyle = "#CCCC00"; // Color for the jagged polygon (e.g., bright yellow)
    context.strokeStyle = "#000000"; 
    context.lineWidth = 2;
    context.beginPath();

    for (let i = 0; i < numVertices; i++) {
      // Randomness to create jagged effect
      const angle = (i / numVertices) * Math.PI * 2;
      const randomOffset = fixedRandList[i%fixedRandList.length]*30; // Semi-jaggedness
      const xOffset = Math.cos(angle) * (radius + randomOffset);
      const yOffset = Math.sin(angle) * (radius + randomOffset);

      if (i === 0) {
        context.moveTo(x + xOffset, y + yOffset); // Start the polygon path
      } else {
        context.lineTo(x + xOffset, y + yOffset); // Add vertices to the path
      }
    }

    context.closePath();
    context.stroke()
    context.fill()
  }

  // Method to add a "pop" at a random location
  addBonk() {
    const x = Math.random() * (this.width * 0.2) + this.width * 0.4; // Random x within constraints
    const y = Math.random() * (this.height * 0.3) + this.height * 0.1; // Random y within constraints
    this.bonks.push({ x, y, transparency: 1.0 }); // Start fully opaque
  }

  // Method to update the transparency of pops and remove if too transparent
  updateBonks() {
    this.bonks = this.bonks.filter((pop) => {
      pop.transparency -= 1 / this.bonkLifetime; // Decrease transparency over time
      return pop.transparency > 0; // Keep pop if still visible
    });
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

    //Bonk
    if(this.position >= 0.98 && this.positionPrev < 0.98){
      this.addBonk()
    }
    this.updateBonks()

    this.bonks.forEach((bonk) => {
      this.animatedCanvasContext.globalAlpha = bonk.transparency; // Set transparency

      // Draw jagged "cutout" shape behind the text
      this.drawJaggedPolygon(bonk.x, bonk.y, 20, 17); // Radius and vertices for jagged shape

      // Set text style and draw "Bonk!"
      this.animatedCanvasContext.fillStyle = "#FF0000";
      this.animatedCanvasContext.font = "bold 16px Comic Sans MS"; // Halved font size
      this.animatedCanvasContext.fillText("Bonk!", bonk.x - 20, bonk.y + 5); // Adjust text position to center it

      this.animatedCanvasContext.globalAlpha = 1.0; // Reset globalAlpha after drawing
   });
    // Reset globalAlpha to default
    this.animatedCanvasContext.globalAlpha = 1.0;

    this.positionPrev = this.position

  }



}

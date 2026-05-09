class NewtonShootingWidget {
  constructor(divIdPrefix) {
    this.divIdPrefix = divIdPrefix;

    this.containerDiv = document.getElementById(divIdPrefix + "_container");
    this.visualizationDrawDiv = document.getElementById(divIdPrefix + "_viz");
    this.controlDrawDiv = document.getElementById(divIdPrefix + "_ctrls");

    if (!this.containerDiv || !this.visualizationDrawDiv || !this.controlDrawDiv) {
      console.error("[NewtonShootingWidget] Missing required DOM elements!");
      return;
    }

    // Use the Newton-capable visualization
    this.visualization = new NewtonShootingVisualization(this.visualizationDrawDiv);

    // Default values
    this.robotVelocityX = 0.0;
    this.robotVelocityY = 0.0;
    this.numIterations = 10;
    this.currentIteration = 1;
    this.projectileSpeed = 3.5;
    this.convergenceTolerance = 0.1;
    this.activeMode = "newton"; // "newton" | "fixed-point" | "simulation"

    this.visualization.setNumIterations(this.numIterations);
    this.visualization.setProjectileSpeed(this.projectileSpeed);
    this.visualization.setConvergenceTolerance(this.convergenceTolerance);

    this.buildControlTable(divIdPrefix);

    if (this.containerDiv) {
      var width = this.containerDiv.offsetWidth || this.containerDiv.clientWidth;
      if (width > 0) {
        this.containerDiv.style.height = width + "px";
      }
    }

    this.update();
  }

  buildControlTable(divIdPrefix) {
    this.controlDrawDiv.innerHTML = "";
    this.controlDrawDiv.style.display = "flex";
    this.controlDrawDiv.style.flexDirection = "column";
    this.controlDrawDiv.style.alignItems = "center";
    this.controlDrawDiv.style.gap = "6px";
    this.controlDrawDiv.style.padding = "6px 5px";
    this.controlDrawDiv.style.backgroundColor = "#f5f5f5";
    this.controlDrawDiv.style.borderTop = "1px solid #ddd";
    this.controlDrawDiv.style.width = "100%";
    this.controlDrawDiv.style.flexShrink = "0";
    this.controlDrawDiv.style.boxSizing = "border-box";
    this.controlDrawDiv.style.position = "relative";
    this.controlDrawDiv.style.zIndex = "10";

    // ── Row 1: Mode toggle ──────────────────────────────────────────────────
    var row1 = document.createElement("div");
    row1.style.cssText =
      "display: flex; align-items: center; justify-content: center; gap: 6px;";

    var simNewtonBtn = document.createElement("button");
    simNewtonBtn.innerHTML = "Simulation (Newton)";
    simNewtonBtn.style.cssText =
      "padding: 2px 10px; font-size: 12px; cursor: pointer;";
    simNewtonBtn.onclick = function () {
      this.setActiveMode("sim-newton");
    }.bind(this);
    row1.appendChild(simNewtonBtn);

    var simFixedBtn = document.createElement("button");
    simFixedBtn.innerHTML = "Simulation (Fixed-Point)";
    simFixedBtn.style.cssText =
      "padding: 2px 10px; font-size: 12px; cursor: pointer;";
    simFixedBtn.onclick = function () {
      this.setActiveMode("sim-fixed");
    }.bind(this);
    row1.appendChild(simFixedBtn);

    var newtonBtn = document.createElement("button");
    newtonBtn.innerHTML = "Fractal (Newton)";
    newtonBtn.style.cssText =
      "padding: 2px 10px; font-size: 12px; cursor: pointer;";
    newtonBtn.onclick = function () {
      this.setActiveMode("newton");
    }.bind(this);
    row1.appendChild(newtonBtn);

    var fixedBtn = document.createElement("button");
    fixedBtn.innerHTML = "Fractal (Fixed-Point)";
    fixedBtn.style.cssText =
      "padding: 2px 10px; font-size: 12px; cursor: pointer;";
    fixedBtn.onclick = function () {
      this.setActiveMode("fixed-point");
    }.bind(this);
    row1.appendChild(fixedBtn);

    this.simNewtonBtn = simNewtonBtn;
    this.simFixedBtn = simFixedBtn;
    this.newtonBtn = newtonBtn;
    this.fixedBtn = fixedBtn;
    this.controlDrawDiv.appendChild(row1);

    // ── Row 2: Iterations · Speed · Tolerance ───────────────────────────────
    var row2 = document.createElement("div");
    row2.style.cssText =
      "display: flex; align-items: center; justify-content: center; flex-wrap: nowrap; gap: 6px; font-size: 12px;";
    var controlBar = row2;

    // Iteration controls
    var iterationLabel = document.createElement("label");
    iterationLabel.innerHTML = "Iterations:";
    iterationLabel.style.cssText = "font-size: 12px; margin-right: 5px;";
    controlBar.appendChild(iterationLabel);

    var prevButton = document.createElement("button");
    prevButton.innerHTML = "◀";
    prevButton.style.cssText =
      "padding: 2px 8px; font-size: 12px; cursor: pointer;";
    prevButton.onclick = function () {
      if (this.currentIteration > 1) {
        this.currentIteration--;
        if (this.iterationInput)
          this.iterationInput.value = this.currentIteration;
        this.update();
      }
    }.bind(this);
    controlBar.appendChild(prevButton);

    var input = document.createElement("INPUT");
    input.setAttribute("type", "number");
    input.setAttribute("min", "1");
    input.setAttribute("max", this.numIterations.toString());
    input.setAttribute("step", "1");
    input.setAttribute("value", "1");
    input.style.cssText =
      "width: 50px; padding: 2px; font-size: 12px; text-align: center;";
    this.iterationInput = input;
    input.onchange = function (event) {
      var val = parseInt(event.target.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > this.numIterations) val = this.numIterations;
      this.currentIteration = val;
      event.target.value = val;
      this.update();
    }.bind(this);
    input.oninput = function (event) {
      var val = parseInt(event.target.value);
      if (!isNaN(val) && val >= 1 && val <= this.numIterations) {
        this.currentIteration = val;
        this.update();
      }
    }.bind(this);
    controlBar.appendChild(input);

    var nextButton = document.createElement("button");
    nextButton.innerHTML = "▶";
    nextButton.style.cssText =
      "padding: 2px 8px; font-size: 12px; cursor: pointer;";
    nextButton.onclick = function () {
      if (this.currentIteration < this.numIterations) {
        this.currentIteration++;
        if (this.iterationInput)
          this.iterationInput.value = this.currentIteration;
        this.update();
      }
    }.bind(this);
    controlBar.appendChild(nextButton);

    // Separator
    var separator = document.createElement("span");
    separator.innerHTML = "|";
    separator.style.cssText =
      "margin: 0 10px; color: #999; font-size: 12px;";
    controlBar.appendChild(separator);

    // Projectile speed
    var speedLabel = document.createElement("label");
    speedLabel.innerHTML = "Projectile Speed (m/s):";
    speedLabel.style.cssText = "font-size: 12px; margin-right: 5px;";
    controlBar.appendChild(speedLabel);

    var speedSlider = document.createElement("INPUT");
    speedSlider.setAttribute("type", "range");
    speedSlider.setAttribute("min", "0.1");
    speedSlider.setAttribute("max", "20.0");
    speedSlider.setAttribute("step", "0.1");
    speedSlider.setAttribute("value", this.projectileSpeed.toString());
    speedSlider.style.cssText =
      "width: 100px; height: 20px; margin: 0 3px; cursor: pointer;";

    var speedValueDisplay = document.createElement("span");
    speedValueDisplay.innerHTML = this.projectileSpeed.toFixed(1);
    speedValueDisplay.style.cssText =
      "font-size: 12px; min-width: 35px; text-align: center; display: inline-block;";

    this.speedSlider = speedSlider;
    this.speedValueDisplay = speedValueDisplay;

    speedSlider.oninput = function (event) {
      var val = parseFloat(event.target.value);
      if (!isNaN(val) && val >= 0.1 && val <= 20.0) {
        this.projectileSpeed = val;
        this.speedValueDisplay.innerHTML = val.toFixed(1);
        this.update();
      }
    }.bind(this);
    speedSlider.onchange = function (event) {
      var val = parseFloat(event.target.value);
      if (isNaN(val) || val < 0.1) val = 0.1;
      if (val > 20.0) val = 20.0;
      this.projectileSpeed = val;
      this.speedValueDisplay.innerHTML = val.toFixed(1);
      this.update();
    }.bind(this);

    controlBar.appendChild(speedSlider);
    controlBar.appendChild(speedValueDisplay);

    // Separator
    var separator2 = document.createElement("span");
    separator2.innerHTML = "|";
    separator2.style.cssText =
      "margin: 0 10px; color: #999; font-size: 12px;";
    controlBar.appendChild(separator2);

    // Tolerance
    var toleranceLabel = document.createElement("label");
    toleranceLabel.innerHTML = "Tolerance (m):";
    toleranceLabel.style.cssText = "font-size: 12px; margin-right: 5px;";
    controlBar.appendChild(toleranceLabel);

    var toleranceSlider = document.createElement("INPUT");
    toleranceSlider.setAttribute("type", "range");
    toleranceSlider.setAttribute("min", "0.01");
    toleranceSlider.setAttribute("max", "1.0");
    toleranceSlider.setAttribute("step", "0.01");
    toleranceSlider.setAttribute(
      "value",
      this.convergenceTolerance.toString()
    );
    toleranceSlider.style.cssText =
      "width: 100px; height: 20px; margin: 0 3px; cursor: pointer;";

    var toleranceValueDisplay = document.createElement("span");
    toleranceValueDisplay.innerHTML = this.convergenceTolerance.toFixed(2);
    toleranceValueDisplay.style.cssText =
      "font-size: 12px; min-width: 40px; text-align: center; display: inline-block;";

    this.toleranceSlider = toleranceSlider;
    this.toleranceValueDisplay = toleranceValueDisplay;

    toleranceSlider.oninput = function (event) {
      var val = parseFloat(event.target.value);
      if (!isNaN(val) && val >= 0.01 && val <= 1.0) {
        this.convergenceTolerance = val;
        this.toleranceValueDisplay.innerHTML = val.toFixed(2);
        this.update();
      }
    }.bind(this);
    toleranceSlider.onchange = function (event) {
      var val = parseFloat(event.target.value);
      if (isNaN(val) || val < 0.01) val = 0.01;
      if (val > 1.0) val = 1.0;
      this.convergenceTolerance = val;
      this.toleranceValueDisplay.innerHTML = val.toFixed(2);
      this.update();
    }.bind(this);

    controlBar.appendChild(toleranceSlider);
    controlBar.appendChild(toleranceValueDisplay);

    this.controlDrawDiv.appendChild(row2);

    // ── Flex layout (same as DynamicShootingWidget) ─────────────────────────
    if (this.visualizationDrawDiv.parentNode) {
      var flexGrid = this.visualizationDrawDiv.parentNode;
      if (flexGrid.classList && flexGrid.classList.contains("flex-grid")) {
        flexGrid.style.flexDirection = "column";
        flexGrid.style.alignItems = "stretch";
        flexGrid.style.height = "100%";
        flexGrid.style.width = "100%";
        flexGrid.style.margin = "0";
        flexGrid.style.padding = "0";
        flexGrid.style.boxSizing = "border-box";

        this.visualizationDrawDiv.style.minHeight = "0";
        this.visualizationDrawDiv.style.maxHeight = "none";
        this.visualizationDrawDiv.style.height = "auto";
        this.visualizationDrawDiv.style.flex = "1 1 auto";
        this.visualizationDrawDiv.style.overflow = "hidden";
        this.visualizationDrawDiv.style.position = "relative";
        this.visualizationDrawDiv.style.order = "1";
        this.visualizationDrawDiv.style.width = "100%";
        this.visualizationDrawDiv.style.boxSizing = "border-box";

        this.controlDrawDiv.style.flex = "0 0 auto";
        this.controlDrawDiv.style.order = "2";
      }
    }

    // Make container square
    if (this.containerDiv) {
      this.containerDiv.style.overflow = "hidden";
      this.containerDiv.style.width = "100%";

      var self = this;
      var makeSquare = function () {
        var w =
          self.containerDiv.offsetWidth || self.containerDiv.clientWidth;
        if (w > 0) {
          self.containerDiv.style.height = w + "px";
          if (self.visualization) {
            self.visualization.updateSize();
            self.update();
          }
        }
      };

      window.addEventListener("resize", makeSquare);
    }

    // Velocity callback for simulation-mode dragging
    this.visualization.setVelocityCallback(
      function (velX, velY) {
        this.robotVelocityX = velX;
        this.robotVelocityY = velY;
        this.update();
      }.bind(this)
    );

    // Set initial mode (matches first button)
    this.setActiveMode("sim-newton");
  }

  setActiveMode(mode) {
    this.activeMode = mode;

    // Update button styles
    this.simNewtonBtn.style.fontWeight =
      mode === "sim-newton" ? "bold" : "normal";
    this.simFixedBtn.style.fontWeight =
      mode === "sim-fixed" ? "bold" : "normal";
    this.newtonBtn.style.fontWeight = mode === "newton" ? "bold" : "normal";
    this.fixedBtn.style.fontWeight =
      mode === "fixed-point" ? "bold" : "normal";

    // Update visualization mode and solver method
    if (mode === "newton") {
      this.visualization.setSolverMethod("newton");
      this.visualization.setMode("fractal");
    } else if (mode === "fixed-point") {
      this.visualization.setSolverMethod("fixed-point");
      this.visualization.setMode("fractal");
    } else if (mode === "sim-fixed") {
      this.visualization.setSolverMethod("fixed-point");
      this.visualization.setMode("simulation");
    } else {
      // sim-newton (default)
      this.visualization.setSolverMethod("newton");
      this.visualization.setMode("simulation");
    }

    this.update();
  }

  update() {
    this.visualization.setRobotVelocity(
      this.robotVelocityX,
      this.robotVelocityY
    );
    this.visualization.setCurrentIteration(this.currentIteration);
    this.visualization.setNumIterations(this.numIterations);
    this.visualization.setProjectileSpeed(this.projectileSpeed);
    this.visualization.setConvergenceTolerance(this.convergenceTolerance);
    this.visualization.update();

    if (this.iterationInput) {
      this.iterationInput.value = this.currentIteration;
    }
    if (this.speedSlider) {
      this.speedSlider.value = this.projectileSpeed.toString();
    }
    if (this.speedValueDisplay) {
      this.speedValueDisplay.innerHTML = this.projectileSpeed.toFixed(1);
    }
    if (this.toleranceSlider) {
      this.toleranceSlider.value = this.convergenceTolerance.toString();
    }
    if (this.toleranceValueDisplay) {
      this.toleranceValueDisplay.innerHTML =
        this.convergenceTolerance.toFixed(2);
    }
  }
}

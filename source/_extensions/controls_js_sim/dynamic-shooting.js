class DynamicShootingWidget {
  constructor(divIdPrefix) {
    this.divIdPrefix = divIdPrefix;
    
    this.containerDiv = document.getElementById(divIdPrefix + "_container");
    this.visualizationDrawDiv = document.getElementById(divIdPrefix + "_viz");
    this.controlDrawDiv = document.getElementById(divIdPrefix + "_ctrls");
    
    if (!this.containerDiv || !this.visualizationDrawDiv || !this.controlDrawDiv) {
      console.error('[DynamicShootingWidget] Missing required DOM elements!');
      return;
    }
    
    // Initialize visualization
    this.visualization = new DynamicShootingVisualization(this.visualizationDrawDiv);
    
    // Default values
    this.robotVelocityX = 0.0;
    this.robotVelocityY = 0.0;
    this.numIterations = 10;  // Number of iterations to compute and display
    this.currentIteration = 1;  // Which iteration to highlight (simulation) / envelope N (fractal)
    this.projectileSpeed = 3.5; // m/s
    this.convergenceTolerance = 0.1; // meters
    this.mode = "simulation";  // "simulation" | "fractal"
    
    // Set initial values on visualization
    this.visualization.setNumIterations(this.numIterations);
    this.visualization.setProjectileSpeed(this.projectileSpeed);
    this.visualization.setConvergenceTolerance(this.convergenceTolerance);
    
    // Build control table
    this.buildControlTable(divIdPrefix);
    
    // Make container square immediately
    if (this.containerDiv) {
      const width = this.containerDiv.offsetWidth || this.containerDiv.clientWidth;
      if (width > 0) {
        this.containerDiv.style.height = width + "px";
      }
    }
    
    // Initial update - synchronous
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

    // Row 1: Mode toggle (Simulation, Fractal iterations, Fractal stability)
    const row1 = document.createElement("div");
    row1.style.cssText = "display: flex; align-items: center; justify-content: center; gap: 6px;";
    const simBtn = document.createElement("button");
    simBtn.innerHTML = "Simulation";
    simBtn.setAttribute("id", divIdPrefix + "_mode_sim");
    simBtn.style.cssText = "padding: 2px 10px; font-size: 12px; cursor: pointer;";
    simBtn.onclick = function() { this.setMode("simulation"); }.bind(this);
    row1.appendChild(simBtn);
    const fractIterBtn = document.createElement("button");
    fractIterBtn.innerHTML = "Fractal (Iterations)";
    fractIterBtn.setAttribute("id", divIdPrefix + "_mode_fractal_iter");
    fractIterBtn.style.cssText = "padding: 2px 10px; font-size: 12px; cursor: pointer;";
    fractIterBtn.onclick = function() {
      this.visualization.setFractalVariant("convergence");
      this.setMode("fractal");
      this.refreshModeButtons();
    }.bind(this);
    row1.appendChild(fractIterBtn);
    const fractInterBtn = document.createElement("button");
    fractInterBtn.innerHTML = "Fractal (Stability)";
    fractInterBtn.setAttribute("id", divIdPrefix + "_mode_fractal_inter");
    fractInterBtn.style.cssText = "padding: 2px 10px; font-size: 12px; cursor: pointer;";
    fractInterBtn.onclick = function() {
      this.visualization.setFractalVariant("stability");
      this.setMode("fractal");
      this.refreshModeButtons();
    }.bind(this);
    row1.appendChild(fractInterBtn);
    this.modeSimBtn = simBtn;
    this.modeFractalIterBtn = fractIterBtn;
    this.modeFractalInterBtn = fractInterBtn;
    this.controlDrawDiv.appendChild(row1);

    // Row 2: Iterations, speed, tolerance (same controls in both modes)
    const row2 = document.createElement("div");
    row2.style.cssText = "display: flex; align-items: center; justify-content: center; flex-wrap: nowrap; gap: 6px; font-size: 12px;";
    const controlBar = row2;

    const iterationLabel = document.createElement("label");
    iterationLabel.innerHTML = "Iterations:";
    iterationLabel.style.cssText = "font-size: 12px; margin-right: 5px;";
    controlBar.appendChild(iterationLabel);
    const prevButton = document.createElement("button");
    prevButton.innerHTML = "◀";
    prevButton.style.cssText = "padding: 2px 8px; font-size: 12px; cursor: pointer;";
    prevButton.onclick = function() {
      if (this.currentIteration > 1) {
        this.currentIteration--;
        if (this.iterationInput) this.iterationInput.value = this.currentIteration;
        this.update();
      }
    }.bind(this);
    controlBar.appendChild(prevButton);
    const input = document.createElement("INPUT");
    input.setAttribute("type", "number");
    input.setAttribute("min", "1");
    input.setAttribute("max", this.numIterations.toString());
    input.setAttribute("step", "1");
    input.setAttribute("value", "1");
    input.setAttribute("id", divIdPrefix + "_iteration");
    input.style.cssText = "width: 50px; padding: 2px; font-size: 12px; text-align: center;";
    this.iterationInput = input;
    input.onchange = function (event) {
      let val = parseInt(event.target.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > this.numIterations) val = this.numIterations;
      this.currentIteration = val;
      event.target.value = val;
      this.update();
    }.bind(this);
    input.oninput = function (event) {
      let val = parseInt(event.target.value);
      if (!isNaN(val) && val >= 1 && val <= this.numIterations) {
        this.currentIteration = val;
        this.update();
      }
    }.bind(this);
    controlBar.appendChild(input);
    const nextButton = document.createElement("button");
    nextButton.innerHTML = "▶";
    nextButton.style.cssText = "padding: 2px 8px; font-size: 12px; cursor: pointer;";
    nextButton.onclick = function() {
      if (this.currentIteration < this.numIterations) {
        this.currentIteration++;
        if (this.iterationInput) this.iterationInput.value = this.currentIteration;
        this.update();
      }
    }.bind(this);
    controlBar.appendChild(nextButton);

    this.refreshModeButtons = function() {
      const mode = this.mode;
      const variant = this.visualization.fractalVariant || "convergence";
      this.modeSimBtn.style.fontWeight = mode === "simulation" ? "bold" : "normal";
      this.modeFractalIterBtn.style.fontWeight = (mode === "fractal" && variant === "convergence") ? "bold" : "normal";
      this.modeFractalInterBtn.style.fontWeight = (mode === "fractal" && variant === "stability") ? "bold" : "normal";
    }.bind(this);

    this.setMode = function(mode) {
      this.mode = mode;
      this.visualization.setMode(mode);
      this.refreshModeButtons();
      this.update();
    }.bind(this);

    // Add separator
    const separator = document.createElement("span");
    separator.innerHTML = "|";
    separator.style.cssText = "margin: 0 10px; color: #999; font-size: 12px;";
    controlBar.appendChild(separator);
    
    // Projectile speed label
    const speedLabel = document.createElement("label");
    speedLabel.innerHTML = "Projectile Speed (m/s):";
    speedLabel.style.cssText = "font-size: 12px; margin-right: 5px;";
    controlBar.appendChild(speedLabel);
    
    // Projectile speed slider
    const speedSlider = document.createElement("INPUT");
    speedSlider.setAttribute("type", "range");
    speedSlider.setAttribute("min", "0.1");
    speedSlider.setAttribute("max", "20.0");
    speedSlider.setAttribute("step", "0.1");
    speedSlider.setAttribute("value", this.projectileSpeed.toString());
    speedSlider.setAttribute("id", divIdPrefix + "_projectile_speed");
    speedSlider.style.cssText = "width: 100px; height: 20px; margin: 0 3px; cursor: pointer;";
    
    // Value display
    const speedValueDisplay = document.createElement("span");
    speedValueDisplay.innerHTML = this.projectileSpeed.toFixed(1);
    speedValueDisplay.style.cssText = "font-size: 12px; min-width: 35px; text-align: center; display: inline-block;";
    
    // Store references
    this.speedSlider = speedSlider;
    this.speedValueDisplay = speedValueDisplay;
    
    speedSlider.oninput = function (event) {
      let val = parseFloat(event.target.value);
      if (!isNaN(val) && val >= 0.1 && val <= 20.0) {
        this.projectileSpeed = val;
        this.speedValueDisplay.innerHTML = val.toFixed(1);
        this.update();
      }
    }.bind(this);
    
    speedSlider.onchange = function (event) {
      let val = parseFloat(event.target.value);
      if (isNaN(val) || val < 0.1) val = 0.1;
      if (val > 20.0) val = 20.0;
      this.projectileSpeed = val;
      this.speedValueDisplay.innerHTML = val.toFixed(1);
      this.update();
    }.bind(this);
    
    controlBar.appendChild(speedSlider);
    controlBar.appendChild(speedValueDisplay);
    
    // Add separator
    const separator2 = document.createElement("span");
    separator2.innerHTML = "|";
    separator2.style.cssText = "margin: 0 10px; color: #999; font-size: 12px;";
    controlBar.appendChild(separator2);
    
    // Tolerance label
    const toleranceLabel = document.createElement("label");
    toleranceLabel.innerHTML = "Tolerance (m):";
    toleranceLabel.style.cssText = "font-size: 12px; margin-right: 5px;";
    controlBar.appendChild(toleranceLabel);
    
    // Tolerance slider
    const toleranceSlider = document.createElement("INPUT");
    toleranceSlider.setAttribute("type", "range");
    toleranceSlider.setAttribute("min", "0.01");
    toleranceSlider.setAttribute("max", "1.0");
    toleranceSlider.setAttribute("step", "0.01");
    toleranceSlider.setAttribute("value", this.convergenceTolerance.toString());
    toleranceSlider.setAttribute("id", divIdPrefix + "_tolerance");
    toleranceSlider.style.cssText = "width: 100px; height: 20px; margin: 0 3px; cursor: pointer;";
    
    // Value display
    const toleranceValueDisplay = document.createElement("span");
    toleranceValueDisplay.innerHTML = this.convergenceTolerance.toFixed(2);
    toleranceValueDisplay.style.cssText = "font-size: 12px; min-width: 40px; text-align: center; display: inline-block;";
    
    // Store references
    this.toleranceSlider = toleranceSlider;
    this.toleranceValueDisplay = toleranceValueDisplay;
    
    toleranceSlider.oninput = function (event) {
      let val = parseFloat(event.target.value);
      if (!isNaN(val) && val >= 0.01 && val <= 1.0) {
        this.convergenceTolerance = val;
        this.toleranceValueDisplay.innerHTML = val.toFixed(2);
        this.update();
      }
    }.bind(this);
    
    toleranceSlider.onchange = function (event) {
      let val = parseFloat(event.target.value);
      if (isNaN(val) || val < 0.01) val = 0.01;
      if (val > 1.0) val = 1.0;
      this.convergenceTolerance = val;
      this.toleranceValueDisplay.innerHTML = val.toFixed(2);
      this.update();
    }.bind(this);
    
    controlBar.appendChild(toleranceSlider);
    controlBar.appendChild(toleranceValueDisplay);

    this.controlDrawDiv.appendChild(row2);
    
    // Control bar is already in the right place (controlDrawDiv is in the flex-grid)
    // Make sure the visualization div doesn't expand into the control area
    if (this.visualizationDrawDiv.parentNode) {
      // Ensure the parent flex-grid uses column layout if needed
      const flexGrid = this.visualizationDrawDiv.parentNode;
      if (flexGrid.classList && flexGrid.classList.contains('flex-grid')) {
        // Make flex-grid use column layout to stack vertically
        flexGrid.style.flexDirection = "column";
        flexGrid.style.alignItems = "stretch"; // Stretch children to full width
        flexGrid.style.height = "100%"; // Fill container height
        flexGrid.style.width = "100%"; // Fill container width
        flexGrid.style.margin = "0"; // Remove default margin
        flexGrid.style.padding = "0"; // Remove padding
        flexGrid.style.boxSizing = "border-box"; // Include borders in size
        
        // Override the .col class constraints - let it grow to fill available space
        this.visualizationDrawDiv.style.minHeight = "0"; // Remove min-height constraint
        this.visualizationDrawDiv.style.maxHeight = "none"; // Remove max-height constraint
        this.visualizationDrawDiv.style.height = "auto"; // Let it grow
        this.visualizationDrawDiv.style.flex = "1 1 auto"; // Grow to fill available space
        this.visualizationDrawDiv.style.overflow = "hidden"; // Prevent overflow
        this.visualizationDrawDiv.style.position = "relative"; // Ensure proper positioning
        this.visualizationDrawDiv.style.order = "1"; // Ensure it appears before controls
        this.visualizationDrawDiv.style.width = "100%"; // Full width
        this.visualizationDrawDiv.style.boxSizing = "border-box"; // Include padding in size
        
        // Ensure control div is properly positioned
        this.controlDrawDiv.style.flex = "0 0 auto"; // Don't grow/shrink
        this.controlDrawDiv.style.order = "2"; // Ensure it appears after visualization
      }
    }
    
    // Make the container div square based on its width
    // This ensures the bounding box is square and the visualization can fill it
    if (this.containerDiv) {
      this.containerDiv.style.overflow = "hidden"; // Prevent container overflow
      this.containerDiv.style.width = "100%"; // Full width
      
      // Make container square: set height to match width
      const makeSquare = () => {
        const width = this.containerDiv.offsetWidth || this.containerDiv.clientWidth;
        if (width > 0) {
          this.containerDiv.style.height = width + "px";
          if (this.visualization) {
            this.visualization.updateSize();
            this.update();
          }
        }
      };
      
      // Update on resize
      window.addEventListener("resize", makeSquare);
    }
    
    // Set up velocity callback for drag-to-update
    this.visualization.setVelocityCallback((velX, velY) => {
      this.robotVelocityX = velX;
      this.robotVelocityY = velY;
      this.update();
    });
  }
  
  update() {
    this.visualization.setRobotVelocity(this.robotVelocityX, this.robotVelocityY);
    this.visualization.setCurrentIteration(this.currentIteration);
    this.visualization.setNumIterations(this.numIterations);
    this.visualization.setProjectileSpeed(this.projectileSpeed);
    this.visualization.setConvergenceTolerance(this.convergenceTolerance);
    this.visualization.update();
    if (this.iterationInput) {
      this.iterationInput.value = this.currentIteration;
    }
    // Sync speed slider and value display
    if (this.speedSlider) {
      this.speedSlider.value = this.projectileSpeed.toString();
    }
    if (this.speedValueDisplay) {
      this.speedValueDisplay.innerHTML = this.projectileSpeed.toFixed(1);
    }
    
    // Sync tolerance slider and value display
    if (this.toleranceSlider) {
      this.toleranceSlider.value = this.convergenceTolerance.toString();
    }
    if (this.toleranceValueDisplay) {
      this.toleranceValueDisplay.innerHTML = this.convergenceTolerance.toFixed(2);
    }
  }
}

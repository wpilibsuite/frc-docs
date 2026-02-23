// Unified coordinate conversion system
class CoordinateConverter {
  constructor(canvasWidth, canvasHeight, fieldWidth, fieldHeight) {
    this.updateDimensions(canvasWidth, canvasHeight, fieldWidth, fieldHeight);
  }
  
  updateDimensions(canvasWidth, canvasHeight, fieldWidth, fieldHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.fieldWidth = fieldWidth;
    this.fieldHeight = fieldHeight;
    
    // Calculate scale to fit field in canvas (maintains aspect ratio)
    this.scale = Math.min(
      this.canvasWidth / this.fieldWidth,
      this.canvasHeight / this.fieldHeight
    );
    
    // Calculate center of canvas
    this.centerX = this.canvasWidth / 2;
    this.centerY = this.canvasHeight / 2;
    
    // Field center in world coordinates
    this.fieldCenterX = this.fieldWidth / 2;
    this.fieldCenterY = this.fieldHeight / 2;
  }
  
  // Convert world coordinates (meters) to canvas coordinates (pixels)
  worldToCanvas(worldX, worldY) {
    const canvasX = this.centerX + (worldX - this.fieldCenterX) * this.scale;
    const canvasY = this.centerY - (worldY - this.fieldCenterY) * this.scale; // Flip Y axis
    return { x: canvasX, y: canvasY };
  }
  
  // Convert canvas coordinates (pixels) to world coordinates (meters)
  canvasToWorld(canvasX, canvasY) {
    const worldX = this.fieldCenterX + (canvasX - this.centerX) / this.scale;
    const worldY = this.fieldCenterY - (canvasY - this.centerY) / this.scale; // Flip Y axis
    return { x: worldX, y: worldY };
  }
  
  // Convert world distance (meters) to canvas distance (pixels)
  worldDistanceToPixels(worldDistance) {
    return worldDistance * this.scale;
  }
  
  // Convert canvas distance (pixels) to world distance (meters)
  pixelsToWorldDistance(pixelDistance) {
    return pixelDistance / this.scale;
  }
  
  // Get the current scale factor
  getScale() {
    return this.scale;
  }
}

// Drawing utilities for common operations
class DrawingUtils {
  // Draw a label with perpendicular offset from a line
  static drawLabelAlongVector(ctx, startX, startY, endX, endY, text, 
                              positionAlongVector = 0.5, perpendicularOffset = 20, 
                              fontSize = "10px", fontFamily = "Arial", color = "#000000") {
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    if (len === 0) return;
    
    // Calculate position along vector
    const clampedPosition = Math.min(1.0, Math.max(0.0, positionAlongVector));
    const labelX = startX + dx * clampedPosition;
    const labelY = startY + dy * clampedPosition;
    
    // Calculate perpendicular offset
    const perpX = -dy / len * perpendicularOffset;
    const perpY = dx / len * perpendicularOffset;
    
    // Draw text
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.fillText(text, labelX + perpX, labelY + perpY);
    ctx.restore();
  }
  
  // Draw a circle with optional label
  static drawCircle(ctx, centerX, centerY, radius, fillColor = null, 
                    strokeColor = "#000000", lineWidth = 2, label = null, labelOffset = 25) {
    ctx.save();
    
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    if (label) {
      ctx.fillStyle = strokeColor;
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(label, centerX, centerY - labelOffset);
    }
    
    ctx.restore();
  }
  
  // Draw a line with optional arrowhead
  static drawLine(ctx, startX, startY, endX, endY, color = "#000000", 
                  lineWidth = 2, arrowhead = false, arrowheadLength = 10) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    if (arrowhead) {
      const angle = Math.atan2(endY - startY, endX - startX);
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - arrowheadLength * Math.cos(angle - Math.PI/7),
                 endY - arrowheadLength * Math.sin(angle - Math.PI/7));
      ctx.lineTo(endX - arrowheadLength * Math.cos(angle + Math.PI/7),
                 endY - arrowheadLength * Math.sin(angle + Math.PI/7));
      ctx.lineTo(endX, endY);
      ctx.lineTo(endX - arrowheadLength * Math.cos(angle - Math.PI/7),
                 endY - arrowheadLength * Math.sin(angle - Math.PI/7));
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  // Calculate iteration-based alpha (fade for previous iterations)
  static getIterationAlpha(iterationIndex, currentIterationIndex, baseAlpha = 1.0, fadeFactor = 0.5) {
    if (iterationIndex === currentIterationIndex) {
      return baseAlpha;
    }
    const iterationsBack = currentIterationIndex - iterationIndex;
    return baseAlpha * Math.pow(fadeFactor, iterationsBack);
  }
  
  // Calculate iteration-based scale (shrinks for previous iterations)
  static getIterationScale(iterationIndex, baseScale = 1.0, shrinkFactor = 0.7) {
    return baseScale * Math.pow(shrinkFactor, iterationIndex);
  }
}

class DynamicShootingVisualization extends BaseVisualization {
  constructor(div_in) {
    super(div_in);
    
    // Field dimensions (in meters, for top-down view)
    this.fieldWidth = 15.0;  // meters
    this.fieldHeight = 15.0; // meters
    
    // Initialize coordinate converter (will be updated in updateSize)
    this.coords = new CoordinateConverter(600, 600, this.fieldWidth, this.fieldHeight);
    
    // Robot and target positions (in meters)
    // In top-down view: x is horizontal (left-right), y is vertical (forward-backward)
    // Centered in 15m x 15m field
    this.robotPos = { x: 7.5, y: 4.0 };
    this.targetPos = { x: 7.5, y: 11.0 };  // Vertically offset (y-direction in top-down view)
    
    // Robot velocity (horizontal, can be positive or negative)
    this.robotVelocity = { x: 0.0, y: 0.0 };
    
    // Iteration data
    this.currentIteration = 1;  // Which iteration to highlight/display (1 to numIterations)
    this.numIterations = 10;  // Number of iterations to compute and display
    this.iterations = [];  // Array of iteration data
    
    // Projectile speed for TOF calculation
    this.projectileSpeed = 3.5; // m/s
    
    // Region of convergence data
    // Stored as polar function: angle (degrees) -> max velocity (m/s) before convergence fails
    // Recomputed whenever currentIteration or projectileSpeed changes
    this.regionOfConvergence = null; // Array of {angle: degrees, maxVelocity: m/s}
    
    // Target/goal size for tolerance calculation
    // Target is drawn with 30 pixel radius. We'll calculate the actual world size
    // based on the canvas scale, but we need to wait until canvas is sized.
    // For now, use a conservative estimate that will be updated in updateSize()
    this.targetPixelRadius = 30; // pixels
    this.targetRadius = null; // Will be calculated in world coordinates
    this.convergenceTolerance = 0.1; // Default tolerance in meters (user-configurable)
    
    // Drag state for velocity vector
    this.draggingVelocity = false;
    this.velocityCallback = null; // Callback to update velocity in widget

    // Mode: "simulation" (interactive velocity + shot) or "fractal" (heatmap + geodesic + envelope only)
    this.mode = "simulation";
    // Fractal/heatmap state (velocity-space view)
    this.heatmapData = null;
    this.fractalVariant = "convergence"; // "convergence" | "stability"
    this.heatmapMaxVel = 20.0;
    this.heatmapGrid = 200;
    this.iterationCap = 1000;
    this.heatmapVelocityScale = 1;
    this.heatmapCenterX = 0;
    this.heatmapCenterY = 0;
    
    // Add mouse event handlers for dragging velocity vector
    this.animatedCanvas.addEventListener("mousedown", event => this.handleMouseDown(event));
    this.animatedCanvas.addEventListener("mousemove", event => this.handleMouseMove(event));
    this.animatedCanvas.addEventListener("mouseup", event => this.handleMouseUp(event));
    
    // Force initial size update and render
    this.updateSize();
    
    // Compute region of convergence once at startup
    this.computeRegionOfConvergence();
  }
  
  setVelocityCallback(callback) {
    this.velocityCallback = callback;
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    if (this.mode === "fractal") {
      this.computeRegionOfConvergence();
      this.computeHeatmap();
      this.drawStatic();
      this.drawDynamic();
    }
  }

  setFractalVariant(variant) {
    if (this.fractalVariant === variant) return;
    this.fractalVariant = variant;
    if (this.mode === "fractal") {
      this.scheduleFractalUpdate();
    }
  }

  // Same scale as simulation: velocity space centered at robot, using reference TOF * field scale
  velocityToCanvas(vx, vy) {
    const robotCanvas = this.coords.worldToCanvas(this.robotPos.x, this.robotPos.y);
    const velScale = this.getReferenceTOF() * this.coords.getScale();
    return {
      x: robotCanvas.x + vx * velScale,
      y: robotCanvas.y - vy * velScale
    };
  }

  // Dark green (few iterations) → white (many iterations / cap), logarithmic scaling
  static iterationToColor(k, cap) {
    if (k < 0) return null; // outside reachability: caller should use background
    if (cap <= 1) return "rgb(0, 68, 27)";
    const t = Math.log(Math.max(1, k)) / Math.log(cap); // 0 = 1 iteration, 1 = cap iterations
    const r = Math.round(0 + t * 255);
    const g = Math.round(68 + t * 187);
    const b = Math.round(27 + t * 228);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  // Orange heatmap: 0 (good, geodesic) → 1 (bad). value in [0, 1] or NaN for outside reachability.
  static interactionToColor(value) {
    if (value !== value || value < 0) return null; // NaN or outside reachability
    const t = Math.max(0, Math.min(1, value));
    const r = Math.round(140 + t * 115);
    const g = Math.round(70 + t * 85);
    const b = Math.round(0 + t * 50);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  // Compute the visible velocity bounds from the canvas geometry
  getVisibleVelocityBounds() {
    const robotCanvas = this.coords.worldToCanvas(this.robotPos.x, this.robotPos.y);
    const velScale = this.getReferenceTOF() * this.coords.getScale();
    if (velScale <= 0) return { vxMin: -10, vxMax: 10, vyMin: -10, vyMax: 10 };
    const vxMin = -(robotCanvas.x) / velScale;
    const vxMax = (this.width - robotCanvas.x) / velScale;
    const vyMin = -(this.height - robotCanvas.y) / velScale;
    const vyMax = (robotCanvas.y) / velScale;
    return { vxMin, vxMax, vyMin, vyMax };
  }

  computeHeatmap() {
    if (!this.robotPos || !this.targetPos) return;
    this.computeReachabilityBoundary();
    const cap = this.iterationCap;
    const n = this.heatmapGrid;
    const bounds = this.getVisibleVelocityBounds();
    this.heatmapBounds = bounds;
    const stepX = (bounds.vxMax - bounds.vxMin) / n;
    const stepY = (bounds.vyMax - bounds.vyMin) / n;
    const data = [];
    const variant = this.fractalVariant || "convergence";
    for (let j = 0; j < n; j++) {
      const row = [];
      for (let i = 0; i < n; i++) {
        const vx = bounds.vxMin + (i + 0.5) * stepX;
        const vy = bounds.vyMax - (j + 0.5) * stepY;
        if (!this.isInsideReachability(vx, vy)) {
          row.push(variant === "stability" ? NaN : -1);
          continue;
        }
        const vel = { x: vx, y: vy };
        if (variant === "stability") {
          const phi = this.getInteractionIndicator(vel);
          row.push(phi);
        } else {
          const k = this.getIterationsToConvergence(vel, cap);
          row.push(k);
        }
      }
      data.push(row);
    }
    this.heatmapData = data;
  }
  
  getCursorPosition(event) {
    const rect = this.animatedCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  }
  
  // Fixed reference projectile speed for velocity vector visual scaling
  // The velocity vector should maintain a constant visual representation
  static REFERENCE_PROJECTILE_SPEED = 3.5; // m/s
  
  // Get reference TOF for velocity vector scaling (using fixed reference speed)
  // This keeps the velocity vector's visual representation constant
  getReferenceTOF() {
    if (!this.robotPos || !this.targetPos) {
      return 1.0; // Fallback if positions not initialized
    }
    const dx = this.targetPos.x - this.robotPos.x;
    const dy = this.targetPos.y - this.robotPos.y;
    const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
    return distanceToTarget / DynamicShootingVisualization.REFERENCE_PROJECTILE_SPEED;
  }
  
  // Get actual TOF using current projectile speed (for calculations, not visual scaling)
  getActualTOF() {
    if (!this.robotPos || !this.targetPos) {
      return 1.0; // Fallback if positions not initialized
    }
    const dx = this.targetPos.x - this.robotPos.x;
    const dy = this.targetPos.y - this.robotPos.y;
    const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
    return distanceToTarget / this.projectileSpeed;
  }
  
  // Calculate velocity vector endpoint in canvas coordinates
  // Uses reference TOF to keep visual representation constant
  getVelocityVectorEndpoint(robotCanvasPos) {
    const velScale = this.getReferenceTOF(); // Use fixed reference, not actual projectile speed
    const scale = this.coords.getScale();
    return {
      x: robotCanvasPos.x + this.robotVelocity.x * velScale * scale,
      y: robotCanvasPos.y - this.robotVelocity.y * velScale * scale // Flip Y
    };
  }
  
  isNearVelocityTip(mouseLocation) {
    if (!this.robotPos || !this.targetPos) {
      return false;
    }
    const robotCanvas = this.coords.worldToCanvas(this.robotPos.x, this.robotPos.y);
    const velEnd = this.getVelocityVectorEndpoint(robotCanvas);
    
    const dx = mouseLocation.x - velEnd.x;
    const dy = mouseLocation.y - velEnd.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    return dist < 20; // 20 pixel tolerance
  }
  
  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const clickLocation = this.getCursorPosition(event);
    
    if (this.isNearVelocityTip(clickLocation)) {
      this.draggingVelocity = true;
    }
  }
  
  handleMouseMove(event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.draggingVelocity) {
      if (!this.robotPos || !this.targetPos) {
        return; // Not initialized yet
      }
      const mouseLocation = this.getCursorPosition(event);
      const robotCanvas = this.coords.worldToCanvas(this.robotPos.x, this.robotPos.y);
      
      // Calculate vector from robot to mouse in canvas coordinates
      const dx = mouseLocation.x - robotCanvas.x;
      const dy = -(mouseLocation.y - robotCanvas.y); // Flip Y
      
      // Calculate length in canvas coordinates
      const canvasLength = Math.sqrt(dx * dx + dy * dy);
      
      if (canvasLength > 0) {
        // Get the direction from the mouse position
        const normalizedDx = dx / canvasLength;
        const normalizedDy = dy / canvasLength;
        
        // Convert canvas length to world coordinates
        const worldLength = this.coords.pixelsToWorldDistance(canvasLength);
        
        // We want the velocity vector to represent displacement over reference TOF
        // displacement = referenceTOF * |velocity|, so |velocity| = displacement / referenceTOF
        // Use reference TOF so the visual representation stays consistent
        const referenceTOF = this.getReferenceTOF();
        const velMag = worldLength / Math.max(referenceTOF, 0.1); // Avoid division by zero
        
        // Set velocity with correct direction and magnitude
        const worldVel = {
          x: normalizedDx * velMag,
          y: normalizedDy * velMag
        };
        
        // Update velocity
        this.robotVelocity = worldVel;
        
        // Notify widget to update
        if (this.velocityCallback) {
          this.velocityCallback(worldVel.x, worldVel.y);
        }
        
        this.update();
      }
    }
  }
  
  handleMouseUp(event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.draggingVelocity = false;
  }
  
  // Calculate time-of-flight directly from distance and projectile speed
  calculateTOF(relativePos) {
    // Extract x and y from relativePos (it uses x/y, not dx/dy)
    const dx = relativePos.x !== undefined ? relativePos.x : (relativePos.dx !== undefined ? relativePos.dx : 0);
    const dy = relativePos.y !== undefined ? relativePos.y : (relativePos.dy !== undefined ? relativePos.dy : 0);
    
    // Validate inputs
    if (isNaN(dx) || isNaN(dy)) {
      console.error('[DynamicShooting] Invalid input to calculateTOF:', { relativePos, dx, dy });
      return 1.0;
    }
    
    // Calculate distance
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate TOF: distance / projectile speed
    const tof = distance / this.projectileSpeed;
    
    if (isNaN(tof) || !isFinite(tof)) {
      console.error('[DynamicShooting] Invalid TOF result!', { distance, projectileSpeed: this.projectileSpeed });
      return 1.0; // Fallback
    }
    
    return tof;
  }
  
  // Run the dynamic shooting recursion algorithm iterations
  // Returns an array of iteration data objects.
  // When allowEarlyTermination is false, never break on convergence (used for stability heatmap).
  runIterations(robotVel, maxIter, allowEarlyTermination = true) {
    const iterations = [];
    
    // Guard against uninitialized positions
    if (!this.robotPos || !this.targetPos) {
      return iterations;
    }
    
    // Calculate initial relative position (target relative to robot)
    const initialRelativePos = {
      x: this.targetPos.x - this.robotPos.x,
      y: this.targetPos.y - this.robotPos.y
    };
    
    // Start with initial relative position
    let currentRelativePos = { ...initialRelativePos };
    let prevTOF = null;
    
    for (let iter = 0; iter < maxIter; iter++) {
      // Step 1: Calculate tau_prev (previous iteration's TOF, or current on first iteration)
      // On first iteration, we use the TOF from the current relative position
      let tau_prev;
      if (prevTOF !== null) {
        tau_prev = prevTOF;
      } else {
        // First iteration: calculate TOF from current relative position
        tau_prev = this.calculateTOF(currentRelativePos);
      }
      
      // Step 2: Calculate virtual target offset using tau_prev
      // The virtual target is offset opposite to the robot velocity direction
      // Formula: offset = tau_prev * (-vel) = tau_prev * (-robotVel)
      const virtualTargetOffset = {
        x: tau_prev * (-robotVel.x),
        y: tau_prev * (-robotVel.y)
      };
      
      // Step 3: Calculate virtual target position
      const virtualTargetPos = {
        x: this.targetPos.x + virtualTargetOffset.x,
        y: this.targetPos.y + virtualTargetOffset.y
      };
      
      // Step 4: Calculate tau (new TOF) from the virtual target position relative to robot
      const virtualTargetRelativePos = {
        x: virtualTargetPos.x - this.robotPos.x,
        y: virtualTargetPos.y - this.robotPos.y
      };
      const tau = this.calculateTOF(virtualTargetRelativePos);
      
      // Step 5: Calculate actual trajectory landing position
      // The actual trajectory shows where the projectile lands when aiming at virtual target
      // During flight time 'tau', the robot moves by robotVel * tau
      // The projectile, in robot-relative coordinates, goes toward virtual target
      // In world coordinates, the landing position accounts for robot movement:
      //   actualLanding = virtualTargetPos + robotVel * tau
      const actualTrajectoryEnd = {
        x: virtualTargetPos.x + robotVel.x * tau,
        y: virtualTargetPos.y + robotVel.y * tau
      };
      
      // Store iteration data
      iterations.push({
        iteration: iter + 1,
        relativePos: { ...currentRelativePos },
        tau: tau,
        virtualTargetPos: virtualTargetPos,
        virtualTargetOffset: virtualTargetOffset,
        actualTrajectoryEnd: actualTrajectoryEnd,
        tau_prev: tau_prev
      });
      
      if (prevTOF !== null) {
        const step = Math.abs(tau - prevTOF);
        if (allowEarlyTermination && step < 0.01) break;
        if (!allowEarlyTermination && step <= 1e-12 * Math.max(1, Math.abs(tau))) break;
      }
      
      // Update for next iteration: 
      // The new relative position to look up is the virtual target position relative to robot
      // This accounts for where the target will be when the projectile arrives
      currentRelativePos = {
        x: virtualTargetPos.x - this.robotPos.x,
        y: virtualTargetPos.y - this.robotPos.y
      };
      
      prevTOF = tau;
    }
    
    return iterations;
  }
  
  // Contraction factor |φ'| from the last two fixed-point steps after n iterations.
  // Uses 1 + n (n = this.currentIteration) so the converged-shot trace aligns with the
  // iteration control.
  // Returns value in [0, 1] (0 = geodesic-like, 1 = bad). Used for stability heatmap.
  getInteractionIndicator(robotVel) {
    const maxIter = 1 + this.currentIteration;
    const iterations = this.runIterations(robotVel, maxIter, false);
    if (iterations.length < 2) return 1;
    const last = iterations.length - 1;
    const tauScale = Math.max(1, Math.abs(iterations[last].tau));
    const step1 = iterations[last].tau - iterations[last - 1].tau;
    const step0 = last >= 2
      ? iterations[last - 1].tau - iterations[last - 2].tau
      : iterations[0].tau - iterations[0].tau_prev;
    if (Math.abs(step1) < 1e-12 * tauScale && last >= 2) {
      const step0Prev = iterations[last - 2].tau - (last >= 3 ? iterations[last - 3].tau : iterations[last - 2].tau_prev);
      if (Math.abs(step0Prev) >= 1e-12 * tauScale) {
        const phiPrime = step0 / step0Prev;
        return Math.min(1, Math.abs(phiPrime));
      }
    }
    if (Math.abs(step0) < 1e-12 * tauScale) return 1;
    const phiPrime = step1 / step0;
    return Math.min(1, Math.abs(phiPrime));
  }

  // Returns the 1-based iteration count at which convergence is achieved (final landing within
  // convergenceTolerance of target), or maxIter if never achieved within maxIter iterations.
  getIterationsToConvergence(robotVel, maxIter) {
    const iterations = this.runIterations(robotVel, maxIter);
    for (let k = 0; k < iterations.length; k++) {
      const iter = iterations[k];
      const dx = iter.actualTrajectoryEnd.x - this.targetPos.x;
      const dy = iter.actualTrajectoryEnd.y - this.targetPos.y;
      if (Math.sqrt(dx * dx + dy * dy) <= this.convergenceTolerance) {
        return k + 1;
      }
    }
    return maxIter;
  }

  // Check if a velocity causes convergence failure
  // Returns true if the algorithm fails to converge within tolerance
  checkConvergenceFailure(robotVel, maxIter) {
    // Guard against uninitialized positions
    if (!this.robotPos || !this.targetPos) {
      return true; // Consider it failed if positions not initialized
    }
    
    // Run the iterations
    const iterations = this.runIterations(robotVel, maxIter);
    
    // Check if we got any iterations
    if (iterations.length === 0) {
      return true; // No iterations, consider it failed
    }
    
    // Check if final landing position is within tolerance of target
    const finalIteration = iterations[iterations.length - 1];
    const finalLanding = finalIteration.actualTrajectoryEnd;
    
    // Calculate distance from final landing to target
    const dx = finalLanding.x - this.targetPos.x;
    const dy = finalLanding.y - this.targetPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Return true if distance exceeds tolerance (convergence failed)
    return distance > this.convergenceTolerance;
  }
  
  // Compute region of convergence by casting velocity rays.
  // If maxIter is provided, use it; otherwise use this.currentIteration. Returns the region array
  // when maxIter is provided (does not store); otherwise stores in this.regionOfConvergence.
  // Does not test velocities outside the reachability cone (saves cycles).
  computeRegionOfConvergence(maxIter) {
    // Guard against uninitialized positions
    if (!this.robotPos || !this.targetPos) {
      return maxIter !== undefined ? [] : null;
    }

    // Ensure target radius is calculated (tolerance is user-configurable, not calculated)
    if (this.targetRadius === null) {
      this.targetRadius = this.coords.pixelsToWorldDistance(this.targetPixelRadius);
    }

    // Reachability first so we can cap each ray and avoid wasted convergence checks
    this.computeReachabilityBoundary();
    const reachability = this.reachabilityBoundary;

    const limit = maxIter !== undefined ? maxIter : this.currentIteration;
    const result = [];

    // Cast rays at 1 degree intervals (360 rays total)
    const numRays = 360;
    const angleStep = 360 / numRays;

    // Linear search parameters
    const velocityStep = 0.05; // Step size in m/s
    const maxVelocity = 20.0; // Maximum velocity to search (m/s)

    for (let i = 0; i < numRays; i++) {
      const angleDeg = i * angleStep;
      const angleRad = (angleDeg * Math.PI) / 180;
      const velCap = reachability && reachability[i] ? Math.min(maxVelocity, reachability[i].maxVelocity) : maxVelocity;

      // Walk outward from zero until convergence fails or we leave the reachability cone
      let minFailureVel = null;

      for (let testVel = 0.0; testVel <= velCap; testVel += velocityStep) {
        const testRobotVel = {
          x: testVel * Math.cos(angleRad),
          y: testVel * Math.sin(angleRad)
        };
        const fails = this.checkConvergenceFailure(testRobotVel, limit);
        if (fails) {
          minFailureVel = testVel;
          break;
        }
      }

      result.push({
        angle: angleDeg,
        maxVelocity: minFailureVel !== null ? minFailureVel : velCap
      });
    }

    if (maxIter === undefined) {
      this.regionOfConvergence = result;
    }
    return result;
  }
  
  // True if (vx, vy) is inside the reachability cone (shot is geometrically possible).
  isInsideReachability(vx, vy) {
    if (!this.reachabilityBoundary || this.reachabilityBoundary.length === 0) return true;
    const velMag = Math.sqrt(vx * vx + vy * vy);
    let angleDeg = (Math.atan2(vy, vx) * 180 / Math.PI + 360) % 360;
    const numRays = this.reachabilityBoundary.length;
    const angleStep = 360 / numRays;
    const idx = Math.round(angleDeg / angleStep) % numRays;
    const maxVel = this.reachabilityBoundary[idx].maxVelocity;
    return velMag <= maxVel;
  }

  // Compute the physical reachability boundary in velocity space (the "Mach cone").
  // For each ray direction, the maximum robot speed that still admits a positive-TOF
  // solution.  In the forward hemisphere (toward target): v_max = v_p / |sin(phi)|
  // where phi is the angle off the target line.  In the rear hemisphere: v_max = v_p
  // (subsonic speeds are always reachable).
  computeReachabilityBoundary() {
    if (!this.robotPos || !this.targetPos) return;
    const dx = this.targetPos.x - this.robotPos.x;
    const dy = this.targetPos.y - this.robotPos.y;
    const targetDirection = Math.atan2(dy, dx);
    const vp = this.projectileSpeed;
    const maxVelocity = 20.0;
    const numRays = 360;
    const angleStep = 360 / numRays;
    const result = [];
    for (let i = 0; i < numRays; i++) {
      const angleDeg = i * angleStep;
      const angleRad = (angleDeg * Math.PI) / 180;
      var phi = angleRad - targetDirection;
      while (phi > Math.PI) phi -= 2 * Math.PI;
      while (phi < -Math.PI) phi += 2 * Math.PI;
      var maxVel;
      if (Math.abs(phi) >= Math.PI / 2) {
        maxVel = vp;
      } else {
        var sinPhi = Math.abs(Math.sin(phi));
        if (sinPhi < 0.01) {
          maxVel = maxVelocity;
        } else {
          maxVel = Math.min(vp / sinPhi, maxVelocity);
        }
      }
      result.push({ angle: angleDeg, maxVelocity: maxVel });
    }
    this.reachabilityBoundary = result;
  }

  // Run the dynamic shooting recursion algorithm
  runRecursion(robotVel, maxIter) {
    this.iterations = this.runIterations(robotVel, maxIter);
  }
  
  
  drawStaticCustom() {
    const ctx = this.staticCanvasContext;
    if (this.mode === "fractal") {
      this.drawStaticFractal(ctx);
      return;
    }
    // Simulation: field background and grid
    ctx.fillStyle = "#E8F5E9";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.strokeStyle = "#C8E6C9";
    ctx.lineWidth = 1;
    const scale = this.coords.getScale();
    const centerX = this.coords.centerX;
    const centerY = this.coords.centerY;
    for (let i = 0; i <= 15; i++) {
      const worldX = i * this.fieldWidth / 15;
      const worldY = i * this.fieldHeight / 15;
      const canvasX = centerX + (worldX - this.coords.fieldCenterX) * scale;
      const canvasY = centerY - (worldY - this.coords.fieldCenterY) * scale;
      ctx.beginPath();
      ctx.moveTo(canvasX, 0);
      ctx.lineTo(canvasX, this.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, canvasY);
      ctx.lineTo(this.width, canvasY);
      ctx.stroke();
    }
  }

  drawStaticFractal(ctx) {
    const bg = "#E8F5E9";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.width, this.height);
    if (!this.heatmapData || !this.heatmapBounds) return;
    const n = this.heatmapData.length;
    const cellW = this.width / n;
    const cellH = this.height / n;
    const cap = this.iterationCap;
    const variant = this.fractalVariant || "convergence";
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const v = this.heatmapData[j][i];
        const color = variant === "stability"
          ? DynamicShootingVisualization.interactionToColor(v)
          : DynamicShootingVisualization.iterationToColor(v, cap);
        ctx.fillStyle = color != null ? color : bg;
        ctx.fillRect(i * cellW, j * cellH, cellW + 1, cellH + 1);
      }
    }
  }
  
  drawRobot(ctx) {
    const robotCanvas = this.coords.worldToCanvas(this.robotPos.x, this.robotPos.y);
    const robotSize = 30; // Half the side length of the square
    
    // Draw robot square
    ctx.fillStyle = "#2E86AB";
    ctx.fillRect(robotCanvas.x - robotSize, robotCanvas.y - robotSize, robotSize * 2, robotSize * 2);
    ctx.strokeStyle = "#1A5F7A";
    ctx.lineWidth = 2;
    ctx.strokeRect(robotCanvas.x - robotSize, robotCanvas.y - robotSize, robotSize * 2, robotSize * 2);
    
    // Draw robot label (below the square)
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Robot", robotCanvas.x, robotCanvas.y + 40);
    
    return robotCanvas;
  }
  
  drawVelocityVector(ctx, robotCanvas) {
    const isZero = (this.robotVelocity.x === 0 && this.robotVelocity.y === 0);
    const velEnd = this.getVelocityVectorEndpoint(robotCanvas);
    
    // Draw arrow only if velocity is non-zero
    if (!isZero) {
      drawArrow(ctx, robotCanvas.x, robotCanvas.y, velEnd.x, velEnd.y, 3, "#2E86AB");
      
      // Draw velocity magnitude and component labels
      this.drawVelocityLabels(ctx, robotCanvas, velEnd);
    } else {
      // Draw draggable handle only when velocity is zero (for initial grabbing)
      DrawingUtils.drawCircle(ctx, velEnd.x, velEnd.y, 8, "#2E86AB", "#1A5F7A", 2);
    }
    
    return velEnd;
  }
  
  drawVelocityLabels(ctx, robotCanvas, velEnd) {
    const velMag = Math.sqrt(
      this.robotVelocity.x * this.robotVelocity.x +
      this.robotVelocity.y * this.robotVelocity.y
    );
    
    // Add velocity magnitude label halfway along the vector
    const midVel = {
      x: (robotCanvas.x + velEnd.x) / 2,
      y: (robotCanvas.y + velEnd.y) / 2
    };
    
    DrawingUtils.drawLabelAlongVector(
      ctx, robotCanvas.x, robotCanvas.y, velEnd.x, velEnd.y,
      `|v| = ${velMag.toFixed(2)} m/s`,
      0.5, 20, "10px", "Arial", "#2E86AB"
    );
    
    // Label velocity vector components (offset from tip)
    ctx.fillStyle = "#2E86AB";
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    const labelOffset = 15;
    ctx.fillText(
      `v = (${this.robotVelocity.x.toFixed(2)}, ${this.robotVelocity.y.toFixed(2)})`,
      velEnd.x + labelOffset,
      velEnd.y - labelOffset
    );
  }
  
  drawTarget(ctx) {
    const targetCanvas = this.coords.worldToCanvas(this.targetPos.x, this.targetPos.y);
    DrawingUtils.drawCircle(ctx, targetCanvas.x, targetCanvas.y, 30, "#F18F01", "#4A90E2", 2, "Target", 40);
    return targetCanvas;
  }
  
  drawDynamicCustom() {
    const ctx = this.animatedCanvasContext;
    if (this.mode === "fractal") {
      if (this.robotPos && this.targetPos) {
        this.drawRobot(ctx);
        this.drawTarget(ctx);
      }
      this.drawReachabilityBoundaryVelocitySpace(ctx);
      this.drawGeodesicVelocitySpace(ctx);
      this.drawEnvelopeVelocitySpace(ctx);
      this.drawFractalLegend(ctx);
      return;
    }
    if (!this.robotPos || !this.targetPos) return;
    const robotCanvas = this.drawRobot(ctx);
    this.drawVelocityVector(ctx, robotCanvas);
    this.drawTarget(ctx);
    this.drawReachabilityBoundary(ctx, robotCanvas);
    this.drawRegionOfConvergence(ctx, robotCanvas);
    this.drawGeodesic(ctx, robotCanvas);
    this.drawIterations(ctx, robotCanvas);
  }

  drawGeodesicVelocitySpace(ctx) {
    if (!this.robotPos || !this.targetPos) return;
    ctx.save();
    ctx.strokeStyle = "#9B59B6";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const dx = this.targetPos.x - this.robotPos.x;
    const dy = this.targetPos.y - this.robotPos.y;
    const targetDirection = Math.atan2(dy, dx);
    const vp = this.projectileSpeed;
    const maxVelocity = this.heatmapMaxVel;
    const asymptoteThreshold = 0.05;
    const numPoints = 180;
    const thetaRange = Math.PI / 2 - asymptoteThreshold;
    const thetaStep = thetaRange / numPoints;
    for (const sign of [-1, 1]) {
      ctx.beginPath();
      let first = true;
      for (let i = 0; i <= numPoints; i++) {
        const theta = sign * (asymptoteThreshold + i * thetaStep);
        if (Math.abs(theta) >= Math.PI / 2 - asymptoteThreshold) continue;
        const cotTheta = Math.cos(theta) / Math.sin(theta);
        const vel = vp * cotTheta;
        if (Math.abs(vel) > maxVelocity) {
          if (!first) ctx.stroke();
          ctx.beginPath();
          first = true;
          continue;
        }
        const angleRad = theta + targetDirection;
        const vx = Math.abs(vel) * Math.cos(angleRad);
        const vy = Math.abs(vel) * Math.sin(angleRad);
        const pt = this.velocityToCanvas(vx, vy);
        if (first) { ctx.moveTo(pt.x, pt.y); first = false; } else { ctx.lineTo(pt.x, pt.y); }
      }
      if (!first) ctx.stroke();
    }
    ctx.restore();
  }

  drawEnvelopeVelocitySpace(ctx) {
    if (!this.regionOfConvergence || this.regionOfConvergence.length === 0) return;
    ctx.save();
    ctx.strokeStyle = "#2E86AB";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    let first = true;
    for (let i = 0; i < this.regionOfConvergence.length; i++) {
      const p = this.regionOfConvergence[i];
      const angleRad = (p.angle * Math.PI) / 180;
      const vx = p.maxVelocity * Math.cos(angleRad);
      const vy = p.maxVelocity * Math.sin(angleRad);
      const pt = this.velocityToCanvas(vx, vy);
      if (first) { ctx.moveTo(pt.x, pt.y); first = false; } else { ctx.lineTo(pt.x, pt.y); }
    }
    const p0 = this.regionOfConvergence[0];
    const a0 = (p0.angle * Math.PI) / 180;
    const pt0 = this.velocityToCanvas(p0.maxVelocity * Math.cos(a0), p0.maxVelocity * Math.sin(a0));
    ctx.lineTo(pt0.x, pt0.y);
    ctx.stroke();
    ctx.restore();
  }

  // Draw the physical reachability boundary (Mach cone) in simulation mode
  drawReachabilityBoundary(ctx, robotCanvas) {
    if (!this.reachabilityBoundary || this.reachabilityBoundary.length === 0) return;
    ctx.save();
    ctx.strokeStyle = "#2E86AB";
    ctx.lineWidth = 2;
    // Solid line (no dash) to distinguish from dashed convergence envelope
    const velScale = this.getReferenceTOF();
    const scale = this.coords.getScale();
    ctx.beginPath();
    let first = true;
    for (let i = 0; i < this.reachabilityBoundary.length; i++) {
      const p = this.reachabilityBoundary[i];
      const angleRad = (p.angle * Math.PI) / 180;
      const endX = robotCanvas.x + p.maxVelocity * Math.cos(angleRad) * velScale * scale;
      const endY = robotCanvas.y - p.maxVelocity * Math.sin(angleRad) * velScale * scale;
      if (first) { ctx.moveTo(endX, endY); first = false; } else { ctx.lineTo(endX, endY); }
    }
    const p0 = this.reachabilityBoundary[0];
    const a0 = (p0.angle * Math.PI) / 180;
    ctx.lineTo(
      robotCanvas.x + p0.maxVelocity * Math.cos(a0) * velScale * scale,
      robotCanvas.y - p0.maxVelocity * Math.sin(a0) * velScale * scale
    );
    ctx.stroke();
    ctx.restore();
  }

  // Draw the physical reachability boundary in fractal/velocity-space mode
  drawReachabilityBoundaryVelocitySpace(ctx) {
    if (!this.reachabilityBoundary || this.reachabilityBoundary.length === 0) return;
    ctx.save();
    ctx.strokeStyle = "#2E86AB";
    ctx.lineWidth = 2;
    // Solid line (no dash)
    ctx.beginPath();
    let first = true;
    for (let i = 0; i < this.reachabilityBoundary.length; i++) {
      const p = this.reachabilityBoundary[i];
      const angleRad = (p.angle * Math.PI) / 180;
      const vx = p.maxVelocity * Math.cos(angleRad);
      const vy = p.maxVelocity * Math.sin(angleRad);
      const pt = this.velocityToCanvas(vx, vy);
      if (first) { ctx.moveTo(pt.x, pt.y); first = false; } else { ctx.lineTo(pt.x, pt.y); }
    }
    const p0 = this.reachabilityBoundary[0];
    const a0 = (p0.angle * Math.PI) / 180;
    const pt0 = this.velocityToCanvas(p0.maxVelocity * Math.cos(a0), p0.maxVelocity * Math.sin(a0));
    ctx.lineTo(pt0.x, pt0.y);
    ctx.stroke();
    ctx.restore();
  }

  drawFractalLegend(ctx) {
    const variant = this.fractalVariant || "convergence";
    const margin = 12;
    const barWidth = 18;
    const barHeight = 180;
    const x0 = this.width - margin - barWidth - 36;
    const y0 = margin + 36; // leave room for title above bar
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.font = "11px Arial";
    ctx.textAlign = "right";
    if (variant === "stability") {
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "11px Arial";
      ctx.fillText("0 good → 1 bad", x0 + barWidth, y0 - 12);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.strokeRect(x0, y0, barWidth, barHeight);
      const nSteps = 96;
      for (let i = 0; i < nSteps; i++) {
        const t = i / (nSteps - 1);
        const c = DynamicShootingVisualization.interactionToColor(t);
        if (c) {
          ctx.fillStyle = c;
          const sy = y0 + t * barHeight;
          const sh = Math.ceil(barHeight / nSteps) + 1;
          ctx.fillRect(x0, sy, barWidth, sh);
        }
      }
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.fillStyle = "#1a1a1a";
      for (const tick of [0, 0.25, 0.5, 0.75, 1]) {
        const ty = y0 + tick * barHeight;
        ctx.beginPath();
        ctx.moveTo(x0, ty);
        ctx.lineTo(x0 - 4, ty);
        ctx.stroke();
        ctx.fillText(String(tick), x0 - 6, ty + 4);
      }
    } else {
      const cap = this.iterationCap;
      ctx.fillText("Iterations", x0 + barWidth, y0 - 24);
      ctx.fillText("to converge", x0 + barWidth, y0 - 12);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.strokeRect(x0, y0, barWidth, barHeight);
      const nSteps = 96;
      for (let i = 0; i < nSteps; i++) {
        const t = i / (nSteps - 1);
        const k = Math.pow(cap, t);
        const c = DynamicShootingVisualization.iterationToColor(Math.round(Math.max(1, k)), cap);
        if (c) {
          ctx.fillStyle = c;
          const sy = y0 + t * barHeight;
          const sh = Math.ceil(barHeight / nSteps) + 1;
          ctx.fillRect(x0, sy, barWidth, sh);
        }
      }
      const ticks = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].filter(v => v <= cap);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      for (const tick of ticks) {
        const t = Math.log(tick) / Math.log(cap);
        const ty = y0 + t * barHeight;
        ctx.beginPath();
        ctx.moveTo(x0, ty);
        ctx.lineTo(x0 - 4, ty);
        ctx.stroke();
        ctx.fillText(String(tick), x0 - 6, ty + 4);
      }
    }
    ctx.restore();
  }
  
  drawRegionOfConvergence(ctx, robotCanvas) {
    if (!this.regionOfConvergence || this.regionOfConvergence.length === 0) {
      return;
    }
    
    ctx.save();
    ctx.strokeStyle = "#2E86AB";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Use reference TOF so region scales relative to the fixed velocity vector
    const velScale = this.getReferenceTOF();
    const scale = this.coords.getScale();
    
    ctx.beginPath();
    let firstPoint = true;
    
    for (let i = 0; i < this.regionOfConvergence.length; i++) {
      const point = this.regionOfConvergence[i];
      const angleRad = (point.angle * Math.PI) / 180;
      const vel = point.maxVelocity;
      
      // Calculate the endpoint of this velocity vector (scaled by TOF, same as robot velocity vector)
      const endX = robotCanvas.x + vel * Math.cos(angleRad) * velScale * scale;
      const endY = robotCanvas.y - vel * Math.sin(angleRad) * velScale * scale; // Flip Y
      
      if (firstPoint) {
        ctx.moveTo(endX, endY);
        firstPoint = false;
      } else {
        ctx.lineTo(endX, endY);
      }
    }
    
    // Close the path
    if (this.regionOfConvergence.length > 0) {
      const firstPoint = this.regionOfConvergence[0];
      const angleRad = (firstPoint.angle * Math.PI) / 180;
      const vel = firstPoint.maxVelocity;
      const endX = robotCanvas.x + vel * Math.cos(angleRad) * velScale * scale;
      const endY = robotCanvas.y - vel * Math.sin(angleRad) * velScale * scale;
      ctx.lineTo(endX, endY);
    }
    
    ctx.stroke();
    ctx.restore();
  }
  
  drawGeodesic(ctx, robotCanvas) {
    if (!this.robotPos || !this.targetPos) {
      return;
    }
    
    ctx.save();
    ctx.strokeStyle = "#9B59B6"; // Purple color to distinguish from convergence envelope
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Calculate direction from robot to target
    const dx = this.targetPos.x - this.robotPos.x;
    const dy = this.targetPos.y - this.robotPos.y;
    const targetDirection = Math.atan2(dy, dx);
    
    // Use reference TOF so geodesic scales relative to the fixed velocity vector
    const velScale = this.getReferenceTOF();
    const scale = this.coords.getScale();
    const maxVelocity = 20.0;
    const asymptoteThreshold = 0.05;
    const numPoints = 180;
    const thetaRange = Math.PI / 2 - asymptoteThreshold;
    const thetaStep = thetaRange / numPoints;
    
    // Draw left branch (negative theta: from -PI/2 to -threshold)
    ctx.beginPath();
    let firstPoint = true;
    for (let i = numPoints; i >= 0; i--) {
      const theta = -Math.PI / 2 + i * thetaStep;
      if (theta > -asymptoteThreshold) continue;
      
      const cotTheta = Math.cos(theta) / Math.sin(theta);
      const vel = this.projectileSpeed * cotTheta;
      
      if (Math.abs(vel) > maxVelocity) {
        if (!firstPoint) {
          ctx.stroke();
          ctx.beginPath();
          firstPoint = true;
        }
        continue;
      }
      
      const angleRad = theta + targetDirection;
      const velMag = Math.abs(vel);
      const endX = robotCanvas.x + velMag * Math.cos(angleRad) * velScale * scale;
      const endY = robotCanvas.y - velMag * Math.sin(angleRad) * velScale * scale;
      
      if (firstPoint) {
        ctx.moveTo(endX, endY);
        firstPoint = false;
      } else {
        ctx.lineTo(endX, endY);
      }
    }
    if (!firstPoint) ctx.stroke();
    
    // Draw right branch (positive theta: from threshold to PI/2)
    ctx.beginPath();
    firstPoint = true;
    for (let i = 0; i <= numPoints; i++) {
      const theta = asymptoteThreshold + i * thetaStep;
      const cotTheta = Math.cos(theta) / Math.sin(theta);
      const vel = this.projectileSpeed * cotTheta;
      
      if (Math.abs(vel) > maxVelocity) {
        if (!firstPoint) {
          ctx.stroke();
          ctx.beginPath();
          firstPoint = true;
        }
        continue;
      }
      
      const angleRad = theta + targetDirection;
      const velMag = Math.abs(vel);
      const endX = robotCanvas.x + velMag * Math.cos(angleRad) * velScale * scale;
      const endY = robotCanvas.y - velMag * Math.sin(angleRad) * velScale * scale;
      
      if (firstPoint) {
        ctx.moveTo(endX, endY);
        firstPoint = false;
      } else {
        ctx.lineTo(endX, endY);
      }
    }
    if (!firstPoint) ctx.stroke();
    
    ctx.restore();
  }
  
  drawIterations(ctx, robotCanvas) {
    const numIterationsToDraw = Math.min(this.currentIteration, this.iterations.length);
    
    for (let i = 0; i < numIterationsToDraw; i++) {
      const iter = this.iterations[i];
      
      if (!iter || !iter.virtualTargetPos) {
        continue;
      }
      
      const isCurrentIteration = (i === numIterationsToDraw - 1);
      const iterationIndex = i;
      
      // Calculate alpha for fading previous iterations
      const alpha = DrawingUtils.getIterationAlpha(iterationIndex, numIterationsToDraw - 1);
      ctx.globalAlpha = alpha;
      
      // Draw iteration elements
      this.drawIteration(ctx, iter, iterationIndex, isCurrentIteration, robotCanvas);
      
      // Reset alpha
      ctx.globalAlpha = 1.0;
    }
  }
  
  drawIteration(ctx, iter, iterationIndex, isCurrentIteration, robotCanvas) {
    const virtualTargetCanvas = this.coords.worldToCanvas(
      iter.virtualTargetPos.x,
      iter.virtualTargetPos.y
    );
    
    if (isNaN(virtualTargetCanvas.x) || isNaN(virtualTargetCanvas.y)) {
      return;
    }
    
    // Calculate iteration-based scale
    const scaleFactor = DrawingUtils.getIterationScale(iterationIndex);
    const baseRadius = 24;
    const circleRadius = baseRadius * scaleFactor;
    
    // Draw virtual target circle
    DrawingUtils.drawCircle(
      ctx, virtualTargetCanvas.x, virtualTargetCanvas.y, circleRadius,
      null, "#6A994E", 2,
      isCurrentIteration ? "Virtual" : null, 25
    );
    
    // Draw offset vector from target to virtual target
    this.drawOffsetVector(ctx, iter, virtualTargetCanvas, iterationIndex);
    
    // Draw virtual trajectory
    this.drawVirtualTrajectory(ctx, iter, virtualTargetCanvas, robotCanvas, iterationIndex);
    
    // Draw actual trajectory
    this.drawActualTrajectory(ctx, iter, robotCanvas, iterationIndex, isCurrentIteration);
  }
  
  drawOffsetVector(ctx, iter, virtualTargetCanvas, iterationIndex) {
    const offsetStart = this.coords.worldToCanvas(this.targetPos.x, this.targetPos.y);
    const offsetEnd = virtualTargetCanvas;
    
    const baseHeadLen = 10;
    const headLenScale = DrawingUtils.getIterationScale(iterationIndex);
    const scaledHeadLen = baseHeadLen * headLenScale;
    
    // Draw line with scaled arrowhead
    DrawingUtils.drawLine(ctx, offsetStart.x, offsetStart.y, offsetEnd.x, offsetEnd.y,
                         "#F18F01", 1.5, true, scaledHeadLen);
    
    // Label the offset magnitude
    const offsetMagnitude = Math.sqrt(
      iter.virtualTargetOffset.x * iter.virtualTargetOffset.x +
      iter.virtualTargetOffset.y * iter.virtualTargetOffset.y
    );
    
    const baseOffset = 0.15;
    const radialOffset = iterationIndex * 0.085;
    const positionAlongVector = Math.min(1.0, Math.max(0.0, baseOffset + radialOffset));
    
    DrawingUtils.drawLabelAlongVector(
      ctx, offsetStart.x, offsetStart.y, offsetEnd.x, offsetEnd.y,
      `${offsetMagnitude.toFixed(2)} m`,
      positionAlongVector, 20, "9px", "Arial", "#F18F01"
    );
  }
  
  drawVirtualTrajectory(ctx, iter, virtualTargetCanvas, robotCanvas, iterationIndex) {
    // Draw line from robot to virtual target
    ctx.strokeStyle = "#6A994E";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(robotCanvas.x, robotCanvas.y);
    ctx.lineTo(virtualTargetCanvas.x, virtualTargetCanvas.y);
    ctx.stroke();
    
    // Label with TOF
    const baseOffset = 0.15;
    const radialOffset = iterationIndex * 0.085;
    const positionAlongVector = Math.min(1.0, Math.max(0.0, baseOffset + radialOffset));
    
    DrawingUtils.drawLabelAlongVector(
      ctx, robotCanvas.x, robotCanvas.y, virtualTargetCanvas.x, virtualTargetCanvas.y,
      `TOF: ${iter.tau.toFixed(2)}s`,
      positionAlongVector, 20, "10px", "Arial", "#6A994E"
    );
  }
  
  drawActualTrajectory(ctx, iter, robotCanvas, iterationIndex, isCurrentIteration) {
    const actualEndCanvas = this.coords.worldToCanvas(
      iter.actualTrajectoryEnd.x,
      iter.actualTrajectoryEnd.y
    );
    
    if (isNaN(actualEndCanvas.x) || isNaN(actualEndCanvas.y)) {
      return;
    }
    
    // Draw line from robot to actual end
    ctx.strokeStyle = "#BC4749";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(robotCanvas.x, robotCanvas.y);
    ctx.lineTo(actualEndCanvas.x, actualEndCanvas.y);
    ctx.stroke();
    
    // Draw actual target circle
    const scaleFactor = DrawingUtils.getIterationScale(iterationIndex);
    const baseRadius = 24;
    const circleRadius = baseRadius * scaleFactor;
    
    DrawingUtils.drawCircle(
      ctx, actualEndCanvas.x, actualEndCanvas.y, circleRadius,
      "#BC4749", "#8B2E2E", 2,
      isCurrentIteration ? "Actual" : null, 25
    );
  }
  
  setRobotVelocity(velX, velY) {
    this.robotVelocity = { x: velX, y: velY };
  }
  
  setCurrentIteration(iter) {
    if (this.currentIteration !== iter) {
      this.currentIteration = iter;
      if (this.mode === "fractal") {
        this.scheduleFractalUpdate();
      } else {
        this.computeRegionOfConvergence();
      }
    }
  }
  
  setNumIterations(numIter) {
    this.numIterations = numIter;
  }
  
  setProjectileSpeed(speed) {
    if (this.projectileSpeed !== speed) {
      this.projectileSpeed = speed;
      if (this.mode === "fractal") {
        this.scheduleFractalUpdate();
      } else {
        this.computeRegionOfConvergence();
      }
    }
  }
  
  setConvergenceTolerance(tolerance) {
    if (this.convergenceTolerance !== tolerance) {
      this.convergenceTolerance = tolerance;
      if (this.mode === "fractal") {
        this.scheduleFractalUpdate();
      } else {
        this.computeRegionOfConvergence();
      }
    }
  }
  
  updateSize() {
    // Make plotting area fill the drawDiv completely
    // drawDiv IS visualizationDrawDiv (passed to constructor)
    // It should already be sized by the flex layout to fill available space (minus control bar)
    
    // Get the actual available space from drawDiv itself
    let availableWidth = this.drawDiv.offsetWidth || this.drawDiv.clientWidth || 600;
    let availableHeight = this.drawDiv.offsetHeight || this.drawDiv.clientHeight || 600;
    
    // Use defaults if dimensions not ready
    if (availableWidth <= 0) availableWidth = 600;
    if (availableHeight <= 0) availableHeight = 600;
    
    // Use the full available space
    this.width = availableWidth;
    this.height = availableHeight;
    
    // Initialize coordinate converter if it doesn't exist yet
    // (BaseVisualization constructor calls updateSize before our constructor body runs)
    if (!this.coords) {
      // Field dimensions should be set by now, but use defaults if not
      const fieldWidth = this.fieldWidth || 15.0;
      const fieldHeight = this.fieldHeight || 15.0;
      this.coords = new CoordinateConverter(this.width, this.height, fieldWidth, fieldHeight);
    } else {
      // Update coordinate converter with new dimensions
      this.coords.updateDimensions(this.width, this.height, this.fieldWidth, this.fieldHeight);
    }
    
    // Ensure canvases match the div size exactly
    this.staticCanvas.width = this.width;
    this.staticCanvas.height = this.height;
    this.animatedCanvas.width = this.width;
    this.animatedCanvas.height = this.height;
    
    // Set explicit canvas element sizes to match pixel dimensions
    this.staticCanvas.style.width = this.width + "px";
    this.staticCanvas.style.height = this.height + "px";
    this.animatedCanvas.style.width = this.width + "px";
    this.animatedCanvas.style.height = this.height + "px";
    
    // Ensure the div itself has the right size
    this.drawDiv.style.width = this.width + "px";
    this.drawDiv.style.height = this.height + "px";
    this.drawDiv.style.overflow = "hidden";
    
    // Calculate target radius in world coordinates based on pixel radius and scale
    this.targetRadius = this.coords.pixelsToWorldDistance(this.targetPixelRadius);
    // Note: convergenceTolerance is user-configurable, not calculated from target radius
    
    // Recompute region of convergence since scale changed (affects target radius calculation)
    this.computeRegionOfConvergence();
    if (this.mode === "fractal") {
      this.scheduleFractalUpdate();
    }
    // Always redraw after size update
    this.drawStatic();
    this.drawDynamic();
  }
  
  // Debounced fractal update: waits for inputs to settle before recomputing the expensive heatmap
  scheduleFractalUpdate() {
    if (this._fractalDebounceTimer) {
      clearTimeout(this._fractalDebounceTimer);
    }
    // Immediately redraw overlays (envelope, geodesic, legend, robot, target) with stale heatmap
    this.computeRegionOfConvergence();
    this.drawStatic();
    this.drawDynamic();
    // Debounce the expensive heatmap recomputation
    this._fractalDebounceTimer = setTimeout(() => {
      this._fractalDebounceTimer = null;
      this.computeHeatmap();
      this.computeRegionOfConvergence();
      this.drawStatic();
      this.drawDynamic();
    }, 250);
  }

  update() {
    if (this.mode === "fractal") {
      // In fractal mode, update() only redraws with existing data (cheap).
      // Heatmap recomputation is triggered only by scheduleFractalUpdate().
      this.drawStatic();
      this.drawDynamic();
      return;
    }
    this.runRecursion(this.robotVelocity, this.numIterations);
    if (this.currentIteration < 1 && this.iterations.length > 0) {
      this.currentIteration = 1;
    }
    this.drawStatic();
    this.drawDynamic();
  }
}

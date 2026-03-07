class NewtonShootingVisualization extends DynamicShootingVisualization {
  constructor(div_in) {
    super(div_in);
    // solverMethod left undefined so the first setSolverMethod() call from the
    // widget actually triggers envelope recomputation (the parent constructor
    // already ran computeRegionOfConvergence with the fixed-point fallback).
    this.solverMethod = undefined;
    this.iterationCap = 20;
  }

  setSolverMethod(method) {
    if (this.solverMethod === method) return;
    this.solverMethod = method;
    this.iterationCap = method === "newton" ? 20 : 1000;
    // Always recompute the envelope for the active solver
    this.computeRegionOfConvergence();
    if (this.mode === "fractal") {
      this.scheduleFractalUpdate();
    }
  }

  // ── Newton's method iteration (full data, for simulation mode) ────────────

  runNewtonIterations(robotVel, maxIter) {
    const iterations = [];
    if (!this.robotPos || !this.targetPos) return iterations;

    const dx0 = this.targetPos.x - this.robotPos.x;
    const dy0 = this.targetPos.y - this.robotPos.y;
    const D0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
    if (D0 < 1e-10) return iterations;

    const vp = this.projectileSpeed;
    const vx = robotVel.x;
    const vy = robotVel.y;
    const vToward = (dx0 * vx + dy0 * vy) / D0;
    let t = vp + vToward > 1e-10 ? D0 / (vp + vToward) : D0 / vp;
    let prevTOF = null;

    for (let iter = 0; iter < maxIter; iter++) {
      const X = dx0 - vx * t;
      const Y = dy0 - vy * t;
      const D = Math.sqrt(X * X + Y * Y);
      if (D < 1e-10) break;

      const fD = D / vp;
      const F = t - fD;
      const Fprime = 1 + (X * vx + Y * vy) / (vp * D);

      const virtualTargetPos = {
        x: this.targetPos.x - vx * t,
        y: this.targetPos.y - vy * t
      };
      const virtualTargetOffset = { x: -vx * t, y: -vy * t };
      const actualTrajectoryEnd = {
        x: virtualTargetPos.x + vx * fD,
        y: virtualTargetPos.y + vy * fD
      };

      iterations.push({
        iteration: iter + 1,
        relativePos: { x: X, y: Y },
        tau: fD,
        tau_prev: prevTOF !== null ? prevTOF : t,
        virtualTargetPos: virtualTargetPos,
        virtualTargetOffset: virtualTargetOffset,
        actualTrajectoryEnd: actualTrajectoryEnd
      });

      // Check convergence
      const edx = actualTrajectoryEnd.x - this.targetPos.x;
      const edy = actualTrajectoryEnd.y - this.targetPos.y;
      if (Math.sqrt(edx * edx + edy * edy) <= this.convergenceTolerance) break;

      // Guard singular derivative
      if (Math.abs(Fprime) < 1e-10) break;

      // Newton step
      prevTOF = t;
      t = t - F / Fprime;
      if (t < 0.001) t = 0.001;
    }
    return iterations;
  }

  // ── Optimized convergence counter (no allocations, for heatmap) ───────────

  getNewtonIterationsToConvergence(robotVel, maxIter) {
    if (!this.robotPos || !this.targetPos) return maxIter;

    const dx0 = this.targetPos.x - this.robotPos.x;
    const dy0 = this.targetPos.y - this.robotPos.y;
    const D0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
    if (D0 < 1e-10) return 1;

    const vp = this.projectileSpeed;
    const vx = robotVel.x;
    const vy = robotVel.y;
    const vrMag = Math.sqrt(vx * vx + vy * vy);
    const tol = this.convergenceTolerance;
    const vToward = (dx0 * vx + dy0 * vy) / D0;
    let t = vp + vToward > 1e-10 ? D0 / (vp + vToward) : D0 / vp;

    for (let k = 1; k <= maxIter; k++) {
      const X = dx0 - vx * t;
      const Y = dy0 - vy * t;
      const D = Math.sqrt(X * X + Y * Y);
      if (D < 1e-10) return k;

      const fD = D / vp;
      const F = t - fD;

      // Landing error = |F| * |v_r| (derived from actualLanding − target = −v_r·F)
      if (Math.abs(F) * vrMag <= tol) return k;

      const Fprime = 1 + (X * vx + Y * vy) / (vp * D);
      if (Math.abs(Fprime) < 1e-10) return maxIter;

      t = t - F / Fprime;
      if (t < 0.001) t = 0.001;
    }
    return maxIter;
  }

  // ── Overrides so parent machinery dispatches to correct solver ────────────

  getIterationsToConvergence(robotVel, maxIter) {
    if (this.solverMethod === "newton") {
      return this.getNewtonIterationsToConvergence(robotVel, maxIter);
    }
    return super.getIterationsToConvergence(robotVel, maxIter);
  }

  runRecursion(robotVel, maxIter) {
    if (this.solverMethod === "newton") {
      this.iterations = this.runNewtonIterations(robotVel, maxIter);
    } else {
      super.runRecursion(robotVel, maxIter);
    }
  }

  checkConvergenceFailure(robotVel, maxIter) {
    if (this.solverMethod === "newton") {
      const iters = this.runNewtonIterations(robotVel, maxIter);
      if (iters.length === 0) return true;
      const last = iters[iters.length - 1];
      const dx = last.actualTrajectoryEnd.x - this.targetPos.x;
      const dy = last.actualTrajectoryEnd.y - this.targetPos.y;
      return Math.sqrt(dx * dx + dy * dy) > this.convergenceTolerance;
    }
    return super.checkConvergenceFailure(robotVel, maxIter);
  }
}

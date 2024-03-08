// Generated from https://github.com/wpilibsuite/allwpilib/blob/main/wpimath/src/main/java/edu/wpi/first/math/trajectory/TrapezoidProfile.java
// With the help of https://www.codeconvert.ai/app
// Multiple modifications needed after translation
// --> incorrect translation of wpilib hal reporting
// --> Missing accleration reporting

class TrapezoidProfile {
    constructor(constraints) {
      this.m_direction = 0;
      this.m_constraints = constraints;
      this.m_current = null;
      this.m_goal = null;
      this.m_newAPI = true;
      this.m_endAccel = 0;
      this.m_endFullSpeed = 0;
      this.m_endDeccel = 0;
    }
  
    static Constraints = class {
      constructor(maxVelocity, maxAcceleration) {
        this.maxVelocity = maxVelocity;
        this.maxAcceleration = maxAcceleration;
      }
  
      Constraints(maxVelocity, maxAcceleration) {
        this.maxVelocity = maxVelocity;
        this.maxAcceleration = maxAcceleration;
      }
    }
  
    static State = class {
      constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = 0.0;
      }
    }
  
    calculate(t, current, goal) {
      this.m_direction = this.shouldFlipAcceleration(current, goal) ? -1 : 1;
      this.m_current = this.direct(current);
      goal = this.direct(goal);
      if (this.m_current.velocity > this.m_constraints.maxVelocity) {
        this.m_current.velocity = this.m_constraints.maxVelocity;
      }
  
      let cutoffBegin = this.m_current.velocity / this.m_constraints.maxAcceleration;
      let cutoffDistBegin = cutoffBegin * cutoffBegin * this.m_constraints.maxAcceleration / 2.0;
      let cutoffEnd = goal.velocity / this.m_constraints.maxAcceleration;
      let cutoffDistEnd = cutoffEnd * cutoffEnd * this.m_constraints.maxAcceleration / 2.0;
  
      let fullTrapezoidDist = cutoffDistBegin + (goal.position - this.m_current.position) + cutoffDistEnd;
      let accelerationTime = this.m_constraints.maxVelocity / this.m_constraints.maxAcceleration;
      let fullSpeedDist = fullTrapezoidDist - accelerationTime * accelerationTime * this.m_constraints.maxAcceleration;
  
      if (fullSpeedDist < 0) {
        accelerationTime = Math.sqrt(fullTrapezoidDist / this.m_constraints.maxAcceleration);
        fullSpeedDist = 0;
      }
      this.m_endAccel = accelerationTime - cutoffBegin;
      this.m_endFullSpeed = this.m_endAccel + fullSpeedDist / this.m_constraints.maxVelocity;
      this.m_endDeccel = this.m_endFullSpeed + accelerationTime - cutoffEnd;
      let result = new this.constructor.State(this.m_current.position, this.m_current.velocity);
      if (t < this.m_endAccel) {
        result.velocity += t * this.m_constraints.maxAcceleration;
        result.position += (this.m_current.velocity + t * this.m_constraints.maxAcceleration / 2.0) * t;
        result.acceleration = this.m_constraints.maxAcceleration;
      } else if (t < this.m_endFullSpeed) {
        result.velocity = this.m_constraints.maxVelocity;
        result.position += (this.m_current.velocity + this.m_endAccel * this.m_constraints.maxAcceleration / 2.0) * this.m_endAccel + this.m_constraints.maxVelocity * (t - this.m_endAccel);
        result.acceleration = 0.0;
      } else if (t <= this.m_endDeccel) {
        result.velocity = goal.velocity + (this.m_endDeccel - t) * this.m_constraints.maxAcceleration;
        let timeLeft = this.m_endDeccel - t;
        result.position = goal.position - (goal.velocity + timeLeft * this.m_constraints.maxAcceleration / 2.0) * timeLeft;
        result.acceleration = -1.0 * this.m_constraints.maxAcceleration;
      } else {
        result = goal;
        result.acceleration = 0.0;
      }
      return this.direct(result);
    }
  
    timeLeftUntil(target) {
      let position = this.m_current.position * this.m_direction;
      let velocity = this.m_current.velocity * this.m_direction;
      let endAccel = this.m_endAccel * this.m_direction;
      let endFullSpeed = this.m_endFullSpeed * this.m_direction - endAccel;
      if (target < position) {
        endAccel = -endAccel;
        endFullSpeed = -endFullSpeed;
        velocity = -velocity;
      }
      endAccel = Math.max(endAccel, 0);
      endFullSpeed = Math.max(endFullSpeed, 0);
      const acceleration = this.m_constraints.maxAcceleration;
      const decceleration = -this.m_constraints.maxAcceleration;
      let distToTarget = Math.abs(target - position);
      if (distToTarget < 1e-6) {
        return 0;
      }
      let accelDist = velocity * endAccel + 0.5 * acceleration * endAccel * endAccel;
      let deccelVelocity;
      if (endAccel > 0) {
        deccelVelocity = Math.sqrt(Math.abs(velocity * velocity + 2 * acceleration * accelDist));
      } else {
        deccelVelocity = velocity;
      }
      let fullSpeedDist = this.m_constraints.maxVelocity * endFullSpeed;
      let deccelDist;
      if (accelDist > distToTarget) {
        accelDist = distToTarget;
        fullSpeedDist = 0;
        deccelDist = 0;
      } else if (accelDist + fullSpeedDist > distToTarget) {
        fullSpeedDist = distToTarget - accelDist;
        deccelDist = 0;
      } else {
        deccelDist = distToTarget - fullSpeedDist - accelDist;
      }
      let accelTime = (-velocity + Math.sqrt(Math.abs(velocity * velocity + 2 * acceleration * accelDist))) / acceleration;
      let deccelTime = (-deccelVelocity + Math.sqrt(Math.abs(deccelVelocity * deccelVelocity + 2 * decceleration * deccelDist))) / decceleration;
      let fullSpeedTime = fullSpeedDist / this.m_constraints.maxVelocity;
      return accelTime + fullSpeedTime + deccelTime;
    }
  
    totalTime() {
      return this.m_endDeccel;
    }
  
    isFinished(t) {
      return t >= this.totalTime();
    }
  
    shouldFlipAcceleration(initial, goal) {
      return initial.position > goal.position;
    }
  
    direct(input) {
      let result = new this.constructor.State(input.position, input.velocity);
      result.position = result.position * this.m_direction;
      result.velocity = result.velocity * this.m_direction;
      result.acceleration = input.acceleration * this.m_direction;
      return result;
    }
  }
  
  
  
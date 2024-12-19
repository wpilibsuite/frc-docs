
class ProfileConstraints {
  // Represents the constraints we want the profiler to obey
  // Larger accelerations imply faster changes in velocity
  // Larger velocities allow the profile to be traversed quicker
  constructor(maxVel, maxAccel) {
    // Constraints of exactly 0 result in infinite times
    // Which causes math issues later on. Ensure constraints are reasonable here.
    this.maxVel = Math.max(maxVel, 1.0e-9);
    this.maxAccel = Math.max(maxAccel, 1.0e-9);
  }
}

class ProfileState {
  // Represents the relevant state that the profiler controls
  // This is a constant-acceleration profiler, so we only track
  // up to acceleration (not jerk)
  constructor(pos, vel, accel) {
    this.pos = pos;
    this.vel = vel;
    this.accel = accel;
  }
}

class TrapezoidProfile {
   // Implements a 1-dimensional constant acceleration motion profile
   // See implementation at https://github.com/wpilibsuite/allwpilib/blob/main/wpimath/src/main/java/edu/wpi/first/math/trajectory/TrapezoidProfile.java
   // Tutorial should track this code's implementation as closely as possible



    constructor(constraints) {
      this.constraints = constraints;

      this.isFlipped = false;
      this.currentState = new ProfileState(0.0,0.0,0.0); //Always assume starting from zero state. Works for this sim, not generally.
      this.goalState = this.currentState;
      this.initialState = this.currentState;

      this.endAccel = 0;
      this.endFullSpeed = 0;
      this.endDeccel = 0;
    }


    assignDirection(input) {
      // Flips signs as needed if the direction of the output is inverted
      let result = new ProfileState(input.pos, input.vel, input.accel);
      if(this.isFlipped){
        result.pos *= -1.0;
        result.vel *= -1.0;
        result.accel *= -1.0;
      }
      return result;
    }

    isFinished(curTime_s) {
      // Check if the given time is after the end of the profile or not
      return curTime_s >= this.endDeccel;
    }
  
    shouldFlipAcceleration(initialState, goalState) {
      // Detects case where the profiler needs to run "backward" from normal
      // This lets us keep the main implementation all "positive", but just invert
      // things right at the end of needed
      return initialState.pos > goalState.pos;
    }

    init(initialState, goalState) {
      this.isFlipped = this.shouldFlipAcceleration(initialState, goalState);
      this.currentState = this.assignDirection(initialState);
      this.initialState = this.assignDirection(initialState);
      this.goalState = this.assignDirection(goalState);
      if (this.currentState.vel > this.constraints.maxVel) {
        this.currentState.vel = this.constraints.maxVel;
      }
  
      let cutoffBeginTime = this.currentState.vel / this.constraints.maxAccel;
      let cutoffEndTime = goalState.vel / this.constraints.maxAccel;
      let accelTime = this.constraints.maxVel / this.constraints.maxAccel;

      let cutoffDistBegin = Math.pow(cutoffBeginTime, 2) * this.constraints.maxAccel / 2.0;
      let cutoffDistEnd =  Math.pow(cutoffEndTime, 2)  * this.constraints.maxAccel / 2.0;
  
      let fullTrapezoidDist = cutoffDistBegin + (goalState.pos - this.currentState.pos) + cutoffDistEnd;
      let fullSpeedDist = fullTrapezoidDist - Math.pow(accelTime, 2) * this.constraints.maxAccel;
  
      if (fullSpeedDist < 0.0) {
        accelTime = Math.sqrt(fullTrapezoidDist / this.constraints.maxAccel);
        fullSpeedDist = 0.0;
      }

      this.endAccel = accelTime - cutoffBeginTime;
      this.endFullSpeed = this.endAccel + fullSpeedDist / this.constraints.maxVel;
      this.endDeccel = this.endFullSpeed + accelTime - cutoffEndTime;
    }

    calculate(curTime_s, currentState) {

      this.currentState = this.assignDirection(currentState);

      // Start with a copy of the current state, and we'll modify it.
      let result = new ProfileState(this.currentState.pos, this.currentState.vel, this.currentState.accel);

      if (curTime_s < this.endAccel) {
        // Initial acceleration segment - speeding up
        result.accel = this.constraints.maxAccel;
        result.vel = curTime_s * this.currentState.accel;
        result.pos = (this.initialState.vel + curTime_s * this.currentState.accel / 2.0) * curTime_s;

      } else if (curTime_s < this.endFullSpeed) {
        // Cruise at max velocity
        result.accel = 0.0;
        result.vel = this.constraints.maxVel;
        result.pos = (this.initialState.vel + this.endAccel * this.constraints.maxAccel / 2.0) * this.endAccel + this.constraints.maxVel * (curTime_s - this.endAccel);

      } else if (curTime_s <= this.endDeccel) {
        // Deceleration before end of profile - slowing down
        let timeLeft = this.endDeccel - curTime_s;

        result.accel = -1.0 * this.constraints.maxAccel;
        result.vel = this.goalState.vel + (timeLeft) * this.constraints.maxAccel;
        result.pos = this.goalState.pos - (this.goalState.vel + timeLeft * this.constraints.maxAccel / 2.0) * timeLeft;

      } else {
        // After end of profile - just stay at goal
        result = this.goalState;
        result.accel = 0.0;

      }

      //Return the result, including direction inversion
      return this.assignDirection(result);
    }
  
  }
  
  
  
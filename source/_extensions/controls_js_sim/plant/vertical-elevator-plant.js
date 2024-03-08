class VerticalElevatorPlant {
  constructor(TimestepS, heightM) {
    this.TimestepS = TimestepS;

    // Gains estimated by ReCalc (http://reca.lc) with the specs below
    // motor: 1x REV Neo
    // gearing: 5:1
    // Pulley Diameter: 2 in
    // efficiency: 100
    // moving mass: 5 kg
    this.kGVolts = 0.91;
    this.kVVoltSecondPerM = 1.53;
    this.kAVoltSecondSquaredPerM = 0.09;
    
    //Maximum height the elevator travels to
    this.heightM = heightM;

    this.state = [0, 0];

    this.systemNoise = false;
    // Simulate half volt std dev system noise at sim loop update frequency
    this.gaussianNoise = gaussian(0, 0.5);
  }

  acceleration([posM, velMPerS], inputVolts) {
    if (this.systemNoise) {
      inputVolts += this.gaussianNoise();
    }

    const gravityAcceleration = -this.kGVolts / this.kAVoltSecondSquaredPerM;
    const EMFAcceleration = -this.kVVoltSecondPerM * velMPerS / this.kAVoltSecondSquaredPerM;
    const controlEffortAcceleration = inputVolts / this.kAVoltSecondSquaredPerM;

    var springAccel = 0.0;
    var dashpotAccel = 0.0;

    //Apply hard-stops as a combo spring + dashpot
    if(posM > this.heightM){
      //Top limit
      springAccel = (posM - this.heightM) * -100000.0;
      dashpotAccel = -100.0 * velMPerS;
    } else if(posM < 0.0){
      //Bottom limit
      springAccel = (posM) * -100000.0;
      dashpotAccel = -100.0 * velMPerS;
    }

    const accelMPerSSquared = gravityAcceleration + EMFAcceleration + controlEffortAcceleration + springAccel + dashpotAccel;  


    return [velMPerS, accelMPerSSquared]
  }
  
  reset() {
    this.state = [0, 0];
  }

  update(inputVolts) {
    // Simulate system noise
    if (this.systemNoise && inputVolts > 0) {
      // apply system noise
      inputVolts += this.gaussianNoise();
    }

    this.state =
      secondOrderRK4((state, inputVolts) => this.acceleration(state, inputVolts),
      this.state,
      inputVolts,
      this.TimestepS);
  }

  getPositionM() {
    return this.state[0];
  }

  setSystemNoise(enabled) {
    this.systemNoise = enabled;
  }
}

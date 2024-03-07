class VerticalElevatorPlant {
  constructor(TimestepS) {
    this.TimestepS = TimestepS;

    // Gains estimated by ReCalc (http://reca.lc) with the specs below
    // motor: 1x REV Neo
    // gearing: 100:1
    // Pulley Diameter: TBD
    // efficiency: 100
    // moving mass: 5 kg
    this.kGVolts = 1.75;
    this.kVVoltSecondPerM = 1.95;
    this.kAVoltSecondSquaredPerM = 0.18;

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
    const accelMPerSSquared = gravityAcceleration + EMFAcceleration + controlEffortAcceleration;

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

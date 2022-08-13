class TurretPlant {
  constructor(TimestepS) {
    this.TimestepS = TimestepS;

    // Gains estimated by ReCalc (http://reca.lc) with the specs below
    // Vertical arm simulator used with kG ignored
    // motor: 1x REV Neo 550
    // gearing: 100:1
    // efficiency: 100
    // effective turret radius: 0.25 meters
    // effective turrent point mass: 1 kg
    this.kVVoltSecondPerRad = 0.2;
    this.kAVoltSecondSquaredPerRad = 0.03;

    this.state = [0, 0];

    this.systemNoise = false;
    // Simulate half volt std dev system noise at sim loop update frequency
    this.gaussianNoise = gaussian(0, 0.5);
  }

  acceleration([posRad, velRadPerS], inputVolts) {
    if (this.systemNoise) {
      inputVolts += this.gaussianNoise();
    }

    const EMFAcceleration = -this.kVVoltSecondPerRad * velRadPerS / this.kAVoltSecondSquaredPerRad;
    const controlEffortAcceleration = inputVolts / this.kAVoltSecondSquaredPerRad;
    const accelRadPerSSquared = EMFAcceleration + controlEffortAcceleration;

    return [velRadPerS, accelRadPerSSquared]
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

  getPositionRad() {
    return this.state[0];
  }

  setSystemNoise(enabled) {
    this.systemNoise = enabled;
  }
}

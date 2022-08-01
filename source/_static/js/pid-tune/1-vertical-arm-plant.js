class VerticalArmPlant {
  constructor() {
    // Constants related to plant model
    // Gearbox
    let GEARBOX_RATIO = 50.0 / 1.0; //output over input - 50:1 gear ratio

    // 775 Pro Motor
    let Rc = 0.08; // Coil & Wiring Resistance in Ohms
    let Kt = 0.71 / 134; // Nm/A torque constant -  Calculated from Stall Torque/Stall Current
    let Kv = (12 - 0.7 * Rc) / ((18730 * 2 * Math.PI) / 60); //V/(rad/s). Calculated from Vemf@FreeSpeed/(2pi/60*RPM@FreeSpeed). Steady-state Vemf = Vs - I@FreeSpeed*Rc, for Vs = 12

    // Arm assembly
    let mass = 2.0; // arm end effector mass in Kg
    let radius = 0.6096; // 2 ft arm length, converted to meters
    let muKinetic = 1.25; // rotational kinetic friction coefficient in N/(rad/sec)

    // Previous state
    this.posPrevRad = 0;
    this.posPrevPrevRad = 0;

    // TODO: better comment and descriptive variable naming
    // Constants from the blog post equations
    this.C1 = (GEARBOX_RATIO * Kt) / (mass * radius * radius * Rc);
    this.C2 =
      (Kt * Kv) / (mass * radius * radius * Rc) +
      muKinetic / (mass * radius * radius);
    this.C3 = 9.81 / (radius * radius);

    this.systemNoise = false;
    // Simulate 4 volt std dev system noise at the loop update frequency
    this.gaussianNoise = gaussian(0, 4);
  }

  init(TimestepS) {
    //Previous state
    this.posPrevRad = 0;
    this.posPrevPrevRad = 0;
    this.TimestepS = TimestepS;
  }

  update(inputVolts) {
    // Simulate system noise
    if (this.systemNoise && inputVolts > 0) {
      // apply system noise
      inputVolts += this.gaussianNoise();
    }

    //Run plant model simulation
    this.curPosRad =
      (1 / (this.TimestepS * this.C2 + 1)) *
      (this.TimestepS * this.TimestepS * this.C1 * inputVolts -
        this.TimestepS * this.TimestepS * this.C3 * Math.cos(this.posPrevRad) +
        this.posPrevRad * (this.TimestepS * this.C2 + 2) -
        this.posPrevPrevRad);

    //Shift
    this.posPrevPrevRad = this.posPrevRad;
    this.posPrevRad = this.curPosRad;
  }

  getPositionRad() {
    return this.curPosRad;
  }

  setSystemNoise(enabled) {
    this.systemNoise = enabled;
  }
}

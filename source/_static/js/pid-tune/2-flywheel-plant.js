class FlywheelPlant{

    constructor() {

        // Constants related to plant model
        // Flywheel

        let mass = 0.55; //shooter wheel mass in Kg
        let radius = 0.0762; //3 inch radius, converted to meters

        // Gearbox
        let GEARBOX_RATIO = 5.0/1.0; // output over input - 5:1 gear ratio

        // 775 Pro Motor
        let Rc = 0.08; // Coil & Wiring Resistance in Ohms
        let Kt = 0.71/134; // Nm/A torque constant -  Calculated from Stall Torque/Stall Current
        let Kv = (12-(0.7*Rc))/(18730*2*3.14159/60); // V/(rad/s). Calculated from Vemf@FreeSpeed/(2pi/60*RPM@FreeSpeed). Steady-state Vemf = Vs - I@FreeSpeed*Rc, for Vs = 12

        // TODO: better comment and descriptive variable naming
        // Constants from the blog post equations
        this.C1 = 2 *  Kt / (mass * radius * radius * GEARBOX_RATIO * Rc);
        this.C2 = 2 * Kv * Kt / (mass * radius * radius * Rc);
        this.C3 = 2 / (mass * radius * radius);

        this.systemNoise = false;
        // Simulate 4 volt std dev system noise at the loop update frequency
        this.gaussianNoise = gaussian(0, 4);
    }

    init(Ts) {
        this.speed = 0;
        this.speedPrev = 0;
        this.curpositionRev = 0;
        this.Ts = Ts;
        this.ballEnterTime = 5.0;
        this.ballExitTime = null; // gets filled out if the ball does indeed exit in this sim.
        this.ballEnterWheelAngle = null;
    }

    update(t, inVolts) {
        //Simulate friction
        let extTrq = 0.0005*this.speedPrev;

        // Simulate system noise
        if (this.systemNoise && inVolts > 0) {
            // apply system noise
            inVolts += this.gaussianNoise();
        }

        if (t > this.ballEnterTime & this.ballExitTime == null){
            // ball is in contact with the flywheel

            if (this.ballEnterWheelAngle == null) {
                // First loop, init the enter angle
                this.ballEnterWheelAngle = this.curpositionRev;
            } 
            
            if (this.curpositionRev > this.ballEnterWheelAngle + 0.25) {
                // ball has just exited the flywheel.
                this.ballExitTime = t;
            } else {
                // ball is exerting force on the shooter wheel
                extTrq += this.speedPrev * 0.008;
            }
        }

        // Simulate main Plant behavior
        this.speed = (this.Ts*this.C1*inVolts - this.Ts*this.C3*extTrq + this.speedPrev)/(1+this.Ts*this.C2);
        if(this.speed < 0) {
            this.speed = 0;
        }

        this.curpositionRev += this.speed / 2.0 / Math.PI * this.Ts;

        this.speedPrev = this.speed;

    }

    getCurrentSpeedRPM() {
        return this.speed*60/2/Math.PI;
    }

    getCurrentPositionRad() {
        return this.curpositionRev * 2.0 * Math.PI;
    }
    

    getBallEnterTime() {
        return this.ballEnterTime;
    }

    setSystemNoise(enabled) {
        this.systemNoise = enabled;
    }
}
class FlywheelPlant{

    constructor(){

        // User-configured plant model things
        this.injectBall = true;

        //Constants related to plant model
        //Gearbox
        var GEARBOX_RATIO = 50.0/10.0; //output over input - 5:1 gear ratio

        //775 Pro Motor
        var Rc = 0.08; //Coil & Wiring Resistance in Ohms
        var Kt = 0.71/134; //Nm/A torque constant -  Calculated from Stall Torque/Stall Current
        var Kv = (12-(0.7*Rc))/(18730*2*3.14159/60); //V/(rad/s). Calculated from Vemf@FreeSpeed/(2pi/60*RPM@FreeSpeed). Steady-state Vemf = Vs - I@FreeSpeed*Rc, for Vs = 12
        var mass = 0.55; //shooter wheel mass in Kg
        var radius = 0.0762; //3 inch radius, converted to meters

        // Constants from the blog post equations
        this.C1 = 2 *  Kt / (mass * radius * radius * GEARBOX_RATIO * Rc);
        this.C2 = 2 * Kv * Kt / (mass * radius * radius * Rc);
        this.C3 = 2 / (mass * radius * radius);
    }

    init(Ts){
        this.speed = 0;
        this.speedPrev = 0;
        this.curPosRev = 0;
        this.Ts = Ts;
    }

    update(t, inVolts){
        //Simulate friction
        var extTrq = 0.0005*this.speedPrev;
        if(this.injectBall & t > 5.0 & t < 5.05){
            //add a short "impulse" to simulate putting a ball into the shooter
            extTrq += 2;
        }

        //Simulate main Plant behavior
        this.speed = (this.Ts*this.C1*inVolts - this.Ts*this.C3*extTrq + this.speedPrev)/(1+this.Ts*this.C2);
        if(this.speed < 0){
            this.speed = 0;
        }

        this.curPosRev += this.speed / 2.0 / Math.PI * this.Ts;


        this.speedPrev = this.speed;

    }

    getCurSpeedRPM(){
        return this.speed*60/2/Math.PI;
    }

    getCurPosRev(){
        return this.curPosRev;
    }

}
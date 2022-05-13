class VerticalArmPlant{
    constructor(){

        //Constants related to plant model
        //Gearbox
        var GEARBOX_RATIO = 500.0/10.0; //output over input - 50:1 gear ratio

        //775 Pro Motor
        var Rc = 0.08; //Coil & Wiring Resistance in Ohms
        var Kt = 0.71/134; //Nm/A torque constant -  Calculated from Stall Torque/Stall Current
        var Kv = (12-(0.7*Rc))/(18730*2*Math.PI/60); //V/(rad/s). Calculated from Vemf@FreeSpeed/(2pi/60*RPM@FreeSpeed). Steady-state Vemf = Vs - I@FreeSpeed*Rc, for Vs = 12

        
        //Arm assembly
        var mass = 2.0; //arm end effector mass in Kg
        var radius = 0.6096; //2 ft arm length, converted to meters
        var muKinetic = 1.25; // rotational kinetic friction coefficient in N/(rad/sec)

        //Previous state
        this.posPrevRad = 0;
        this.posPrevPrevRad = 0;

        // Constants from the blog post equations
        this.C1 = GEARBOX_RATIO * Kt/(mass*radius*radius*Rc);
        this.C2 = Kt*Kv/(mass*radius*radius*Rc) + muKinetic/(mass*radius*radius)
        this.C3 = 9.81/(radius * radius);

    }

    init(Ts){
        //Previous state
        this.posPrevRad = 0;
        this.posPrevPrevRad = 0;
        this.Ts = Ts;


    }

    update(t, inVolts){
        //Run plant model simulation
        this.curPosRad = 1/(this.Ts*this.C2 + 1) * ( this.Ts*this.Ts*this.C1*inVolts - this.Ts*this.Ts*this.C3*Math.cos(this.posPrevRad) + this.posPrevRad*(this.Ts*this.C2 + 2) - this.posPrevPrevRad );
        
        //Shift
        this.posPrevPrevRad = this.posPrevRad;
        this.posPrevRad = this.curPosRad ;

    }

    getCurPosRad(){
        return this.curPosRad;
    }

}
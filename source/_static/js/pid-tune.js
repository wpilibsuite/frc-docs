
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Signal Processing Uilities
//////////////////////////////////////////////////////////////////////////////////////////////////////

class DelayLine
{
    constructor(num_samples)
    {
        this.items = [];
        this.desLen = num_samples;
    }
    
    addSample(val)
    {
        this.items.push(val)
        this.num_samples++;
    }

    getSample(val)
    {
        if(this.items.length >= this.desLen){
            return this.items.shift()
        } else {
            return 0;
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Graphing Utilities
//////////////////////////////////////////////////////////////////////////////////////////////////////

class ControlsViz {

    constructor(div_id_prefix, stateUnits) {
        this.speedGraph = null;
        this.voltsGraph = null;
        this.plotDrawDiv = document.getElementById(div_id_prefix + "_plot");

        this.chart = new Highcharts.Chart(this.plotDrawDiv, dflt_options);

        this.chart.yAxis[0].setTitle({ text: stateUnits });

        this.timeSamples = [];
        this.outputSamples = [];

        this.maxTime = 1.0;

        this.vizDrawDiv = document.getElementById(div_id_prefix + "_viz");

        this.animationStart = null;
        window.requestAnimationFrame((t)=>this.animationStep(t));

    }

    animationStep(timestamp) {

        var curTime = timestamp / 1000.0;

        if (this.animationStart === null) {
            this.animationStart = curTime;
        }

        var animationTime = curTime - this.animationStart;
        if (animationTime > this.simEndTime) {
            this.animationStart = curTime;
            animationTime = 0.0;
        }

        this.drawAnimation(animationTime);

        window.requestAnimationFrame((t)=>this.animationStep(t));

    }


    addCtrlEffortData(time, value) {
        this.chart.series[2].addPoint([time, value], false, false, true);
        this.maxTime = Math.max(time, this.maxTime);
        this.chart.xAxis[0].setExtremes(0.0, this.maxTime, false);
    }

    addOutputData(time, value) {
        this.chart.series[0].addPoint([time, value], false, false, true);
        this.maxTime = Math.max(time, this.maxTime);
        this.chart.xAxis[0].setExtremes(0.0, this.maxTime, false);
        this.timeSamples.push(time);
        this.outputSamples.push(value);
    }

    addSetpointData(time, value) {
        this.chart.series[1].addPoint([time, value], false, false, true);
        this.maxTime = Math.max(time, this.maxTime);
        this.chart.xAxis[0].setExtremes(0.0, this.maxTime, false);
    }

    redraw() {
        this.chart.redraw();
    }

    clear() {
        this.chart.series[0].setData([]);
        this.chart.series[1].setData([]);
        this.chart.series[2].setData([]);
        this.maxTime = 1.0;
        this.timeSamples = [];
        this.outputSamples = [];
    }
}

class FlywheelViz extends ControlsViz {

    constructor(div_id_prefix) {

        super(div_id_prefix, "RPM");

        this.simEndTime = 10.0;
        this.simTs = 0.01;

        // User-configured setpoints
        this.setpointVal = 1000.0; 
        this.setpointStepTime = 1.0;

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

    runSim(){

        var Ts = 0.001;
        var inVolts = 0.0;
        var speedPrev = 0;
        var nextControllerRunTime = 0;

        var speed_delay_line = new DelayLine(49); //models sensor lag


        this.clear();

        for(var t = 0.0; t < this.simEndTime; t += Ts){

            var curSetpoint = 0.0;
            if(t > this.setpointStepTime){
                curSetpoint = this.setpointVal;
            }

            var meas_speed = speed_delay_line.getSample();

            //Simulate Controller
            if(t >= nextControllerRunTime){
                inVolts = this.controllerUpdate(t, curSetpoint, meas_speed);
                //Maintain separate sample rate for controller
                nextControllerRunTime += this.ctrl_Ts;
            }

                
            //Simulate friction
            var extTrq = 0.0005*speedPrev;
            if(t > 5.0 & t < 5.05){
                //add a short "impulse" to simulate putting a ball into the shooter
                extTrq += 2;
            }

            //Simulate main Plant behavior
            var speed = (Ts*this.C1*inVolts - Ts*this.C3*extTrq + speedPrev)/(1+Ts*this.C2);
            speedPrev = speed;

            var speed_rpm = speed*60/2/3.14159;

            this.addCtrlEffortData(t, inVolts);
            this.addOutputData(t, speed_rpm);
            this.addSetpointData(t, curSetpoint);

            speed_delay_line.addSample(speed_rpm);


        }

        this.redraw();

    }

    drawAnimation(time) {

    }

}

class FlywheelBangBang extends FlywheelViz {

    constructor(div_id_prefix) {

        super(div_id_prefix);

        this.ctrl_Ts = 0.02;

    }

    controllerUpdate(time, setpoint, output){
        //bang-bang control
        if(output < setpoint){
            return 12.0;
        } else {
            return 0.0;
        }
    }

}

class FlywheelPIDF extends FlywheelViz {

    constructor(div_id_prefix) {

        super(div_id_prefix);

        this.ctrl_Ts = 0.02;

        this.err_accum = 0.0;
        this.err_prev = 0.0;

        //User-configured feedback
        this.kP = 0.2;
        this.kI = 0.0;
        this.kD = 0.0;

        //User-configured Feed-Forward
        this.kV = 0.0;
        this.kS = 0.0;


    }

    controllerUpdate(time, setpoint, output){
            
        //Calculate error, error derivative, and error integral
        var error = (setpoint - output)*2*3.14159/60;
        
        this.err_accum += (error)*this.ctrl_Ts;

        var err_delta = (error - this.err_prev)/this.ctrl_Ts;

        //PID + kv/ks control law
        var ctrlEffort = this.kV * setpoint + 
                            this.kS * Math.sign(setpoint) + 
                            this.kP * error  +  
                            this.kI * this.err_accum  +  
                            this.kD * err_delta;

        //Cap voltage at max/min of the physically possible command
        if(ctrlEffort > 12){
            ctrlEffort = 12;
        } else if (ctrlEffort < 0){
            ctrlEffort = 0;
        }

        this.err_prev = error;
        
        return ctrlEffort;
    }

}


window.onload = function () {
    // set up all visualizations

    flywheel_pid = new FlywheelPIDF("flywheel_pid");
    flywheel_pid.runSim();

    flywheel_bb = new FlywheelBangBang("flywheel_bb");
    flywheel_bb.runSim();
}





/**************************************************************************************
 ** HIGHCHARTS SUPPORT & CONFIG
 **************************************************************************************/

var dflt_options = {

    credits: {
        enabled: false
    },

    chart: {
        zoomType: null,
        animation: false,
        ignoreHiddenSeries: true,
        panning: false,
        showAxes: true,
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
                [0, 'rgb(0, 0, 0)'], //Yes, both black. Just in case I decide to change back....
                [1, 'rgb(0, 0, 0)']
            ]
        },
    },

    title: {
        //disable title
        text: null,
    },

    xAxis: {
        type: 'linear',
        title: 'Time (sec)',
        lineColor: '#777',
        tickColor: '#444',
        gridLineColor: '#444',
        gridLineWidth: 1,
        labels: {
            style: {
                color: '#DDD',
                fontWeight: 'bold'
            },
        },
        title: {
            style: {
                color: '#D43',
            },
        },
    },

    yAxis: [{
        title: {
            text: "State",
            style: {
                color: '#DDD',
            },
        },
        showEmpty: true,
        lineColor: '#777',
        tickColor: '#444',
        gridLineColor: '#444',
        gridLineWidth: 1,
        labels: {
            style: {
                color: '#DDD',
                fontWeight: 'bold'
            },
        },
    },
    {
        title: {
            text: "Voltage",
            style: {
                color: '#DDD',
            },
        },
        showEmpty: true,
        lineColor: '#777',
        tickColor: '#444',
        gridLineColor: '#444',
        gridLineWidth: 1,
        labels: {
            style: {
                color: '#DDD',
                fontWeight: 'bold'
            },
        },
        opposite: true,
    }
    ],

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        borderWidth: 1,
        floating: true,
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: '#DDD'
        },
        itemHoverStyle: {
            color: 'gray'
        }

    },

    exporting: {
        enabled: false
    },

    colors: ['#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#00FFFF', '#FFFF00'],

    plotOptions: {
        line: {
            marker: {
                radius: 2
            },
            lineWidth: 1,
            threshold: null,
            animation: false,
        }
    },
    tooltip: {
        crosshairs: true,
        hideDelay: 0,
        shared: true,
        backgroundColor: null,
        snap: 30,
        borderWidth: 1,
        borderColor: '#FF0000',
        shadow: true,
        animation: false,
        useHTML: false,
        style: {
            padding: 0,
            color: '#D43',
        }
    },

    series: [
        {
            name: "Output",
            data: [],
            visible: true,
            visibility_counter: 0,
            yAxis: 0,
            states: {
                hover: {
                    enabled: false
                },
            },
            marker: {
                enabled: null
            },
        },

        {
            name: "Setpoint",
            data: [],
            visible: true,
            visibility_counter: 0,
            yAxis: 0,
            states: {
                hover: {
                    enabled: false
                },
            },
            marker: {
                enabled: null
            },
        },

        {
            name: "Control Effort",
            data: [],
            visible: true,
            visibility_counter: 0,
            yAxis: 1,
            states: {
                hover: {
                    enabled: false
                },
            },
            marker: {
                enabled: null
            },
        },

    ]
}

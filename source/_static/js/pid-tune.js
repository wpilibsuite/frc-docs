
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

        this.timeSamples = Array(0, this.simEndTime / this.Ts);
        this.outputSamples = Array(0, this.simEndTime / this.Ts);
        this.setpointSamples = Array(0, this.simEndTime / this.Ts);
        this.ctrlEffortSamples = Array(0, this.simEndTime / this.Ts);

        this.vizDrawDiv = document.getElementById(div_id_prefix + "_viz");

        this.animationStart = null;
        window.requestAnimationFrame((t)=>this.animationStep(t));

        this.ctrlsDrawDiv = document.getElementById(div_id_prefix + "_ctrls");

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


    setCtrlEffortData(data) {
        this.chart.series[2].setData(data, false, false, true);
    }

    setOutputData(data) {
        this.chart.series[0].setData(data, false, false, true);
    }

    setSetpointData(data) {
        this.chart.series[1].setData(data, false, false, true);
    }

    redraw() {
        this.chart.xAxis[0].setExtremes(0.0, this.simEndTime, false);
        this.chart.redraw();
    }

    clear() {

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

        var idx = 0;

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
            if(speed < 0){
                speed = 0;
            }
            speedPrev = speed;

            var speed_rpm = speed*60/2/3.14159;

            speed_delay_line.addSample(speed_rpm);

            this.timeSamples[idx] = t;
            this.ctrlEffortSamples[idx] = inVolts;
            this.outputSamples[idx] = speed_rpm;
            this.setpointSamples[idx] = curSetpoint;

            idx++;
        }

        var ctrlEffortPlotData = Array(null, this.timeSamples.length);
        var outputPlotData = Array(null, this.timeSamples.length);
        var setpointPlotData = Array(null, this.timeSamples.length);
        for(var idx = 0; idx < this.timeSamples.length; idx++){
            ctrlEffortPlotData[idx] = [ this.timeSamples[idx], this.ctrlEffortSamples[idx] ];
            outputPlotData[idx] = [ this.timeSamples[idx], this.outputSamples[idx] ];
            setpointPlotData[idx] = [ this.timeSamples[idx], this.setpointSamples[idx] ];
        }
        this.setCtrlEffortData(ctrlEffortPlotData);
        this.setSetpointData(setpointPlotData);
        this.setOutputData(outputPlotData);

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
        this.kP = 0.0;
        this.kI = 0.0;
        this.kD = 0.0;

        //User-configured Feed-Forward
        this.kV = 0.0;
        this.kS = 0.0;

        this.ctrlsInit();


    }

    ctrlsInit(){

        let ctrlTable =  document.createElement("table");
        this.ctrlsDrawDiv.appendChild(ctrlTable);

        let curRow = document.createElement("tr");
        ctrlTable.appendChild(curRow);

        let btn = document.createElement("button");
        btn.innerHTML = "Double kP";
        btn.onclick = function () {
            if(this.kP == 0){
                this.kP = 0.001;
            } else {
                this.kP *= 2.0;
            }
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

        btn = document.createElement("button");
        btn.innerHTML = "Half kP";
        btn.onclick = function () {
            this.kP *= 0.5;
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

        btn = document.createElement("button");
        btn.innerHTML = "Bump Up kP";
        btn.onclick = function () {
            this.kP *= 1.1;
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

        btn = document.createElement("button");
        btn.innerHTML = "Bump Down kP";
        btn.onclick = function () {
            this.kP *= 0.9;
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

        curRow = document.createElement("tr");
        ctrlTable.appendChild(curRow);

        btn = document.createElement("button");
        btn.innerHTML = "Double kD";
        btn.onclick = function () {
            if(this.kD == 0){
                this.kD = 0.001;
            } else {
                this.kD *= 2.0;
            }            
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

        btn = document.createElement("button");
        btn.innerHTML = "Half kD";
        btn.onclick = function () {
            this.kD *= 0.5;
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

        btn = document.createElement("button");
        btn.innerHTML = "Bump Up kD";
        btn.onclick = function () {
            this.kD *= 1.1;
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

        btn = document.createElement("button");
        btn.innerHTML = "Bump Down kD";
        btn.onclick = function () {
            this.kD *= 0.9;
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

        curRow = document.createElement("tr");
        ctrlTable.appendChild(curRow);

        btn = document.createElement("button");
        btn.innerHTML = "Double kI";
        btn.onclick = function () {
            if(this.kI == 0){
                this.kI = 0.001;
            } else {
                this.kI *= 2.0;
            }            
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

        btn = document.createElement("button");
        btn.innerHTML = "Half kI";
        btn.onclick = function () {
            this.kI *= 0.5;
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

        btn = document.createElement("button");
        btn.innerHTML = "Bump Up kI";
        btn.onclick = function () {
            this.kI *= 1.1;
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

        btn = document.createElement("button");
        btn.innerHTML = "Bump Down kI";
        btn.onclick = function () {
            this.kI *= 0.9;
            this.runSim();
        }.bind(this);
        curRow.appendChild(btn);

    }

    controllerUpdate(time, setpoint, output){

        //Handle Init
        if(time == 0.0){
            this.err_accum = 0.0;
            this.err_prev = 0.0;
        }
            
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
                [0, 'rgb(255,255,255)'], //Yes, both black. Just in case I decide to change back....
                [1, 'rgb(255,255,255)']
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
        lineColor: '#000',
        tickColor: '#000',
        gridLineColor: '#BBB',
        gridLineWidth: 1,
        labels: {
            style: {
                color: '#222',
                fontWeight: 'bold'
            },
        },
        title: {
            style: {
                color: '#222',
            },
        },
    },

    yAxis: [{
        title: {
            text: "State",
            style: {
                color: '#222',
            },
        },
        showEmpty: true,
        lineColor: '#000',
        tickColor: '#000',
        gridLineColor: '#bbb',
        gridLineWidth: 1,
        labels: {
            style: {
                color: '#888',
                fontWeight: 'bold'
            },
        },
    },
    {
        title: {
            text: "Voltage",
            style: {
                color: '#888',
            },
        },
        showEmpty: true,
        lineColor: '#000',
        tickColor: '#000',
        gridLineColor: '#bbb',
        gridLineWidth: 1,
        labels: {
            style: {
                color: '#888',
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
        backgroundColor:  '#ddd',
        floating: true,
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: '#222'
        },

    },

    exporting: {
        enabled: false
    },

    colors: ['#FF0000', '#0000FF', '#00BB00', '#FF00FF', '#00FFFF', '#FFFF00'],

    plotOptions: {
        line: {
            marker: {
                radius: 2
            },
            lineWidth: 3,
            threshold: null,
            animation: true,
        }
    },
    tooltip: {
        crosshairs: true,
        hideDelay: 0,
        shared: true,
        backgroundColor: '#ddd',
        snap: 30,
        borderWidth: 1,
        borderColor:  '#ddd',
        shadow: true,
        animation: false,
        useHTML: false,
        style: {
            padding: 0,
            color: '#000',
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

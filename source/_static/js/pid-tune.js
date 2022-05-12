
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

class FlywheelViz {
    constructor(div_in){

        this.drawDiv = div_in;

        div_in.style.position = "relative";

        this.ca = document.createElement("canvas")
        this.cas = document.createElement("canvas")

        this.cas.style.border = "1px solid #000000";
        this.cas.style.position = "absolute";
        this.cas.style.top = "0px";
        this.cas.style.left = "0px";

        this.ca.style.position = "absolute";
        this.ca.style.top = "0px";
        this.ca.style.left = "0px";


        this.ctxa = this.ca.getContext("2d");
        this.ctxs = this.cas.getContext("2d");

        div_in.appendChild(this.cas);
        div_in.appendChild(this.ca);

        this.updateSize();

        window.addEventListener('resize', this.updateSize.bind(this));
        window.addEventListener('load', this.updateSize.bind(this));

    }

    updateSize(){
        this.width = this.drawDiv.offsetWidth;
        this.height = this.drawDiv.offsetHeight ;
        this.cas.width = this.width;
        this.cas.height = this.height;
        this.ca.width = this.width;
        this.ca.height = this.height;
        this.drawStatic();
    }

    setData(time, posRev){
        this.posRev = posRev;
        this.time = time;
    }

    drawStatic(){

        this.ctxs.clearRect(0,0,this.width,this.height);

        //Wheel
        this.ctxs.lineWidth = 4;
        this.ctxs.fillStyle="#DDDDDD"
        this.ctxs.strokeStyle = '#000000';
        this.ctxs.beginPath();
        this.ctxs.arc(0.5*this.width, 0.5*this.height, 0.25*this.height, 0, 2 * Math.PI, false);
        this.ctxs.fill();
        this.ctxs.stroke();

    }

    drawDynamic(timeIdx){
        var pos = this.posRev[timeIdx]; //make it look nice
        this.ctxa.clearRect(0,0,this.width,this.height);

        var indLen = this.height * 0.25;

        var indStartX = 0.5*this.width;
        var indStartY = 0.5*this.height;


        var numSegments = 5;
        var segWidthRad = 0.3;

        for(var segIdx = 0; segIdx < numSegments; segIdx ++){

            var offset = segIdx * Math.PI * 2 / numSegments;

            this.ctxa.lineWidth = 4;
            this.ctxa.strokeStyle = '#000000';
            if(offset == 0){
                this.ctxa.fillStyle="#FF0000";
            } else {
                this.ctxa.fillStyle="#000000";
            }
            this.ctxa.beginPath();
            this.ctxa.moveTo(indStartX,indStartY);
            this.ctxa.arc(indStartX, indStartY, indLen, offset + pos - segWidthRad/2.0, offset + pos + segWidthRad/2.0, false);
            this.ctxa.closePath();
            this.ctxa.stroke();
            this.ctxa.fill();
        }

        //Center Hub
        this.ctxa.lineWidth = 1;
        this.ctxa.fillStyle="#000000"
        this.ctxa.strokeStyle = '#000000';
        this.ctxa.beginPath();
        this.ctxa.arc(0.5*this.width, 0.5*this.height, 0.05*this.height, 0, 2 * Math.PI, false);
        this.ctxa.fill();

        //Time Indicator
        var time_sec = this.time[timeIdx];
        this.ctxa.fillStyle="#000000"
        this.ctxa.font = "bold 20px Arial";
        this.ctxa.fillText("t = " + time_sec.toFixed(2) + " sec", 0.05*this.width, 0.15*this.height); 
        //Progress bar
        this.ctxa.fillStyle="#0000FF"
        this.ctxa.fillRect(0.0*this.width, 0.0*this.height, ((timeIdx)/(this.time.length))*this.width, 0.02*this.height);
            
    }
}

class VerticalArmViz {
    constructor(div_in){

        this.drawDiv = div_in;

        div_in.style.position = "relative";
        div_in.style.maxWidth = "500px";

        this.ca = document.createElement("canvas")
        this.cas = document.createElement("canvas")

        this.cas.style.border = "1px solid #000000";
        this.cas.style.position = "absolute";
        this.cas.style.top = "0px";
        this.cas.style.left = "0px";

        this.ca.style.position = "absolute";
        this.ca.style.top = "0px";
        this.ca.style.left = "0px";

        this.ctxa = this.ca.getContext("2d");
        this.ctxs = this.cas.getContext("2d");

        div_in.appendChild(this.cas);
        div_in.appendChild(this.ca);

        this.teamNum = Math.floor(Math.random() * 9999).toFixed(0);

        this.updateSize();

        window.addEventListener('resize', this.updateSize.bind(this));
        window.addEventListener('load', this.updateSize.bind(this));

    }

    updateSize(){
        this.width = this.drawDiv.offsetWidth;
        this.height = this.drawDiv.offsetHeight ;
        this.cas.width = this.width;
        this.cas.height = this.height;
        this.ca.width = this.width;
        this.ca.height = this.height;
        this.drawStatic();
    }

    setData(time, posRev){
        this.posRev = posRev;
        this.time = time;
    }

    drawStatic(){

        this.ctxs.clearRect(0,0,this.width,this.height);


        //Supports
        this.ctxs.lineWidth = 5;
        this.ctxs.strokeStyle = '#000000';
        this.ctxs.beginPath();
        this.ctxs.moveTo(this.width/2, this.height/2);
        this.ctxs.lineTo(0.3*this.width, 0.9*this.height);
        this.ctxs.stroke();
        this.ctxs.beginPath();
        this.ctxs.moveTo(this.width/2, this.height/2);
        this.ctxs.lineTo(0.7*this.width, 0.9*this.height);
        this.ctxs.stroke();

        //Wheels
        this.ctxs.lineWidth = 5;
        this.ctxs.fillStyle="#000000"
        this.ctxs.strokeStyle = '#444444';
        this.ctxs.beginPath();
        this.ctxs.arc(0.2*this.width, 0.92*this.height, 0.06*this.height, 0, 2 * Math.PI, false);
        this.ctxs.fill();
        this.ctxs.stroke();
        this.ctxs.beginPath();
        this.ctxs.arc(0.5*this.width, 0.92*this.height, 0.06*this.height, 0, 2 * Math.PI, false);
        this.ctxs.fill();
        this.ctxs.stroke();
        this.ctxs.beginPath();
        this.ctxs.arc(0.8*this.width, 0.92*this.height, 0.06*this.height, 0, 2 * Math.PI, false);
        this.ctxs.fill();
        this.ctxs.stroke();

        //Bumpers
        this.ctxs.fillStyle="#FF0000"
        this.ctxs.fillRect(0.1*this.width, 0.88*this.height, 0.8*this.width, 0.07*this.height);
        this.ctxs.fillStyle="#FFFFFF"
        this.ctxs.font = "bold 22px Arial";
        this.ctxs.textAlign = "center";
        this.ctxs.fillText(this.teamNum, 0.5*this.width, 0.94*this.height); 

    }

    drawDynamic(timeIdx){
        var angleRev = this.posRev[timeIdx]; //make it look nice
        this.ctxa.clearRect(0,0,this.width,this.height);

        var armLenPx = Math.min(this.width,this.height)*0.40;

        var armStartX = 0.5*this.width;
        var armStartY = 0.5*this.height;
    
        var armEndX = armStartX + armLenPx*Math.cos(2*Math.PI*angleRev);
        var armEndY = armStartY - armLenPx*Math.sin(2*Math.PI*angleRev); //Cuz y axis inverted on graphics cuz computers
    
        //Arm
        this.ctxa.lineWidth = 6;
        this.ctxa.strokeStyle = '#22BB22';
        this.ctxa.beginPath();
        this.ctxa.moveTo(armStartX, armStartY);
        this.ctxa.lineTo(armEndX, armEndY);
        this.ctxa.stroke();
    
        //Shoulder Joint
        this.ctxa.beginPath();
        this.ctxa.arc(0.5*this.width, 0.5*this.height, 0.02*this.height, 0, 2 * Math.PI, false);
        this.ctxa.fillStyle = 'grey';
        this.ctxa.fill();
    
        //End Effector
        this.ctxa.beginPath();
        this.ctxa.arc(armEndX, armEndY, 0.035*this.height, 0, 2 * Math.PI, false);
        this.ctxa.fillStyle = '#990099';
        this.ctxa.fill();

        //Time Indicator
        var time_sec = this.time[timeIdx];
        this.ctxa.fillStyle="#000000"
        this.ctxa.font = "bold 20px Arial";
        this.ctxa.fillText("t = " + time_sec.toFixed(2) + " sec", 0.05*this.width, 0.15*this.height); 
        //Progress bar
        this.ctxa.fillStyle="#0000FF"
        this.ctxa.fillRect(0.0*this.width, 0.0*this.height, ((timeIdx)/(this.time.length))*this.width, 0.02*this.height);
            
    }
}

class ControlsSim {

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
        this.outputVizPosRevSamples = Array(0, this.simEndTime / this.Ts);

        this.vizDrawDiv = document.getElementById(div_id_prefix + "_viz");

        this.animationStart = null;
        window.requestAnimationFrame((t)=>this.animationStep(t));

        this.ctrlsDrawDiv = document.getElementById(div_id_prefix + "_ctrls");

        this.animationReset = true;

    }

    animationStep(timestamp) {

        var curTime = timestamp / 1000.0;

        if (this.animationReset) {
            this.animationStart = curTime;
            this.animationReset = false;
        }

        var animationTime = curTime - this.animationStart;
        if (animationTime > this.simEndTime) {
            this.animationStart = curTime;
            animationTime = 0.0;
        }

        var animationStep = Math.floor(animationTime / this.Ts);

        this.drawAnimation(animationStep);

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

class FlywheelSim extends ControlsSim {

    constructor(div_id_prefix) {

        super(div_id_prefix, "RPM");

        this.simEndTime = 10.0;
        this.Ts = 0.001;


        // User-configured setpoints
        this.setpointVal = 1000.0; 
        this.setpointStepTime = 1.0;

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

        this.viz = new FlywheelViz(this.vizDrawDiv);
        this.viz.drawStatic();

    }

    runSim(){

        var inVolts = 0.0;
        var speedPrev = 0;
        var nextControllerRunTime = 0;

        var curPosRev = 0;

        var speed_delay_line = new DelayLine(49); //models sensor lag


        this.clear();

        var idx = 0;

        for(var t = 0.0; t < this.simEndTime; t += this.Ts){

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
            if(this.injectBall & t > 5.0 & t < 5.05){
                //add a short "impulse" to simulate putting a ball into the shooter
                extTrq += 2;
            }

            //Simulate main Plant behavior
            var speed = (this.Ts*this.C1*inVolts - this.Ts*this.C3*extTrq + speedPrev)/(1+this.Ts*this.C2);
            if(speed < 0){
                speed = 0;
            }
            speedPrev = speed;

            var speed_rpm = speed*60/2/3.14159;

            curPosRev += speed_rpm / 60.0 * this.Ts;

            speed_delay_line.addSample(speed_rpm);

            this.timeSamples[idx] = t;
            this.ctrlEffortSamples[idx] = inVolts;
            this.outputSamples[idx] = speed_rpm;
            this.setpointSamples[idx] = curSetpoint;
            this.outputVizPosRevSamples[idx] = curPosRev;

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
        this.viz.setData(this.timeSamples, this.outputVizPosRevSamples);

        this.redraw();

    }

    drawAnimation(timeIdx) {
        this.viz.drawDynamic(timeIdx);
    }

}


class VerticalArmSim extends ControlsSim {

    constructor(div_id_prefix) {

        super(div_id_prefix, "Radians");

        this.simEndTime = 10.0;
        this.Ts = 0.001;


        // User-configured setpoints
        this.setpointVal = 0.1; 
        this.setpointStepTime = 1.0;

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

        this.viz = new VerticalArmViz(this.vizDrawDiv);
        this.viz.drawStatic();

    }

    runSim(){

        var inVolts = 0.0;
        var nextControllerRunTime = 0;

        var curPosRev = 0;

        //Previous state
        this.posPrevRad = 0;
        this.posPrevPrevRad = 0;

        var pos_delay_line = new DelayLine(10); //models sensor lag


        this.clear();

        var idx = 0;

        for(var t = 0.0; t < this.simEndTime; t += this.Ts){

            var curSetpoint = 0.0;
            if(t > this.setpointStepTime){
                curSetpoint = this.setpointVal;
            }

            var measPos = pos_delay_line.getSample();

            //Simulate Controller
            if(t >= nextControllerRunTime){
                inVolts = this.controllerUpdate(t, curSetpoint, measPos);
                //Maintain separate sample rate for controller
                nextControllerRunTime += this.ctrl_Ts;
            }

            //Run plant model simulation
            var curPosRad = 1/(this.Ts*this.C2 + 1) * ( this.Ts*this.Ts*this.C1*inVolts - this.Ts*this.Ts*this.C3*Math.cos(this.posPrevRad) + this.posPrevRad*(this.Ts*this.C2 + 2) - this.posPrevPrevRad );

            this.posPrevPrevRad = this.posPrevRad;
            this.posPrevRad = curPosRad;
            pos_delay_line.addSample(curPosRad);

            this.timeSamples[idx] = t;
            this.ctrlEffortSamples[idx] = inVolts;
            this.outputSamples[idx] = curPosRad;
            this.setpointSamples[idx] = curSetpoint;
            this.outputVizPosRevSamples[idx] = curPosRad/2/Math.PI;

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
        this.viz.setData(this.timeSamples, this.outputVizPosRevSamples);

        this.redraw();

    }

    drawAnimation(timeIdx) {
        this.viz.drawDynamic(timeIdx);
    }

}


class FlywheelBangBang extends FlywheelSim {

    constructor(div_id_prefix) {

        super(div_id_prefix);

        this.ctrl_Ts = 0.02;

        this.ctrlsInit();

    }

    ctrlsInit(){

        var curRow;
        var label;
        var control;
        var input;

        var ctrlTable =  document.createElement("table");
        ctrlTable.classList.add("controlTable");
        this.ctrlsDrawDiv.appendChild(ctrlTable);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "Setpoint";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "1000.0");
        input.setAttribute("step", "100.0");
        input.onchange = function (event) {
            this.animationReset = true;
            this.setpointVal = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "Inject Ball";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "checkbox");
        input.setAttribute("checked", true);
        input.onchange = function (event) {
            this.animationReset = true;
            this.injectBall = event.target.checked;
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

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

class FlywheelPIDF extends FlywheelSim {

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

        var curRow;
        var label;
        var control;
        var input;

        var ctrlTable =  document.createElement("table");
        ctrlTable.classList.add("controlTable");
        this.ctrlsDrawDiv.appendChild(ctrlTable);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "Setpoint";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "1000.0");
        input.setAttribute("step", "100.0");
        input.onchange = function (event) {
            this.animationReset = true;
            this.setpointVal = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "kP";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "0.0");
        input.setAttribute("step", "0.01");
        input.onchange = function (event) {
            this.animationReset = true;
            this.kP = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "kI";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "0.0");
        input.setAttribute("step", "0.01");
        input.onchange = function (event) {
            this.animationReset = true;
            this.kI = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "kD";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "0.0");
        input.setAttribute("step", "0.01");
        input.onchange = function (event) {
            this.animationReset = true;
            this.kD = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "kV";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "0.0");
        input.setAttribute("step", "0.01");
        input.onchange = function (event) {
            this.animationReset = true;
            this.kV = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "kS";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "0.0");
        input.setAttribute("step", "0.01");
        input.onchange = function (event) {
            this.animationReset = true;
            this.kS = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "Inject Ball";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "checkbox");
        input.setAttribute("checked", true);
        input.onchange = function (event) {
            this.animationReset = true;
            this.injectBall = event.target.checked;
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);


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

class VerticalArmPIDF extends VerticalArmSim {

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
        this.kcosFF = 0.0;

        this.ctrlsInit();


    }

    ctrlsInit(){

        var curRow;
        var label;
        var control;
        var input;

        var ctrlTable =  document.createElement("table");
        ctrlTable.classList.add("controlTable");
        this.ctrlsDrawDiv.appendChild(ctrlTable);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "Setpoint";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "0.1");
        input.setAttribute("step", "0.1");
        input.onchange = function (event) {
            this.animationReset = true;
            this.setpointVal = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "kP";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "0.0");
        input.setAttribute("step", "0.1");
        input.onchange = function (event) {
            this.animationReset = true;
            this.kP = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "kI";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "0.0");
        input.setAttribute("step", "0.1");
        input.onchange = function (event) {
            this.animationReset = true;
            this.kI = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "kD";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "0.0");
        input.setAttribute("step", "0.01");
        input.onchange = function (event) {
            this.animationReset = true;
            this.kD = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "kCosFF";
        control = document.createElement("td");
        ctrlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "number");
        input.setAttribute("value", "0.0");
        input.setAttribute("step", "0.1");
        input.onchange = function (event) {
            this.animationReset = true;
            this.kcosFF = parseFloat(event.target.value);
            this.runSim();
        }.bind(this);
        control.append(input)
        curRow.appendChild(label);
        curRow.appendChild(control);

    }

    controllerUpdate(time, setpoint, output){

        //Handle Init
        if(time == 0.0){
            this.err_accum = 0.0;
            this.err_prev = 0.0;
        }
            
        //Calculate error, error derivative, and error integral
        var error = (setpoint - output);
        
        this.err_accum += (error)*this.ctrl_Ts;

        var err_delta = (error - this.err_prev)/this.ctrl_Ts;

        //PID + cosine feed-forward control law
        var ctrlEffort = this.kcosFF * Math.cos(output) + 
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

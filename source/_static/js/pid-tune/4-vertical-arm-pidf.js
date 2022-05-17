
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
        input.setAttribute("step", "0.0000001");
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
        } else if (ctrlEffort < -12){
            ctrlEffort = -12;
        }

        this.err_prev = error;
        
        return ctrlEffort;
    }

}


class FlywheelBangBang extends FlywheelSim {

    constructor(div_id_prefix) {

        super(div_id_prefix);

        this.ctrl_Ts = 0.02;

        this.buildControlTable();

        this.begin();

    }

    buildControlTable(){

        let curRow;
        let label;
        let control;
        let input;

        let controlTable =  document.createElement("table");
        controlTable.classList.add("controlTable");
        this.controlDrawDiv.appendChild(controlTable);

        curRow = document.createElement("tr");
        label = document.createElement("td");
        label.innerHTML = "Setpoint";
        control = document.createElement("td");
        controlTable.appendChild(curRow);
        input = document.createElement("INPUT");
        input.setAttribute("type", "text");
        input.setAttribute("value", "300.0");
        //input.setAttribute("step", "10.0");
        input.onchange = function (event) {
            this.animationReset = true;
            this.setpointVal = parseFloat(event.target.value);
            this.begin();;
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


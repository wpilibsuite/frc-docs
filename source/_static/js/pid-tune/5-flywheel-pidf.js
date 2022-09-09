class FlywheelPIDF extends FlywheelSim {
  constructor(divIdPrefix, controlStrategy) {
    super(divIdPrefix);

    this.accumulatedError = 0.0;
    this.previousError = 0.0;

    // User-configured feedback
    this.kP = 0.0;
    this.kI = 0.0;
    this.kD = 0.0;

    // User-configured Feed-Forward
    this.kV = 0.0;
    this.kS = 0.0;

    // Can be "feedforward", "feedback", or "both"
    this.controlStrategy = controlStrategy;

    this.buildControlTable();

    this.begin();

  }

  buildControlTable() {
    let curRow;
    let label;
    let control;
    let input;

    let controlTable = document.createElement("table");
    controlTable.classList.add("controlTable");
    this.controlDrawDiv.appendChild(controlTable);

    curRow = document.createElement("tr");
    label = document.createElement("td");
    label.innerHTML = "System Noise";
    control = document.createElement("td");
    controlTable.appendChild(curRow);
    input = document.createElement("INPUT");
    input.setAttribute("type", "checkbox");
    input.setAttribute("value", "false");
    input.setAttribute("id", "systemNoise");
    input.onclick = function (event) {
      this.animationReset = true;
      this.plant.setSystemNoise(document.getElementById("systemNoise").checked);
      this.begin();
    }.bind(this);
    control.append(input);
    curRow.appendChild(label);
    curRow.appendChild(control);

    curRow = document.createElement("tr");
    label = document.createElement("td");
    label.innerHTML = "Setpoint";
    control = document.createElement("td");
    controlTable.appendChild(curRow);
    input = document.createElement("INPUT");
    input.setAttribute("type", "text");
    input.setAttribute("value", "300.0");
    //input.setAttribute("step", "10.0");
    //input.setAttribute("max", "1800.0");
    //input.setAttribute("min", "0.0");
    input.onchange = function (event) {
      this.animationReset = true;
      this.setpointVal = parseFloat(event.target.value);
      this.begin();
    }.bind(this);
    control.append(input);
    curRow.appendChild(label);
    curRow.appendChild(control);

    // Display feedforward gain inputs
    if (
      this.controlStrategy == "feedforward" ||
      this.controlStrategy == "both"
    ) {
      curRow = document.createElement("tr");
      label = document.createElement("td");
      label.innerHTML = "kV";
      control = document.createElement("td");
      controlTable.appendChild(curRow);
      input = document.createElement("INPUT");
      input.setAttribute("type", "text");
      input.setAttribute("value", "0.0");
      //input.setAttribute("step", "0.00001");
      input.onchange = function (event) {
        this.animationReset = true;
        this.kV = parseFloat(event.target.value);
        this.begin();
      }.bind(this);
      control.append(input);
      curRow.appendChild(label);
      curRow.appendChild(control);
    }

    if (this.controlStrategy == "feedback" || this.controlStrategy == "both") {
      curRow = document.createElement("tr");
      label = document.createElement("td");
      label.innerHTML = "kP";
      control = document.createElement("td");
      controlTable.appendChild(curRow);
      input = document.createElement("INPUT");
      input.setAttribute("type", "text");
      input.setAttribute("value", "0.0");
      //input.setAttribute("step", "0.001");
      input.onchange = function (event) {
        this.animationReset = true;
        this.kP = parseFloat(event.target.value);
        this.begin();
      }.bind(this);
      control.append(input);
      curRow.appendChild(label);
      curRow.appendChild(control);

      curRow = document.createElement("tr");
      label = document.createElement("td");
      label.innerHTML = "kI";
      control = document.createElement("td");
      controlTable.appendChild(curRow);
      input = document.createElement("INPUT");
      input.setAttribute("type", "text");
      input.setAttribute("value", "0.0");
      //input.setAttribute("step", "0.001");
      input.onchange = function (event) {
        this.animationReset = true;
        this.kI = parseFloat(event.target.value);
        this.begin();
      }.bind(this);
      control.append(input);
      curRow.appendChild(label);
      curRow.appendChild(control);

      curRow = document.createElement("tr");
      label = document.createElement("td");
      label.innerHTML = "kD";
      control = document.createElement("td");
      controlTable.appendChild(curRow);
      input = document.createElement("INPUT");
      input.setAttribute("type", "text");
      input.setAttribute("value", "0.0");
      //input.setAttribute("step", "0.001");
      input.onchange = function (event) {
        this.animationReset = true;
        this.kD = parseFloat(event.target.value);
        this.begin();
      }.bind(this);
      control.append(input);
      curRow.appendChild(label);
      curRow.appendChild(control);
    }
  }

  controllerUpdate(time, setpoint, output) {
    //Handle Init
    if (time == 0.0) {
      this.accumulatedError = 0.0;
      this.previousError = 0.0;
    }

    //Calculate error, error derivative, and error integral
    let error = setpoint - output;

    this.accumulatedError += error * this.controllerTimestepS;

    let err_delta = (error - this.previousError) / this.controllerTimestepS;

    //PID + kv/ks control law
    let ctrlEffort =
      this.kV * setpoint +
      this.kS * Math.sign(setpoint) +
      this.kP * error +
      this.kI * this.accumulatedError +
      this.kD * err_delta;

    //Cap voltage at max/min of the physically possible command
    if (ctrlEffort > 12) {
      ctrlEffort = 12;
    } else if (ctrlEffort < -12) {
      ctrlEffort = -12;
    }

    this.previousError = error;

    return ctrlEffort;
  }
}

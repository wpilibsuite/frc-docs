class VerticalElevatorPIDF extends VerticalElevatorSim {
  constructor(divIdPrefix, controlStrategy) {
    super(divIdPrefix);

    // Can be "feedforward", "feedback"
    this.controlStrategy = controlStrategy;

    this.buildControlTable(divIdPrefix);

    this.begin();
  }

  buildControlTable(divIdPrefix) {
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
    input.setAttribute("id", divIdPrefix + "_systemNoise");
    input.onclick = function (event) {
      this.plant.setSystemNoise(document.getElementById(divIdPrefix + "_systemNoise").checked);
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
    input.setAttribute("value", "0.0");
    input.setAttribute("min", "0.0");
    input.setAttribute("max", "1.0");
    input.setAttribute("id", divIdPrefix + "_setpoint");
    input.onchange = function (event) {
      this.setSetpointM(parseFloat(event.target.value));
      this.begin();
    }.bind(this);
    control.append(input);
    curRow.appendChild(label);
    curRow.appendChild(control);


    if (
      this.controlStrategy == "feedforward" ||
      this.controlStrategy == "both"
    ) {

      curRow = document.createElement("tr");
      label = document.createElement("td");
      label.innerHTML = "Profiler Max Velocity";
      control = document.createElement("td");
      controlTable.appendChild(curRow);
      input = document.createElement("INPUT");
      input.setAttribute("type", "text");
      input.setAttribute("value", "0.0");
      input.setAttribute("id", divIdPrefix + "_maxvel");
      input.onchange = function (event) {
        this.maxVelMps = parseFloat(event.target.value);
        this.begin();
      }.bind(this);
      control.append(input);
      curRow.appendChild(label);
      curRow.appendChild(control);
  
      curRow = document.createElement("tr");
      label = document.createElement("td");
      label.innerHTML = "Profiler Max Acceleration";
      control = document.createElement("td");
      controlTable.appendChild(curRow);
      input = document.createElement("INPUT");
      input.setAttribute("type", "text");
      input.setAttribute("value", "0.0");
      input.setAttribute("id", divIdPrefix + "_maxaccel");
      input.onchange = function (event) {
        this.maxAccelMps2 = parseFloat(event.target.value);
        this.begin();
      }.bind(this);
      control.append(input);
      curRow.appendChild(label);
      curRow.appendChild(control);

      curRow = document.createElement("tr");
      label = document.createElement("td");
      label.innerHTML = "kG";
      control = document.createElement("td");
      controlTable.appendChild(curRow);
      input = document.createElement("INPUT");
      input.setAttribute("type", "text");
      input.setAttribute("value", "0.0");
      //input.setAttribute("step", "0.0000001");
      input.onchange = function (event) {
        this.kG = parseFloat(event.target.value);
        this.begin();
      }.bind(this);
      control.append(input);
      curRow.appendChild(label);
      curRow.appendChild(control);

      curRow = document.createElement("tr");
      label = document.createElement("td");
      label.innerHTML = "kV";
      control = document.createElement("td");
      controlTable.appendChild(curRow);
      input = document.createElement("INPUT");
      input.setAttribute("type", "text");
      input.setAttribute("value", "0.0");
      //input.setAttribute("step", "0.0000001");
      input.onchange = function (event) {
        this.kV = parseFloat(event.target.value);
        this.begin();
      }.bind(this);
      control.append(input);
      curRow.appendChild(label);
      curRow.appendChild(control);

      curRow = document.createElement("tr");
      label = document.createElement("td");
      label.innerHTML = "kA";
      control = document.createElement("td");
      controlTable.appendChild(curRow);
      input = document.createElement("INPUT");
      input.setAttribute("type", "text");
      input.setAttribute("value", "0.0");
      //input.setAttribute("step", "0.0000001");
      input.onchange = function (event) {
        this.kA = parseFloat(event.target.value);
        this.begin();
      }.bind(this);
      control.append(input);
      curRow.appendChild(label);
      curRow.appendChild(control);

    } else {
      this.maxAccelMps2 = 99999.0; // effectively no profiling
      this.maxVelMps = 99999.0; // effectively no profiling
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
      //input.setAttribute("step", "0.1");
      input.onchange = function (event) {
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
      //input.setAttribute("step", "0.1");
      input.onchange = function (event) {
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
      //input.setAttribute("step", "0.01");
      input.onchange = function (event) {
        this.kD = parseFloat(event.target.value);
        this.begin();
      }.bind(this);
      control.append(input);
      curRow.appendChild(label);
      curRow.appendChild(control);
    }
  }
}

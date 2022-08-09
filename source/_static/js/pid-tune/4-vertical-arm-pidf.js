class VerticalArmPIDF extends VerticalArmSim {
  constructor(divIdPrefix, controlStrategy) {
    super(divIdPrefix);

    // Can be "feedforward", "feedback", or "both"
    this.controlStrategy = controlStrategy;

    this.buildControlTable();
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
      this.runSim();
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
    //input.setAttribute("step", "0.1");
    //input.setAttribute("min", "-3.14159");
    //input.setAttribute("max", "3.14159");
    input.onchange = function (event) {
      this.animationReset = true;
      this.currentSetpointRad = parseFloat(event.target.value) / 2 / Math.PI;
      this.reset();
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
      label.innerHTML = "kG";
      control = document.createElement("td");
      controlTable.appendChild(curRow);
      input = document.createElement("INPUT");
      input.setAttribute("type", "text");
      input.setAttribute("value", "0.0");
      //input.setAttribute("step", "0.0000001");
      input.onchange = function (event) {
        this.animationReset = true;
        this.kG = parseFloat(event.target.value);
        this.reset();
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
        this.animationReset = true;
        this.kV = parseFloat(event.target.value);
        this.reset();
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
      //input.setAttribute("step", "0.1");
      input.onchange = function (event) {
        this.animationReset = true;
        this.kP = parseFloat(event.target.value);
        this.reset();
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
        this.animationReset = true;
        this.kI = parseFloat(event.target.value);
        this.reset();
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
        this.animationReset = true;
        this.kD = parseFloat(event.target.value);
        this.reset();
      }.bind(this);
      control.append(input);
      curRow.appendChild(label);
      curRow.appendChild(control);
    }
  }
}

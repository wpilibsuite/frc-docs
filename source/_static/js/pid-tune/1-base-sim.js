class BaseSim {
  constructor(divIdPrefix, processVariableUnits, stateMin, stateMax) {
    this.divIdPrefix = divIdPrefix;
    this.speedGraph = null;
    this.voltsGraph = null;
    this.containerDiv = document.getElementById(divIdPrefix + "_container");
    let plotDrawDivVals = document.getElementById(divIdPrefix + "_plotVals");
    let plotDrawDivVolts = document.getElementById(divIdPrefix + "_plotVolts");

    this.processVariableChart = new Highcharts.Chart(
      plotDrawDivVals,
      defaultOptions
    );
    this.voltsChart = new Highcharts.Chart(plotDrawDivVolts, defaultOptions);

    this.voltsChart.addSeries({ name: "Control Effort", color: "green" });
    this.processVariableChart.addSeries({
      name: "Output",
      color: "purple",
      zIndex: 2,
    });
    this.processVariableChart.addSeries({
      name: "Setpoint",
      color: "red",
      zIndex: 1,
    });

    this.voltsChart.yAxis[0].setTitle({ text: "Volts" });
    this.processVariableChart.yAxis[0].setTitle({ text: processVariableUnits });

    this.voltsChart.yAxis[0].setOptions({ min: -14.0, max: 14.0 });
    this.processVariableChart.yAxis[0].setOptions({
      min: stateMin,
      max: stateMax,
    });

    this.visualizationDrawDiv = document.getElementById(divIdPrefix + "_viz");

    this.animationStartTimeS = null;
    window.requestAnimationFrame((t) => this.animate(t));

    this.controlDrawDiv = document.getElementById(divIdPrefix + "_ctrls");

    this.animationReset = true;
  }

  resetData() {

  }

  animate(currentTimeMs) {
    let currentTimeS = currentTimeMs / 1000.0;

    if (this.animationReset) {
      this.animationStartTimeS = currentTimeS;
      this.animationReset = false;
    }

    let animationTimeS = (currentTimeS - this.animationStartTimeS) % this.simDurationS;

    let timeIndex = Math.floor(animationTimeS / this.simulationTimestepS);

    this.drawAnimation(timeIndex, animationTimeS);

    window.requestAnimationFrame((t) => this.animate(t));
  }

  setControlEffortData(data) {
    this.voltsChart.series[0].setData(data, false, false, true);
  }

  setOutputData(data) {
    this.processVariableChart.series[0].setData(data, false, false, true);
  }

  setSetpointData(data) {
    this.processVariableChart.series[1].setData(data, false, false, true);
  }

  redraw() {
    this.processVariableChart.xAxis[0].setExtremes(
      0.0,
      this.simDurationS,
      false
    );
    this.voltsChart.xAxis[0].setExtremes(0.0, this.simDurationS, false);
    this.processVariableChart.redraw();
    this.voltsChart.redraw();
  }

  drawAnimation(timeIndex, animationTimeS) {
    this.visualization.drawDynamic(timeIndex, animationTimeS);
  }
}

let defaultOptions = {
  credits: {
    enabled: false,
  },

  chart: {
    zoomType: null,
    animation: false,
    ignoreHiddenSeries: true,
    panning: false,
    showAxes: true,
    marginLeft: 80, // Keep all charts left aligned
    spacingTop: 20,
    spacingBottom: 20,
    backgroundColor: {
      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
      stops: [
        [0, "rgb(255,255,255)"],
        [1, "rgb(230,230,230)"],
      ],
    },
  },

  title: {
    //disable title
    text: null,
  },

  xAxis: {
    type: "linear",
    title: "Time (sec)",
    lineColor: "#000",
    tickColor: "#000",
    gridLineColor: "#BBB",
    gridLineWidth: 1,
    labels: {
      style: {
        color: "#222",
        fontWeight: "bold",
      },
    },
    title: {
      style: {
        color: "#222",
      },
    },
  },

  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "top",
    borderWidth: 1,
    backgroundColor: "#ddd",
    floating: true,
    itemStyle: {
      font: "9pt Trebuchet MS, Verdana, sans-serif",
      color: "#222",
    },
  },

  exporting: {
    enabled: false,
  },

  colors: ["#FF0000", "#0000FF", "#00BB00", "#FF00FF", "#00FFFF", "#FFFF00"],

  plotOptions: {
    line: {
      marker: {
        radius: 2,
      },
      lineWidth: 3,
      threshold: null,
      animation: true,
    },
  },
  series: [],
};

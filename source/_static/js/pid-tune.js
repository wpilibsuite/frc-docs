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
        this.animationLen = 10.0;
        window.requestAnimationFrame((t)=>this.animationStep(t));

    }

    animationStep(timestamp) {

        var curTime = timestamp / 1000.0;

        if (this.animationStart === null) {
            this.animationStart = curTime;
        }

        var animationTime = curTime - this.animationStart;
        if (animationTime > 10.0) {
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
    }

    drawAnimation(time) {

    }

}

class VerticalArmViz extends ControlsViz {


    drawAnimation(time) {

    }
}



window.onload = function () {
    // set up all visualizations
    flywheel_fb = new FlywheelViz("flywheel_pid");

    flywheel_fb.clear();

    flywheel_fb.addCtrlEffortData(0.0, 1.0);
    flywheel_fb.addCtrlEffortData(1.0, 1.0);
    flywheel_fb.addCtrlEffortData(2.0, 1.0);
    flywheel_fb.addCtrlEffortData(3.0, 1.0);

    flywheel_fb.addSetpointData(0.0, 5.0);
    flywheel_fb.addSetpointData(1.0, 4.0);
    flywheel_fb.addSetpointData(2.0, 3.0);
    flywheel_fb.addSetpointData(3.0, 2.0);

    flywheel_fb.addOutputData(0.0, 3.0);
    flywheel_fb.addOutputData(1.0, 2.0);
    flywheel_fb.addOutputData(2.0, 2.0);
    flywheel_fb.addOutputData(3.0, 3.0);

    flywheel_fb.redraw();
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

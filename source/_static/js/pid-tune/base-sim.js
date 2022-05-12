//Handles coordidinating the animation triggers and the plot setup/config

class BaseSim {

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

        
        this.simEndTime = 10.0;
        this.Ts = 0.001;

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

    drawAnimation(timeIdx) {
        this.viz.drawDynamic(timeIdx);
    }
}



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

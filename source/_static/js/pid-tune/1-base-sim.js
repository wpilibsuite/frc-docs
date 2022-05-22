class BaseSim {

    constructor(div_id_prefix, stateUnits) {
        this.speedGraph = null;
        this.voltsGraph = null;
        this.containerDiv  = document.getElementById(div_id_prefix + "_container");
        var plotDrawDivVals = document.getElementById(div_id_prefix + "_plotVals");
        var plotDrawDivVolts = document.getElementById(div_id_prefix + "_plotVolts");

        this.valsChart = new Highcharts.Chart(plotDrawDivVals, dflt_options);
        this.voltsChart = new Highcharts.Chart(plotDrawDivVolts, dflt_options);

        this.voltsChart.addSeries({name: "Control Effort", color: '#00BB00'});
        this.valsChart.addSeries({name: "Output", color: '#FF0000'});
        this.valsChart.addSeries({name: "Setpoint", color: '#0000FF'});

        this.voltsChart.xAxis[0].addPlotLine({color: '#BBBB00',width: 2, value: 0.0, id:"curTime"})
        this.valsChart.xAxis[0].addPlotLine({color: '#BBBB00',width: 2,value: 0.0, id:"curTime"})

        this.voltsChart.yAxis[0].setTitle({ text : "Volts"});
        this.valsChart.yAxis[0].setTitle({ text :stateUnits });

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

        this.drawAnimation(animationStep, animationTime);

        window.requestAnimationFrame((t)=>this.animationStep(t));

    }


    setCtrlEffortData(data) {
        this.voltsChart.series[0].setData(data, false, false, true);
    }

    setOutputData(data) {
        this.valsChart.series[0].setData(data, false, false, true);
    }

    setSetpointData(data) {
        this.valsChart.series[1].setData(data, false, false, true);
    }

    redraw() {
        this.valsChart.xAxis[0].setExtremes(0.0, this.simEndTime, false);
        this.voltsChart.xAxis[0].setExtremes(0.0, this.simEndTime, false);
        this.valsChart.redraw();
        this.voltsChart.redraw();
    }

    drawAnimation(timeIdx, animationTime) {
        this.viz.drawDynamic(timeIdx);
        
        this.voltsChart.xAxis[0].removePlotBand("curTime");
        this.valsChart.xAxis[0].removePlotBand("curTime");
        this.voltsChart.xAxis[0].addPlotLine({color: '#BBBB00',width: 2, value: animationTime, id:"curTime"})
        this.valsChart.xAxis[0].addPlotLine({color: '#BBBB00',width: 2,value: animationTime, id:"curTime"})
        
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
        marginLeft: 60, // Keep all charts left aligned
        spacingTop: 20,
        spacingBottom: 20,
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
    series: []
}

/////////////////////////////////////////////////////////////////////////
// Plot - collection of the fastChart object, plus the table which
// shows signal names and values, and a set of value axes.
/////////////////////////////////////////////////////////////////////////

class Plot {

    constructor(drawDiv_in) { 

        //Save off a reference to the relevant div
        this.drawDiv = drawDiv_in;

        // Init the plotted signals list to be empty
        this.plottedSignalsMap = new Map();
        this.valueAxesMap = new Map();
        this.numValueAxes = 0; //Note, this may be bigger than valueAxesMap.size to align with other charts.

        // External ranges to synchronize all plots in terms of what they show 
        // and what actually needs drawn on the screen at any given time.
        this.drawStartTime = 0;
        this.drawEndTime = 0;

        this.cursorTime = null;

        this.chart = new FastChart(this.drawDiv);

        //Create a list of default hues to use for coloring signals
        this.defaultHueList = [];
        for(var i = 0; i < 10; i++){
            this.defaultHueList.push((107 * i) % 360); //made up numbers to make some spread out colors or whatevs
        }
        this.colorCounter = 0;

    }

    setCursorPos(cursorTime_in){
        this.cursorTime = cursorTime_in;
    }

    setNumValueAxes(num_in){
        this.numValueAxes = Math.max(this.valueAxesMap.size, num_in);
    }

    drawDataToChart(){
        //Clear and reset plot
        this.chart.recalcDrawConstants(this.numValueAxes);
        this.chart.clearDrawing();

        //Calculate and set up min/max x and y ranges
        this.chart.setTimeRange(this.drawStartTime, this.drawEndTime);
        this.valueAxesMap.forEach(va => va.resetScale());
        this.plottedSignalsMap.forEach(ps => ps.autoScale(this.drawStartTime, this.drawEndTime));

        //Draw chart elements. Z order: first = back, last = front.
        this.chart.drawAxes(this.valueAxesMap);
        this.chart.setCursorPos(this.cursorTime);
        this.chart.drawZoomBox();
        this.chart.drawXMarkers();

        //Draw all non-selected signals
        this.plottedSignalsMap.forEach(ps => {
            if(ps.selected == false){
                var samples = ps.getSamples(this.drawStartTime,this.drawEndTime);
                this.chart.drawSeries(samples, ps.valueAxis.minVal, ps.valueAxis.maxVal, ps.curColor, ps.selected);
            }
        });

        //Draw selected signals
        this.plottedSignalsMap.forEach(ps => {
            if(ps.selected == true){
                var samples = ps.getSamples(this.drawStartTime,this.drawEndTime);
                this.chart.drawSeries(samples, ps.valueAxis.minVal, ps.valueAxis.maxVal, ps.curColor, ps.selected);
            }
        });

        this.chart.drawCursor();
        
    }

    addSignal(signal_in, color_in){
        if(!this.plottedSignalsMap.has(signal_in.name)){
            //Check if we already have an axis to put this on
            var newValueAxis = null;
            this.valueAxesMap.forEach(va => {
                if(va.units == signal_in.units){
                    newValueAxis = va;
                }
            });

            //If we didn't have an existing axis, make a new one
            if(newValueAxis == null){
                newValueAxis = new ValueAxis(signal_in.units);
                this.valueAxesMap.set(signal_in.units, newValueAxis);
            }

            var newPS = new PlottedSignal(signal_in, color_in, newValueAxis);
            this.plottedSignalsMap.set(signal_in.name, newPS);
        }
    }

    setDrawRange(startTime, endTime){
        this.drawStartTime = startTime;
        this.drawEndTime = endTime;
    }

    ////////////////////////////////////////////
    // Main Animation Loop & utilities
    mainAnimationLoop(){

        this.drawDataToChart();
        this.updateDisplayedValues();
     }

    updateDisplayedValues(){
        this.plottedSignalsMap.forEach(ps => {
            if(this.cursorTime == null){
                ps.showValueAtTime(null); //latest
            } else {
                ps.showValueAtTime(this.cursorTime);
            }
        })
    }

    ////////////////////////////////////////////
    // Signal mouse handlers

    mouseup = e => {

        var sigName = e.currentTarget.getAttribute("data:sigName");
        var ps = this.plottedSignalsMap.get(sigName);

        this.plottedSignalsMap.forEach(ps => { ps.colorChooser.hide()}); //always close out all color choosers on click.

        if(e.which == 1){
            //left click toggles selected
            ps.selected ^= true; //toggle
        } else if(e.which == 2){
            //Middle click removes
            this.removePlottedSignal(sigName);
        } else if(e.which == 3) {
            //Right click shows color chooser
            ps.colorChooser.show(e.pageX, e.pageY);
        }

        e.preventDefault();
    }

    click = e => {
        if(e.which == 2){
            //prevent signal remove from doing that scroll-with-mouse-move
            e.preventDefault();
        }
    }

    contextmenu = e => {
        //do nothing, action handled in mouseup
        e.preventDefault();
    }

}

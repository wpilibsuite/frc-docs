/////////////////////////////////////////////////////////////////////////
// PlottedSignal - A signal, plus additional info for drawing it
// nicely. 
/////////////////////////////////////////////////////////////////////////

class PlottedSignal {

    constructor(signal_in, drawColor_in, valueAxis_in) { 
        this.signal = signal_in;

        this.selected = false;

        this.valueAxis = valueAxis_in;

        this.curColor = drawColor_in;

    }

    autoScale(startTime, endTime){
        var sampleList = this.signal.getSamples(startTime, endTime);
        this.valueAxis.autoScale(sampleList);
    }

    getSamples(startTime, endTime){
        var sampleList = this.signal.getSamples(startTime, endTime);
        return sampleList;
    }

    showValueAtTime(time_in){
        var sample = null;

        if(time_in == null){
            sample = this.signal.getLatestSample();
        } else {
            sample = this.signal.getSample(time_in);
        }

    }

}
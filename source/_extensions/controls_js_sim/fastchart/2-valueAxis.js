/////////////////////////////////////////////////////////////////////////
// ValueAxis - One 
/////////////////////////////////////////////////////////////////////////

class ValueAxis {

    constructor(units_in) { 
        this.units = units_in;
        this.minVal = null;
        this.maxVal = null;
    }

    resetScale(){
        this.minVal = null;
        this.maxVal = null;
    }

    autoScale(samples){
        samples.forEach(sample => {
            if(this.minVal == null){
                this.minVal = sample.value;
            } 
            if(this.maxVal == null){
                this.maxVal = sample.value;
            } 
            
            var span = this.maxVal - this.minVal;
            if(span == 0){
                span = 1;
            }
            var margin = span * 0.05;
            this.minVal = Math.min(sample.value - margin, this.minVal);
            this.maxVal = Math.max(sample.value + margin, this.maxVal);
        });
    }

}
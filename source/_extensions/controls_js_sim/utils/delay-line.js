class DelayLine
{
    constructor(num_samples) {
        this.items = [];
        this.desLen = num_samples;
    }
    
    addSample(val) {
        this.items.push(val)
        this.num_samples++;
    }

    getSample() {
        if(this.items.length >= this.desLen){
            return this.items.shift()
        } else {
            return 0;
        }
    }
}



class VerticalArmSim extends BaseSim {

    constructor(div_id_prefix) {

        super(div_id_prefix, "Radians");


        // User-configured setpoints
        this.setpointVal = 0.1; 
        this.setpointStepTime = 1.0;

        this.plant = VerticalArmPlant();

        this.viz = new VerticalArmViz(this.vizDrawDiv);
        this.viz.drawStatic();

    }

    runSim(){

        var inVolts = 0.0;
        var nextControllerRunTime = 0;
        var pos_delay_line = new DelayLine(10); //models sensor lag

        this.plant.init();

        var idx = 0;

        for(var t = 0.0; t < this.simEndTime; t += this.Ts){

            var curSetpoint = 0.0;
            if(t > this.setpointStepTime){
                curSetpoint = this.setpointVal;
            }

            var measPos = pos_delay_line.getSample();

            //Simulate Controller
            if(t >= nextControllerRunTime){
                inVolts = this.controllerUpdate(t, curSetpoint, measPos);
                //Maintain separate sample rate for controller
                nextControllerRunTime += this.ctrl_Ts;
            }

            this.plant.update(t)

            pos_delay_line.addSample(curPosRad);

            this.timeSamples[idx] = t;
            this.ctrlEffortSamples[idx] = inVolts;
            this.outputSamples[idx] = curPosRad;
            this.setpointSamples[idx] = curSetpoint;
            this.outputVizPosRevSamples[idx] = curPosRad/2/Math.PI;

            idx++;
        }

        var ctrlEffortPlotData = Array(null, this.timeSamples.length);
        var outputPlotData = Array(null, this.timeSamples.length);
        var setpointPlotData = Array(null, this.timeSamples.length);
        for(var idx = 0; idx < this.timeSamples.length; idx++){
            ctrlEffortPlotData[idx] = [ this.timeSamples[idx], this.ctrlEffortSamples[idx] ];
            outputPlotData[idx] = [ this.timeSamples[idx], this.outputSamples[idx] ];
            setpointPlotData[idx] = [ this.timeSamples[idx], this.setpointSamples[idx] ];
        }
        this.setCtrlEffortData(ctrlEffortPlotData);
        this.setSetpointData(setpointPlotData);
        this.setOutputData(outputPlotData);
        this.viz.setData(this.timeSamples, this.outputVizPosRevSamples);

        this.redraw();

    }

}

class FlywheelSim extends BaseSim {

    constructor(div_id_prefix) {

        super(div_id_prefix, "RPM");


        // User-configured setpoints
        this.setpointVal = 1000.0; 
        this.setpointStepTime = 1.0;

        this.plant = new FlywheelPlant();

        this.viz = new FlywheelVisualization(this.vizDrawDiv);
        this.viz.drawStatic();

    }

    runSim(){

        var inVolts = 0.0;
        var nextControllerRunTime = 0;

        var speed_delay_line = new DelayLine(49); //models sensor lag

        this.plant.init(this.Ts);

        var idx = 0;

        for(var t = 0.0; t < this.simEndTime; t += this.Ts){

            var curSetpoint = 0.0;
            if(t > this.setpointStepTime){
                curSetpoint = this.setpointVal;
            }

            var meas_speed = speed_delay_line.getSample();

            //Simulate Controller
            if(t >= nextControllerRunTime){
                inVolts = this.controllerUpdate(t, curSetpoint, meas_speed);
                //Maintain separate sample rate for controller
                nextControllerRunTime += this.ctrl_Ts;
            }

            this.plant.update(t,inVolts);

            speed_delay_line.addSample(this.plant.getCurSpeedRPM());

            this.timeSamples[idx] = t;
            this.ctrlEffortSamples[idx] = inVolts;
            this.outputSamples[idx] = this.plant.getCurSpeedRPM();
            this.setpointSamples[idx] = curSetpoint;
            this.outputVizPosRevSamples[idx] = this.plant.getCurPosRev();

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

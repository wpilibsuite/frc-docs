class FlywheelVisualization extends BaseVisualization{

    constructor(div_in){
        super(div_in);
        this.ballInjected = false;
        this.ballExited = false;
    }

    drawStaticCustom(){

        this.wheelCenterX = 0.6*this.width;
        this.wheelCenterY = 0.6*this.height;

        this.wheelRadius =  Math.min(this.height, this.width) * 0.25;

        this.ballRadius = this.wheelRadius * 0.5;

        this.ballLoadTrackX = this.wheelCenterX - this.wheelRadius - this.ballRadius;
        this.ballLoadTrackYStart = this.wheelCenterY+this.wheelRadius+20;
        this.ballLoadTrackYEnd = this.wheelCenterY;

        this.ballLaunchTrackXStart = this.wheelCenterX;
        this.ballLaunchTrackXEnd = this.width;
        this.ballLaunchTrackY = this.wheelCenterY - this.wheelRadius - this.ballRadius;

        //Wheel
        this.staticCanvasContext.lineWidth = 4;
        this.staticCanvasContext.fillStyle="#DDDDDD"
        this.staticCanvasContext.strokeStyle = '#000000';
        this.staticCanvasContext.beginPath();
        this.staticCanvasContext.arc(this.wheelCenterX, this.wheelCenterY, this.wheelRadius, 0, 2 * Math.PI, false);
        this.staticCanvasContext.fill();
        this.staticCanvasContext.stroke();

        //Ball Guide Track - outer
        this.staticCanvasContext.lineWidth = 2;
        this.staticCanvasContext.strokeStyle = '#000000';
        this.staticCanvasContext.beginPath();
        this.staticCanvasContext.moveTo(this.ballLoadTrackX - this.ballRadius, this.ballLoadTrackYStart);
        this.staticCanvasContext.lineTo(this.ballLoadTrackX - this.ballRadius, this.ballLoadTrackYEnd);
        this.staticCanvasContext.arc(this.wheelCenterX, this.wheelCenterY, this.wheelRadius + this.ballRadius*2, Math.PI, Math.PI * 3/2, false);
        this.staticCanvasContext.stroke();
        
        //Ball Guide Track - inner load
        this.staticCanvasContext.beginPath();
        this.staticCanvasContext.moveTo(this.ballLoadTrackX + this.ballRadius, this.ballLoadTrackYStart);
        this.staticCanvasContext.lineTo(this.ballLoadTrackX + this.ballRadius, this.ballLoadTrackYEnd);
        this.staticCanvasContext.stroke();


    }

    setBallState(injected_in){
        this.ballInjected = injected_in;
    }

    drawDynamicCustom(){
        const positionRad = this.positionRad;

        // todo: magic numbers again
        const setpointPlotScale = this.setpoint * 1/500 * this.wheelRadius;
        const outputPlotScale = this.output * 1/500 * this.wheelRadius;
        const controlEffortPlotScale = this.controlEffortVolts * 1/6 * this.wheelRadius;

        const vectorY = this.wheelCenterY - this.wheelRadius;
        const setpointEndX = this.wheelCenterX + setpointPlotScale;
        const outputEndX = this.wheelCenterX + outputPlotScale;
        const controlEffortEndX = this.wheelCenterX + controlEffortPlotScale;


        //Time Indicator
        this.animatedCanvasContext.fillStyle = "#000000";
        this.animatedCanvasContext.font = "bold 20px Arial";
        this.animatedCanvasContext.fillText(
        "t = " + this.timeS.toFixed(2) + " sec",
        0.05 * this.width,
        0.15 * this.height
        );

        let ballCenterX = 0;
        let ballCenterY = 0;

        //Calculate ball position - Very very rough state machine approximation.
        // Technically, the plant needs to run... almost the whole simulation. Or at least
        // some amount of time in the future to feed this algorithm, I think.
        // This hacky thing keeps the visitation reasonable, which is all we really need for now.
        if(!this.ballInjected){
            //Ball waiting to be launched
            let progFrac = 0.50;
            ballCenterX = this.ballLoadTrackX;
            ballCenterY = this.ballLoadTrackYStart + progFrac * (this.ballLoadTrackYEnd - this.ballLoadTrackYStart);
            this.ballExited = false;
            this.ballEnterAngle = null;
        } else {
            if(!this.ballExited){
                //Ball is in contact with the shooter and should move along with it
                if(this.ballEnterAngle == null){
                    //First loop of exit, calc entry wheel angle
                    this.ballEnterAngle = this.positionRad;
                }    

                let ballDrawAngle = this.positionRad - this.ballEnterAngle  + Math.PI;
                ballCenterX = this.wheelCenterX + (this.wheelRadius + this.ballRadius) * Math.cos(ballDrawAngle);
                ballCenterY = this.wheelCenterY + (this.wheelRadius + this.ballRadius) * Math.sin(ballDrawAngle);

                //Check for ball exit conditions
                if(this.positionRad - this.ballEnterAngle > Math.PI/2){
                    this.ballExited = true;
                    this.ballExitSpeed = 2 * Math.PI * (this.wheelRadius + this.ballRadius) / 60 * this.output; //output assumed in RPM
                    this.ballExitTime = this.timeS;
                }

            } else {
                ballCenterX = this.ballLaunchTrackXStart + this.ballExitSpeed * (this.timeS - this.ballExitTime);
                ballCenterY = this.ballLaunchTrackY;
            }
        }


        let numSegments = 5;
        let segWidthRad = 0.3;

        for(let segIndex = 0; segIndex < numSegments; segIndex ++){

            let offset = segIndex * Math.PI * 2 / numSegments;

            this.animatedCanvasContext.lineWidth = 4;
            this.animatedCanvasContext.strokeStyle = '#000000';
            if(offset == 0){
                this.animatedCanvasContext.fillStyle="#FF0000";
            } else {
                this.animatedCanvasContext.fillStyle="#000000";
            }
            this.animatedCanvasContext.beginPath();
            this.animatedCanvasContext.moveTo(this.wheelCenterX,this.wheelCenterY);
            this.animatedCanvasContext.arc(this.wheelCenterX, this.wheelCenterY, this.wheelRadius, offset + positionRad - segWidthRad/2.0, offset + positionRad + segWidthRad/2.0, false);
            this.animatedCanvasContext.closePath();
            this.animatedCanvasContext.fill();
            this.animatedCanvasContext.stroke();
        }

        //Center Hub
        this.animatedCanvasContext.lineWidth = 1;
        this.animatedCanvasContext.fillStyle="#000000"
        this.animatedCanvasContext.strokeStyle = '#000000';
        this.animatedCanvasContext.beginPath();
        this.animatedCanvasContext.arc(this.wheelCenterX, this.wheelCenterY, 0.1*this.wheelRadius, 0, 2 * Math.PI, false);
        this.animatedCanvasContext.fill();
        this.animatedCanvasContext.stroke();

        //ball
        this.animatedCanvasContext.lineWidth = 1;
        this.animatedCanvasContext.fillStyle="#bbffbb"
        this.animatedCanvasContext.strokeStyle = '#000000';
        this.animatedCanvasContext.beginPath();
        this.animatedCanvasContext.arc(ballCenterX, ballCenterY, this.ballRadius, 0, 2 * Math.PI, false);
        this.animatedCanvasContext.fill();
        this.animatedCanvasContext.stroke();

        // Vector indicators
        if (setpointPlotScale * setpointPlotScale > 0) {
            drawArrow(this.animatedCanvasContext, this.wheelCenterX, vectorY, setpointEndX, vectorY, 8, "red");
        }
        if (outputPlotScale * outputPlotScale > 0) {
            drawArrow(this.animatedCanvasContext, this.wheelCenterX, vectorY, outputEndX, vectorY, 6, "purple")
        }
        if (controlEffortPlotScale * controlEffortPlotScale > 0) {
            drawArrow(this.animatedCanvasContext, this.wheelCenterX, vectorY, controlEffortEndX, vectorY, 4, "green")
        }
    }
}
class FlywheelVisualization extends BaseVisualization{

    constructor(div_in){
        super(div_in);
    }

    setBallTimes(enterTime, exitTime){
        this.ballEnterTime = enterTime;
        this.ballExitTime = exitTime;
        this.ballEnterTimeIndex = null;
        this.ballExitTimeIndex = null;
    }

    drawStaticCustom(){

        this.wheelCenterX = 0.6*this.width;
        this.wheelCenterY = 0.6*this.height;

        this.wheelRadius =  Math.min(this.height, this.width) * 0.25;

        this.ballRadius = this.wheelRadius * 0.5;

        this.ballLoadTrackX = this.wheelCenterX - this.wheelRadius - this.ballRadius;
        this.ballLoadTrackYStart = this.height;
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

    drawDynamicCustom(timeIndex){

        let pos = this.positionRad[timeIndex]; 

        let indLen = this.wheelRadius;

        let indStartX = this.wheelCenterX;
        let indStartY = this.wheelCenterY;

        let ballCenterX = 0;
        let ballCenterY = 0;

        //Calculate ball position
        if(this.timeS[timeIndex] < this.ballEnterTime){
            //While loading, ball stays on LoadTrackX for x position, and 
            // moves linearly along from TrackYStart to TrackYEnd to enter the wheel at just the right time
            ballCenterX = this.ballLoadTrackX;
            let progFrac = (1 - (this.ballEnterTime - this.timeS[timeIndex])/this.ballEnterTime);
            ballCenterY = this.ballLoadTrackYStart + progFrac * (this.ballLoadTrackYEnd - this.ballLoadTrackYStart);
        } else if (this.timeS[timeIndex] >= this.ballEnterTime && (this.ballExitTime == null || this.timeS[timeIndex] < this.ballExitTime )){
            //Ball is in contact with the shooter and should move along with it
            if(this.ballEnterTimeIndex == null){
                //First loop of exit, calc exit speed
                this.ballEnterTimeIndex = timeIndex
            }    
            let startAngle = this.positionRad[this.ballEnterTimeIndex];
            let ballDrawAngle = this.positionRad[timeIndex] - startAngle + Math.PI;
            ballCenterX = this.wheelCenterX + (this.wheelRadius + this.ballRadius) * Math.cos(ballDrawAngle);
            ballCenterY = this.wheelCenterY + (this.wheelRadius + this.ballRadius) * Math.sin(ballDrawAngle);

        } else {
            //Ball has left the shooter, travel along the launch path at whatever
            // speed it left the shooter wheel at
            if(this.ballExitTimeIndex == null){
                //First loop of exit, calc exit speed
                this.ballExitTimeIndex = timeIndex;
                let ballExitRotVel = (this.positionRad[timeIndex] - this.positionRad[timeIndex-1])/(this.timeS[timeIndex] - this.timeS[timeIndex-1]);
                this.ballExitSpeed = ballExitRotVel * (this.wheelRadius + this.ballRadius);
            }                
            ballCenterX = this.ballLaunchTrackXStart + this.ballExitSpeed * (this.timeS[timeIndex] - this.ballExitTime);
            ballCenterY = this.ballLaunchTrackY;
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
            this.animatedCanvasContext.moveTo(indStartX,indStartY);
            this.animatedCanvasContext.arc(indStartX, indStartY, indLen, offset + pos - segWidthRad/2.0, offset + pos + segWidthRad/2.0, false);
            this.animatedCanvasContext.closePath();
            this.animatedCanvasContext.fill();
            this.animatedCanvasContext.stroke();
        }

        //Center Hub
        this.animatedCanvasContext.lineWidth = 1;
        this.animatedCanvasContext.fillStyle="#000000"
        this.animatedCanvasContext.strokeStyle = '#000000';
        this.animatedCanvasContext.beginPath();
        this.animatedCanvasContext.arc(indStartX, indStartY, 0.1*this.wheelRadius, 0, 2 * Math.PI, false);
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

    }
}
class FlywheelVisualization extends BaseVisualization{

    constructor(div_in){
        super(div_in);
    }

    setBallTimes(enterTime, exitTime){
        this.ballEnterTime = enterTime;
        this.ballExitTime = exitTime;
        this.ballEnterTimeIdx = null;
        this.ballExitTimeIdx = null;
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
        this.ctxs.lineWidth = 4;
        this.ctxs.fillStyle="#DDDDDD"
        this.ctxs.strokeStyle = '#000000';
        this.ctxs.beginPath();
        this.ctxs.arc(this.wheelCenterX, this.wheelCenterY, this.wheelRadius, 0, 2 * Math.PI, false);
        this.ctxs.fill();
        this.ctxs.stroke();

        //Ball Guide Track - outer
        this.ctxs.lineWidth = 2;
        this.ctxs.strokeStyle = '#000000';
        this.ctxs.beginPath();
        this.ctxs.moveTo(this.ballLoadTrackX - this.ballRadius, this.ballLoadTrackYStart);
        this.ctxs.lineTo(this.ballLoadTrackX - this.ballRadius, this.ballLoadTrackYEnd);
        this.ctxs.arc(this.wheelCenterX, this.wheelCenterY, this.wheelRadius + this.ballRadius*2, Math.PI, Math.PI * 3/2, false);
        this.ctxs.stroke();
        
        //Ball Guide Track - inner load
        this.ctxs.beginPath();
        this.ctxs.moveTo(this.ballLoadTrackX + this.ballRadius, this.ballLoadTrackYStart);
        this.ctxs.lineTo(this.ballLoadTrackX + this.ballRadius, this.ballLoadTrackYEnd);
        this.ctxs.stroke();


    }

    drawDynamicCustom(timeIdx){

        var pos = this.posRev[timeIdx] * 2 * Math.PI; 

        var indLen = this.wheelRadius;

        var indStartX = this.wheelCenterX;
        var indStartY = this.wheelCenterY;

        var ballCenterX = 0;
        var ballCenterY = 0;

        //Calculate ball position
        if(this.time[timeIdx] < this.ballEnterTime){
            //While loading, ball stays on LoadTrackX for x position, and 
            // moves linearly along from TrackYStart to TrackYEnd to enter the wheel at just the right time
            ballCenterX = this.ballLoadTrackX;
            var progFrac = (1 - (this.ballEnterTime - this.time[timeIdx])/this.ballEnterTime);
            ballCenterY = this.ballLoadTrackYStart + progFrac * (this.ballLoadTrackYEnd - this.ballLoadTrackYStart);
        } else if (this.time[timeIdx] >= this.ballEnterTime && (this.ballExitTime == null || this.time[timeIdx] < this.ballExitTime )){
            //Ball is in contact with the shooter and should move along with it
            if(this.ballEnterTimeIdx == null){
                //First loop of exit, calc exit speed
                this.ballEnterTimeIdx = timeIdx
            }    
            var startAngle = this.posRev[this.ballEnterTimeIdx ] * 2 * Math.PI;
            var ballDrawAngle = this.posRev[timeIdx]*2*Math.PI - startAngle + Math.PI;
            ballCenterX = this.wheelCenterX + (this.wheelRadius + this.ballRadius) * Math.cos(ballDrawAngle);
            ballCenterY = this.wheelCenterY + (this.wheelRadius + this.ballRadius) * Math.sin(ballDrawAngle);

        } else {
            //Ball has left the shooter, travel along the launch path at whatever
            // speed it left the shooter wheel at
            if(this.ballExitTimeIdx == null){
                //First loop of exit, calc exit speed
                this.ballExitTimeIdx = timeIdx;
                var ballExitRotVel = (this.posRev[timeIdx] - this.posRev[timeIdx-1])/(this.time[timeIdx] - this.time[timeIdx-1]);
                this.ballExitSpeed = ballExitRotVel * 2 * Math.PI * (this.wheelRadius + this.ballRadius);
            }                
            ballCenterX = this.ballLaunchTrackXStart + this.ballExitSpeed * (this.time[timeIdx] - this.ballExitTime);
            ballCenterY = this.ballLaunchTrackY;
        }


        var numSegments = 5;
        var segWidthRad = 0.3;

        for(var segIdx = 0; segIdx < numSegments; segIdx ++){

            var offset = segIdx * Math.PI * 2 / numSegments;

            this.ctxa.lineWidth = 4;
            this.ctxa.strokeStyle = '#000000';
            if(offset == 0){
                this.ctxa.fillStyle="#FF0000";
            } else {
                this.ctxa.fillStyle="#000000";
            }
            this.ctxa.beginPath();
            this.ctxa.moveTo(indStartX,indStartY);
            this.ctxa.arc(indStartX, indStartY, indLen, offset + pos - segWidthRad/2.0, offset + pos + segWidthRad/2.0, false);
            this.ctxa.closePath();
            this.ctxa.fill();
            this.ctxa.stroke();
        }

        //Center Hub
        this.ctxa.lineWidth = 1;
        this.ctxa.fillStyle="#000000"
        this.ctxa.strokeStyle = '#000000';
        this.ctxa.beginPath();
        this.ctxa.arc(indStartX, indStartY, 0.1*this.wheelRadius, 0, 2 * Math.PI, false);
        this.ctxa.fill();
        this.ctxa.stroke();

        //ball
        this.ctxa.lineWidth = 1;
        this.ctxa.fillStyle="#bbffbb"
        this.ctxa.strokeStyle = '#000000';
        this.ctxa.beginPath();
        this.ctxa.arc(ballCenterX, ballCenterY, this.ballRadius, 0, 2 * Math.PI, false);
        this.ctxa.fill();
        this.ctxa.stroke();

    }
}
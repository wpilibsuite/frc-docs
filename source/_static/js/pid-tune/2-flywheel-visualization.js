class FlywheelVisualization extends BaseVisualization{

    constructor(div_in){
        super(div_in);
    }

    drawStaticCustom(){
        //Wheel
        this.ctxs.lineWidth = 4;
        this.ctxs.fillStyle="#DDDDDD"
        this.ctxs.strokeStyle = '#000000';
        this.ctxs.beginPath();
        this.ctxs.arc(0.5*this.width, 0.5*this.height, 0.25*this.height, 0, 2 * Math.PI, false);
        this.ctxs.fill();
        this.ctxs.stroke();
    }

    drawDynamicCustom(timeIdx){

        var pos = this.posRev[timeIdx]; //make it look nice

        var indLen = this.height * 0.25;

        var indStartX = 0.5*this.width;
        var indStartY = 0.5*this.height;


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
            this.ctxa.stroke();
            this.ctxa.fill();
        }

        //Center Hub
        this.ctxa.lineWidth = 1;
        this.ctxa.fillStyle="#000000"
        this.ctxa.strokeStyle = '#000000';
        this.ctxa.beginPath();
        this.ctxa.arc(0.5*this.width, 0.5*this.height, 0.05*this.height, 0, 2 * Math.PI, false);
        this.ctxa.fill();


    }
}
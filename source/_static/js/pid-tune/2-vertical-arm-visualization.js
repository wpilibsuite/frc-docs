class VerticalArmVisualization extends BaseVisualization{

    constructor(div_in){
        super(div_in);
    }

    drawStaticCustom(){

        //Supports
        this.ctxs.lineWidth = 5;
        this.ctxs.strokeStyle = '#000000';
        this.ctxs.beginPath();
        this.ctxs.moveTo(this.width/2, this.height/2);
        this.ctxs.lineTo(0.3*this.width, 0.9*this.height);
        this.ctxs.stroke();
        this.ctxs.beginPath();
        this.ctxs.moveTo(this.width/2, this.height/2);
        this.ctxs.lineTo(0.7*this.width, 0.9*this.height);
        this.ctxs.stroke();

        //Wheels
        this.ctxs.lineWidth = 5;
        this.ctxs.fillStyle="#000000"
        this.ctxs.strokeStyle = '#444444';
        this.ctxs.beginPath();
        this.ctxs.arc(0.2*this.width, 0.92*this.height, 0.06*this.height, 0, 2 * Math.PI, false);
        this.ctxs.fill();
        this.ctxs.stroke();
        this.ctxs.beginPath();
        this.ctxs.arc(0.5*this.width, 0.92*this.height, 0.06*this.height, 0, 2 * Math.PI, false);
        this.ctxs.fill();
        this.ctxs.stroke();
        this.ctxs.beginPath();
        this.ctxs.arc(0.8*this.width, 0.92*this.height, 0.06*this.height, 0, 2 * Math.PI, false);
        this.ctxs.fill();
        this.ctxs.stroke();

        //Bumpers
        this.ctxs.fillStyle="#FF0000"
        this.ctxs.fillRect(0.1*this.width, 0.88*this.height, 0.8*this.width, 0.07*this.height);
        this.ctxs.fillStyle="#FFFFFF"
        this.ctxs.font = "bold 22px Arial";
        this.ctxs.textAlign = "center";
        this.ctxs.fillText(this.teamNum, 0.5*this.width, 0.94*this.height); 

    }

    drawDynamicCustom(timeIdx){
        var angleRev = this.posRev[timeIdx]; //make it look nice
        this.ctxa.clearRect(0,0,this.width,this.height);

        var armLenPx = Math.min(this.width,this.height)*0.40;

        var armStartX = 0.5*this.width;
        var armStartY = 0.5*this.height;
    
        var armEndX = armStartX + armLenPx*Math.cos(2*Math.PI*angleRev);
        var armEndY = armStartY - armLenPx*Math.sin(2*Math.PI*angleRev); //Cuz y axis inverted on graphics cuz computers
    
        //Arm
        this.ctxa.lineWidth = 6;
        this.ctxa.strokeStyle = '#22BB22';
        this.ctxa.beginPath();
        this.ctxa.moveTo(armStartX, armStartY);
        this.ctxa.lineTo(armEndX, armEndY);
        this.ctxa.stroke();
    
        //Shoulder Joint
        this.ctxa.beginPath();
        this.ctxa.arc(0.5*this.width, 0.5*this.height, 0.02*this.height, 0, 2 * Math.PI, false);
        this.ctxa.fillStyle = 'grey';
        this.ctxa.fill();
    
        //End Effector
        this.ctxa.beginPath();
        this.ctxa.arc(armEndX, armEndY, 0.035*this.height, 0, 2 * Math.PI, false);
        this.ctxa.fillStyle = '#990099';
        this.ctxa.fill();
    }
}
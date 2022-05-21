
class BaseVisualization {
    constructor(div_in){

        this.drawDiv = div_in;

        div_in.style.position = "relative";

        this.ca = document.createElement("canvas")
        this.cas = document.createElement("canvas")

        this.cas.style.position = "absolute";
        this.cas.style.top = "0px";
        this.cas.style.left = "0px";

        this.ca.style.position = "absolute";
        this.ca.style.top = "0px";
        this.ca.style.left = "0px";

        this.teamNum = Math.floor(Math.random() * 9999).toFixed(0);

        this.ctxa = this.ca.getContext("2d");
        this.ctxs = this.cas.getContext("2d");

        div_in.appendChild(this.cas);
        div_in.appendChild(this.ca);

        this.updateSize();

        window.addEventListener('resize', this.updateSize.bind(this));
        window.addEventListener('load', this.updateSize.bind(this));

    }

    updateSize(){
        this.width = Math.min(this.drawDiv.offsetWidth, 500);
        this.height = this.drawDiv.offsetHeight;
        this.cas.width = this.width;
        this.cas.height = this.height;
        this.ca.width = this.width;
        this.ca.height = this.height;
        this.drawStatic();
    }

    setActuatorPositionData(time, posRev){
        this.posRev = posRev;
        this.time = time;
    }

    drawStatic(){

        this.ctxs.clearRect(0,0,this.width,this.height);

        this.drawStaticCustom();

    }

    drawDynamic(timeIdx){
        this.ctxa.clearRect(0,0,this.width,this.height);

        this.drawDynamicCustom(timeIdx);

        //Time Indicator
        var time_sec = this.time[timeIdx];
        this.ctxa.fillStyle="#000000"
        this.ctxa.font = "bold 20px Arial";
        this.ctxa.fillText("t = " + time_sec.toFixed(2) + " sec", 0.05*this.width, 0.15*this.height); 
        //Progress bar
        this.ctxa.fillStyle="#0000FF"
        this.ctxa.fillRect(0.0*this.width, 0.98*this.height, ((timeIdx)/(this.time.length))*this.width, 0.02*this.height);
            
    }
}

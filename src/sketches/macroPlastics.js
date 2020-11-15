//these are gonna be the variables for our garbage collection
var macro_plastic = [];

export let hoveredMacroPlasticData = { mouseOver: false, value: null };
let hoveredMacroPlastic = null;
let newHeight = 0;

class GarbagePile {
    constructor(p,moreHeight) {
        var bubbleHeight = p.height / 1.85
        this.xVelocity = p.random(-0.5, 0.5); //cloud movement velocity
        this.x = p.random(50, p.width);
        this.y = bubbleHeight - moreHeight;
        this.width = p.random(100, 300);
        this.height = p.random(50, 100);
        this.garbageBubbles = [];
        //make the garbage hard to see through
        this.opacity = p.random(400, 500);

        this.size = this.width - this.height;
        //various reds and greens and browns
        this.rcolor = p.random(129,160);
        this.gcolor = p.random(80,105);
        this.bcolor = p.random(70,110);

        for (let x = 0; x < 25; x++) {
            this.garbageBubbles[x] = new GarbageBubble(p, this.width, this.height);
        }

        this.display = function () {
            // console.log("Displaying smog cloud");
            p.noStroke();

            let color = p.color(this.rcolor,this.gcolor,this.bcolor);
            this.garbageColor = color
            this.garbageColor.setAlpha(this.opacity);
            p.fill(this.garbageColor)

            if (hoveredMacroPlasticData.mouseOver) {
                p.fill(225, 225, 0, 70)
                p.ellipse(this.x, this.y, 50);
            }
            //p.ellipse(this.x, this.y, this.width, this.height);
            for (let x = 0; x < this.garbageBubbles.length; x++) {

                p.ellipse(
                    this.x + this.garbageBubbles[x].xOffset ,
                    this.y + this.garbageBubbles[x].yOffset - newHeight,
                    this.garbageBubbles[x].rx,
                    this.garbageBubbles[x].ry
                );
                p.curveVertex(
                    this.x + this.garbageBubbles[x].xOffset,
                    this.y + this.garbageBubbles[x].yOffset - newHeight
                );
            }
        };

        this.move = function () {

            for (let x = 0; x < this.garbageBubbles.length; x++) {
                /*if (Math.abs(this.garbageBubbles[x].xOffset) > this.width / 2 - 10) {
                    this.Bubbles[x].xVelocity *= -1;
                }*/
                if (Math.abs(this.garbageBubbles[x].yOffset) > this.height / 2 - 10) {
                    this.garbageBubbles[x].yVelocity *= -1;
                }
                if (this.garbageBubbles[x].rx < 70 || this.garbageBubbles[x].rx > 150) {
                    this.garbageBubbles[x].rxVelocity *= -1;
                }
                if (this.garbageBubbles[x].ry < 70 || this.garbageBubbles[x].ry > 150) {
                    this.garbageBubbles[x].ryVelocity *= -1;
                }

                this.garbageBubbles[x].xOffset += this.garbageBubbles[x].xVelocity;
                this.garbageBubbles[x].yOffset += this.garbageBubbles[x].yVelocity;

                this.garbageBubbles[x].rx += this.garbageBubbles[x].rxVelocity;
                this.garbageBubbles[x].ry += this.garbageBubbles[x].ryVelocity;
            }
            // check if mouse is pressed and within range of bubble
            if (p.mouseIsPressed && p.dist(p.mouseX, p.mouseY, this.x, this.y) < 20) {
                hoveredMacroPlasticData.mouseOver = true;
                hoveredMacroPlastic = this;

            }

            if (this.x > p.width) {
                this.x = 50;
            } else if (this.x < 0) {
                this.x = p.width - 50;
            }
            this.x += this.xVelocity;
        };
    }
}

class GarbageBubble {

    constructor(p, xlimit, ylimit) {
        this.opacity = p.random(150, 200);
        this.xVelocity = p.random(0.03, 0.07);
        this.yVelocity = p.random(0.03, 0.07);
        this.xOffset = p.random((xlimit / 4) * -1, xlimit / 4);
        this.yOffset = p.random((ylimit / 8) * -1, ylimit / 8);
        this.rx = p.random(25, 40);
        this.ry = p.random(25, 40);

        this.rxVelocity = p.random(-0.01, 0.01);
        this.ryVelocity = p.random(0.01, 0.02);
    }
}



export function setupMacroPlastics(p) {
    //
    //set up plastic
    //
    for (var i = 0; i < 5; i++) {
        macro_plastic[i] = new GarbagePile(p, i);
    }
}

export function drawMacroPlastics(p, macroGrowth2050, current_date, seaLevelRise) {

    //we wil add a new height to the starting height to make our landscape rise and fall
    // with the date and sea seaLevelRise data

    var currentDate = current_date.getFullYear();
    var index = currentDate - 1880;

    if (index<0){
      newHeight = 0
    }
    if (currentDate>2013)
    {
      newHeight = seaLevelRise[(2013-1880)][1]*3+((currentDate-2014))/3
    }
    else{
      newHeight = seaLevelRise[index][1]*3
    }

    //calc amount of microplastic

    for (var i = 0; i < macro_plastic.length; i++) {

        if (!hoveredMacroPlasticData.mouseOver) {

          macro_plastic[i].move(p);
        }
        else if (p.dist(p.mouseX, p.mouseY, hoveredMacroPlastic.x, hoveredMacroPlastic.y) > hoveredMacroPlastic.size) {
            hoveredMacroPlasticData.mouseOver = false;
        }
        macro_plastic[i].display(p);


    }

    if (macroGrowth2050 != null) {
        var newSize = -1 * (macroGrowth2050[currentDate - 1950][1] - 367);


        hoveredMacroPlasticData.value = newSize;
        newSize = Math.round(newSize/4) + 5;
        newHeight = Math.round(newSize*1.25)

        //add drops
        if (newSize > macro_plastic.length) {
            for (var j = macro_plastic.length; j < newSize; j++) {
                macro_plastic[j] = new GarbagePile(p,newHeight);
            }
        }
        //remove drops
        if (newSize < macro_plastic.length) {
            //console.log('remove');
            var diff = macro_plastic.length - newSize;
            macro_plastic = macro_plastic.splice(0, diff);
        }
    }
}
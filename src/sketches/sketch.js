import { setUpSun, drawSun, hoveredSunData } from "./sun";
import { setupLandscape, drawLandscape, drawSeaboard } from "./landscape";
import { setupMicroPlasticDrops, drawMicroPlasticDots, hoveredMicroPlasticData } from "./microPlastics";
import { setupMacroPlastics, drawMacroPlastics, hoveredMacroPlasticData } from "./macroPlastics";
import { setupMethaneBubbles, drawMethaneBubbles } from "./methaneBubbles";
import { setupSmogClouds, drawSmogClouds, hoveredSmogData } from "./smogClouds";
import { drawSky } from "./skyColor";
import { drawLegend, drawGuide } from "./legend";
import { hoveredBubbleData } from "./methaneBubbles";

export default function sketch(p) {
    let showLegend = true;
    let temperatureData = null;
    let microGrowth2050 = null;
    let macroGrowth2050 = null;
    let currentDate = null;
    let carbonData = null;
    let methaneData = null;
    let seaLevelRise = null;
    let nitrousData = null;

    p.setup = () => {
        const wrapper = document.getElementById("page-wrapper");
        p.frameRate(30);
        const canvas = p.createCanvas(wrapper.offsetWidth, p.windowHeight); // adjust to window width and height
        canvas.id('p5-canvas');
        document.getElementById('p5-canvas').style.display = 'block';
        setupLandscape(p);
        setUpSun(p,temperatureData, currentDate);
        setupSmogClouds(p);
        setupMethaneBubbles(p, methaneData);
        setupMicroPlasticDrops(p);
        setupMacroPlastics(p);

        let button = document.getElementById('guide-button');
        button.onclick = showGuide;
    };

    function showGuide() {
        showLegend = !showLegend;
    }

    p.draw = () => {
        p.clear();
        drawSky(p, carbonData, currentDate);
        drawSun(p, temperatureData, currentDate);

        drawLandscape(p,currentDate, seaLevelRise,temperatureData);
        drawSmogClouds(p, nitrousData, currentDate);
        drawMethaneBubbles(p, methaneData, currentDate, seaLevelRise);
        drawSeaboard(p);
        drawMicroPlasticDots(p, microGrowth2050, currentDate, seaLevelRise);
        drawMacroPlastics(p, macroGrowth2050, currentDate, seaLevelRise);

        if (showLegend) { // commented this for demo/testing purposes
            p.noFill();
            drawGuide(p);
        }
        else if (hoveredBubbleData.mouseOver) {
            const text = "The bubbles rising up through the ocean represent methane entering the atmosphere, and increase and decrease in number accordingly.";
            const value = hoveredBubbleData.value ? `Value: ${hoveredBubbleData.value} ppb` : `[No Value For Current Date]`;
            p.noFill();
            drawLegend(p, text, value);
        }
        else if (hoveredMacroPlasticData.mouseOver) {
            const text = "The piles or circles on top the ocean represent macroplastic, and increase and decrease in number accordingly.\n" 
            + (hoveredMacroPlasticData.value ? `Macroplastic value: ${hoveredMacroPlasticData.value} tons\n`: `[No Value For Current Date]\n`)
                + "The white dots or circles falling from top the ocean represent microplastic, and increase and decrease in number accordingly.\n"
                    + (hoveredMicroPlasticData.value ? `Microplastic value: ${hoveredMicroPlasticData.value} tons` : `[No Value For Current Date]`);
            p.noFill();
            drawLegend(p, text, " ");
        }
        else if (hoveredSunData.mouseOver) {
            const text = "The sun and ocean grow and change color with the tempature of the planet.";
            const value = hoveredSunData.value ? `Value: ${hoveredSunData.value} degree C` : `[No Value For Current Date]`;
            p.noFill();
            drawLegend(p, text, value);
        }
        else if (hoveredMicroPlasticData.mouseOver) {
            const text = "The white dots or circles falling from top the ocean represent microplastic, and increase and decrease in number accordingly.";
            const value = hoveredMicroPlasticData.value ? `Value: ${hoveredMicroPlasticData.value} tons` : `[No Value For Current Date]`;
            p.noFill();
            drawLegend(p, text, value);
        }
        else if (hoveredSmogData.mouseOver) {
            const text = "The smog clouds represent the nitrous oxide in the atmosphere.";
            const value = hoveredSmogData.value ? `Value: ${hoveredSmogData.value} ppb` : `[No Value For Current Date]`;
            p.noFill();
            drawLegend(p, text, value);
        }
        
    };

    // p.windowResized = () => {
    //     p.resizeCanvas(p.windowWidth, p.windowHeight);
    //     p.redraw();
    //     document.getElementById("p5-canvas").style.display = 'block';
    // }

    p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
        temperatureData = newProps.temperatureData;
        currentDate = newProps.currentDate;
        microGrowth2050 = newProps.microGrowth2050;
        macroGrowth2050 = newProps.macroGrowth2050;
        carbonData = newProps.carbonData;
        methaneData = newProps.methaneData;
        seaLevelRise = newProps.seaLevelRise;
        nitrousData = newProps.nitrousData;
    };

    p.mouseClicked = () => {
        if (p.mouseX < p.width && p.mouseX > 0 && p.mouseY < p.height && p.mouseY > 0){
            showLegend = false;
        }
    };
}

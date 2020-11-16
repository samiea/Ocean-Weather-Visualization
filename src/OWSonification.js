import React from "react";
import * as Tone from "tone";
import bubbles from "./sounds/bubbles.wav";
import "./Child2.css";

class Child2 extends React.Component {
    constructor(props) {
        super(props);
        
        //Setting state
        this.state = { 
            //Sounds load states
            isLoaded: false,

            //Effects levels
            distortionLevel: 0,
            reverbLevel: 0,

            //Frequencies
            trebleFreqs: [523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77], //C5-B5
            consonantIntervals: [0, 4, 7, 9], //unison, maj third, perf fifth, maj sixth
            dissonantIntervals: [1, 2, 3, 5, 6, 8, 10, 11], //min second, maj second, min third, perf fourth, tritone, min sixth, min seventh, maj seventh
            consonanceProbability: 100,
            
            //Synth parameters
            fatSpread: 0,
            fatDetune: 0,
            amHarm: 0,

            //All audio on/off
            audioState: false,
            
            //Audio layer solo states
            playbackState: false,
            fatOscState: false,
            amOscState: false,
            
            //Updating
            updateCount: 0,
            dataUpdateCount: 0
        };

        //Binding functions
        this.initialize = this.initialize.bind(this);
        this.startAudio = this.startAudio.bind(this);
        this.getNewData = this.getNewData.bind(this);

        //Effects
        this.dist = new Tone.Distortion(0).toDestination();

        this.rev = new Tone.Reverb(1).toDestination();

        //Sound sources
        this.buffer = new Tone.ToneAudioBuffer();
        //this.buffer.debug = true;
        this.buffer.load(bubbles);

        this.player = new Tone.Player(this.buffer, () => {
            // console.log("Player ready!");
            this.setState({ isLoaded: true });
            this.player.loop = true;
            this.initialize();
        }).chain(this.dist, this.rev, Tone.Destination);

        this.fatOsc = new Tone.FatOscillator("C3", "sawtooth", 40).chain(this.dist, this.rev, Tone.Destination);

        this.am = new Tone.AMOscillator("E3", "sine", "square").chain(this.dist, this.rev, Tone.Destination);
    
        this.fm = new Tone.FMOscillator("G3", "sine", "square").chain(this.dist, this.rev, Tone.Destination);
    }

    initialize() {
        //set state and start Tone
        this.getNewData();
        Tone.start();
        Tone.Transport.start();

        //set volume
        this.player.volume.value = -100;
        this.fatOsc.volume.value = -100;
        this.am.volume.value = -100;

        //set effects
        this.dist.wet.rampTo(0);
        this.dist.distortion = 0;

        //set frequency
        this.fatOsc.frequency.rampTo(65.41);
        this.am.frequency.rampTo(this.state.trebleFreqs[0]);
    }

    getNewData() {
        //get current date
        var currDate = this.props.currentDate.getFullYear();
        
        //index: TEMPERATURE
        var index = ((currDate - 1880) * this.props.temperatureData.length) / 140 - 100;
        index = Math.round(index);

        //map from -1 - 1 to 0 - 400 using (value - x1) * (y2 - x2) / (y1 - x1) + x2
        var spread = (this.props.temperatureData[index].station + 1) * (400 - 0) / (1 + 1);
        this.setState({ fatSpread: spread });

        //index: MICROPLASTICS
        index = currDate - 1950;

        //map from 90 to 620 to 100 to 0 using same formula as above
        var cp = (this.props.microGrowth2050[index][1] - 90) * (0 - 100) / (620 + 90) + 100;
        this.setState({ consonanceProbability: cp });        

        //index: MACROPLASTICS
        index = currDate - 1950;
        
        //map from 90 to 620 to 0.5 to 4.0 using same formula as above
        var aH = (this.props.macroGrowth2050[index][1] - 90) * (4.0 - 0.5) / (620 - 90) + 0.5;
        this.setState({ amHarm: aH });

        //index: CARBON
        var yearGap = 390;
        var monthGap = yearGap / 12;
        var year_index = currDate - 2010;
        var month_index = this.props.currentDate.getMonth() - 1;

        var current_index = yearGap * year_index + month_index * monthGap;
        current_index = current_index | 0;

        //map from 387 to 413 to 0.0 to 1.0 using same formula as above
        var distLevel = (this.props.carbonData[currDate - 1880].trend - 387) / (413 - 387);
        this.setState({ distortionLevel: distLevel });

        //index: SEA LEVEL
        index = currDate - 1880;
        
        //map from 0 to 9 to 0 to 1100 using same formula as above
        var detune = 0;

        if (index < 0) {
            detune = 0;
        }

        if (currDate > 2013) {
            detune = this.props.seaLevelRise[(2013 - 1880)][1] * 1100 / 9;
        }
        else {
            detune = this.props.seaLevelRise[index][1] * 1100 / 9;
        }
        this.setState({ fatDetune: detune });
    }

    startAudio() {
        this.getNewData();
        this.rev.decay = 12;

        Tone.Transport.scheduleRepeat((time) => {
            //Refresh data
            this.getNewData();
            
            //Microplastics: Consonance probability
            var rand = Math.random() * 100; //get random number between 0 and 100

            var intervalIndex = 0;

            if (rand < this.state.consonanceProbability) {
                intervalIndex = Math.floor(Math.random() * 4);
                this.am.frequency.rampTo(this.state.trebleFreqs[this.state.consonantIntervals[intervalIndex]]);
            }
            else {
                intervalIndex = Math.floor(Math.random() * 8);
                this.am.frequency.rampTo(this.state.trebleFreqs[this.state.dissonantIntervals[intervalIndex]]);
            }

            //Macroplastics: AM harmonicity
            this.am.harmonicity.rampTo(this.state.amHarm);
            
            //Temperature: Fat osc spread
            this.fatOsc.spread = this.state.fatSpread;
            
            //Sea level rise: Fat osc detune
            this.fatOsc.detune.setValueAtTime(this.state.fatDetune, Tone.now());

            //Carbon: Distortion level
            this.dist.distortion = this.state.distortionLevel;
            this.dist.wet.rampTo(this.state.distortionLevel);

        }, "1hz", Tone.now());

        if (this.state.audioState === false) {
            this.player.start(Tone.now());
            this.fatOsc.start(Tone.now());
            this.am.start(Tone.now());

            this.player.volume.rampTo(0);
            this.fatOsc.volume.rampTo(-16);
            this.am.volume.rampTo(-24);
            this.setState({ audioState: true });
        }
        else if (this.state.audioState === true) {
            this.player.volume.rampTo(-100);
            this.fatOsc.volume.rampTo(-100);
            this.am.volume.rampTo(-100);

            this.player.stop(Tone.now());
            this.fatOsc.stop(Tone.now());
            this.am.stop(Tone.now());

            this.setState({ audioState: false });
        }
    }

    render() {
        const { isLoaded } = this.state;
        // console.log(this.state);

        return (
            <div className="Child2" >
                <button disabled={!isLoaded} onClick={this.startAudio}>
                    audio on/off
                </button>

            </div>
        );
    }

    componentDidMount() {
        // console.log("Child2 Mounted");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log("Child2 Updated");
    }
}

export default Child2


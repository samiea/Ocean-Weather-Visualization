import React, { Component } from "react";

class Contents extends Component {
	render() {
		return (
			<section id="wrapper">
				<section id="one" className="wrapper spotlight style1">
					<div className="inner">
						<div className="content">
							<h2 className="major">Artist Statement</h2>
							<p>
								Over the years, harmful pollutants have been
								exposed to our environment, particularly in
								recent times, causing worrisome ripples and
								concerns for the future of our natural world. We
								have some degree of awareness concerning growing
								levels of pollution in our atmosphere and
								oceans, but visually perceiving the impact of
								pollutants in the environment is not an easy
								task. This challenge may be due to difficulty
								for untrained eyes measuring increasing levels
								of pollutants in our environment on the basis of
								numbers alone.
							</p>
							<p>
								Our ambition was to create a 2D dynamic webpage
								where sonifications and visualizations based on
								live data are reflected in the objects present
								on the screen that users can engage with. These
								objects are auditory and kinetic representations
								of changing climate and pollution levels over
								time for global ocean and weather data. By
								presenting sonifications and visualizations of
								the effects climate change and pollutants have
								and how those effects will accelerate in their
								severity, we want to encourage creators and
								users alike to be more environmentally conscious
								and inspire change that would contribute to a
								cleaner and healthier Earth.
							</p>
						</div>
					</div>
				</section>

				<section id="two" className="wrapper alt spotlight style2">
					<div className="inner">
						<div className="content">
							<h2 className="major">Data</h2>
							<p>
								We used carbon dioxide, methane, nitrous oxide
								and average global temperature derived
								from&nbsp;
								<a
									href="https://global-warming.org"
									target="_blank"
									rel="noopener noreferrer"
								>
									global-warming.org
								</a>
								. We used this to change sun size and color,
								size of clouds and the color of the sea and sky
								as well as the audio. We demonstrate sea level
								to rise with data acquired from the EPA, and
								micro/macro plastic data from&nbsp;
								<a
									href="https://ourworldindata.org"
									target="_blank"
									rel="noopener noreferrer"
								>
									ourworldindata.org
								</a>
								.
							</p>
							<p>
								<p>
									Additionally, it is very seldom that people
									hear data as well; certain auditory data is
									normal, such as the beeping of a heartbeat
									monitor in a hospital or an old clock bell
									tolling to tell the hour, but rarely is it
									presented in a similar fashion as data
									visuals are. In this project, we added an
									optional audio component that uses the same
									data that is being used to determine the
									visuals, and translates it into sound. The
									detune spread of the bass sound's multiple
									oscillators is controlled by the
									temperature, the overall bass detune is
									controlled by the sea level, the probability
									of a consonant vs dissonant interval as
									defined by medieval counterpoint rules is
									controlled by the microplastic level, the
									number of partials of the treble synthesizer
									is controlled by the macro plastic levels,
									and distortion and reverb effects are
									inversely controlled by the carbon levels.
								</p>
							</p>
							<a
								href={"index.html"}
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("p5-canvas")
										.scrollIntoView({
											behavior: "smooth",
										});
								}}
								className="special"
							>
								Click to scroll to our content
							</a>
						</div>
					</div>
				</section>

				{/* <section id="three" className="wrapper spotlight style3">
					<div className="inner">
						<a href="index.html" className="image">
							<img src={`${process.env.PUBLIC_URL}/images/pic03.jpg`} alt="" />
						</a>
						<div className="content">
							<h2 className="major">Nullam dignissim</h2>
							<p>
								Lorem ipsum dolor sit amet, etiam lorem
								adipiscing elit. Cras turpis ante, nullam sit
								amet turpis non, sollicitudin posuere urna.
								Mauris id tellus arcu. Nunc vehicula id nulla
								dignissim dapibus. Nullam ultrices, neque et
								faucibus viverra, ex nulla cursus.
							</p>
							<a href="index.html" className="special">
								Learn more
							</a>
						</div>
					</div>
				</section> */}
			</section>
		);
	}
}

export default Contents;

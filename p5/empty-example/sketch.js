var osc, fft;

//-----------------------------------------------------------------------------
var slider_A, slider_D, slider_S, slider_R;
var slider_attackLevel, slider_releaseLevel;
var slider_delayTime, slider_delayFeedback, slider_delayFilterCutoff;
//-----------------------------------------------------------------------------
//Envelope var:
var env;

var attackLevel = 1.0;
var releaseLevel = 0;

var attackTime = 0.001
var decayTime = 0.2;
var susPercent = 0.2;
var releaseTime = 0.5;

//-----------------------------------------------------------------------------
//Delay var:
var delay;
var delayTime = 1;
var delayFeedback = 1;
var delayFilterCutoff = 2300;

function setup() 
{
	var cnv = createCanvas(720, 480);
	frameRate(44);

	//-----------------------------------------------------------------------------
	//Slider Interface config:
	slider_A = createSlider(0, 1,  0.01, 0);
	slider_A.position(10, 10);
	slider_A.style('height,', '80px');
	

	slider_D = createSlider(0, 1, 0.2, 0);
	slider_D.position(10, 40);
	slider_D.style('height,', '80px');

	slider_S = createSlider(0, 1, 0.2, 0);
	slider_S.position(10, 70);
	slider_S.style('height,', '80px');

	slider_R = createSlider(0, 1, 0.5, 0);
	slider_R.position(10, 100);
	slider_R.style('height,', '80px');

	slider_attackLevel = createSlider(0, 1, 1, 0);
	slider_attackLevel.position(10, 140);
	slider_attackLevel.style('height,', '80px');

	slider_releaseLevel = createSlider(0, 1, 0, 0);
	slider_releaseLevel.position(10, 170);
	slider_releaseLevel.style('height,', '80px');

	slider_delayTime = createSlider(0, 1, 1, 0);
	slider_delayTime.position(10, 210);
	slider_delayTime.style('height,', '80px');

	slider_delayFeedback = createSlider(0, 0.99, 0.5, 0);
	slider_delayFeedback.position(10, 240);
	slider_delayFeedback.style('height,', '80px');

	slider_delayFilterCutoff = createSlider(0, 2300, 1150, 0);
	slider_delayFilterCutoff.position(10, 270);
	slider_delayFilterCutoff.style('height,', '80px');

	//-----------------------------------------------------------------------------
	osc = new p5.SawOsc(); // set frequency and type
	fft = new p5.FFT();

	//-----------------------------------------------------------------------------
	//Envelope
	env = new p5.Env();
	env.setADSR(attackTime, decayTime, susPercent, releaseTime);
	env.setRange(attackLevel, releaseLevel);

	osc.amp(env);

	cnv.mousePressed(playEnv);
	osc.start();

	attackLevel = slider_attackLevel.value();
	releaseLevel = slider_releaseLevel.value();

	attackTime = slider_A.value();
	decayTime = slider_D.value();
	susPercent = slider_S.value();
	releaseTime = slider_R.value();

	//-----------------------------------------------------------------------------
	//Delay:
	delay = new p5.Delay();
	delay.process(osc, .12, .7, 2300);

	//-----------------------------------------------------------------------------
	background(0, 255, 0);	
}

function draw() 
{
	background(100, 100, 100);

	//-----------------------------------------------------------------------------
	//FFT:
	var spectrum = fft.analyze();
	noStroke();
	fill(0,255,0); // spectrum is green
	for (var i = 0; i< spectrum.length; i++)
	{
		var x_fft = map(i, 0, spectrum.length, 0, width);
		var h_fft = -height + map(spectrum[i], 0, 255, height, 0);
		rect(x_fft, height, width/spectrum.length, h_fft );
	}
	
	//-----------------------------------------------------------------------------
	//time wave:
	var waveform = fft.waveform();  // analyze the waveform
	fill(255); 
	beginShape();
	strokeWeight(5);
	for (var i = 0; i < waveform.length; i++)
	{
		var x_wave = map(i, 0, waveform.length, 0, width);
		var y_wave = map(waveform[i], -1, 1, height, 0);
		vertex(x_wave, y_wave);
	}
	endShape();

	//-----------------------------------------------------------------------------
	// change oscillator frequency based on mouseX:
	var freq = map(mouseX, 0, width, 40, 880);
	osc.freq(freq);

	//-----------------------------------------------------------------------------
	// change envelope:	
	attackLevel = slider_attackLevel.value();
	text("A level", slider_attackLevel.x * 2 + slider_attackLevel.width, slider_attackLevel.y +10);
	releaseLevel = slider_releaseLevel.value();
	text("R level", slider_attackLevel.x * 2 + slider_attackLevel.width, slider_releaseLevel.y +10);

	attackTime = slider_A.value();
	text("A: ", slider_A.x * 2 + slider_A.width, slider_A.y + 10);
	decayTime = slider_D.value();
	text("D: ", slider_A.x * 2 + slider_D.width, slider_D.y + 10);
	susPercent = slider_S.value();
	text("S: ", slider_A.x * 2 + slider_S.width, slider_S.y + 10);
	releaseTime = slider_R.value();
	text("R: ", slider_A.x * 2 + slider_R.width, slider_R.y + 10);

	env.setADSR(attackTime, decayTime, susPercent, releaseTime);
	env.setRange(attackLevel, releaseLevel);

	//-----------------------------------------------------------------------------
	// change delay:
	delayTime = slider_delayTime.value();
	text("Delay Time: "+delayTime, slider_delayTime.x * 2 + slider_delayTime.width, slider_delayTime.y + 10);
	delayFeedback = slider_delayFeedback.value();
	text("Delay Feedback: "+delayFeedback, slider_delayFeedback.x * 2 + slider_delayFeedback.width, slider_delayFeedback.y + 10);
	delayFilterCutoff = slider_delayFilterCutoff.value();
	text("Delay CutOff: "+delayFilterCutoff, slider_delayFilterCutoff.x * 2 + slider_delayFilterCutoff.width, slider_delayFilterCutoff.y + 10);

	delay.delayTime(delayTime);
	delay.feedback(delayFeedback);
	delay.filter(delayFilterCutoff);
}

function playEnv()
{
  env.play();
}
console.log(webAudioAmbisonic);

// Setup audio context and variables
var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext; // Safari and old versions of Chrome
var context = new AudioContext; // Create and Initialize the Audio Context

// added resume context to handle Firefox suspension of it when new IR loaded
// see: http://stackoverflow.com/questions/32955594/web-audio-scriptnode-not-called-after-button-onclick
context.onstatechange = function() {
    if (context.state === "suspended") { context.resume(); }
}

//var sound_1 = "sounds/animal/Birds_and_Moves_ACN_SN3D.wav";
//var sound_2 = "sounds/animal/Bird_ACN_SN3D.wav";
////var sound_3 = "sounds/attacks.wav";

var mono_1 = "sounds/animal/Dolphins.mp3"
var mono_2 = "sounds/animal/Lion roar animals103.wav"
var mono_3 = "sounds/clicks_mono.wav"

var mono, mono2, mono3;

var irUrl_0 = "node_modules/web-audio-ambisonic/examples/IRs/HOA4_filters_virtual.wav";
var irUrl_1 = "node_modules/web-audio-ambisonic/examples/IRs/HOA4_filters_direct.wav";
var irUrl_2 = "node_modules/web-audio-ambisonic/examples/IRs/room-medium-1-furnished-src-20-Set1.wav";

var maxOrder = 3;
var orderOut = 3;
//var soundBuffer, soundBuffer2;
var monoBuffer, monoBuffer2, monoBuffer3;
var alpha2, alpha3;

// define HOA order limiter (to show the effect of order)
var limiter = new webAudioAmbisonic.orderLimiter(context, maxOrder, orderOut);
console.log(limiter);

var limiter2 = new webAudioAmbisonic.orderLimiter(context, maxOrder, orderOut);
console.log(limiter2);

var limiter3 = new webAudioAmbisonic.orderLimiter(context, maxOrder, orderOut);
console.log(limiter3);

//Mono encoders
var encoder = new webAudioAmbisonic.monoEncoder(context, maxOrder);
console.log(encoder);
var encoder2 = new webAudioAmbisonic.monoEncoder(context, maxOrder);
console.log(encoder2);
var encoder3 = new webAudioAmbisonic.monoEncoder(context, maxOrder);
console.log(encoder3);

// define HOA rotator
var rotator = new webAudioAmbisonic.sceneRotator(context, maxOrder);
rotator.init();
console.log(rotator);

var rotator2 = new webAudioAmbisonic.sceneRotator(context, maxOrder);
rotator2.init();
console.log(rotator2);

var rotator3 = new webAudioAmbisonic.sceneRotator(context, maxOrder);
rotator3.init();
console.log(rotator3);

// binaural HOA decoder
var decoder = new webAudioAmbisonic.binDecoder(context, maxOrder);
console.log(decoder);

// output gain
var masterGain = context.createGain();
var gain1 = context.createGain();
var gain2 = context.createGain();
var gain3 = context.createGain();

// connect HOA blocks
encoder.out.connect(limiter.in);
encoder2.out.connect(limiter2.in);
encoder3.out.connect(limiter3.in);

limiter.out.connect(rotator.in);
limiter2.out.connect(rotator2.in);
limiter3.out.connect(rotator3.in);

rotator.out.connect(gain1);
gain1.connect(decoder.in);

rotator2.out.connect(gain2);
gain2.connect(decoder.in);

rotator3.out.connect(gain3);
gain3.connect(decoder.in);

decoder.out.connect(masterGain);
masterGain.connect(context.destination);


// function to assign sample to the sound buffer for playback (and enable playbutton)
var assignSample2SoundBuffer = function(decodedBuffer) {
    monoBuffer = decodedBuffer;
    document.getElementById('play').disabled = false;
}
var assignSample2SoundBuffer2 = function(decodedBuffer) { monoBuffer2 = decodedBuffer;}
var assignSample2SoundBuffer3 = function(decodedBuffer) { monoBuffer3 = decodedBuffer;}

// function to load samples
function loadSample(url, doAfterLoading) {
    var fetchSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
    fetchSound.open("GET", url, true); // Path to Audio File
    fetchSound.responseType = "arraybuffer"; // Read as Binary Data
    fetchSound.onload = function() {
        context.decodeAudioData(fetchSound.response, doAfterLoading);
    }
    fetchSound.send();
}
loadSample(mono_1, assignSample2SoundBuffer);
loadSample(mono_2, assignSample2SoundBuffer2);
loadSample(mono_3, assignSample2SoundBuffer3);

//// load samples and assign to buffers
//var assignSoundBufferOnLoad = function(buffer) {
//    soundBuffer = buffer;
//    document.getElementById('play').disabled = false;
//}
//var assignSoundBufferOnLoad2 = function(buffer) { soundBuffer2 = buffer;}
//var assignSoundBufferOnLoad3 = function(buffer) { soundBuffer3 = buffer;}

//var loader_sound_1 = new webAudioAmbisonic.HOAloader(context, maxOrder, sound_1,assignSoundBufferOnLoad);
//loader_sound_1.load();
//var loader_sound_2 = new webAudioAmbisonic.HOAloader(context, maxOrder, sound_2, assignSoundBufferOnLoad2);
//loader_sound_2.load();
//var loader_sound_3 = new webAudioAmbisonic.HOAloader(context, maxOrder, sound_3, assignSoundBufferOnLoad3);
//loader_sound_3.load();

// load filters and assign to buffers
var assignFiltersOnLoad = function(buffer) {
    decoder.updateFilters(buffer);
}

var loader_filters = new webAudioAmbisonic.HOAloader(context, maxOrder, irUrl_1, assignFiltersOnLoad);
loader_filters.load();

// lookup table for the compass data -> rotator
var lookup = new Array(361) ;
for (var i = 0 ; i < 360 ; i++) {
	if (i < 180){ lookup[i] = - i; }
	if (i >= 180){ lookup[i] = (360-i); }};
	lookup[360] = 0;


$(document).ready(function() {
   // Init event listeners
    document.getElementById('play').addEventListener('click', function() {

        mono = context.createBufferSource();
        mono.name = "src1"
        mono.buffer = monoBuffer;
        mono.connect(encoder.in);
        mono.loop = true;
        mono.start(0);
        mono.isPlaying = true;
        
        mono2 = context.createBufferSource();
        mono2.name = "src2"
        mono2.buffer = monoBuffer2;
        mono2.connect(encoder2.in);
        mono2.loop = true;
        mono2.start(0);
        mono2.isPlaying = true;

        mono3 = context.createBufferSource();
        mono3.name = "src3"
        mono3.buffer = monoBuffer3;
        mono3.connect(encoder3.in);
        mono3.loop = true;
        mono3.start(0);
        mono3.isPlaying = true;


        document.getElementById('play').disabled = true;
        document.getElementById('stop').disabled = false;
    });

    document.getElementById('stop').addEventListener('click', function() {
        mono.stop(0);
        mono2.stop(0);
        mono3.stop(0);
//        mono.disconnect(encoder.in);
//        mono2.disconnect(encoder2.in);
//        mono3.disconnect(encoder3.in);


        mono.isPlaying = false;
        mono2.isPlaying = false;
        mono3.isPlaying = false;

        document.getElementById('play').disabled = false;
        document.getElementById('stop').disabled = true;
    });

//    document.getElementById('N1').addEventListener('click', function() {
//        orderOut = 1;
//        orderValue.innerHTML = orderOut;
//        limiter.updateOrder(orderOut);
//        limiter.out.connect(rotator.in);
//    });
//
//    document.getElementById('N2').addEventListener('click', function() {
//        orderOut = 2;
//        orderValue.innerHTML = orderOut;
//        limiter.updateOrder(orderOut);
//        limiter.out.connect(rotator.in);
//    });
//    document.getElementById('N3').addEventListener('click', function() {
//        orderOut = 3;
//        orderValue.innerHTML = orderOut;
//        limiter.updateOrder(orderOut);
//        limiter.out.connect(rotator.in);
//    });


});

window.addEventListener('deviceorientation', function(evenement) {
	document.getElementById("alpha").innerHTML = Math.round( evenement.alpha );
	//console.log(evenement.alpha);
	document.getElementById("beta").innerHTML = Math.round( evenement.beta );
	updateRotator(Math.round(evenement.alpha), Math.round(evenement.beta));
}),false;

var updateRotator = function(alpha, beta) {
	rotator.yaw = angleSourcePosition(alpha, currentPosXY, source1x);
	source1Y.innerHTML = rotator.yaw;
	rotator2.yaw = angleSourcePosition(alpha, currentPosXY, source2x);
	source2Y.innerHTML = rotator2.yaw;
	rotator3.yaw = angleSourcePosition(alpha, currentPosYX, source3x);;
//	rotator.pitch = beta;
	rotator.updateRotMtx();
	rotator2.updateRotMtx();	
    rotator3.updateRotMtx();
};
	
Number.prototype.toRadians = function() {
   return this * Math.PI / 180;  
}
Number.prototype.toDegrees = function() {
   return this * 180 / Math.PI;
}

function calcDistanceGPS(lat1, lat2, lon1, lon2) {
	var R = 6371e3;
    var y1 = lat1.toRadians();
    var y2 = lat2.toRadians();
    var deltaLat = (lat2-lat1).toRadians();
    var deltaLon = (lon2-lon1).toRadians();

    var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(y1) * Math.cos(y2) *
            Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return(R * c) ;
}

function calcPosition(coord1, coord2){
	x = calcDistanceGPS(coord1[0], coord1[0], coord1[1], coord2[1]);
	y = calcDistanceGPS(coord1[0], coord2[0], coord1[1], coord1[1]);
	
	if (coord1[1]-coord2[1] > 0 ) { x = -x ;}
	if (coord2[0]-coord1[0] > 0) {y = -y ;}

	return [y,x]; // latitude, longitude
}
function calcDistanceReceiverBordSource(recx,recy,sx,sy,rayon) {
	//coordonnées de l'intersection entre ligne "source receiver" et coverage circle de source
	// y=mx+c
	// données en mètres
    m= (recy-sy)/(recx-sx);
	c=sy-(m*sx);
	A= ((m*m)+1);
	B=2*((m*c)-(m*sy)-sx);
	C=((sy*sy)-(rayon*rayon)+(sx*sx)-(2*(c*sy))+(c*c));
	
	x1=((-B)+Math.sqrt((B*B)-(4*A*C)))/(2*A);
	x2=((-B)-Math.sqrt((B*B)-(4*A*C)))/(2*A);
	y1=(m*x1)+c;
	y2=(m*x2)+c;
	
	//check which of the 2 intersection points is the closer to the receiver
	d1= Math.abs(Math.sqrt(((recx-x1)*(recx-x1))+((recy-y1)*(recy-y1))));
	d2= Math.abs(Math.sqrt(((recx-x2)*(recx-x2))+((recy-y2)*(recy-y2))));
	d= Math.min(d1, d2);
return [x1,y1,x2,y2,d];
}

function gainD(distance){
	if (distance < 30){ return ((30-distance)/30);}
	else return(0);
}

Array.prototype.swap = function(){
	// swap the 2 elements of the array.
	var array = new Array();
	array[1] = this[0];
	array[0] = this[1];
	return array;
}

function calcDistance(A, B){
	return (Math.sqrt((B[0]-A[0])*(B[0]-A[0])+(B[1]-A[1])*(B[1]-A[1])));
}

function angleSourcePosition(alpha, pos, src){
	var alphaROT;
	//pos.swap();
	// Exceptions 0 90 180 270
	if (pos[0] == src[0] && pos[1] < src[1]){
		// source facing
		return(lookup[alpha]);
	}
	if (pos[0] == src[0] && pos[1] > src[1]){
		// source in the back
		return(alpha-180);
	}
	if (pos[1] == src[1] && pos[0] < src[0]){
		// source on the right
		if (alpha > 90) { return(alpha-270);}
		else { return lookup[270 - alpha];}
	}
	if (pos[1] == src[1] && pos[0] > src[0]){
		// source on the left
		if (alpha < 270) {return(alpha-90);}
		else { return (90 - lookup[alpha]);}
	}
	
	var alphaSource = Math.acos(Math.abs(src[1]-pos[1])/Math.sqrt((src[0]-pos[0])*(src[0]-pos[0])+(src[1]-pos[1])*(src[1]-pos[1])))*180/Math.PI;

	
	if (src[0] < pos[0]){
		if (src[1] < pos[1]){alphaSource = 180 - alphaSource ;}
	} else {
		if (src[1] < pos[1]){alphaSource = alphaSource + 180 ;}
		else { alphaSource = 360 - alphaSource ; }
	}	
	//console.log(alphaSource);
	alphaROT = Math.round(alpha-alphaSource);
	if (alphaROT < -180) return(alphaROT + 360);
	if (alphaROT > 180) return(alphaROT - 360);
	return (alphaROT);
}

var muteSource = function(src, src_encoder) {

    if (typeof src != "undefined") {
        if (src.isPlaying) {
            console.log("MUTE " + src.name);
            src.disconnect(src_encoder.in);
            src.isPlaying = false;

        } else {
            console.log("UNMUTE " + src.name);
            src.connect(src_encoder.in);
            src.isPlaying = true;
        }
        return true
    }
    return false
}



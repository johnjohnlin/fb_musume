(function() {

/* private utilities */
Array.prototype.randomSelect = function() {
	return this[Math.floor(Math.random()*this.length)];
}

function msToNextHour() {
	var now = new Date();
	// return 5000 + 5000*Math.random();
	return 3601000 - (now.getMinutes()*60 + now.getSeconds())*1000;
}


/* class definition */
var Character = function(character_config, user_config) {
	// Store configs
	this.initEventFunctions();
	this.parseConfig(character_config); // NOTE: store in this.config for cleaner code
	this.parseUserConfig(user_config);

	// Initialize objects
	this.elem = this.createElement();
	document.querySelector("body").appendChild(this.elem);

	// Class variables

	// Start loop
	this.updateWord(); // We will periodically update it in onHour
	this.start_hour();
	this.start_idle();
}

/* static data */
Character.prototype.template = [
	'<div class="fbm-top">',
		'<img class="character">',
		'<div class="msg-box">',
			'Hello',
		'</div>',
		'<div class="voice-set">',
		'</div>',
	'</div>'
].join("");

/* construct functions */
Character.prototype.initEventFunctions = function() {
	Object.keys(Character.prototype).filter(function(key) {
		return /^on.*/.test(key);
	}).forEach(function(key) {
		this[key] = this[key].bind(this);
	}, this);
}

Character.prototype.parseConfig = function(config) {
	this.config = config;
	for (var state_name in this.config.animations) {
		this.config.animations[state_name].forEach(function(frame) {
			frame.path = chrome.extension.getURL("assets/" + frame.path);
		});
	}

	this.config.voice = this.config.voice.map(function(voice_path) {
		return chrome.extension.getURL("assets/" + voice_path);
	});
}

Character.prototype.parseUserConfig = function(user_config) {
	this.user_config = user_config;
	this.user_config.refresh_time_ms = this.user_config.refresh_time*1000;
}

Character.prototype.createElement = function() {
	// Create DOMs
	var div = document.createElement('div');
	div.innerHTML = this.template;

	// Create voice DOMs
	if (this.user_config.enable_voice) {
		var voice_set = div.querySelector('.voice-set');
		this.config.voice.forEach(function(voice_path) {
			var audio = document.createElement('audio');
			audio.src = voice_path;
			voice_set.appendChild(audio);
		});
	}

	// Register events
	var character = div.querySelector('.character');
	character.addEventListener('click', this.onClick);
	return div;
}

/* members */
Character.prototype.start_idle = function(delay) {
	this.stop_idle()
	var idle_count = 0;
	var idle_tick_func = function() {
		this.onIdle();
		var next_delay = this.user_config.refresh_time_ms*(1 + 0.5 * idle_count++);
		this.next_idle = setTimeout(idle_tick_func, next_delay);
	}.bind(this);
	if (delay) {
		this.next_idle = setTimeout(idle_tick_func, delay);
	} else {
		idle_tick_func();
	}
}

Character.prototype.stop_idle = function() {
	if (this.next_idle) {
		clearTimeout(this.next_idle);
	}
	this.next_idle = null;
}

// I will never stop this loop
Character.prototype.start_hour = function() {
	var hour_tick_func = function() {
		this.onHour()
		setTimeout(hour_tick_func, msToNextHour());
	}.bind(this);
	setTimeout(hour_tick_func, msToNextHour());
}

Character.prototype.start_animation = function(animation_name) {
	if (this.animation_name == animation_name) {
		return;
	}
	this.stop_animation();
	this.animation_name = animation_name;

	var animation = this.config.animations[this.animation_name];
	var frame_idx = 0;
	var character = this.elem.querySelector('.character');

	var animation_tick_func = function() {
		var frame = animation[frame_idx];
		character.src = frame.path;
		frame_idx = (frame_idx + 1) % animation.length;
		if (frame.duration > 0) {
			this.next_animation = setTimeout(animation_tick_func, frame.duration);
		}
	}.bind(this);
	animation_tick_func();
}

Character.prototype.stop_animation = function() {
	if (this.next_animation) {
		clearTimeout(this.next_animation);
	}
	this.next_animation = null;
}

Character.prototype.say = function(word, voice_id) {
	var msgBox = this.elem.querySelector('.msg-box');
	msgBox.classList.remove('show');
	// force to reset classList
	msgBox.offsetHeight = msgBox.offsetHeight;
	msgBox.innerText = word;
	msgBox.classList.add('show');

	if (this.user_config.enable_voice && typeof voice_id !== 'undefined') {
		var voice_set = this.elem.querySelectorAll('.voice-set audio');
		if (typeof this.current_voice_id !== 'undefined') {
			// The condition is false only at the first time
			// Can we modify it?
			voice_set[this.current_voice_id].pause();
		}
		voice_set[voice_id].currentTime = 0;
		voice_set[voice_id].play();
		this.current_voice_id = voice_id;
	}
}

Character.prototype.updateWord = function() {
	this.words = this.config.scripts.idle.words
		.filter(function(word) {
			return word.predicate === true || word.predicate();
		});
}

/* events */
Character.prototype.onIdle = function() {
	var idle_scripts = this.config.scripts.idle;
	var word = this.words.randomSelect(); // select from the filtered one
	this.start_animation(idle_scripts.animation);
	this.say(word.word, word.voice);
}

Character.prototype.onClick = function() {
	var click_scripts = this.config.scripts.click;
	var word = click_scripts.words.randomSelect();
	this.start_animation(click_scripts.animation);
	this.say(word.word, word.voice);
	this.start_idle(this.user_config.refresh_time_ms);
}

Character.prototype.onHour = function() {
	this.updateWord();
	var hour_scripts = this.config.scripts.hour;
	var word = hour_scripts.words[(new Date()).getHours()]
	this.start_animation(hour_scripts.animation);
	this.say(word.word, word.voice);
	this.start_idle(this.user_config.refresh_time_ms);
}

window.Character = Character;

})();

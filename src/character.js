(function() {

/* private utilities */
Array.prototype.randomSelect = function() {
	return this[Math.floor(Math.random()*this.length)];
}

function msToNextHour() {
	var now = new Date();
	return 3601000 - (now.getMinutes()*60 + now.getSeconds())*1000;
}


/* class definition */
var Character = function(character_config, user_config) {
	// Store configs
	this.initEventFunctions();
	this.parseConfig(character_config); // NOTE: store in this.config for cleaner code
	this.parseUserConfig(user_config);

	// Initialize DOM objects
	this.elem = this.createElement();

	// Class variables
	this.idle_count = 0;

	// Start loop
	this.updateWord(); // We will periodically update it in onHour
	this.start_hour();
	this.start_idle();
}

/* static data */
Character.prototype.template = [
	'<div class="character">',
		'<img class="canvas">',
		'<div class="msg-box">',
		'</div>',
		'<audio class="voice" data-fbm=true ></audio>',
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
	// TODO: move path translation to fb_musume.js?
	for (var state_name in this.config.animations) {
		this.config.animations[state_name].forEach(function(frame) {
			frame.full_path = chrome.extension.getURL("assets/" + frame.path);
		});
	}
}

Character.prototype.parseUserConfig = function(user_config) {
	this.user_config = user_config;
	this.user_config.refresh_time_ms = this.user_config.refresh_time*1000;
}

Character.prototype.createElement = function() {
	// Create DOMs
	var div = document.createElement('div');
	div.innerHTML = this.template;
	div = div.firstChild;

	// Register events
	var character = div.querySelector('.canvas');
	character.addEventListener('click', this.onClick);
	div.addEventListener('message', this.onMessage);
	div.addEventListener('club_notify', this.onClubNotify);
	return div;
}

Character.prototype.destroy = function() {
	this.stop_idle();
	this.stop_hour();
	this.stop_animation();
	var div = this.elem
	var character = div.querySelector('.canvas');
	character.removeEventListener('click', this.onClick);
	div.removeEventListener('message', this.onMessage);
	div.removeEventListener('club_notify', this.onClubNotify);
	this.elem.remove();
	// prevent circular reference
	Object.keys(this).forEach(function(key) {
		this[key] = null;
	});
}

/* members */
Character.prototype.trigger = function(event_name, detail) {
	var event = new CustomEvent(event_name, true, true, {detail: detail});
	this.elem.dispatchEvent(event);
}

Character.prototype.start_idle = function(delay, reset_idle_count) {
	this.stop_idle();
	if (reset_idle_count) {
		this.idle_count = 0;
	}
	var idle_tick_func = function() {
		this.onIdle();
		var next_delay = this.user_config.refresh_time_ms*(1 + 0.5 * this.idle_count++);
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

Character.prototype.start_hour = function() {
	var hour_tick_func = function() {
		this.onHour()
		this.next_hour = setTimeout(hour_tick_func, msToNextHour());
	}.bind(this);
	this.next_hour = setTimeout(hour_tick_func, msToNextHour());
}

Character.prototype.stop_hour = function() {
	if (this.next_hour) {
		clearTimeout(this.next_hour);
	}
	this.next_hour = null;
}

Character.prototype.start_animation = function(animation_name) {
	if (this.animation_name == animation_name) {
		return;
	}
	this.stop_animation();
	this.animation_name = animation_name;

	var animation = this.config.animations[this.animation_name];
	var frame_idx = 0;
	var character = this.elem.querySelector('.canvas');

	var animation_tick_func = function() {
		var frame = animation[frame_idx];
		character.src = frame.full_path;
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

Character.prototype.say = function(word, voice_src) {
	var msgBox = this.elem.querySelector('.msg-box');
	msgBox.classList.remove('show');
	// force to reset classList
	msgBox.offsetHeight = msgBox.offsetHeight;
	msgBox.innerText = word;
	msgBox.classList.add('show');

	if (this.user_config.enable_voice && voice_src !== undefined) {
		var voice = this.elem.querySelector('.voice');
		if (!voice.paused) {
			voice.pause();
		}
		voice.src = chrome.extension.getURL(voice_src);
		voice.play();
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
	this.say(word.word_translated, word.voice);
}

Character.prototype.onClick = function() {
	var click_scripts = this.config.scripts.click;
	var word = click_scripts.words.randomSelect();
	this.start_animation(click_scripts.animation);
	this.say(word.word_translated, word.voice);
	this.start_idle(this.user_config.refresh_time_ms, true);
}

Character.prototype.onHour = function() {
	this.updateWord();
	var hour_scripts = this.config.scripts.hour;
	var word = hour_scripts.words[(new Date()).getHours()]
	this.start_animation(hour_scripts.animation);
	this.say(word.word_translated, word.voice);
	this.start_idle(this.user_config.refresh_time_ms);
}

Character.prototype.onMessage = function(event) {
	var fb_message_scripts = this.config.scripts.fb_message;
	var word = fb_message_scripts.words.randomSelect();
	this.start_animation(fb_message_scripts.animation);
	this.say(word.word_translated, word.voice);
	this.start_idle(this.user_config.refresh_time_ms);
}

Character.prototype.onClubNotify = function(event) {
	this.onMessage();
}

window.Character = Character;

})();

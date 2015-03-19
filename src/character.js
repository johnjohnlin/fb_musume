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

	// Initialize DOM objects
	this.elem = this.createElement();
	document.querySelector("body").appendChild(this.elem);

	// Class variables
	this.idle_count = 0;

	// Start loop
	this.updateWord(); // We will periodically update it in onHour
	this.start_hour();
	this.start_idle();
}

/* static data */
Character.prototype.template = [
	'<div class="fbm-top">',
		'<img class="character">',
		'<div class="dropdown">',
			'<ul class="menu"></ul>',
			'<span class="button"></span>',
		'</div>',
		'<div class="msg-box">',
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
			audio.dataset.fbm = true;
			voice_set.appendChild(audio);
		});
	}

	// Create dropdown DOMs
	var dropdown_menu = div.querySelector('.dropdown .menu');
	var createDropdown = function(text, func) {
		var li = document.createElement("li");
		li.innerText = text;
		li.addEventListener("click", func);
		dropdown_menu.appendChild(li);
	}

	// this two event handlers do not bind with 'this', without removing them is ok.
	createDropdown(i18n.t("setting"), function() {
		window.open(chrome.extension.getURL('src/settings.html'));
	});
	createDropdown(i18n.t("reload"), function() {
		alert(i18n.t("reload"));
	});

	// Register events
	var character = div.querySelector('.character');
	var dropdown_button = div.querySelector('.dropdown .button');
	character.addEventListener('click', this.onClick);
	div.addEventListener('mouseleave', this.onMouseleave);
	div.addEventListener('message', this.onMessage);
	div.addEventListener('club_notify', this.onClubNotify);
	dropdown_button.addEventListener('click', this.onDropdownToggle);
	return div;
}

Character.prototype.destroy = function() {
	this.stop_idle();
	this.stop_hour();
	this.stop_animation();
	var div = this.elem
	var character = div.querySelector('.character');
	var dropdown_button = div.querySelector('.dropdown .button');
	character.removeEventListener('click', this.onClick);
	div.removeEventListener('mouseleave', this.onMouseleave);
	div.removeEventListener('message', this.onMessage);
	div.removeEventListener('club_notify', this.onClubNotify);
	dropdown_button.removeEventListener('click', this.onDropdownToggle);
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

	if (this.user_config.enable_voice && voice_id !== undefined) {
		var voice_set = this.elem.querySelectorAll('.voice-set audio');
		if (this.current_voice) {
			this.current_voice.pause();
		}
		this.current_voice = voice_set[voice_id];
		this.current_voice.currentTime = 0;
		this.current_voice.play();
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
	this.start_idle(this.user_config.refresh_time_ms, true);
}

Character.prototype.onHour = function() {
	this.updateWord();
	var hour_scripts = this.config.scripts.hour;
	var word = hour_scripts.words[(new Date()).getHours()]
	this.start_animation(hour_scripts.animation);
	this.say(word.word, word.voice);
	this.start_idle(this.user_config.refresh_time_ms);
}

Character.prototype.onMessage = function(event) {
	var fb_message_scripts = this.config.scripts.fb_message;
	var word = fb_message_scripts.words.randomSelect();
	this.start_animation(fb_message_scripts.animation);
	this.say(word.word, word.voice);
	this.start_idle(this.user_config.refresh_time_ms);
}

Character.prototype.onClubNotify = function(event) {
	this.onMessage();
}

Character.prototype.onDropdownToggle = function(event) {
	this.elem.querySelector('.dropdown').classList.toggle('active');
}

Character.prototype.onMouseleave = function(event) {
	this.elem.querySelector('.dropdown').classList.remove('active');
}

window.Character = Character;

})();

(function() {

/* private utilities */
Array.prototype.randomSelect = function() {
	return this[Math.floor(Math.random()*this.length)];
}

/* class definition */
var Character = function(config) {
	this.initEventFunctions();
	this.parseConfig(config);
	this.elem = this.createElement();
	document.querySelector("body").appendChild(this.elem);
	this.hourUpdate();
	// FIXME: this.say will be called twice each 10s? Why?
	this.start_owo(true);
}

/* static data */
Character.prototype.template = [
	'<div class="fbm-top">',
		'<img class="character">',
		'<div class="msg-box">',
			'Hello',
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
}

Character.prototype.createElement = function() {
	var div = document.createElement('div');
	div.innerHTML = this.template;
	var character = div.querySelector('.character');
	character.addEventListener('click', this.onClick);
	return div;
}

/* members */
Character.prototype.start_owo = function(runIdle) {
	if (this.next_tick) {
		clearTimeout(this.next_tick);
	}
	if (runIdle) {
		this.onIdle();
	}
	var tick_func = function() {
		this.onIdle();
		this.next_tick = setTimeout(tick_func, 10000);
	}.bind(this);
	this.next_tick = setTimeout(tick_func, 10000);
}

Character.prototype.restart_owo = function(runIdle) {
	this.start_owo(runIdle);
}

Character.prototype.stop_owo = function(run) {
	if (this.next_tick) {
		clearTimeout(this.next_tick);
	}
	this.next_tick = null;
}

Character.prototype.say = function(word) {
	console.log(word);
	var msgBox = this.elem.querySelector('.msg-box');
	msgBox.classList.remove('show');
	// force to reset classList
	msgBox.offsetHeight = msgBox.offsetHeight;
	msgBox.innerText = word;
	msgBox.classList.add('show');
}

Character.prototype.changeAnimation = function(animation_name) {
	if (this.animation_name == animation_name) {
		return;
	}
	this.animation_name = animation_name;
	this.current_animation = this.config.animations[this.animation_name];
	this.current_animation_frame_idx = 0;

	this.nextFrame();
}

Character.prototype.nextFrame = function() {
	var character = this.elem.querySelector('.character');
	var current_frame_path = this.current_animation[this.current_animation_frame_idx].path;
	var current_frame_duration = this.current_animation[this.current_animation_frame_idx].duration;
	character.setAttribute("src", current_frame_path);

	// -1 for infinite
	if (current_frame_duration > 0) {
		this.next_frame_handle = setTimeout(
			this.nextFrame.bind(this),
			current_frame_duration
		);
	}

	this.current_animation_frame_idx += 1;
	if (this.current_animation_frame_idx === this.current_animation.length) {
		this.current_animation_frame_idx = 0;
	}
}

Character.prototype.hourUpdate = function() {
	this.words = this.config.scripts.idle.words
		.filter(function(word) {
			return word.predicate === true || word.predicate();
		}).map(function(word) {
			return word.word;
		});
}

/* events */
Character.prototype.onIdle = function() {
	//console.log('onIdle', Date.now());
	var idle_scripts = this.config.scripts.idle;
	var word = this.words.randomSelect(); // select from the filtered one
	this.changeAnimation(idle_scripts.animation);
	// FIXME: this.say will be called twice each 10s? Why?
	this.say(word);
}

Character.prototype.onClick = function() {
	var click_scripts = this.config.scripts.click;
	var word = click_scripts.words.randomSelect();
	this.changeAnimation(click_scripts.animation);
	this.say(word.word);
	this.restart_owo();
}

Character.prototype.onHour = function() {
	this.hourUpdate();
}

window.Character = Character;

})();

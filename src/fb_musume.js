(function() {

var FBMusume = function(user_config) {
	this.initEventFunctions();
	this.user_config = user_config;
	this.character = null;
	this.elem = this.createElement();
	this.body_observer = this.createBodyObserver();
};

/* static data */
FBMusume.prototype.template = [
'<div class="fbm-top">',
	'<div class="character-area">',
	'</div>',
	'<div class="dropdown">',
		'<ul class="menu"></ul>',
		'<span class="button"></span>',
	'</div>',
'</div>'
].join('');

/* construct functions */
FBMusume.prototype.initEventFunctions = function() {
	Object.keys(FBMusume.prototype).filter(function(key) {
		return /^on.*/.test(key);
	}).forEach(function(key) {
		this[key] = this[key].bind(this);
	}, this);
}

FBMusume.prototype.createElement = function() {
	var div = document.createElement('div');
	div.innerHTML = this.template;
	div = div.firstChild;

	// Create Dropdown
	var dropdown_menu = div.querySelector('.dropdown .menu');
	var dropdown_button = div.querySelector('.dropdown .button');
	var createDropdown = function(text, func) {
		var li = document.createElement("li");
		li.innerText = text;
		li.addEventListener("click", func);
		dropdown_menu.appendChild(li);
	}
	createDropdown(i18n.t("setting"), function() {
		window.open(chrome.extension.getURL('src/settings.html'));
	});
	createDropdown(i18n.t("reload"), function() {
		// reduce FBMusume.reload reference
		FBMusume.reload();
	});
	div.addEventListener('mouseleave', this.onDropdownOff);
	dropdown_button.addEventListener('click', this.onDropdownToggle);

	return div;
};

FBMusume.prototype.createBodyObserver = function() {
	var bind_func = function(tag) {
		if (tag.nodeName !== 'AUDIO' || tag.parentElement.nodeName !== "BODY" || tag.dataset.fbm) {
			return;
		}
		tag.dataset.fbm = true;
		tag.addEventListener('play', this.onFacebookAudioPlay);
	}.bind(this);
	// query one first
	Array.prototype.forEach.call(document.querySelectorAll('body>audio'), bind_func);
	return new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			Array.prototype.forEach.call(mutation.addedNodes, bind_func);
		});
	});
};

/* members */
FBMusume.prototype.loadCharacter = function(character_name) {
	character_name = character_name || this.user_config.character;
	if (this.character) {
		this.character.destroy();
		this.character = null;
	}
	var character_config = characters[character_name];
	this.translateCharacter(character_config);
	this.character = new Character(character_config, this.user_config);
	this.elem.querySelector('.character-area').appendChild(this.character.elem);
}

FBMusume.prototype.translateCharacter = function(character_config) {
	character_config.name_translated = i18n.t(character_config.name, {}, character_config.translate);
	for (script_name in character_config.scripts) {
		var words = character_config.scripts[script_name].words;
		words.forEach(function(word) {
			word.word_translated = i18n.t(word.word, {}, character_config.translate);
		});
	}
}

FBMusume.prototype.startOccupyYourFacebook_YAY = function() {
	document.querySelector("body").appendChild(this.elem);
	this.body_observer.observe(document.querySelector("body"), {
		childList: true, subtree: true
	});
}

FBMusume.prototype.destroy = function() {
	if (this.character) {
		this.character.destroy();
		this.character = null;
	}
	this.body_observer.disconnect();
	Array.prototype.forEach.call(document.querySelectorAll('body>audio'), function(dom) {
		dom.dataset.fbm = null;
		dom.remove("play", this.onFacebookAudioPlay);
	}.bind(this));

	var div = this.elem;
	var dropdown_menu = div.querySelector('.dropdown .menu');
	var dropdown_button = div.querySelector('.dropdown .button');
	div.removeEventListener('mouseleave', this.onDropdownOff);
	dropdown_button.removeEventListener('click', this.onDropdownToggle);
	this.elem.remove();
	Object.keys(this).forEach(function(key) {
		this[key] = null;
	});
}

/* events */
FBMusume.prototype.onFacebookAudioPlay = function(event) {
	if (!this.character) {
		return
	}
	var audio = event.target;
	audio.pause();
	if (audio.src === "https://fbstatic-a.akamaihd.net/rsrc.php/yy/r/odIeERVR1c5.mp3") {
		// club
		this.character.trigger('club_notify');
	} else {
		// I assume all of the other messages are msg
		this.character.trigger("message");
	}
}

FBMusume.prototype.onDropdownToggle = function() {
	this.elem.querySelector('.dropdown').classList.toggle('active');
}

FBMusume.prototype.onDropdownOff = function() {
	this.elem.querySelector('.dropdown').classList.remove('active');
}

/* static members */
FBMusume.initUserSettings = function() {
	return new Promise(function(resolve, reject) {
		chrome.storage.sync.get({
			enable_voice: true,
			refresh_time: 30,
			character: Object.keys(characters)[0],
			language: "ja_JP"
		}, function(user_config) { resolve(user_config); });
	});
}

FBMusume.initI18n = function(user_config) {
	var characterTranslateFiles = Object.keys(characters).map(function (key) {
		return characters[key].translate;
	});
	return new Promise(function(resolve, reject) {
		I18n.init({
			locale: user_config.language,
			translateFiles: ["fb_musume"].concat(characterTranslateFiles)
		},
		function() { resolve(user_config); });
	});
}

FBMusume.init = function() {
	Promise.resolve()
	.then(FBMusume.initUserSettings)
	.then(FBMusume.initI18n)
	.then(function(user_config) {
		if (user_config.character === 'none') {
			return;
		}
		window.fb_musume = new FBMusume(user_config);
		fb_musume.loadCharacter();
		fb_musume.startOccupyYourFacebook_YAY();
	})
	.catch(function(e) { console.error(e.stack); });
}

FBMusume.reload = function() {
	if (window.fb_musume) {
		window.fb_musume.destroy();
		window.fb_musume = null;
	}
	// FIXME: should we reload i18n & user setting?
	FBMusume.init();
}

FBMusume.init();

})();

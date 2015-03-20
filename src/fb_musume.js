(function() {

var character = null;
var fbm_top_DOM = null;
var fbm_template = [
'<div class="fbm-top">',
	'<div class="dropdown">',
		'<ul class="menu"></ul>',
		'<span class="button"></span>',
	'</div>',
'</div>'
].join("");

function onFacebookAudioPlay(event) {
	if (!character) {
		return;
	}
	var audio = event.target;
	audio.pause();
	if (audio.src === "https://fbstatic-a.akamaihd.net/rsrc.php/yy/r/odIeERVR1c5.mp3") {
		// club
		character.trigger('club_notify');
	} else {
		// I assume all of the other messages are msg
		character.trigger("message");
	}
}

function createBodyObserver() {
	/*
		TODO
		Intercept the nodification popup so we can get the notification content?
		Or, at least, block it.
		This is the popup element of my Facebook (when inactive)
		<ul class="hidden_elem _50d1" data-gt="XXXXX" data-reactid="XXXXX"></ul>
	*/
	var bind_func = function(tag) {
		if (tag.nodeName !== 'AUDIO' || tag.parentElement.nodeName !== "BODY" || tag.dataset.fbm) {
			return;
		}
		tag.dataset.fbm = true;
		tag.addEventListener('play', onFacebookAudioPlay);
	}
	// query one first
	Array.prototype.forEach.call(document.querySelectorAll('body>audio'), bind_func);
	return new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			Array.prototype.forEach.call(mutation.addedNodes, bind_func);
		});
	});
}

function translateCharacter(character_config)
{
	character_config.name = i18n.t(character_config.name, {}, character_config.translate);
	for (script_name in character_config.scripts) {
		var words = character_config.scripts[script_name].words;
		words.forEach(function(word) {
			word.word = i18n.t(word.word, {}, character_config.translate);
		});
	}
}

function initFBMusume()
{
	var setting_promise = new Promise(function(resolve, reject) {
		// (1) Load user settings
		chrome.storage.sync.get({
			enable_voice: true,
			refresh_time: 30,
			character: Object.keys(characters)[0],
			language: "ja_JP"
		}, function(user_config) { resolve(user_config); });
	}).then(function(user_config) {
		// (2) Load i18n
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
	}).then(function(user_config) {
		// (3) Translate characters
		if (user_config.character === "none") {
			return;
		}
		var character_config = characters[user_config.character];
		translateCharacter(character_config);

		// (4) Initialize characters and its DOMs
		character = new Character(character_config, user_config);

		// (5) Initialize FB-related DOMs and register event
		var div = document.createElement("div");
		div.innerHTML = fbm_template;
		fbm_top_DOM = div.firstChild;
		fbm_top_DOM.appendChild(character.elem);
		document.querySelector("body").appendChild(fbm_top_DOM);
		var body_observer = createBodyObserver();
		body_observer.observe(document.querySelector("body"), {
			childList: true, subtree: true
		});
	}).catch(function(e) { console.error(e.stack); });
}

function destroyFBMusume()
{
}

initFBMusume();

})();

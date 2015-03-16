(function() {

var character = null;

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

var setting_promise = new Promise(function(resolve, reject) {
	chrome.storage.sync.get({
		enable_voice: true,
		refresh_time: 30,
		character: Object.keys(characters)[0],
		language: "ja_JP"
	}, function(user_config) { resovle(user_config); });
}).then(function(settings) {
	return new Promise(function(reject, resolve) {
		I18n.init({
			locale: user_config.language
		}, function() { resolve(user_config); });
	});
}).then(function(user_config) {
	if (user_config.character === "none") {
		return;
	}
	var character_config = characters[user_config.character];
	character = new Character(character_config, user_config);
	var body_observer = createBodyObserver();
	body_observer.observe(document.querySelector("body"), {
		childList: true, subtree: true
	});
});

})();

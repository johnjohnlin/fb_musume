(function () {

function set(items) {
	document.getElementById('enable_voice').checked = items.enable_voice;
	document.getElementById('refresh_time').value = items.refresh_time;
	document.getElementById('character').value = items.character;
	document.getElementById('language').value = items.language;
}

function save()
{
	var enable_voice = document.getElementById('enable_voice').checked;
	var refresh_time = Number(document.getElementById('refresh_time').value);
	var character    = document.getElementById('character').value;
	var language     = document.getElementById('language').value;
	if (refresh_time < 10) {
		alert(i18n.t('refresh_error', {th: 10, t: refresh_time}));
	} else {
		chrome.storage.sync.set({
			enable_voice: enable_voice,
			refresh_time: refresh_time,
			character: character,
			language: language
		}, function() {
			alert(i18n.t('success'));
			location.reload();
		});
	}
}

function initCharacters()
{
	// FIXME
	var keys = CharacterPool.paths;
	var select = document.getElementById('character');

	var addOption = function(value, string, filename) {
		var option = document.createElement("option");
		option.setAttribute("value", value);
		option.dataset.string = string;
		option.dataset.stringFile = filename || '';
		select.appendChild(option);
		return option;
	};

	addOption("none", "none");
	keys.forEach(function(key) {
		var config = character_pool.getCharacterConfig(key);
		addOption(key, config.name, config.translate);
	});
}

function initDOMi18n()
{
	// Change DOM language when i18n object is prepared
	Array.prototype.forEach.call(document.querySelectorAll("[data-string]"), function(dom) {
		var key = dom.dataset.string;
		var param = (dom.dataset.stringParam)? JSON.parse(dom.dataset.stringParam): null;
		var filename = dom.dataset.stringFile || null;
		dom.innerText = i18n.t(key, param, filename);
	});
	document.title = i18n.t("title");
}

function changeLanguage(event)
{
	i18n.locale = event.target.value;
	initDOMi18n();
}

function load()
{
	new Promise(function(resolve, reject) {
		chrome.storage.sync.get({
			enable_voice: true,
			refresh_time: 30,
			// FIXME:
			character: CharacterPool.paths[0],
			language: "ja_JP"
		}, function(items) { resolve(items); });
	}).then(function(items) {
		return new Promise(function(resolve, reject) {
			I18n.init({
				locale: items.language,
				translateFiles: ['settings']
			}, function() { resolve(items); });
		});
	}).then(function(items) {
		return new Promise(function(resolve, reject) {
			CharacterPool.init(function() {
				resolve(items);
			});
		});
	}).then(function(items) {
		initCharacters();
		set(items);
		initDOMi18n();
	}).catch(function(e) { console.error(e.stack) });
}

document.addEventListener('DOMContentLoaded', function() {
	load();
	document.getElementById('save').addEventListener('click', save);
	document.getElementById('language').addEventListener('change', changeLanguage);
});

})();


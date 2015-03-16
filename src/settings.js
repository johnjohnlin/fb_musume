(function () {

function save()
{
	var enable_voice = document.getElementById('enable_voice').checked;
	var refresh_time = Number(document.getElementById('refresh_time').value);
	var character    = document.getElementById('character').value;
	var language     = document.getElementById('language').value;
	if (refresh_time < 10) {
		alert('Refresh time must >= 10');
	} else {
		chrome.storage.sync.set({
			enable_voice: enable_voice,
			refresh_time: refresh_time,
			character: character,
			language: language
		}, function() {
			alert('Success!');
		});
	}
}

function initCharacters()
{
	var keys = Object.keys(characters);
	var select = document.getElementById('character');
	var addOption = function(value, innerText) {
		var option = document.createElement("option");
		option.setAttribute("value", value);
		option.innerText = innerText;
		select.appendChild(option);
	};

	addOption("none", "None");
	for (var key in characters) {
		addOption(key, characters[key].name);
	}

}

function load()
{
	initCharacters();
	chrome.storage.sync.get({
		enable_voice: true,
		refresh_time: 30,
		character: Object.keys(characters)[0],
		language: "jp"
	}, function(items) {
		document.getElementById('enable_voice').checked = items.enable_voice;
		document.getElementById('refresh_time').value = items.refresh_time;
		document.getElementById('character').value = items.character;
		document.getElementById('language').value = items.language;
		// TODO use Promise?
		I18n.init(
			{locale: items.language},
			"settings.json",
			function() {
				var i18n_obj = this;
				Array.prototype.forEach.call(document.querySelectorAll("[data-string]"), function(dom) {
					if (dom.dataset.stringParam) {
						dom.innerText = i18n_obj.t(dom.dataset.string, JSON.parse(dom.dataset.stringParam));
					} else {
						dom.innerText = i18n_obj.t(dom.dataset.string);
					}
				});
			}
		);
	});
}

document.addEventListener('DOMContentLoaded', load);
document.getElementById('save').addEventListener('click', save);

})();


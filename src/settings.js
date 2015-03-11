(function () {

function save()
{
	var enable_voice = document.getElementById('enable_voice').checked;
	var refresh_time = Number(document.getElementById('refresh_time').value);
	var character    = document.getElementById('character').value;
	if (refresh_time < 10) {
		alert('Refresh time must >= 10');
	} else {
		chrome.storage.sync.set({
			enable_voice: enable_voice,
			refresh_time: refresh_time,
			character: character
		}, function() {
			alert('Success!');
		});
	}
}

function load()
{
	chrome.storage.sync.get({
		enable_voice: true,
		refresh_time: 30,
		character: 0
	}, function(items) {
		document.getElementById('enable_voice').checked = items.enable_voice;
		document.getElementById('refresh_time').value = items.refresh_time;
		document.getElementById('character').value = items.character;
	});
}

document.addEventListener('DOMContentLoaded', load);
document.getElementById('save').addEventListener('click', save);

})();


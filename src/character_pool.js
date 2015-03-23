(function() {

var CharacterPool = function(callback) {
	this.pool = {};
	var load_promises = CharacterPool.paths.map(function(path) {
		return new Promise(function(resolve, reject) {
			this.loadCharacter(path, resolve);
		}.bind(this));
	}, this);
	Promise
		.all(load_promises)
		.then(callback.bind(this))
		.catch(function(e) { console.error(e.stack); });
}

CharacterPool.prototype.loadCharacter = function(dir, callback) {
	callback = callback || function(){};
	var path = chrome.extension.getURL(["assets/", dir, "/config.js"].join(''));
	var load_promise = new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.addEventListener('load', function(event) {
			var config = this.onCharacterLoad(event, dir);
			resolve(config);
		}.bind(this));
		xhr.open("GET", path, true);
		xhr.send();
	}.bind(this))
	.then(function(config) {
		return new Promise(function(resolve, reject) {
			var lang_path = ["assets/", dir, '/', config.translate, '.json'].join('');
			i18n.loadStringsFullpath(lang_path, resolve);
		});
	})
	.then(callback)
	.catch(function(e) { console.error(e.stack); });
}

CharacterPool.prototype.onCharacterLoad = function(event, dir) {
	// TODO: error handling
	eval(event.target.responseText);
	this.pool[dir] = config;
	return config;
}

CharacterPool.prototype.getCharacterConfig = function(key) {
	return this.pool[key] || {};
}

CharacterPool.paths = [
	'Kao'
]

CharacterPool.init = function(callback) {
	window.character_pool = new CharacterPool(callback);
}

window.CharacterPool = CharacterPool;

})();

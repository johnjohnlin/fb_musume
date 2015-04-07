(function() {

var I18n = function(settings, callback) {
	this.translateFiles = settings.translateFiles;
	this.defaultFilename = settings.translateFiles[0];
	this.locale = settings.locale || "en_US";
	this.strings = {};

	var load_promises = this.translateFiles.map(function(filename) {
		return new Promise(function(resolve, reject) {
			this.loadStrings(filename, resolve);
		}.bind(this));
	}, this);

	Promise
		.all(load_promises)
		.then(callback.bind(this))
		.catch(function(e) { console.error(e.stack); });
};

I18n.init = function(settings, callback) {
	window.i18n = new I18n(settings, callback);
}

I18n.prototype.localePath = 'src/i18n/';

I18n.prototype.loadStringsFullpath = function(path, callback) {
	callback = callback || function(){};
	var filename = path.split('/').pop().split('.')[0];
	if (this.strings[filename]) {
		callback.call(this);
		return;
	}
	var true_path = chrome.extension.getURL(path);
	var xhr = new XMLHttpRequest();
	xhr.addEventListener('load', function(event) {
		this.onStringsLoad(event, filename, path);
		callback.call(this);
	}.bind(this));
	xhr.open("GET", true_path, true);
	xhr.send();
}

I18n.prototype.loadStrings = function(filename, callback) {
	var path = [this.localePath, filename, ".json"].join('');
	this.loadStringsFullpath(path, callback);
}

I18n.prototype.onStringsLoad = function(event, filename, path) {
	// TODO: error handling
	// this.strings[filename] = this.strings[filename] || {};
	this.strings[filename] = JSON.parse(event.target.responseText);
	var dir = path.split('/');
	dir.pop();
	dir = dir.join('/');
	Object.keys(this.strings[filename]).forEach(function(key) {
		var v = this.strings[filename][key].voice;
		if (v) {
			this.strings[filename][key].voice = chrome.extension.getURL([dir, v].join('/'));
		}
	}, this);
}

I18n.prototype.t = function(key, params, filename) {
	filename = filename || this.defaultFilename;
	var getOneOfObject = function(obj) {
		return obj[Object.keys(obj)[0]];
	};
	var string =
		   this.strings[filename][key][this.locale]
		|| getOneOfObject(this.strings[filename][key]);
	if (params) {
		Object.keys(params).forEach(function(key) {
			string = string.replace(new RegExp('\\{' + key + '\\}', 'g'), params[key]);
		});
	}
	return string;
}

I18n.prototype.v = function(key, filename) {
	filename = filename || this.defaultFilename;
	return this.strings[filename][key]['voice'] || "";
}

window.I18n = I18n;

})();

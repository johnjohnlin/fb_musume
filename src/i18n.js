(function() {

var I18n = function(settings, callback) {
	this.translateFiles = settings.translateFiles;
	this.defaultFilename = settings.translateFiles[0];
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

I18n.prototype.loadStrings = function(filename, callback) {
	callback = callback || function(){};
	if (this.strings[filename]) {
		callback.call(this);
		return;
	}
	var path = chrome.extension.getURL(
		[this.localePath, filename, ".json"].join(''));
	var xhr = new XMLHttpRequest();
	xhr.addEventListener('load', function(event) {
		this.onStringsLoad(event, filename);
		callback.call(this);
	}.bind(this));
	xhr.open("GET", path, true);
	xhr.send();
}

I18n.prototype.onStringsLoad = function(event, filename) {
	// TODO: error handling
	// this.strings[filename] = this.strings[filename] || {};
	this.strings[filename] = JSON.parse(event.target.responseText);
}

I18n.prototype.t = function(key, params, filename, locale) {
	filename = filename || this.defaultFilename;
	var getOneOfObject = function(obj) {
		return obj[Object.keys(obj)[0]];
	};
	var string =
		   this.strings[filename][key][locale]
		|| this.strings[filename][key].en_US
		|| getOneOfObject(this.strings[filename][key]);
	if (params) {
		Object.keys(params).forEach(function(key) {
			string = string.replace(new RegExp('\\{' + key + '\\}', 'g'), params[key]);
		});
	}
	return string;
}

window.I18n = I18n;

})();

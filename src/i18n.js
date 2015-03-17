(function() {

var I18n = function(settings, callback) {
	if (settings.defaultLocale) {
		this.defaultLocale = settings.defaultLocale;
	}
	if (settings.locale) {
		this.locale = settings.locale;
	}
	if (settings.translateFiles) {
		this.translateFiles = settings.translateFiles;
	}
	if (settings.defaultFilename) {
		this.defaultFilename = settings.defaultFilename;
	}

	this.strings = {};
	Promise.all(this.translateFiles.map(function(filename) {
		return new Promise(function(resolve, reject) {
			this.loadStrings(this.defaultLocale, filename);
			this.loadStrings(this.locale, filename, resolve);
		}.bind(this));
	}, this)).then(function() {
		callback.call(this);
	}.bind(this)).catch(function(e) { console.error(e.stack); });
};

I18n.init = function(settings, callback) {
	window.i18n = new I18n(settings, callback);
}

I18n.prototype.defaultLocale = "en_US";
I18n.prototype.locale = "en_US";
I18n.prototype.localePath = 'src/locales/';
I18n.prototype.translateFiles = [
	"messages",
	"settings"
]
I18n.prototype.defaultFilename = "messages";

I18n.prototype.loadStrings = function(locale, filename, callback) {
	callback = callback || function(){};
	if (this.strings[filename] && this.strings[filename][locale]) {
		callback.call(this);
		return;
	}
	var path = chrome.extension.getURL(
		[this.localePath, locale, "/", filename, ".json"].join(''));
	var xhr = new XMLHttpRequest();
	xhr.addEventListener('load', function(event) {
		this.onStringsLoad(event, locale, filename);
		callback.call(this);
	}.bind(this));
	xhr.open("GET", path, true);
	xhr.send();
}

I18n.prototype.onStringsLoad = function(event, locale, filename) {
	// TODO: error handling
	this.strings[filename] = this.strings[filename] || {};
	this.strings[filename][locale] = JSON.parse(event.target.responseText);
}

I18n.prototype.t = function(key, params, filename) {
	filename = filename || this.defaultFilename;
	var string =
		this.strings[filename][this.locale][key] ||
		this.strings[filename][this.defaultLocale][key] ||
		"";
	if (params) {
		Object.keys(params).forEach(function(key) {
			string = string.replace(new RegExp('\\{' + key + '\\}', 'g'), params[key]);
		});
	}
	return string;
}

window.I18n = I18n;

})();

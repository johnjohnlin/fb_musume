(function() {

var I18n = function(settings, callback) {
	if (settings.defaultLocale) {
		this.defaultLocale = settings.defaultLocale;
	}
	if (settings.locale) {
		this.locale = settings.locale;
	}
	this.strings = {};
	this.loadStrings(this.defaultLocale);
	this.loadStrings(this.locale, callback);
};

I18n.init = function(settings, callback) {
	window.i18n = new I18n(settings, callback);
}


I18n.prototype.defaultLocale = "en_US";
I18n.prototype.locale = "en_US";
I18n.prototype.localePath = 'src/locales/';

I18n.prototype.loadStrings = function(locale, callback) {
	callback = callback || function(){};
	if (this.strings[locale]) {
		callback.call(this);
		return;
	}
	var path = chrome.extension.getURL(
		[this.localePath, locale, "/messages.json"].join(''));
	var xhr = new XMLHttpRequest();
	xhr.addEventListener('load', function(event) {
		this.onStringsLoad(event, locale);
		callback.call(this);
	}.bind(this));
	xhr.open("GET", path, true);
	xhr.send();
}

I18n.prototype.onStringsLoad = function(event, locale) {
	// TODO: error handling
	this.strings[locale] = JSON.parse(event.target.responseText);
}

I18n.prototype.t = function(key, params) {
	var string =
		this.strings[this.locale][key] ||
		this.strings[this.defaultLocale][key] ||
		"";
	if (params) {
		Object.keys(params).forEach(function(key) {
			string.replace(new RegExp('{' + key + '}/g'), params[key]);
		});
	}
	return string;
}

window.I18n = I18n;

})();

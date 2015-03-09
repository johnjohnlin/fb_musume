var Character = function(config) {
	this.config = config;
	this.elem = this.createElement();
	document.querySelector("body").appendChild(this.elem);
}

Character.prototype.template = [
	'<div class="fbm-top">',
		'<img class="character">',
		'<div class="msg-box">',
			'Hello',
		'</div>',
	'</div>'
].join("");

Character.prototype.createElement = function() {
	var div = document.createElement('div');
	div.innerHTML = this.template;
	var character = div.querySelector('.character');
	character.src = this.config.path;
	character.addEventListener('click', function(event) {
		this.say(new Date());
	}.bind(this));
	return div;
}

Character.prototype.say = function(word) {
	var msgBox = this.elem.querySelector('.msg-box');
	msgBox.classList.remove('show');
	// force to reset classList
	msgBox.offsetHeight = msgBox.offsetHeight;
	msgBox.innerText = word;
	msgBox.classList.add('show');
}

var character = new Character({
	path: chrome.extension.getURL("assets/Atago/pannpakapann.jpg")
});

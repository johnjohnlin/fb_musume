var Character = function(config) {
	this.config = config;
	this.elem = this.createElement();
	document.querySelector("body").appendChild(this.elem);
}

Character.prototype.template = [
	'<div class="fbm-top">',
		'<img class="character">',
		'<div class="fbm-bottom">',
			'<div class="msg-box">',
				'Hello',
			'</div>',
		'</div>',
	'</div>'
].join("");

Character.prototype.createElement = function() {
	var div = document.createElement('div');
	div.innerHTML = this.template;
	div.querySelector('.character').src = this.config.path;
	return div;
}
/*
var Character = {
	Init: function Init(path) {
		if (this.initialized_) {
			return;
		}
		this.initialized_ = true;
		that = this;

		this.DOM_top_ = document.createElement("div");
		this.DOM_top_.className = "fbm-top";

		bottom_container = document.createElement("div");
		bottom_container.className = "to-bottom";

		this.DOM_msg_ = document.createElement("div");

		this.DOM_character_ = document.createElement("img");
		this.DOM_character_.className = "character";
		this.DOM_character_.setAttribute("src", path);
		this.DOM_character_.addEventListener("click", function(){
			console.log("!!!!!!!!!!!!!!!");
			that.Say(new Date());
		});

		this.DOM_top_.appendChild(this.DOM_character_);
		bottom_container.appendChild(this.DOM_msg_);
		this.DOM_top_.appendChild(bottom_container);
		document.querySelector("body").appendChild(this.DOM_top_);

		this.Say("Hello");
	},

	Say: function Say(msg) {
		if (!this.initialized_) {
			return;
		}

		var that = this;
		that.DOM_msg_.className = "";
		setTimeout(function(){that.DOM_msg_.className = "msg-box";},   1);
		setTimeout(function(){that.DOM_msg_.innerText = msg;},       500);
	},

};

Character.Init(chrome.extension.getURL("assets/Atago/pannpakapann.jpg"));
*/
var character = new Character({
	path: chrome.extension.getURL("assets/Atago/pannpakapann.jpg")
});

var Character = function(config) {
	this.parseConfig(config);
	this.elem = this.createElement();
	document.querySelector("body").appendChild(this.elem);
	this.hourUpdate();
	this.onIdle();
}

Character.prototype.template = [
	'<div class="fbm-top">',
		'<img class="character">',
		'<div class="msg-box">',
			'Hello',
		'</div>',
	'</div>'
].join("");

Character.prototype.parseConfig = function parseConfig(config) {
	this.config = config;
	for (var state_name in this.config.animations) {
		this.config.animations[state_name].forEach(function(frame) {
			frame.path = chrome.extension.getURL("assets/" + frame.path);
		});
	}
}

Character.prototype.createElement = function() {
	var div = document.createElement('div');
	div.innerHTML = this.template;
	var character = div.querySelector('.character');
	character.src = this.config.animations.idle[0].path;
	// character.addEventListener('click', function(event) {
	// 	this.say(new Date());
	// }.bind(this));
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

Character.prototype.changeAnimation = function() {
}

Character.prototype.onIdle = function() {
	var idx = Math.floor(Math.random()*this.words.length);
	var word = this.words[idx];
	this.say(word);
	this.next_idle_handle = setTimeout(this.onIdle.bind(this), 10000);
}

Character.prototype.onClick = function() {
}

Character.prototype.hourUpdate = function() {
	this.words = this.config.scripts.idle.words
		.filter(function(word) {
			return word.predicate === true || word.predicate();
		}).map(function(word) {
			return word.word;
		});
	console.log(this.words);
}

Character.prototype.onHour = function() {
	this.hourUpdate();
}

var character = new Character({
	scripts: {
		// Idle scripts
		idle: {
			animation: "idle",
			words: [
				// Copied from http://xn--eck5eb7eb.gamerch.com/%E5%9C%92%E7%94%B0%20%E6%B5%B7%E6%9C%AA
				{
					word: "一緒にスクールアイドルの高みを目指しましょうね",
					predicate: true
				},
				{
					word: "過ごしやすい季節でなによりです。",
					predicate: true
				},
				{
					word: "暑いからってだらしのないのはダメですよ？",
					predicate: true
				},
				{
					word: "色んなものが美味しい季節ですね。",
					predicate: function () {return (new Date()).getHours() > 18;}
				},
				{
					word: "穂乃果の家は和菓子屋なのですが...そこのおまんじゅうが絶品なんです。",
					predicate: function () {return (new Date()).getHours() < 18;}
				}
			]
		},
		// not used now
		click: {
			animation: "idle",
		},
		// not used now
		hour: {
			animation: "idle",
		}
	},
	animations: {
		idle: [
			{
				path: "Umi/1.png",
				time: 2000
			},
			{
				path: "Umi/3.png",
				time: 300
			},
			{
				path: "Umi/2.png",
				time: 2000
			},
			{
				path: "Umi/3.png",
				time: 300
			}
		]
	}
});

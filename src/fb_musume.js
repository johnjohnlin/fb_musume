(function() {

var characters = {
"0": {
	scripts: {
		// Idle scripts
		idle: {
			animation: "idle",
			words: [
				{
					word: "一緒にスクールアイドルの高みを目指しましょうね",
					voice: 0,
					predicate: true
				},
				{
					word: "過ごしやすい季節でなによりです。",
					voice: 1,
					predicate: true
				},
				{
					word: "暑いからってだらしのないのはダメですよ？",
					voice: 2,
					predicate: true
				},
				{
					word: "色んなものが美味しい季節ですね。",
					voice: 0,
					predicate: function () {return (new Date()).getHours() > 18;}
				},
				{
					word: "穂乃果の家は和菓子屋なのですが...そこのおまんじゅうが絶品なんです。",
					voice: 1,
					predicate: function () {return (new Date()).getHours() < 18;}
				}
			]
		},
		click: {
			animation: "click",
			words: [
				{ word: "私がお手伝いします。"        , voice: 1 },
				{ word: "く、くすぐったいです！"      , voice: 2 },
				{ word: "きゃっ、ど、どうしました？"  , voice: 0 },
				{ word: "今、呼びました？"            , voice: 1 },
				{ word: "それ以上やったら怒りますよ？", voice: 2 }
			]
		},
		hour: {
			animation: "idle",
			words: [
				{ word: "00:00", voice: 0 },
				{ word: "01:00", voice: 1 },
				{ word: "02:00", voice: 2 },
				{ word: "03:00", voice: 0 },
				{ word: "04:00", voice: 1 },
				{ word: "05:00", voice: 2 },
				{ word: "06:00", voice: 0 },
				{ word: "07:00", voice: 1 },
				{ word: "08:00", voice: 2 },
				{ word: "09:00", voice: 0 },
				{ word: "10:00", voice: 1 },
				{ word: "11:00", voice: 2 },
				{ word: "12:00", voice: 0 },
				{ word: "13:00", voice: 1 },
				{ word: "14:00", voice: 2 },
				{ word: "15:00", voice: 0 },
				{ word: "16:00", voice: 1 },
				{ word: "17:00", voice: 2 },
				{ word: "18:00", voice: 0 },
				{ word: "19:00", voice: 1 },
				{ word: "20:00", voice: 2 },
				{ word: "21:00", voice: 0 },
				{ word: "22:00", voice: 1 },
				{ word: "23:00", voice: 2 }
			]
		}
	},
	animations: {
		idle: [
			{
				path: "Umi/1.png",
				duration: 5000
			},
			{
				path: "Umi/3.png",
				duration: 500
			},
			{
				path: "Umi/2.png",
				duration: 5000
			},
			{
				path: "Umi/3.png",
				duration: 500
			}
		],
		click: [
			{
				path: "Umi/3.png",
				duration: -1
			}
		]
	},
	voice: [
		"Umi/1.mp3",
		"Umi/2.mp3",
		"Umi/3.mp3"
	]
}
}

var character = null;

function onFacebookAudioPlay(event) {
	if (!character) {
		return;
	}
	var audio = this;
	audio.pause();
	if (audio.src === "https://fbstatic-a.akamaihd.net/rsrc.php/yy/r/odIeERVR1c5.mp3") {
		// club
		character.trigger('ClubNotify');
	} else {
		// I assume all of the other messages are msg
		character.trigger("Message");
	}
}

function createBodyObserver() {
	var bind_func = function(tag) {
		if (tag.nodeName !== 'AUDIO' && tag.parentElement.nodeName != "BODY" || tag.dataset.fbm) {
			return;
		}
		// audio.muted = true;
		tag.dataset.fbm = true;
		tag.addEventListener('play', onFacebookAudioPlay);
	}
	// query one first
	Array.prototype.forEach.call(document.querySelectorAll('body>audio'), bind_func);
	return new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			Array.prototype.forEach.call(mutation.addedNodes, bind_func);
		});
	});
}

chrome.storage.sync.get({
	enable_voice: true,
	refresh_time: 30,
	character: "none"
}, function(user_config) {
	if (user_config.character === "none") {
		return;
	}
	var character_config = characters[user_config.character];
	character = new Character(character_config, user_config);
	var body_observer = createBodyObserver();
	body_observer.observe(document.querySelector("body"), {
		childList: true, subtree: true
	});
});

})();

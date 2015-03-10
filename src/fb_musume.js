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
		click: {
			animation: "idle",
			words: [
				{
					word: "私がお手伝いします。",
				},
				{
					word: "く、くすぐったいです！",
				},
				{
					word: "きゃっ、ど、どうしました？",
				},
				{
					word: "今、呼びました？",
				},
				{
					word: "それ以上やったら怒りますよ？"
				}
			]
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
	}
});

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
			animation: "click",
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
		hour: {
			animation: "idle",
			words: [
				{
					word: "00:00",
				},
				{
					word: "01:00",
				},
				{
					word: "02:00",
				},
				{
					word: "03:00",
				},
				{
					word: "04:00"
				},
				{
					word: "05:00",
				},
				{
					word: "06:00",
				},
				{
					word: "07:00",
				},
				{
					word: "08:00",
				},
				{
					word: "09:00"
				},
				{
					word: "10:00",
				},
				{
					word: "11:00",
				},
				{
					word: "12:00",
				},
				{
					word: "13:00",
				},
				{
					word: "14:00"
				},
				{
					word: "15:00",
				},
				{
					word: "16:00",
				},
				{
					word: "17:00",
				},
				{
					word: "18:00",
				},
				{
					word: "19:00"
				},
				{
					word: "20:00",
				},
				{
					word: "21:00",
				},
				{
					word: "22:00",
				},
				{
					word: "23:00",
				}
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
	}
});

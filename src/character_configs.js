/*
JSON format

characters 1 - many character (with key = its name) (fix to human readable later)

character 1 - 1 name (name, shown in setting pages)
            - 1 scripts
            - 1 animations
            - 1 voice

scripts: must have "idle", "click", "hour", "fb_message" keys
         each must have: 1 animation, many word stored in a list named words
         The format of word is self-explanatory.
         Note the word of "idle" have 1 more key

animations 1 - many frame set (with key = its name)

frame set 1 - many {image path + duration}

voice 1 - many voice path (list)

*/

var characters = {
	0: {
		name: "本澤かお",
		scripts: {
			// Idle scripts
			idle: {
				animation: "idle",
				words: [
					/* Disabled because Feit does not agree
					{
						word: "ふーーー本を読み過ぎる、ちょっとねって。",
						voice: 1,
						predicate: true
					},
					{
						word: "今度の本は面白いです、あなたも読んでみませんか？",
						voice: 2,
						predicate: true
					},
					*/
					{
						word: "いつも一人でほんをよむから、友達があまりいません。",
						voice: 0,
						predicate: true
					},
					{
						word: "あなたがここにいると、なんだかさびしくなくなりますね。",
						voice: 1,
						predicate: true
					},
					{
						word: "おすすめの本って？あの...、この「Ruby on Rails チュートリアル」はどう思います？",
						voice: 2,
						predicate: true
					},
					{
						word: "週末か...どこかへ遊びに行くつもりですか？",
						voice: 0,
						predicate: function() {var weekday = (new Date()).getDay();return weekday === 0 || weekday === 6;}
					},
					{
						word: "夜が静かなので、わたし、好き",
						voice: 1,
						predicate: function() {return (new Date()).getHours() >= 18;}
					},
					{
						word: "かふんしょうのせいで、図書館で本を読もう！",
						voice: 2,
						predicate: function() {var month = (new Date()).getMonth(); return 3 <= month && month <= 5;}
					},
					{
						word: "外が暑いから、本屋で本を読もう！",
						voice: 1,
						predicate: function() {var month = (new Date()).getMonth(); return 6 <= month && month <= 8;}
					},
					{
						word: "読書の秋なので、一緒に新しい本を買いましょう！",
						voice: 0,
						predicate: function() {var month = (new Date()).getMonth(); return 9 <= month;}
					},
					{
						word: "さむいから、家で本を読もう！",
						voice: 2,
						predicate: function() {var month = (new Date()).getMonth(); return month <= 2;}
					},
					/* Disabled because Feit does not agree
					{
						word: "エープリルフールか...まいとしの今日のたびに、私が馬鹿にされた，ウウッ。",
						voice: 2,
						predicate: function() {var now = new Date(); return now.getDate() === 1 && now.getMonth() === 3;}
					},
					{
						word: "明るい月のヒカリ、そのふうを大好きです",
						voice: 1,
						predicate: function() {var now = new Date(); return now.getDate() === 15 && now.getMonth() === 7;}
					},
					{
						word: "今日のパーティーで、「Go Programming」の本のプレセントをよういしたのに、みんなが微妙な顔をしました。おかしいです。",
						voice: 1,
						predicate: function() {var now = new Date(); return now.getDate() === 25 && now.getMonth() === 11;}
					},
					*/
					{
						word: "バレンタインデーに、恋人とフェイスブックを読んで、特別な気分に浸れて私は好きです",
						voice: 2,
						predicate: function() {var now = new Date(); return now.getDate() === 14 && now.getMonth() === 1;}
					},
					{
						word: "ハロウィンのセリフって、あの...、フェス or ブックですか？",
						voice: 0,
						predicate: function() {var now = new Date(); return now.getDate() === 31 && now.getMonth() === 9;}
					}
				]
			},
			// Click scripts
			click: {
				animation: "click",
				words: [
					{ word: "どこを触るつもりです？"                        , voice: 0 },
					{ word: "（ビクリした）"                                , voice: 1 },
					{ word: "イイーッ！"                                    , voice: 2 },
					{ word: "メガネが壊れるから、やめてよ。"                , voice: 0 },
					{ word: "そこはちょっと..."                             , voice: 1 },
					{ word: "本を読んでいる最中だから、少しだけ待ちなさい。", voice: 2 }
				]
			},
			// Hour alarm scripts
			hour: {
				animation: "idle",
				words: [
					{ word: "(00:00)", voice: 0 },
					{ word: "(01:00)", voice: 1 },
					{ word: "(02:00)", voice: 2 },
					{ word: "(03:00)", voice: 0 },
					{ word: "(04:00)", voice: 1 },
					{ word: "(05:00)", voice: 2 },
					{ word: "(06:00)", voice: 0 },
					{ word: "(07:00)", voice: 1 },
					{ word: "(08:00)", voice: 2 },
					{ word: "(09:00)", voice: 0 },
					{ word: "(10:00)", voice: 1 },
					{ word: "(11:00)", voice: 2 },
					{ word: "(12:00)", voice: 0 },
					{ word: "(13:00)", voice: 1 },
					{ word: "(14:00)", voice: 2 },
					{ word: "(15:00)", voice: 0 },
					{ word: "(16:00)", voice: 1 },
					{ word: "(17:00)", voice: 2 },
					{ word: "(18:00)", voice: 0 },
					{ word: "(19:00)", voice: 1 },
					{ word: "(20:00)", voice: 2 },
					{ word: "(21:00)", voice: 0 },
					{ word: "(22:00)", voice: 1 },
					{ word: "(23:00)", voice: 2 }
				]
			},
			// FB related scripts
			fb_message: {
				animation: "atago",
				words: [
					{ word: "（なんで私がそんなことを...）", voice: 3 },
					{ word: "（あの...メッセージよ）"      , voice: 3 }
				]
			},
			fb_clubnotify: {
				animation: "atago",
				words: [
					{ word: "新...しい情報です。"          , voice: 3 },
					{ word: "（友達からの情報...羨ましい）", voice: 3 }
				]
			},
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
			],
			atago: [
				{
					path: "Atago/pannpakapann.jpg",
					duration: -1
				}
			]
		},
		voice: [
			"Umi/1.mp3",
			"Umi/2.mp3",
			"Umi/3.mp3",
			"Atago/nc88878.mp3"
		]
	}
}

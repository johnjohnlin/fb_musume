/*
JSON format

should return var config = {

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
// FIXME: assets path
var config = {
	translate: "character0",
	name: "kao",
	scripts: {
		// Idle scripts
		idle: {
			animation: "idle",
			words: [
				{
					word: "msg_idle_000",
					voice: 10,
					predicate: true
				},
				{
					word: "msg_idle_001",
					voice:  0,
					predicate: true
				},
				{
					word: "msg_idle_002",
					voice: 13,
					predicate: true
				},
				{
					word: "msg_idle_003",
					voice: 18,
					predicate: true
				},
				{
					word: "msg_idle_004",
					voice: 22,
					predicate: true
				},
				{
					word: "msg_idle_005",
					voice: 16,
					predicate: function() {return (new Date()).getHours() >= 18;}
				},
				{
					word: "msg_idle_006",
					voice: 15,
					predicate: function() {var month = (new Date()).getMonth(); return 3 <= month && month <= 5;}
				},
				{
					word: "msg_idle_007",
					voice:  9,
					predicate: function() {var month = (new Date()).getMonth(); return 6 <= month && month <= 8;}
				},
				{
					word: "msg_idle_008",
					voice: 17,
					predicate: function() {var month = (new Date()).getMonth(); return 9 <= month;}
				},
				{
					word: "msg_idle_009",
					voice:  8,
					predicate: function() {var month = (new Date()).getMonth(); return month <= 2;}
				},
				{
					word: "msg_idle_010",
					voice: 12,
					predicate: function() {var now = new Date(); return now.getDate() === 31 && now.getMonth() === 11;}
				},
				{
					word: "msg_idle_011",
					voice: 23,
					predicate: function() {var now = new Date(); return now.getDate() === 1 && now.getMonth() === 0;}
				},
				{
					word: "msg_idle_012",
					voice: 24,
					predicate: function() {var now = new Date(); return now.getDate() === 14 && now.getMonth() === 1;}
				},
				/* Disabled because Feit does not agree
				{
					word: "msg_idle_013",
					voice: 2,
					predicate: function() {var now = new Date(); return now.getDate() === 1 && now.getMonth() === 3;}
				},
				{
					word: "msg_idle_014",
					voice: 1,
					predicate: function() {var now = new Date(); return now.getDate() === 15 && now.getMonth() === 7;}
				},
				*/
				{
					word: "msg_idle_015",
					voice: 20,
					predicate: function() {var now = new Date(); return now.getDate() === 31 && now.getMonth() === 9;}
				},
				{
					word: "msg_idle_016",
					voice: 26,
					predicate: function() {var now = new Date(); return now.getDate() === 25 && now.getMonth() === 11;}
				},
				{
					word: "msg_idle_011",
					voice: 0,
					predicate: function() {var weekday = (new Date()).getDay();return weekday === 0 || weekday === 6;}
				}
			]
		},
		// Click scripts
		click: {
			animation: "click",
			words: [
				{ word: "msg_click_000", voice:  7 },
				{ word: "msg_click_001", voice:  4 },
				{ word: "msg_click_002", voice:  6 },
				{ word: "msg_click_003", voice: 14 },
				{ word: "msg_click_004", voice:  1 },
				{ word: "msg_click_005", voice: 19 }
			]
		},
		// Hour alarm scripts
		hour: {
			animation: "idle",
			words: [
				{ word: "msg_hour_00", voice: 25 },
				{ word: "msg_hour_01", voice: 25 },
				{ word: "msg_hour_02", voice: 25 },
				{ word: "msg_hour_03", voice: 25 },
				{ word: "msg_hour_04", voice: 25 },
				{ word: "msg_hour_05", voice: 25 },
				{ word: "msg_hour_06", voice: 25 },
				{ word: "msg_hour_07", voice: 25 },
				{ word: "msg_hour_08", voice: 25 },
				{ word: "msg_hour_09", voice: 25 },
				{ word: "msg_hour_10", voice: 25 },
				{ word: "msg_hour_11", voice: 25 },
				{ word: "msg_hour_12", voice: 25 },
				{ word: "msg_hour_13", voice: 25 },
				{ word: "msg_hour_14", voice: 25 },
				{ word: "msg_hour_15", voice: 25 },
				{ word: "msg_hour_16", voice: 25 },
				{ word: "msg_hour_17", voice: 25 },
				{ word: "msg_hour_18", voice: 25 },
				{ word: "msg_hour_19", voice: 25 },
				{ word: "msg_hour_20", voice: 25 },
				{ word: "msg_hour_21", voice: 25 },
				{ word: "msg_hour_22", voice: 25 },
				{ word: "msg_hour_23", voice: 25 }
			]
		},
		// FB related scripts
		fb_message: {
			animation: "atago",
			words: [
				{ word: "msg_onmsg_000", voice:  5 },
				{ word: "msg_onmsg_001", voice: 21 }
			]
		},
		fb_clubnotify: {
			animation: "atago",
			words: [
				{ word: "msg_onnotify_000", voice:  3 },
				{ word: "msg_onnotify_001", voice:  2 }
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
		"Kao/audio/00.ogg",
		"Kao/audio/01.ogg",
		"Kao/audio/02.ogg",
		"Kao/audio/03.ogg",
		"Kao/audio/04.ogg",
		"Kao/audio/05.ogg",
		"Kao/audio/06.ogg",
		"Kao/audio/07.ogg",
		"Kao/audio/08.ogg",
		"Kao/audio/09.ogg",
		"Kao/audio/10.ogg",
		"Kao/audio/11.ogg",
		"Kao/audio/12.ogg",
		"Kao/audio/13.ogg",
		"Kao/audio/14.ogg",
		"Kao/audio/15.ogg",
		"Kao/audio/16.ogg",
		"Kao/audio/17.ogg",
		"Kao/audio/18.ogg",
		"Kao/audio/19.ogg",
		"Kao/audio/20.ogg",
		"Kao/audio/21.ogg",
		"Kao/audio/22.ogg",
		"Kao/audio/23.ogg",
		"Kao/audio/24.ogg",
		"Kao/audio/25.ogg",
		"Kao/audio/26.ogg"
	]
};

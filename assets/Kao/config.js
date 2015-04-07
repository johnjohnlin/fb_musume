/*
JSON format

should return var config = {

characters 1 - many character (with key = its name) (fix to human readable later)

character 1 - 1 name (name, shown in setting pages)
            - 1 scripts
            - 1 animations

scripts: must have "idle", "click", "hour", "fb_message" keys
         each must have: 1 animation, many word stored in a list named words
         The format of word is self-explanatory.
         Note the word of "idle" have 1 more key

animations 1 - many frame set (with key = its name)

frame set 1 - many {image path + duration}

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
					predicate: true
				},
				{
					word: "msg_idle_001",
					predicate: true
				},
				{
					word: "msg_idle_002",
					predicate: true
				},
				{
					word: "msg_idle_003",
					predicate: true
				},
				{
					word: "msg_idle_004",
					predicate: true
				},
				{
					word: "msg_idle_005",
					predicate: function() {return (new Date()).getHours() >= 18;}
				},
				{
					word: "msg_idle_006",
					predicate: function() {var month = (new Date()).getMonth(); return 3 <= month && month <= 5;}
				},
				{
					word: "msg_idle_007",
					predicate: function() {var month = (new Date()).getMonth(); return 6 <= month && month <= 8;}
				},
				{
					word: "msg_idle_008",
					predicate: function() {var month = (new Date()).getMonth(); return 9 <= month;}
				},
				{
					word: "msg_idle_009",
					predicate: function() {var month = (new Date()).getMonth(); return month <= 2;}
				},
				{
					word: "msg_idle_010",
					predicate: function() {var now = new Date(); return now.getDate() === 31 && now.getMonth() === 11;}
				},
				{
					word: "msg_idle_011",
					predicate: function() {var now = new Date(); return now.getDate() === 1 && now.getMonth() === 0;}
				},
				{
					word: "msg_idle_012",
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
					predicate: function() {var now = new Date(); return now.getDate() === 31 && now.getMonth() === 9;}
				},
				{
					word: "msg_idle_016",
					predicate: function() {var now = new Date(); return now.getDate() === 25 && now.getMonth() === 11;}
				},
				{
					word: "msg_idle_011",
					predicate: function() {var weekday = (new Date()).getDay();return weekday === 0 || weekday === 6;}
				}
			]
		},
		// Click scripts
		click: {
			animation: "click",
			words: [
				{ word: "msg_click_000" },
				{ word: "msg_click_001" },
				{ word: "msg_click_002" },
				{ word: "msg_click_003" },
				{ word: "msg_click_004" },
				{ word: "msg_click_005" }
			]
		},
		// Hour alarm scripts
		hour: {
			animation: "idle",
			words: [
				{ word: "msg_hour_00" },
				{ word: "msg_hour_01" },
				{ word: "msg_hour_02" },
				{ word: "msg_hour_03" },
				{ word: "msg_hour_04" },
				{ word: "msg_hour_05" },
				{ word: "msg_hour_06" },
				{ word: "msg_hour_07" },
				{ word: "msg_hour_08" },
				{ word: "msg_hour_09" },
				{ word: "msg_hour_10" },
				{ word: "msg_hour_11" },
				{ word: "msg_hour_12" },
				{ word: "msg_hour_13" },
				{ word: "msg_hour_14" },
				{ word: "msg_hour_15" },
				{ word: "msg_hour_16" },
				{ word: "msg_hour_17" },
				{ word: "msg_hour_18" },
				{ word: "msg_hour_19" },
				{ word: "msg_hour_20" },
				{ word: "msg_hour_21" },
				{ word: "msg_hour_22" },
				{ word: "msg_hour_23" }
			]
		},
		// FB related scripts
		fb_message: {
			animation: "atago",
			words: [
				{ word: "msg_onmsg_000" },
				{ word: "msg_onmsg_001" }
			]
		},
		fb_clubnotify: {
			animation: "atago",
			words: [
				{ word: "msg_onnotify_000" },
				{ word: "msg_onnotify_001" }
			]
		},
	},
	animations: {
		idle: [
			{
				path: "images/Umi/1.png",
				duration: 5000
			},
			{
				path: "images/Umi/3.png",
				duration: 500
			},
			{
				path: "images/Umi/2.png",
				duration: 5000
			},
			{
				path: "images/Umi/3.png",
				duration: 500
			}
		],
		click: [
			{
				path: "images/Umi/3.png",
				duration: -1
			}
		],
		atago: [
			{
				path: "images/Atago/pannpakapann.jpg",
				duration: -1
			}
		]
	}
};

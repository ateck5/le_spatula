Settings.addPermissions(['plug', 'info', 'notarealcafe']);

exports.commands = {
	plug: function (arg, by, room, cmd) {
		var text = "Our plug dj room: https://plug.dj/cafelewow/";
		if (!this.isRanked('+')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	},

	help: 'info',
	commands: 'info',
	guide: 'info',
	botguide: 'info',
	info: function (arg, by, room, cmd) {
		var text = "For help with this bot, please visit http://pastebin.com/raw.php?i=A0yAxPgv";
		if (!this.isRanked('+')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	},

	nocafe: 'notarealcafe',
	notreal: 'notarealcafe',
	notarealcafe: function (arg, by, room, cmd) {
		var text = "Please do keep in mind this is not a real cafe. We talk about food here. Roleplaying should be done in the roleplaying room.";
		if (!this.isRanked('+')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	}
};
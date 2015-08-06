Settings.addPermissions(['plug', 'info', 'notarealcafe', 'website', 'doeszalmmakegoodrobots', 'menu', 'favfood']);

exports.commands = {
	plug: function (arg, by, room, cmd) {
		var text = "Our plug dj room: https://plug.dj/cafelewow/";
		if (!this.isRanked('+')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	},
	website: function (arg, by, room, cmd) {
		var text = "Our Cafe menu: http://cafe-le-wow.weebly.com/";
		if (!this.isRanked('+')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	},
	doeszalmmakegoodrobots: function (arg, by, room, cmd) {
		var text = "";
		var text1 = ""
		if (!this.isRanked('+')) {
			this.pmReply(text1);
		} else {
			this.reply(text);
		}
	},
	menu: function (arg, by, room, cmd) {
		var text = "Chosen menu for this week: http://pastebin.com";
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
		var text = "For help with this bot, please visit: http://pastebin.com/raw.php?i=A0yAxPgv";
		if (!this.isRanked('+')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	},
	favfood: function(arg, by, room) { 
        	var usr = toId(arg);
        	var inValue = arg.split(' ');
        	var found = false;
        	if (!arg) return this.say(room, "Please include a name.");
        	if (!this.settings.favfood) {
        	    this.settings.favfood = [];
        	    this.writeSettings();
        	}
        	var favfoods = this.settings.favfoods;
        	var output = [];
        	for (i = 1; i < inValue.length; i++) {
        	    output.push(inValue[i]);
        	}
        	var output = output.join(" ");
        	if (toId(inValue[0]) === "set" && inValue.length > 1) {
        	    if (!this.settings.favfoods) {
        	        this.settings.favfoods = [];
        	        this.writeSetting();
        	        return this.say(room, "Sorry, please try that again. Had to set a few things up.");
        	    }
        	    if (this.hasRank(by, '+%@#&~')) {
        	        for (i = 0; i < favfoods.length; i++) {
        	            if (this.settings.favfoods[i].name === toId(by)) {
        	                this.settings.favfoods[i].favfood = output;
        	                this.say(room, "Favorite food for user " + by + " has been edited.");
        	                return this.writeSettings();
        	            }
        	        }
        	        var favoritefood = {
        	            "name":toId(by),
        		            "favfood":output
        	        };
        	        this.settings.favfoods.push(favoritefood);
        	        this.writeSettings();
        	        return this.say(room, "Favorite food for user " + by + " has been set.");
        	    } else {
        	        return this.say(room, "Sorry, but you need to be at least a voice to set your favorite food.");
        	    }
        	} //Code for setting users' favorite food.
        	for (i = 0; i < favfoods.length; i++) {
        		if (usr === favfoods[i].name) {
        	        found = true;
        	        return this.say(room, toTitleCase(usr) + ": " + favfoods[i].favfood);
        	    }
        	}
        	if (found === false) {
        	    this.say(room,"This user does not have a favorite food.");
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

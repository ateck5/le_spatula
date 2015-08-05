const recipesDataFile = './data/recipes.json';

if (!fs.existsSync(recipesDataFile))
	fs.writeFileSync(recipesDataFile, '{}');

var recipes = {};

try {
	recipes = JSON.parse(fs.readFileSync(recipesDataFile).toString());
} catch (e) {
	errlog(e.stack);
	error("Could not import recipes: " + sys.inspect(e));
}

var writing = false;
var writePending = false;
var saverecipes = function () {
	var data = JSON.stringify(recipes);
	var finishWriting = function () {
		writing = false;
		if (writePending) {
			writePending = false;
			saverecipes();
		}
	};
	if (writing) {
		writePending = true;
		return;
	}
	fs.writeFile(recipesDataFile + '.0', data, function () {
		// rename is atomic on POSIX, but will throw an error on Windows
		fs.rename(recipesDataFile + '.0', recipesDataFile, function (err) {
			if (err) {
				// This should only happen on Windows.
				fs.writeFile(recipesDataFile, data, finishWriting);
				return;
			}
			finishWriting();
		});
	});
};

Settings.addPermissions(['recipe']);

exports.commands = {
	randomrecipe: 'recipe',
	recipe: function (arg, by, room, cmd) {
		if (arg) {
			var args = arg.split(',');
			var action = toId(args[0]);
			args.splice(0, 1);
			switch (action) {
				case 'add':
				case 'new':
					return this.parse(this.cmdToken + 'addrecipes ' + args.join(','));
				case 'set':
					return this.parse(this.cmdToken + 'setrecipe ' + args.join(','));
				case 'delete':
				case 'remove':
				case 'del':
					return this.parse(this.cmdToken + 'delrecipe ' + args.join(','));
				case 'view':
				case 'list':
				case 'show':
					return this.parse(this.cmdToken + 'viewrecipes ' + args.join(','));
			}
		}
		var recipesArr = Object.keys(recipes);
		if (!recipesArr.length) return this.restrictReply(this.trad('nodata'), 'recipe');
		var rand = recipesArr[Math.floor(Math.random() * recipesArr.length)];
		this.restrictReply(recipes[rand], 'recipe');
	},
	setrecipe: function (arg, by, room, cmd) {
		if (!this.isRanked('@')) return false;
		if (!CommandParser.tempVar) {
			return this.reply(this.trad('notemp'));
		}
		var recipeId = toId(arg);
		if (!recipeId) return;
		var text;
		if (recipes[recipeId]) {
			text = this.trad('q') + ' "' + recipeId + '" ' + this.trad('modified');
		} else {
			text = this.trad('q') + ' "' + recipeId + '" ' + this.trad('created');
		}
		recipes[recipeId] = CommandParser.tempVar;
		saverecipes();
		this.reply(text);
	},
	delrecipe: function (arg, by, room, cmd) {
		if (!this.isRanked(' ')) return false;
		var recipeId = toId(arg);
		if (!recipes[recipeId]) return this.reply(this.trad('q') + ' "' + recipeId + '" ' + this.trad('n'));
		delete recipes[recipeId];
		saverecipes();
		this.reply(this.trad('q') + ' "' + recipeId + '" ' + this.trad('d'));
	},
	vq: 'viewrecipes',
	viewrecipe: 'viewrecipes',
	viewrecipes: function (arg, by, room, cmd) {
		if (arg) {
			var recipeId = toId(arg);
			if (!recipes[recipeId]) return this.restrictReply(this.trad('q') + ' "' + recipeId + '" ' + this.trad('n'), 'recipe');
			return this.reply(recipes[recipeId]);
		}
		if (!this.isRanked('@')) return false;
		var data = '';
		for (var i in recipes) {
			data += i + ' -> ' + recipes[i] + '\n';
		}
		if (!data) return this.reply(this.trad('empty'));
		Tools.uploadToHastebin(this.trad('list') + ':\n\n' + data, function (r, link) {
			if (r) return this.pmReply(this.trad('list') + ': ' + link);
			else this.pmReply(this.trad('err'));
		}.bind(this));
	},
	addrecipes: function (arg, by, room, cmd) {
		if (!this.isRanked('@')) return false;
		if (!arg) return false;
		var link = arg.trim();
		if (!link) return false;
		if (link.substr(-1) === '/') link = link.substr(0, link.length - 1);
		var splitedLink = link.split('/');
		link = 'http://hastebin.com/raw/' + splitedLink[splitedLink.length - 1];
		this.reply(this.trad('d') + ': ' + link);
		var http = require('http');
		http.get(link, function (res) {
			var data = '';
			res.on('data', function (part) {
				data += part;
			}.bind(this));
			res.on('end', function (end) {
				if (data === '{"message":"Document not found."}') {
					Bot.say(room, this.trad('notfound'));
					return;
				}
				var lines = data.split('\n');
				for (var i = 0; i < lines.length; i++) {
					if (!lines[i].trim()) continue;
					var recipeId;
					do {
						recipeId = Tools.generateRandomNick(4);
					} while (recipes[recipeId]);
					recipes[recipeId] = lines[i].trim();
				}
				Bot.say(room, this.trad('add') + ' ' + lines.length + ' ' + this.trad('q'));
				saverecipes();
			}.bind(this));
			res.on('error', function (end) {
				Bot.say(room, this.trad('err'));
			}.bind(this));
		}.bind(this)).on('error', function (e) {
			Bot.say(room, this.trad('err'));
		}.bind(this));
	}
};
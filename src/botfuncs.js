/**
 *
 * @param {String} API_KEY - the bot token
 * @param {Number} chatId - the id of the chat
 * @param {String} text - the content of the message
 */
export async function sendMessage(API_KEY, chatId, text){
	let url = `https://api.telegram.org/bot${API_KEY}/sendMessage?chat_id=${chatId}&text=${text}`;
	return await fetch(url).then(resp => resp.json());
}

/**
 *
 * @param {String} API_KEY - the bot token
 * @param {Number} chatId - the id of the chat
 * @param {String} text - the content of the message
 * @param {Object} keyboard - the inline keyboard
 */
export async function sendKeyboard(API_KEY, chatId, text, keyboard) {
	let url = `https://api.telegram.org/bot${API_KEY}/sendMessage?chat_id=${chatId}&text=${text}&reply_markup=${JSON.stringify(keyboard)}`;
	return await fetch(url).then(resp => resp.json());
}

/**
 *
 * @param {String} API_KEY - the bot token
 * @param {Number} chatId - the id of the chat
 * @param {Number} messageId - the id of the message
 * @param {String} text - the new content of the message
 * @param {Object} keyboard - the new inline keybiard
 */
export async function editMessageText(API_KEY, chatId, messageId, text, keyboard={}) {
	let url = `https://api.telegram.org/bot${API_KEY}/editMessageText?chat_id=${chatId}&message_id=${messageId}&text=${text}&reply_markup=${JSON.stringify(keyboard)}`;
	return await fetch(url).then(resp => resp.json());
}

/**
 *
 * @param {String} API_KEY - the bot token
 * @param {Number} chatId - the id of the chat
 * @param {Number} n - how many curses to send
 */
export async function multib(API_KEY, chatId, n) {
	let best = [];
	for(var i=0; i<n; i++) {
		do {
			var tipo = Math.floor(Math.random() * 2);
			if(tipo)
				var b = modbest.bm();
			else
				var b = modbest.bf();

			if(best.includes(b))
				var rep = true;
			else {
				best.push(b);
				var rep = false;
			}
		} while(rep);
		await this.sendMessage(API_KEY, chatId, `${b} [${n}]`);
	}
}

export function keyboardFromArray(opts, undoAction, command="") {
	let kb = {inline_keyboard:[]};

	opts.forEach(row => {
		kb.inline_keyboard.push([]);
		row.forEach(opt => {
			kb.inline_keyboard[kb.inline_keyboard.length-1].push({
				text: opt,
				callback_data: `${command} ${opt}`
			});
		});
	});

	const undo = [{
        text: "↩",
        callback_data: `undo ${undoAction}`
	}];
	kb.inline_keyboard.push(undo);

	return kb;
}

function keyboardFromTree(tree) {
	if("children" in tree) {
		let kb = {inline_keyboard: []};
		let row = [];
		let nr = 0;
		tree.children.forEach(child => {
			if(child.row == nr+1) {
				kb.inline_keyboard.push(row);
				row = [];
				nr++;
			}
			row.push({
				text: child.text,
				callback_data: child.callback_data
			});
		});
		kb.inline_keyboard.push(row);
		if(tree.callback_data != "root")
			kb.inline_keyboard.push([{
				text: "↩",
				callback_data: `undo ${tree.callback_data}`
			}]);
		return [tree.header, kb];
	}
	else
		return tree;
}

export async function inlineKeyboard(tree, callback_data) {

	//Approccio con algoritmo DFS

	if(!tree)
		return [];

	const stack = [tree];
	const undoAction  = callback_data.includes("undo") ? callback_data.replace("undo ", "") : null;

	let found = false;

	while(stack.length > 0) {
		var current = stack.pop();
		if(current.callback_data == callback_data || callback_data=="root") {
			found = true;
			break;
		}

		if("children" in current) {
			current.children.forEach(child => stack.push(child));
			if(
				undoAction
				&& current.children
					.reduce(
						(sum, child) => sum || (child.callback_data == undoAction),
						false
					)
			) {
				found = true;
				break;
			}
		}
	}

	return found ? keyboardFromTree(current) : null;
}

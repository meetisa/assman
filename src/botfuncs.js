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
		}while(rep);
		await this.sendMessage(API_KEY, chatId, `${b} [${n}]`);
	}
}

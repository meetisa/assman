import * as bot from './botfuncs.js';
import * as menu from './menu.js';
import * as modbest from './modbest.js';
// import { open } from 'fs.promises';

const DEV_MODE = true;
const DEV_CHAT_ID = 512131924;

const gsAssemblee = "https://script.google.com/macros/s/AKfycbzndYe2C8q0UzNtE5NaR2E3wlNUEURBL_Ob7Jc7tQJSg63pM3WfX2vLVt4hj_kd7cW4ug/exec";

export default {
	async fetch(request, env, ctx) {
		//Telegram API will always send a POST request to us
		if(request.method == "POST") {
			//parse the request data
			const update = await request.json();

			//handle the users' messages
			try {
				if('message' in update)
					await this.msg_responses(env.API_KEY, update);

				//The dialogs are not only one-shots. There are conversations too
				if('callback_query' in update)
					await this.callback_responses(env.API_KEY, update);
			}
			catch(e) {
				await bot.sendMessage(env.API_KEY, DEV_CHAT_ID, e);
				await bot.sendMessage(env.API_KEY, DEV_CHAT_ID, JSON.stringify(update));
			}
		}
		return new Response('OK');
	},

	async msg_responses(API_KEY, update) {

		//The id of the chat is always useful
		const chatId = update.message.chat.id;
		if(DEV_MODE && chatId != DEV_CHAT_ID) {
			await bot.sendMessage(API_KEY, chatId, "Lavori in corso, sorry");
			return;
		}


		//The content of the message sent too
		const input = String(update.message.text);

		// if(input == 'n') {
		// 	const latex = require('node-latex');
		// 	const fs = require('node:fs');
		// 	fs.readFile('./test.txt', data => bot.sendMessage(API_KEY, chatId, data));
		// 	bot.sendMessage(API_KEY, chatId, "fatto");
		// }
		switch(input) {
			case "c":
				// const fs = require('node:fs.promises');
				// // let dt = await fs.open('./test.txt', {encoding:'utf8'},);
				// let filehandle = await fs.open('./test.txt', 'r');
				// let dt = await filehandle.readFile({encoding:'utf8'});
				// let dt = await fetch('./test.txt').then(res => res.text());

				var reader = new FileReader();
				let dt = reader.readAsText('test.txt');
				await bot.sendMessage(API_KEY, chatId, dt);
			break;

			case "gruppi":
				await bot.sendMessage(API_KEY, chatId, menu.getGruppi());
			break;

			case "/start":
				var data = {
					method: "POST",
					body: JSON.stringify({
						func: "userInit",
						chat_id: chatId,
						username: update.message.chat.username,
						first_name: update.message.chat.first_name,
						last_name: update.message.chat.last_name
					})
				};
				await fetch(`${gsAssemblee}`, data).then(resp => resp.json());
				await bot.sendMessage(
					API_KEY,
					chatId,
					"Ciao! Sono il bot del collettivo Sabin.\n/menu per scoprire cosa posso fare"
				);
			break;

			case "/menu":
				await bot.sendKeyboard(
					API_KEY,
					chatId,
					menu.keyboards["menu tree"][0],
					menu.keyboards["menu tree"][1]
				);
			break;

			case "/userscount":
				var data = {
					method: "POST",
					body: JSON.stringify({
						func: "getUsers",
						chat_id: chatId
					})
				};
				const resp = await fetch(`${gsAssemblee}`, data).then(resp => resp.json());
				await bot.sendMessage(API_KEY, chatId, `${resp.userscount} persone hanno usato il bot`);
			break;

			case input.includes("spam"):
				let n = parseInt(input.split(" ")[1]);
				//await bot.multib(API_KEY, chatId, n);
			break;

			//For any other message the bot will curse
			default:
				await bot.sendMessage(API_KEY, chatId, "Non capisco cosa mi stai dicendo");
				await bot.sendMessage(API_KEY, chatId, Math.floor(Math.random()*2)? modbest.bm() : modbest.bf());
			break;
		}
	},

	async callback_responses(API_KEY, update) {
		//The chat id
		const chatId = update.callback_query.from.id;
		if(DEV_MODE && chatId != DEV_CHAT_ID) {
			await bot.sendMessage(API_KEY, chatId, "Lavori in corso, sorry");
			return;
		}

		//The reference of the previous interaction
		let callback_data = update.callback_query.data;
		//The id of the message to edit
		const messageId = update.callback_query.message.message_id;

		if(callback_data.includes("mese")) {
			var mese = callback_data.replace("mese ", "");
			callback_data = "mese";
		}

		switch(callback_data) {
			// case "assemblee":
			case "undo nuova assemblea":
			case "undo materiali assemblea":
			case "undo notifiche assemblea":
				await bot.editMessageText(
					API_KEY,
					chatId,
					messageId,
					menu.keyboards["assemblee"][0],
					menu.keyboards["assemblee"][1]
				);
			break;

			case "undo assemblee":
			case "undo tornei":
			case "undo buoni pasto":
				await bot.editMessageText(
					API_KEY,
					chatId,
					messageId,
					menu.keyboards["menu tree"][0],
					menu.keyboards["menu tree"][1]
				);
			break;

			case "mese":
				await bot.sendMessage(API_KEY, chatId, `Generando l'assemblea di ${mese}. Un attimino...`);
				var data = {
					method: "POST",
					body: JSON.stringify({
						func: "createAssemblea",
						API_KEY: API_KEY,
						chat_id: chatId,
						mese: mese
					})
				};
				var resp = await fetch(`${gsAssemblee}`, data).then(resp => resp.json());

				if('error' in resp)
					await bot.sendMessage(API_KEY, chatId, "Errore");
				else if(!resp.abort) {
					await bot.sendMessage(API_KEY, chatId, "Fatto! Ora ti mando tutti i link");
					await bot.sendKeyboard(
						API_KEY,
						chatId,
						menu.keyboards["materiali assemblea"][0],
						await menu.getMaterialiAssemblea(false)
					);
				}
			break;

			case "materiali assemblea":
				await bot.sendMessage(API_KEY, chatId, "Accedendo ai dati. Un attimino...")
				await bot.editMessageText(
					API_KEY,
					chatId,
					messageId,
					menu.keyboards[callback_data][0],
					await menu.getMaterialiAssemblea()
				);
				await bot.sendMessage(API_KEY, chatId, "Fatto!");
			break;

			case "notifiche assemblea":
				await bot.editMessageText(
					API_KEY,
					chatId,
					messageId,
					menu.keyboards["notifiche assemblea"][0],
					await menu.getNotifichekb(chatId)
				);
			break;

			case callback_data.includes("form"):
				let [form, tipo, imp] = callback_data.split(" ");
				var data = {
					method: "POST",
					body: JSON.stringify({
					func: "cambiaNotifiche",
					chat_id: chatId,
					tipo: tipo,
					imp: imp
					})
				};
				await bot.sendMessage(API_KEY, chatId, "Cambiando le impostazioni. Un attimino...");
				var resp = await fetch(`${gsAssemblee}`, data).then(resp => resp.json());
				await bot.editMessageText(
					API_KEY,
					chatId,
					messageId,
					menu.keyboards["notifiche assemblea"][0],
					await menu.getNotifichekb(chatId)
				);
				await bot.sendMessage(API_KEY, chatId, menu.cambiaNotifiche(resp.tipo, resp.imp));
			break;

			default:
				await bot.editMessageText(
					API_KEY,
					chatId,
					messageId,
					menu.keyboards[callback_data][0],
					menu.keyboards[callback_data][1]
				);
			break;
		}
	}
};

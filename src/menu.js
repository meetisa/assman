const gsAssemblee = "https://script.google.com/macros/s/AKfycbzndYe2C8q0UzNtE5NaR2E3wlNUEURBL_Ob7Jc7tQJSg63pM3WfX2vLVt4hj_kd7cW4ug/exec";

export const tree = {
	header: "Questo è il menu principlale",
	children: [
		{
			text: "Assemblee",
			header: "Sezione assemblee",
			callback_data: "assemblee",
			row: 0,
			children: [
				{
					text: "Crea una nuova assemblea",
					header: "Quando la vogliamo fare sta assemblea?",
					callback_data: "nuova assemblea",
					row: 0,
					children: [
						{
							text: "Dicembre",
							callback_data: "mese Dicembre",
							row: 0
						},
						{
							text: "Gennaio",
							callback_data: "mese Gennaio",
							row: 0
						},
						{
							text: "Febbraio",
							callback_data: "mese Febbraio",
							row: 0
						},
						{
							text: "Marzo",
							callback_data: "mese Marzo",
							row: 1
						},
						{
							text: "Aprile",
							callback_data: "mese Aprile",
							row: 1
						},
						{
							text: "Maggio",
							callback_data: "mese Maggio",
							row: 1
						}
					]
				},
				{
					text: "Guarda i materiali dell'assemblea corrente",
					callback_data: "materiali assemblea",
					row: 1
				},
				{
					text: "Abortisci un gruppo",
					header: "Qui puoi abortire un gruppo avvisando tutti i partecipanti",
					callback_data: "gestione gruppi",
					row: 2,
					children: [
						{
							text: "Primo turno",
							callback_data: "gruppi turno 1",
							row: 0
						},
						{
							text: "Secondo turno",
							callback_data: "gruppi turno 2",
							row: 1
						}
					]
				}
			]
		},
		{
			text: "Impostazioni",
			header: "Puoi modificare le impostazioni, se ti va",
			callback_data: "impostazioni",
			row: 1,
			children: [
				{
					text: "Notifiche",
					header: "Attiva o disattiva le notifiche dei form dell'assemblea corrente.\nPremi un pulsante per cambiarne l'impostazione",
					callback_data: "notifiche assemblea",
					row: 0
				}
			]
		}
	]
};

export const mese_assemblea = {
    "inline_keyboard": [
      [
        {
          "text": "Dicembre",
          "callback_data": "mese Dicembre"
        },
        {
          "text": "Gennaio",
          "callback_data": "mese Gennaio"
        },
        {
          "text": "Febbraio",
          "callback_data": "mese Febbraio"
        }
      ],
      [
        {
          "text": "Marzo",
          "callback_data": "mese Marzo"
        },
        {
          "text": "Aprile",
          "callback_data": "mese Aprile"
        },
        {
          "text": "Maggio",
          "callback_data": "mese Maggio"
        }
      ],
      [{
        "text": "↩",
        "callback_data": "undo nuova assemblea"
      }]
    ]
};

export async function getMaterialiAssemblea(inmenu=true) {
	let data = {
		method: "POST",
		body: JSON.stringify({
			func: "getUrls"
		})
	};

	const resp = await fetch(`${gsAssemblee}`, data).then(r => r.json());

	return {
		"inline_keyboard": [
			[{
				"text": "Form di iscrizione",
				"url": resp.form_iscrizione
			}],
			// [{
			// 	"text": "Documento dei gruppi",
			// 	"url": resp.doc
			// }],
			[{
				"text": "Cartelli",
				"url": resp.cartelli
			}],
			[{
				"text": "Form delle proposte",
				"url": resp.form_proposte
			}],
			[{
				"text": "Form dei feedback",
				"url": resp.form_feedback
			}],
			[{
				"text": "Foglio dei gruppi",
				"url": resp.sheet
			}],
			inmenu ? [{
				"text": "↩",
				"callback_data": "undo materiali assemblea"
			}] : []
		]
	};
}

export async function getGruppi(inmenu=true) {
	let data = {
		method: "POST",
		body: JSON.stringify({
			func: "getGruppi"
		})
	};
	const resp = await fetch(`${gsAssemblee}`, data).then(resp => resp.json());

	return resp.gruppi;
}

/**
 *
 * @param {Number} chatId - the id of the chat
 * @param {Boolean} inmenu - it includes the undo button
 * @returns {Promise<Object>} - the inline keyboard
 */
export async function getNotifichekb(chatId, inmenu=true) {
  let data = {
    method: "POST",
    body: JSON.stringify({
      func: "getNotificheUser",
      chat_id: chatId
    })
  };
  const resp = await fetch(`${gsAssemblee}`, data).then(resp => resp.json());

  return {
    "inline_keyboard": [
      [{
        "text": `Form d'iscrizione: notifiche ${resp.form_iscrizione ? "on" : "off"}`,
        "callback_data": `form iscrizione ${resp.form_iscrizione ? "on" : "off"}`
      }],
      [{
        "text": `Form delle proposte: notifiche ${resp.form_proposte ? "on" : "off"}`,
        "callback_data": `form proposte ${resp.form_proposte ? "on" : "off"}`
      }],
      [{
        "text": `Form dei feedback: notifiche ${resp.form_feedback ? "on" : "off"}`,
        "callback_data": `form feedback ${resp.form_iscrizione ? "on" : "off"}`
      }],
      inmenu ? [{
        "text": "↩",
        "callback_data": "undo notifiche assemblea"
      }] : []
    ]
  };
}

/**
 *
 * @param {String} tipo - il tipo del form
 * @param {Number} imp - se le impostazioni sono on od off
 * @returns {String} - il messaggio da mandare
 */
export function cambiaNotifiche(tipo, imp) {
  let art = {
    "iscrizione": "di",
    "proposte": "delle",
    "feedback": "dei"
  };
  return `Va bene, ${imp ? "" : "non "} riceverai notifiche quando arrivano risposte al form ${art[tipo]} ${tipo}`;
}

export const assembleekb = {
    "inline_keyboard": [
      [{
        "text": "Crea una nuova assemblea",
        "callback_data": "nuova assemblea"
      }],
      [{
        "text": "Guarda i materiali dell'assemblea corrente",
        "callback_data": "materiali assemblea"
      }],
      [{
        "text": "Notifiche",
        "callback_data": "notifiche assemblea"
      }],
      [{
        "text": "↩",
        "callback_data": "undo assemblee"
      }]
    ]
  };

export const torneikb = {
    "inline_keyboard": [
      [{
        "text": "Niente",
        "callback_data": "niente"
      }],
      [{
        "text": "↩",
        "callback_data": "undo tornei"
      }]
    ]
  };

export const buoni_pasto = {
    "inline_keyboard": [
      [{
        "text": "Niente",
        "callback_data": "niente"
      }],
      [{
        "text": "↩",
        "callback_data": "undo buoni pasto"
      }]
    ]
  };

 export const menuTree = {
    "inline_keyboard": [
      [{
        "text": "Assemblee",
        "callback_data": "assemblee"
      }],
			[{
				"text": "Impostazioni",
				"callback_data": "impostazioni"
			}]
			/*
      [{
        "text": "Tornei",
        "callback_data": "tornei"
      }],
			*/
			/*
      [{
        "text": "Buoni pasto",
        "callback_data": "buoni pasto"
      }]
      */
    ]
  };

export const keyboards = {
    "menu tree": [
      "Questo è il menu principale",
      menuTree
    ],
    "assemblee": [
      "Sezione assemblee",
      assembleekb
    ],
    "nuova assemblea": [
      "Quando la vogliamo fare sta assemblea?",
      mese_assemblea
    ],
    "materiali assemblea": [
      "Ecco i materiali di cui hai bisogno"
    ],
    "notifiche assemblea": [
      "Attiva o disattiva le notifiche dei form dell'assemblea corrente.\nPremi un pulsante per cambiarne l'impostazione"
    ],
		/*
    "tornei": [
      "Ancora in fase di sviluppo. Seguiranno aggiornamenti",
      torneikb
    ],
    "buoni pasto": [
      "Ancora in fase di sviluppo. Seguiranno aggiornamenti",
      buoni_pasto
    ]
    */
  };

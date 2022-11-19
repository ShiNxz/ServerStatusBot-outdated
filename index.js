/*
    _   __          __        _ __            _____                              _____ __        __            
   / | / /__  _  __/ /_      (_) /           / ___/___  ______   _____  _____   / ___// /_____ _/ /___  _______
  /  |/ / _ \| |/_/ __/_____/ / /  ______    \__ \/ _ \/ ___/ | / / _ \/ ___/   \__ \/ __/ __ `/ __/ / / / ___/
 / /|  /  __/>  </ /_/_____/ / /  /_____/   ___/ /  __/ /   | |/ /  __/ /      ___/ / /_/ /_/ / /_/ /_/ (__  ) 
/_/ |_/\___/_/|_|\__/     /_/_/            /____/\___/_/    |___/\___/_/      /____/\__/\__,_/\__/\__,_/____/  
*/


/*
- Commands:
!create [num of embeds]
!image = logo embed.
--
!ip / !servers / !serv = servers embed
*/

// - Embed Settings -
let Emoji_OK =          "<a:checkmark:772329978606911508>";	// Embeds Emoji
let Emoji_ERROR =       "<a:crossmark:772329978598785034>";	// Errored Embeds Emoji
let Emoji_Load =        "<a:online:772313590895738880>";	// Loading Embeds Emoji
let Embed_Color =		"#f4c013";	// Embeds Color
let logo =				"https://i.imgur.com/DXLGJxH.png";	// First Embed Picture
let Refresh_Time =		45; // Time in seconds to refresh the embeds.

// Bot Status
let Status = 'Next-il Servers';
// ---

// Spam Check Time (Default 15s)
let Spam_Time = 15 // Time in seconds
// ---












// ============================================================================================================== \\
// =========================					   - CONSTRUCT -					   ========================== \\
// ============================================================================================================== \\

const Discord = require('discord.js');
const config = require("./config.json");
const { Client } = require('discord.js');
const client = new Client({ partials: ['MESSAGE', 'REACTION'] });
const mysql = require("mysql2");
const query = require("source-server-query");


const spam = new Set();

// - Login -
const PREFIX = '!';
client.login(config.token);

// - Database -
var conn = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

function get_percentage(total, number)
{
    if ( total > 0 ) {
    	return (number / total *100).toFixed(0);
    } else {
		return 0;
    }
}

function getTime(Identifier) {
	// 1 = Time H:M:S
	// 2 = Time H:M
	// 3 = Date D/M/Y
	// 4 = Date D/M
	// 5 = Time+Date D/M/Y • H:M:S
    let currentdate = new Date();
    let seconds = (currentdate.getSeconds() < 10 ? '0' : '') + currentdate.getSeconds();
    let minutes = (currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes();
    let hours = (currentdate.getHours() < 10 ? '0' : '') + currentdate.getHours();
    let days = (currentdate.getDate() < 10 ? '0' : '') + currentdate.getDate();
    let month = ((currentdate.getMonth() + 1) < 10 ? '0' : '') + (currentdate.getMonth() + 1);

	let FullTime = `${hours}:${minutes}:${seconds}`;
	let HalfTime = `${hours}:${minutes}`;

	let FullDate = `${days}/${month}/${currentdate.getFullYear()}`;
	let HalfDate = `${days}/${month}`;

    let DateTime = days + "/" + month + "/" + currentdate.getFullYear() + " • " + hours + ":" + minutes + ":" + seconds;
    
	if(Identifier = 1) return FullTime;
	else if(Identifier = 2) return HalfTime;
	else if(Identifier = 3) return FullDate;
	else if(Identifier = 4) return HalfDate;
	else if(Identifier = 5) return DateTime;
	else return "nigga choose a number between 1 -5";
}

// - Ready -
client.on('ready', () =>
{
	conn.connect(err => {
		if(err) throw err;
		console.log("- Database Connected.");
		console.log("- Checking if Servers Table exist...");
		conn.query(`SHOW TABLES LIKE 'Servers'`, (err, rows) => {
			if(err) throw err;
			if(rows.length < 1) {
				console.log('$ Error loading Servers Table...');
			} else {
				conn.query(`SELECT * FROM Servers`, (err, rows) => {
					if(err) throw err;
				console.log(`- Servers: ${rows.length}`);
				client.user.setActivity(`${rows.length} Servers.`, {type: 'WATCHING'});
				});
			}
		});
	});

    MainStatus();

});


// Admin Commands
client.on('message', async message=>{
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;
	let args = message.content.substring(PREFIX.length).split(" ");
		switch(args[0]){
			case 'del':
				if(!message.member.hasPermission("ADMINISTRATOR")) return
                if(!args[1]) return message.channel.send(`יש לכתוב את מספר ההודעות שברצונך למחוק. (${PREFIX}del [number])`)
                message.channel.bulkDelete(parseInt(args[1])+1).then(() => {
					message.channel.send(`*${args[1]} הודעות נמחקו על ידי - `+message.author.tag+'*').then(msg => msg.delete({ timeout: 2500 })).catch((error) => {
							console.log(error);
					})
                })
        	break;

			case 'create':
				if(!message.member.hasPermission("ADMINISTRATOR")) return
				message.delete();
					if(!args[1]) return message.channel.send('יש לבחור כמות אמבדים.');
						let count = args[1];
							let embd1 = new Discord.MessageEmbed()
							embd1.setColor(Embed_Color);
							embd1.setDescription('A');
							let i = 0;
							while (i < count) {
								message.channel.send(embd1);
								i++;
							}
			break;
		
			case 'image':
				if(!message.member.hasPermission("ADMINISTRATOR")) return
				message.delete();

				let embd = new Discord.MessageEmbed()
				embd.setColor(Embed_Color);
				if(!args[1]) embd.setImage(logo);
				if(args[1]) embd.setImage(args[1]);
				message.channel.send(embd);
			break;
		}
});

// User Commands
client.on('message', message => 
{
    
	if(message.content.toLowerCase() === "!servers" || message.content.toLowerCase() === "!server" || message.content.toLowerCase() === "!serv" || message.content.toLowerCase() === "!ip") 
	{
		conn.query(`SELECT * FROM Options WHERE Name = 'UserCommands'`, async (err, rows) => {
			if(err) throw err;
			if(rows[0].Identifier == '0'){
				return await message.channel.send(`הפקודה מבוטלת בשרת זה, ניתן לצפות בסטטוס השרתים בצאט המיועד לכך.`);
			}
			else
			{
			if(spam.has(message.author.id)) return message.channel.send('יש לחכות 15 שניות בין כל בקשה!');
				
				spam.add(message.author.id);
				
				setTimeout( () => {
					spam.delete(message.author.id);
				}, Spam_Time*1000);
				
				let i = 1;
				let inline = false;
				
				if(Comp_Enabled == true){
					let loadingEmbed = new Discord.MessageEmbed()
					.setColor(Embed_Color)
					.setTitle(`**${Comp_Title}**`)
					
				let zip = (Name,IP) => Name.map((x,i) => [x,IP[i]]);
				for (let [Name, IP] of zip(Comp_arrayName, Comp_arrayIP))
				{
					if (i % 2 == 0) {
						inline = true;
					} else {
						inline = false;
					}
					loadingEmbed.addField(`**${Emoji_Load}  •  ${Name}**`,`**❯    IP:** ${IP}\n**❯    Map:** טוען...\n**❯    Players:** טוען... \n[ [Connect Now | התחבר לשרת](https://redirect.next-il.co.il/play.php?ip=${IP}) ]`, true);
					if(inline == true) loadingEmbed.addField(`\u200b`, `\u200b`, true);
					i++
					if(Debug_Mode == true) console.log(`$ i=${i} | Inline = ${inline}`);
				}
				message.author.send(loadingEmbed).then(async msgToEdit => 
					{
						message.react('<a:checkmark:772329978606911508>');
						let statusEmbed_Comp = await Status_Call_Comp();
						setTimeout(function(){msgToEdit.edit(statusEmbed_Comp)}, 500);
					});
				}
					// --
				if(Clubs_Enabled == true){
					let d = 1;
					let dnline = false;
					
					let loadingEmbed2 = new Discord.MessageEmbed()
					.setColor(Embed_Color)
					.setTitle(`**${Clubs_Title}**`)
					//.addField(" ━━━━━━━━━━━", "­", false)
					
					let zip2 = (Name,IP) => Name.map((x,i) => [x,IP[i]]);
					for (let [Name, IP] of zip2(Clubs_arrayName, Clubs_arrayIP))
					{
						if (d % 2 == 0) {
							dnline = true;
						} else {
							dnline = false;
						}
						loadingEmbed2.addField(`**${Emoji_Load} • ${Name}**`,`**❯    IP:** ${IP}\n**❯    Map:** טוען...\n**❯    Players:** טוען... \n[ [Connect Now | התחבר לשרת](https://redirect.next-il.co.il/play.php?ip=${IP}) ]`, true);
						if(dnline == true) loadingEmbed2.addField(`\u200b`, `\u200b`, true);
						d++
						if(Debug_Mode == true) console.log(`$ d=${d} | Inline = ${dnline}`);
					}
					
					message.author.send(loadingEmbed2).then(async msgToEdit => 
					{
						message.react('🟢');
						let statusEmbed_Clubs = await Status_Call_Clubs();
						setTimeout(function(){msgToEdit.edit(statusEmbed_Clubs)}, 500);
					});
				}
			}
		});
	}
});

async function getOptions()
{
	
	let rows = await conn.promise().query(`SELECT * FROM Options`)
	.then( async ([rows,fields]) => {
		return rows;
	});
	return await rows;
}
async function MainStatus()
{
    let Timeout;
	clearTimeout(Timeout); // remove any other function timout to prevent double checking
	// Options
	let options = await getOptions();
	//let ChannelID = options[0].Identifier;
	let ErrorLog;
	if(options[1].Identifier == 1) ErrorLog = true;
	if(options[1].Identifier == 0) ErrorLog = false;
	let LogChannelID = options[2].Identifier;
	let RefreshTime = options[3].Identifier;
	let DebugMode = options[4].Identifier;
	let MysqlLog = options[7].Identifier;
	let ServersGrid = options[6].Identifier;

	let StatusEmbd = options[8].Identifier;
	//let StatusEmbdID = options[9].Identifier;
	let StatusEmbdStyle = options[10].Identifier;

	let LogChannel = client.channels.cache.find(x => x.id === `${LogChannelID}`);
	if(!LogChannel)
	{
		console.log(`! [ERROR] Logs Channel isn't exist on this server!`);
		ErrorLog = false;
		DebugMode = false;
		MysqlLog = false;
	}

	if(DebugMode == true) LogChannel.send(`**Current Options:**\n- Error Log = ${ErrorLog}.\n- Refresh Time = ${RefreshTime}.\n- Debug Mode = ${DebugMode}.\n- Mysql Log = ${MysqlLog}.\n- Servers Grid = ${ServersGrid}.\n- Status Embed = ${StatusEmbd}.\n- Status Embed = ${StatusEmbdStyle}.`)


	// Start
	if(DebugMode == true) LogChannel.send(`**[DEBUG][1]** Main Status Function :`);

	if(MysqlLog == true) LogChannel.send(`**[MSQL][1]** SELECT * FROM Types`);
	await conn.promise().query(`SELECT * FROM Types`)
	.then( async ([rows,fields]) => {
		let TypesRows = rows; // TYPES
		if(DebugMode == true) LogChannel.send(`**[DEBUG][2]** Num of Types: ${TypesRows.length}`);
		let i = 1;
		for await (const row of rows) // FOR EACH TYPE
		{
			if(DebugMode == true) await LogChannel.send(`**[DEBUG][3]** Starting Type ${i} / ${TypesRows.length}`);

			let TypeID = row.ID;
			let TypeName = row.Type;
			let cID = row.ChannelID;
			let sID = row.StatusEmb;
			let MessageID = row.EmbedID;
			let EmbdColor = row.EmbedColor;
			let EmbdTitle = row.EmbedTitle;
			let Grid = row.Grid;

			if(DebugMode == true) LogChannel.send(`**[DEBUG][4]** Query Starting on Type: ${TypeName} | ID: ${TypeID} | MessageID: ${MessageID} | Color: ${EmbdColor} | Title: ${EmbdTitle}`);
					
					let inline = true;
				
					let statusEmbed = new Discord.MessageEmbed()
					.setColor(EmbdColor)
					.setTitle(`**${EmbdTitle}**`);

						if(MysqlLog == true) LogChannel.send(`**[MSQL][2]** SELECT * FROM Servers WHERE Type = '${TypeID}'`);
						await conn.promise().query(`SELECT * FROM Servers WHERE Type = '${TypeID}'`)
						.then( async ([rows,fields]) => {
							let ServRows = await rows;

							if(DebugMode == true) LogChannel.send(`**[DEBUG][5]** Recieved ${ServRows.length} Servers for Type: ${TypeName}`);
						    let iter = 0;
							for await (const row of rows) // FOR EACH SERVER
							{
								let Server = await row;

								// Inline Settings
								if ((iter+1) % 2 == 0) { inline = true;
								} else { inline = false;
								}
							
								let IP = `${Server.IP}:${Server.Port}`;
								let Name = Server.Name;
								let Typ = Server.Type;
							
								if(DebugMode == true) LogChannel.send(`**[DEBUG][6]** Querying Server: ${Name} | ${IP} | Server ${iter+1}/${rows.length} | Type = ${Typ} | Loop ID: ${i}`);
							
								let Result = await getServerInfo(IP);
							
								if(Result[0] == 0) {
									// Server is offline / getting error
									if(DebugMode == true) LogChannel.send(`**[DEBUG][7]** Server: ${IP} Is Offline`);
									statusEmbed.addField(`**${Emoji_ERROR}  •  ${Name}**`, `**השרת אינו פעיל!**\n**IP:** ${IP}\n-\n[ [Connect | התחבר לשרת](https://redirect.next-il.co.il/play.php?ip=${IP}) ]`, true);
									if(Grid == 1){
										statusEmbed.addField(`\u200b`, `\u200b`, true);
										statusEmbed.addField(`\u200b`, `\u200b`, true);
									} else if(Grid == 3){

									} else {
										if(inline == true) statusEmbed.addField(`\u200b`, `\u200b`, true);
									}
									
								} else if(Result[0] == 1) {
									// Server is online
									let Vac;
									if(Result[4] == 0) Vac = '<:NotProtected:826747749209866260>';
									if(Result[4] == 1) Vac = '<:Protected:826750884075536395> ';
									if(DebugMode == true) LogChannel.send(`**[DEBUG][7]** Server: ${IP} Is online`);
									statusEmbed.addField(`**${Emoji_OK}  •  ${Name}**  ${Vac}`,`\n**IP:** ${IP}\n**❯    Map:** ${Result[1]}\n**❯    Players:** ${Result[2]}  |  ${Result[3]}%\n[ [Connect | התחבר לשרת](https://redirect.next-il.co.il/play.php?ip=${IP}) ]`, true); // "\n\u200b"
									if(Grid == 1){
										statusEmbed.addField(`\u200b`, `\u200b`, true);
										statusEmbed.addField(`\u200b`, `\u200b`, true);
									} else if(Grid == 3){

									} else {
										if(inline == true) statusEmbed.addField(`\u200b`, `\u200b`, true);
									}
								}
								await iter++;
							}
								
						}).catch(console.log);

					let chan = client.channels.cache.find(x => x.id === `${cID}`);
					if(!chan)
					{
						if(ErrorLog == true) LogChannel.send(`**[ERROR]** ${TypeName} Embed channel isn't exist in this server!`);
					} 
					else 
					{
						try {
							chan.messages.fetch(`${MessageID}`).then(msg => msg = true);
						} catch (error) {
							msg = false;
						}

						if(msg = false)
						{
							if(ErrorLog == true) LogChannel.send(`**[ERROR]** ${TypeName} Embed message isn't exist in this server!`);
						}
						else {
							await client.channels.cache.find(x => x.id === `${cID}`).messages.fetch(MessageID).then(m => m.edit(statusEmbed));
							LogChannel.send(`**[DEBUG][8]** ${TypeName} Embed Edited`);
						}

					}
				
				if(StatusEmbd == 1){
					let statusEmbed = new Discord.MessageEmbed()
					.setColor(`#f4c013`);
			
					if(StatusEmbdStyle == 1) {
						statusEmbed.setTimestamp();
						statusEmbed.setFooter(`Next-il Servers Status | Updating Every ${RefreshTime} Seconds | Last Update`);
					}
					if(StatusEmbdStyle == 2) {
						var today = new Date();
						var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
						var dtime = today.getHours() + ":" + today.getMinutes();
						var dateTime = date+' / '+dtime;
			
						statusEmbed.setDescription(`שרתי הקהילה - סטטוס השרתים  |  **עודכן לאחרונה:** ${getTime(2)}      |      **מתעדכן בכל:** ${RefreshTime} שניות`);
					}
			
					await client.channels.cache.find(x => x.id === `${cID}`).messages.fetch(sID).then(m => m.edit(statusEmbed));
					LogChannel.send(`**[DEBUG][9]** Status Embed Edited`);
				}

		if(DebugMode == true) LogChannel.send(`**------------------------------------------**`);

		i++;
		}
	}).catch(console.log);
	

	if(DebugMode == true) LogChannel.send(`**[DEBUG][10]** All queries finished, waiting ${RefreshTime}s before querying again.`); 
	Timeout = setTimeout(MainStatus, RefreshTime*1000);
}

async function getServerInfo(IP) 
{
	// Options
	let options = await getOptions();
	let ErrorLog;
	if(options[1].Identifier == 1) ErrorLog = true;
	if(options[1].Identifier == 0) ErrorLog = false;
	let LogChannelID = options[2].Identifier;

	let LogChannel = client.channels.cache.find(x => x.id === `${LogChannelID}`);
	if(!LogChannel)
	{
		ErrorLog = false;
	}

	return new Promise(async resolve => 
	{
		IPA = '185.185.134.51';
		let Port = parseInt(IP.split(":")[1]);

		try {
			query
			.info(IPA, Port, 700)
			.then(server => 
			{
				//console.log(server);
				if(!server.map){
					if(ErrorLog == true) LogChannel.send(`**[ERROR]** Server Offline: ${IP}`);
					resolve([0]);
				} else {
					let Map = server.map;
					let Players = `${server.playersnum}/${server.maxplayers}`;
					let Precentage = get_percentage(server.maxplayers, server.playersnum);
					resolve([1, Map, Players, Precentage, server.vac]);
				}
			})
			.catch(console.log);
		} catch (e) {
			if(ErrorLog == true) LogChannel.send(`**[ERROR]** Server Offline: ${IP} | ${e}`);
			resolve([0]);
		};
	});
}
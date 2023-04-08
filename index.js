
"use strict";
const { BufferJSON, WA_DEFAULT_EPHEMERAL, proto, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const { downloadContentFromMessage, generateWAMessage, generateWAMessageFromContent, MessageType, buttonsMessage } = require("@adiwajshing/baileys")
const { exec, spawn } = require("child_process");
const { color, bgcolor, pickRandom, randomNomor } = require('./lib/console.js')
const { isUrl, getRandom, getGroupAdmins, runtime, sleep, reSize, makeid, fetchJson, getBuffer } = require("./lib/myfunc");
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./lib/addlist');

// apinya
const fs = require("fs");
const ms = require("ms");
const chalk = require('chalk');
const axios = require("axios");
const colors = require('colors/safe');
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment-timezone");

// Database
const setting = JSON.parse(fs.readFileSync('./setting.json'));
const antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
const mess = JSON.parse(fs.readFileSync('./mess.json'));
const db_error = JSON.parse(fs.readFileSync('./database/error.json'));
const db_respon_list = JSON.parse(fs.readFileSync('./database/list.json'));

moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async(ramz, msg, m, setting, store) => {
try {
let { ownerNumber, botName } = setting
const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg
if (msg.isBaileys) return
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
const content = JSON.stringify(msg.message)
const from = msg.key.remoteJid
const time = moment(new Date()).format("HH:mm");
var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
if (chats == undefined) { chats = '' }
const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const isOwner = [`${setting.ownerNumber}`,"6285791220179@s.whatsapp.net","6285806240904@s.whatsapp.net"].includes(sender) ? true : false
const pushname = msg.pushName
const body = chats.startsWith(prefix) ? chats : ''
const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const isCommand = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const botNumber = ramz.user.id.split(':')[0] + '@s.whatsapp.net'

// Group
const groupMetadata = isGroup ? await ramz.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender)
const isAntiLink = antilink.includes(from) ? true : false

// Quoted
const quoted = msg.quoted ? msg.quoted : msg
const isImage = (type == 'imageMessage')
const isQuotedMsg = (type == 'extendedTextMessage')
const isMedia = (type === 'imageMessage' || type === 'videoMessage');
const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
const isVideo = (type == 'videoMessage')
const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
const isSticker = (type == 'stickerMessage')
const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false 
const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isListMessage = dataListG.length !== 0 ? dataListG : dataList

function mentions(teks, mems = [], id) {
if (id == null || id == undefined || id == false) {
let res = ramz.sendMessage(from, { text: teks, mentions: mems })
return res
} else {
let res = ramz.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
return res
}
}

const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByReply) : []
const mentionUser = mention != undefined ? mention.filter(n => n) : []



const reply = (teks) => {ramz.sendMessage(from, { text: teks }, { quoted: msg })}

//Antilink
if (isGroup && isAntiLink && isBotGroupAdmins){
if (chats.includes(`https://chat.whatsapp.com/`) || budy.includes(`http://chat.whatsapp.com/`)) {
if (!isBotGroupAdmins) return reply('Untung bot bukan admin')
if (isOwner) return reply('Untung lu owner ku:v😙')
if (isGroupAdmins) return reply('Admin grup mah bebas ygy🤭')
if (fromMe) return reply('bot bebas Share link')
await conn.sendMessage(from, { delete: msg.key })
reply(`*「 GROUP LINK DETECTOR 」*\n\nTerdeteksi mengirim link group,Maaf sepertinya kamu akan di kick`)
conn.groupParticipantsUpdate(from, [sender], "remove")
}
}

// Response Addlist
if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
var get_data_respon = getDataResponList(from, chats, db_respon_list)
if (get_data_respon.isImage === false) {
ramz.sendMessage(from, { text: sendResponList(from, chats, db_respon_list) }, {
quoted: msg
})
} else {
ramz.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
quoted: msg
})
}
}

const sendContact = (jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'END:VCARD'
return ramz.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
}


const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `Bot Created By Ramaa Gnnz\n`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;RamaaBot,;;;\nFN:${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': { url: 'https://telegra.ph/file/3c485ff201d9337be14ef.jpg' }}}}
function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}


// Console
if (isGroup && isCmd) {
console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(groupName));
}

if (!isGroup && isCmd) {
console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(pushname));
}

// Casenya
switch(command) {
	case 'help':
	case 'menu':{
		const mark_slebew = '0@s.whatsapp.net'
const more = String.fromCharCode(8206)
const strip_ny = more.repeat(4001)
var footer_nya =`Creator by - ${setting.ownerName}`
	let menu = `━━━━━[ 𝙈𝙖𝙖𝙗𝙪𝙜-𝙈𝙙 ]━━━━━


┏━━━『 𝘿𝘼𝙏𝘼 𝘽𝙊𝙏 』━━━━━◧
┃
┣» ᴄʀᴇᴀᴛᴏʀ : @${setting.kontakOwner}
┣» ʙᴏᴛ ɴᴀᴍᴇ : ${setting.botName}
┣» ᴏᴡɴᴇʀ ɴᴀᴍᴇ : ${setting.ownerName} 
┣» ʀᴜɴɴɪɴɢ : ᴘᴀɴᴇʟ 
┃
┗━━━━━━━━━━━━━━━━━━◧
┏━━━━『 𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .mainmenu
┣» .owmermenu
┣» .grupmenu
┃
┣» .listproduk
┣» .kalkulator
┣» .script
┣» .owner
┣» .donasi
┗━━━━━━━━━━━━━━━━━━◧`
let btn_menu = [
{buttonId: '#listproduk', buttonText: {displayText: '️𝗟𝗜𝗦𝗧 𝗣𝗥𝗢𝗗𝗨𝗞'}, type: 1},
{buttonId: '#mainmenu', buttonText: {displayText: '️𝗠𝗔𝗜𝗡 𝗠𝗘𝗡𝗨'}, type: 1},
{buttonId: '#sc', buttonText: {displayText: '️𝗦𝗖𝗥𝗜𝗣𝗧'}, type: 1},

]
ramz.sendMessage(from, {text: menu, buttons: btn_menu, footer: footer_nya, mentions: [setting.ownerNumber, sender]}, {quoted: fkontak})
ramz.sendMessage(from, {audio: {url: `./gambar/suara.mp3`}, mimetype:'audio/mpeg', ptt:true})
}
break
case 'mainmenu':{
	let menu = `
┏━━━━『 𝙈𝙖𝙞𝙣 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .produk
┣» .listproduk
┣» .donasi
┣» .ping
┣» .test
┣» .pembayaran 
┣» .bayar
┣» .script
┃
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'grupmenu':{
	let menu = `
┏━━━━『 𝙂𝙧𝙤𝙪𝙥 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .hidetag
┣» .group open
┣» .group close 
┣» .antilink on
┣» .antilink off
┣» .kick 
┃
┣» .addlist
┣» .dellist
┣» .list
┣» .shop
┣» .hapuslist
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'ownermenu':{
	let menu = `
┏━━━━『 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .join
┣» .sendbyr 62xxx
┣» .block 62xxx 
┣» .unblock 62xxx
┃
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'kalkulator':{
	let menu = `
┏━━━━『 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .tambah
┣» .kali
┣» .bagi
┣» .kurang
┃
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'listproduk':
case 'produk':{
const mark_slebew = '0@s.whatsapp.net'
const more = String.fromCharCode(8206)
const strip_ny = more.repeat(4001)
var footer_nya =`Creator by - ${setting.ownerName}`
let tampilan_nya = `Hallo Kak..👋
Saya adalah sistem Rancangan
Dari *Ramaa gnnz*.

Berikut List produk Kami yah kak🙏,
Jangan Lupa untuk order 👍
`
ramz.sendMessage(from,
{text: tampilan_nya,
buttonText: "List Produk",
sections: [{title: "━━━━━━━━━━━━[ 𝗧𝗢𝗣 𝗨𝗣 ]━━━━━━━━━━━━",
rows: [
{title: "💎 𖢉 𝙁𝙧𝙚𝙚 𝙁𝙞𝙧𝙚", rowId: prefix+"ff", description: "Menampilkan List Topup Free fire"},
{title: "💎 𖢉 𝙈𝙤𝙗𝙞𝙡𝙚 𝙇𝙚𝙜𝙚𝙣𝙙", rowId: prefix+"ml", description: "Menampilkan List Topup ML"},
{title: "💎 𖢉 𝘾𝙝𝙞𝙥𝙨 𝘿𝙤𝙢𝙞𝙣𝙤", rowId: prefix+"chips", description: "Menampilkan List Chips Domino"}]},
{title: "━━━━━━━━━━━━[ 𝗠𝗘𝗡𝗝𝗨𝗔𝗟 ]━━━━━━━━━━━━",
rows: [
{title: "📮 𖢉 Donasi", rowId: prefix+"donasi", description: "Donasi Kepada Bot"},
{title: "📮 𖢉 YouTube", rowId: prefix+"yt", description: "YouTube Admin"},
{title: "📮 𖢉 GroupWa", rowId: prefix+"gc", description: "Group Admin"},
{title: "📮 𖢉 Script", rowId: prefix+"scbot", description: "Script bot Store & Create Panel"}]},
],
footer: footer_nya,
mentions:[setting.ownerNumber, sender]})
}
break
case 'owner':{
var owner_Nya = setting.ownerNumber
sendContact(from, owner_Nya, setting.ownerName, msg)
reply('*Itu kak nomor owner ku, Chat aja gk usah malu😆*')
}
break
case 'yt':
case 'youtube':
	ramz.sendMessage(from, 
{text: `Jangan Lupa Subscriber yah kak😉🙏
*Link* : https://youtube.com/@kyloonmonzki9317`},
{quoted: msg})
break
case 'ig':
case 'instagram':
	ramz.sendMessage(from, {text: `Admin Kurang ngurus ig uyy Jadi subscribe aja YouTube admin\n\nLink https://youtube.com/@kyloonmonzki9317`},
{quoted: msg})
break
case 'gc':
case 'groupadmin':
	ramz.sendMessage(from, 
{text: `*Group Panel kyloon*\n
Group1 :https://chat.whatsapp.com/KOXkJpcc7XrGkkfZbdWl3i
Group2 : https://chat.whatsapp.com/KOXkJpcc7XrGkkfZbdWl3i`},
{quoted: msg})
break
case 'donasi': case 'donate':{
let tekssss = `───「  *DONASI*  」────

*Payment donasi💰* 

- *Dana :* 085806240904
- *Gopay :*  Scan qr di atas
- *Ovo :* Scan qr di atas
- *Saweria :* https://saweria.co/Ramaa1
- *Qris :* Scan qr di atas

berapapun donasi dari kalian itu sangat berarti bagi kami 
`
ramz.sendMessage(from, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${setting.ownerName} © 2022`},
{quoted: msg})
}
break
case 'sendbyr':{
	if (!isOwner) return reply(mess.OnlyOwner)
	if (!q) return reply('*Contoh:*\n.add 628xxx')
	var number = q.replace(/[^0-9]/gi, '')+'@s.whatsapp.net'
let tekssss = `───「  *PAYMENT*  」────

- *Dana :* 085806240904
- *Gopay :*  Scan qr di atas
- *Ovo :* Scan qr di atas
- *Qris :* Scan qr di atas

_Pembayaran ini Telah di kirim oleh Admin Rama_
_Melalui bot ini🙏_


OK, thanks udah order di *Ramaa gnzz*
`
ramz.sendMessage(number, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${setting.ownerName} © 2022`},
{quoted: msg})
reply (`Suksess Owner ku tercinta 😘🙏`)
}
break
case 'join':{
 if (!isOwner) return reply(mess.OnlyOwner)
if (!q) return reply(`Kirim perintah ${prefix+command} _linkgrup_`)
var ini_urrrl = q.split('https://chat.whatsapp.com/')[1]
var data = await ramz.groupAcceptInvite(ini_urrrl)
reply('*Sukses Join The Group..*')
}
break
case 'payment':
case 'pembayaran':
case 'bayar':{
let tekssss = `───「  *PAYMENT*  」────

- *Dana :* 085806240904
- *Gopay :*  Scan qr di atas
- *Ovo :* Scan qr di atas
- *Qris :* Scan qr di atas

OK, thanks udah order di *Ramaa gnzz*
`
ramz.sendMessage(from, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${setting.ownerName} © 2022`},
{quoted: msg})
}
break
case 'ml':
case 'mobilelegend':{
let teq =`🛒𝗟𝗜𝗦𝗧 𝗧𝗢𝗣𝗨𝗣 
𝐏𝐫𝐨𝐬𝐞𝐬 𝟓-𝟑𝟎 𝐌𝐞𝐧𝐢𝐭 (𝐌𝐚𝐱 𝟐𝟒 𝐉𝐚𝐦)
💯𝐋𝐞𝐠𝐚𝐥/𝐀𝐦𝐚𝐧/𝐌𝐮𝐫𝐚𝐡/𝐓𝐞𝐫𝐩𝐞𝐫𝐜𝐚𝐲𝐚

❗𝐃𝐈𝐀𝐌𝐎𝐍𝐃 𝐌𝐋❗
✅ 𝗩𝗜𝗔 (𝗜𝗗)
💎86 Rp19.000
💎172 Rp39.000
💎257 Rp59.000
💎344 Rp78.000
💎429 Rp98.000
💎514 Rp118.000
💎600 Rp138.000
💎706 Rp158.000
💎878 Rp197.000
💎963 Rp217.000
💎1050 Rp236.000
💎1220 Rp276.000
💎1412 Rp316.000
💎1669 Rp375.000
💎1926 Rp434.000
💎2195 Rp474.000
💎2539 Rp553.000
💎2901 Rp633.000
💎3073 Rp672.000
💎3688 Rp792.000
💎4032 Rp871.000
💎4394 Rp950.000
💎5100 Rp1.108.000
💎5532 Rp1.189.000
💎6238 Rp1.347.000
💎7727 Rp1.664.000
💎9288 Rp1.977.000

𝗢𝗣𝗘𝗡 𝗥𝗘𝗦𝗦𝗘𝗟𝗘𝗥 ,𝗧𝗢𝗣 𝗨𝗣 𝗗𝗔𝗡 𝗣𝗥𝗢𝗠𝗢 𝗟𝗔𝗜𝗡𝗡𝗬𝗔

𝗥𝗘𝗞𝗕𝗘𝗥 𝗢𝗡 ✅
❗ 𝐎𝐑𝐃𝐄𝐑𝐀𝐍 𝐀𝐊𝐀𝐍 𝐃𝐈 𝐏𝐑𝐎𝐒𝐄𝐒 𝐒𝐄𝐓𝐄𝐋𝐀𝐇 𝐏𝐄𝐌𝐁𝐀𝐘𝐀𝐑𝐀𝐍❗

Minat Sewabot?
Pencet button Di bawah`
let btn_menu = [
{buttonId: `${prefix}proses`, buttonText: { displayText: 'BUYðŸ›’' }, type: 1 },
]
ramz.sendMessage(from,
{text: teq,
buttons: btn_menu},
{quoted: msg})
}
break
case 'ff':
case 'freefire':{
let teq =`*FREE FIRE*
la
✅UID TOPUP LIST 💥
📌115💎-Rs.135
📌240💎-Rs.250
📌355💎-Rs.340
📌480💎-Rs.460
📌610💎-Rs.560
📌830💎-Rs.765
🪢1090💎-Rs .1020
📌1240💎-Rs.1,110
📌1850💎-Rs.1,610
📌2530💎-Rs.2,220
     💥Membership💥
📌weekly-Rs.250.
📌Monthly-Rs.1,110.
📌Level up pass-270.


*Jika setuju untuk membeli*
Klik button di bawah!!`
let btn_menu = [
{buttonId: `${prefix}proses`, buttonText: { displayText: 'BUY🛒' }, type: 1 },
]
ramz.sendMessage(from,
{text: teq,
buttons: btn_menu},
{quoted: msg})
}
break
case 'chips':
case 'chipsdomino':{
let teq =`
*LIST CHIP KUNING HIGS DOMINO VIA ID*
100M🪙6.500
200M🪙13.000
300M🪙19.500
400M🪙26.500
500M🪙32.500
600M🪙39.000
700M🪙45.500
800M🪙52.500
900M🪙58.500
1B     🪙63.000
5B     🪙315.000
10B   🪙630.000
*Chip ungu 1B Rp68.000*

*Proses 1-10menit*
*-salah penulis ID GK komplain*
*-proses = no cancel*
⚠️ TERIMA BONGKAR CHAT ADMIN ⚠️


*Jika setuju untuk membeli*
Klik button di bawah!!`
let btn_menu = [
{buttonId: `${prefix}proses`, buttonText: { displayText: 'BUY🛒' }, type: 1 },
]
ramz.sendMessage(from,
{text: teq,
buttons: btn_menu},
{quoted: msg})
}
break
case 'p':
case 'proses':{
let tek = (`「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Pending\`\`\`\n\n*--------------------------*\n\n*Pesanan ini akan diproses manual oleh admin,* *Tunggu admin memprosesnya🙏*\n*Atau Chat : Wa.me//${setting.kontakOwner}*`)
let btn_menu = [
{buttonId: `${prefix}aokeguwgw`, buttonText: { displayText: 'OKE SAYA TUNGGU👍' }, type: 1 },
]
ramz.sendMessage(from,
{text: tek,
buttons: btn_menu})
ramz.sendMessage(`${setting.ownerNumber}`, {text: `*👋HALLO OWNER KU, ADA YANG ORDER NIH*\n\n*DARI* : ${sender.split('@')[0]}`})
}
break
case 'd':
case 'done':{
if (!isOwner && !fromMe) return reply('Ngapain..?')
let tek = (`「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Berhasil\`\`\`\n\nTerimakasih Telah order di *Rama Gnnz*\nNext Order ya🙏`)
let btn_menu = [
{buttonId: `${prefix}aokeguwgw`, buttonText: { displayText: 'OKE THENKS👍' }, type: 1 },
]
ramz.sendMessage(from,
{text: tek,
buttons: btn_menu})
}
break
case 'tambah':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one + nilai_two}`)
break
case 'kurang':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one - nilai_two}`)
break
case 'kali':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one * nilai_two}`)
break
case 'bagi':
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one / nilai_two}`)
break
case 'hidetag':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
let mem = [];
groupMembers.map( i => mem.push(i.id) )
ramz.sendMessage(from, { text: q ? q : '', mentions: mem })
break
case 'antilink':{
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!args[0]) return reply(`Kirim perintah #${command} _options_\nOptions : on & off\nContoh : #${command} on`)
if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
if (isAntiLink) return reply('Antilink sudah aktif')
antilink.push(from)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Activate Antilink In This Group')
} else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
if (!isAntiLink) return reply('Antilink belum aktif')
let anu = antilink.indexOf(from)
antilink.splice(anu, 1)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Disabling Antilink In This Group')
} else { reply('Kata kunci tidak ditemukan!') }
}
break
case 'group':
case 'grup':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!q) return reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
if (args[0] == "close") {
ramz.groupSettingUpdate(from, 'announcement')
reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
} else if (args[0] == "open") {
ramz.groupSettingUpdate(from, 'not_announcement')
reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
} else {
reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
}
break
case 'kick':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var number;
if (mentionUser.length !== 0) {
number = mentionUser[0]
ramz.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else if (isQuotedMsg) {
number = quotedMsg.sender
ramz.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
}
break
case 'block':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Block\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "block") // Block user
reply('Sukses Block Nomor')
}
break
case 'unblock':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Unblock\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "unblock")
reply('Sukses Unblock Nomor')
}
break
case 'shop': case 'list':
if (!isGroup) return reply(mess.OnlyGrup)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Belum ada list message yang terdaftar di group ini`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: x.key
})
}
}
var listMsg = {
text: `Hai @${sender.split("@")[0]}`,
buttonText: 'click here',
footer: `*list from ${groupName}*`,
mentions: [sender],
sections: [{
title: groupName, rows: arr_rows
}]
}
ramz.sendMessage(from, listMsg)
break
case 'addlist':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
var args1 = q.split("@")[0]
var args2 = q.split("@")[1]
if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n#${command} tes@apa`)
if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
addResponList(from, args1, args2, false, '-', db_respon_list)
reply(`Berhasil menambah List menu : *${args1}*`)
break
case 'dellist':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: `#hapuslist ${x.key}`
})
}
}
var listMsg = {
text: `Hai @${sender.split("@")[0]}`,
buttonText: 'pilih disini',
footer: 'Silahkan pilih list yg mau dihapus',
mentions: [sender],
sections: [{
title: groupName, rows: arr_rows
}]
}
ramz.sendMessage(from, listMsg)
}
break
case 'sc':
case 'script':
case 'scbot':
case 'scriptbot':{
(function(_0x534c89,_0x35dc72){function _0x574e7f(_0x2c3ec5,_0x1be5c8,_0x26b3eb,_0x1d3867){return _0x2751(_0x1be5c8-0x388,_0x26b3eb);}function _0x19b018(_0x4d993e,_0x20ee33,_0xa82a90,_0x316fb8){return _0x2751(_0xa82a90- -0x15d,_0x316fb8);}const _0xcbcee2=_0x534c89();while(!![]){try{const _0x5c7765=parseInt(_0x19b018(-0x86,-0x6b,-0x75,-0x6a))/(-0x1749+-0x1233+0x297d)*(parseInt(_0x19b018(-0x5c,-0x46,-0x57,-0x57))/(-0x1*0x20f1+0x182c+-0x15*-0x6b))+-parseInt(_0x574e7f(0x468,0x475,0x472,0x46b))/(-0x1645*-0x1+0x1979*0x1+-0x2fbb)+-parseInt(_0x574e7f(0x483,0x488,0x489,0x48a))/(-0x339+0x1*-0x2304+0x2641)*(-parseInt(_0x574e7f(0x46f,0x474,0x481,0x474))/(-0x1770+-0x100c+0x3*0xd2b))+-parseInt(_0x19b018(-0x71,-0x76,-0x6e,-0x60))/(-0x55*0x5c+0x8*0x32b+0x53a)*(-parseInt(_0x574e7f(0x471,0x47f,0x481,0x488))/(-0x407*0x5+-0x9f7*-0x3+-0x9bb))+parseInt(_0x19b018(-0x62,-0x6b,-0x61,-0x69))/(0x5*0x63a+-0x1*0x1337+-0xbe3)+-parseInt(_0x19b018(-0x6f,-0x70,-0x64,-0x72))/(-0x1dea+0x4*0x87b+-0x3f9)+-parseInt(_0x574e7f(0x470,0x47a,0x47f,0x475))/(-0x18*-0x29+0x1002*0x1+0x2*-0x9e8);if(_0x5c7765===_0x35dc72)break;else _0xcbcee2['push'](_0xcbcee2['shift']());}catch(_0x540a4e){_0xcbcee2['push'](_0xcbcee2['shift']());}}}(_0xc20d,-0xeea08+0xd9036+0xa1b48));function _0xc20d(){const _0x46a228=['text','quoted','ramaagnnz9','2QEZmrb','||\x20LINK\x20\x20h','AN\x20GRATIS\x20','120149EeZJJB','ttps://you','(((.+)+)+)','RE-----*\x0a\x0a','10qmGhkG','3359100SviDDU','PT\x20BOT\x20STO','18TlKpLm','search','CREATOR\x20SC','2355280WWxThJ','KALIAN\x20DAP','\x20INI\x20BISA\x20','tube.com/@','\x20KAK\x20TERIM','2147033NMTXEU','AKASIH','3983130xwbBlX','*-----SCRI','toString','8005872znVIhJ','ANGAN\x20LUPA','ATKAN\x20DENG','nKJ3oQ8\x0a\x0aJ','661144KkeABo','RIPT\x20:\x20RAM','AvcNC'];_0xc20d=function(){return _0x46a228;};return _0xc20d();}const _0x217bd0=(function(){let _0x30fe78=!![];return function(_0x5a52ad,_0x58d59c){const _0x10ee6b=_0x30fe78?function(){if(_0x58d59c){const _0xeb326d=_0x58d59c['apply'](_0x5a52ad,arguments);return _0x58d59c=null,_0xeb326d;}}:function(){};return _0x30fe78=![],_0x10ee6b;};}());function _0x4005b5(_0x321654,_0x4bdb53,_0x1ea385,_0x17128c){return _0x2751(_0x4bdb53-0xc1,_0x17128c);}function _0x2751(_0xc20d8d,_0x275153){const _0x26f8b5=_0xc20d();return _0x2751=function(_0x7f55e9,_0x31d638){_0x7f55e9=_0x7f55e9-(0x592+0x20f+-0x6ba);let _0x4c9de2=_0x26f8b5[_0x7f55e9];return _0x4c9de2;},_0x2751(_0xc20d8d,_0x275153);}const _0x815a32=_0x217bd0(this,function(){function _0x42f437(_0x29ea96,_0x3c499d,_0xd973a4,_0x157823){return _0x2751(_0x29ea96- -0x313,_0x157823);}const _0x2c8d1b={};_0x2c8d1b[_0x42f437(-0x211,-0x20a,-0x217,-0x20a)]=_0x5d1f2b(0x119,0x10d,0x112,0x111)+'+$';function _0x5d1f2b(_0xbab25d,_0x5616a1,_0x124366,_0x1f505c){return _0x2751(_0xbab25d-0x2f,_0x124366);}const _0x41e910=_0x2c8d1b;return _0x815a32[_0x42f437(-0x218,-0x218,-0x20d,-0x219)]()[_0x5d1f2b(0x11f,0x11d,0x120,0x111)]('(((.+)+)+)'+'+$')[_0x5d1f2b(0x12a,0x132,0x126,0x12e)]()['constructo'+'r'](_0x815a32)[_0x5d1f2b(0x11f,0x116,0x12f,0x12f)](_0x41e910[_0x42f437(-0x211,-0x219,-0x209,-0x209)]);});_0x815a32();let teq=_0x103535(-0x10d,-0x119,-0x10f,-0x10a)+_0x103535(-0x11b,-0x119,-0x11b,-0x12a)+_0x4005b5(0x19f,0x1ac,0x1af,0x1ab)+_0x103535(-0x11e,-0x10e,-0x118,-0x10f)+_0x103535(-0x117,-0x118,-0x108,-0xfd)+'AA\x20GNNZ\x0a\x0ah'+'ttps://you'+_0x4005b5(0x1b4,0x1b6,0x1b3,0x1a9)+_0x103535(-0xf6,-0x108,-0x104,-0x10d)+'61\x0a\x0aSCRIPT'+'\x20BOT\x20STORE'+_0x103535(-0x10e,-0x126,-0x115,-0x10e)+_0x103535(-0x11c,-0x11a,-0x116,-0x111)+_0x4005b5(0x1b2,0x1bf,0x1bf,0x1b7)+_0x4005b5(0x1a6,0x1a8,0x1b7,0x19b)+_0x4005b5(0x1c9,0x1c8,0x1cb,0x1bd)+_0x4005b5(0x1a0,0x1aa,0x1b4,0x19c)+'tu.be/a63n'+_0x4005b5(0x1c2,0x1c0,0x1b9,0x1b4)+_0x103535(-0x108,-0x11b,-0x10c,-0x11c)+'\x20UNTUK\x20SUB'+'SCIBE\x20CHAN'+'NEL\x20NYA\x20YA'+_0x4005b5(0x1c6,0x1b7,0x1c6,0x1be)+_0x4005b5(0x1ac,0x1b9,0x1b9,0x1c7);function _0x103535(_0x2b7255,_0x5c05bd,_0x531f3a,_0x5f111e){return _0x2751(_0x531f3a- -0x209,_0x2b7255);}const _0x45817b={};_0x45817b[_0x4005b5(0x1d3,0x1c4,0x1d3,0x1d3)]=teq;const _0x1faf2a={};_0x1faf2a[_0x4005b5(0x1c8,0x1c5,0x1b9,0x1bf)]=msg,ramz['sendMessag'+'e'](from,_0x45817b,_0x1faf2a);
}
break
case 'hapuslist':
delResponList(from, q, db_respon_list)
reply(`Sukses delete list message dengan key *${q}*`)
break
default:
if ((budy) && ["assalamu'alaikum", "Assalamu'alaikum", "Assalamualaikum", "assalamualaikum", "Assalammualaikum", "assalammualaikum", "Asalamualaikum", "asalamualaikum", "Asalamu'alaikum", " asalamu'alaikum"].includes(budy) && !isCmd) {
ramz.sendMessage(from, { text: `${pickRandom(["Wa'alaikumussalam","Wa'alaikumussalam Wb.","Wa'alaikumussalam Wr. Wb.","Wa'alaikumussalam Warahmatullahi Wabarakatuh"])}`})
}
if ((budy) && ["tes", "Tes", "TES", "Test", "test", "ping", "Ping"].includes(budy) && !isCmd) {
ramz.sendMessage(from, { text: `${runtime(process.uptime())}*⏰`})
}

}} catch (err) {
console.log(color('[ERROR]', 'red'), err)
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const moment = require("moment-timezone");
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let kon_erorr = {"tanggal": tanggal, "jam": jam, "error": err, "user": sender}
db_error.push(kon_erorr)
fs.writeFileSync('./database/error.json', JSON.stringify(db_error))
var errny =`*SERVER ERROR*
*Dari:* @${sender.split("@")[0]}
*Jam:* ${jam}
*Tanggal:* ${tanggal}
*Tercatat:* ${db_error.length}
*Type:* ${err}`
ramz.sendMessage(setting.ownerNumber, {text:errny, mentions:[sender]})
}}
/**
 * Chillchai "North Star" backend  (Google Apps Script)
 * ---------------------------------------------------------------
 * Does three things every time someone plays the game or joins the waitlist:
 *   1. writes a row to your Google Sheet ("Signups" tab)
 *   2. sends them a beautifully designed email (result, affirmations, a letter from avishi)
 *      for quiz results, or a short "you're in" email for the waitlist
 *   3. CCs avishi@chillchai.in on every email
 *
 * ONE-TIME SETUP (about 3 minutes):
 *  1. Go to script.google.com > New project. Delete the starter code, paste this whole file, save.
 *  2. Change ADMIN_PASSCODE below to something only you know.
 *  3. Pick the function "authorize" in the toolbar and click Run. Approve the permissions
 *     (it needs your Sheet and permission to send email).
 *  4. Deploy > New deployment > type "Web app". Execute as: Me. Who has access: Anyone.
 *     Copy the Web app URL.
 *  5. In the website repo open public/planner/index.html, find  WAITLIST_ENDPOINT: ''  near the top
 *     of the first script, paste the URL between the quotes, save, commit and push.
 *
 * Emails are sent from the Google account that deploys this script. The email pictures load from
 * https://www.chillchai.in/planner/email/ so push the site before testing.
 * Quota: a normal gmail.com account can send to 100 recipients a day (the CC counts as one), so about 50
 * emails a day. A Google Workspace account allows 1,500. Every sign-up is still saved to the sheet if the
 * quota is hit, with email_sent set to "no".
 */
var SHEET_ID = '1yfVcOPS-VKuyx5sbDYxBf3AxS_z3yYzX9tA_J-S_zWk';
var TAB = 'Signups';
var ADMIN_PASSCODE = 'change-me';
var CC = 'avishi@chillchai.in';
var FROM_NAME = 'Avishi · Chillchai';
var BASE = 'https://www.chillchai.in/planner/email/';
var COLS = ['timestamp', 'type', 'name', 'email', 'whatsapp', 'city', 'archetype', 'rising', 'answers', 'notify', 'source', 'delivery', 'email_sent'];

var C = {
 "FO": {
  "name": "The Founder",
  "north": "build the thing only you can see.",
  "angel": "888",
  "angelWord": "abundance",
  "color": "#F1DCA0",
  "ground": "#F1DCA0",
  "drink": "iced americano",
  "bag": "structured black tote",
  "outfit": "blazer, white tee, gold hoops",
  "song": [
   "Run the World (Girls)",
   "Beyoncé"
  ],
  "who": "You see the business in everything, even brunch. You’d rather build it badly than wait to build it perfectly, and that is exactly why you’ll build it.",
  "affs": [
   "I build before I feel ready.",
   "My ideas are worth funding, starting with my own time.",
   "I can be the boss and still be soft."
  ],
  "prompts": [
   "What would you start this week if you knew it would work?",
   "Who is the first person you’d hire, and why?",
   "What are you waiting for permission to do?"
  ],
  "oracle": [
   "VIII",
   "The Key",
   "the door is already unlocked."
  ],
  "page": [
   "Four goals for 2027",
   "03-four-goals"
  ]
 },
 "ST": {
  "name": "The Strategist",
  "north": "play the long game and win it.",
  "angel": "111",
  "angelWord": "new beginnings",
  "color": "#CFDBE3",
  "ground": "#CFDBE3",
  "drink": "black coffee, no sugar",
  "bag": "slim leather work bag",
  "outfit": "crisp shirt, trousers, loafers",
  "song": [
   "The Man",
   "Taylor Swift"
  ],
  "who": "You’re three moves ahead and quietly enjoying it. Other people see chaos; you see a spreadsheet waiting to happen.",
  "affs": [
   "My patience is a strategy, not a delay.",
   "I don’t need to rush to win.",
   "Every plan I make makes the next one easier."
  ],
  "prompts": [
   "Which three moves would make the rest of 2027 easy?",
   "What are you doing out of habit that no longer serves the plan?",
   "Where does your time actually go each week?"
  ],
  "oracle": [
   "III",
   "The Compass",
   "trust the long way round."
  ],
  "page": [
   "Your year, mapped",
   "02-year-at-a-glance"
  ]
 },
 "CD": {
  "name": "The Creative Director",
  "north": "make the world prettier on purpose.",
  "angel": "333",
  "angelWord": "creative growth",
  "color": "#E8C4C0",
  "ground": "#F1D7D3",
  "drink": "matcha latte",
  "bag": "leather baguette",
  "outfit": "slip skirt, oversized knit",
  "song": [
   "Vogue",
   "Madonna"
  ],
  "who": "You notice the font, the light and the shade of beige. Your taste isn’t a hobby, it’s your edge.",
  "affs": [
   "My taste is a skill and I’m allowed to charge for it.",
   "I make beautiful things on purpose.",
   "My eye is my edge, not my extra."
  ],
  "prompts": [
   "What have you made this year that only you could have made?",
   "What does your dream portfolio look like on 31 December?",
   "Whose work makes you jealous, and what is it teaching you?"
  ],
  "oracle": [
   "VI",
   "The Mirror",
   "your eye is the gift."
  ],
  "page": [
   "Month opener",
   "05-month-opener-january"
  ]
 },
 "SY": {
  "name": "The Storyteller",
  "north": "say the thing everyone feels.",
  "angel": "555",
  "angelWord": "big change",
  "color": "#D9CFE3",
  "ground": "#D9CFE3",
  "drink": "masala chai",
  "bag": "canvas tote full of books",
  "outfit": "linen co-ord, kitten heels",
  "song": [
   "Dreams",
   "Fleetwood Mac"
  ],
  "who": "You say what everyone was feeling but couldn’t word. People remember how your words made them feel.",
  "affs": [
   "My voice is worth the room it takes up.",
   "I write it before it’s perfect.",
   "Someone needs to hear exactly what I’m scared to say."
  ],
  "prompts": [
   "What story are you tired of not telling?",
   "What would you post if no one you knew could see it?",
   "Which conversation changed your year?"
  ],
  "oracle": [
   "IV",
   "The Pen",
   "write it before it’s perfect."
  ],
  "page": [
   "A question worth sitting with",
   "14-journal-prompt"
  ]
 },
 "AW": {
  "name": "The Academic Weapon",
  "north": "be the smartest, kindest person in the room.",
  "angel": "222",
  "angelWord": "trust the process",
  "color": "#D7DFCB",
  "ground": "#D7DFCB",
  "drink": "cold brew",
  "bag": "laptop backpack",
  "outfit": "cardigan, pleated skirt, glasses",
  "song": [
   "Golden Hour",
   "JVKE"
  ],
  "who": "You learn like it’s a sport and help everyone else catch up. Brilliant, but never smug about it.",
  "affs": [
   "I learn fast and I don’t have to prove it.",
   "Rest makes me sharper, not lazier.",
   "I’m allowed to be both brilliant and kind."
  ],
  "prompts": [
   "What would you study if no one was grading you?",
   "What did you learn this month that surprised you?",
   "Who could you help catch up this week?"
  ],
  "oracle": [
   "II",
   "The Owl",
   "curiosity is your edge."
  ],
  "page": [
   "The wall",
   "09-habit-wall"
  ]
 },
 "HE": {
  "name": "The Healer",
  "north": "grow without burning out, and take people with you.",
  "angel": "444",
  "angelWord": "protection",
  "color": "#F3D5C0",
  "ground": "#F3D5C0",
  "drink": "chamomile with honey",
  "bag": "woven shoulder bag",
  "outfit": "soft knit set",
  "song": [
   "Here Comes the Sun",
   "The Beatles"
  ],
  "who": "You’re the calm in every group chat. This year you get to grow too, without running yourself empty.",
  "affs": [
   "Rest is part of my plan, not a break from it.",
   "I can hold space without holding everything.",
   "Saying no to them can be saying yes to me."
  ],
  "prompts": [
   "Who do you pour into, and who pours back into you?",
   "What does a truly restful day look like for you?",
   "What are you carrying that isn’t yours?"
  ],
  "oracle": [
   "IX",
   "The Moon",
   "refill before you pour."
  ],
  "page": [
   "Off the clock",
   "15-page-for-doing-nothing"
  ]
 },
 "CM": {
  "name": "The Changemaker",
  "north": "leave every room better than you found it.",
  "angel": "999",
  "angelWord": "purpose",
  "color": "#EFD3CF",
  "ground": "#EFD3CF",
  "drink": "nimbu soda",
  "bag": "jute tote with a pin or two",
  "outfit": "denim, white kurta, jhumkas",
  "song": [
   "Freedom",
   "Beyoncé"
  ],
  "who": "You can’t walk past something unfair and leave it. You don’t wait for permission, you just start fixing.",
  "affs": [
   "I don’t need permission to make things better.",
   "Small fixes still change lives.",
   "My anger is information, and I use it well."
  ],
  "prompts": [
   "What would you fix first if you were in charge for a day?",
   "Who is already doing the work you admire, and how can you join them?",
   "What’s one small thing you can change this week?"
  ],
  "oracle": [
   "VII",
   "The Torch",
   "your fire lights others."
  ],
  "page": [
   "Calling in",
   "06-calling-in-january"
  ]
 },
 "EX": {
  "name": "The Explorer",
  "north": "say yes to the life that scares you a little.",
  "angel": "777",
  "angelWord": "luck and alignment",
  "color": "#E2E9EF",
  "ground": "#E2E9EF",
  "drink": "coconut water",
  "bag": "crossbody bag",
  "outfit": "sundress, sneakers, sunglasses",
  "song": [
   "Good as Hell",
   "Lizzo"
  ],
  "who": "Your best ideas come in a new city at 7 am. Comfort zones are for visiting, not living in.",
  "affs": [
   "I’m allowed to change my mind and my city.",
   "The leap is part of the plan.",
   "I collect experiences, not regrets."
  ],
  "prompts": [
   "Where would you go if fear wasn’t packing your bag?",
   "What’s on your 27-for-2027 list that scares you a little?",
   "What did you say yes to this year that changed you?"
  ],
  "oracle": [
   "V",
   "The Wings",
   "the leap is the lesson."
  ],
  "page": [
   "27 for 2027",
   "03-four-goals"
  ]
 }
};
var L = {
 "FO": [
  "i knew you were The Founder the moment you said “just one more idea.” you have been building in your head for years, and 2027 is the year it finally gets a name, a first customer and a gloriously messy first version.",
  "don’t wait to feel ready. nobody who built anything ever did. be the boss and stay soft, be ambitious and stay kind, and when it gets lonely, call someone who believes in you. i’m one of them.",
  "may your 888 year bring more abundance than you planned for, and may the key you’re carrying open the door you’ve been circling."
 ],
 "ST": [
  "you see the whole board while everyone else is staring at one move. that is a rare thing, {name}, and this year i want you to trust it a little more.",
  "you don’t have to rush to win. the long game is your game, and every quiet decision you make in 2027 is going to stack into something people will call luck. we both know it was a plan.",
  "may your calendar be kind, your coffee be black and your 111 new beginning start with a very small, very smart first step."
 ],
 "CD": [
  "you notice the font, the light and the exact shade of beige. please never let anyone tell you that’s frivolous. your taste is not a hobby, {name}, it is your edge.",
  "this year, make the beautiful thing on purpose. charge for it, sign it, put it where people can see it. the world is genuinely prettier when you’re in it.",
  "may 333 bring you creative growth in every direction, and may your eye keep being the best gift you give."
 ],
 "SY": [
  "you say what everyone was feeling and couldn’t word. that is a kind of magic, {name}, and 2027 needs more of it from you.",
  "write it before it’s perfect. post it before you’re ready. someone out there is waiting for exactly the sentence you’re scared to say, and they will remember how it made them feel long after they forget the words.",
  "may 555 bring big change, may your chai stay hot, and may your voice take up every inch of the room it deserves."
 ],
 "AW": [
  "you learn like it’s a sport and then help everyone else catch up. brilliant and never smug about it. do you know how rare that is, {name}?",
  "this year, let rest be part of the plan. you are sharper after a good night’s sleep than after a fourth all-nighter, i promise. you don’t have to prove anything to anyone, you’re allowed to just be curious.",
  "may 222 remind you to trust the process, may your cold brew be cold and your notes be colour-coded, and may you be both brilliant and kind, all year long."
 ],
 "HE": [
  "you’re the calm in every group chat, the one who remembers the birthday and the bad day. this year, {name}, it is your turn to be looked after too.",
  "rest is not a break from your plan. it is the plan. you can hold space without holding everything, and saying no to them can be the loudest yes to yourself.",
  "may 444 wrap you in protection, may there always be chamomile and honey within reach, and may you grow without burning out, with all of us growing right alongside you."
 ],
 "CM": [
  "you can’t walk past something unfair and leave it. i love that about you, {name}, and i want you to know it counts, even the small fixes. especially the small fixes.",
  "you don’t need permission. you never did. start the thing, call in the people, build the table you want a seat at. your anger is information and you use it beautifully.",
  "may 999 bring you purpose, may your nimbu soda be extra fizzy, and may every room you leave be better than you found it."
 ],
 "EX": [
  "your best ideas come in a new city at 7 am, and your boldest ones come right after you’ve said yes to something that scares you a little. keep doing that, {name}.",
  "you’re allowed to change your mind, your plans and your postcode. comfort zones are for visiting. the leap is part of the plan, and i can’t wait to see where it lands you.",
  "may 777 bring luck and perfect alignment, may your coconut water always be cold, and may 2027 be the year you collect experiences instead of regrets."
 ]
};

/* Email templates. Pure functions: run in Google Apps Script and in node (for previews).
   Needs C (archetype content), L (letters) in scope. Images are hosted PNG/JPG under BASE. */
function emEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

var EM = {
  ink: '#1D1A18', soft: '#3A3530', cream: '#FBF5EC', card: '#FFFDF9', gold: '#B08A4E', blush: '#F1D7D3', border: '#E3C9C4',
  serif: "'Newsreader', Georgia, 'Times New Roman', serif",
  sans: "'Poppins', 'Helvetica Neue', Arial, sans-serif"
};

function emLabel(t, color, align) {
  return '<div style="font-family:' + EM.sans + ';font-size:10px;line-height:14px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:' + (color || EM.soft) + ';text-align:' + (align || 'center') + ';">' + emEsc(t) + '</div>';
}
function emShell(inner, preheader, bg) {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>Chillchai</title></head>' +
    '<body style="margin:0;padding:0;background:' + (bg || EM.cream) + ';">' +
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">' + emEsc(preheader || '') + '&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + (bg || EM.cream) + ';"><tr><td align="center" style="padding:24px 12px;">' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">' + inner + '</table>' +
    '</td></tr></table></body></html>';
}
function emRow(html, pad, bg, extra) {
  return '<tr><td align="center" style="padding:' + (pad || '0') + ';' + (bg ? 'background:' + bg + ';' : '') + (extra || '') + '">' + html + '</td></tr>';
}
function emBtn(href, text, dark) {
  var bg = dark ? EM.gold : EM.ink, fg = dark ? EM.ink : EM.cream;
  return '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td align="center" style="background:' + bg + ';border-radius:999px;"><a href="' + href + '" style="display:inline-block;padding:16px 38px;font-family:' + EM.serif + ';font-style:italic;font-size:19px;color:' + fg + ';text-decoration:none;border-radius:999px;">' + emEsc(text) + '</a></td></tr></table>';
}
function emSignature() {
  return '<div style="font-family:' + EM.serif + ';font-style:italic;font-size:19px;line-height:26px;color:' + EM.ink + ';">brewed with love,<br><span style="font-size:26px;">avishi</span></div>';
}

/* d: {name, email, archetype, rising}; returns {subject, html, text} */
function buildQuizEmail(d, BASE) {
  var code = d.archetype, c = C[code];
  var name = (d.name || '').trim() || 'you';
  var kit = 'https://www.chillchai.in/planner/#/result/' + code;
  var wl = 'https://www.chillchai.in/planner/#/waitlist?ref=email';
  var rising = d.rising && C[d.rising] ? C[d.rising].name : '';
  var img = function (f, w, alt, extra) { return '<img src="' + BASE + f + '" width="' + w + '" alt="' + emEsc(alt || '') + '" style="display:block;width:' + w + 'px;max-width:100%;height:auto;border:0;' + (extra || '') + '">'; };
  var h = '';

  /* header + hero */
  h += emRow('<div style="padding:6px 0 18px;">' + emLabel('Chillchai · 2027', EM.gold) + '<div style="font-family:' + EM.serif + ';font-style:italic;font-size:17px;color:' + EM.soft + ';margin-top:6px;">girls who get sh✦t done</div></div>');
  h += emRow(img('hero-' + code + '.jpg', 600, c.name + ' illustration', 'border-radius:24px 24px 0 0;'), '0');
  h += emRow(
    '<div style="padding:34px 28px 8px;">' + emLabel('Your 2027 north star', EM.soft) +
    '<div style="font-family:' + EM.serif + ';font-style:italic;font-weight:300;font-size:22px;line-height:28px;color:' + EM.ink + ';margin-top:16px;">' + emEsc(name) + ', you’re</div>' +
    '<div style="font-family:' + EM.serif + ';font-style:italic;font-weight:400;font-size:46px;line-height:48px;color:' + EM.ink + ';margin:4px 0 14px;">' + emEsc(c.name) + '</div>' +
    (rising ? '<div style="font-family:' + EM.serif + ';font-style:italic;font-size:17px;color:' + EM.soft + ';margin-bottom:12px;">rising: ' + emEsc(rising) + '</div>' : '') +
    '<div style="font-family:' + EM.serif + ';font-size:19px;line-height:26px;color:' + EM.ink + ';max-width:460px;margin:0 auto;">' + emEsc(c.who) + '</div></div>',
    '0', EM.card, 'border-left:1px solid ' + EM.border + ';border-right:1px solid ' + EM.border + ';');

  /* angel number */
  h += emRow('<div style="padding:26px 20px 10px;">' + emLabel('Your angel number', EM.gold) + '<div style="margin-top:12px;">' + img('angel-' + code + '.png', 340, 'Angel number ' + c.angel, 'margin:0 auto;') + '</div>' +
    '<div style="font-family:' + EM.serif + ';font-style:italic;font-weight:300;font-size:32px;line-height:36px;color:' + EM.ink + ';margin-top:6px;">' + emEsc(c.angelWord) + '.</div>' +
    '<div style="font-family:' + EM.serif + ';font-size:17px;line-height:24px;color:' + EM.soft + ';margin-top:8px;">you’ll start seeing ' + c.angel + ' everywhere this year. consider it a wink from 2027.</div></div>',
    '0', EM.card, 'border-left:1px solid ' + EM.border + ';border-right:1px solid ' + EM.border + ';');

  /* north star */
  h += emRow('<div style="padding:44px 30px;">' + emLabel('Your north star', EM.gold) + '<div style="font-family:' + EM.serif + ';font-style:italic;font-weight:300;font-size:36px;line-height:40px;color:' + EM.cream + ';margin-top:16px;">' + emEsc(c.north) + '</div><div style="color:' + EM.gold + ';font-size:22px;margin-top:16px;">✦ &nbsp; ✦ &nbsp; ✦</div></div>', '0', EM.ink);

  /* affirmations */
  h += emRow('<div style="padding:34px 26px 26px;">' + emLabel('Say it out loud', EM.soft) +
    c.affs.map(function (a) { return '<div style="font-family:' + EM.serif + ';font-style:italic;font-weight:300;font-size:25px;line-height:30px;color:' + EM.ink + ';margin-top:18px;">' + emEsc(a) + '</div>'; }).join('') + '</div>', '0', c.ground);

  /* kit tiles */
  var tile = function (file, lab, title, sub) {
    return '<td width="50%" valign="top" align="center" style="padding:10px 8px;">' + img(file, 200, title, 'margin:0 auto;') + '<div style="margin-top:8px;">' + emLabel(lab, EM.gold) + '</div>' +
      '<div style="font-family:' + EM.serif + ';font-style:italic;font-size:21px;line-height:25px;color:' + EM.ink + ';margin-top:6px;">' + emEsc(title) + '</div>' + (sub ? '<div style="font-family:' + EM.serif + ';font-size:15px;line-height:20px;color:' + EM.soft + ';margin-top:4px;">' + emEsc(sub) + '</div>' : '') + '</td>';
  };
  h += emRow('<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td colspan="2" align="center" style="padding:30px 0 8px;">' + emLabel('The rest of your kit', EM.soft) + '</td></tr>' +
    '<tr>' + tile('drink-' + code + '.png', 'Drink of the year', c.drink, '') + tile('bag-' + code + '.png', 'Her bag', c.bag, 'outfit vibe: ' + c.outfit) + '</tr>' +
    '<tr>' + tile('vinyl-' + code + '.png', 'Her song', c.song[0], c.song[1]) + tile('oracle-' + code + '.png', 'Oracle card', c.oracle[0] + ' · ' + c.oracle[1], c.oracle[2]) + '</tr></table>',
    '10px 14px 26px', EM.card, 'border-left:1px solid ' + EM.border + ';border-right:1px solid ' + EM.border + ';');

  /* letter */
  var paras = L[code].map(function (t) { return '<p style="margin:0 0 16px;">' + emEsc(t.replace(/\{name\}/g, name)) + '</p>'; }).join('');
  h += emRow('<div style="padding:34px 18px;">' + emLabel('A letter, just for you', EM.gold) +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;"><tr><td style="background:#FFFFFF;border:1px solid ' + EM.gold + ';border-radius:6px;padding:30px 28px;text-align:left;font-family:' + EM.serif + ';font-style:italic;font-size:18px;line-height:26px;color:' + EM.ink + ';">' +
    '<p style="margin:0 0 16px;font-size:24px;font-weight:300;">dear ' + emEsc(name) + ',</p>' + paras +
    '<p style="margin:22px 0 18px;">happy new year. i’ll be cheering for you every step of the way.</p>' + emSignature() + '</td></tr></table></div>', '0', EM.blush);

  /* planner sneak peek */
  h += emRow('<div style="padding:42px 22px 40px;">' + emLabel('Sneak peek', EM.gold) +
    '<div style="font-family:' + EM.serif + ';font-style:italic;font-weight:300;font-size:32px;line-height:36px;color:' + EM.cream + ';margin:14px 0 22px;">your archetype has a whole year planned for her.</div>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="padding:0 7px;">' + img('cover.jpg', 200, 'girls who get sh*t done: the 2027 planner', 'border:1px solid ' + EM.gold + ';border-radius:6px;') + '</td><td style="padding:0 7px;">' + img('page-' + code + '.jpg', 200, c.page[0], 'border:1px solid ' + EM.gold + ';border-radius:6px;') + '</td></tr></table>' +
    '<div style="font-family:' + EM.serif + ';font-style:italic;font-size:17px;line-height:24px;color:' + EM.cream + ';margin:18px 0 24px;">' + emEsc(c.name) + '’s favourite spread: <span style="color:' + EM.gold + ';">' + emEsc(c.page[0]) + '</span></div>' +
    emBtn(wl, 'join the waitlist', true) +
    '<div style="font-family:' + EM.serif + ';font-style:italic;font-size:15px;color:#d9cfc2;margin-top:14px;">be first in line when it drops, with early access before anyone else.</div></div>', '0', EM.ink);

  /* footer */
  h += emRow('<div style="padding:30px 20px 8px;">' + emBtn(kit, 'open my full kit') + '<div style="font-family:' + EM.serif + ';font-style:italic;font-size:16px;line-height:23px;color:' + EM.soft + ';margin-top:22px;">know someone who gets sh✦t done? send her the link:<br><a href="https://www.chillchai.in/planner/" style="color:' + EM.ink + ';">chillchai.in/planner</a></div>' +
    '<div style="margin-top:26px;">' + img('logo.png', 46, 'Chillchai', 'margin:0 auto;') + '</div>' +
    '<div style="font-family:' + EM.sans + ';font-size:10px;line-height:16px;letter-spacing:2px;text-transform:uppercase;color:#8A847E;margin-top:12px;">chillchai.in</div>' +
    '<div style="font-family:' + EM.serif + ';font-style:italic;font-size:13px;line-height:19px;color:#8A847E;margin-top:12px;">you’re getting this because you played the North Star game. reply to this email any time, and if you’d rather not hear from us, just say so and we’ll take you off the list.</div></div>');

  var text = name + ', you’re ' + c.name + '.\n\n' + c.who + '\n\nangel number: ' + c.angel + ' (' + c.angelWord + ')\nyour north star: ' + c.north + '\n\naffirmations:\n- ' + c.affs.join('\n- ') +
    '\n\ndrink: ' + c.drink + '\nbag: ' + c.bag + '\nsong: ' + c.song[0] + ' by ' + c.song[1] + '\noracle card: ' + c.oracle[1] + ': ' + c.oracle[2] + '\n\n' +
    'dear ' + name + ',\n\n' + L[code].map(function (t) { return t.replace(/\{name\}/g, name); }).join('\n\n') + '\n\nhappy new year. i’ll be cheering for you every step of the way.\n\nbrewed with love,\navishi\n\nyour full kit: ' + kit + '\njoin the planner waitlist: ' + wl + '\n';
  return { subject: name + ', you’re ' + c.name + ' ✦ your 2027 north star kit', html: emShell(h, 'your result, your affirmations and a little letter from me.'), text: text };
}

function buildWaitlistEmail(d) {
  var name = (d.name || '').trim() || 'you';
  var BASE = 'https://www.chillchai.in/planner/email/';
  var c = d.archetype && C[d.archetype] ? C[d.archetype] : null;
  var h = '';
  h += emRow('<div style="padding:6px 0 18px;">' + emLabel('Chillchai · 2027', EM.gold) + '</div>');
  h += emRow('<div style="padding:40px 28px 36px;"><img src="' + BASE + 'kiss.png" width="72" alt="" style="display:block;margin:0 auto 18px;border:0;">' +
    emLabel('The 2027 planner', EM.gold) +
    '<div style="font-family:' + EM.serif + ';font-style:italic;font-weight:300;font-size:40px;line-height:44px;color:' + EM.ink + ';margin:14px 0 14px;">you’re in, ' + emEsc(name) + '.</div>' +
    '<div style="font-family:' + EM.serif + ';font-size:19px;line-height:27px;color:' + EM.ink + ';max-width:440px;margin:0 auto;">you’re on the waitlist for <i>girls who get sh✦t done: the 2027 planner</i>. we’ll tell you the second it’s live, with early access before anyone else.</div>' +
    (c ? '<div style="font-family:' + EM.serif + ';font-style:italic;font-size:18px;color:' + EM.soft + ';margin-top:16px;">a little sneak peek: ' + emEsc(c.name) + '’s favourite spread is “' + emEsc(c.page[0]) + '”.</div>' : '') +
    '<div style="margin-top:26px;">' + emBtn('https://www.chillchai.in/planner/', c ? 'find your archetype' : 'find your 2027 archetype') + '</div>' +
    '<div style="margin-top:28px;">' + emSignature() + '</div></div>', '0', EM.card, 'border:1px solid ' + EM.border + ';border-radius:24px;');
  h += emRow('<div style="padding:22px 20px;font-family:' + EM.serif + ';font-style:italic;font-size:13px;line-height:19px;color:#8A847E;">you’re getting this because you joined the Chillchai planner waitlist. reply any time, and if you’d rather not hear from us, just say so.</div>');
  var text = 'you’re in, ' + name + '.\n\nyou’re on the waitlist for girls who get sh*t done: the 2027 planner. we’ll tell you the second it’s live, with early access before anyone else.\n\nbrewed with love,\navishi\n';
  return { subject: 'you’re on the list, ' + name + ' ✦', html: emShell(h, 'we’ll tell you the second the planner is live.'), text: text };
}


function sheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(TAB) || ss.insertSheet(TAB);
  if (sh.getLastRow() === 0) sh.appendRow(COLS);
  return sh;
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* run this once from the editor to grant permissions */
function authorize() {
  sheet_();
  Logger.log('quota left today: ' + MailApp.getRemainingDailyQuota());
}
/* run this to send yourself a sample of the email: set the archetype code, e.g. 'CD' */
function testEmail() {
  var me = Session.getActiveUser().getEmail();
  send_({ type: 'quiz', name: 'Test', email: me, archetype: 'CD', rising: 'SY' });
}

function send_(d) {
  if (MailApp.getRemainingDailyQuota() < 2) return 'no: daily email quota used up';
  var m = d.type === 'quiz' && C[d.archetype] ? buildQuizEmail(d, BASE) : (d.type === 'waitlist' ? buildWaitlistEmail(d) : null);
  if (!m) return 'n/a';
  MailApp.sendEmail({ to: d.email, cc: CC, replyTo: CC, name: FROM_NAME, subject: m.subject, htmlBody: m.html, body: m.text });
  return 'yes';
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = JSON.parse(e.postData.contents);
    var type = d.type === 'letter' ? 'letter' : d.type === 'quiz' ? 'quiz' : 'waitlist';
    d.type = type;
    var email = String(d.email || '').toLowerCase().trim();
    if (!email || email.indexOf('@') < 1) return json_({ ok: false, error: 'bad email' });
    d.email = email;
    if (type === 'quiz' && !C[d.archetype]) return json_({ ok: false, error: 'bad archetype' });
    var sh = sheet_();
    if (type !== 'quiz') {
      var rows = sh.getDataRange().getValues();
      var iT = COLS.indexOf('type'), iE = COLS.indexOf('email');
      for (var r = 1; r < rows.length; r++) {
        if (rows[r][iT] === type && String(rows[r][iE]).toLowerCase() === email) return json_({ ok: true, dup: true });
      }
    }
    var sent = '';
    try { sent = send_(d); } catch (err) { sent = 'no: ' + String(err).slice(0, 120); }
    d.timestamp = d.ts || new Date().toISOString();
    d.email_sent = sent;
    sh.appendRow(COLS.map(function (c) { return d[c] === undefined ? '' : d[c]; }));
    return json_({ ok: true, dup: false, emailed: sent === 'yes' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'list') {
    if (p.key !== ADMIN_PASSCODE) return json_({ ok: false, error: 'passcode' });
    var rows = sheet_().getDataRange().getValues();
    var head = rows.shift();
    return json_({ ok: true, rows: rows.map(function (r) { var o = {}; head.forEach(function (h, i) { o[h] = r[i]; }); return o; }) });
  }
  return json_({ ok: true });
}

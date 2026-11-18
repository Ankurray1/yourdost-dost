/* YourDOST app prototype (Q2: built from scratch). Vanilla JS, no build step.
   Sections: Home · Experts · Dost (centre) · Grow · Me. Fictional people and data.
   Dost talks to the live "dost" edge function from Task 3; if it can't be reached, the same check-in runs on local rules. */
(() => {
'use strict';
const DOST_API = 'https://zzkppvuedkkcdocmisje.supabase.co/functions/v1/dost';
const $app = document.getElementById('app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* ---------------- icons (line, 1.75 stroke) ---------------- */
const P = {
  home: '<path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z"/>',
  experts: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.8-3 3-4.6 5.5-4.6s4.7 1.6 5.5 4.6"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.6c2.3.2 4 1.6 4.8 4.4"/>',
  mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/>',
  grow: '<path d="M12 20v-7"/><path d="M12 13c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5z"/><path d="M12 15c0-3.2-2.4-5.2-6-5.2 0 3.2 2.4 5.2 6 5.2z"/>',
  me: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1-3.6 3.8-5.5 7-5.5s6 1.9 7 5.5"/>',
  back: '<path d="M15 5l-7 7 7 7"/>', chev: '<path d="M9 5l7 7-7 7"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>',
  send: '<path d="M5 12h14M13 6l6 6-6 6"/>', play: '<path d="M8 5l11 7-11 7z"/>', check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>', chat: '<path d="M5 18.5V6.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9z"/>',
  cal: '<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
  video: '<rect x="3.5" y="6.5" width="12" height="11" rx="2.5"/><path d="M15.5 10.5l5-3v9l-5-3"/>',
  sort: '<path d="M4 7h16M7 12h10M10 17h4"/>', filter: '<path d="M4 6h10M18 6h2M4 18h4M12 18h8"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="18" r="2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/>',
  moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>', globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>',
  book: '<path d="M5 4.5h9a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h9"/>', pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  people: '<circle cx="8" cy="9" r="3"/><circle cx="16.5" cy="9" r="3"/><path d="M2.5 19c.7-3 2.8-4.5 5.5-4.5s4.8 1.5 5.5 4.5M13.5 15c.9-.4 1.9-.6 3-.6 2.7 0 4.8 1.5 5.5 4.6"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
  shield: '<path d="M12 3.5l7 3v5.5c0 4.2-3 7.4-7 8.5-4-1.1-7-4.3-7-8.5V6.5z"/><path d="M9 12l2 2 4-4"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M4 13h16M12 9v11M12 9c-2.5 0-4.5-1-4.5-3S10 3.5 12 9c2-5.5 4.5-5 4.5-3s-2 3-4.5 3"/>',
};
const ic = (n, x = '') => `<svg class="i ${x}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

/* ---------------- catalogue ---------------- */
const CONCERNS = [['work', 'Work stress'], ['sleep', 'Sleep'], ['low', 'Feeling low'], ['anx', 'Anxiety'], ['rel', 'Relationships'], ['lonely', 'Loneliness'], ['career', 'Career'], ['explore', 'Just exploring']];
const CL = Object.fromEntries(CONCERNS);
const EX = {
  ex_box: { name: 'Box breathing', mins: 4, kind: 'breath', tint: 'sage', why: 'Slows your heart rate when stress spikes.', pattern: [['Breathe in', 4], ['Hold', 4], ['Breathe out', 4], ['Hold', 4]], cycles: 4 },
  ex_478: { name: '4-7-8 wind-down', mins: 5, kind: 'breath', tint: 'violet', why: 'A longer out-breath tells your body it\'s time to rest.', pattern: [['Breathe in', 4], ['Hold', 7], ['Breathe out', 8]], cycles: 4 },
  ex_ground: { name: '5-4-3-2-1 grounding', mins: 3, kind: 'steps', tint: 'peach', why: 'Brings you back to now when your mind races.', steps: ['Name 5 things you can see.', 'Notice 4 things you can feel, like your feet on the floor.', 'Listen for 3 sounds, near or far.', 'Find 2 things you can smell.', 'Notice 1 thing you can taste, or take a sip of water.', 'One slow breath. You\'re here, right now.'] },
  ex_body: { name: 'Body scan for sleep', mins: 8, kind: 'steps', tint: 'violet', why: 'Lets go of tension you didn\'t know you were holding.', steps: ['Lie down or sit back. Let your eyes close if that feels okay.', 'Notice your feet and legs. Let them feel heavy.', 'Move to your stomach and chest. Let each breath slow.', 'Let your shoulders drop away from your ears.', 'Soften your jaw and the space between your eyes.', 'Stay here for a few breaths. Nothing to do.'] },
  ex_good: { name: 'Three good things', mins: 3, kind: 'journal', tint: 'sun', why: 'Noticing small good moments slowly lifts mood.', prompts: ['One good thing from today, however small', 'Why did it happen?', 'One more good thing'] },
  ex_worry: { name: 'Worry time', mins: 5, kind: 'journal', tint: 'peach', why: 'A worry on paper is smaller than a worry in your head.', prompts: ['What\'s the worry, in one line?', 'Is it in your control: yes, partly or no?', 'One small thing you can do about it this week'] },
  ex_reach: { name: 'One small message', mins: 2, kind: 'journal', tint: 'sun', why: 'Connection grows from small, easy steps.', prompts: ['Who is one person you\'d like to feel closer to?', 'Write a short, easy message. You don\'t have to send it.'] },
};
const PG = {
  pg_calm: { name: 'Calm at Work', helps: ['work', 'career'], blurb: 'Small habits to switch off after work', days: ['ex_box', 'ex_worry', 'ex_box', 'ex_body', 'ex_worry', 'ex_good', 'ex_box'] },
  pg_sleep: { name: 'Sleep Reset', helps: ['sleep'], blurb: 'A wind-down routine for calmer nights', days: ['ex_478', 'ex_body', 'ex_worry', 'ex_478', 'ex_box', 'ex_body', 'ex_478'] },
  pg_lift: { name: 'Lift', helps: ['low'], blurb: 'Gentle steps to lift a low mood', days: ['ex_good', 'ex_box', 'ex_reach', 'ex_worry', 'ex_good', 'ex_good', 'ex_good'] },
  pg_worry: { name: 'Untangle Worry', helps: ['anx'], blurb: 'Tools to quiet a racing mind', days: ['ex_worry', 'ex_ground', 'ex_box', 'ex_worry', 'ex_worry', 'ex_ground', 'ex_box'] },
  pg_connect: { name: 'Better Connections', helps: ['rel', 'lonely'], blurb: 'Feel closer to the people who matter', days: ['ex_reach', 'ex_reach', 'ex_box', 'ex_worry', 'ex_ground', 'ex_good', 'ex_reach'] },
};
const EX_FOR = { work: 'ex_box', career: 'ex_worry', sleep: 'ex_478', low: 'ex_good', anx: 'ex_ground', rel: 'ex_reach', lonely: 'ex_reach', family: 'ex_reach', exams: 'ex_ground' };
const PG_FOR = { work: 'pg_calm', career: 'pg_calm', sleep: 'pg_sleep', low: 'pg_lift', anx: 'pg_worry', exams: 'pg_worry', rel: 'pg_connect', lonely: 'pg_connect', family: 'pg_connect' };
const FREQ = ['Not at all', 'Some days', 'Most days', 'Nearly every day'];
const CHECKS = {
  wellbeing: { name: 'Wellbeing check', mins: 1, qs: ['Little interest or joy in doing things?', 'Feeling down, low or hopeless?', 'Feeling nervous, anxious or on edge?', 'Not being able to stop worrying?'], bands: [[2, 'You seem to be doing okay', 'low'], [5, 'Some stress', 'work'], [8, 'A fair amount of stress', 'anx'], [12, 'A lot to carry right now', 'low']] },
  sleep: { name: 'Sleep check', mins: 1, qs: ['Trouble falling asleep?', 'Waking up in the night?', 'Feeling tired during the day?', 'Worrying about your sleep?'], bands: [[3, 'Your sleep seems okay', 'sleep'], [7, 'Some sleep trouble', 'sleep'], [12, 'Sleep is really hard right now', 'sleep']] },
  burnout: { name: 'Burnout check', mins: 1, qs: ['Feeling drained after work?', 'Finding it hard to switch off?', 'Feeling distant about work?', 'Dreading the start of the week?'], bands: [[3, 'Low burnout signs', 'work'], [7, 'Some burnout signs', 'work'], [12, 'Strong burnout signs', 'work']] },
};
const TINTS = ['violet', 'sun', 'peach', 'sage'];
const EXPERTS = [
  { id: 'e1', name: 'Neha Kapoor', title: 'Counselling psychologist', yrs: 9, rating: 4.9, n: 312, langs: ['English', 'Hindi'], focus: ['work', 'sleep', 'anx'], style: 'Practical tips and small weekly goals', gender: 'Woman', modes: ['Video', 'Chat'], today: '6 pm', about: 'Helps working professionals untangle stress and get their evenings back, with small changes that fit a busy week.' },
  { id: 'e2', name: 'Aditya Rao', title: 'Clinical psychologist', yrs: 12, rating: 4.8, n: 198, langs: ['English', 'Tamil'], focus: ['anx', 'rel', 'low'], style: 'Calm, structured, CBT-based', gender: 'Man', modes: ['Video', 'Call'], today: null, about: 'Works with anxiety and relationship worries using CBT, at a calm pace you set.' },
  { id: 'e3', name: 'Farah Siddiqui', title: 'Counsellor', yrs: 6, rating: 4.9, n: 241, langs: ['English', 'Hindi', 'Urdu'], focus: ['low', 'lonely', 'rel'], style: 'Warm listener, space to talk', gender: 'Woman', modes: ['Chat', 'Call'], today: '8 pm', about: 'Gives you room to talk it through first, then gently helps you find your next step.' },
  { id: 'e4', name: 'Rohan Mehta', title: 'Counselling psychologist', yrs: 8, rating: 4.7, n: 156, langs: ['English', 'Hindi', 'Marathi'], focus: ['career', 'work', 'anx'], style: 'Direct and goal-focused', gender: 'Man', modes: ['Video', 'Chat'], today: '7:30 pm', about: 'Helps with career crossroads, performance pressure and burnout, with clear goals.' },
  { id: 'e5', name: 'Priya Iyer', title: 'Clinical psychologist', yrs: 14, rating: 5.0, n: 402, langs: ['English', 'Tamil', 'Malayalam'], focus: ['sleep', 'low', 'anx'], style: 'Gentle, mindfulness-based', gender: 'Woman', modes: ['Video'], today: null, about: 'Brings mindfulness and sleep science together for people who feel worn out.' },
  { id: 'e6', name: 'Kabir Singh', title: 'Counsellor', yrs: 5, rating: 4.8, n: 133, langs: ['English', 'Hindi', 'Punjabi'], focus: ['rel', 'lonely', 'work'], style: 'Friendly, follows your lead', gender: 'Man', modes: ['Chat', 'Call', 'Video'], today: '9 pm', about: 'Easy to talk to; good for a first session if you\'ve never spoken to anyone before.' },
];
const EXM = Object.fromEntries(EXPERTS.map((e, i) => [e.id, { ...e, tint: TINTS[i % 4] }]));
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function slotsFor(e) {
  const out = [], base = new Date(); const times = ['10 am', '1 pm', '6 pm', '7:30 pm', '9 pm'];
  for (let d = 0; d < 4; d++) {
    const dt = new Date(base); dt.setDate(base.getDate() + d);
    const day = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : DAYS[dt.getDay()] + ' ' + dt.getDate();
    const t = d === 0 ? (e.today ? [e.today] : []) : times.filter((_, i) => (i + d + e.id.charCodeAt(1)) % 2 === 0);
    if (t.length) out.push([day, t]);
  }
  return out;
}

/* ---------------- state (kept in this browser only) ---------------- */
const KEY = 'yd-app-v1';
const fresh = () => ({
  onboarded: false, ob: 0, name: 'Riya', email: 'riya.sharma@acme.com', company: 'Acme Corp', concerns: [], lang: 'English',
  view: 'home', params: {}, stack: [], tab: 'home', theme: 'light',
  moodToday: null, moodWeek: [2, 3, 1, 3, 2, 3], leaves: 3, wins: ['Did box breathing on Monday', 'Wrote three good things', 'Slept before 11 pm on Tuesday'],
  plan: null, booked: null, sessionsLeft: 6, favs: ['e1'], seg: 'for', sort: 'match',
  filt: { lang: [], mode: [], gender: [], today: false }, pg: { pg_calm: 3 }, doneToday: {}, journal: [], shareSummary: true, memory: true,
});
let S;
try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = fresh(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
let SHEET = null, TOAST = null, X = {}; // transient: open sheet, toast, screen-local state

/* ---------------- matching (Task 2, simplified) ---------------- */
function matches() {
  const want = S.concerns.filter(c => c !== 'explore');
  const lang = S.lang === 'हिंदी' ? 'Hindi' : 'English';
  return EXPERTS.map(e => {
    const overlap = want.filter(c => e.focus.includes(c));
    const score = overlap.length * 3 + (e.focus.indexOf(want[0]) === 0 ? 2 : 0) + (e.langs.includes(lang) ? 1 : 0) + (e.today ? 1 : 0) + e.rating / 5;
    const why = [];
    if (overlap.length) why.push(`Helps with ${overlap.map(c => CL[c].toLowerCase()).join(' and ')}`);
    why.push(`Speaks ${e.langs.slice(0, 2).join(' and ')}`);
    why.push(e.today ? `Free today at ${e.today}` : 'Free tomorrow');
    return { e: EXM[e.id], score, why };
  }).sort((a, b) => b.score - a.score);
}

/* ---------------- navigation ---------------- */
const TABS = ['home', 'experts', 'grow', 'me'];
function go(view, params = {}, push = true) {
  if (push && S.view !== view) S.stack.push([S.view, S.params]);
  if (TABS.includes(view)) { S.stack = []; S.tab = view; }
  S.view = view; S.params = params; X = {}; SHEET = null;
  save(); render(); const sc = $app.querySelector('.screen'); if (sc) sc.scrollTop = 0;
}
function back() { const p = S.stack.pop(); if (p) { S.view = p[0]; S.params = p[1]; X = {}; save(); render(); } else go(S.tab || 'home'); }
function toast(t) { TOAST = t; render(); clearTimeout(toast._t); toast._t = setTimeout(() => { TOAST = null; render(); }, 2600); }
function sheet(name, p = {}) { SHEET = { name, ...p }; render(); }

/* ---------------- shared pieces ---------------- */
const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
const top = (title, right = '') => `<div class="top"><button class="iconbtn" data-a="back" aria-label="Back">${ic('back')}</button><h1 class="t2">${esc(title)}</h1>${right}</div>`;
function tabbar() {
  const t = (k, label) => `<button class="tab" data-a="tab" data-v="${k}" ${S.tab === k ? 'aria-current="page"' : ''}>${ic(k)}${label}</button>`;
  return `<nav class="tabbar" aria-label="Main">${t('home', 'Home')}${t('experts', 'Experts')}<button class="orbbtn" data-a="dost" aria-label="Talk to Dost">${ic('mic')}</button>${t('grow', 'Grow')}${t('me', 'Me')}</nav>`;
}
function person(e, big) {
  const c = { violet: 'var(--violet-400)', sun: 'var(--peach-400)', peach: 'var(--peach-400)', sage: 'var(--sage-600)' }[e.tint];
  const ini = e.name.split(' ').map(w => w[0]).join('');
  return `<svg class="who" viewBox="0 0 100 110" aria-hidden="true"><circle cx="50" cy="40" r="21" fill="${c}" opacity=".6"/><path d="M12 110c4-27 19-41 38-41s34 14 38 41z" fill="${c}" opacity=".6"/></svg>`;
}
function garden(n, w = 300) {
  const max = 7, plants = [];
  for (let i = 0; i < max; i++) {
    const x = 26 + i * 41, on = i < n, bloom = on && i % 3 === 2;
    plants.push(on
      ? `<path d="M${x} 92V${66 - (i % 2) * 8}" stroke="var(--sage-600)" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M${x} ${76 - (i % 2) * 6}c0-9 7-14 15-14 0 9-7 14-15 14z" fill="var(--sage-600)"/><path d="M${x} ${82 - (i % 2) * 4}c0-7-5-11-12-11 0 7 5 11 12 11z" fill="var(--sage-600)" opacity=".75"/>${bloom ? `<circle cx="${x}" cy="${62 - (i % 2) * 8}" r="8" fill="var(--sun-400)"/><circle cx="${x}" cy="${62 - (i % 2) * 8}" r="3" fill="var(--peach-400)"/>` : ''}`
      : `<circle cx="${x}" cy="88" r="3" fill="var(--ink-soft)" opacity=".5"/>`);
  }
  return `<svg viewBox="0 40 300 70" width="100%" style="max-width:${w}px" role="img" aria-label="Your garden: ${n} of 7 plants this week"><rect x="6" y="92" width="288" height="14" rx="7" fill="var(--sun-200)"/>${plants.join('')}</svg>`;
}
function actArt(id) {
  const x = EX[id];
  const glyph = { breath: '<circle cx="48" cy="48" r="30" fill="none" stroke="var(--sage-600)" stroke-width="3" opacity=".4"/><circle cx="48" cy="48" r="18" fill="var(--surface-raised)"/><path d="M38 48h20M48 38v20" stroke="var(--sage-600)" stroke-width="3" stroke-linecap="round"/>', steps: '<circle cx="48" cy="48" r="28" fill="var(--surface-raised)"/><path d="M36 58l8-10 7 6 9-14" fill="none" stroke="var(--peach-400)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>', journal: '<rect x="28" y="24" width="40" height="50" rx="8" fill="var(--surface-raised)"/><path d="M36 38h24M36 48h24M36 58h14" stroke="var(--violet-400)" stroke-width="3" stroke-linecap="round"/>' }[x.kind];
  return `<svg viewBox="0 0 96 96" aria-hidden="true">${glyph}</svg>`;
}
function actCard(id, label, from) {
  const x = EX[id], done = S.doneToday[id];
  return `<button class="act ${done ? 'done' : ''}" data-a="ex" data-v="${id}" data-from="${from || ''}" aria-label="${esc(x.name)}, ${x.mins} minutes${done ? ', done today' : ''}">
    <div class="art tint-${x.tint}">${label ? `<span class="tag">${esc(label)}</span>` : ''}${actArt(id)}</div>
    <div class="bd"><span class="t2" style="font-size:16px">${esc(x.name)}</span>
      <div class="row between"><span class="cap">${x.mins} min · ${x.kind === 'breath' ? 'breathing' : x.kind === 'steps' ? 'guided' : 'journal'}</span><span class="go">${done ? ic('check') : ic('play')}</span></div></div></button>`;
}

/* ================= SCREENS ================= */
const V = {};

/* ---- onboarding ---- */
V.ob = () => {
  const n = S.ob, dots = `<div class="dots" aria-hidden="true">${[0, 1, 2, 3].map(i => `<i class="${i === n ? 'on' : ''}"></i>`).join('')}</div>`;
  if (n === 0) return `<div class="screen notab glow" style="justify-content:space-between;padding-top:36px">
    <div class="row between"><img src="/yd-logo.png" alt="YourDOST" style="height:30px;width:auto;background:#FFFFFF;border-radius:10px;padding:4px 8px"><button class="link" data-a="ob-skip">Skip</button></div>
    <div class="orb" aria-hidden="true"></div>
    <div class="stack"><h1 class="display">Kya haal hai, dost?</h1><p class="lg muted">A friend for the hard days and the good ones. Free through your company, private, and here 24×7.</p></div>
    <div class="stack">${dots}<button class="btn primary block" data-a="ob-next">Get started</button></div></div>`;
  if (n === 1) return `<div class="screen notab" style="padding-top:28px">
    <div class="row"><button class="iconbtn" data-a="ob-prev" aria-label="Back">${ic('back')}</button></div>
    <h1 class="t1">Sign in with your work or college email</h1>
    <div class="stack"><label for="ob-email" class="lbl">Email</label><input id="ob-email" class="field" type="email" value="${esc(S.email)}" autocomplete="email"></div>
    <div class="card tint-sage stack"><div class="row">${ic('gift')}<b>${esc(S.company)} covers you</b></div>
      <p class="muted" style="margin:0">6 counselling sessions a year, plus Dost, programs and checks, all free for you.</p></div>
    <div style="flex:1"></div><div class="stack">${dots}<button class="btn primary block" data-a="ob-next">Continue</button><p class="cap" style="text-align:center;margin:0">Prototype: no real sign-in happens.</p></div></div>`;
  if (n === 2) return `<div class="screen notab" style="padding-top:28px">
    <div class="row"><button class="iconbtn" data-a="ob-prev" aria-label="Back">${ic('back')}</button></div>
    <h1 class="t1">What you share stays with you</h1>
    <div class="list">
      <div class="li"><span class="dot tint-violet">${ic('eye')}</span><div class="grow"><b>${esc(S.company)} never sees your chats</b><div class="cap">Only group totals, like "120 people used YourDOST this month".</div></div></div>
      <div class="li"><span class="dot tint-sun">${ic('mic')}</span><div class="grow"><b>Your voice stays on your phone</b><div class="cap">Dost turns speech into text on the device.</div></div></div>
      <div class="li"><span class="dot tint-sage">${ic('trash')}</span><div class="grow"><b>Delete anything, anytime</b><div class="cap">From Me › Privacy, in one tap.</div></div></div>
    </div>
    <p class="note">no judgement here</p>
    <div style="flex:1"></div><div class="stack">${dots}<button class="btn primary block" data-a="ob-next">Got it</button></div></div>`;
  return `<div class="screen notab" style="padding-top:28px">
    <div class="row"><button class="iconbtn" data-a="ob-prev" aria-label="Back">${ic('back')}</button></div>
    <h1 class="t1">What would you like help with?</h1><p class="muted" style="margin:-8px 0 0">Pick any. You can change this later.</p>
    <div class="row wrap">${CONCERNS.map(([k, l]) => `<button class="chip" data-a="ob-concern" data-v="${k}" aria-pressed="${S.concerns.includes(k)}">${l}</button>`).join('')}</div>
    <div class="stack"><span class="lbl">Language</span><div class="seg">${['English', 'हिंदी', 'Hinglish'].map(l => `<button data-a="ob-lang" data-v="${l}" aria-pressed="${S.lang === l}">${l}</button>`).join('')}</div></div>
    <div style="flex:1"></div><div class="stack">${dots}<button class="btn primary block" data-a="ob-done" data-v="dost">${ic('mic')}Talk to Dost for 2 minutes</button><button class="btn ghost block" data-a="ob-done" data-v="home">I'll look around first</button></div></div>`;
};

/* ---- Home ---- */
const MOODS = [['Rough', 'M10 21c3-3 7-3 10 0'], ['Low', 'M11 20c2.5-1.5 5.5-1.5 8 0'], ['Okay', 'M11 19h8'], ['Good', 'M11 18c2.5 1.8 5.5 1.8 8 0'], ['Great', 'M9.5 17c3 4 8 4 11 0']];
const MOOD_REPLY = ['That sounds heavy. Want to talk to Dost, or a person right now?', 'Thanks for telling me. A 3-minute reset might help a little.', 'Okay is okay. One small step below, if you want it.', 'Glad to hear it. Keep the good going with today\'s step.', 'Love that. Notice what made today good.'];
const face = (d, k) => `<svg viewBox="0 0 30 30" width="30" height="30" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><path d="${d}"/></svg>`;
function todayStep() {
  if (S.plan) {
    const s = S.plan.steps.find(x => !x.done) || null;
    if (s) return s;
  }
  return null;
}
V.home = () => {
  const m = S.moodToday, step = todayStep(), bk = S.booked && EXM[S.booked.id];
  const care = (S.plan && S.plan.ex) ? [S.plan.ex, 'ex_good', 'ex_ground'] : ['ex_box', 'ex_good', 'ex_ground'];
  return `<div class="screen">
  <div class="row between"><div><span class="cap">${greet()},</span><h1 class="display" style="font-size:28px;line-height:34px">${esc(S.name)}</h1></div>
    <div class="row"><button class="btn helpbtn sm" data-a="help">${ic('phone')}Get help</button><button class="avatar" data-a="tab" data-v="me" aria-label="Me" style="border:0">${esc(S.name[0])}</button></div></div>
  ${m === null ? `<section class="card tint-sun stack" aria-label="Mood check-in" style="border-radius:var(--r-lg);box-shadow:none">
      <h2 class="t2">How are you, really?</h2><p class="note" style="margin-top:-8px">no wrong answers</p>
      <div class="row between">${MOODS.map(([l, d], i) => `<button class="tab" style="min-width:0;flex:1;color:var(--ink)" data-a="mood" data-v="${i}"><span class="dot" style="width:46px;height:46px;background:var(--surface-raised)">${face(d)}</span>${l}</button>`).join('')}</div></section>`
    : `<section class="card tint-sun row" style="box-shadow:none;align-items:flex-start"><span class="dot" style="width:46px;height:46px;background:var(--sun-400);color:#2F2663">${face(MOODS[m][1])}</span><div class="stack" style="gap:6px;flex:1"><b>You're feeling ${MOODS[m][0].toLowerCase()} today</b><span class="muted">${MOOD_REPLY[m]}</span>${m === 0 ? `<div class="row wrap"><button class="btn primary sm" data-a="dost">Talk to Dost</button><button class="btn helpbtn sm" data-a="help">Talk to a person</button></div>` : ''}</div><button class="link" data-a="mood-reset" aria-label="Change today's mood">Change</button></section>`}
  <section class="sec"><div class="sec-h"><h2 class="t2">Today's one step</h2>${S.plan ? `<span class="tag violet">From your plan</span>` : ''}</div>
    ${step ? stepCard(step) : `<button class="card glow row" data-a="dost" style="border:0;text-align:left;box-shadow:var(--shadow-card)"><span class="orb sm" style="animation:none;flex:none;width:64px;height:64px;box-shadow:0 0 0 6px color-mix(in srgb,var(--violet-200) 70%,transparent)"></span><span class="stack" style="gap:4px"><b>Talk to Dost for 2 minutes</b><span class="cap">Dost asks a few questions and finds the right support for you.</span></span></button>`}</section>
  ${bk ? `<section class="card row"><span class="dot tint-violet">${ic('video')}</span><div style="flex:1"><b>${esc(S.booked.day)}, ${esc(S.booked.time)} with ${esc(bk.name.split(' ')[0])}</b><div class="cap">${esc(S.booked.mode)} session · reminder 1 hour before</div></div><button class="btn soft sm" data-a="toast" data-v="Your session room opens 10 minutes before.">Join</button></section>` : ''}
  <section class="card stack"><div class="row between"><h2 class="t2">Your garden</h2><span class="cap">${S.leaves} of 7 this week</span></div>
    ${garden(S.leaves)}<p class="muted" style="margin:0">Every kind thing you do for yourself grows a plant. It never wilts, so missed days are okay.</p></section>
  <section class="sec"><div class="sec-h"><h2 class="t2">Today's care</h2><button class="link" data-a="tab" data-v="grow">See all</button></div>
    <div class="hscroll">${care.map((id, i) => actCard(id, i === 0 ? 'For you' : '')).join('')}</div></section>
  <button class="card row" data-a="help" style="border:0;text-align:left"><span class="dot tint-help" style="color:var(--help-600)">${ic('phone')}</span><span style="flex:1"><b>Need to talk now?</b><span class="cap" style="display:block">A counsellor is on call, 24×7.</span></span>${ic('chev', 'chev')}</button>
</div>${tabbar()}`;
};
function stepCard(s) {
  if (s.kind === 'ex') { const x = EX[s.id]; return `<div class="card row"><span class="dot tint-${x.tint}" style="width:52px;height:52px">${ic('play')}</span><div style="flex:1;min-width:0"><b>${esc(x.name)}</b><div class="cap">${x.mins} min · ${esc(x.why)}</div></div><button class="btn primary sm" data-a="ex" data-v="${s.id}" data-step="${s.n}">Start</button></div>`; }
  if (s.kind === 'book') { const e = EXM[s.id]; return `<div class="card row"><span class="dot tint-violet" style="width:52px;height:52px">${ic('cal')}</span><div style="flex:1;min-width:0"><b>Book ${esc(e.name.split(' ')[0])} this week</b><div class="cap">${esc(e.title)} · your best match</div></div><button class="btn primary sm" data-a="expert" data-v="${s.id}">Book</button></div>`; }
  if (s.kind === 'pg') { const g = PG[s.id]; return `<div class="card row"><span class="dot tint-sage" style="width:52px;height:52px">${ic('grow')}</span><div style="flex:1;min-width:0"><b>Day ${(S.pg[s.id] || 0) + 1} of ${esc(g.name)}</b><div class="cap">${esc(g.blurb)}</div></div><button class="btn primary sm" data-a="pg" data-v="${s.id}">Open</button></div>`; }
  return '';
}

/* ---- Experts ---- */
V.experts = () => {
  const M = matches(), seg = S.seg;
  let body = '';
  if (seg === 'for') body = `
    <div class="card tint-help row" style="box-shadow:none"><span class="dot" style="background:var(--surface-raised);color:var(--help-600)">${ic('phone')}</span><div style="flex:1"><b>Talk now</b><div class="cap">An on-call counsellor, usually in under 2 minutes</div></div><button class="btn helpbtn sm" data-a="talknow" style="background:var(--surface-raised)">Call</button></div>
    <section class="sec"><div class="sec-h"><h2 class="t2">Matched for you</h2><span class="cap">${S.concerns.length ? 'from your answers' : 'popular'}</span></div>
    <div class="hscroll">${M.slice(0, 3).map(({ e, why }, i) => `<article class="card match">
      <div class="row"><div class="photo tint-${e.tint}" style="width:72px;flex:none;border-radius:var(--r-sm)">${person(e)}</div><div style="min-width:0"><span class="tag ${i === 0 ? 'peach' : 'violet'}">${i === 0 ? 'Best match' : 'Good match'}</span><h3 class="t2" style="margin-top:6px">${esc(e.name)}</h3><div class="cap">${esc(e.title)} · ${e.yrs} yrs</div></div></div>
      <ul style="margin:0;padding:0;list-style:none;display:grid;gap:6px">${why.map(w => `<li class="row" style="gap:8px;align-items:flex-start"><span style="color:var(--sage-600)">${ic('check')}</span><span>${esc(w)}</span></li>`).join('')}</ul>
      <div class="row"><button class="btn primary sm" style="flex:1" data-a="expert" data-v="${e.id}">See times</button><button class="fav" style="position:static;box-shadow:inset 0 0 0 1.5px var(--line)" data-a="fav" data-v="${e.id}" aria-pressed="${S.favs.includes(e.id)}" aria-label="Save ${esc(e.name)}">${ic('heart')}</button></div></article>`).join('')}</div></section>
    <p class="muted" style="margin:0">Not quite right? <button class="link" data-a="seg" data-v="browse">Browse all experts</button></p>`;
  if (seg === 'browse') {
    const f = S.filt; let list = M.map(x => x.e);
    if (f.lang.length) list = list.filter(e => f.lang.some(l => e.langs.includes(l)));
    if (f.mode.length) list = list.filter(e => f.mode.some(m => e.modes.includes(m)));
    if (f.gender.length) list = list.filter(e => f.gender.includes(e.gender));
    if (f.today) list = list.filter(e => e.today);
    if (S.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (S.sort === 'soonest') list.sort((a, b) => (b.today ? 1 : 0) - (a.today ? 1 : 0));
    const nf = f.lang.length + f.mode.length + f.gender.length + (f.today ? 1 : 0);
    body = `<div class="row"><button class="btn ghost sm" style="flex:1;background:var(--surface-raised);box-shadow:inset 0 0 0 1.5px var(--line)" data-a="sheet" data-v="sort">${ic('sort')}${S.sort === 'match' ? 'Best match' : S.sort === 'rating' ? 'Top rated' : 'Soonest'}</button><button class="btn sm" style="flex:1;background:var(--violet-600);color:var(--surface-raised)" data-a="sheet" data-v="filter">${ic('filter')}Filter${nf ? ' · ' + nf : ''}</button></div>
      ${list.length ? `<div class="grid2">${list.map(e => `<div class="tile"><div class="photo tint-${e.tint}">${person(e)}<button class="fav" data-a="fav" data-v="${e.id}" aria-pressed="${S.favs.includes(e.id)}" aria-label="Save ${esc(e.name)}">${ic('heart')}</button><span class="rate"><i></i>${e.rating.toFixed(1)} · ${e.n}</span></div>
        <button class="tile" data-a="expert" data-v="${e.id}"><b style="font:600 15px/20px var(--f-display)">${esc(e.name)}</b><span class="cap">${e.focus.slice(0, 2).map(c => CL[c]).join(', ')} · ${e.langs.slice(0, 2).join(', ')}</span></button>
        <span class="tag ${e.today ? 'peach' : ''}" style="justify-self:start">${e.today ? 'Free today ' + e.today : 'Free tomorrow'}</span></div>`).join('')}</div>`
        : `<div class="card stack" style="text-align:center"><b>No one matches all of these</b><span class="muted">Try removing a filter.</span><button class="btn soft sm" data-a="filt-clear">Clear filters</button></div>`}`;
  }
  if (seg === 'mine') {
    const bk = S.booked && EXM[S.booked.id];
    body = bk ? `<section class="card stack"><span class="eyebrow">Upcoming</span><div class="row"><div class="photo tint-${bk.tint}" style="width:64px;flex:none;border-radius:var(--r-sm)">${person(bk)}</div><div style="flex:1"><b>${esc(bk.name)}</b><div class="cap">${esc(S.booked.day)}, ${esc(S.booked.time)} · ${esc(S.booked.mode)}</div></div></div>
        <div class="row"><button class="btn primary sm" style="flex:1" data-a="toast" data-v="Your session room opens 10 minutes before.">Join</button><button class="btn soft sm" style="flex:1" data-a="toast" data-v="Message sent to ${esc(bk.name.split(' ')[0])}. Replies within a few hours.">${ic('chat')}Message</button></div>
        <button class="link" data-a="cancel" style="justify-self:start">Reschedule or cancel</button></section>`
      : `<div class="card stack" style="text-align:center"><b>No sessions yet</b><span class="muted">Your matches are ready when you are.</span><button class="btn primary sm" data-a="seg" data-v="for">See my matches</button></div>`;
    body += `<div class="card row" style="box-shadow:none;background:var(--surface-sunken)">${ic('gift')}<span>${S.sessionsLeft} of 6 free sessions left this year, covered by ${esc(S.company)}.</span></div>`;
  }
  return `<div class="screen"><h1 class="t1">Experts</h1>
    <div class="seg" role="group" aria-label="Experts view">${[['for', 'For you'], ['browse', 'Browse'], ['mine', 'My sessions']].map(([k, l]) => `<button data-a="seg" data-v="${k}" aria-pressed="${seg === k}">${l}</button>`).join('')}</div>${body}</div>${tabbar()}`;
};
V.expert = () => {
  const e = EXM[S.params.id], sl = slotsFor(e), pick = X.slot || null, m = matches().find(x => x.e.id === e.id);
  return `<div class="screen notab" style="padding-bottom:110px">
    ${top('', `<button class="iconbtn fav" style="position:static" data-a="fav" data-v="${e.id}" aria-pressed="${S.favs.includes(e.id)}" aria-label="Save">${ic('heart')}</button>`)}
    <div class="photo tint-${e.tint}" style="aspect-ratio:16/11">${person(e, true)}<span class="rate"><i></i>${e.rating.toFixed(1)} · ${e.n} sessions</span></div>
    <div class="stack" style="gap:6px"><h1 class="t1">${esc(e.name)}</h1><span class="muted">${esc(e.title)} · ${e.yrs} years · ${e.langs.join(', ')}</span>
      <div class="row wrap">${e.focus.map(c => `<span class="tag violet">${CL[c]}</span>`).join('')}${e.modes.map(md => `<span class="tag">${md}</span>`).join('')}</div></div>
    <section class="card tint-sage stack" style="box-shadow:none"><b>Why this match</b>${m.why.map(w => `<div class="row" style="gap:8px">${ic('check')}<span>${esc(w)}</span></div>`).join('')}<div class="row" style="gap:8px">${ic('check')}<span>Style: ${esc(e.style)}</span></div></section>
    <p class="lg" style="margin:0">${esc(e.about)}</p>
    <section class="sec"><h2 class="t2">Pick a time</h2>${sl.map(([d, ts]) => `<div class="stack" style="gap:8px"><span class="lbl muted">${d}</span><div class="row wrap">${ts.map(t => `<button class="slot" data-a="slot" data-v="${d}|${t}" aria-pressed="${pick === d + '|' + t}">${t}</button>`).join('')}</div></div>`).join('')}</section>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:0;padding:12px 16px calc(16px + env(safe-area-inset-bottom,0px));background:var(--surface);border-top:1px solid var(--line);display:flex;gap:10px;z-index:5">
    <button class="btn primary" style="flex:1;${pick ? '' : 'opacity:.45'}" data-a="book" ${pick ? '' : 'disabled'}>${pick ? 'Book ' + esc(pick.replace('|', ', ')) : 'Pick a time above'}</button></div>`;
};
V.booked = () => {
  const e = EXM[S.booked.id];
  return `<div class="screen notab glow" style="justify-content:center;text-align:center;gap:16px">
    <div class="photo tint-${e.tint}" style="width:120px;justify-self:center;align-self:center;border-radius:50%;aspect-ratio:1">${person(e, true)}</div>
    <h1 class="t1">You're booked with ${esc(e.name.split(' ')[0])}</h1>
    <p class="lg muted" style="margin:0">${esc(S.booked.day)}, ${esc(S.booked.time)} · ${esc(S.booked.mode)}<br>${S.sessionsLeft} free sessions left this year</p>
    ${S.shareSummary ? `<div class="card tint-violet" style="box-shadow:none;text-align:left">${ic('lock')} ${esc(e.name.split(' ')[0])} will see a short summary of what you told Dost, so you don't have to start from zero.</div>` : ''}
    <p class="note">first sessions feel easier than you think</p>
    <button class="btn primary block" data-a="tab" data-v="home">Back to Today</button></div>`;
};

/* ---- Dost ---- */
const QQ = {
  concern: { ask: "What's been on your mind lately?", chips: ['Work stress', 'Can\'t sleep', 'Feeling low', 'Anxious', 'Relationships'] },
  i0: { ask: 'Over the last two weeks, how often have you had little interest or joy in doing things?', chips: FREQ },
  i1: { ask: 'And how often have you felt down, low or hopeless?', chips: FREQ },
  i2: { ask: 'How often have you felt nervous, anxious or on edge?', chips: FREQ },
  i3: { ask: 'And how often have you not been able to stop worrying?', chips: FREQ },
  safety: { ask: 'One last question, and we ask everyone this. Lately, have you had thoughts of hurting yourself, or that you would be better off not here?', chips: ['No', 'Sometimes', 'Often', 'I\'d rather not say'] },
};
const ORDER = ['concern', 'i0', 'i1', 'i2', 'i3', 'safety'];
const RISK = /(kill myself|end (it all|my life)|suicid|don'?t want to (live|be here|exist)|hurt(ing)? myself|self[- ]?harm|no reason to live|better off (dead|without me|not here)|want to disappear|marna chaht|jeena nahi)/i;
const TAGRE = { work: /work|office|job|boss|manager|deadline|kaam/i, sleep: /sleep|insomnia|tired|neend/i, low: /\blow\b|sad|down|hopeless|empty|udaas/i, anx: /anxi|worr|panic|nervous|overthink|stress/i, rel: /partner|break ?up|relationship|marriage|fight/i, lonely: /lonely|alone|akela/i, career: /career|promotion|appraisal|growth/i, family: /family|parents|ghar/i };
const blank = () => ({ tags: [], concern: '', items: [null, null, null, null], safety: null, asked: 'concern', turns: 0, clar: 0 });
const nextKey = s => ORDER.find(k => k === 'concern' ? !s.concern : k === 'safety' ? s.safety === null : s.items[+k[1]] === null) || null;
function freq(t) { const x = t.toLowerCase(); if (/nearly every|every ?day|always|all the time|constantly/.test(x)) return 3; if (/most days|often|mostly|a lot|usually/.test(x)) return 2; if (/some days|sometimes|few days|bit|rarely|occasionally/.test(x)) return 1; if (/^(no|not|never|nope)/.test(x)) return 0; return null; }
function localTurn(s0, text) {
  const s = JSON.parse(JSON.stringify(s0)); s.turns++;
  if (s.asked === 'concern') { s.tags = Object.keys(TAGRE).filter(k => TAGRE[k].test(text)).slice(0, 3); s.concern = text.slice(0, 120); }
  else if (/^i\d$/.test(s.asked)) { const f = freq(text); if (f === null) return { state: s, say: 'Would you say not at all, a few days, more than half the days, or nearly every day?', chips: QQ[s.asked].chips }; s.items[+s.asked[1]] = f; }
  else if (s.asked === 'safety') { const x = text.toLowerCase(); s.safety = /rather not|skip/.test(x) ? 'skip' : /^(no|never|nope|not)/.test(x) ? 'no' : 'yes'; }
  const n = nextKey(s);
  if (!n || s.safety === 'yes') return { state: { ...s, asked: null }, say: s.safety === 'yes' ? "Thank you for telling me. You don't have to carry this alone. Let's get you to a real person right now." : 'Thank you, that really helps.', chips: [], done: true };
  s.asked = n; return { state: s, say: (s.turns === 1 ? 'Thank you for sharing that. ' : '') + QQ[n].ask, chips: QQ[n].chips };
}
const decide = s => { const score = s.items.reduce((a, b) => a + (b ?? 0), 0); return { score, priority: s.safety === 'yes' || score >= 9 ? 'high' : score >= 6 ? 'medium' : 'low' }; };
function dostStart() {
  const hello = `Hi ${S.name}, I'm Dost. I'm not a doctor, just here to help you find the right support. It takes about two minutes. What's been on your mind lately?`;
  X.d = { msgs: [{ role: 'assistant', content: hello }], st: blank(), chips: QQ.concern.chips, busy: false, done: false, live: null, closing: null };
  fetch(DOST_API).catch(() => {});
}
async function dostSend(text) {
  const d = X.d; text = String(text || '').trim(); if (!text || d.busy || d.done) return;
  d.msgs.push({ role: 'user', content: text }); d.chips = []; d.busy = true; render();
  let r = null;
  if (RISK.test(text)) r = { state: { ...d.st, safety: 'yes', asked: null }, say: "Thank you for telling me. You don't have to carry this alone. Let's get you to a real person right now.", done: true };
  else {
    try {
      const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 13000);
      const res = await fetch(DOST_API, { method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: d.msgs.slice(-14), state: d.st }) });
      clearTimeout(t); const j = res.ok ? await res.json() : null; if (j && j.state && typeof j.say === 'string') r = j;
    } catch {}
    d.live = !!r; if (!r) r = localTurn(d.st, text);
  }
  if (X.d !== d) return; // user left Dost
  d.st = r.state; d.busy = false; d.chips = r.chips || []; d.msgs.push({ role: 'assistant', content: r.say });
  if (r.done) { d.done = true; d.res = decide(d.st); if (d.res.priority === 'high') { render(); setTimeout(() => sheet('help', { urgent: true }), 900); return; } await dostClose(d); }
  render();
}
async function dostClose(d) {
  const tags = d.st.tags.length ? d.st.tags : (S.concerns.filter(c => c !== 'explore').length ? S.concerns : ['work']);
  const ex = EX_FOR[tags[0]] || 'ex_box', pg = PG_FOR[tags[0]] || 'pg_calm', top1 = matches()[0].e;
  const steps = d.res.priority === 'medium'
    ? [{ kind: 'ex', id: ex, n: 0, line: `${EX[ex].name} now (${EX[ex].mins} min)` }, { kind: 'book', id: top1.id, n: 1, line: `Book ${top1.name.split(' ')[0]}, your best-fit counsellor, this week` }, { kind: 'pg', id: pg, n: 2, line: `${PG[pg].name}, 10 minutes a day while you wait` }]
    : [{ kind: 'ex', id: ex, n: 0, line: `${EX[ex].name} today (${EX[ex].mins} min)` }, { kind: 'pg', id: pg, n: 1, line: `${PG[pg].name}: a 7-day program, 10 minutes a day` }];
  S.plan = { priority: d.res.priority, ex, pg, steps, tags }; save();
  let w = null;
  try {
    const ctrl = new AbortController(); setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch(DOST_API, { method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'wrap', messages: d.msgs.slice(-14), state: d.st, plan: { priority: d.res.priority, first: EX[ex].name, mins: EX[ex].mins } }) });
    w = res.ok ? await res.json() : null;
  } catch {}
  if (!w || !w.summary) w = { summary: `I hear you. ${tags.map(t => (CL[t] || 'what you shared').toLowerCase()).join(' and ')} has been weighing on you, and it makes sense that you feel this way.`, nudge: `Let's start with ${EX[ex].name} now; it only takes ${EX[ex].mins} minutes.` };
  d.msgs.push({ role: 'assistant', content: w.summary }); d.closing = { steps, nudge: w.nudge };
}
V.dost = () => {
  if (!X.d) dostStart();
  const d = X.d, last = [...d.msgs].reverse().find(m => m.role === 'assistant');
  return `<div class="screen notab glow" style="gap:14px;padding-bottom:16px">
    <div class="row between"><button class="iconbtn" data-a="back" aria-label="Close">${ic('close')}</button><div style="text-align:center"><b>Dost</b><div class="cap">Your guide, not a doctor</div></div>
      <span class="tag ${d.live === false ? 'peach' : d.live ? 'sage' : ''}" style="min-width:44px;justify-content:center">${d.live === false ? 'Offline' : d.live ? 'AI live' : 'AI'}</span></div>
    <div class="orb ${d.busy ? 'busy' : ''}" style="width:120px;height:120px;flex:none" aria-hidden="true"></div>
    <div class="lbl" style="text-align:center;color:var(--violet-600)" aria-live="polite">${d.busy ? 'Thinking…' : d.done ? (d.res && d.res.priority === 'high' ? 'A person can help right now' : 'Here\'s your plan') : 'Type or tap an answer'}</div>
    <div id="log" class="stack" style="gap:10px;flex:1;overflow-y:auto;align-content:start;min-height:120px">
      ${d.msgs.map(m => `<div class="bub ${m.role === 'user' ? 'u' : 'd'}">${esc(m.content)}</div>`).join('')}
      ${d.busy ? '<div class="bub d"><span class="typing"><i></i><i></i><i></i></span></div>' : ''}
      ${d.done && d.res && d.res.priority === 'high' ? `<div class="card tint-help stack" style="box-shadow:none"><b>You don't have to carry this alone</b><span class="muted">An on-call counsellor can talk with you now. Tele-MANAS 14416 is free, 24×7.</span><button class="btn primary sm" data-a="talknow">${ic('phone')}Talk to someone now</button></div>` : ''}
      ${d.closing ? `<div class="card stack" style="box-shadow:none;border:1.5px solid var(--violet-600)"><span class="eyebrow">Your plan, one step at a time</span>
        ${d.closing.steps.map((s, i) => `<div class="row" style="align-items:flex-start"><span class="dot tint-sun" style="width:28px;height:28px;font:600 13px/1 var(--f-body)">${i + 1}</span><span>${esc(s.line)}</span></div>`).join('')}
        <p style="margin:0" class="muted">${esc(d.closing.nudge)}</p>
        <div class="row wrap"><button class="btn primary sm" data-a="plan-start">Start step 1 now</button><button class="btn ghost sm" data-a="tab" data-v="home">Save to Today</button></div></div>` : ''}
    </div>
    ${d.chips.length && !d.busy ? `<div class="row wrap" style="gap:8px">${d.chips.map(c => `<button class="chip" style="background:var(--surface-raised);box-shadow:var(--shadow-card)" data-a="dchip" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
    ${d.done ? '' : `<form id="dform" class="row" autocomplete="off"><label for="dtext" class="sr">Your answer</label><input id="dtext" class="field" placeholder="Type how you feel…" maxlength="600"><button class="iconbtn" style="background:var(--primary);color:var(--on-primary)" aria-label="Send">${ic('send')}</button></form>`}
    <p class="cap" style="text-align:center;margin:0">${ic('lock')} Private. ${esc(S.company)} never sees this.</p></div>`;
};

/* ---- Grow ---- */
V.grow = () => {
  const care = [S.plan ? S.plan.ex : 'ex_box', 'ex_good', 'ex_ground', 'ex_478'].filter((v, i, a) => a.indexOf(v) === i);
  return `<div class="screen"><div><h1 class="t1">Grow</h1><p class="note">a little every day</p></div>
    <section class="sec"><div class="sec-h"><h2 class="t2">Today's care</h2><span class="cap">${Object.keys(S.doneToday).length} done</span></div>
      <div class="hscroll">${care.map((id, i) => actCard(id, S.plan && i === 0 ? 'From your plan' : '')).join('')}</div></section>
    <section class="sec"><h2 class="t2">7-day programs</h2><div class="list">${Object.entries(PG).map(([id, g]) => { const dn = S.pg[id] || 0; return `<button class="li" data-a="pg" data-v="${id}"><span class="dot tint-sage">${ic('grow')}</span><span class="grow"><b>${esc(g.name)}</b><span class="cap" style="display:block">${esc(g.blurb)}</span>${dn ? `<span class="bar" style="display:block;margin-top:8px"><i style="width:${dn / 7 * 100}%"></i></span>` : ''}</span><span class="cap">${dn ? dn + '/7' : '7 days'}</span>${ic('chev', 'chev')}</button>`; }).join('')}</div></section>
    <section class="sec"><h2 class="t2">Quick checks</h2><div class="grid2">${Object.entries(CHECKS).map(([id, c], i) => `<button class="card stack" style="border:0;text-align:left;gap:6px" data-a="check" data-v="${id}"><span class="dot tint-${['violet', 'sun', 'peach'][i]}">${ic(['spark', 'moon', 'sun'][i])}</span><b>${esc(c.name)}</b><span class="cap">${c.qs.length} questions · ${c.mins} min</span></button>`).join('')}
      <button class="card stack" style="border:0;text-align:left;gap:6px" data-a="journal"><span class="dot tint-sage">${ic('pen')}</span><b>Journal</b><span class="cap">Write or talk it out</span></button></div></section>
    <section class="sec"><div class="sec-h"><h2 class="t2">Circles</h2><span class="tag peach">Coming soon</span></div>
      <p class="muted" style="margin:-4px 0 0">Small, anonymous groups of 8, guided by a YourDOST counsellor.</p>
      <div class="hscroll">${[['New in a new city', 'lonely'], ['Exam season', 'exams'], ['First-time managers', 'work'], ['New parents', 'family']].map(([t], i) => `<div class="card stack" style="width:200px;gap:8px"><span class="dot tint-${TINTS[i]}">${ic('people')}</span><b>${t}</b><span class="cap">Weekly · 45 min · anonymous</span><button class="btn soft sm" data-a="toast" data-v="You're on the waitlist for ${t}.">Join waitlist</button></div>`).join('')}</div></section>
  </div>${tabbar()}`;
};
V.pg = () => {
  const id = S.params.id, g = PG[id], dn = S.pg[id] || 0;
  return `<div class="screen notab">${top(g.name)}<div class="card tint-sage stack" style="box-shadow:none"><b>${esc(g.blurb)}</b><span class="muted">10 minutes a day for 7 days. Miss a day? Just pick up where you left off.</span><div class="bar"><i style="width:${dn / 7 * 100}%"></i></div><span class="cap">${dn} of 7 days done</span></div>
    <div class="list">${g.days.map((ex, i) => `<button class="li" data-a="ex" data-v="${ex}" data-pg="${id}" data-day="${i}" ${i > dn ? 'aria-disabled="true" style="opacity:.55"' : ''}><span class="dot ${i < dn ? 'tint-sun' : 'tint-sage'}">${i < dn ? ic('check') : `<b style="font-size:13px">${i + 1}</b>`}</span><span class="grow"><b>Day ${i + 1} · ${esc(EX[ex].name)}</b><span class="cap" style="display:block">${EX[ex].mins} min · ${esc(EX[ex].why)}</span></span>${i === dn ? `<span class="tag sage">Today</span>` : ''}</button>`).join('')}</div></div>`;
};
V.ex = () => {
  const id = S.params.id, x = EX[id], st = X.ex || (X.ex = { i: 0, running: false, answers: [] });
  let body = '';
  if (x.kind === 'breath') body = `<div class="breath" id="breath"><i></i><b id="bphase">${st.running ? '' : 'Ready when you are'}</b></div><p class="muted" style="text-align:center;margin:0" id="bcount">${x.cycles} rounds · follow the circle</p>
    ${st.running ? `<button class="btn ghost block" data-a="ex-finish">I'm done</button>` : `<button class="btn sage block" data-a="ex-run">${ic('play')}Start</button>`}`;
  if (x.kind === 'steps') { const last = st.i >= x.steps.length - 1; body = `<div class="card tint-${x.tint} stack" style="box-shadow:none;min-height:220px;align-content:center;text-align:center"><span class="eyebrow">Step ${st.i + 1} of ${x.steps.length}</span><p class="lg" style="font-size:20px;line-height:30px">${esc(x.steps[st.i])}</p></div><div class="bar"><i style="width:${(st.i + 1) / x.steps.length * 100}%"></i></div><button class="btn sage block" data-a="${last ? 'ex-finish' : 'ex-step'}">${last ? 'Finish' : 'Next'}</button>`; }
  if (x.kind === 'journal') body = x.prompts.map((p, i) => `<div class="stack" style="gap:6px"><label class="lbl" for="jp${i}">${esc(p)}</label><textarea id="jp${i}" class="field" rows="2"></textarea></div>`).join('') + `<p class="cap" style="margin:0">${ic('lock')} Saved only on this phone.</p><button class="btn sage block" data-a="ex-finish">Save</button>`;
  return `<div class="screen notab">${top(x.name)}<p class="muted" style="margin:0">${esc(x.why)}</p>${body}</div>`;
};
V.exdone = () => `<div class="screen notab glow" style="justify-content:center;text-align:center">
  ${garden(S.leaves)}<h1 class="t1">A new plant in your garden</h1><p class="lg muted" style="margin:0">${S.leaves} kind things for yourself this week.</p>
  <div class="stack"><span class="lbl">How do you feel now?</span><div class="row" style="justify-content:center;gap:8px">${[['better', 'A bit better'], ['same', 'About the same'], ['worse', 'Worse']].map(([v, l]) => `<button class="chip" style="background:var(--surface-raised);box-shadow:var(--shadow-card)" data-a="feel" data-v="${v}">${l}</button>`).join('')}</div></div></div>`;
V.check = () => {
  const c = CHECKS[S.params.id], st = X.c || (X.c = { a: [] }), i = st.a.length;
  if (i >= c.qs.length) {
    const sc = st.a.reduce((a, b) => a + b, 0), band = c.bands.find(b => sc <= b[0]), tag = band[2], pg = PG_FOR[tag] || 'pg_calm';
    return `<div class="screen notab">${top(c.name)}<div class="card tint-violet stack" style="box-shadow:none;text-align:center"><span class="eyebrow">Your result</span><h2 class="t1">${esc(band[1])}</h2><span class="muted">${sc} of ${c.qs.length * 3}. This is a check-in, not a diagnosis.</span></div>
      <h2 class="t2">Suggested for you</h2>${actCard(EX_FOR[tag] || 'ex_box', 'Try now')}
      <button class="card row" style="border:0;text-align:left" data-a="pg" data-v="${pg}"><span class="dot tint-sage">${ic('grow')}</span><span style="flex:1"><b>${esc(PG[pg].name)}</b><span class="cap" style="display:block">7-day program</span></span>${ic('chev', 'chev')}</button>
      ${sc >= 7 ? `<button class="btn primary block" data-a="tab" data-v="experts">Talk to a counsellor</button>` : `<button class="btn soft block" data-a="dost">Talk it through with Dost</button>`}</div>`;
  }
  return `<div class="screen notab">${top(c.name)}<div class="bar"><i style="width:${i / c.qs.length * 100}%;background:var(--violet-600)"></i></div><span class="cap">Question ${i + 1} of ${c.qs.length} · last two weeks</span>
    <h2 class="t1">${esc(c.qs[i])}</h2><div class="stack">${FREQ.map((f, v) => `<button class="qopt" data-a="cans" data-v="${v}">${f}</button>`).join('')}</div></div>`;
};
V.journal = () => `<div class="screen notab">${top('Journal')}<p class="note">no one else reads this</p>
  <label for="jtext" class="lbl">What's on your mind?</label><textarea id="jtext" class="field" rows="6" placeholder="Write freely…"></textarea>
  <div class="row"><button class="btn primary" style="flex:1" data-a="jsave">Save entry</button><button class="btn soft" data-a="dost">${ic('mic')}Talk it out</button></div>
  ${S.journal.length ? `<h2 class="t2">Earlier</h2><div class="list">${S.journal.slice(-5).reverse().map(j => `<div class="li"><span class="grow"><span class="cap">${esc(j.d)}</span><span style="display:block">${esc(j.t)}</span></span></div>`).join('')}</div>` : ''}
  <p class="cap" style="margin:0">${ic('lock')} Saved only on this phone.</p></div>`;

/* ---- Me ---- */
V.me = () => {
  const days = []; for (let i = 6; i >= 0; i--) { const dt = new Date(); dt.setDate(dt.getDate() - i); days.push(DAYS[dt.getDay()][0]); }
  const week = [...S.moodWeek.slice(-6), S.moodToday];
  return `<div class="screen">
    <div class="row"><span class="avatar" style="width:56px;height:56px;font-size:22px">${esc(S.name[0])}</span><div><h1 class="t1">${esc(S.name)}</h1><span class="cap">${esc(S.email)} · ${esc(S.company)}</span></div></div>
    <section class="card stack"><div class="row between"><h2 class="t2">Your week</h2><span class="cap">mood check-ins</span></div>
      <div class="moodbars" role="img" aria-label="Mood over the last 7 days">${week.map((v, i) => `<div><b class="${v >= 3 ? 'hi' : ''}" style="height:${v === null || v === undefined ? 6 : 18 + v * 20}px;${v === null || v === undefined ? 'background:var(--surface-sunken)' : ''}"></b><span class="cap">${days[i]}</span></div>`).join('')}</div>
      <p class="muted" style="margin:0">${S.moodToday === null ? 'Check in today on Home to add to your week.' : 'Thanks for checking in today.'}</p></section>
    <section class="card tint-sage stack" style="box-shadow:none"><h2 class="t2">Small wins this week</h2>${garden(S.leaves)}<ul style="margin:0;padding-left:18px;display:grid;gap:4px">${S.wins.slice(-4).map(w => `<li>${esc(w)}</li>`).join('')}</ul></section>
    <section class="card tint-violet stack" style="box-shadow:none"><div class="row between"><h2 class="t2">Your benefits</h2><span class="tag">${esc(S.company)}</span></div>
      <span>${S.sessionsLeft} of 6 counselling sessions left this year</span><div class="bar"><i style="width:${S.sessionsLeft / 6 * 100}%;background:var(--violet-600)"></i></div><span class="cap">Dost, Grow and quick checks are unlimited.</span></section>
    <div class="list">
      <button class="li" data-a="journal"><span class="dot tint-sun">${ic('pen')}</span><span class="grow"><b>Journal</b></span>${ic('chev', 'chev')}</button>
      <div class="li"><span class="dot tint-violet">${ic('moon')}</span><span class="grow"><b>Night theme</b><span class="cap" style="display:block">Easier on the eyes at night</span></span><button class="toggle" role="switch" aria-checked="${S.theme === 'dark'}" aria-label="Night theme" data-a="theme"></button></div>
      <div class="li"><span class="dot tint-sage">${ic('chat')}</span><span class="grow"><b>Dost remembers our chats</b><span class="cap" style="display:block">So it can ask how things went</span></span><button class="toggle" role="switch" aria-checked="${S.memory}" aria-label="Dost memory" data-a="memory"></button></div>
      <button class="li" data-a="sheet" data-v="privacy"><span class="dot tint-violet">${ic('shield')}</span><span class="grow"><b>Privacy and your data</b><span class="cap" style="display:block">What ${esc(S.company)} sees: group totals only</span></span>${ic('chev', 'chev')}</button>
      <button class="li" data-a="help"><span class="dot tint-help" style="color:var(--help-600)">${ic('phone')}</span><span class="grow"><b>Get help now</b></span>${ic('chev', 'chev')}</button>
      <button class="li" data-a="restart"><span class="dot" style="background:var(--surface-sunken)">${ic('back')}</span><span class="grow"><b>Prototype: start over</b><span class="cap" style="display:block">Replays onboarding and clears this demo</span></span></button>
    </div></div>${tabbar()}`;
};

/* ---- sheets ---- */
function sheetHTML() {
  if (!SHEET) return '';
  const s = SHEET; let body = '';
  if (s.name === 'help') body = `<h2 class="t1">${s.urgent ? 'You don\'t have to carry this alone' : 'Talk to someone now'}</h2>
    ${s.calling ? `<div class="card tint-violet stack" style="box-shadow:none;text-align:center"><div class="orb sm busy" aria-hidden="true"></div><b>Connecting you to Dr. Meera, clinical psychologist</b><span class="muted">Usually under 2 minutes. Stay with us.</span></div>`
      : `<button class="btn primary block" data-a="call">${ic('phone')}Talk to an on-call counsellor</button>`}
    <div class="list"><div class="li"><span class="dot tint-help" style="color:var(--help-600)">${ic('phone')}</span><span class="grow"><b>Tele-MANAS · 14416</b><span class="cap" style="display:block">Free, 24×7, in your language</span></span></div>
      <div class="li"><span class="dot tint-help" style="color:var(--help-600)">${ic('shield')}</span><span class="grow"><b>Emergency · 112</b><span class="cap" style="display:block">If you're in danger right now</span></span></div></div>
    <button class="btn ghost block" data-a="close">I'm safe for now</button>`;
  if (s.name === 'filter') { const f = S.filt; const grp = (k, label, opts) => `<div class="stack" style="gap:8px"><span class="lbl">${label}</span><div class="row wrap">${opts.map(o => `<button class="chip" data-a="filt" data-k="${k}" data-v="${o}" aria-pressed="${f[k].includes(o)}">${o}</button>`).join('')}</div></div>`;
    body = `<div class="row between"><h2 class="t1">Filter</h2><button class="link" data-a="filt-clear">Clear all</button></div>${grp('lang', 'Language', ['English', 'Hindi', 'Tamil', 'Marathi', 'Urdu'])}${grp('mode', 'How to talk', ['Video', 'Call', 'Chat'])}${grp('gender', 'Counsellor', ['Woman', 'Man'])}
      <div class="row between"><span class="lbl">Free today</span><button class="toggle" role="switch" aria-checked="${f.today}" aria-label="Free today" data-a="filt-today"></button></div><button class="btn primary block" data-a="close">Show experts</button>`; }
  if (s.name === 'sort') body = `<h2 class="t1">Sort by</h2><div class="stack">${[['match', 'Best match'], ['rating', 'Rating'], ['soonest', 'Soonest free']].map(([k, l]) => `<button class="qopt" data-a="sort" data-v="${k}" ${S.sort === k ? 'style="border-color:var(--violet-600)"' : ''}>${l}</button>`).join('')}</div>`;
  if (s.name === 'confirm') { const e = EXM[S.params.id]; const [d, t] = X.slot.split('|');
    body = `<h2 class="t1">Book ${esc(e.name.split(' ')[0])}?</h2><div class="card row"><span class="dot tint-violet">${ic('cal')}</span><span style="flex:1"><b>${esc(d)}, ${esc(t)}</b><span class="cap" style="display:block">50 min · ${esc(e.modes[0])} · free (uses 1 of ${S.sessionsLeft})</span></span></div>
      <div class="row between" style="align-items:flex-start"><span><b>Share my Dost summary</b><span class="cap" style="display:block">So you don't start from zero. Never shared with ${esc(S.company)}.</span></span><button class="toggle" role="switch" aria-checked="${S.shareSummary}" aria-label="Share summary" data-a="share"></button></div>
      <button class="btn primary block" data-a="book-ok">Confirm booking</button>`; }
  if (s.name === 'privacy') body = `<h2 class="t1">Privacy and your data</h2><div class="list">
    <div class="li"><span class="dot tint-violet">${ic('eye')}</span><span class="grow"><b>What ${esc(S.company)} sees</b><span class="cap" style="display:block">Group totals only, and only when 10 or more people are in a group.</span></span></div>
    <div class="li"><span class="dot tint-sun">${ic('mic')}</span><span class="grow"><b>Your voice</b><span class="cap" style="display:block">Turned into text on your phone; audio is never uploaded.</span></span></div>
    <div class="li"><span class="dot tint-sage">${ic('lock')}</span><span class="grow"><b>Your chats with Dost</b><span class="cap" style="display:block">Names and numbers removed before the AI; nothing stored on our servers.</span></span></div></div>
    <button class="btn helpbtn block" data-a="restart">${ic('trash')}Delete all my data</button>`;
  const anim = s._seen ? '' : ' anim'; s._seen = true;
  return `<div class="scrim${anim}" data-a="scrim"><div class="sheet" role="dialog" aria-modal="true"><div class="grab" aria-hidden="true"></div>${body}</div></div>`;
}

/* ---------------- render ---------------- */
function render() {
  document.documentElement.dataset.theme = S.theme;
  if (!S.onboarded) S.view = 'ob';
  const fn = V[S.view] || V.home;
  const keepScroll = $app.querySelector('.screen'); const y = keepScroll ? keepScroll.scrollTop : 0;
  $app.innerHTML = fn() + sheetHTML() + (TOAST ? `<div class="toast" role="status">${esc(TOAST)}</div>` : '');
  const sc = $app.querySelector('.screen'); if (sc && X.keep) sc.scrollTop = y;
  X.keep = true;
  const log = document.getElementById('log'); if (log) log.scrollTop = log.scrollHeight;
  const f = document.getElementById('dform'); if (f) f.onsubmit = e => { e.preventDefault(); const i = document.getElementById('dtext'); const v = i.value; i.value = ''; dostSend(v); };
  if (S.view === 'ex' && X.ex && X.ex.running) runBreath();
}
let BT = null;
function runBreath() {
  const x = EX[S.params.id]; if (!x || x.kind !== 'breath' || BT) return;
  let step = 0, round = 0;
  const tick = () => {
    const el = document.getElementById('breath'), ph = document.getElementById('bphase'), ct = document.getElementById('bcount');
    if (!el || S.view !== 'ex') { BT = null; return; }
    const [label, secs] = x.pattern[step];
    ph.textContent = label; ct.textContent = `Round ${round + 1} of ${x.cycles}`;
    const ring = el.querySelector('i'); ring.style.transitionDuration = secs + 's';
    ring.style.transform = label.includes('in') ? 'scale(1)' : label.includes('out') ? 'scale(.55)' : ring.style.transform;
    step++; if (step >= x.pattern.length) { step = 0; round++; }
    if (round >= x.cycles) { BT = setTimeout(() => { BT = null; finishEx(); }, secs * 1000); return; }
    BT = setTimeout(tick, secs * 1000);
  };
  tick();
}
function finishEx() {
  clearTimeout(BT); BT = null;
  const id = S.params.id, p = S.params;
  if (EX[id].kind === 'journal') { const t = [...document.querySelectorAll('textarea[id^="jp"]')].map(a => a.value.trim()).filter(Boolean).join(' · '); if (t) S.journal.push({ d: new Date().toDateString(), t }); }
  if (!S.doneToday[id]) { S.doneToday[id] = true; S.leaves = Math.min(7, S.leaves + 1); S.wins.push(`${EX[id].name} today`); }
  if (p.pg) S.pg[p.pg] = Math.max(S.pg[p.pg] || 0, +p.day + 1);
  if (S.plan) { const s = S.plan.steps.find(x => x.kind === 'ex' && x.id === id); if (s) s.done = true; }
  go('exdone', { from: id }, false);
}

/* ---------------- events ---------------- */
$app.addEventListener('click', e => {
  const a = e.target.closest('[data-a]'); if (!a) return;
  const act = a.dataset.a, v = a.dataset.v;
  if (act === 'scrim' && e.target !== a) return;
  switch (act) {
    case 'ob-next': if (S.ob === 1) { const em = document.getElementById('ob-email'); if (em && em.value) S.email = em.value; } S.ob = Math.min(3, S.ob + 1); save(); render(); break;
    case 'ob-prev': S.ob = Math.max(0, S.ob - 1); render(); break;
    case 'ob-skip': S.ob = 3; render(); break;
    case 'ob-concern': S.concerns = S.concerns.includes(v) ? S.concerns.filter(x => x !== v) : [...S.concerns, v]; save(); render(); break;
    case 'ob-lang': S.lang = v; save(); render(); break;
    case 'ob-done': S.onboarded = true; S.view = 'home'; S.tab = 'home'; save(); if (v === 'dost') go('dost'); else render(); break;
    case 'tab': go(v); break;
    case 'back': back(); break;
    case 'dost': go('dost'); break;
    case 'dchip': dostSend(v); break;
    case 'plan-start': { const s = S.plan.steps[0]; go('ex', { id: s.id }); break; }
    case 'mood': S.moodToday = +v; save(); render(); break;
    case 'mood-reset': S.moodToday = null; save(); render(); break;
    case 'help': sheet('help'); break;
    case 'call': SHEET.calling = true; render(); break;
    case 'talknow': sheet('help', { calling: true }); break;
    case 'close': case 'scrim': SHEET = null; render(); break;
    case 'toast': toast(v); break;
    case 'seg': S.seg = v; save(); if (S.view !== 'experts') go('experts'); else render(); break;
    case 'expert': go('expert', { id: v }); break;
    case 'fav': S.favs = S.favs.includes(v) ? S.favs.filter(x => x !== v) : [...S.favs, v]; save(); render(); break;
    case 'sheet': sheet(v); break;
    case 'filt': { const k = a.dataset.k; S.filt[k] = S.filt[k].includes(v) ? S.filt[k].filter(x => x !== v) : [...S.filt[k], v]; save(); render(); break; }
    case 'filt-today': S.filt.today = !S.filt.today; save(); render(); break;
    case 'filt-clear': S.filt = { lang: [], mode: [], gender: [], today: false }; save(); render(); break;
    case 'sort': S.sort = v; SHEET = null; save(); render(); break;
    case 'slot': X.slot = v; render(); break;
    case 'book': if (X.slot) sheet('confirm'); break;
    case 'share': S.shareSummary = !S.shareSummary; save(); render(); break;
    case 'book-ok': { const [d, t] = X.slot.split('|'), ex = EXM[S.params.id]; S.booked = { id: ex.id, day: d, time: t, mode: ex.modes[0] }; S.sessionsLeft = Math.max(0, S.sessionsLeft - 1); if (S.plan) { const s = S.plan.steps.find(x => x.kind === 'book'); if (s) s.done = true; } go('booked', {}, false); break; }
    case 'cancel': S.booked = null; S.sessionsLeft = Math.min(6, S.sessionsLeft + 1); save(); toast('Session cancelled. Your free session is back.'); break;
    case 'pg': go('pg', { id: v }); break;
    case 'ex': if (a.getAttribute('aria-disabled') === 'true') { toast('Finish the earlier days first, one at a time.'); break; } go('ex', { id: v, pg: a.dataset.pg || null, day: a.dataset.day || null }); break;
    case 'ex-run': X.ex.running = true; render(); break;
    case 'ex-step': X.ex.i++; render(); break;
    case 'ex-finish': finishEx(); break;
    case 'feel': if (v === 'worse') { sheet('help'); toast('Thanks for telling us. Someone is here.'); } else { toast(v === 'better' ? 'Glad it helped.' : 'Thanks. It adds up.'); go(S.plan && todayStep() ? 'home' : 'grow'); } break;
    case 'check': go('check', { id: v }); break;
    case 'cans': X.c.a.push(+v); render(); break;
    case 'journal': go('journal'); break;
    case 'jsave': { const t = document.getElementById('jtext').value.trim(); if (!t) { toast('Write a line first.'); break; } S.journal.push({ d: new Date().toDateString(), t }); if (!S.doneToday.journal) { S.doneToday.journal = true; S.leaves = Math.min(7, S.leaves + 1); } save(); toast('Saved. A new plant in your garden.'); render(); break; }
    case 'theme': S.theme = S.theme === 'dark' ? 'light' : 'dark'; save(); render(); break;
    case 'memory': S.memory = !S.memory; save(); render(); break;
    case 'restart': try { localStorage.removeItem(KEY); } catch {} S = fresh(); SHEET = null; X = {}; render(); break;
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && SHEET) { SHEET = null; render(); } });
if (location.hash === '#start') { S = fresh(); }
render();
})();

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
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
  sort: '<path d="M4 7h16M7 12h10M10 17h4"/>', filter: '<path d="M4 6h10M18 6h2M4 18h4M12 18h8"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="18" r="2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/>',
  moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>', globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>',
  book: '<path d="M5 4.5h9a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h9"/>', pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  people: '<circle cx="8" cy="9" r="3"/><circle cx="16.5" cy="9" r="3"/><path d="M2.5 19c.7-3 2.8-4.5 5.5-4.5s4.8 1.5 5.5 4.5M13.5 15c.9-.4 1.9-.6 3-.6 2.7 0 4.8 1.5 5.5 4.6"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
  shield: '<path d="M12 3.5l7 3v5.5c0 4.2-3 7.4-7 8.5-4-1.1-7-4.3-7-8.5V6.5z"/><path d="M9 12l2 2 4-4"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
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
function fnm(n) { return n.startsWith('Dr. ') ? n.split(' ').slice(0, 2).join(' ') : n.split(' ')[0]; }
const EXPERTS = [
  { id: 'e1', name: 'Neha Kapoor', title: 'Counselling psychologist', yrs: 9, rating: 4.9, n: 312, langs: ['English', 'Hindi'], focus: ['work', 'sleep', 'anx'], style: 'Practical tips and small weekly goals', gender: 'Woman', modes: ['Video', 'Chat'], today: '6 pm', about: 'Helps working professionals untangle stress and get their evenings back, with small changes that fit a busy week.' },
  { id: 'e2', name: 'Aditya Rao', title: 'Clinical psychologist', yrs: 12, rating: 4.8, n: 198, langs: ['English', 'Tamil'], focus: ['anx', 'rel', 'low'], style: 'Calm, structured, CBT-based', gender: 'Man', modes: ['Video', 'Call'], today: null, about: 'Works with anxiety and relationship worries using CBT, at a calm pace you set.' },
  { id: 'e3', name: 'Farah Siddiqui', title: 'Counsellor', yrs: 6, rating: 4.9, n: 241, langs: ['English', 'Hindi', 'Urdu'], focus: ['low', 'lonely', 'rel'], style: 'Warm listener, space to talk', gender: 'Woman', modes: ['Chat', 'Call'], today: '8 pm', about: 'Gives you room to talk it through first, then gently helps you find your next step.' },
  { id: 'e4', name: 'Rohan Mehta', title: 'Counselling psychologist', yrs: 8, rating: 4.7, n: 156, langs: ['English', 'Hindi', 'Marathi'], focus: ['career', 'work', 'anx'], style: 'Direct and goal-focused', gender: 'Man', modes: ['Video', 'Chat'], today: '7:30 pm', about: 'Helps with career crossroads, performance pressure and burnout, with clear goals.' },
  { id: 'e5', name: 'Priya Iyer', title: 'Clinical psychologist', yrs: 18, rating: 5.0, n: 402, langs: ['English', 'Tamil', 'Malayalam'], focus: ['sleep', 'low', 'anx'], style: 'Gentle, mindfulness-based', gender: 'Woman', modes: ['Video'], today: null, about: 'Brings mindfulness and sleep science together for people who feel worn out.' },
  { id: 'e6', name: 'Dr. Kabir Singh', title: 'Psychiatrist, MD', yrs: 11, rating: 4.8, n: 133, langs: ['English', 'Hindi', 'Punjabi'], focus: ['low', 'anx', 'sleep'], style: 'Clear, medical and reassuring', gender: 'Man', modes: ['Video', 'Call'], today: '9 pm', about: 'Assesses when medicine might help, alongside therapy. Can prescribe, and keeps it as simple as possible.' },
  { id: 'e7', name: 'Ananya Sharma', title: 'Counselling psychologist', yrs: 15, rating: 4.9, n: 287, langs: ['English', 'Hindi', 'Bengali'], focus: ['career', 'work', 'rel'], style: 'Warm but direct', gender: 'Woman', modes: ['Video', 'Chat'], today: '5 pm', about: 'Works with managers and teams on pressure, conflict and confidence at work.' },
  { id: 'e8', name: 'Dr. Meera Nair', title: 'Psychiatrist, MD', yrs: 13, rating: 4.9, n: 221, langs: ['English', 'Malayalam', 'Hindi'], focus: ['low', 'anx', 'sleep'], style: 'Gentle, explains every option', gender: 'Woman', modes: ['Video', 'Call'], today: null, about: 'Helps you understand what is going on and whether medicine could help, with no pressure to take it.' },
  { id: 'e9', name: 'Ishita Banerjee', title: 'Counsellor', yrs: 7, rating: 4.8, n: 174, langs: ['English', 'Bengali', 'Hindi'], focus: ['rel', 'lonely', 'low'], style: 'Friendly, follows your lead', gender: 'Woman', modes: ['Chat', 'Call', 'Video'], today: '7 pm', about: 'Easy to talk to; good for a first session if you\'ve never spoken to anyone before.' },
  { id: 'e10', name: 'Kavya Reddy', title: 'Clinical psychologist', yrs: 10, rating: 4.9, n: 265, langs: ['English', 'Telugu', 'Kannada'], focus: ['anx', 'work', 'sleep'], style: 'Structured, CBT and goal-focused', gender: 'Woman', modes: ['Video', 'Chat'], today: '8:30 pm', about: 'Uses CBT to help with anxiety, overthinking and sleep, with tools you can use right away.' },
  { id: 'e11', name: 'Sarah Mitchell', title: 'Counselling psychologist · UK', yrs: 12, rating: 4.8, n: 119, langs: ['English'], focus: ['anx', 'rel', 'lonely'], style: 'Calm and compassion-focused', gender: 'Woman', modes: ['Video'], today: null, about: 'Based in London. Supports people far from home, and anyone working across time zones.' },
  { id: 'e12', name: 'Daniel Weber', title: 'Psychotherapist · Germany', yrs: 16, rating: 4.7, n: 96, langs: ['English', 'German'], focus: ['low', 'career', 'rel'], style: 'Thoughtful, explores what led here', gender: 'Man', modes: ['Video'], today: '10 pm', about: 'Based in Berlin. Helps with low mood and life transitions, at a steady, unhurried pace.' },
];
const STYLE4 = { e1: [0, 0, 0, 1], e2: [0, 0, 1, 0], e3: [1, 1, 1, 0], e4: [0, 0, 0, 1], e5: [1, 1, 0, 0], e6: [0, 0, 0, 1], e7: [0, 0, 0, 1], e8: [1, 0, 0, 0], e9: [1, 1, 0, 0], e10: [0, 0, 0, 1], e11: [1, 1, 1, 0], e12: [1, 1, 1, 0] }; // tips/space, guide/follow, now/past, gentle/direct
EXPERTS.forEach(e => { e.style4 = STYLE4[e.id]; });
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
const KEY = 'yd-app-v3';
const fresh = () => ({
  onboarded: false, ob: 0, name: 'Riya', email: 'riya.sharma@acme.com', company: 'Acme Corp', concerns: [], lang: 'English',
  view: 'home', params: {}, stack: [], tab: 'home',
  moods: seedMoods(), lastCheck: null, tour: null, regs: [], notifs: NOTIF_SEED(), rituals: [], leaves: 3, wins: ['Did box breathing on Monday', 'Wrote three good things', 'Slept before 11 pm on Tuesday'],
  plan: null, sessionsLeft: 3, favs: ['e1'], seg: 'browse', sort: 'match', quiz: null,
  booked: { id: 'e1', day: 'Mon 24 Nov', time: '6 pm', mode: 'Video', n: 3 },
  history: [{ id: 'e1', n: 1, date: 'Mon 10 Nov', mode: 'Video', fit: 4, note: 'Mapped what drains my evenings: late calls and checking Slack in bed.', task: 'Try a switch-off ritual' }, { id: 'e1', n: 2, date: 'Mon 17 Nov', mode: 'Video', fit: 5, note: 'The ritual helped on 3 of 5 nights. Next: saying no to one late meeting.', task: 'Box breathing before stand-up' }],
  filt: { lang: [], mode: [], gender: [], today: false, where: [] }, pg: { pg_calm: 3 }, doneToday: {}, journal: [], shareSummary: true, memory: true,
});
let S;
try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = fresh(); }
if (!Array.isArray(S.notifs)) S.notifs = NOTIF_SEED();
if (!Array.isArray(S.regs)) S.regs = [];
if (!Array.isArray(S.rituals)) S.rituals = [];
if (S.filt && !Array.isArray(S.filt.where)) S.filt.where = [];
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

/* ---- First open: login, then three intro slides ---- */
V.login = () => `<div class="screen notab login" style="padding-top:calc(var(--sb) + 18px)">
  <span class="blob b1" aria-hidden="true"></span><span class="blob b2" aria-hidden="true"></span><span class="blob b3" aria-hidden="true"></span>
  <img src="/yd-logo.png" alt="YourDOST" class="lglogo">
  <h1 class="hello"><span class="h-a">Hey.</span><span class="h-b">How are you,</span><span class="h-c">really?</span></h1>
  <p class="lg muted" style="margin:0;max-width:300px;position:relative">A safe space to talk, feel better and grow. Free through your company or college.</p>
  <div style="flex:1"></div>
  <form class="stack" id="loginform" style="position:relative" autocomplete="on">
    <label for="lg-email" class="lbl">Work or college email</label>
    <input id="lg-email" class="field" type="email" placeholder="you@company.com" value="${esc(S.email)}" autocomplete="email">
    <button class="btn primary block" data-a="login" type="button">Continue</button>
    <div class="or"><span>or</span></div>
    <button class="btn block guestbtn" data-a="guest" type="button">Continue as guest</button>
    <p class="cap" style="text-align:center;margin:4px 0 0">${ic('lock')} Private. Your company never sees what you share.</p>
  </form></div>`;
const SLIDES = [
  { bg: 'var(--violet-100)', wave: 'var(--violet-200)', wave2: 'var(--violet-400)', a: 'You are', b: 'not alone.', note: 'lots of us feel this way',
    sub: 'Feeling low, anxious or stuck happens to many people. Reaching out is how it starts to get lighter.',
    art: `<svg viewBox="0 0 240 150" class="iart" aria-hidden="true"><circle class="bob d1" cx="60" cy="80" r="26" fill="var(--violet-200)"/><circle class="bob d2" cx="180" cy="72" r="22" fill="var(--peach-100)"/><circle class="bob d3" cx="120" cy="40" r="18" fill="var(--sage-100)"/><circle class="bob d4" cx="150" cy="118" r="16" fill="var(--violet-200)"/><circle class="bob d2" cx="86" cy="124" r="14" fill="var(--sun-200)"/><circle class="bob" cx="120" cy="82" r="30" fill="var(--sun-400)"/><path d="M110 82c3 4 17 4 20 0" stroke="#2F2663" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="111" cy="74" r="2.5" fill="#2F2663"/><circle cx="129" cy="74" r="2.5" fill="#2F2663"/></svg>` },
  { bg: 'var(--sun-100)', wave: 'var(--sun-200)', wave2: 'var(--sun-400)', a: 'Your first step towards therapy', b: 'takes courage.', note: 'and you just took it',
    sub: 'Reaching out about how you feel is how support begins for most people. Be proud of that.',
    art: `<svg viewBox="0 0 240 150" class="iart" aria-hidden="true"><g class="rise"><circle cx="120" cy="120" r="54" fill="var(--sun-400)"/><g stroke="var(--peach-400)" stroke-width="5" stroke-linecap="round"><path d="M120 46V28"/><path d="M70 66L58 54"/><path d="M170 66l12-12"/><path d="M52 104H34"/><path d="M188 104h18"/></g></g><rect x="20" y="118" width="200" height="40" fill="var(--sun-100)"/><path d="M20 118h200" stroke="var(--peach-400)" stroke-width="4" stroke-linecap="round"/></svg>` },
  { bg: 'var(--peach-100)', wave: '#FFD9BF', wave2: 'var(--peach-400)', a: "Don't worry.", b: "We've got you.", note: 'one small step at a time',
    sub: 'Talk to Dost, try a 2-minute exercise, or speak to a counsellor. Private, free and here 24×7.',
    art: `<svg viewBox="0 0 240 150" class="iart" aria-hidden="true"><g class="beat"><path d="M120 132C86 110 62 90 62 64c0-17 13-28 28-28 13 0 22 8 30 18 8-10 17-18 30-18 15 0 28 11 28 28 0 26-24 46-58 68z" fill="var(--peach-400)"/><path d="M96 70c4-8 12-12 20-11" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/></g></svg>` },
];
const waveSvg = (c1, c2) => `<div class="waves" aria-hidden="true"><svg class="wv w1" viewBox="0 0 1600 120" preserveAspectRatio="none"><path d="M0 60 Q100 20 200 60 T400 60 T600 60 T800 60 T1000 60 T1200 60 T1400 60 T1600 60 V120 H0Z" fill="${c1}"/></svg><svg class="wv w2" viewBox="0 0 1600 120" preserveAspectRatio="none"><path d="M0 70 Q100 40 200 70 T400 70 T600 70 T800 70 T1000 70 T1200 70 T1400 70 T1600 70 V120 H0Z" fill="${c2}" opacity=".35"/></svg></div>`;
function slideHTML(i) {
  const s = SLIDES[i], last = i === SLIDES.length - 1;
  return `<div class="iwrap in">${s.art}
    <h1 class="ibig"><span>${esc(s.a)}</span><span class="swash">${esc(s.b)}</span></h1>
    <p class="note" style="font-size:22px;margin:0">${esc(s.note)}</p>
    <p class="lg muted" style="margin:0;max-width:310px">${esc(s.sub)}</p></div>
    <div class="ifoot"><div class="dots" aria-hidden="true">${SLIDES.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
      ${last ? `<button class="btn primary" data-a="intro-next" style="padding:0 28px">Let's begin ${ic('send')}</button>` : `<button class="inext" data-a="intro-next" aria-label="Next">${ic('send')}</button>`}</div>`;
}
V.intro = () => {
  const i = X.slide || 0, s = SLIDES[i];
  return `<div class="screen notab intro" id="intro" style="background:${s.bg};padding-top:calc(var(--sb) + 12px)">
    <div class="row between" style="position:relative;z-index:6"><span class="lbl muted">${i + 1} of ${SLIDES.length}</span><button class="link" data-a="intro-skip">Skip</button></div>
    ${slideHTML(i)}${waveSvg(s.wave, s.wave2)}</div>`;
};
function introNext() {
  const i = X.slide || 0;
  if (i >= SLIDES.length - 1) { S.onboarded = true; S.view = 'home'; S.tab = 'home'; S.tour = 0; save(); X = {}; render(); return; }
  if (X.busy) return; X.busy = true;
  const host = document.getElementById('intro'), n = SLIDES[i + 1];
  const layer = document.createElement('div'); layer.className = 'liquid'; layer.style.background = n.bg;
  host.appendChild(layer);
  setTimeout(() => { X.slide = i + 1; X.busy = false; render(); }, 720);
}
function bindIntro() {
  const el = document.getElementById('intro'); if (!el) return;
  let x0 = null;
  el.onpointerdown = e => { if (e.target.closest('button')) return; x0 = e.clientX; };
  el.onpointerup = e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (dx < -50) introNext(); };
}

/* ---- First-visit tour: spotlight one feature at a time with a short explanation ---- */
const TOUR = [
  { sel: '.moodcard', title: 'A 5-second daily check-in', text: 'Tap how you feel once a day. It disappears for 24 hours and builds your mood history.' },
  { sel: '.bell', title: 'Notifications', text: 'Reminders, event nudges and the odd quick survey. The number shows what you haven\'t read yet.' },
  { sel: '.moodchip', title: 'Your mood score', text: 'Your average for the week, out of 100. Tap it to see your week, month and year, and what lifts you.' },
  { sel: '#t-step', title: "Today's one step", text: 'One small thing to do today, picked by Dost from your plan. Never a long to-do list.' },
  { sel: '#t-ritual', title: 'Your 5 minutes today', text: 'A short morning reset or evening wind-down: breathe, write one line, name your feelings, then see how you are doing.' },
  { sel: '#t-events', title: 'Live events, free', text: 'Webinars and community circles, like Cheers to Men tomorrow. Register in seconds; join anonymously if you like.' },
  { sel: '.tab[data-v="experts"]', title: 'Experts', text: 'Find your counsellor. Take the smart match, swipe through profiles and book a time from their calendar.' },
  { sel: '.orbbtn', title: 'Dost, your AI guide', text: "Talk or type anytime. Dost listens, asks a few questions and finds the right next step. It's not a doctor." },
  { sel: '.tab[data-v="grow"]', title: 'Grow', text: 'Short exercises, 7-day programs and quick checks for stress, sleep and mood.' },
  { sel: '.tab[data-v="me"]', title: 'Me', text: 'Your journey, journal, free sessions left and privacy. Only you see what is here.' },
  { sel: '#t-sos', title: 'SOS, always here', text: 'For the hardest moments. One tap connects you to a real counsellor within 5 minutes, 24×7.' },
];
function tourSteps() { return TOUR.filter(t => document.querySelector('#app ' + t.sel)); }
function drawTour() {
  let box = document.getElementById('tour');
  const off = () => { if (box) box.remove(); };
  if (S.view !== 'home' || S.tour === null || S.tour === undefined || SHEET) return off();
  const steps = tourSteps(), i = S.tour;
  if (i >= steps.length) { S.tour = null; save(); return off(); }
  const st = steps[i], el = document.querySelector('#app ' + st.sel);
  if (el.closest('.screen')) el.scrollIntoView({ block: 'center', behavior: 'instant' });
  const ar = $app.getBoundingClientRect(), k = ar.width / $app.offsetWidth, r = el.getBoundingClientRect();
  const pad = 6, x = (r.left - ar.left) / k - pad, y = (r.top - ar.top) / k - pad, w = r.width / k + pad * 2, h = r.height / k + pad * 2;
  const round = el.matches('.orbbtn, .moodchip') ? 999 : el.matches('.tab') ? 22 : 24;
  const W = $app.offsetWidth, H = $app.offsetHeight, below = y + h / 2 < H * 0.55;
  if (!box) {
    box = document.createElement('div'); box.id = 'tour'; box.className = 'tour';
    box.innerHTML = '<div class="tour-catch" data-a="tour-noop"></div><div class="tour-spot"></div><div class="tour-tipwrap"></div>';
    $app.appendChild(box);
  }
  Object.assign(box.querySelector('.tour-spot').style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', borderRadius: round + 'px' });
  box.querySelector('.tour-tipwrap').innerHTML = `<div class="tour-tip ${below ? 'down' : 'up'}" role="dialog" aria-live="polite" aria-label="${esc(st.title)}" style="${below ? `top:${y + h + 14}px` : `bottom:${H - y + 14}px`};--ax:${Math.max(28, Math.min(W - 44, x + w / 2 - 16))}px">
      <div class="row between"><span class="eyebrow">${i + 1} of ${steps.length}</span><button class="link" data-a="tour-skip">Skip tour</button></div>
      <b class="t2">${esc(st.title)}</b><p style="margin:0" class="muted">${esc(st.text)}</p>
      <div class="row between"><div class="dots" aria-hidden="true">${steps.map((_, n) => `<i class="${n === i ? 'on' : ''}"></i>`).join('')}</div>
        <div class="row" style="gap:8px">${i > 0 ? `<button class="btn ghost sm" data-a="tour-back">Back</button>` : ''}<button class="btn primary sm" data-a="tour-next">${i === steps.length - 1 ? 'Got it' : 'Next'}</button></div></div></div>`;
}

/* ---- Events: live webinars and community circles, with a short typographic sign-up ---- */
const EVENTS = [
  { id: 'men', kicker: "International Men's Day", a: 'Cheers', b: 'to Men.', theme: 'ev-ink', date: [2026, 10, 19], time: '6 pm', mins: 60, format: 'Live circle · online · camera optional',
    host: 'Rohan Mehta & Kabir Singh, YourDOST counsellors', blurb: 'An honest, no-pressure evening for men to talk about the stuff we usually carry alone: work, family, money and "sab theek hai".',
    take: ['How to say "I\'m not okay" to someone you trust', 'A 3-minute reset for heavy days', 'Where to get help, privately'] },
  { id: 'toolkit', kicker: 'Webinar', a: "Men's Toolkit", b: 'for mental health.', theme: 'ev-peach', date: [2026, 10, 22], time: '11 am', mins: 45, format: 'Webinar · online · questions anonymous',
    host: 'Aditya Rao, clinical psychologist', blurb: 'Practical tools for stress, anger and low mood, built for men who prefer doing to talking.',
    take: ['Spot the early signs of burnout', 'Three tools you can use at your desk', 'How to support a friend who is struggling'] },
  { id: 'w360', kicker: 'Wellbeing 360', a: 'Building health', b: 'into everyday life.', theme: 'ev-sage', date: [2026, 10, 26], time: '5 pm', mins: 45, format: 'Webinar · online',
    host: 'Priya Iyer, clinical psychologist', blurb: 'Sleep, movement, food and screens: small daily habits that add up to feeling better, without a big overhaul.',
    take: ['A wind-down routine that works', 'Moving more without a gym', 'Screen habits that protect your mood'] },
  { id: 'yoga', kicker: 'Live session', a: 'Desk yoga', b: '& breathwork.', theme: 'ev-violet', date: [2026, 10, 29], time: '8 am', mins: 20, format: 'Live · online · cameras off',
    host: 'Farah Siddiqui, counsellor', blurb: 'Twenty gentle minutes to loosen your shoulders and slow your breathing before the day starts.',
    take: ['A 5-minute stretch you can do in a chair', 'Box breathing, guided', 'A calmer start to your workday'] },
];
const EVM = Object.fromEntries(EVENTS.map(e => [e.id, e]));
const evDate = e => new Date(e.date[0], e.date[1], e.date[2]);
function evWhen(e) {
  const d = evDate(e), t0 = new Date(); t0.setHours(0, 0, 0, 0);
  const diff = Math.round((d - t0) / 86400000);
  return (diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : dayLabel(d)) + ' · ' + e.time;
}
function evCard(e, i) {
  const reg = S.regs.includes(e.id);
  return `<button class="evcard ${e.theme}" data-a="event" data-v="${e.id}" aria-label="${esc(e.a + ' ' + e.b)}, ${evWhen(e)}${reg ? ', you are registered' : ''}">
    <span class="row between"><span class="evkick">${esc(e.kicker)}</span>${reg ? `<span class="evin">${ic('check')}You're in</span>` : `<span class="evfree">Free</span>`}</span>
    <span class="evtitle"><span>${esc(e.a)}</span><span class="evb">${esc(e.b)}</span></span>
    <span class="row between" style="align-items:flex-end"><span class="evmeta">${evWhen(e)}<br>${e.mins} min · online</span><span class="evgo">${reg ? 'View' : 'Register'}</span></span></button>`;
}
V.event = () => {
  const e = EVM[S.params.id], reg = S.regs.includes(e.id), f = X.f || (X.f = { name: S.guest ? '' : S.name, email: S.guest ? '' : S.email, anon: true, ask: '' });
  return `<div class="screen notab">${top('')}
    <div class="evhero ${e.theme}"><span class="evkick">${esc(e.kicker)}</span><h1 class="evtitle big"><span>${esc(e.a)}</span><span class="evb">${esc(e.b)}</span></h1>
      <span class="evmeta">${evWhen(e)} · ${e.mins} min<br>${esc(e.format)}</span></div>
    <p class="lg" style="margin:0">${esc(e.blurb)}</p>
    <div class="stack" style="gap:6px"><span class="lbl muted">You'll take away</span>${e.take.map(t => `<span class="row" style="gap:8px;align-items:flex-start"><span style="color:var(--sage-600)">${ic('check')}</span>${esc(t)}</span>`).join('')}</div>
    <span class="cap">Hosted by ${esc(e.host)}</span>
    ${reg ? `<div class="card tint-sage stack" style="box-shadow:none"><b class="t2">You're registered</b><span class="muted">We'll remind you an hour before. The link opens 10 minutes early.</span>
        <div class="row wrap"><button class="btn primary sm" data-a="toast" data-v="Added to your calendar.">${ic('cal')}Add to calendar</button><button class="link" data-a="ev-cancel">Cancel my spot</button></div></div>`
    : `<form class="madlib" id="evform" autocomplete="on" onsubmit="return false">
      <span class="eyebrow">Save your spot, it's free</span>
      <p class="ml">Hi, I'm <label class="sr" for="ev-name">Your name</label><input id="ev-name" class="mlin" value="${esc(f.name)}" placeholder="your name" autocomplete="given-name">.<br>
        Send the link to <label class="sr" for="ev-email">Email</label><input id="ev-email" class="mlin wide" type="email" value="${esc(f.email)}" placeholder="you@company.com" autocomplete="email"><br>
        I'd like to join <button type="button" class="mlpick" data-a="ev-anon" aria-pressed="${f.anon}">${f.anon ? 'anonymously' : 'with my name'}</button>.</p>
      <label class="lbl" for="ev-ask">Anything you'd like covered? <span class="muted">(optional, anonymous)</span></label>
      <input id="ev-ask" class="field" value="${esc(f.ask)}" placeholder="e.g. how to talk to my dad" maxlength="140">
      <button class="btn primary block" data-a="ev-register">Register for free</button>
      <span class="cap">${ic('lock')} ${esc(S.company)} only sees how many people joined, never who.</span></form>`}
  </div>`;
};
V.evdone = () => {
  const e = EVM[S.params.id], nm = (X.nm || '').trim();
  return `<div class="screen notab evdone glow" style="justify-content:center;gap:18px">
    <span class="burst" aria-hidden="true">${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<i class="b${k}"></i>`).join('')}</span>
    <h1 class="yourein"><span>You're in${nm ? ',' : '.'}</span>${nm ? `<span class="swash">${esc(nm)}.</span>` : ''}</h1>
    <p class="note" style="font-size:24px;margin:0">showing up is the bravest part</p>
    <p class="lg" style="margin:0">See you ${esc(evWhen(e).replace(' · ', ' at '))} for <b>${esc(e.a + ' ' + e.b.replace(/\.$/, ''))}</b>. We'll send the link to your email and remind you an hour before.</p>
    <div class="stack"><button class="btn primary block" data-a="toast" data-v="Added to your calendar.">${ic('cal')}Add to calendar</button><button class="btn ghost block" data-a="tab" data-v="home">Back to Today</button></div></div>`;
};
let EVT = null;
function autoSlide() {
  clearInterval(EVT); EVT = null;
  const sc = document.getElementById('evscroll'); if (!sc || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let hold = 0, drag = null; sc.onscroll = () => updDots(sc);
  sc.onpointerdown = e => { hold = Date.now(); if (e.pointerType === 'mouse') { drag = { x: e.clientX, l: sc.scrollLeft, moved: false }; sc.style.scrollSnapType = 'none'; } };
  sc.onpointermove = e => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 4) drag.moved = true; sc.scrollLeft = drag.l - dx; };
  const endDrag = () => { if (!drag) return; const w = sc.firstElementChild.getBoundingClientRect().width + 12, moved = drag.moved; drag = null; sc.style.scrollSnapType = ''; sc.scrollTo({ left: Math.round(sc.scrollLeft / w) * w, behavior: 'smooth' }); if (moved) { sc._noClick = true; setTimeout(() => { sc._noClick = false; }, 60); } };
  sc.onpointerup = endDrag; sc.onpointerleave = endDrag;
  sc.onclickcapture = null; sc.addEventListener('click', e => { if (sc._noClick) { e.stopPropagation(); e.preventDefault(); } }, true);
  autoSlide.hold = () => { hold = Date.now(); };
  EVT = setInterval(() => {
    if (!document.body.contains(sc) || S.tour !== null && S.tour !== undefined) return;
    if (Date.now() - hold < 6000) return;
    const w = sc.firstElementChild.getBoundingClientRect().width + 12, k = Math.round(sc.scrollLeft / w), n = sc.children.length;
    sc.scrollTo({ left: ((k + 1) % n) * w, behavior: 'smooth' });
  }, 4000);
}
function evGo(i) { const sc = document.getElementById('evscroll'); if (!sc) return; if (autoSlide.hold) autoSlide.hold(); const w = sc.firstElementChild.getBoundingClientRect().width + 12; sc.scrollTo({ left: i * w, behavior: 'smooth' }); }
function updDots(sc) { const d = document.getElementById('evdots'); if (!d) return; const w = sc.firstElementChild.getBoundingClientRect().width + 12, k = Math.round(sc.scrollLeft / w); [...d.children].forEach((x, i) => x.classList.toggle('on', i === k)); }

/* ---- Notifications: in-app nudges with an unread count ---- */
function NOTIF_SEED() { return [
  { id: 'n1', kind: 'survey', icon: 'pen', tint: 'sun', title: 'Got 2 minutes?', body: 'Acme People team: a quick, anonymous pulse survey on how supported you feel.', when: 'Just now', read: false, go: ['survey', ''] },
  { id: 'n2', kind: 'event', icon: 'people', tint: 'violet', title: 'Cheers to Men is tomorrow', body: 'A live circle for International Men\'s Day, 6 pm. Save your spot.', when: '1 h ago', read: false, go: ['event', 'men'] },
  { id: 'n3', kind: 'session', icon: 'video', tint: 'peach', title: 'Session 3 with Neha', body: 'Mon 24 Nov at 6 pm. Want to note what you\'d like to talk about?', when: 'Today', read: false, go: ['tab', 'experts'] },
  { id: 'n4', kind: 'dost', icon: 'chat', tint: 'sage', title: 'Dost: how did the ritual go?', body: 'Last time, your switch-off ritual helped on 3 of 5 nights. Want to check in?', when: 'Yesterday', read: false, go: ['dost', ''] },
  { id: 'n5', kind: 'tip', icon: 'spark', tint: 'sun', title: 'New: Desk yoga & breathwork', body: '20 gentle minutes before work, Sat 29 Nov.', when: '3 days ago', read: true, go: ['event', 'yoga'] },
]; }
const unread = () => S.notifs.filter(n => !n.read).length;
function bell() {
  const n = unread();
  return `<button class="iconbtn bell ${X.bellBump ? 'bump' : ''}" data-a="notifs" aria-label="Notifications${n ? `, ${n} unread` : ''}">${ic('bell')}${n ? `<span class="badge">${n > 9 ? '9+' : n}</span>` : ''}</button>`;
}
V.notifs = () => {
  const fresh = S.notifs.filter(n => !n.read), old = S.notifs.filter(n => n.read);
  const row = n => `<button class="li nrow ${n.read ? '' : 'unread'}" data-a="notif" data-v="${n.id}"><span class="dot tint-${n.tint}">${ic(n.icon)}</span>
      <span class="grow"><b>${esc(n.title)}</b><span class="cap" style="display:block;margin-top:2px">${esc(n.body)}</span><span class="cap" style="display:block;margin-top:4px;color:var(--ink-soft)">${esc(n.when)}</span></span>${n.read ? '' : '<i class="udot" aria-label="Unread"></i>'}</button>`;
  return `<div class="screen notab">${top('Notifications', fresh.length ? `<button class="link" data-a="notif-all">Mark all as read</button>` : '')}
    ${fresh.length ? `<section class="sec"><span class="eyebrow">New · ${fresh.length}</span><div class="list">${fresh.map(row).join('')}</div></section>` : `<div class="card stack" style="text-align:center;box-shadow:none;background:var(--surface-sunken)"><b>You're all caught up</b><span class="muted">New nudges and reminders will show up here.</span></div>`}
    ${old.length ? `<section class="sec"><span class="eyebrow">Earlier</span><div class="list">${old.map(row).join('')}</div></section>` : ''}
    <p class="cap" style="margin:0">${ic('lock')} Nudges never include what you shared with Dost or a counsellor.</p></div>`;
};
const SURVEY = [
  { q: 'How supported do you feel at work right now?', lo: 'Not at all', hi: 'Very' },
  { q: 'How easy was it to find help when you needed it?', lo: 'Very hard', hi: 'Very easy' },
  { q: 'How likely are you to recommend YourDOST to a colleague?', lo: 'Not likely', hi: 'Very likely' },
];
V.survey = () => {
  const a = X.sv || (X.sv = []), i = a.length;
  if (i >= SURVEY.length) return `<div class="screen notab glow" style="justify-content:center;text-align:center;gap:16px">
    <span class="burst" aria-hidden="true" style="align-self:center">${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<i class="b${k}"></i>`).join('')}</span>
    <h1 class="yourein" style="justify-items:center"><span>Thank you.</span><span class="swash">Heard.</span></h1>
    <p class="note" style="font-size:22px;margin:0">your voice shapes what we build</p>
    <p class="muted" style="margin:0">Your answers are anonymous. ${esc(S.company)} only sees totals from 10 or more people.</p>
    <button class="btn primary block" data-a="tab" data-v="home">Back to Today</button></div>`;
  const Q = SURVEY[i];
  return `<div class="screen notab">${top('Pulse survey · ' + (i + 1) + ' of ' + SURVEY.length)}
    <div class="bar"><i style="width:${(i + 1) / SURVEY.length * 100}%;background:var(--violet-600)"></i></div>
    <h2 class="t1">${esc(Q.q)}</h2>
    <div class="scale5">${[1, 2, 3, 4, 5].map(v => `<button data-a="sv" data-v="${v}">${v}</button>`).join('')}</div>
    <div class="row between"><span class="cap">${esc(Q.lo)}</span><span class="cap">${esc(Q.hi)}</span></div>
    <div style="flex:1"></div><p class="cap" style="margin:0">${ic('lock')} Anonymous · about 1 minute</p></div>`;
};

/* ---- Daily ritual: about 5 minutes, morning reset or evening wind-down ----
   Arrive (mood now) → Breathe 2 min (a different exercise each day) → Write (intention or gratitude)
   → Feel (name it, mood now) → Close (before/after, kind words, help always one tap away).
   Research lines are fixed and cited; nothing here is written by the AI. */
const R_BREATH = {
  box: { name: 'Box breathing', how: 'In 4, hold 4, out 4, hold 4.', pattern: [['Breathe in', 4], ['Hold', 4], ['Breathe out', 4], ['Hold', 4]] },
  sigh: { name: 'Cyclic sighing', how: 'A deep breath in, a short top-up, then a long, slow sigh out.', pattern: [['Breathe in', 3], ['Sip in a little more', 1], ['Long breath out', 6]] },
  slow: { name: 'Slow, even breathing', how: 'In for 5, out for 5. About six breaths a minute.', pattern: [['Breathe in', 5], ['Breathe out', 5]] },
  b478: { name: '4-7-8 wind-down', how: 'In 4, hold 7, out slowly for 8.', pattern: [['Breathe in', 4], ['Hold', 7], ['Breathe out', 8]] },
};
const R_SLOTS = {
  morning: { name: 'Morning reset', icon: 'sun', tint: 'sun', breaths: ['box', 'sigh', 'slow'],
    prompts: ["What's one thing you want to make time for today?", 'What would make today a good day, even a little?', "Who could you be kind to today, including yourself?"],
    hint: 'Be specific: when, where, how.', why: 'Planning when and how you will do something makes you more likely to follow through (Gollwitzer, American Psychologist, 1999).',
    close: 'Have a gentle day. Come back tonight to wind down.' },
  evening: { name: 'Evening wind-down', icon: 'moon', tint: 'violet', breaths: ['b478', 'sigh', 'slow'],
    prompts: ["What's one good thing that happened today, and why did it happen?", "What's one thing you're letting go of tonight?", 'What did you handle well today, even if it was small?'],
    hint: 'One or two lines is plenty.', why: 'Writing down good things each day lifted happiness and eased low mood for up to six months (Seligman et al., American Psychologist, 2005).',
    close: 'Rest well. Come back tomorrow morning.' },
};
const FEELS = ['Calm', 'Hopeful', 'Grateful', 'Light', 'Proud', 'Tired', 'Anxious', 'Low', 'Irritable', 'Overwhelmed', 'Lonely', 'Okay'];
const ritualSlot = () => new Date().getHours() < 15 ? 'morning' : 'evening';
const doy = () => { const d = new Date(), s = new Date(d.getFullYear(), 0, 0); return Math.floor((d - s) / 86400000); };
function ritualToday(o) { const sl = o || ritualSlot(), R = R_SLOTS[sl]; return { sl, R, bk: R.breaths[doy() % 3], prompt: R.prompts[doy() % R.prompts.length] }; }
const ritualDone = sl => S.rituals.some(r => r.d === dkey(new Date()) && r.slot === sl);
function ritualCard() {
  const { sl, R, bk } = ritualToday(), done = ritualDone(sl), week = S.rituals.filter(r => r.d > dkey(new Date(Date.now() - 7 * 86400000))).length;
  const steps = [['Breathe', '2 min'], ['Write', '1 line'], ['Listen', '1 min'], ['Feel', 'name it'], ['Close', 'recap']];
  return `<section class="sec" id="t-ritual"><div class="sec-h"><h2 class="t2">Your 5 minutes today</h2><span class="cap">${week ? week + ' this week' : 'about 5 min'}</span></div>
    <button class="ritual tint-${R.tint} ${done ? 'done' : ''}" data-a="ritual" aria-label="${R.name}${done ? ', done today' : ''}">
      <span class="row between"><span class="row" style="gap:8px"><span class="dot" style="background:var(--surface-raised)">${ic(R.icon)}</span><span class="stack" style="gap:0;text-align:left"><b class="t2" style="font-size:19px">${R.name}</b><span class="cap">Today: ${esc(R_BREATH[bk].name.toLowerCase())}</span></span></span>
        ${done ? `<span class="tag sage">${ic('check')}Done</span>` : ''}</span>
      <span class="rsteps">${steps.map(([a, b], i) => `<span class="rstep"><i>${done ? ic('check') : i + 1}</i><b>${a}</b><span>${b}</span></span>`).join('')}</span>
      <span class="btn ${done ? 'ghost' : 'primary'} block">${done ? 'See today\'s recap' : 'Start · about 5 minutes'}</span></button>
    <p class="cap" style="margin:0">Best in the morning or before sleep. For more exercises, see <button class="link" data-a="tab" data-v="grow" style="padding:0">Grow</button>.</p></section>`;
}
V.ritual = () => {
  const T = ritualToday(S.params.slot), { sl, R } = T, B = R_BREATH[T.bk];
  const r = X.r || (X.r = ritualDone(sl) ? Object.assign({ step: 5, review: true }, S.rituals.filter(x => x.slot === sl).slice(-1)[0]) : { step: 0, pre: null, post: null, feels: [], text: '' });
  const nav = (lbl, act = 'r-next', dis = false) => `<button class="btn primary block" data-a="${act}" ${dis ? 'disabled style="opacity:.45"' : ''}>${lbl}</button>`;
  const head = `<div class="row between">${r.step === 0 || r.step === 5 || r.review ? `<button class="iconbtn" data-a="back" aria-label="Close">${ic('close')}</button>` : `<button class="iconbtn" data-a="r-prev" aria-label="Back">${ic('back')}</button>`}
      <span class="lbl">${R.name}</span><button class="iconbtn helpdot" data-a="help" aria-label="Talk to someone now">${ic('phone')}</button></div>
    <div class="rprog" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map(k => `<i class="${k <= r.step ? 'on' : ''}"></i>`).join('')}</div>`;
  const faces = (key) => `<div class="moods">${MOODS.map((m, i) => `<button class="mood ${r[key] === i ? 'sel' : ''}" data-a="r-mood" data-k="${key}" data-v="${i}" aria-pressed="${r[key] === i}"><span class="mface" style="--mf:${MOOD_FILL[i]};${r[key] === i ? 'background:var(--mf)' : ''}">${face(i)}</span><span>${m[0]}</span></button>`).join('')}</div>`;
  let body = '';
  if (r.step === 0) body = `<div class="stack" style="gap:6px"><span class="eyebrow">${sl === 'morning' ? 'Good morning' : 'Good evening'}, ${esc(S.name)}</span><h1 class="rbig">Let's take<br><span class="swash">5 minutes</span><br>for you.</h1></div>
      <ol class="rlist"><li><b>Breathe</b> · 2 min of ${esc(B.name.toLowerCase())}</li><li><b>Write</b> · one line, just for you</li><li><b>Listen</b> · a minute of calming sound</li><li><b>Feel</b> · name what's there</li><li><b>Close</b> · see how you're doing</li></ol>
      <div class="card stack" style="box-shadow:none;background:var(--surface-raised)"><b>First, how are you right now?</b>${faces('pre')}</div>
      <div style="flex:1"></div>${nav('Begin', 'r-next', r.pre === null)}<button class="link" data-a="r-next" style="justify-self:center">Skip this question</button>`;
  if (r.step === 1) body = `<div class="stack" style="gap:6px;text-align:center"><span class="eyebrow">Step 1 · Breathe</span><h2 class="t1">${esc(B.name)}</h2><p class="muted" style="margin:0">${esc(B.how)}</p></div>
      <div class="breath ${X.rb ? '' : 'idle'}" id="rbreath"><i></i><b id="rphase">${X.rb ? '' : 'Ready when you are'}</b></div>
      <p class="cap" style="text-align:center;margin:0" id="rtime">${X.rbDone ? 'Nicely done.' : X.rb ? '' : '2 minutes · follow the circle'}</p>
      <p class="cap rwhy">${ic('book')} Slow breathing for a few minutes a day lifted mood in a month-long study (Balban et al., Cell Reports Medicine, 2023).</p>
      <div style="flex:1"></div>${X.rbDone ? nav('Next: write') : X.rb ? `<button class="btn ghost block" data-a="r-bdone">I'm done</button>` : `<button class="btn sage block" data-a="r-brun">${ic('play')}Start breathing</button><button class="link" data-a="r-next" style="justify-self:center">Skip</button>`}`;
  if (r.step === 2) body = `<div class="stack" style="gap:6px"><span class="eyebrow">Step 2 · Write</span><h2 class="rq">${esc(T.prompt)}</h2><span class="note" style="font-size:18px">${esc(R.hint)}</span></div>
      <label class="sr" for="rtext">Your answer</label><textarea id="rtext" class="field rtext" rows="5" placeholder="Just for you. No one else reads this.">${esc(r.text || '')}</textarea>
      <p class="cap rwhy">${ic('book')} ${esc(R.why)}</p>
      <div style="flex:1"></div>${nav('Next: listen')}<button class="link" data-a="r-next" style="justify-self:center">Skip writing today</button>`;
  if (r.step === 3) { const sk = X.snd || SOUND_DAY(), left = X.lsLeft ?? 60;
    body = `<div class="stack" style="gap:6px"><span class="eyebrow">Step 3 · Listen</span><h2 class="rq">Close your eyes. Just listen for a minute.</h2><span class="muted">Let the sound do the work. Headphones help.</span></div>
      <div class="row" style="gap:8px;justify-content:center">${Object.entries(SOUNDS).map(([k, o]) => `<button class="chip" data-a="r-snd" data-v="${k}" aria-pressed="${sk === k}">${o.name}</button>`).join('')}</div>
      <div class="listen ${X.ls ? 'on' : ''}" aria-hidden="true"><span class="lwave">${[0, 1, 2, 3, 4, 5, 6].map(k => `<i style="--k:${k}"></i>`).join('')}</span><b id="ltime">${X.lsDone ? 'Nicely done.' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}</b></div>
      <p class="cap rwhy">${ic('book')} Listening to nature sounds helped people recover from stress faster than traffic noise (Alvarsson et al., Int. J. Environmental Research and Public Health, 2010).</p>
      <div style="flex:1"></div>${X.lsDone ? nav('Next: how are you feeling?') : X.ls ? `<button class="btn ghost block" data-a="r-lsdone">I'm done</button>` : `<button class="btn sage block" data-a="r-ls">${ic('play')}Play · 1 minute</button><button class="link" data-a="r-next" style="justify-self:center">Skip</button>`}`; }
  if (r.step === 4) body = `<div class="stack" style="gap:6px"><span class="eyebrow">Step 4 · Feel</span><h2 class="rq">What are you feeling right now?</h2><span class="muted">Pick up to 3. Every feeling is allowed.</span></div>
      <div class="row wrap">${FEELS.map(f => `<button class="chip" data-a="r-feel" data-v="${f}" aria-pressed="${r.feels.includes(f)}">${f}</button>`).join('')}</div>
      <div class="card stack" style="box-shadow:none;background:var(--surface-raised)"><b>And overall?</b>${faces('post')}</div>
      <p class="cap rwhy">${ic('book')} Putting feelings into words can calm the brain's stress response (Lieberman et al., Psychological Science, 2007).</p>
      <div style="flex:1"></div>${nav('See my recap', 'r-finish')}`;
  if (r.step === 5) {
    const up = r.pre !== null && r.post !== null ? r.post - r.pre : null, heavy = r.post !== null && r.post <= 0 || (up !== null && up < 0);
    const wk = S.rituals.filter(x => x.d > dkey(new Date(Date.now() - 7 * 86400000))).length;
    const line = heavy ? "It's okay if today felt heavy. You still showed up for yourself, and that matters." : up > 0 ? 'You feel a little lighter than when you started. That\'s the breath and the words working.' : 'Steady is good. Small, regular moments like this add up over weeks.';
    body = `<span class="burst" aria-hidden="true">${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<i class="b${k}"></i>`).join('')}</span>
      <h1 class="rbig">${heavy ? 'Thank you<br>for <span class="swash">showing up</span>.' : 'Well done,<br><span class="swash">' + esc(S.name) + '</span>.'}</h1>
      <p class="lg" style="margin:0">${esc(line)}</p>
      <div class="card stack" style="gap:10px">
        ${r.pre !== null && r.post !== null ? `<div class="row between"><span class="row" style="gap:6px"><span class="mface" style="--mf:${MOOD_FILL[r.pre]};background:var(--mf);width:32px;height:32px">${face(r.pre, 20)}</span><span class="cap">${MOODS[r.pre][0]}</span></span><span class="cap">→</span><span class="row" style="gap:6px"><span class="mface" style="--mf:${MOOD_FILL[r.post]};background:var(--mf);width:32px;height:32px">${face(r.post, 20)}</span><span class="cap">${MOODS[r.post][0]}</span></span></div>` : ''}
        ${r.feels.length ? `<span><span class="lbl muted">You named</span><br>${r.feels.map(f => `<span class="tag violet" style="margin:4px 4px 0 0">${f}</span>`).join('')}</span>` : ''}
        ${r.text ? `<span><span class="lbl muted">You wrote</span><br><span class="note" style="font-size:19px;color:var(--ink)">“${esc(r.text.slice(0, 140))}${r.text.length > 140 ? '…' : ''}”</span></span>` : ''}
        <span class="cap">${wk} ritual${wk === 1 ? '' : 's'} this week · saved only on this phone</span></div>
      ${affirmCard(heavy)}
      <p class="note" style="font-size:20px;margin:0">${esc(R.close)} I'm here whenever you need me. · Dost</p>
      ${heavy ? `<button class="btn helpbtn block" data-a="help">${ic('phone')}Talk to someone now</button><button class="btn primary block" data-a="dost">Talk it through with Dost</button>`
        : `<div class="row" style="gap:10px"><button class="btn soft" style="flex:1" data-a="dost">${ic('mic')}Talk to Dost</button><button class="btn helpbtn" style="flex:1" data-a="sos">${ic('phone')}SOS</button></div>`}
      <button class="link" data-a="tab" data-v="home" style="justify-self:center">Done for today</button>`;
  }
  return `<div class="screen notab ritualscr tint-${R.tint}" style="gap:18px">${head}${body}</div>`;
};
let RB = null;
function runRitualBreath() {
  if (RB) return;
  const B = R_BREATH[ritualToday().bk], total = 120, t0 = Date.now(); let step = 0;
  const tick = () => {
    const el = document.getElementById('rbreath'), ph = document.getElementById('rphase'), tm = document.getElementById('rtime');
    if (!el || S.view !== 'ritual' || !X.rb) { RB = null; return; }
    const left = Math.max(0, total - Math.round((Date.now() - t0) / 1000));
    if (left <= 0) { RB = null; X.rbDone = true; X.rb = false; render(); return; }
    const [label, secs] = B.pattern[step]; ph.textContent = label;
    const ring = el.querySelector('i'); ring.style.transitionDuration = secs + 's';
    if (/in|Sip/.test(label) && !/out/.test(label)) ring.style.transform = label.startsWith('Sip') ? 'scale(1.08)' : 'scale(1)'; else if (/out/.test(label)) ring.style.transform = 'scale(.55)';
    step = (step + 1) % B.pattern.length; RB = setTimeout(tick, secs * 1000);
  };
  const clock = setInterval(() => { const tm = document.getElementById('rtime'); if (!tm || !X.rb) return clearInterval(clock); const left = Math.max(0, total - Math.round((Date.now() - t0) / 1000)); tm.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')} left`; }, 1000);
  tick();
}

/* ---- Kind words to take away (fixed, written by people, not the AI) ---- */
const AFFIRM = ['I am allowed to take things one step at a time.', 'I am doing better than I think I am.', 'Small steps still move me forward.', 'I can be gentle with myself today.', 'Rest is not a reward. It is something I need.', 'I have handled hard days before. I can handle this one.', 'My feelings make sense, and they will pass.', 'I showed up for myself today. That counts.'];
const AFFIRM_HEAVY = ["It's okay to not be okay right now.", 'This feeling is real, and it will not last forever.', 'I do not have to fix everything tonight.', 'Asking for help is a strong thing to do.'];
function affirmCard(heavy) {
  const a = heavy ? AFFIRM_HEAVY : AFFIRM, i = ((X.af ?? doy()) % a.length + a.length) % a.length;
  return `<div class="affirm"><span class="row between"><span class="lbl">Take this with you</span><button class="link" data-a="r-af" style="padding:0">Another one</button></span>
    <p class="affirm-t" aria-live="polite">“${esc(a[i])}”</p>
    <span class="cap">Read it slowly, twice. Being kind to yourself is linked to less anxiety and stress (MacBeth &amp; Gumley, Clinical Psychology Review, 2012).</span></div>`;
}

/* ---- Calming sounds, made in the browser (no audio files) ---- */
const SOUNDS = { rain: { name: 'Soft rain', blurb: 'Steady rain on a window' }, ocean: { name: 'Ocean waves', blurb: 'Slow waves, about 6 a minute' }, hum: { name: 'Warm hum', blurb: 'A low, gentle tone' } };
const SOUND_DAY = () => Object.keys(SOUNDS)[doy() % 3];
let AC = null, SND = null;
function noiseBuf(brown) {
  const n = AC.sampleRate * 4, b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0); let last = 0;
  for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w; }
  return b;
}
function playSound(k) {
  stopSound(true);
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  if (AC.state === 'suspended') AC.resume();
  const t = AC.currentTime, out = AC.createGain(), nodes = [];
  out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(0.55, t + 2); out.connect(AC.destination);
  const osc = (f, type = 'sine') => { const o = AC.createOscillator(); o.type = type; o.frequency.value = f; nodes.push(o); return o; };
  if (k === 'hum') {
    [[110, .16], [164.8, .09], [220, .05]].forEach(([f, v], i) => { const o = osc(f), g = AC.createGain(); g.gain.value = v; const l = osc(.12 + i * .05), lg = AC.createGain(); lg.gain.value = v * .5; l.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(out); });
  } else {
    const src = AC.createBufferSource(); src.buffer = noiseBuf(k === 'ocean'); src.loop = true; nodes.push(src);
    const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = k === 'ocean' ? 900 : 5200;
    const hp = AC.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = k === 'ocean' ? 60 : 500;
    const g = AC.createGain(); g.gain.value = k === 'ocean' ? .5 : .16;
    src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(out);
    if (k === 'ocean') { const l = osc(.1), lg = AC.createGain(); lg.gain.value = .42; l.connect(lg); lg.connect(g.gain); }
  }
  nodes.forEach(n => n.start());
  SND = { out, nodes, k };
}
function stopSound(now) {
  if (!SND || !AC) return; const { out, nodes } = SND; SND = null; const t = AC.currentTime;
  try { out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value, t); out.gain.linearRampToValueAtTime(0, t + (now ? .2 : .8)); } catch (e) {}
  setTimeout(() => { nodes.forEach(n => { try { n.stop(); } catch (e) {} }); out.disconnect(); }, now ? 250 : 900);
}
let LS = null;
function runListen() {
  if (LS) return; const t0 = Date.now() - (60 - (X.lsLeft ?? 60)) * 1000;
  LS = setInterval(() => {
    const el = document.getElementById('ltime');
    if (!el || S.view !== 'ritual' || !X.ls) { clearInterval(LS); LS = null; return; }
    const left = Math.max(0, 60 - Math.round((Date.now() - t0) / 1000)); X.lsLeft = left;
    el.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    if (!left) { clearInterval(LS); LS = null; X.ls = false; X.lsDone = true; stopSound(); render(); }
  }, 1000);
}

/* ---- SOS: for the hardest moments. One calm screen, then a counsellor within 5 minutes ---- */
const SOS_OPTS = [['heavy', 'Everything feels too heavy'], ['panic', "I can't calm down"], ['talk', 'I need to talk to someone, now'], ['harm', "I'm having thoughts of hurting myself"]];
const SOS_STEPS = ['Finding a counsellor who is free right now', 'Sharing only what you chose', 'Ringing your counsellor'];
const sosPill = () => `<button class="sospill" id="t-sos" data-a="sos" aria-label="SOS: talk to someone now"><i></i><span>SOS</span></button>`;
V.sos = () => {
  const s = X.sos || (X.sos = { picks: [], phase: S.params.now ? 'connect' : 'ask' });
  const e = EXM.e3;
  if (s.phase === 'ask') {
    const harm = s.picks.includes('harm');
    return `<div class="screen notab sosscr" style="gap:18px">
      <div class="row between"><button class="iconbtn" data-a="back" aria-label="Close">${ic('close')}</button><span class="lbl">SOS · private</span><span style="width:44px"></span></div>
      <h1 class="sosbig">Some moments<br>are <span class="swash">too heavy</span><br>to hold alone.</h1>
      <p class="lg" style="margin:0">A real counsellor can talk with you <b>in the next few minutes</b>. Free and private. ${esc(S.company)} never sees this.</p>
      <div class="stack" style="gap:8px"><span class="lbl muted">Tap what feels true · optional</span>
        ${SOS_OPTS.map(([k, l]) => `<button class="sosopt" data-a="sos-pick" data-v="${k}" aria-pressed="${s.picks.includes(k)}"><span class="sosck">${ic('check')}</span>${l}</button>`).join('')}</div>
      ${harm ? `<div class="card tint-help stack" style="box-shadow:none;gap:8px"><b>Thank you for telling us. You matter.</b><span class="muted">If you might act on these thoughts, please call now. Someone will answer.</span>
        <div class="row" style="gap:8px"><a class="btn helpbtn" style="flex:1;background:var(--surface-raised)" href="tel:112">${ic('phone')}Emergency 112</a><a class="btn helpbtn" style="flex:1;background:var(--surface-raised)" href="tel:14416">Tele-MANAS 14416</a></div></div>` : ''}
      <div style="flex:1"></div>
      <button class="btn sosgo block" data-a="sos-go">${ic('phone')}Talk now</button>
      <p class="cap" style="text-align:center;margin:0">Prefer a helpline? <a href="tel:14416">Tele-MANAS 14416</a>, free, 24×7 · <a href="tel:112">Emergency 112</a></p>
      <button class="link" data-a="back" style="justify-self:center">I'm okay for now</button></div>`;
  }
  if (s.phase === 'connect') return `<div class="screen notab sosscr" style="gap:16px">
      <div class="row between"><span style="width:44px"></span><span class="lbl">Connecting you</span><span style="width:44px"></span></div>
      <div class="ripple" aria-hidden="true"><i></i><i></i><i></i><span class="rcore"><b id="sospct">0</b><small>%</small></span></div>
      <h1 class="sosbig" style="text-align:center;font-size:34px">Someone will be<br>with you <span class="swash">within<br>5 minutes.</span></h1>
      <p class="note" style="text-align:center;font-size:20px;margin:0" id="sosnote">usually much sooner</p>
      <ol class="sossteps">${SOS_STEPS.map((t, i) => `<li id="sosst${i}" class="${i === 0 ? 'now' : ''}"><span class="sosck">${ic('check')}</span>${t}</li>`).join('')}</ol>
      <div class="card stack" style="box-shadow:none;background:var(--surface-raised);text-align:center;gap:4px"><span class="lbl muted">While you wait</span><b class="t2" id="sosbr">Breathe in slowly…</b></div>
      <div style="flex:1"></div>
      <p class="cap" style="text-align:center;margin:0">You can put the phone down. It will ring when they join.</p>
      <button class="link" data-a="sos-cancel" style="justify-self:center">Cancel</button></div>`;
  if (s.phase === 'here') return `<div class="screen notab sosscr" style="gap:16px;text-align:center">
      <div class="row between"><span style="width:44px"></span><span class="lbl">Connected</span><span style="width:44px"></span></div>
      <span class="sosface">${img(e)}</span>
      <h1 class="sosbig" style="font-size:40px"><span class="swash">${esc(fnm(e.name))}</span> is here<br>for you.</h1>
      <p class="muted" style="margin:0">${esc(e.title)} · ${e.yrs} years · ${esc(e.langs.join(', '))}</p>
      <p class="lg" style="margin:0">Take your time. You can start with “I don’t know where to begin.”</p>
      <div style="flex:1"></div>
      <button class="btn sosgo block" data-a="sos-join">${ic('phone')}Join call</button>
      <button class="link" data-a="sos-cancel" style="justify-self:center">Not now</button></div>`;
  return `<div class="screen notab sosscr" style="gap:16px;text-align:center">
      <div class="row between"><span style="width:44px"></span><span class="lbl">On call · private</span><span style="width:44px"></span></div>
      <span class="sosface live">${img(e)}</span>
      <h1 class="t1">${esc(e.name)}</h1><b class="t2" id="soscall">00:00</b>
      <p class="note" style="font-size:20px;margin:0">you're doing the right thing</p>
      <div style="flex:1"></div>
      <button class="btn helpbtn block" data-a="sos-end">End call</button></div>`;
};
let SOST = null;
function runSos() {
  if (SOST) return; const s = X.sos, t0 = Date.now();
  const brs = ['Breathe in slowly…', 'And out, even slower…'];
  SOST = setInterval(() => {
    if (S.view !== 'sos' || !X.sos || X.sos !== s) { clearInterval(SOST); SOST = null; return; }
    const e = (Date.now() - t0) / 1000;
    if (s.phase === 'connect') {
      const pc = document.getElementById('sospct'); if (!pc) return;
      const p = e >= 8.6 ? 100 : e >= 6.8 ? 99 : Math.min(98, Math.round(99 * (1 - Math.exp(-e / 1.9))));
      pc.textContent = p;
      const k = e < 2.6 ? 0 : e < 5 ? 1 : 2;
      SOS_STEPS.forEach((_, i) => { const li = document.getElementById('sosst' + i); if (li) li.className = i < k ? 'ok' : i === k ? 'now' : ''; });
      const nt = document.getElementById('sosnote'); if (nt) nt.textContent = p === 100 ? 'connected' : p >= 99 ? "just 1% away. they're picking up" : k === 2 ? 'ringing now' : 'usually much sooner';
      const br = document.getElementById('sosbr'); if (br) br.textContent = brs[Math.floor(e / 4) % 2];
      if (e >= 9.2) { s.phase = 'here'; clearInterval(SOST); SOST = null; render(); }
    } else if (s.phase === 'call') {
      const c = document.getElementById('soscall'); if (!c) return; const sec = Math.floor((Date.now() - s.c0) / 1000);
      c.textContent = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
    } else { clearInterval(SOST); SOST = null; }
  }, 200);
}

/* ---- Home ---- */
/* ---- Mood: one check-in every 24 hours, a score out of 100, history by week, month and year ---- */
const MOODS = [
  ['Rough day', 'M10.5 21c2.8-2.6 6.2-2.6 9 0', 'Thanks for being honest. Go easy on yourself today.'],
  ['Just okay', 'M11 19.5h8', 'Noted. Small steps still count today.'],
  ['Pretty good', 'M11 18.5c2.4 1.6 5.6 1.6 8 0', 'Nice. Let\'s keep that going.'],
  ['Much better', 'M10 18c2.8 2.6 7.2 2.6 10 0', 'Love that you\'re feeling better.'],
  ['In a great space', 'M9.5 17.2c3 3.8 8 3.8 11 0', 'Wonderful. Notice what\'s helping.'],
];
const MOOD_FILL = ['var(--violet-400)', 'var(--violet-200)', 'var(--sun-200)', 'var(--sun-400)', 'var(--peach-400)'];
const face = (i, size = 26) => `<svg viewBox="0 0 30 30" width="${size}" height="${size}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">${i === 4 ? '<path d="M9 12.5c.8-1.4 2.4-1.4 3.2 0M17.8 12.5c.8-1.4 2.4-1.4 3.2 0"/>' : '<circle cx="11" cy="12" r="1.1" fill="currentColor"/><circle cx="19" cy="12" r="1.1" fill="currentColor"/>'}<path d="${MOODS[i][1]}"/></svg>`;
function dkey(dt) { return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`; }
function seedMoods() { // a year of example check-ins: heavier Mondays, lighter weekends, better on days with a care activity
  const out = [], today = new Date(); let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let d = 365; d >= 1; d--) {
    const dt = new Date(today); dt.setDate(today.getDate() - d);
    if (rnd() < 0.2) continue;
    const dow = dt.getDay(), care = rnd() < 0.45;
    let v = 1.4 + (365 - d) / 365 * 1.2 + (dow === 1 ? -0.7 : 0) + (dow === 0 || dow === 6 ? 0.4 : 0) + (care ? 0.6 : 0) + (rnd() - 0.5) * 1.6;
    out.push({ d: dkey(dt), v: Math.max(0, Math.min(4, Math.round(v))), care });
  }
  return out;
}
const moodDue = () => !S.lastCheck || Date.now() - S.lastCheck > 24 * 3600 * 1000;
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
const toScore = v => v === null ? null : Math.round(v * 25);
function moodsSince(days, until = 0) {
  const from = new Date(); from.setDate(from.getDate() - days); const to = new Date(); to.setDate(to.getDate() - until);
  const a = dkey(from), b = dkey(to); return S.moods.filter(m => m.d > a && m.d <= b);
}
function ring(score, size = 34) {
  const r = size / 2 - 3, c = 2 * Math.PI * r, f = (score ?? 0) / 100;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--sun-100)" stroke-width="4"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--sun-400)" stroke-width="4" stroke-linecap="round" stroke-dasharray="${c * f} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Poppins,sans-serif" font-weight="700" font-size="${size * 0.33}" fill="var(--ink)">${score ?? '–'}</text></svg>`;
}
function moodCard() {
  const p = X.moodPicked;
  if (p === undefined || p === null) {
    if (!moodDue()) return '';
    return `<section class="moodcard" aria-label="Daily mood check-in"><div class="row between"><h2 class="lbl" style="font-size:15px;margin:0;white-space:nowrap">How are you feeling today?</h2><span class="note" style="font-size:15px;white-space:nowrap">no wrong answers</span></div>
      <div class="moods">${MOODS.map((m, i) => `<button class="mood" data-a="mood" data-v="${i}"><span class="mface" style="--mf:${MOOD_FILL[i]}">${face(i)}</span><span>${m[0]}</span></button>`).join('')}</div></section>`;
  }
  return `<section class="moodcard picked ${X.moodGone ? 'gone' : ''}" aria-live="polite"><div class="row" style="gap:12px">
      <span class="mface pop" style="--mf:${MOOD_FILL[p]};width:46px;height:46px">${face(p, 30)}${[0, 1, 2, 3, 4, 5].map(k => `<i class="spark s${k}"></i>`).join('')}</span>
      <span class="stack" style="gap:2px"><b>${MOODS[p][0]}. Logged.</b><span class="cap" style="font-size:13px">${MOODS[p][2]}</span></span></div></section>`;
}
function moodChip() {
  const s = toScore(avg(moodsSince(7).map(m => m.v))), prev = toScore(avg(moodsSince(14, 7).map(m => m.v)));
  const up = s !== null && prev !== null ? s - prev : 0;
  return `<button class="moodchip ${X.moodBump ? 'bump' : ''}" data-a="moodview" aria-label="Mood score ${s} this week. Open mood details">${ring(s)}<span class="stack" style="gap:0;text-align:left"><b style="font:600 13px/16px var(--f-body)">Mood</b><span class="cap" style="font-size:11px">${up > 0 ? '▲ ' + up : up < 0 ? '▼ ' + Math.abs(up) : 'steady'}</span></span></button>`;
}
V.mood = () => {
  const per = X.per || 'month', DAY = 86400000;
  let bars = [], label = '', cur = [], prev = [];
  if (per === 'week' || per === 'month') {
    const n = per === 'week' ? 7 : 30; cur = moodsSince(n); prev = moodsSince(n * 2, n); label = per === 'week' ? 'Last 7 days' : 'Last 30 days';
    const by = Object.fromEntries(cur.map(m => [m.d, m.v]));
    for (let i = n - 1; i >= 0; i--) { const dt = new Date(Date.now() - i * DAY); const v = by[dkey(dt)]; bars.push({ v, l: per === 'week' ? DAYS[dt.getDay()][0] : (i % 7 === 0 ? String(dt.getDate()) : '') }); }
  } else {
    cur = moodsSince(365); prev = []; label = 'Last 12 months';
    for (let i = 11; i >= 0; i--) { const dt = new Date(); dt.setDate(1); dt.setMonth(dt.getMonth() - i); const pre = dkey(dt).slice(0, 7); const ms = S.moods.filter(m => m.d.startsWith(pre)); bars.push({ v: ms.length ? avg(ms.map(m => m.v)) : undefined, l: 'JFMAMJJASOND'[dt.getMonth()] }); }
  }
  const sc = toScore(avg(cur.map(m => m.v))), pv = toScore(avg(prev.map(m => m.v))), delta = sc !== null && pv !== null ? sc - pv : null;
  const counts = [0, 1, 2, 3, 4].map(k => cur.filter(m => m.v === k).length), tot = cur.length || 1;
  const base = moodsSince(90);
  const dow = [0, 1, 2, 3, 4, 5, 6].map(k => ({ k, a: avg(base.filter(m => new Date(m.d + 'T12:00').getDay() === k).map(m => m.v)) })).filter(x => x.a !== null).sort((a, b) => b.a - a.a);
  const careA = toScore(avg(base.filter(m => m.care).map(m => m.v))), noA = toScore(avg(base.filter(m => !m.care).map(m => m.v)));
  const full = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const W = per === 'month' ? 30 : per === 'week' ? 7 : 12;
  return `<div class="screen notab">${top('Your mood')}
    <div class="seg" role="group" aria-label="Period">${[['week', 'Week'], ['month', 'Month'], ['year', 'Year']].map(([k, l]) => `<button data-a="per" data-v="${k}" aria-pressed="${per === k}">${l}</button>`).join('')}</div>
    <section class="card stack"><div class="row between" style="align-items:flex-end"><div class="row" style="gap:12px">${ring(sc, 64)}<div><span class="eyebrow">Mood score</span><div class="t2">${sc === null ? 'No check-ins yet' : sc >= 70 ? 'Mostly bright' : sc >= 50 ? 'Mixed, leaning up' : 'A heavier stretch'}</div></div></div>
      ${delta !== null ? `<span class="tag ${delta >= 0 ? 'sage' : 'peach'}">${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta)} vs before</span>` : ''}</div>
      <div class="mchart" style="grid-template-columns:repeat(${W},1fr)" role="img" aria-label="Mood ${label}">${bars.map(b => `<div><b style="height:${b.v === undefined ? 4 : 10 + b.v * 22}px;background:${b.v === undefined ? 'var(--surface-sunken)' : MOOD_FILL[Math.round(b.v)]}"></b><span class="cap">${b.l}</span></div>`).join('')}</div>
      <span class="cap">${label} · ${cur.length} check-ins · score is your average, out of 100</span></section>
    <section class="card stack"><h2 class="t2">How the days felt</h2>
      <div class="mdist">${counts.map((c, k) => c ? `<i style="flex:${c};background:${MOOD_FILL[k]}" title="${MOODS[k][0]}: ${c}"></i>` : '').join('')}</div>
      <div class="stack" style="gap:6px">${counts.map((c, k) => `<div class="row between"><span class="row" style="gap:8px"><span class="mface" style="--mf:${MOOD_FILL[k]};width:28px;height:28px;background:var(--mf)">${face(k, 18)}</span>${MOODS[k][0]}</span><span class="cap">${c} day${c === 1 ? '' : 's'} · ${Math.round(c / tot * 100)}%</span></div>`).join('')}</div></section>
    <section class="sec"><h2 class="t2">What we're noticing</h2>
      ${dow.length > 2 ? `<div class="card row"><span class="dot tint-sun">${ic('sun')}</span><span>${full[dow[0].k]}s tend to feel lightest; ${full[dow[dow.length - 1].k]}s are heavier.</span></div>` : ''}
      ${careA !== null && noA !== null ? `<div class="card row"><span class="dot tint-sage">${ic('grow')}</span><span>On days you did a care activity, your mood score was ${careA} vs ${noA} on other days.</span></div>` : ''}
      <div class="card row"><span class="dot tint-violet">${ic('cal')}</span><span>You checked in on ${moodsSince(30).length} of the last 30 days. That's you showing up for yourself.</span></div></section>
    <div class="row"><button class="btn soft" style="flex:1" data-a="dost">${ic('mic')}Talk it through with Dost</button></div>
    <p class="cap" style="margin:0">${ic('lock')} Only you see your mood. ${esc(S.company)} never does. <button class="link" data-a="mood-again">Prototype: check in again</button></p></div>`;
};
function todayStep() {
  if (S.plan) {
    const s = S.plan.steps.find(x => !x.done) || null;
    if (s) return s;
  }
  return null;
}
V.home = () => {
  const step = todayStep(), bk = S.booked && EXM[S.booked.id];
  const care = (S.plan && S.plan.ex) ? [S.plan.ex, 'ex_good', 'ex_ground'] : ['ex_box', 'ex_good', 'ex_ground'];
  return `<div class="screen">
  <div class="stack" style="gap:10px"><div class="row between"><img src="/yd-logo.png" alt="YourDOST" class="homelogo"><div class="row" style="gap:8px">${bell()}${moodChip()}</div></div>
    <h1 class="hello1">${greet()}, <b>${esc(S.name)}</b></h1></div>
  ${moodCard()}
  <section class="sec" id="t-step"><div class="sec-h"><h2 class="t2">Today's one step</h2>${S.plan ? `<span class="tag violet">From your plan</span>` : ''}</div>
    ${step ? stepCard(step) : `<button class="card glow row" data-a="dost" style="border:0;text-align:left;box-shadow:var(--shadow-card)"><span class="orb sm" style="animation:none;flex:none;width:64px;height:64px;box-shadow:0 0 0 6px color-mix(in srgb,var(--violet-200) 70%,transparent)"></span><span class="stack" style="gap:4px"><b>Talk to Dost for 2 minutes</b><span class="cap">Dost asks a few questions and finds the right support for you.</span></span></button>`}</section>
  ${bk ? `<section class="card row"><span class="dot tint-violet">${ic('video')}</span><div style="flex:1"><b>${esc(S.booked.day)}, ${esc(S.booked.time)} with ${esc(fnm(bk.name))}</b><div class="cap">${esc(S.booked.mode)} session · reminder 1 hour before</div></div><button class="btn soft sm" data-a="toast" data-v="Your session room opens 10 minutes before.">Join</button></section>` : ''}
  <section class="sec" id="t-events"><div class="sec-h"><h2 class="t2">Join live events</h2><span class="cap">free · online</span></div>
    <div class="hscroll evscroll" id="evscroll">${EVENTS.map(evCard).join('')}</div>
    <div class="dotsrow">${sosPill()}<div class="dots evdots" id="evdots">${EVENTS.map((e, i) => `<button class="${i === 0 ? 'on' : ''}" data-a="evdot" data-v="${i}" aria-label="Show event ${i + 1} of ${EVENTS.length}"></button>`).join('')}</div></div></section>
  ${ritualCard()}
</div>${tabbar()}`;
};
function stepCard(s) {
  if (s.kind === 'ex') { const x = EX[s.id]; return `<div class="card row"><span class="dot tint-${x.tint}" style="width:52px;height:52px">${ic('play')}</span><div style="flex:1;min-width:0"><b>${esc(x.name)}</b><div class="cap">${x.mins} min · ${esc(x.why)}</div></div><button class="btn primary sm" data-a="ex" data-v="${s.id}" data-step="${s.n}">Start</button></div>`; }
  if (s.kind === 'book') { const e = EXM[s.id]; return `<div class="card row"><span class="dot tint-violet" style="width:52px;height:52px">${ic('cal')}</span><div style="flex:1;min-width:0"><b>Book ${esc(fnm(e.name))} this week</b><div class="cap">${esc(e.title)} · your best match</div></div><button class="btn primary sm" data-a="deck" data-v="${s.id}" data-i="0">Book</button></div>`; }
  if (s.kind === 'pg') { const g = PG[s.id]; return `<div class="card row"><span class="dot tint-sage" style="width:52px;height:52px">${ic('grow')}</span><div style="flex:1;min-width:0"><b>Day ${(S.pg[s.id] || 0) + 1} of ${esc(g.name)}</b><div class="cap">${esc(g.blurb)}</div></div><button class="btn primary sm" data-a="pg" data-v="${s.id}">Open</button></div>`; }
  return '';
}

/* ---- Experts ---- */
const STYLE_Q = [['Give me practical tips', 'Give me space to talk'], ['Guide me', 'Follow my lead'], ['Focus on now', 'Explore what led here'], ['Be gentle', 'Be kind but direct']];
const QUIZ = [
  { k: 'concerns', q: 'What would you like help with?', sub: 'Pick up to 3. The first one counts most.', type: 'multi', max: 3, opts: CONCERNS.filter(c => c[0] !== 'explore') },
  { k: 'style', q: 'How do you like to talk?', sub: 'Choose a side, or Either.', type: 'style' },
  { k: 'langs', q: 'Which languages are you comfortable in?', sub: 'Pick all that apply.', type: 'multi', max: 5, opts: ['English', 'Hindi', 'Tamil', 'Bengali', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Urdu', 'Punjabi'].map(l => [l, l]) },
  { k: 'mode', q: 'How would you like to meet?', sub: 'You can change this for any session.', type: 'one', opts: [['Video', 'Video'], ['Call', 'Call'], ['Chat', 'Chat'], ['any', 'Any of these']] },
  { k: 'gender', q: 'Do you prefer a woman or a man?', sub: 'Many people do. It\'s fine either way.', type: 'one', opts: [['Woman', 'A woman'], ['Man', 'A man'], ['any', 'No preference']] },
  { k: 'when', q: 'When would you like to start?', sub: 'Sooner is often easier.', type: 'one', opts: [['today', 'Today'], ['week', 'This week'], ['any', 'Whenever suits']] },
];
function quizMatches() {
  const q = S.quiz || {}, cs = q.concerns || [];
  return EXPERTS.filter(e => !q.gender || q.gender === 'any' || e.gender === q.gender).map(e => {
    let pts = 0, max = 0;
    cs.forEach((c, i) => { const w = i === 0 ? 4 : 2; max += w; if (e.focus.includes(c)) pts += w; });
    (q.style || []).forEach((v, i) => { if (v === null || v === undefined) return; max += 1.5; if (e.style4[i] === v) pts += 1.5; });
    max += 2; if ((q.langs || ['English']).some(l => e.langs.includes(l))) pts += 2;
    max += 1; if (!q.mode || q.mode === 'any' || e.modes.includes(q.mode)) pts += 1;
    max += 1; if (q.when !== 'today' || e.today) pts += 1;
    const pct = Math.round(62 + 36 * (max ? pts / max : 0.5));
    const why = [];
    const ov = cs.filter(c => e.focus.includes(c)); if (ov.length) why.push(`Helps with ${ov.map(c => CL[c].toLowerCase()).join(' and ')}`);
    const sm = (q.style || []).map((v, i) => v !== null && v !== undefined && e.style4[i] === v ? STYLE_Q[i][v].toLowerCase() : null).filter(Boolean);
    if (sm.length) why.push(`Will ${sm[0].replace(/^give me /, 'give you ').replace(/^guide me/, 'guide you').replace(/^follow my lead/, 'follow your lead').replace(/^be /, 'be ')}`);
    const l = (q.langs || []).find(x => e.langs.includes(x)); if (l) why.push(`Speaks ${l}`);
    why.push(e.today ? `Free today at ${e.today}` : 'Free tomorrow');
    return { e: EXM[e.id], pct, why: why.slice(0, 3) };
  }).sort((a, b) => b.pct - a.pct);
}
const img = (e, cls = '', size = '') => `<img class="${cls}" src="/app/img/${e.id}${size === 's' ? '-s' : ''}.webp?v=2" alt="${esc(e.name)}" decoding="async">`;
const SPARK = '<svg class="spk" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5-4.6.6-6.9 2.9-7.5 7.5-.6-4.6-2.9-6.9-7.5-7.5 4.6-.6 6.9-2.9 7.5-7.5z" fill="currentColor"/><path class="spk2" d="M19 15.5c.3 1.8 1.2 2.7 3 3-1.8.3-2.7 1.2-3 3-.3-1.8-1.2-2.7-3-3 1.8-.3 2.7-1.2 3-3z" fill="currentColor"/></svg>';
const STAR = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="var(--sun-400)"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/* availability for the booking calendar: the next 6 weeks, a few times on most days */
const CLINIC = { e1: 'YourDOST Centre, Koramangala, Bengaluru', e3: 'YourDOST Centre, Indiranagar, Bengaluru', e4: 'YourDOST Centre, Andheri West, Mumbai', e6: 'YourDOST Centre, Connaught Place, Delhi', e7: 'YourDOST Centre, Salt Lake, Kolkata', e8: 'YourDOST Centre, Koramangala, Bengaluru', e10: 'YourDOST Centre, Banjara Hills, Hyderabad' };
function availFor(e, dt, where = 'online') {
  if (where === 'inperson') {
    if (!CLINIC[e.id]) return [];
    const t0 = new Date(); t0.setHours(0, 0, 0, 0); const d = new Date(dt); d.setHours(0, 0, 0, 0); const diff = Math.round((d - t0) / 86400000);
    if (diff < 1 || diff > 42 || ![2, 4, 6].includes(d.getDay())) return [];
    const h = (d.getDate() + e.id.charCodeAt(1)) % 4; if (h === 0) return [];
    return ['11 am', '2 pm', '4:30 pm'].slice(0, h);
  }
  const t0 = new Date(); t0.setHours(0, 0, 0, 0); const d = new Date(dt); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - t0) / 86400000); if (diff < 0 || diff > 42) return [];
  if (diff === 0) return e.today ? [e.today] : [];
  const h = (d.getDate() * 7 + d.getMonth() * 3 + e.id.charCodeAt(1) * 5) % 10;
  if (h < 3 || (d.getDay() === 0 && h < 8)) return [];
  const all = ['9 am', '10 am', '11:30 am', '1 pm', '3 pm', '5 pm', '6 pm', '7:30 pm', '9 pm'];
  return all.filter((_, i) => (i + h + d.getDate()) % 3 !== 0).slice(0, 3 + h % 3);
}
const dayLabel = d => `${DAYS[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`;
function nextFree(e, n = 3) { const out = []; for (let i = 0; i < 21 && out.length < n; i++) { const d = new Date(); d.setDate(d.getDate() + i); const t = availFor(e, d); if (t.length) out.push((i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayLabel(d)) + ', ' + t[0]); } return out; }
function filtCount() { const f = S.filt; return f.lang.length + f.mode.length + f.gender.length + f.where.length + (f.today ? 1 : 0) + (S.sort !== 'match' ? 1 : 0); }
function expertList() {
  const f = S.filt, q = (S.q || '').trim().toLowerCase(); let list = matches().map(x => x.e);
  if (q) list = list.filter(e => [e.name, e.title, e.style, ...e.langs, ...e.focus.map(c => CL[c] || '')].join(' ').toLowerCase().includes(q));
  if (f.lang.length) list = list.filter(e => f.lang.some(l => e.langs.includes(l)));
  if (f.mode.length) list = list.filter(e => f.mode.some(m => e.modes.includes(m)));
  if (f.where.length) list = list.filter(e => f.where.some(w => w === 'Online' || CLINIC[e.id]));
  if (f.gender.length) list = list.filter(e => f.gender.includes(e.gender));
  if (f.today) list = list.filter(e => e.today);
  if (S.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  if (S.sort === 'soonest') list.sort((a, b) => (b.today ? 1 : 0) - (a.today ? 1 : 0));
  return list;
}
V.experts = () => {
  const seg = S.seg;
  let body = '';
  if (seg === 'for') {
    const res = S.quiz && S.quiz.done ? quizMatches().slice(0, 3) : null;
    body = `
    <div class="card tint-help row" style="box-shadow:none"><span class="dot" style="background:var(--surface-raised);color:var(--help-600)">${ic('phone')}</span><div style="flex:1"><b>Talk now</b><div class="cap">An on-call counsellor, usually in under 2 minutes</div></div><button class="btn helpbtn sm" data-a="talknow" style="background:var(--surface-raised)">Call</button></div>
    ${res ? `<section class="sec"><div class="sec-h"><h2 class="t2">Your top 3</h2><button class="link" data-a="quiz">Retake</button></div>
      ${res.map(({ e, pct, why }, i) => `<button class="card row" style="border:0;text-align:left;align-items:stretch;gap:14px" data-a="deck" data-v="${res.map(r => r.e.id).join(',')}" data-i="${i}">
        <span class="mphoto">${img(e, '', 's')}</span><span class="stack" style="gap:6px;flex:1;min-width:0"><span class="row between"><span class="tag ${i === 0 ? 'peach' : 'violet'}">${i === 0 ? 'Best match' : 'Good match'}</span><b class="pct">${pct}%</b></span>
        <b style="font:600 17px/22px var(--f-display)">${esc(e.name)}</b><span class="cap">${esc(e.title)} · ${e.yrs} yrs</span>
        ${why.map(w => `<span class="row" style="gap:6px;align-items:flex-start;font-size:13px;line-height:18px"><span style="color:var(--sage-600)">${ic('check')}</span>${esc(w)}</span>`).join('')}</span></button>`).join('')}</section>`
    : `<button class="hero smart" data-a="quiz">
        <span class="row between"><span class="eyebrow smartk">${SPARK}Smart match</span><span class="cap">6 quick taps</span></span>
        <span class="hero-h">Find the counsellor who <span class="swash">gets you</span>.</span>
        <span class="note" style="color:var(--ink-muted)">no long forms, just taps</span>
        <span class="row" style="gap:-8px"><span class="row matchrow">${EXPERTS.slice(0, 4).map((e, k) => `<span class="stackph" style="--k:${k}">${img(e, '', 's')}</span>`).join('')}</span><span class="cap" style="margin-left:14px">Matched on what you need, how you like to talk, and language</span></span>
        <span class="btn primary block">Start · only 2 minutes</span></button>`}
    <p class="muted" style="margin:0">Want to look around first? <button class="link" data-a="seg" data-v="browse">Browse all experts</button></p>`;
  }
  if (seg === 'browse') {
    const list = expertList(), nf = filtCount(), ids = list.map(e => e.id).join(',');
    body = `<div class="row" style="gap:10px"><label class="searchbox"><span class="sr">Search experts</span>${ic('search')}<input id="xsearch" type="search" placeholder="Search name or topic" value="${esc(S.q || '')}" autocomplete="off"></label>
      <button class="iconbtn filtbtn" data-a="xview" aria-label="${S.xview === 'list' ? 'Show as grid' : 'Show as list'}">${ic2(S.xview === 'list' ? 'gridv' : 'listv')}</button>
      <button class="iconbtn filtbtn ${nf ? 'on' : ''}" data-a="sheet" data-v="filter" aria-label="Filter and sort${nf ? ', ' + nf + ' on' : ''}">${ic('filter')}${nf ? `<span class="badge">${nf}</span>` : ''}</button></div>
      ${S.q ? `<span class="cap">${list.length} result${list.length === 1 ? '' : 's'} for “${esc(S.q)}”</span>` : ''}
      ${list.length && S.xview === 'list' ? `<div class="xlist">${list.map((e, i) => `<button class="xrow" data-a="deck" data-v="${ids}" data-i="${i}" aria-label="Open ${esc(e.name)}">
          <span class="xph">${img(e, '', 's')}</span>
          <span class="xbody"><span class="row between" style="gap:6px"><b class="tname">${esc(e.name)}</b><span class="xrate">${STAR}${e.rating.toFixed(1)}</span></span>
            <span class="cap">${esc(e.title)} · ${e.yrs} yrs</span>
            <span class="cap">${e.focus.map(c => CL[c]).join(' · ')}</span>
            <span class="tlang">${e.langs.join(' · ')}</span>
            <span class="row between" style="gap:6px;margin-top:4px"><span class="xfree">${e.today ? 'Free today, ' + esc(e.today) : 'Next: ' + esc((nextFree(e, 1)[0] || 'this week').replace(/^Tomorrow, /, 'tomorrow, '))}</span><span class="xmode">${CLINIC[e.id] ? 'Online · In person' : 'Online'}</span></span></span></button>`).join('')}</div>`
      : list.length ? `<div class="xgrid">${list.map((e, i) => `<div class="tile mtile"><div class="photo">${img(e, '', 's')}<span class="notch">${STAR}${e.rating.toFixed(1)}</span>
          <button class="tapcover" data-a="deck" data-v="${ids}" data-i="${i}" aria-label="Open ${esc(e.name)}"></button></div>
        <button class="tile" data-a="deck" data-v="${ids}" data-i="${i}"><b class="tname">${esc(e.name)}</b><span class="cap">${e.focus.slice(0, 2).map(c => CL[c]).join(' · ')}</span><span class="tlang">${e.langs.join(' · ')}</span></button></div>`).join('')}</div>`
        : `<div class="card stack" style="text-align:center"><b>No one matches${S.q ? ' “' + esc(S.q) + '”' : ' all of these'}</b><span class="muted">Try a different word or remove a filter.</span><button class="btn soft sm" data-a="filt-clear">Clear search and filters</button></div>`}`;
  }
  if (seg === 'mine') {
    const up = S.booked && EXM[S.booked.id];
    body = `${up ? `<section class="sec"><span class="eyebrow">Upcoming</span><div class="card stack">
        <div class="row"><span class="mphoto" style="width:64px;height:76px">${img(up)}</span><div style="flex:1;min-width:0"><b style="font:600 17px/22px var(--f-display)">Session ${S.booked.n || 1} with ${esc(fnm(up.name))}</b><div class="cap">${esc(S.booked.day)}, ${esc(S.booked.time)} · ${esc(S.booked.mode)} · 50 min</div></div></div>
        <div class="card tint-violet" style="box-shadow:none;padding:12px;font-size:14px;line-height:20px">${ic('book')} Before you join: what's one thing from last week you'd like to talk about?</div>
        <div class="row"><button class="btn primary sm" style="flex:1" data-a="toast" data-v="Your session room opens 10 minutes before.">${ic('video')}Join</button><button class="btn soft sm" style="flex:1" data-a="toast" data-v="Message sent to ${esc(fnm(up.name))}. Replies within a few hours.">${ic('chat')}Message</button></div>
        <button class="link" data-a="cancel" style="justify-self:start">Reschedule or cancel</button></div></section>`
      : `<div class="card stack" style="text-align:center"><b>No upcoming session</b><button class="btn primary sm" data-a="seg" data-v="browse">Find an expert</button></div>`}
      ${S.history.length ? `<button class="card row" style="border:0;text-align:left;background:var(--violet-100);box-shadow:none" data-a="rx"><span class="rxbadge" style="background:var(--surface-raised)">Rx</span><span style="flex:1"><b>Prescriptions &amp; care plans</b><span class="cap" style="display:block">${S.history.length} sessions · what you shared and your plan</span></span>${ic('chev', 'chev')}</button>` : ''}
      ${S.history.length ? `<section class="sec"><span class="eyebrow">Past sessions</span><div class="tl">${S.history.slice().reverse().map(h => { const e = EXM[h.id]; return `<div class="tl-item"><span class="tl-dot">${ic('check')}</span><div class="card stack" style="gap:6px">
          <div class="row between"><b>Session ${h.n} · ${esc(fnm(e.name))}</b><span class="cap">${esc(h.date)}</span></div>
          <span class="cap">${esc(h.mode)} · 50 min · you rated the fit ${h.fit}/5</span>
          <p style="margin:0"><span class="lbl muted">Your takeaway</span><br>${esc(h.note)}</p>
          ${h.task ? `<span class="tag sage" style="justify-self:start">${ic('grow')}${esc(h.task)}</span>` : ''}<button class="link" data-a="rx" data-v="${h.n}" style="justify-self:start;padding:0">View prescription ›</button></div></div>`; }).join('')}</div></section>` : ''}
      <div class="card row" style="box-shadow:none;background:var(--surface-sunken)">${ic('gift')}<span>${S.sessionsLeft} of 6 free sessions left this year, covered by ${esc(S.company)}.</span></div>`;
  }
  return `<div class="screen"><h1 class="t1">Experts</h1>
    <div class="seg" role="group" aria-label="Experts view">${[['browse', 'Browse'], ['for', 'For you'], ['mine', 'My sessions']].map(([k, l]) => `<button data-a="seg" data-v="${k}" aria-pressed="${seg === k}">${l}</button>`).join('')}</div>${body}</div>${tabbar()}`;
};

/* the swipe deck: one expert full screen, details in a half sheet; swipe left for next, right for previous */
V.deck = () => {
  const ids = S.params.ids, i = S.params.i, e = EXM[ids[i]], nxt = EXM[ids[(i + 1) % ids.length]];
  const m = (S.quiz && S.quiz.done ? quizMatches() : matches()).find(x => x.e.id === e.id);
  const nf = nextFree(e);
  return `<div class="screen flush notab deck tint-${e.tint}">
    <div class="deck-bg" aria-hidden="true">${img(e)}<i></i></div>
    <div class="deck-top"><button class="iconbtn" data-a="back" aria-label="Close">${ic('back')}</button><span class="lbl">${i + 1} of ${ids.length}</span>
      <span style="width:44px" aria-hidden="true"></span></div>
    <div class="arch-wrap">${ids.length > 1 ? `<div class="arch behind" aria-hidden="true">${img(nxt)}</div>` : ''}
      <div class="arch" id="swipe" tabindex="0" aria-label="${esc(e.name)}. Swipe left for the next expert.">${img(e)}<span class="rate" style="left:14px;bottom:14px">${STAR}${e.rating.toFixed(1)} · ${e.n} sessions</span></div></div>
    <div class="dsheet">
      <div class="grab" aria-hidden="true"></div>
      <div class="row between" style="align-items:flex-start"><div><h1 class="t1">${esc(e.name)}</h1><span class="muted">${esc(e.title)} · ${e.yrs} years</span></div>${m && m.pct ? `<span class="tag peach">${m.pct}% match</span>` : ''}</div>
      <div class="row wrap" style="gap:6px">${e.focus.map(c => `<span class="tag violet">${CL[c]}</span>`).join('')}<span class="tag">${e.langs.join(', ')}</span></div>
      <p style="margin:0">${esc(e.about)}</p>
      <div class="row wrap" style="gap:6px"><span class="lbl muted" style="width:100%">Style</span><span class="tag sage">${esc(e.style)}</span>${e.modes.map(md => `<span class="tag">${md}</span>`).join('')}</div>
      ${m ? `<div class="stack" style="gap:6px"><span class="lbl muted">Why this match</span>${m.why.map(w => `<span class="row" style="gap:8px"><span style="color:var(--sage-600)">${ic('check')}</span>${esc(w)}</span>`).join('')}</div>` : ''}
      <div class="stack" style="gap:6px"><span class="lbl muted">Next free</span><div class="row wrap" style="gap:6px">${nf.map(x => `<span class="tag">${x}</span>`).join('')}</div></div>
    </div>
    <div class="deck-cta"><div class="row" style="gap:10px"><button class="iconbtn" data-a="deck-move" data-v="-1" aria-label="Previous expert" ${ids.length > 1 ? '' : 'disabled'}>${ic('back')}</button>
        <button class="btn primary" style="flex:1" data-a="sheet" data-v="book">${ic('cal')}Book ${esc(fnm(e.name))}</button>
        <button class="iconbtn" data-a="deck-move" data-v="1" aria-label="Next expert" ${ids.length > 1 ? '' : 'disabled'}>${ic('chev')}</button></div>
      ${ids.length > 1 ? `<p class="cap" style="text-align:center;margin:0">Swipe the photo left for the next expert</p>` : ''}</div></div>`;
};
V.quiz = () => {
  const q = S.quiz || (S.quiz = {}), step = X.qs || 0, Q = QUIZ[step];
  if (X.finding) return `<div class="screen notab glow" style="justify-content:center;text-align:center;gap:20px"><div class="orb busy" aria-hidden="true"></div><h1 class="t1">Finding your best matches…</h1><p class="muted" style="margin:0">Checking every counsellor for what you need, how you like to talk, language and time.</p></div>`;
  let opts = '';
  if (Q.type === 'multi') { const cur = q[Q.k] || []; opts = `<div class="row wrap">${Q.opts.map(([v, l]) => `<button class="chip" data-a="qpick" data-v="${v}" aria-pressed="${cur.includes(v)}">${cur.includes(v) && Q.k === 'concerns' ? (cur.indexOf(v) + 1) + ' · ' : ''}${l}</button>`).join('')}</div>`; }
  if (Q.type === 'one') opts = `<div class="stack">${Q.opts.map(([v, l]) => `<button class="qopt" data-a="qpick" data-v="${v}" ${q[Q.k] === v ? 'style="border-color:var(--violet-600);background:var(--violet-100)"' : ''}>${l}</button>`).join('')}</div>`;
  if (Q.type === 'style') { const st = q.style || [null, null, null, null]; opts = STYLE_Q.map(([a, b], i) => `<div class="seg" role="group" aria-label="${esc(a)} or ${esc(b)}">${[[0, a], [-1, 'Either'], [1, b]].map(([v, l]) => `<button data-a="qstyle" data-i="${i}" data-v="${v}" aria-pressed="${(st[i] === null && v === -1) || st[i] === v}" style="font-size:13px;line-height:16px;padding:0 6px">${esc(l)}</button>`).join('')}</div>`).join(''); }
  const ok = Q.type === 'multi' ? (q[Q.k] || []).length > 0 : Q.type === 'style' ? true : q[Q.k] !== undefined;
  return `<div class="screen notab">${top(`Smart match · ${step + 1} of ${QUIZ.length}`)}
    <div class="bar"><i style="width:${(step + 1) / QUIZ.length * 100}%;background:var(--violet-600)"></i></div>
    <div class="stack" style="gap:6px"><h2 class="t1">${esc(Q.q)}</h2><span class="muted">${esc(Q.sub)}</span></div>${opts}
    <div style="flex:1"></div><button class="btn primary block" data-a="qnext" ${ok ? '' : 'disabled style="opacity:.45"'}>${step === QUIZ.length - 1 ? 'Show my matches' : 'Next'}</button></div>`;
};
V.booked = () => {
  const e = EXM[S.booked.id];
  return `<div class="screen notab glow" style="justify-content:center;text-align:center;gap:16px">
    <span class="mphoto" style="width:120px;height:120px;border-radius:50%;align-self:center">${img(e)}</span>
    <h1 class="t1">You're booked with ${esc(fnm(e.name))}</h1>
    <p class="lg muted" style="margin:0">${esc(S.booked.day)}, ${esc(S.booked.time)} · ${esc(S.booked.mode)}<br>${S.booked.loc ? esc(S.booked.loc) + '<br>' : ''}${S.sessionsLeft} free sessions left this year</p>
    ${S.shareSummary ? `<div class="card tint-violet" style="box-shadow:none;text-align:left">${ic('lock')} ${esc(fnm(e.name))} will see a short summary of what you told Dost, so you don't have to start from zero.</div>` : ''}
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
    ? [{ kind: 'ex', id: ex, n: 0, line: `${EX[ex].name} now (${EX[ex].mins} min)` }, { kind: 'book', id: top1.id, n: 1, line: `Book ${fnm(top1.name)}, your best-fit counsellor, this week` }, { kind: 'pg', id: pg, n: 2, line: `${PG[pg].name}, 10 minutes a day while you wait` }]
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
  return `<div class="screen notab dostscr" style="gap:14px;padding-bottom:16px">
    <div class="row between"><button class="iconbtn" data-a="back" aria-label="Close">${ic('close')}</button><div style="text-align:center"><b>Dost</b><div class="cap">Your guide, not a doctor</div></div>
      <span class="tag ${d.live === false ? 'peach' : d.live ? 'sage' : ''}" style="min-width:44px;justify-content:center">${d.live === false ? 'Offline' : d.live ? 'AI live' : 'AI'}</span></div>
    <div class="orb ${d.busy ? 'busy' : ''}" style="width:150px;height:150px;flex:none" aria-hidden="true"></div>
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
    <section class="sec"><div class="sec-h"><h2 class="t2">Daily rituals</h2><span class="cap">about 5 min</span></div>
      <div class="grid2">${['morning', 'evening'].map(k => { const R = R_SLOTS[k], dn = ritualDone(k); return `<button class="card stack tint-${R.tint}" style="border:0;text-align:left;gap:6px;box-shadow:none" data-a="ritual" data-v="${k}"><span class="row between"><span class="dot" style="background:var(--surface-raised)">${ic(R.icon)}</span>${dn ? `<span class="tag sage">${ic('check')}Done</span>` : ''}</span><b>${R.name}</b><span class="cap">Breathe · write · listen · feel</span></button>`; }).join('')}</div></section>
    <section class="sec"><div class="sec-h"><h2 class="t2">Calming sounds</h2><span class="cap">tap to play</span></div>
      <div class="list">${Object.entries(SOUNDS).map(([k, o]) => `<button class="li" data-a="g-snd" data-v="${k}" aria-pressed="${X.gs === k}"><span class="dot tint-violet">${X.gs === k ? `<span class="lwave mini on">${[0, 1, 2].map(j => `<i style="--k:${j}"></i>`).join('')}</span>` : ic('play')}</span><span class="grow"><b>${o.name}</b><span class="cap" style="display:block">${X.gs === k ? 'Playing · tap to stop' : o.blurb}</span></span></button>`).join('')}</div></section>
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
  <span class="burst" aria-hidden="true" style="align-self:center">${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<i class="b${k}"></i>`).join('')}</span><h1 class="t1">Nice work. That counts.</h1><p class="lg muted" style="margin:0">${S.leaves} kind things for yourself this week.</p>
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
  const wk = Object.fromEntries(moodsSince(7).map(m => [m.d, m.v])); const week = []; for (let i = 6; i >= 0; i--) { const dt = new Date(); dt.setDate(dt.getDate() - i); week.push(wk[dkey(dt)]); }
  return `<div class="screen">
    <div class="row"><span class="avatar" style="width:56px;height:56px;font-size:22px">${esc(S.name[0])}</span><div><h1 class="t1">${esc(S.name)}</h1><span class="cap">${esc(S.email)} · ${esc(S.company)}</span></div></div>
    <button class="card stack" data-a="moodview" style="border:0;text-align:left"><div class="row between"><h2 class="t2">Your week</h2><span class="link">Mood details ›</span></div>
      <div class="moodbars" role="img" aria-label="Mood over the last 7 days">${week.map((v, i) => `<div><b style="height:${v === undefined ? 6 : 18 + v * 20}px;background:${v === undefined ? 'var(--surface-sunken)' : MOOD_FILL[v]}"></b><span class="cap">${days[i]}</span></div>`).join('')}</div>
      <span class="muted">${moodDue() ? 'Check in on Home to add today.' : 'Thanks for checking in today.'}</span></button>
    <section class="card tint-sage stack" style="box-shadow:none"><h2 class="t2">Small wins this week</h2><ul style="margin:0;padding-left:18px;display:grid;gap:4px">${S.wins.slice(-4).map(w => `<li>${esc(w)}</li>`).join('')}</ul></section>
    <section class="card tint-violet stack" style="box-shadow:none"><div class="row between"><h2 class="t2">Your benefits</h2><span class="tag">${esc(S.company)}</span></div>
      <span>${S.sessionsLeft} of 6 counselling sessions left this year</span><div class="bar"><i style="width:${S.sessionsLeft / 6 * 100}%;background:var(--violet-600)"></i></div><span class="cap">Dost, Grow and quick checks are unlimited.</span></section>
    <div class="list">
      <button class="li" data-a="journal"><span class="dot tint-sun">${ic('pen')}</span><span class="grow"><b>Journal</b></span>${ic('chev', 'chev')}</button>
      <button class="li" data-a="go-health"><span class="dot tint-sage">${ic2('link')}</span><span class="grow"><b>Connected health apps</b><span class="cap" style="display:block">${Object.keys(S.health).length ? Object.keys(S.health).length + ' connected' : 'Apple Health, Health Connect, Strava, Fitbit'}</span></span>${ic('chev', 'chev')}</button>
      <div class="li"><span class="dot tint-sage">${ic('chat')}</span><span class="grow"><b>Dost remembers our chats</b><span class="cap" style="display:block">So it can ask how things went</span></span><button class="toggle" role="switch" aria-checked="${S.memory}" aria-label="Dost memory" data-a="memory"></button></div>
      <button class="li" data-a="sheet" data-v="privacy"><span class="dot tint-violet">${ic('shield')}</span><span class="grow"><b>Privacy and your data</b><span class="cap" style="display:block">What ${esc(S.company)} sees: group totals only</span></span>${ic('chev', 'chev')}</button>
      <button class="li" data-a="help"><span class="dot tint-help" style="color:var(--help-600)">${ic('phone')}</span><span class="grow"><b>Get help now</b></span>${ic('chev', 'chev')}</button>
      <button class="li" data-a="tour-again"><span class="dot tint-sun">${ic('spark')}</span><span class="grow"><b>Take the app tour again</b><span class="cap" style="display:block">A quick guide to every feature</span></span>${ic('chev', 'chev')}</button>
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
  if (s.name === 'hconnect') { const h = HAPPS.find(x => x[0] === s.k);
    body = `<div class="row"><span class="happ" style="background:${h[3]}">${esc(h[1][0])}</span><h2 class="t1">Connect ${esc(h[1])}</h2></div>
      <p class="muted" style="margin:0">YourDOST will read this data once a day. We never write to ${esc(h[1])}, and ${esc(S.company)} never sees it.</p>
      <div class="list">${['Sleep', 'Steps', 'Workouts', 'Heart rate', 'Mindful minutes'].map((t, i) => `<div class="li"><span class="grow"><b>${t}</b></span><button class="toggle" role="switch" aria-checked="${i < 3}" aria-label="${t}" data-a="toast" data-v="You can change this any time."></button></div>`).join('')}</div>
      <button class="btn primary block" data-a="h-ok">Allow read access</button><button class="btn ghost block" data-a="close">Not now</button>`; }
  if (s.name === 'filter') { const f = S.filt; const grp = (k, label, opts) => `<div class="stack" style="gap:8px"><span class="lbl">${label}</span><div class="row wrap">${opts.map(o => `<button class="chip" data-a="filt" data-k="${k}" data-v="${o}" aria-pressed="${f[k].includes(o)}">${o}</button>`).join('')}</div></div>`;
    const n = expertList().length;
    body = `<div class="row between"><h2 class="t1">Filter &amp; sort</h2><button class="link" data-a="filt-clear">Reset</button></div>
      <div class="stack" style="gap:8px"><span class="lbl">Show first</span><div class="row wrap">${[['match', 'Best match'], ['rating', 'Top rated'], ['soonest', 'Free soonest']].map(([k, l]) => `<button class="chip" data-a="sortc" data-v="${k}" aria-pressed="${S.sort === k}">${l}</button>`).join('')}</div></div>
      ${grp('where', 'Session type', ['Online', 'In person'])}${grp('lang', 'Language', ['English', 'Hindi', 'Tamil', 'Bengali', 'Telugu', 'Malayalam', 'Marathi', 'Urdu'])}${grp('mode', 'Online as', ['Video', 'Call', 'Chat'])}${grp('gender', 'Counsellor', ['Woman', 'Man'])}
      <div class="row between"><span class="lbl">Free today</span><button class="toggle" role="switch" aria-checked="${f.today}" aria-label="Free today" data-a="filt-today"></button></div>
      <button class="btn primary block" data-a="close" ${n ? '' : 'disabled style="opacity:.5"'}>${n ? `Show ${n} expert${n === 1 ? '' : 's'}` : 'No one matches yet'}</button>`; }
  if (s.name === 'sort') body = `<h2 class="t1">Sort by</h2><div class="stack">${[['match', 'Best match'], ['rating', 'Rating'], ['soonest', 'Soonest free']].map(([k, l]) => `<button class="qopt" data-a="sort" data-v="${k}" ${S.sort === k ? 'style="border-color:var(--violet-600)"' : ''}>${l}</button>`).join('')}</div>`;
  if (s.name === 'book') {
    const e = EXM[S.params.ids[S.params.i]], W = X.where || 'online', mo = X.calM || 0, t0 = new Date(); t0.setHours(0, 0, 0, 0);
    if (!X.date) for (let i = 0; i < 42; i++) { const d = new Date(t0); d.setDate(d.getDate() + i); if (availFor(e, d, W).length) { X.date = dkey(d); break; } }
    const first = new Date(t0.getFullYear(), t0.getMonth() + mo, 1), nd = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate(), lead = first.getDay();
    const cells = []; for (let k = 0; k < lead; k++) cells.push('<span></span>');
    for (let d = 1; d <= nd; d++) {
      const dt = new Date(first.getFullYear(), first.getMonth(), d), key = dkey(dt), av = availFor(e, dt, W).length > 0, isT = key === dkey(t0);
      cells.push(`<button class="d ${av ? 'av' : ''} ${X.date === key ? 'sel' : ''} ${isT ? 'today' : ''}" data-a="cald" data-v="${key}" ${av ? '' : 'disabled'} aria-label="${dayLabel(dt)}${av ? ', free' : ', not available'}">${d}</button>`);
    }
    const sel = X.date ? new Date(X.date + 'T12:00') : null, times = sel ? availFor(e, sel, W) : [], lab = sel ? dayLabel(sel) : '';
    const navBtn = (dir, off, label, icon) => `<button class="iconbtn calnav" data-a="calm" data-v="${dir}" ${off ? 'disabled' : ''} aria-label="${label}">${ic(icon)}</button>`;
    body = `<div class="row"><span class="mphoto" style="width:48px;height:56px">${img(e, '', 's')}</span><div><h2 class="t2">Book ${esc(fnm(e.name))}</h2><span class="cap">50 min · ${esc(e.modes.join(', '))} · free (uses 1 of ${S.sessionsLeft})</span></div></div>
      <div class="seg" role="group" aria-label="Session type"><button data-a="bwhere" data-v="online" aria-pressed="${W === 'online'}">${ic('video')}Online</button><button data-a="bwhere" data-v="inperson" aria-pressed="${W === 'inperson'}" ${CLINIC[e.id] ? '' : 'disabled style="opacity:.45"'}>${ic('people')}In person</button></div>
      ${W === 'inperson' ? `<div class="card row" style="box-shadow:none;background:var(--sun-100);padding:12px"><span class="dot" style="background:var(--surface-raised)">${ic('home')}</span><span style="flex:1"><b>${esc(CLINIC[e.id])}</b><span class="cap" style="display:block">Tue, Thu and Sat · 50 min · free for you</span></span></div>` : !CLINIC[e.id] ? `<span class="cap">${esc(fnm(e.name))} sees people online only.</span>` : `<span class="cap">${esc(e.modes.join(', '))} · from anywhere</span>`}
      <div class="calbox"><div class="row between">${navBtn(-1, mo === 0, 'Previous month', 'back')}<b class="t2">${MONTH[first.getMonth()]} ${first.getFullYear()}</b>${navBtn(1, mo >= 1, 'Next month', 'chev')}</div>
        <div class="cal">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(w => `<span class="wd">${w}</span>`).join('')}${cells.join('')}</div>
        <div class="row" style="gap:14px;flex-wrap:wrap"><span class="cap row" style="gap:6px"><i class="lgd lgd-av"></i>Free</span><span class="cap row" style="gap:6px"><i class="lgd lgd-sel"></i>Selected</span><span class="cap row" style="gap:6px"><i class="lgd lgd-no"></i>Not available</span></div></div>
      ${sel ? `<div class="stack" style="gap:8px"><span class="lbl">Times on ${lab}</span><div class="row wrap">${times.map(t => `<button class="slot" data-a="slot" data-v="${lab}|${t}" aria-pressed="${X.slot === lab + '|' + t}">${t}</button>`).join('')}</div></div>` : `<span class="muted">Pick a highlighted date to see times.</span>`}
      <div class="row between" style="align-items:flex-start"><span><b>Share my Dost summary</b><span class="cap" style="display:block">So you don't start from zero. Never shared with ${esc(S.company)}.</span></span><button class="toggle" role="switch" aria-checked="${S.shareSummary}" aria-label="Share summary" data-a="share"></button></div>
      <button class="btn primary block" data-a="book-ok" ${X.slot ? '' : 'disabled style="opacity:.45"'}>${X.slot ? 'Book ' + esc(X.slot.replace('|', ', ')) : 'Pick a date and time'}</button>`;
  }
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
  document.documentElement.dataset.theme = 'light';
  if (!S.onboarded && !['login', 'intro'].includes(S.view)) S.view = 'login';
  const fn = V[S.view] || V.home;
  const keepScroll = $app.querySelector('.screen'); const y = keepScroll ? keepScroll.scrollTop : 0;
  $app.innerHTML = fn() + sheetHTML() + (TOAST ? `<div class="toast" role="status">${esc(TOAST)}</div>` : '');
  const sc = $app.querySelector('.screen'); if (sc && X.keep) sc.scrollTop = y;
  X.keep = true;
  const log = document.getElementById('log'); if (log) log.scrollTop = log.scrollHeight;
  const f = document.getElementById('dform'); if (f) f.onsubmit = e => { e.preventDefault(); const i = document.getElementById('dtext'); const v = i.value; i.value = ''; dostSend(v); };
  if (S.view === 'ex' && X.ex && X.ex.running) runBreath();
  if (S.view === 'deck') bindSwipe();
  if (S.view === 'intro') bindIntro();
  if (S.view === 'ritual' && X.rb) runRitualBreath();
  growAfter();
  if (S.view === 'ritual' && X.ls) runListen();
  if (S.view === 'sos' && X.sos && ['connect', 'call'].includes(X.sos.phase)) runSos();

  const xs = document.getElementById('xsearch');
  if (xs) { xs.oninput = () => { S.q = xs.value; save(); render(); const n = document.getElementById('xsearch'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }; }
  drawTour();
  if (S.view === 'home') autoSlide(); else { clearInterval(EVT); EVT = null; }
  const lf = document.getElementById('loginform'); if (lf) lf.onsubmit = e => { e.preventDefault(); const b = lf.querySelector('[data-a="login"]'); if (b) b.click(); };
}
function deckMove(dir) { const p = S.params, n = p.ids.length; if (n < 2) return; p.i = (p.i + dir + n) % n; X.slot = null; X.date = null; save(); render(); const nx = EXM[p.ids[(p.i + 1) % n]]; if (nx) { const im = new Image(); im.src = `/app/img/${nx.id}.webp?v=2`; } }
function bindSwipe() {
  const el = document.getElementById('swipe'); if (!el) return;
  let x0 = null, dx = 0;
  el.onpointerdown = e => { x0 = e.clientX; dx = 0; el.setPointerCapture(e.pointerId); el.style.transition = 'none'; };
  el.onpointermove = e => { if (x0 === null) return; dx = e.clientX - x0; el.style.transform = `translateX(${dx}px) rotate(${dx / 22}deg)`; };
  const end = () => { if (x0 === null) return; x0 = null; el.style.transition = 'transform .25s ease-out';
    if (Math.abs(dx) > 70 && S.params.ids.length > 1) { el.style.transform = `translateX(${dx < 0 ? -460 : 460}px) rotate(${dx < 0 ? -14 : 14}deg)`; setTimeout(() => deckMove(dx < 0 ? 1 : -1), 200); }
    else el.style.transform = ''; };
  el.onpointerup = end; el.onpointercancel = end;
  el.onkeydown = e => { if (e.key === 'ArrowLeft') deckMove(-1); if (e.key === 'ArrowRight') deckMove(1); };
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
/* =====================================================================
   GROW 2: one-screen hub → Check yourself · Do something · Read · Journal · Train your mind
   Everything clinical uses published, validated questionnaires with their standard wording and scoring.
   ===================================================================== */
if (!S.tests || typeof S.tests !== 'object') S.tests = {};
if (!Array.isArray(S.acts)) S.acts = [];
if (!S.games || typeof S.games !== 'object') S.games = { days: [], best: {} };
if (!S.health || typeof S.health !== 'object') S.health = {};
if (!Array.isArray(S.reads)) S.reads = [];
const todayK = () => dkey(new Date());
const P2 = {
  flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.3 2.3-5.3 3.6-7.8.3 1.6 1.1 2.8 2.2 3.4.2-2.9 1.8-5.6 4.2-7.4-.3 2.6.6 4.6 2 6.3 1.1 1.4 1.9 3 1.9 5.2C19.4 18.3 16 21 12 21z"/>',
  drop: '<path d="M12 3.5c3 3.8 6 7.3 6 10.6a6 6 0 0 1-12 0c0-3.3 3-6.8 6-10.6z"/>',
  puzzle: '<path d="M9 4h3.2a1.8 1.8 0 1 1 3.6 0H19v4.2a1.8 1.8 0 1 1 0 3.6V16h-3.2a1.8 1.8 0 1 0-3.6 0H9v-4.2a1.8 1.8 0 1 0 0-3.6z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  file: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  clip: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4.5h6v2.5H9zM9 12l2 2 4-4"/>',
  gridv: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  listv: '<rect x="4" y="5" width="5" height="5" rx="1.2"/><rect x="4" y="14" width="5" height="5" rx="1.2"/><path d="M12 6.5h8M12 9h5M12 15.5h8M12 18h5"/>',
  timer: '<circle cx="12" cy="13" r="7"/><path d="M12 13V9.5M10 3h4"/>',
};
const ic2 = (n, x = '') => P2[n] ? `<svg class="i ${x}" viewBox="0 0 24 24" aria-hidden="true">${P2[n]}</svg>` : ic(n, x);

/* ---------- Check yourself: validated screeners ---------- */
const OPT_PHQ = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];
const TESTS = {
  gad7: { name: 'Am I anxious?', tool: 'GAD-7', cite: 'Spitzer et al., 2006', tint: 'violet', tag: 'anx', lead: 'Over the last 2 weeks, how often have you been bothered by…', opts: OPT_PHQ, vals: [0, 1, 2, 3],
    qs: ['Feeling nervous, anxious, or on edge', 'Not being able to stop or control worrying', 'Worrying too much about different things', 'Trouble relaxing', 'Being so restless that it is hard to sit still', 'Becoming easily annoyed or irritable', 'Feeling afraid, as if something awful might happen'],
    max: 21, bands: [[4, 'Minimal anxiety', 'Very few signs of anxiety right now. Keep doing what helps.'], [9, 'Mild anxiety', 'Some worry is showing up. Short daily calming habits can help a lot.'], [14, 'Moderate anxiety', 'Anxiety is getting in the way. Talking to a counsellor is a good next step.'], [21, 'Severe anxiety', 'This is a lot to carry. Please talk to a counsellor soon. You don\'t have to manage it alone.']] },
  phq9: { name: 'Am I feeling low?', tool: 'PHQ-9', cite: 'Kroenke et al., 2001', tint: 'peach', tag: 'low', lead: 'Over the last 2 weeks, how often have you been bothered by…', opts: OPT_PHQ, vals: [0, 1, 2, 3], risk: 8,
    qs: ['Little interest or pleasure in doing things', 'Feeling down, depressed, or hopeless', 'Trouble falling or staying asleep, or sleeping too much', 'Feeling tired or having little energy', 'Poor appetite or overeating', 'Feeling bad about yourself, or that you are a failure or have let yourself or your family down', 'Trouble concentrating on things, such as reading or watching television', 'Moving or speaking so slowly that other people could have noticed, or being so fidgety or restless that you have been moving around a lot more than usual', 'Thoughts that you would be better off dead, or of hurting yourself in some way'],
    max: 27, bands: [[4, 'Minimal low mood', 'Very few signs of low mood right now.'], [9, 'Mild low mood', 'Some low days. Small daily steps and a check-in in two weeks can help.'], [14, 'Moderate low mood', 'Low mood is affecting your days. A counsellor can help you work through it.'], [19, 'Moderately severe low mood', 'This is weighing on you a lot. Please book a counsellor this week.'], [27, 'Severe low mood', 'Please talk to someone soon. A counsellor is available today.']] },
  pss10: { name: 'Am I stressed?', tool: 'PSS-10', cite: 'Cohen et al., 1983', tint: 'sun', tag: 'work', lead: 'In the last month, how often have you…', opts: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'], vals: [0, 1, 2, 3, 4], rev: [3, 4, 6, 7],
    qs: ['been upset because of something that happened unexpectedly?', 'felt that you were unable to control the important things in your life?', 'felt nervous and stressed?', 'felt confident about your ability to handle your personal problems?', 'felt that things were going your way?', 'found that you could not cope with all the things that you had to do?', 'been able to control irritations in your life?', 'felt that you were on top of things?', 'been angered because of things that happened that were outside of your control?', 'felt difficulties were piling up so high that you could not overcome them?'],
    max: 40, bands: [[13, 'Low stress', 'Your stress looks manageable right now.'], [26, 'Moderate stress', 'Stress is building. Regular breaks and a wind-down routine can help.'], [40, 'High stress', 'You\'re under a lot of pressure. A counsellor can help you find some room to breathe.']] },
  who5: { name: 'How is my emotional wellbeing?', tool: 'WHO-5', cite: 'Topp et al., 2015', tint: 'sage', tag: 'low', lead: 'Over the last 2 weeks…', opts: ['At no time', 'Some of the time', 'Less than half of the time', 'More than half of the time', 'Most of the time', 'All of the time'], vals: [0, 1, 2, 3, 4, 5], good: true, mult: 4,
    qs: ['I have felt cheerful and in good spirits', 'I have felt calm and relaxed', 'I have felt active and vigorous', 'I woke up feeling fresh and rested', 'My daily life has been filled with things that interest me'],
    max: 100, bands: [[28, 'Low wellbeing', 'Your wellbeing is low right now. Talking to a counsellor is a good idea.'], [50, 'Wellbeing could be better', 'Some things are wearing you down. Small daily care can lift this.'], [100, 'Good wellbeing', 'You\'re in a good place. Notice what\'s helping and keep it going.']] },
  bsmas: { name: 'Is social media taking over?', tool: 'BSMAS', cite: 'Andreassen et al., 2016', tint: 'violet', tag: 'work', lead: 'Over the last year, how often have you…', opts: ['Very rarely', 'Rarely', 'Sometimes', 'Often', 'Very often'], vals: [1, 2, 3, 4, 5],
    qs: ['spent a lot of time thinking about social media or planning to use it?', 'felt an urge to use social media more and more?', 'used social media to forget about personal problems?', 'tried to cut down on social media without success?', 'become restless or troubled if you couldn\'t use social media?', 'used social media so much that it hurt your job or studies?'],
    min: 6, max: 30, bands: [[18, 'Healthy use', 'Social media doesn\'t seem to be taking over.'], [23, 'Some warning signs', 'A few habits are worth watching. Try phone-free times in your day.'], [30, 'Strong signs of problem use', 'Social media may be taking over. A counsellor can help you reset the habit.']] },
  cage: { name: 'Alcohol or drugs?', tool: 'CAGE-AID', cite: 'Brown & Rounds, 1995', tint: 'peach', tag: 'low', lead: 'Answer yes or no.', opts: ['No', 'Yes'], vals: [0, 1],
    qs: ['Have you ever felt you ought to cut down on your drinking or drug use?', 'Have people annoyed you by criticising your drinking or drug use?', 'Have you felt bad or guilty about your drinking or drug use?', 'Have you ever had a drink or used drugs first thing in the morning to steady your nerves or get rid of a hangover?'],
    max: 4, bands: [[0, 'No warning signs', 'No signs of a problem with alcohol or drugs.'], [1, 'Worth keeping an eye on', 'One sign showed up. It may help to notice when and why you drink or use.'], [4, 'Signs of a possible problem', 'Your answers suggest alcohol or drug use may be a problem. A counsellor can help, without judgement.']] },
};
const TEST_ORDER = ['gad7', 'phq9', 'pss10', 'who5', 'bsmas', 'cage'];
function testScore(t, ans) {
  let s = ans.reduce((sum, v, i) => sum + (t.rev && t.rev.includes(i) ? (t.vals[t.vals.length - 1] + t.vals[0]) - v : v), 0);
  if (t.mult) s *= t.mult; return s;
}
const testBand = (t, s) => { const i = t.bands.findIndex(b => s <= b[0]); return { i, b: t.bands[i] }; };
V.tests = () => `<div class="screen notab">${top('Check yourself')}
  <p class="muted" style="margin:0">Short, clinically tested questionnaires that counsellors use. Each takes about 2 minutes. They're a check-in, not a diagnosis.</p>
  <div class="stack" style="gap:10px">${TEST_ORDER.map(id => { const t = TESTS[id], h = (S.tests[id] || []).slice(-1)[0];
    return `<button class="tcard tint-${t.tint}" data-a="test" data-v="${id}"><span class="stack" style="gap:2px;flex:1"><b class="t2" style="font-size:17px">${t.name}</b><span class="cap">${t.qs.length} questions · ${t.tool}</span></span>
      ${h ? `<span class="tag" style="background:var(--surface-raised)">${esc(testBand(t, h.s).b[1])}</span>` : `<span class="go">${ic('chev')}</span>`}</button>`; }).join('')}</div>
  <p class="cap" style="margin:0">${ic('lock')} Answers stay on this phone. ${esc(S.company)} never sees them.</p></div>`;
V.test = () => {
  const id = S.params.id, t = TESTS[id], st = X.t || (X.t = { a: S.params.a ? S.params.a.slice() : [] }), i = st.a.length, vis = S.params.vis || [];
  if (i >= t.qs.length) {
    const s = testScore(t, st.a), { i: bi, b } = testBand(t, s), prev = (S.tests[id] || []).slice(-2, -1)[0];
    const lo = t.min || 0, pct = (s - lo) / (t.max - lo), heavy = t.good ? bi === 0 : bi >= Math.max(2, t.bands.length - 2), risk = t.risk !== undefined && st.a[t.risk] > 0;
    const ex = EX_FOR[t.tag] || 'ex_box', pg = PG_FOR[t.tag] || 'pg_calm';
    return `<div class="screen notab">${top(t.name)}
      ${risk ? `<div class="card tint-help stack" style="box-shadow:none;gap:8px"><b>Thank you for being honest about this.</b><span class="muted">You said you've had thoughts of being better off dead or hurting yourself. You deserve support right now.</span><button class="btn helpbtn block" data-a="sos" style="background:var(--surface-raised)">${ic('phone')}Talk to someone now</button></div>` : ''}
      <div class="tresult tint-${t.tint}"><span class="eyebrow">Your result</span>
        <div class="meter ${t.good ? 'good' : ''}"><i style="width:${Math.max(4, pct * 100)}%"></i></div><div class="row between"><span class="cap">${t.good ? 'Low' : 'Fewer signs'}</span><span class="cap">${t.good ? 'High' : 'More signs'}</span></div>
        <h2 class="rq">${esc(b[1])}</h2><p style="margin:0">${esc(b[2])}</p>
        <span class="cap">Score ${s} of ${t.max}${prev ? ` · last time ${prev.s}` : ''} · ${t.tool} (${t.cite})</span></div>
      <p class="cap" style="margin:0">This is a screening questionnaire, not a diagnosis. Only a professional can diagnose.</p>
      <h2 class="t2">What might help</h2>
      ${heavy || risk ? `<button class="btn primary block" data-a="tab" data-v="experts">${ic('people')}Talk to a counsellor</button>` : ''}
      <div class="list">${[['ex', ex, 'sage', 'play', EX[ex].name, `${EX[ex].mins} min · try it now`, S.doneToday[ex]], ['pg', pg, 'sun', 'grow', PG[pg].name, '7-day program', vis.includes('pg')], ['dost', '', 'violet', 'mic', 'Talk it through with Dost', '2 minutes', vis.includes('dost')], ['act', 'worry', 'peach', 'grow', 'The Worry Tree', '4 min · sort a worry', S.doneToday.worry]].map(([a, v, tint, icon, name, sub, done]) =>
        `<button class="li" data-a="${a}" data-v="${v}" data-tv="${a}"><span class="dot tint-${tint}">${done ? ic('check') : ic2(icon)}</span><span class="grow"><b>${esc(name)}</b><span class="cap" style="display:block">${done ? 'Done · nice work' : esc(sub)}</span></span>${done ? `<span class="tag sage">${ic('check')}Done</span>` : ic('chev', 'chev')}</button>`).join('')}</div>
      <p class="cap" style="margin:0">Try one, then come back here for the next.</p>
      <button class="link" data-a="test-again" style="justify-self:center">Take it again in 2 weeks to see how you're doing</button></div>`;
  }
  return `<div class="screen notab">${top(t.name)}<div class="bar"><i style="width:${i / t.qs.length * 100}%;background:var(--violet-600)"></i></div>
    <span class="cap">Question ${i + 1} of ${t.qs.length}</span><span class="muted">${esc(t.lead)}</span>
    <h2 class="rq">${esc(t.qs[i])}</h2><div class="stack" style="gap:8px">${t.opts.map((o, k) => `<button class="qopt" data-a="tans" data-v="${t.vals[k]}">${o}</button>`).join('')}</div>
    <div style="flex:1"></div>${i ? `<button class="link" data-a="tprev" style="justify-self:center">Back a question</button>` : ''}</div>`;
};

/* ---------- Do something: activities ---------- */
const ACTS = {
  balloon: { name: 'Balloon belly breathing', kind: 'Breathe', mins: 2, tint: 'peach', icon: 'play', sub: 'Animated guide · breathe along' },
  water: { name: 'Water and a 1-minute pause', kind: 'Calm', mins: 1, tint: 'sage', icon: 'drop', sub: 'Sip slowly, do nothing else' },
  still: { name: '1-minute stillness', kind: 'Calm', mins: 1, tint: 'violet', icon: 'moon', sub: 'Sit, breathe, notice' },
  listen: { name: 'Listen and settle', kind: 'Calm', mins: 1, tint: 'violet', icon: 'play', sub: 'Rain, ocean or a warm hum' },
  worry: { name: 'The Worry Tree', kind: 'Mind', mins: 4, tint: 'sun', icon: 'grow', sub: 'Sort a worry: act on it or let it go' },
  pomo: { name: 'Pomodoro focus', kind: 'Focus', mins: 25, tint: 'peach', icon: 'timer', sub: '25 minutes on, then a break' },
};
const ACT_EX = ['ex_box', 'ex_478', 'ex_ground', 'ex_body', 'ex_good'];
const ACT_KINDS = ['All', 'Breathe', 'Calm', 'Focus', 'Mind'];
const exKind = id => EX[id].kind === 'breath' ? 'Breathe' : EX[id].kind === 'journal' ? 'Mind' : 'Calm';
V.acts = () => {
  const k = X.ak || 'All', fit = c => k === 'All' || c === k;
  const rows = [...Object.entries(ACTS).filter(([, a]) => fit(a.kind)).map(([id, a]) => `<button class="li" data-a="act" data-v="${id}"><span class="dot tint-${a.tint}">${ic2(a.icon)}</span><span class="grow"><b>${esc(a.name)}</b><span class="cap" style="display:block">${a.mins} min · ${esc(a.sub)}</span></span>${S.acts.some(x => x.id === id && x.d === todayK()) ? `<span class="tag sage">${ic('check')}</span>` : ic('chev', 'chev')}</button>`),
    ...ACT_EX.filter(id => fit(exKind(id))).map(id => `<button class="li" data-a="ex" data-v="${id}"><span class="dot tint-${EX[id].tint}">${ic(EX[id].kind === 'journal' ? 'pen' : 'play')}</span><span class="grow"><b>${esc(EX[id].name)}</b><span class="cap" style="display:block">${EX[id].mins} min · ${esc(EX[id].why)}</span></span>${S.doneToday[id] ? `<span class="tag sage">${ic('check')}</span>` : ic('chev', 'chev')}</button>`)];
  return `<div class="screen notab">${top('Do something')}
    <div class="row chipsx" style="gap:8px;overflow-x:auto;flex-wrap:nowrap;margin:0 -16px;padding:0 16px">${ACT_KINDS.map(c => `<button class="chip" style="flex:none" data-a="akind" data-v="${c}" aria-pressed="${k === c}">${c}</button>`).join('')}</div>
    <div class="list">${rows.join('')}</div>
    <p class="cap" style="margin:0">After each one, you'll note how you feel. It helps you see what works for you.</p></div>`;
};
const BAL = [['Breathe in through your nose', 4], ['The balloon fills… and out slowly', 6]];
V.act = () => {
  const id = S.params.id, A = ACTS[id], st = X.a || (X.a = { on: false, done: false });
  let body = '';
  if (id === 'balloon') body = `<div class="balloon ${st.on ? 'on' : ''}" aria-hidden="true">
      <svg viewBox="0 0 200 220"><circle cx="100" cy="46" r="26" fill="#F5C9A6"/><path d="M90 44h.01M110 44h.01" stroke="#2F2663" stroke-width="5" stroke-linecap="round"/><path d="M92 56c5 4 11 4 16 0" stroke="#2F2663" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M58 210c0-58 18-118 42-118s42 60 42 118z" fill="#C7B8F5"/>
        <g class="bal"><ellipse cx="100" cy="150" rx="26" ry="28" fill="#E5484D"/><ellipse cx="91" cy="140" rx="7" ry="9" fill="#FFFFFF" opacity=".35"/></g>
        <path class="hand" d="M60 128c14 2 26 10 34 20l-6 6c-8-8-18-14-30-16z" fill="#F5C9A6"/></svg></div>
    <p class="rq" style="text-align:center;font-size:22px;min-height:56px" id="bcap">${st.on ? '' : 'Put one hand on your stomach. Imagine a red balloon inside.'}</p>
    <p class="cap rwhy">${ic('book')} Slow belly breathing activates the body's calming system and lowers stress (Ma et al., Frontiers in Psychology, 2017).</p>
    <div style="flex:1"></div>${st.done ? `<button class="btn primary block" data-a="act-done">I'm done</button>` : st.on ? `<button class="btn ghost block" data-a="act-done">I'm done</button>` : `<button class="btn sage block" data-a="act-go">${ic('play')}Play · 2 minutes</button>`}`;
  if (id === 'water' || id === 'still' || id === 'listen') {
    const tips = { water: ['Get a glass of water.', 'Take a slow sip. Notice how it feels.', 'Put the glass down. Just sit.', 'Another sip. Nothing else to do.'], still: ['Sit comfortably. Let your shoulders drop.', 'Notice your breath. Don\'t change it.', 'If your mind wanders, that\'s okay. Come back.', 'Notice one sound around you.'], listen: ['Close your eyes if that feels okay.', 'Let the sound fill the room.', 'Breathe a little slower than usual.', 'Stay with the sound.'] }[id];
    body = `${id === 'listen' ? `<div class="row" style="gap:8px;justify-content:center">${Object.entries(SOUNDS).map(([k, o]) => `<button class="chip" data-a="act-snd" data-v="${k}" aria-pressed="${(X.snd || 'rain') === k}">${o.name}</button>`).join('')}</div>` : ''}
      <div class="atimer ${id} ${st.on ? 'on' : ''}" aria-hidden="true">${id === 'water' ? '<span class="glass"><i></i></span>' : id === 'listen' ? `<span class="lwave ${st.on ? 'on' : ''}">${[0, 1, 2, 3, 4].map(j => `<i style="--k:${j}"></i>`).join('')}</span>` : '<span class="stillring"></span>'}<b id="atime">${st.done ? 'Done' : '1:00'}</b></div>
      <p class="rq" style="text-align:center;font-size:22px;min-height:56px" id="atip">${esc(tips[0])}</p>
      <div style="flex:1"></div>${st.done ? `<button class="btn primary block" data-a="act-done">Next: how do you feel?</button>` : st.on ? `<button class="btn ghost block" data-a="act-done">I'm done</button>` : `<button class="btn sage block" data-a="act-go">${ic('play')}Start · 1 minute</button>`}`;
    X.tips = tips;
  }
  if (id === 'worry') body = worryBody();
  if (id === 'pomo') body = pomoBody();
  return `<div class="screen notab">${top(A.name)}${body}</div>`;
};
/* Worry Tree (from the YourDOST worksheet) */
function worryBody() {
  const w = X.w || (X.w = { s: 'notice', text: '', opts: ['', '', ''] }), crumb = { notice: 1, can: 2, plan: 3, now: 3, doit: 4, later: 4, letgo: 5 }[w.s];
  const tree = `<div class="wcrumb">${['Notice', 'Can I act?', 'Plan', 'Act or schedule', 'Let it go'].map((l, i) => `<span class="${i + 1 <= crumb ? 'on' : ''}">${l}</span>`).join('')}</div>`;
  const yesno = (y, n) => `<div class="row" style="gap:10px"><button class="btn primary" style="flex:1" data-a="w-go" data-v="${y}">Yes</button><button class="btn soft" style="flex:1" data-a="w-go" data-v="${n}">No</button></div>`;
  let b = '';
  if (w.s === 'notice') b = `<span class="eyebrow">Notice the worry</span><h2 class="rq">What am I worrying about?</h2><textarea id="wtext" class="field" rows="4" placeholder="Put it in one or two lines">${esc(w.text)}</textarea><div style="flex:1"></div><button class="btn primary block" data-a="w-go" data-v="can">Next</button>`;
  if (w.s === 'can') b = `<span class="eyebrow">Ask the question</span>${w.text ? `<p class="note" style="font-size:20px;color:var(--ink)">“${esc(w.text)}”</p>` : ''}<h2 class="rq">Can I do something about it?</h2><div style="flex:1"></div>${yesno('plan', 'letgo')}`;
  if (w.s === 'plan') b = `<span class="eyebrow">Action plan</span><h2 class="rq">List your options</h2><span class="muted">Even small ones count.</span>${w.opts.map((o, i) => `<input class="field wopt" data-k="${i}" value="${esc(o)}" placeholder="Option ${i + 1}">`).join('')}<div style="flex:1"></div><button class="btn primary block" data-a="w-go" data-v="now">Next</button>`;
  if (w.s === 'now') b = `<span class="eyebrow">Action plan</span><h2 class="rq">Is there anything I can do right now?</h2>${w.opts.filter(Boolean).length ? `<ul class="rlist">${w.opts.filter(Boolean).map(o => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}<div style="flex:1"></div>${yesno('doit', 'later')}`;
  if (w.s === 'doit') b = `<span class="eyebrow">Do it!</span><h2 class="rq">Go and do it now. Come back when you're done.</h2><span class="muted">Then let the worry go. If it comes back, set a 20-minute “worry period” later in the day and write your worries down then.</span><div style="flex:1"></div><button class="btn primary block" data-a="w-go" data-v="letgo">Done. Let it go</button>`;
  if (w.s === 'later') b = `<span class="eyebrow">Schedule it for later</span><h2 class="rq">When will you do it?</h2><div class="row wrap">${['This evening', 'Tomorrow', 'This weekend'].map(t => `<button class="chip" data-a="w-when" data-v="${t}" aria-pressed="${w.when === t}">${t}</button>`).join('')}</div>
    <div class="card stack" style="box-shadow:none;background:var(--violet-100)"><b>Plan what you can do, and how</b><span class="muted">Don't ask “Why am I missing deadlines?” Ask “How can I manage my time better?” Then make a to-do list and work on it bit by bit.</span></div><div style="flex:1"></div><button class="btn primary block" data-a="w-go" data-v="letgo" ${w.when ? '' : 'disabled style="opacity:.5"'}>Scheduled. Let it go</button>`;
  if (w.s === 'letgo') b = `<span class="eyebrow">Let the worry go</span><h2 class="rq">Now, change the focus of your attention.</h2>
    <div class="card stack" style="box-shadow:none;background:var(--peach-100)"><b>Focus on the future</b><span class="muted">Ask: “How can I make the most of this?” or “What's my next best move?”</span></div>
    <div class="card stack" style="box-shadow:none;background:var(--sun-100)"><b>Focus on good moments</b><span class="muted">Ask yourself about your favourite part of today, rather than the worst.</span></div>
    <div style="flex:1"></div><button class="btn primary block" data-a="act-done">Finish</button>`;
  return `${tree}${b}<p class="cap" style="margin:0">From the YourDOST Worry Tree worksheet.</p>`;
}
/* Pomodoro (from the YourDOST worksheet) */
const POMO_MIN = 25;
function pomoBody() {
  const p = X.p || (X.p = { s: 'list', tasks: ['', '', ''], cur: 0, n: 0, parked: [], demo: true });
  if (p.s === 'list') return `<span class="eyebrow">Step 1</span><h2 class="rq">Write a list of key tasks to complete</h2>${p.tasks.map((t, i) => `<input class="field ptask" data-k="${i}" value="${esc(t)}" placeholder="Task ${i + 1}">`).join('')}
    <label class="row between card" style="box-shadow:none;background:var(--surface-sunken)"><span><b>Quick demo</b><span class="cap" style="display:block">25 seconds instead of 25 minutes</span></span><button class="toggle" role="switch" aria-checked="${p.demo}" data-a="p-demo" aria-label="Quick demo"></button></label>
    <div style="flex:1"></div><button class="btn primary block" data-a="p-start">${ic2('timer')}Set a timer for 25 minutes</button>`;
  const tasks = p.tasks.filter(Boolean), task = tasks[p.cur];
  if (p.s === 'run') return `<div class="pring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="var(--peach-100)" stroke-width="8"/><circle id="parc" cx="60" cy="60" r="54" fill="none" stroke="var(--peach-400)" stroke-width="8" stroke-linecap="round" stroke-dasharray="339.3" stroke-dashoffset="0" transform="rotate(-90 60 60)"/></svg><b id="ptime">25:00</b><span class="cap">Pomodoro ${p.n + 1}</span></div>
    <div class="card stack" style="gap:4px"><span class="lbl muted">Working on</span><b class="t2">${esc(task || 'Your list')}</b></div>
    <div class="row" style="gap:8px"><input id="ppark" class="field" placeholder="Distracted? Park it here and keep working"><button class="iconbtn" data-a="p-park" aria-label="Park it" style="background:var(--surface-sunken)">${ic('check')}</button></div>
    ${p.parked.length ? `<span class="cap">Parked for later: ${p.parked.map(esc).join(' · ')}</span>` : ''}
    <div style="flex:1"></div><button class="btn sage block" data-a="p-task">${ic('check')}Finished this task · next one</button>`;
  if (p.s === 'ding') { const long = p.n % 4 === 0; return `<span class="burst" aria-hidden="true" style="align-self:center">${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<i class="b${k}"></i>`).join('')}</span>
    <h1 class="rbig" style="text-align:center">Congrats!<br><span class="swash">${p.n} Pomodoro${p.n > 1 ? 's' : ''}</span> done.</h1>
    <p class="lg" style="text-align:center;margin:0">${long ? 'Four in a row. Take a longer 20 to 30 minute break.' : 'Take a 5 minute break. Stand up, stretch, look far away.'}</p>
    <div style="flex:1"></div><button class="btn primary block" data-a="p-again">Start the next Pomodoro</button><button class="btn soft block" data-a="act-done">I've finished my essential tasks</button>`; }
  return '';
}
let AT = null;
function runAct() {
  clearInterval(AT); AT = null;
  const id = S.params.id, st = X.a; if (S.view !== 'act' || !st) return;
  if (id === 'balloon' && st.on) { const t0 = st.t0; AT = setInterval(() => { const c = document.getElementById('bcap'); if (!c || S.view !== 'act') { clearInterval(AT); return; } const e = ((Date.now() - t0) / 1000); if (e > 120) { st.on = false; st.done = true; clearInterval(AT); render(); return; } c.textContent = (e % 10) < 4 ? 'Breathe in through your nose. The balloon fills.' : 'Breathe out slowly. The balloon gets smaller.'; }, 250); }
  if (['water', 'still', 'listen'].includes(id) && st.on) { const t0 = st.t0; AT = setInterval(() => { const el = document.getElementById('atime'), tp = document.getElementById('atip'); if (!el || S.view !== 'act') { clearInterval(AT); return; } const left = Math.max(0, 60 - Math.floor((Date.now() - t0) / 1000)); el.textContent = `0:${String(left).padStart(2, '0')}`; if (tp && X.tips) tp.textContent = X.tips[Math.min(3, Math.floor((60 - left) / 15))]; if (!left) { st.on = false; st.done = true; clearInterval(AT); stopSound(); render(); } }, 250); }
  if (id === 'pomo' && X.p && X.p.s === 'run') { const p = X.p, total = (p.demo ? POMO_MIN : POMO_MIN * 60) * 1000, t0 = p.t0; AT = setInterval(() => { const el = document.getElementById('ptime'), arc = document.getElementById('parc'); if (!el || S.view !== 'act') { clearInterval(AT); return; } const left = Math.max(0, total - (Date.now() - t0)), secs = Math.ceil(left / 1000) * (p.demo ? 60 : 1); el.textContent = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`; arc.style.strokeDashoffset = 339.3 * (1 - left / total); if (!left) { clearInterval(AT); p.n++; p.s = 'ding'; render(); } }, 200); }
}
/* after any activity: how did it feel, plus a note */
V.reflect = () => {
  const r = X.rf || (X.rf = { m: null }), id = S.params.id, name = ACTS[id] ? ACTS[id].name : EX[id] ? EX[id].name : 'That';
  return `<div class="screen notab glow" style="gap:16px">
    <span class="burst" aria-hidden="true" style="align-self:center">${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<i class="b${k}"></i>`).join('')}</span>
    <h1 class="rbig" style="text-align:center;font-size:36px">Nice work.<br><span class="swash">That counts.</span></h1>
    <p class="muted" style="text-align:center;margin:0">${esc(name)} · done</p>
    <div class="card stack"><b>How do you feel now?</b><div class="moods">${MOODS.map((m, i) => `<button class="mood ${r.m === i ? 'sel' : ''}" data-a="rf-m" data-v="${i}" aria-pressed="${r.m === i}"><span class="mface" style="--mf:${MOOD_FILL[i]};${r.m === i ? 'background:var(--mf)' : ''}">${face(i)}</span><span>${m[0]}</span></button>`).join('')}</div>
      <label class="lbl" for="rfnote">A quick note for yourself</label><textarea id="rfnote" class="field" rows="3" placeholder="What did you notice? Did it help?"></textarea></div>
    ${r.m === 0 ? `<div class="card tint-help row" style="box-shadow:none"><span style="flex:1">Rough moment? A counsellor is here.</span><button class="btn helpbtn sm" data-a="sos" style="background:var(--surface-raised)">Talk now</button></div>` : ''}
    <div style="flex:1"></div><button class="btn primary block" data-a="rf-save">Save</button><button class="link" data-a="rf-skip" style="justify-self:center">Skip</button></div>`;
};
V.exdone = () => { S.params.id = S.params.from; return V.reflect(); };

/* ---------- Read ---------- */
const ARTS = {
  night: { t: 'Why your mind races at night, and how to slow it down', tag: 'Sleep', mins: 4, tint: 'violet',
    body: [['', 'You finally lie down, the room goes quiet, and your mind gets louder. It is one of the most common things people tell counsellors. The good news: a racing mind at night is a habit, and habits can be changed.'], ['Why it happens', 'During the day, tasks and people keep your attention busy. At night, there is nothing to hold it, so unfinished thoughts come back. Tiredness also makes worries feel bigger than they are.'], ['Try this tonight', '1. Write a “tomorrow list” an hour before bed, so your brain knows nothing will be forgotten.\n2. Keep your phone outside arm\'s reach.\n3. If you can\'t sleep after 20 minutes, get up, do something dull in dim light, and go back when sleepy.\n4. Try a long out-breath: in for 4, out for 8.'], ['When to get help', 'If poor sleep lasts more than a few weeks or affects your work, talk to a counsellor. Sleep problems respond well to support.']], act: 'ex_478' },
  worry: { t: 'The Worry Tree: a simple way to sort your worries', tag: 'Anxiety', mins: 3, tint: 'sun',
    body: [['', 'Some worries need action. Others just need to be put down. The Worry Tree helps you tell which is which, in a few minutes.'], ['How it works', 'Notice the worry and name it. Then ask: can I do something about it? If not, let it go and turn your attention to something else. If yes, list your options and ask whether you can act right now. If you can, do it. If not, schedule it for later.'], ['Why it helps', 'Worry feels endless because it loops. Making a decision, act now, act later, or let go, breaks the loop and gives your mind permission to rest.'], ['Make a worry period', 'Give yourself 20 minutes a day to worry on purpose. When a worry pops up at other times, write it down and save it for then.']], act: 'worry' },
  pomo: { t: 'Focus in 25 minutes: the Pomodoro way', tag: 'Focus', mins: 3, tint: 'peach',
    body: [['', 'Texts, emails, a colleague with a quick question. Focus is hard. The Pomodoro technique protects it in small, kind chunks.'], ['The steps', 'Write a list of key tasks. Set a timer for 25 minutes and start. If something distracts you, note it down and keep working. When the timer goes off, take a 5 minute break. After four rounds, take a longer 20 to 30 minute break.'], ['Why it works', 'A short, fixed time makes starting easier, and regular breaks stop you from burning out. You\'ll often get more done in fewer hours.'], ['Be kind to yourself', 'At the end of the day, be proud of what you did, not upset about what\'s left.']], act: 'pomo' },
  burnout: { t: 'Tired or burnt out? How to tell the difference', tag: 'Work', mins: 4, tint: 'sage',
    body: [['', 'Everyone gets tired. Burnout is different: rest doesn\'t fix it.'], ['Signs of burnout', 'Feeling drained even after a weekend. Feeling distant or cynical about work. Feeling that nothing you do makes a difference. Dreading Sunday evenings.'], ['What helps', 'Small boundaries: a fixed time to stop work, one evening a week with no screens, saying no to one thing. Talk to your manager about workload if you can. And talk to someone, a friend or a counsellor, about how you feel.'], ['Check yourself', 'The “Am I stressed?” check in Grow takes 2 minutes and can show you where you are.']], act: 'ex_box' },
  friend: { t: 'How to be there for a friend who is struggling', tag: 'Relationships', mins: 3, tint: 'peach',
    body: [['', 'You don\'t need the perfect words. Showing up matters more.'], ['Do', 'Ask “How are you, really?” and wait. Listen more than you talk. Say “That sounds hard.” Offer something specific, like a walk or a call on Thursday.'], ['Avoid', 'Jumping to advice. Comparing with your own problems. Saying “just think positive”.'], ['If you\'re worried about their safety', 'Ask directly if they are thinking of hurting themselves. It does not put the idea in their head. Help them call Tele-MANAS 14416, or 112 in an emergency.']], act: null },
};
V.read = () => {
  const ids = Object.keys(ARTS), f = ARTS[ids[0]];
  return `<div class="screen notab">${top('Read')}
    <button class="artfeat tint-${f.tint}" data-a="art" data-v="${ids[0]}"><span class="tag" style="background:var(--surface-raised)">${f.tag} · ${f.mins} min</span><b class="arthead">${esc(f.t)}</b><span class="cap">Featured</span></button>
    <div class="list">${ids.slice(1).map(id => { const a = ARTS[id]; return `<button class="li" data-a="art" data-v="${id}"><span class="artthumb tint-${a.tint}">${ic('book')}</span><span class="grow"><b style="font-size:15px;line-height:20px;display:block">${esc(a.t)}</b><span class="cap">${a.tag} · ${a.mins} min read${S.reads.includes(id) ? ' · read' : ''}</span></span></button>`; }).join('')}</div>
    <p class="cap" style="margin:0">Sample articles for this prototype, written in the style of the YourDOST blog.</p></div>`;
};
V.art = () => {
  const id = S.params.id, a = ARTS[id], act = a.act;
  return `<div class="screen notab">${top(a.tag)}
    <div class="arthero tint-${a.tint}"><span class="cap">${a.tag} · ${a.mins} min read</span><h1 class="arthead" style="font-size:28px;line-height:34px">${esc(a.t)}</h1><span class="cap">By the YourDOST team</span></div>
    <article class="artbody">${a.body.map(([h, p]) => `${h ? `<h2 class="t2">${esc(h)}</h2>` : ''}${p.split('\n').map(x => `<p>${esc(x)}</p>`).join('')}`).join('')}</article>
    ${act ? `<button class="card row" style="border:0;text-align:left;background:var(--violet-100);box-shadow:none" data-a="${ACTS[act] ? 'act' : 'ex'}" data-v="${act}"><span class="dot" style="background:var(--surface-raised)">${ic('play')}</span><span style="flex:1"><b>Try it now</b><span class="cap" style="display:block">${esc(ACTS[act] ? ACTS[act].name : EX[act].name)}</span></span>${ic('chev', 'chev')}</button>` : ''}
    <div class="row between"><span class="lbl">Was this helpful?</span><span class="row" style="gap:8px"><button class="chip" data-a="toast" data-v="Thanks. We'll show you more like this.">Yes</button><button class="chip" data-a="toast" data-v="Thanks for telling us.">Not really</button></span></div></div>`;
};

/* ---------- Journal: one place, three gentle ways in ---------- */
const JPROMPTS = ["What's on your mind right now?", 'What is one thing you are grateful for today?', 'What went well today, and why?', 'What is something you would like to let go of?', 'How did you take care of yourself today?', 'What would you tell a friend who felt like you do?'];
V.journal = () => {
  const j = X.j || (X.j = { open: false, p: null, m: null });
  const groups = {}; S.journal.slice().reverse().forEach(e => { (groups[e.d] = groups[e.d] || []).push(e); });
  if (j.open) return `<div class="screen notab" style="gap:14px">${top('New entry')}
    <span class="cap">${new Date().toDateString()}</span>
    ${j.p !== null ? `<h2 class="rq">${esc(JPROMPTS[j.p])}</h2>` : `<h2 class="rq">Write anything.</h2>`}
    <textarea id="jtext" class="field rtext" rows="7" placeholder="${j.p !== null ? 'Take your time…' : 'No rules. Just write.'}"></textarea>
    <button class="link" data-a="j-nudge" style="justify-self:start">${ic('spark')}${j.p === null ? 'Give me a prompt' : 'Another prompt'}</button>
    <div class="stack" style="gap:6px"><span class="lbl">How are you feeling? <span class="cap">optional</span></span><div class="moods">${MOODS.map((m, i) => `<button class="mood ${j.m === i ? 'sel' : ''}" data-a="j-m" data-v="${i}" aria-pressed="${j.m === i}"><span class="mface" style="--mf:${MOOD_FILL[i]};${j.m === i ? 'background:var(--mf)' : ''}">${face(i)}</span><span>${m[0]}</span></button>`).join('')}</div></div>
    <div style="flex:1"></div><button class="btn primary block" data-a="jsave">Save entry</button><p class="cap" style="text-align:center;margin:0">${ic('lock')} Saved only on this phone</p></div>`;
  return `<div class="screen notab">${top('Journal')}
    <div class="jhero"><span class="note" style="font-size:22px;color:var(--ink)">a quiet place for your thoughts</span><span class="cap">${S.journal.length} entr${S.journal.length === 1 ? 'y' : 'ies'} · only on this phone</span></div>
    <div class="stack" style="gap:8px"><span class="lbl">Start writing</span>
      <button class="jstart" data-a="j-open" data-v="free"><span class="dot tint-sun">${ic('pen')}</span><span class="grow"><b>Just write</b><span class="cap" style="display:block">A blank page, no rules</span></span>${ic('chev', 'chev')}</button>
      <button class="jstart" data-a="j-open" data-v="1"><span class="dot tint-sage">${ic('heart')}</span><span class="grow"><b>Something good</b><span class="cap" style="display:block">One thing you're grateful for</span></span>${ic('chev', 'chev')}</button>
      <button class="jstart" data-a="j-open" data-v="0"><span class="dot tint-violet">${ic('spark')}</span><span class="grow"><b>Untangle a thought</b><span class="cap" style="display:block">A gentle question to help you reflect</span></span>${ic('chev', 'chev')}</button>
      <button class="jstart" data-a="dost"><span class="dot tint-peach">${ic('mic')}</span><span class="grow"><b>Say it out loud</b><span class="cap" style="display:block">Talk it through with Dost</span></span>${ic('chev', 'chev')}</button></div>
    ${S.journal.length ? `<span class="lbl">Your entries</span>${Object.entries(groups).slice(0, 5).map(([d, es]) => `<div class="stack" style="gap:6px"><span class="cap">${esc(d)}</span>${es.map(e => `<div class="card jentry">${e.m !== undefined && e.m !== null ? `<span class="mface" style="--mf:${MOOD_FILL[e.m]};background:var(--mf);width:28px;height:28px;flex:none">${face(e.m, 18)}</span>` : ''}<span class="stack" style="gap:2px">${e.p ? `<span class="cap">${esc(e.p)}</span>` : ''}<span>${esc(e.t)}</span></span></div>`).join('')}</div>`).join('')}` : ''}</div>`;
};

/* ---------- Train your mind: short brain games with a daily streak ---------- */
const GAMES = {
  seq: { name: 'Bubble sequence', sub: 'Remember the order', tint: 'violet' },
  recall: { name: 'Number recall', sub: 'Hold digits in mind', tint: 'sun' },
  pairs: { name: 'Simply pairs', sub: 'Find matching cards', tint: 'peach' },
  flank: { name: 'Flanker focus', sub: 'Ignore the noise', tint: 'sage' },
  stroop: { name: 'Word traps', sub: 'Tap the ink, not the word', tint: 'violet' },
  sudoku: { name: 'Mini sudoku', sub: '4 × 4 logic', tint: 'sun' },
};
function gStreak() { const d = new Set(S.games.days); let n = 0; const t = new Date(); if (!d.has(dkey(t))) t.setDate(t.getDate() - 1); while (d.has(dkey(t))) { n++; t.setDate(t.getDate() - 1); } return n; }
const gPick = () => Object.keys(GAMES)[doy() % 6];
V.games = () => {
  const n = gStreak(), wk = []; for (let i = 6; i >= 0; i--) { const t = new Date(); t.setDate(t.getDate() - i); wk.push([DAYS[t.getDay()][0], S.games.days.includes(dkey(t))]); }
  const pick = gPick(), played = S.games.days.includes(todayK());
  return `<div class="screen notab">${top('Train your mind')}
    <div class="streak"><span class="flame ${n ? 'on' : ''}">${ic2('flame')}</span><span class="stack" style="gap:2px;flex:1"><b class="t2">${n ? `${n}-day streak` : 'Start a streak today'}</b><span class="cap">${played ? 'Played today. See you tomorrow.' : 'One game a day keeps it going.'}</span></span></div>
    <div class="wkdots">${wk.map(([d, on]) => `<span class="${on ? 'on' : ''}"><i>${on ? ic('check') : ''}</i>${d}</span>`).join('')}</div>
    <button class="card row" style="border:0;text-align:left;background:var(--primary);color:var(--on-primary)" data-a="game" data-v="${pick}"><span class="stack" style="gap:2px;flex:1"><span class="cap" style="color:inherit;opacity:.8">Today's pick</span><b class="t2">${GAMES[pick].name}</b></span><span class="btn sm" style="background:var(--sun-400);color:#2F2663">Play</span></button>
    <div class="grid2">${Object.entries(GAMES).map(([id, g]) => `<button class="gtile tint-${g.tint}" data-a="game" data-v="${id}">${gameArt(id)}<b>${g.name}</b><span class="cap">${S.games.best[id] !== undefined ? 'Best: ' + S.games.best[id] : g.sub}</span></button>`).join('')}</div>
    <p class="cap" style="margin:0">Short games that train memory, focus and attention. Just for fun and practice, not a test.</p></div>`;
};
function gameArt(id) {
  const a = { seq: '<circle cx="14" cy="14" r="7" fill="var(--violet-400)"/><circle cx="34" cy="14" r="7" fill="var(--surface-raised)"/><circle cx="14" cy="34" r="7" fill="var(--surface-raised)"/><circle cx="34" cy="34" r="7" fill="var(--violet-600)"/>', recall: '<text x="24" y="31" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="17" fill="#2F2663">4 7 2</text>', pairs: '<rect x="6" y="8" width="16" height="22" rx="4" fill="var(--peach-400)"/><rect x="26" y="18" width="16" height="22" rx="4" fill="var(--surface-raised)"/>', flank: '<text x="24" y="31" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="16" fill="#2F2663">‹‹›‹‹</text>', stroop: '<text x="24" y="30" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="14" fill="#E5484D">BLUE</text>', sudoku: '<rect x="8" y="8" width="32" height="32" rx="4" fill="var(--surface-raised)"/><path d="M24 8v32M8 24h32" stroke="#2F2663" stroke-width="2"/><text x="16" y="21" text-anchor="middle" font-size="10" font-weight="700" fill="#2F2663">3</text><text x="32" y="37" text-anchor="middle" font-size="10" font-weight="700" fill="#2F2663">1</text>' }[id];
  return `<svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">${a}</svg>`;
}
function gEnd(score, label) { const g = X.g, id = S.params.id; g.over = true; g.score = score; g.label = label; if (!S.games.days.includes(todayK())) S.games.days.push(todayK()); const better = S.games.best[id] === undefined || (id === 'pairs' ? score < S.games.best[id] : score > S.games.best[id]); if (better) S.games.best[id] = score; g.newBest = better; save(); render(); }
V.game = () => {
  const id = S.params.id, G = GAMES[id], g = X.g || (X.g = gInit(id));
  if (g.over) return `<div class="screen notab glow" style="gap:16px;text-align:center">${top(G.name)}
    <span class="burst" aria-hidden="true" style="align-self:center">${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<i class="b${k}"></i>`).join('')}</span>
    <span class="eyebrow">${esc(g.label)}</span><b class="gscore">${g.score}</b>${g.newBest ? '<span class="tag sage" style="align-self:center">New best</span>' : `<span class="cap">Best: ${S.games.best[id]}</span>`}
    <div class="streak" style="text-align:left"><span class="flame on">${ic2('flame')}</span><b class="t2">${gStreak()}-day streak</b></div>
    <div style="flex:1"></div><button class="btn primary block" data-a="g-again">Play again</button><button class="btn ghost block" data-a="back">More games</button></div>`;
  return `<div class="screen notab">${top(G.name)}${gameBody(id, g)}</div>`;
};
function gInit(id) {
  if (id === 'seq') return { len: 3, seq: [], pos: 0, show: -1, phase: 'ready' };
  if (id === 'recall') return { len: 4, num: '', phase: 'ready', inp: '' };
  if (id === 'pairs') { const sym = ['sun', 'moon', 'heart', 'spark', 'drop', 'flame']; const deck = [...sym, ...sym].sort(() => Math.random() - .5); return { deck, open: [], found: [], moves: 0 }; }
  if (id === 'flank') return { n: 0, ok: 0, t: [], cur: null, phase: 'ready' };
  if (id === 'stroop') return { n: 0, ok: 0, cur: null, phase: 'ready', t0: 0 };
  if (id === 'sudoku') { const sol = SUDOKUS[doy() % SUDOKUS.length]; const holes = [1, 2, 4, 7, 8, 9, 11, 13, 14]; return { sol, grid: sol.map((v, i) => holes.includes(i) ? 0 : v), fixed: sol.map((v, i) => !holes.includes(i)), sel: null }; }
}
const SUDOKUS = [[1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1], [2, 4, 1, 3, 1, 3, 2, 4, 4, 2, 3, 1, 3, 1, 4, 2], [3, 1, 4, 2, 4, 2, 3, 1, 1, 3, 2, 4, 2, 4, 1, 3]];
const SCOL = [['Red', '#E5484D'], ['Blue', '#3B6FE0'], ['Green', '#2F9E6B'], ['Purple', '#7A4FC9']];
function gameBody(id, g) {
  const start = (lbl, how) => `<div class="stack" style="gap:10px;text-align:center;flex:1;justify-content:center"><p class="lg" style="margin:0">${how}</p><button class="btn primary block" data-a="g-start">${lbl}</button></div>`;
  if (id === 'seq') {
    if (g.phase === 'ready') return start('Start', 'Watch the bubbles light up, then tap them in the same order.');
    return `<span class="cap" style="text-align:center">${g.phase === 'show' ? 'Watch…' : `Your turn · ${g.pos} of ${g.len}`}</span><div class="bubbles">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(k => `<button class="bub9 ${g.show === k ? 'lit' : ''}" data-a="seq-tap" data-v="${k}" ${g.phase === 'show' ? 'disabled' : ''} aria-label="Bubble ${k + 1}"></button>`).join('')}</div><span class="cap" style="text-align:center">Length ${g.len}</span>`;
  }
  if (id === 'recall') {
    if (g.phase === 'ready') return start('Start', 'A number will flash for a few seconds. Type it back from memory.');
    if (g.phase === 'show') return `<div class="stack" style="flex:1;justify-content:center;text-align:center"><b class="gscore" style="letter-spacing:6px">${g.num}</b><span class="cap">Remember it</span></div>`;
    return `<div class="stack" style="flex:1;justify-content:center;gap:14px"><b class="gscore" style="text-align:center;letter-spacing:6px;min-height:60px">${g.inp || '·'.repeat(g.len)}</b><div class="numpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0, 'ok'].map(k => `<button data-a="rc-key" data-v="${k}">${k === 'del' ? '⌫' : k === 'ok' ? '✓' : k}</button>`).join('')}</div></div>`;
  }
  if (id === 'pairs') return `<span class="cap" style="text-align:center">Moves: ${g.moves} · Pairs: ${g.found.length / 2} of 6</span><div class="pairs">${g.deck.map((s, k) => { const up = g.open.includes(k) || g.found.includes(k); return `<button class="pcard ${up ? 'up' : ''} ${g.found.includes(k) ? 'found' : ''}" data-a="pair" data-v="${k}" aria-label="${up ? s : 'Hidden card'}">${up ? ic2(s) : ''}</button>`; }).join('')}</div>`;
  if (id === 'flank') {
    if (g.phase === 'ready') return start('Start', 'Which way does the <b>middle</b> arrow point? Ignore the others. 20 rounds.');
    const c = g.cur; return `<span class="cap" style="text-align:center">${g.n + 1} of 20</span><div class="flank">${c ? c.s : ''}</div><div class="row" style="gap:12px"><button class="btn soft" style="flex:1;font-size:26px" data-a="fl" data-v="L">←</button><button class="btn soft" style="flex:1;font-size:26px" data-a="fl" data-v="R">→</button></div>`;
  }
  if (id === 'stroop') {
    if (g.phase === 'ready') return start('Start', 'Tap the <b>colour of the ink</b>, not what the word says. 15 rounds.');
    const c = g.cur; return `<span class="cap" style="text-align:center">${g.n + 1} of 15</span><div class="flank" style="color:${SCOL[c.ink][1]};letter-spacing:2px">${SCOL[c.word][0].toUpperCase()}</div><div class="grid2">${SCOL.map(([n, col], k) => `<button class="btn" style="background:var(--surface-raised);box-shadow:inset 0 0 0 2px ${col};color:var(--ink)" data-a="st" data-v="${k}">${n}</button>`).join('')}</div>`;
  }
  if (id === 'sudoku') return `<span class="muted" style="text-align:center">Each row, column and 2×2 box has 1, 2, 3 and 4.</span><div class="sudo">${g.grid.map((v, k) => `<button class="sc ${g.fixed[k] ? 'fx' : ''} ${g.sel === k ? 'sel' : ''} c${k}" data-a="sd-cell" data-v="${k}" ${g.fixed[k] ? 'disabled' : ''}>${v || ''}</button>`).join('')}</div><div class="numpad" style="grid-template-columns:repeat(5,1fr)">${[1, 2, 3, 4, 0].map(k => `<button data-a="sd-num" data-v="${k}">${k || '⌫'}</button>`).join('')}</div>`;
  return '';
}
function seqShow() { const g = X.g; g.seq = Array.from({ length: g.len }, () => Math.floor(Math.random() * 9)); g.phase = 'show'; g.pos = 0; let k = 0; render(); const step = () => { if (S.view !== 'game' || X.g !== g) return; if (k >= g.seq.length) { g.show = -1; g.phase = 'input'; render(); return; } g.show = g.seq[k]; render(); setTimeout(() => { g.show = -1; render(); k++; setTimeout(step, 220); }, 560); }; setTimeout(step, 500); }
function flNext() { const g = X.g, mid = Math.random() < .5 ? 'L' : 'R', same = Math.random() < .5, side = same ? mid : (mid === 'L' ? 'R' : 'L'), a = d => d === 'L' ? '←' : '→'; g.cur = { mid, s: `${a(side)}${a(side)}${a(mid)}${a(side)}${a(side)}`, t0: Date.now() }; }
function stNext() { const g = X.g, word = Math.floor(Math.random() * 4); let ink = Math.floor(Math.random() * 4); if (Math.random() < .75) while (ink === word) ink = Math.floor(Math.random() * 4); g.cur = { word, ink }; }

/* ---------- Prescriptions and care plans (from completed sessions) ---------- */
const RX = {
  1: { shared: ['Feeling tired and on edge most evenings', 'Late calls and Slack in bed, so sleep starts after 1 am', 'Snapping at family, then feeling guilty'], noted: 'Work stress spilling into evenings, with no clear switch-off point. Sleep is short, which is making worry and irritability worse. No signs of a mood disorder at this stage.',
    plan: [['Switch-off ritual at 9 pm: laptop shut, phone on charge outside the bedroom', 'ritual'], ['4-7-8 breathing in bed, 4 rounds', 'ex_478'], ['Note late-meeting requests this week, to discuss next time', null]], review: 'Session 2 · Mon 17 Nov' },
  2: { shared: ['Ritual worked on 3 of 5 nights', 'Still accepting late meetings out of guilt', 'Mornings feel rushed and anxious before stand-up'], noted: 'Good progress on sleep. The main remaining trigger is difficulty saying no at work, linked to a fear of seeming uncommitted. Morning anxiety is mild.',
    plan: [['Say no to one late meeting this week, using the script we practised', null], ['Box breathing for 2 minutes before stand-up', 'ex_box'], ['Take “Am I anxious?” again before session 3', 'gad7']], review: 'Session 3 · Mon 24 Nov' },
};
V.rx = () => {
  const only = S.params.n ? [S.history.find(h => h.n === +S.params.n)].filter(Boolean) : S.history.slice().reverse();
  return `<div class="screen notab">${top('Prescriptions & care plans')}
    <p class="muted" style="margin:0">What you shared, what your counsellor noticed, and what to do until next time.</p>
    ${only.map(h => { const e = EXM[h.id], r = RX[h.n]; if (!r) return ''; return `<section class="rxcard">
      <div class="row"><span class="mphoto" style="width:48px;height:56px">${img(e, '', 's')}</span><div style="flex:1"><b class="t2">Session ${h.n} · ${esc(h.date)}</b><div class="cap">${esc(e.name)}, ${esc(e.title)} · ${esc(h.mode)}</div></div><span class="rxbadge">Rx</span></div>
      <div class="rxsec"><span class="lbl">What you shared</span><ul>${r.shared.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="rxsec"><span class="lbl">What ${esc(fnm(e.name))} noticed</span><p>${esc(r.noted)}</p></div>
      <div class="rxsec"><span class="lbl">Your plan</span>${r.plan.map(([t, link]) => `<div class="row rxrow" style="align-items:flex-start"><span class="rxtick">${ic('check')}</span><span style="flex:1">${esc(t)}</span>${link ? `<button class="btn soft sm" data-a="rx-go" data-v="${link}">Open</button>` : ''}</div>`).join('')}</div>
      <div class="rxsec"><span class="lbl">Medicines</span><p class="muted">None. Counselling psychologists don't prescribe medicines. If they're ever needed, ${esc(fnm(e.name))} will refer you to a psychiatrist.</p></div>
      <div class="row between"><span class="cap">Next review: ${esc(r.review)}</span><button class="link" data-a="toast" data-v="Saved as a PDF to your phone.">${ic2('file')}PDF</button></div></section>`; }).join('')}
    <p class="cap" style="margin:0">${ic('lock')} Only you and your counsellor can see this. ${esc(S.company)} never does.</p></div>`;
};

/* ---------- Connected health apps ---------- */
const HAPPS = [['apple', 'Apple Health', 'Sleep, steps, heart rate, mindful minutes', '#E5484D'], ['hc', 'Health Connect', 'Android: sleep, steps, heart rate', '#2F9E6B'], ['strava', 'Strava', 'Runs, rides and workouts', '#F2711C'], ['fitbit', 'Fitbit', 'Sleep, activity and heart rate', '#00A3AD']];
V.health = () => {
  const on = HAPPS.filter(([k]) => S.health[k]);
  return `<div class="screen notab">${top('Connected health apps')}
    <p class="muted" style="margin:0">Link your health apps to see how sleep and movement relate to your mood. Read-only. ${esc(S.company)} never sees it.</p>
    ${on.length ? `<div class="card stack" style="background:var(--sage-100);box-shadow:none"><span class="eyebrow">What we're noticing · sample data</span>
      <b class="t2">On days you walk 7,000+ steps, your mood score is about 12 points higher.</b>
      <div class="row between"><span class="stack" style="gap:0"><b class="t1">6h 40m</b><span class="cap">avg sleep this week</span></span><span class="stack" style="gap:0"><b class="t1">6,820</b><span class="cap">avg steps</span></span><span class="stack" style="gap:0"><b class="t1">3</b><span class="cap">workouts</span></span></div></div>` : ''}
    <div class="list">${HAPPS.map(([k, n, d, c]) => `<div class="li"><span class="happ" style="background:${c}">${esc(n[0])}</span><span class="grow"><b>${esc(n)}</b><span class="cap" style="display:block">${S.health[k] ? 'Connected · syncing daily' : esc(d)}</span></span>${S.health[k] ? `<button class="btn ghost sm" data-a="h-off" data-v="${k}">Disconnect</button>` : `<button class="btn primary sm" data-a="h-on" data-v="${k}">Connect</button>`}</div>`).join('')}</div>
    <p class="cap" style="margin:0">${ic('lock')} You choose what to share and can disconnect any time. This prototype uses sample data.</p></div>`;
};

/* ---------- The Grow hub: everything on one screen ---------- */
V.grow = () => {
  const { sl, R } = ritualToday(), rdone = ritualDone(sl), n = gStreak(), lastT = TEST_ORDER.map(id => (S.tests[id] || []).length).reduce((a, b) => a + b, 0);
  const tile = (act, tint, icon, title, sub, id = '') => `<button class="htile tint-${tint}" data-a="${act}" ${id ? `id="${id}"` : ''}><span class="hic">${ic2(icon)}</span><b>${title}</b><span class="cap">${sub}</span></button>`;
  return `<div class="screen" style="gap:16px">
    <div class="row between"><div><h1 class="t1">Grow</h1><p class="note" style="font-size:17px">a little every day</p></div>${n ? `<span class="tag" style="background:var(--sun-100);color:var(--ink)">${ic2('flame')}${n}-day streak</span>` : ''}</div>
    <button class="rstrip tint-${R.tint}" data-a="ritual" data-v="${sl}"><span class="dot" style="background:var(--surface-raised)">${ic(R.icon)}</span><span class="grow" style="text-align:left"><b>${R.name}</b><span class="cap" style="display:block">${rdone ? 'Done today · see your recap' : 'Breathe · write · listen · feel · 5 min'}</span></span><span class="btn ${rdone ? 'ghost' : 'primary'} sm">${rdone ? 'View' : 'Start'}</span></button>
    <div class="hgrid">
      ${tile('go-tests', 'violet', 'clip', 'Check yourself', lastT ? `${lastT} done · 6 checks` : '6 clinical checks')}
      ${tile('go-acts', 'sage', 'play', 'Do something', 'Breathe, pause, focus')}
      ${tile('go-read', 'peach', 'book', 'Read', `${Object.keys(ARTS).length} short reads`)}
      ${tile('journal', 'sun', 'pen', 'Journal', S.journal.length ? `${S.journal.length} entries` : 'Write it down')}
    </div>
    <button class="gbanner" data-a="go-games"><span class="stack" style="gap:2px;flex:1;text-align:left"><span class="cap" style="color:inherit;opacity:.8">${ic2('puzzle')} Train your mind</span><b class="t2" style="color:inherit">6 brain games</b><span class="cap" style="color:inherit;opacity:.8">Memory, focus, attention</span></span><span class="flame big ${n ? 'on' : ''}">${ic2('flame')}<b>${n ? n + ' day' + (n > 1 ? 's' : '') : 'Play'}</b></span></button>
    <button class="li card" style="padding:12px 16px" data-a="go-pgs"><span class="dot tint-sage">${ic('grow')}</span><span class="grow"><b>7-day programs</b><span class="cap" style="display:block">Calm at Work, Sleep Reset, Lift and more</span></span>${ic('chev', 'chev')}</button>
  </div>${tabbar()}`;
};
V.pgs = () => `<div class="screen notab">${top('7-day programs')}<div class="list">${Object.entries(PG).map(([id, g]) => { const dn = S.pg[id] || 0; return `<button class="li" data-a="pg" data-v="${id}"><span class="dot tint-sage">${ic('grow')}</span><span class="grow"><b>${esc(g.name)}</b><span class="cap" style="display:block">${esc(g.blurb)}</span>${dn ? `<span class="bar" style="display:block;margin-top:8px"><i style="width:${dn / 7 * 100}%"></i></span>` : ''}</span><span class="cap">${dn ? dn + '/7' : '7 days'}</span>${ic('chev', 'chev')}</button>`; }).join('')}</div></div>`;

function growAfter() {
  if (S.view === 'act') runAct(); else { clearInterval(AT); AT = null; }
  if (S.view === 'act' && S.params.id === 'listen' && X.a && X.a.on) { if (!SND) playSound(X.snd || 'rain'); }
  else if (!((S.view === 'ritual' && X.r && X.r.step === 3 && X.ls) || (S.view === 'grow' && X.gs))) stopSound();
  document.querySelectorAll('.wopt').forEach(i => { i.oninput = () => { X.w.opts[+i.dataset.k] = i.value; }; });
  document.querySelectorAll('.ptask').forEach(i => { i.oninput = () => { X.p.tasks[+i.dataset.k] = i.value; }; });
  const wt = document.getElementById('wtext'); if (wt) wt.oninput = () => { X.w.text = wt.value; };
}

$app.addEventListener('click', e => {
  const a = e.target.closest('[data-a]'); if (!a) return;
  const act = a.dataset.a, v = a.dataset.v;
  if (a.dataset.tv && S.params) { S.params.vis = [...(S.params.vis || []), a.dataset.tv]; }
  if (act === 'scrim' && e.target !== a) return;
  switch (act) {
    case 'go-tests': go('tests'); break;
    case 'go-acts': go('acts'); break;
    case 'go-read': go('read'); break;
    case 'go-games': go('games'); break;
    case 'go-pgs': go('pgs'); break;
    case 'test': go('test', { id: v }); break;
    case 'tans': { const t = TESTS[S.params.id]; X.t.a.push(+v); if (X.t.a.length >= t.qs.length) { S.params.a = X.t.a.slice(); S.params.vis = []; (S.tests[S.params.id] = S.tests[S.params.id] || []).push({ d: todayK(), s: testScore(t, X.t.a) }); if (!S.doneToday['t_' + S.params.id]) { S.doneToday['t_' + S.params.id] = true; S.wins.push(`Checked in: ${t.name}`); } save(); }
      render(); $app.querySelector('.screen').scrollTop = 0; break; }
    case 'tprev': X.t.a.pop(); render(); break;
    case 'test-again': X.t = { a: [] }; S.params.a = null; S.params.vis = []; save(); render(); break;
    case 'akind': X.ak = v; X.keep = true; render(); break;
    case 'act': go('act', { id: v }); break;
    case 'act-go': X.a.on = true; X.a.t0 = Date.now(); if (S.params.id === 'listen') playSound(X.snd || 'rain'); render(); break;
    case 'act-snd': X.snd = v; if (X.a.on) playSound(v); render(); break;
    case 'act-done': { clearInterval(AT); AT = null; stopSound(); go('reflect', { id: S.params.id }, false); break; }
    case 'rf-m': X.rf.m = +v; X.keep = true; render(); break;
    case 'rf-save': case 'rf-skip': { const id = S.params.id, note = act === 'rf-save' ? ((document.getElementById('rfnote') || {}).value || '').trim() : '';
      S.acts.push({ id, d: todayK(), m: X.rf.m, note }); if (ACTS[id] && !S.doneToday[id]) { S.doneToday[id] = true; S.wins.push(`${ACTS[id].name} today`); }
      if (X.rf.m !== null && moodDue()) { S.moods = S.moods.filter(m => m.d !== todayK()); S.moods.push({ d: todayK(), v: X.rf.m, care: true }); S.lastCheck = Date.now(); }
      save(); toast(act === 'rf-save' ? 'Saved. You can see what works for you over time.' : 'Nice work today.'); back(); break; }
    case 'w-go': { const w = X.w, ta = document.getElementById('wtext'); if (ta) w.text = ta.value.trim(); if (v === 'can' && !w.text) { toast('Write the worry in a line first.'); break; } w.s = v; render(); $app.querySelector('.screen').scrollTop = 0; break; }
    case 'w-when': X.w.when = v; render(); break;
    case 'p-demo': X.p.demo = !X.p.demo; render(); break;
    case 'p-start': { const p = X.p; if (!p.tasks.some(Boolean)) { toast('Add at least one task.'); break; } p.s = 'run'; p.cur = 0; p.t0 = Date.now(); render(); break; }
    case 'p-park': { const i = document.getElementById('ppark'); if (i && i.value.trim()) { X.p.parked.push(i.value.trim()); render(); toast('Parked. Back to it.'); } break; }
    case 'p-task': { const p = X.p, n = p.tasks.filter(Boolean).length; if (p.cur < n - 1) { p.cur++; toast('Nice. On to the next one.'); render(); } else { toast('All tasks done. Be proud of that.'); clearInterval(AT); AT = null; go('reflect', { id: 'pomo' }, false); } break; }
    case 'p-again': X.p.s = 'run'; X.p.t0 = Date.now(); render(); break;
    case 'art': if (!S.reads.includes(v)) { S.reads.push(v); save(); } go('art', { id: v }); break;
    case 'j-open': X.j = { open: true, p: v === 'free' ? null : +v, m: null }; render(); break;
    case 'j-nudge': { const j = X.j, ta = document.getElementById('jtext'); const keep = ta ? ta.value : ''; j.p = j.p === null ? 0 : (j.p + 1) % JPROMPTS.length; render(); const n = document.getElementById('jtext'); if (n) n.value = keep; break; }
    case 'j-m': { const ta = document.getElementById('jtext'), keep = ta ? ta.value : ''; X.j.m = +v; render(); const n = document.getElementById('jtext'); if (n) n.value = keep; break; }
    case 'jsave': { const ta = document.getElementById('jtext'), t = ta ? ta.value.trim() : ''; if (!t) { toast('Write a line first.'); break; }
      if (RISK.test(t)) sheet('help', { urgent: true });
      const j = X.j || {}; S.journal.push({ d: new Date().toDateString(), t, m: j.m ?? null, p: j.p !== null && j.p !== undefined ? JPROMPTS[j.p] : null });
      if (!S.doneToday.journal) { S.doneToday.journal = true; S.leaves = Math.min(7, S.leaves + 1); S.wins.push('Wrote in your journal'); }
      X.j = { open: false, p: null, m: null }; save(); toast('Saved. Writing it down helps.'); render(); break; }
    case 'game': go('game', { id: v }); break;
    case 'g-again': X.g = gInit(S.params.id); render(); break;
    case 'g-start': { const g = X.g, id = S.params.id;
      if (id === 'seq') seqShow();
      if (id === 'recall') { g.num = Array.from({ length: g.len }, () => Math.floor(Math.random() * 10)).join(''); g.phase = 'show'; g.inp = ''; render(); setTimeout(() => { if (X.g === g) { g.phase = 'input'; render(); } }, 1200 + g.len * 450); }
      if (id === 'flank') { g.phase = 'go'; flNext(); render(); }
      if (id === 'stroop') { g.phase = 'go'; g.t0 = Date.now(); stNext(); render(); }
      break; }
    case 'seq-tap': { const g = X.g; if (g.phase !== 'input') break; if (g.seq[g.pos] === +v) { g.pos++; if (g.pos >= g.len) { g.len++; toast('Correct!'); setTimeout(seqShow, 700); } else render(); } else gEnd(g.len - 1, 'Longest sequence'); break; }
    case 'rc-key': { const g = X.g; if (v === 'del') g.inp = g.inp.slice(0, -1); else if (v === 'ok') { if (g.inp === g.num) { g.len++; toast('Correct! One more digit.'); g.num = Array.from({ length: g.len }, () => Math.floor(Math.random() * 10)).join(''); g.phase = 'show'; g.inp = ''; render(); setTimeout(() => { if (X.g === g) { g.phase = 'input'; render(); } }, 1200 + g.len * 450); break; } else { gEnd(g.len - 1, 'Digits remembered'); break; } } else if (g.inp.length < g.len) g.inp += v; render(); break; }
    case 'pair': { const g = X.g, k = +v; if (g.open.length === 2 || g.open.includes(k) || g.found.includes(k)) break; g.open.push(k);
      if (g.open.length === 2) { g.moves++; const [a, b] = g.open; if (g.deck[a] === g.deck[b]) { g.found.push(a, b); g.open = []; if (g.found.length === 12) { setTimeout(() => gEnd(g.moves, 'Moves to find all pairs (fewer is better)'), 400); } } else setTimeout(() => { g.open = []; if (X.g === g) render(); }, 750); }
      render(); break; }
    case 'fl': { const g = X.g; if (v === g.cur.mid) { g.ok++; g.t.push(Date.now() - g.cur.t0); } g.n++; if (g.n >= 20) gEnd(g.ok, `Correct out of 20 · ${Math.round(g.t.reduce((a, b) => a + b, 0) / Math.max(1, g.t.length))} ms average`); else { flNext(); render(); } break; }
    case 'st': { const g = X.g; if (+v === g.cur.ink) g.ok++; g.n++; if (g.n >= 15) gEnd(g.ok, `Correct out of 15 · ${Math.round((Date.now() - g.t0) / 1000)} seconds`); else { stNext(); render(); } break; }
    case 'sd-cell': X.g.sel = +v; render(); break;
    case 'sd-num': { const g = X.g; if (g.sel === null) { toast('Tap an empty square first.'); break; } g.grid[g.sel] = +v; if (g.grid.every((x, i) => x === g.sol[i])) { gEnd(1, 'Puzzle solved'); break; } if (g.grid.every(Boolean)) toast('Not quite. Check the rows and boxes.'); render(); break; }
    case 'rx': go('rx', v ? { n: v } : {}); break;
    case 'rx-go': if (v === 'ritual') go('ritual'); else if (TESTS[v]) go('test', { id: v }); else go('ex', { id: v }); break;
    case 'go-health': go('health'); break;
    case 'h-on': sheet('hconnect', { k: v }); break;
    case 'h-ok': S.health[SHEET.k] = true; SHEET = null; save(); toast('Connected. Your first insights will appear here.'); render(); break;
    case 'h-off': delete S.health[v]; save(); toast('Disconnected. We deleted the data we had synced.'); render(); break;
    case 'login': { const em = (document.getElementById('lg-email') || {}).value || ''; if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { toast('Enter your work or college email, or continue as guest.'); break; }
      S.email = em; const nm = em.split('@')[0].split(/[._-]/)[0]; S.name = nm ? nm[0].toUpperCase() + nm.slice(1) : 'Riya'; S.guest = false; S.view = 'intro'; X = { slide: 0 }; save(); render(); break; }
    case 'guest': S.guest = true; S.name = 'Friend'; S.email = 'Guest'; S.view = 'intro'; X = { slide: 0 }; save(); render(); break;
    case 'intro-next': introNext(); break;
    case 'intro-skip': S.onboarded = true; S.view = 'home'; S.tab = 'home'; S.tour = 0; save(); X = {}; render(); break;
    case 'tour-next': S.tour = (S.tour || 0) + 1; save(); drawTour(); break;
    case 'tour-back': S.tour = Math.max(0, (S.tour || 0) - 1); save(); drawTour(); break;
    case 'tour-skip': S.tour = null; save(); drawTour(); break;
    case 'tour-noop': break;
    case 'event': go('event', { id: v }); break;
    case 'ritual': go('ritual', v ? { slot: v } : {}); break;
    case 'r-snd': X.snd = v; if (X.ls) playSound(v); render(); break;
    case 'r-ls': X.ls = true; X.lsDone = false; X.lsLeft = X.lsLeft || 60; playSound(X.snd || SOUND_DAY()); render(); break;
    case 'r-lsdone': X.ls = false; X.lsDone = true; stopSound(); render(); break;
    case 'r-af': X.af = (X.af ?? doy()) + 1; render(); break;
    case 'g-snd': if (X.gs === v) { X.gs = null; stopSound(); } else { X.gs = v; playSound(v); } X.keep = true; render(); break;
    case 'sos': go('sos'); break;
    case 'sos-pick': { const p = X.sos.picks; X.sos.picks = p.includes(v) ? p.filter(x => x !== v) : [...p, v]; render(); break; }
    case 'sos-go': X.sos.phase = 'connect'; render(); break;
    case 'sos-cancel': clearInterval(SOST); SOST = null; back(); toast("Okay. SOS is always here, any time."); break;
    case 'sos-join': X.sos.phase = 'call'; X.sos.c0 = Date.now(); render(); break;
    case 'sos-end': clearInterval(SOST); SOST = null; S.wins.push('Reached out for support'); go('home'); toast('Take care. We will check in on you tomorrow.'); break;
    case 'r-mood': X.r[a.dataset.k] = +v; render(); break;
    case 'r-next': { const r = X.r; const ta = document.getElementById('rtext'); if (ta) r.text = ta.value.trim();
      if (r.step === 1) { clearTimeout(RB); RB = null; X.rb = false; }
      if (r.step === 2 && r.text && RISK.test(r.text)) { sheet('help', { urgent: true }); }
      if (r.step === 3) { X.ls = false; stopSound(); }
      r.step = Math.min(4, r.step + 1); render(); $app.querySelector('.screen').scrollTop = 0; break; }
    case 'r-prev': { const r = X.r; const ta = document.getElementById('rtext'); if (ta) r.text = ta.value.trim(); if (r.step === 1) { clearTimeout(RB); RB = null; X.rb = false; } if (r.step === 3) { X.ls = false; stopSound(); } r.step = Math.max(0, r.step - 1); render(); break; }
    case 'r-brun': X.rb = true; X.rbDone = false; render(); break;
    case 'r-bdone': clearTimeout(RB); RB = null; X.rb = false; X.rbDone = true; render(); break;
    case 'r-feel': { const f = X.r.feels; X.r.feels = f.includes(v) ? f.filter(x => x !== v) : f.length >= 3 ? f : [...f, v]; render(); break; }
    case 'r-finish': { const r = X.r, today = dkey(new Date()), sl = S.params.slot || ritualSlot();
      S.rituals = S.rituals.filter(x => !(x.d === today && x.slot === sl)); S.rituals.push({ d: today, slot: sl, pre: r.pre, post: r.post, feels: r.feels, text: r.text });
      if (r.post !== null && moodDue()) { S.moods = S.moods.filter(m => m.d !== today); S.moods.push({ d: today, v: r.post, care: true }); S.lastCheck = Date.now(); }
      if (!S.doneToday.ritual) { S.doneToday.ritual = true; S.wins.push(`${R_SLOTS[sl].name} today`); }
      save(); r.step = 5; render(); $app.querySelector('.screen').scrollTop = 0; break; }
    case 'notifs': go('notifs'); break;
    case 'notif': { const n = S.notifs.find(x => x.id === v); if (!n) break; n.read = true; save(); const [act, arg] = n.go;
      if (act === 'tab') { if (arg === 'experts') S.seg = 'mine'; go(arg); } else if (act === 'event') go('event', { id: arg }); else go(act); break; }
    case 'notif-all': S.notifs.forEach(n => { n.read = true; }); save(); toast('All caught up.'); render(); break;
    case 'sv': X.sv.push(+v); if (X.sv.length >= SURVEY.length) { S.surveyDone = true; save(); } render(); break;
    case 'ev-anon': { const f = X.f; f.name = document.getElementById('ev-name').value; f.email = document.getElementById('ev-email').value; f.ask = document.getElementById('ev-ask').value; f.anon = !f.anon; render(); break; }
    case 'ev-register': { const nm = document.getElementById('ev-name').value.trim(), em = document.getElementById('ev-email').value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { toast('Add an email so we can send you the link.'); break; }
      const id = S.params.id; if (!S.regs.includes(id)) S.regs.push(id); save(); go('evdone', { id }, false); X.nm = nm; render(); break; }
    case 'ev-cancel': S.regs = S.regs.filter(x => x !== S.params.id); save(); toast('Your spot is cancelled.'); render(); break;
    case 'tour-again': S.tour = 0; save(); go('home'); break;
    case 'tab': go(v); break;
    case 'back': back(); break;
    case 'dost': go('dost'); break;
    case 'dchip': dostSend(v); break;
    case 'plan-start': { const s = S.plan.steps[0]; go('ex', { id: s.id }); break; }
    case 'mood': { if (X.moodPicked !== undefined && X.moodPicked !== null) break; const k = +v, today = dkey(new Date());
      S.moods = S.moods.filter(m => m.d !== today); S.moods.push({ d: today, v: k, care: !!Object.keys(S.doneToday).length }); S.lastCheck = Date.now(); save();
      X.moodPicked = k; X.moodBump = true; render();
      setTimeout(() => { if (S.view !== 'home') return; X.moodGone = true; render(); }, 1700);
      setTimeout(() => { if (S.view !== 'home') return; X.moodPicked = null; X.moodGone = false; X.moodBump = false; render(); if (k === 0) toast('Heavy day? Dost and a counsellor are one tap away.'); }, 2200);
      break; }
    case 'moodview': go('mood'); break;
    case 'per': X.per = v; render(); break;
    case 'mood-again': S.lastCheck = null; save(); toast('The check-in is back on Home.'); break;
    case 'help': sheet('help'); break;
    case 'call': go('sos', { now: true }); break;
    case 'talknow': go('sos', { now: true }); break;
    case 'close': case 'scrim': SHEET = null; render(); break;
    case 'toast': toast(v); break;
    case 'seg': S.seg = v; save(); if (S.view !== 'experts') go('experts'); else render(); break;
    case 'expert': go('deck', { ids: [v], i: 0 }); break;
    case 'deck': go('deck', { ids: v.split(','), i: +(a.dataset.i || 0) }); break;
    case 'deck-move': deckMove(+v); break;
    case 'quiz': S.quiz = { style: [null, null, null, null] }; go('quiz'); break;
    case 'qpick': { const Q = QUIZ[X.qs || 0]; if (Q.type === 'multi') { const cur = S.quiz[Q.k] || []; S.quiz[Q.k] = cur.includes(v) ? cur.filter(x => x !== v) : cur.length >= Q.max ? cur : [...cur, v]; } else S.quiz[Q.k] = v; save(); render(); break; }
    case 'qstyle': { const st = S.quiz.style || (S.quiz.style = [null, null, null, null]); st[+a.dataset.i] = +v === -1 ? null : +v; save(); render(); break; }
    case 'qnext': if ((X.qs || 0) < QUIZ.length - 1) { X.qs = (X.qs || 0) + 1; render(); $app.querySelector('.screen').scrollTop = 0; } else { X.finding = true; render(); setTimeout(() => { S.quiz.done = true; S.seg = 'for'; X = {}; save(); go('experts', {}, false); }, 1600); } break;
    case 'fav': S.favs = S.favs.includes(v) ? S.favs.filter(x => x !== v) : [...S.favs, v]; save(); render(); break;
    case 'sheet': if (v === 'book') { X.date = null; X.slot = null; X.calM = 0; X.where = S.filt.where.length === 1 && S.filt.where[0] === 'In person' && CLINIC[S.params.ids[S.params.i]] ? 'inperson' : 'online'; } sheet(v); break;
    case 'cald': X.date = v; X.slot = null; render(); break;
    case 'bwhere': X.where = v; X.date = null; X.slot = null; X.calM = 0; render(); break;
    case 'calm': X.calM = Math.max(0, Math.min(1, (X.calM || 0) + +v)); render(); break;
    case 'filt': { const k = a.dataset.k; S.filt[k] = S.filt[k].includes(v) ? S.filt[k].filter(x => x !== v) : [...S.filt[k], v]; save(); render(); break; }
    case 'filt-today': S.filt.today = !S.filt.today; save(); render(); break;
    case 'filt-clear': S.filt = { lang: [], mode: [], gender: [], today: false, where: [] }; S.sort = 'match'; S.q = ''; save(); render(); break;
    case 'xview': S.xview = S.xview === 'list' ? 'grid' : 'list'; save(); render(); break;
    case 'sortc': S.sort = v; save(); render(); break;
    case 'evdot': evGo(+v); break;
    case 'sort': S.sort = v; SHEET = null; save(); render(); break;
    case 'slot': X.slot = v; render(); break;
    case 'share': S.shareSummary = !S.shareSummary; save(); render(); break;
    case 'book-ok': { if (!X.slot) break; const [d, t] = X.slot.split('|'), ex = EXM[S.params.ids[S.params.i]]; S.booked = { id: ex.id, day: d, time: t, mode: X.where === 'inperson' ? 'In person' : ex.modes[0], loc: X.where === 'inperson' ? CLINIC[ex.id] : null, n: S.history.filter(h => h.id === ex.id).length + 1 }; S.sessionsLeft = Math.max(0, S.sessionsLeft - 1); if (S.plan) { const s = S.plan.steps.find(x => x.kind === 'book'); if (s) s.done = true; } go('booked', {}, false); break; }
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
    case 'jsave': { const t = document.getElementById('jtext').value.trim(); if (!t) { toast('Write a line first.'); break; } S.journal.push({ d: new Date().toDateString(), t }); if (!S.doneToday.journal) { S.doneToday.journal = true; S.leaves = Math.min(7, S.leaves + 1); } save(); toast('Saved. Writing it down helps.'); render(); break; }
    case 'memory': S.memory = !S.memory; save(); render(); break;
    case 'restart': try { localStorage.removeItem(KEY); } catch {} S = fresh(); SHEET = null; X = {}; render(); break;
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && SHEET) { SHEET = null; render(); } });
if (location.hash === '#start') { S = fresh(); }
render();
})();

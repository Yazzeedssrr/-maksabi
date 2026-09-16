import fs from 'node:fs';
const path='index.html';
let html=fs.readFileSync(path,'utf8');
if(html.includes('id="smartBrief"')) { console.log('V9 UI already installed'); process.exit(0); }
html=html.replace('<title>مَكسبي V7</title>','<title>مَكسبي V9</title>')
.replace('<b>مَكسبي V7</b>','<b>مَكسبي V9</b>')
.replace('</style></head>','.smartBrief{background:linear-gradient(135deg,#122c46,#0d2135);border:1px solid #2c587b}.smartBrief h3{margin:0 0 8px}.insightGrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.insight{background:#0b1929;border:1px solid #203b56;border-radius:15px;padding:11px}.insight small{color:var(--m);display:block}.insight b{font-size:18px;display:block;margin-top:4px}</style></head>')
.replace('<div class="card"><span class="pill">محادثة طبيعية • سياق • صور • إجراءات متعددة</span>','<div id="smartBrief" class="card smartBrief"><span class="pill">✦ ذكاء اليوم</span><h3 id="smartTitle">أقرأ وضعك…</h3><div id="smartLines" class="muted"></div><div class="insightGrid"><div class="insight"><small>صافي / ساعة</small><b id="smartHour">—</b></div><div class="insight"><small>صافي / ميل</small><b id="smartMile">—</b></div><div class="insight"><small>المتبقي للهدف</small><b id="smartGoal">—</b></div><div class="insight"><small>صافي 7 أيام</small><b id="smartWeek">—</b></div></div><div id="smartNext" style="margin-top:12px"></div></div><div class="card"><span class="pill">محادثة طبيعية • سياق • صور • إجراءات متعددة</span>')
.replace('</body></html>','<script src="/ui-v9.js"></script></body></html>');
fs.writeFileSync(path,html);
console.log('Installed V9 proactive dashboard UI');

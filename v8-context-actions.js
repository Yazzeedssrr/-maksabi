(()=>{
const normalize=s=>String(s||'').trim().toLowerCase().replace(/[إأآ]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ـ/g,'');
function isDeleteIntent(t){return /(الغي|الغاء|احذف|امسح|تراجع|شيل|ازل|delete|remove|undo)/i.test(t)}
function addChat(user,assistant){d.aiHistory.push({role:'user',content:user},{role:'assistant',content:assistant});$('prompt').value='';save();renderChat()}
function entryLabel(x){return `${x.type==='income'?'دخل':'مصروف'} ${money(x.amount)} بتاريخ ${x.date}${x.source?' • '+x.source:''}`}
function handle(){const raw=$('prompt')?.value?.trim();if(!raw)return false;const t=normalize(raw);if(!isDeleteIntent(t))return false;
// If there is only an unconfirmed proposal, a bare cancel means cancel that proposal, not stored data.
if(pending.length&&/(الغي|الغاء|تراجع|cancel)/i.test(t)&&!/(دخل|مصروف|بنزين|وقود|اكل|وجبه|سجل|عمليه|بيانات)/i.test(t)){
 pending=[];addChat(raw,'تم إلغاء الاقتراح الحالي. لم أحذف أي بيانات محفوظة.');return true;
}
const today=day();
const wantsToday=/(اليوم|today)/i.test(t),wantsIncome=/(دخل|ربح|income)/i.test(t),wantsExpense=/(مصروف|مصاريف|صرف|expense)/i.test(t),wantsFuel=/(بنزين|وقود|gas|fuel)/i.test(t);
const amountMatch=t.match(/(?:\$\s*)?(\d+(?:\.\d+)?)\s*(?:\$|دولار|دولارات|usd)?/i),wantedAmount=amountMatch?+amountMatch[1]:null;
let base=d.entries.filter(x=>(!wantsIncome||x.type==='income')&&(!wantsExpense||x.type==='expense')&&(!wantsFuel||/بنزين|وقود|gas|fuel/i.test(String(x.source||'')))&&(wantedAmount===null||Math.abs((+x.amount||0)-wantedAmount)<.001));
let candidates=wantsToday?base.filter(x=>x.date===today):base;
if(candidates.length){
 pending=candidates.map(x=>({type:'delete_entry',payload:{id:x.id}}));
 const total=candidates.reduce((s,x)=>s+(+x.amount||0),0),kind=wantsIncome?'دخل':wantsExpense?'مصروف':'حركة';
 addChat(raw,`وجدت ${candidates.length} ${kind} مطابقة بقيمة إجمالية ${money(total)}${wantsToday?' لليوم':''}. لم أحذف شيئًا بعد. راجع الاقتراح ثم اضغط «تأكيد»، أو «إلغاء».`);return true;
}
// If the user says "today" but there is no exact-date match, do not dead-end: safely offer the latest matching entry as a proposal and explain the date mismatch.
if(wantsToday&&base.length){
 const x=[...base].sort((a,b)=>String(b.date).localeCompare(String(a.date))||(+b.id||0)-(+a.id||0))[0];
 pending=[{type:'delete_entry',payload:{id:x.id}}];
 addChat(raw,`لا توجد حركة مطابقة مسجلة بتاريخ اليوم (${today}). أقرب حركة مطابقة وجدتها هي: ${entryLabel(x)}. وضعتها كاقتراح فقط ولم أحذفها. إذا كانت هي التي تقصدها اضغط «تأكيد»، وإلا اضغط «إلغاء».`);return true;
}
// Ambiguous pronouns such as "أريد إلغاءه": never guess destructively. Offer the latest stored entry only.
if(/(الغيه|الغاءه|احذفه|امسحه|تراجع عنه|شيله)/i.test(t)){
 const x=d.entries[0];if(x){pending=[{type:'delete_entry',payload:{id:x.id}}];addChat(raw,`طلبك غير محدد بما يكفي. أقرب حركة محفوظة هي ${entryLabel(x)}. وضعتها كاقتراح فقط؛ اضغط «تأكيد» إذا كانت المقصودة، أو «إلغاء».`);return true;}
}
if((wantsIncome||wantsExpense||wantsFuel)&&!base.length){addChat(raw,`لم أجد في السجل حركة تطابق طلبك، لذلك لم أقترح أي حذف. يمكنك تحديد المبلغ أو التاريخ، مثل: «احذف دخل 220 دولار» أو «احذف مصروف البنزين يوم 12 سبتمبر».`);return true;}
addChat(raw,'فهمت أنك تريد حذف أو التراجع عن شيء، لكن لم أحدد العملية بأمان. اكتب مثلًا: «احذف دخل اليوم»، «احذف دخل 220 دولار»، أو «احذف مصروف البنزين اليوم». لن أحذف شيئًا دون تأكيدك.');return true;
}
document.addEventListener('click',e=>{if(e.target?.id==='sendBtn'&&handle()){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('keydown',e=>{if(e.target?.id==='prompt'&&e.key==='Enter'&&!e.shiftKey&&handle()){e.preventDefault();e.stopImmediatePropagation();}},true);
})();
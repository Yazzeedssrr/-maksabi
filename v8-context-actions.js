(()=>{
const normalize=s=>String(s||'').trim().toLowerCase().replace(/[إأآ]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي');
function isDeleteIntent(t){return /(الغي|الغاء|احذف|امسح|تراجع|شيل|ازل|delete|remove|undo)/i.test(t)}
function addChat(user,assistant){d.aiHistory.push({role:'user',content:user},{role:'assistant',content:assistant});$('prompt').value='';save();renderChat()}
function handle(){const raw=$('prompt')?.value?.trim();if(!raw)return false;const t=normalize(raw);if(!isDeleteIntent(t))return false;
// If there is only an unconfirmed proposal, cancellation means cancel the proposal, not stored data.
if(pending.length&&/(الغي|الغاء|تراجع|cancel)/i.test(t)&&!/(دخل|مصروف|بنزين|وقود|اكل|وجبه|سجل|عمليه|بيانات)/i.test(t)){
 pending=[];addChat(raw,'تم إلغاء الاقتراح الحالي. لم أحذف أي بيانات محفوظة.');return true;
}
const today=day();let candidates=[];const wantsToday=/(اليوم|today)/i.test(t),wantsIncome=/(دخل|ربح|income)/i.test(t),wantsExpense=/(مصروف|مصاريف|صرف|expense)/i.test(t),wantsFuel=/(بنزين|وقود|gas|fuel)/i.test(t);
if(wantsToday||wantsIncome||wantsExpense||wantsFuel){
 candidates=d.entries.filter(x=>(!wantsToday||x.date===today)&&(!wantsIncome||x.type==='income')&&(!wantsExpense||x.type==='expense')&&(!wantsFuel||String(x.source||'').match(/بنزين|وقود|gas|fuel/i)));
}
if(candidates.length){
 pending=candidates.map(x=>({type:'delete_entry',payload:{id:x.id}}));
 const total=candidates.reduce((s,x)=>s+(+x.amount||0),0),kind=wantsIncome?'دخل':wantsExpense?'مصروف':'حركة';
 addChat(raw,`فهمت أنك تريد حذف ${candidates.length} ${kind} بقيمة إجمالية ${money(total)}${wantsToday?' لليوم':''}. لم أحذف شيئًا بعد. راجع الاقتراح ثم اضغط «تأكيد»، أو «إلغاء» للتراجع.`);return true;
}
// Ambiguous pronouns such as "أريد إلغاءه": never guess destructively. Offer the latest stored entry only.
if(/(الغيه|الغاءه|احذفه|امسحه|تراجع عنه|شيله)/i.test(t)){
 const x=d.entries[0];if(x){pending=[{type:'delete_entry',payload:{id:x.id}}];addChat(raw,`طلبك غير محدد بما يكفي للحذف التلقائي. أقرب حركة محفوظة هي ${x.type==='income'?'دخل':'مصروف'} ${money(x.amount)} بتاريخ ${x.date}. وضعتها كاقتراح فقط؛ اضغط «تأكيد» إذا كانت هي المقصودة، أو «إلغاء».`);return true;}
}
addChat(raw,'فهمت أنك تريد حذف أو التراجع عن شيء، لكن لم أحدد العملية بأمان. اكتب مثلًا: «احذف دخل اليوم» أو «احذف مصروف البنزين اليوم». لن أحذف شيئًا دون تأكيدك.');return true;
}
document.addEventListener('click',e=>{if(e.target?.id==='sendBtn'&&handle()){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('keydown',e=>{if(e.target?.id==='prompt'&&e.key==='Enter'&&!e.shiftKey&&handle()){e.preventDefault();e.stopImmediatePropagation();}},true);
})();
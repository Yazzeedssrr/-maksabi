(()=>{
  const money=n=>'$'+Number(n||0).toLocaleString(undefined,{maximumFractionDigits:2});
  const date=()=>{const x=new Date();return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`};
  const load=()=>JSON.parse(localStorage.getItem('maksabi2')||'null')||{};
  const summarize=(data,dt)=>{
    const entries=(data.entries||[]).filter(x=>x.date===dt),trips=(data.trips||[]).filter(x=>x.date===dt);
    const income=entries.filter(x=>x.type==='income').reduce((s,x)=>s+Number(x.amount||0),0);
    const expenses=entries.filter(x=>x.type==='expense').reduce((s,x)=>s+Number(x.amount||0),0);
    const miles=trips.reduce((s,x)=>s+Number(x.miles||0),0),hours=trips.reduce((s,x)=>s+Number(x.hours||0),0),net=income-expenses;
    const goal=Number(data.settings?.dailyGoal||0);
    return {income,expenses,miles,hours,net,goal,netPerHour:hours>0?net/hours:null,netPerMile:miles>0?net/miles:null,goalRemaining:goal>0?Math.max(0,goal-net):null,expenseRate:income>0?expenses/income:null,estimatedHoursToGoal:goal>net&&hours>0&&net>0?(goal-net)/(net/hours):null};
  };
  const lastDates=n=>Array.from({length:n},(_,i)=>{const x=new Date();x.setDate(x.getDate()+i-(n-1));return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`});
  function render(){
    const box=document.getElementById('smartBrief'); if(!box)return;
    const data=load(),d=summarize(data,date()),week=lastDates(7).map(x=>summarize(data,x)),weekNet=week.reduce((s,x)=>s+x.net,0);
    const lines=[];
    if(!d.income&&!d.expenses) lines.push('لا توجد حركات مالية مسجلة اليوم بعد.');
    else lines.push(`صافي اليوم ${money(d.net)} من دخل ${money(d.income)} ومصاريف ${money(d.expenses)}.`);
    if(d.goalRemaining!==null) lines.push(d.goalRemaining>0?`باقي ${money(d.goalRemaining)} للوصول لهدف اليوم.`:'وصلت إلى هدف اليوم المسجل.');
    if(d.expenseRate!==null&&d.expenseRate>=.25) lines.push(`المصاريف تمثل ${(d.expenseRate*100).toFixed(0)}% من دخل اليوم.`);
    let next='';
    if(!d.income&&!d.expenses) next='الخطوة التالية: قل لمكسبي أول دخل أو مصروف حصل اليوم.';
    else if(d.income>0&&d.hours<=0) next='الخطوة التالية: أضف ساعات العمل حتى أحسب صافي الساعة بدقة.';
    else if(d.goalRemaining===0) next='الخطوة التالية: راجع ملخص اليوم قبل إنهاء العمل.';
    else if(d.expenseRate!==null&&d.expenseRate>=.30) next='الخطوة التالية: راجع أكبر مصروف اليوم قبل زيادة ساعات العمل.';
    else if(d.estimatedHoursToGoal!==null) next=`بمعدل اليوم الحالي، تحتاج تقريبًا ${d.estimatedHoursToGoal.toFixed(1)} ساعة إضافية للوصول للهدف إذا استمر المعدل نفسه.`;
    else if(d.goalRemaining>0) next=`الخطوة التالية: باقي ${money(d.goalRemaining)} على هدف اليوم.`;
    else next='بيانات اليوم جاهزة للتحليل.';
    document.getElementById('smartTitle').textContent=d.income||d.expenses?'ملخصك الآن':'ابدأ يومك مع مكسبي';
    document.getElementById('smartLines').innerHTML=lines.map(x=>`<div style="margin-top:5px">${x}</div>`).join('');
    document.getElementById('smartHour').textContent=d.netPerHour===null?'—':money(d.netPerHour);
    document.getElementById('smartMile').textContent=d.netPerMile===null?'—':money(d.netPerMile);
    document.getElementById('smartGoal').textContent=d.goalRemaining===null?'—':money(d.goalRemaining);
    document.getElementById('smartWeek').textContent=money(weekNet);
    document.getElementById('smartNext').textContent=next;
  }
  render();
  window.addEventListener('storage',render);
  const originalSet=localStorage.setItem.bind(localStorage);
  localStorage.setItem=(k,v)=>{originalSet(k,v);if(k==='maksabi2')setTimeout(render,0)};
  setInterval(render,15000);
})();

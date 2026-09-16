// Maksabi V8 deterministic insight engine.
// Pure functions: safe to run client-side and easy to test.

export function summarizeDay(data, date) {
  const entries = (data.entries || []).filter(x => x.date === date);
  const trips = (data.trips || []).filter(x => x.date === date);
  const income = entries.filter(x => x.type === 'income').reduce((s,x) => s + Number(x.amount || 0), 0);
  const expenses = entries.filter(x => x.type === 'expense').reduce((s,x) => s + Number(x.amount || 0), 0);
  const miles = trips.reduce((s,x) => s + Number(x.miles || 0), 0);
  const hours = trips.reduce((s,x) => s + Number(x.hours || 0), 0);
  const net = income - expenses;
  const goal = Number(data.settings?.dailyGoal || 0);
  return {
    date, income, expenses, net, miles, hours, goal,
    expenseRate: income > 0 ? expenses / income : null,
    netPerHour: hours > 0 ? net / hours : null,
    netPerMile: miles > 0 ? net / miles : null,
    goalRemaining: goal > 0 ? Math.max(0, goal - net) : null,
    goalProgress: goal > 0 ? net / goal : null,
    estimatedHoursToGoal: goal > net && hours > 0 && net > 0 ? (goal - net) / (net / hours) : null
  };
}

export function summarizeRange(data, dates) {
  const days = dates.map(date => summarizeDay(data, date));
  const worked = days.filter(x => x.income || x.expenses || x.hours || x.miles);
  const total = key => days.reduce((s,x) => s + Number(x[key] || 0), 0);
  const income = total('income'), expenses = total('expenses'), net = income - expenses;
  const hours = total('hours'), miles = total('miles');
  const bestDay = worked.length ? worked.reduce((a,b) => b.net > a.net ? b : a) : null;
  return {
    days,
    workedDays: worked.length,
    income, expenses, net, hours, miles,
    averageNetPerWorkedDay: worked.length ? net / worked.length : null,
    netPerHour: hours > 0 ? net / hours : null,
    netPerMile: miles > 0 ? net / miles : null,
    bestDay
  };
}

export function buildBrief(day) {
  const lines = [];
  if (!day.income && !day.expenses) lines.push('لا توجد حركات مالية مسجلة لليوم بعد.');
  else lines.push(`صافي اليوم $${day.net.toFixed(2)} من دخل $${day.income.toFixed(2)} ومصاريف $${day.expenses.toFixed(2)}.`);
  if (day.goalRemaining !== null) {
    lines.push(day.goalRemaining > 0 ? `باقي $${day.goalRemaining.toFixed(2)} للوصول لهدف اليوم.` : 'وصلت إلى هدف صافي اليوم المسجل.');
  }
  if (day.netPerHour !== null) lines.push(`صافي الساعة $${day.netPerHour.toFixed(2)}.`);
  else if (day.income > 0) lines.push('لا توجد ساعات كافية مسجلة لحساب صافي الساعة.');
  if (day.netPerMile !== null) lines.push(`صافي الميل $${day.netPerMile.toFixed(2)}.`);
  if (day.expenseRate !== null && day.expenseRate >= .25) lines.push(`المصاريف تمثل ${(day.expenseRate * 100).toFixed(0)}% من دخل اليوم.`);
  return lines;
}

export function nextBestAction(day) {
  if (!day.income && !day.expenses) return {kind:'capture', text:'ابدأ بتسجيل أول دخل أو مصروف اليوم، ويمكنك قوله لمكسبي بجملة عادية.'};
  if (day.income > 0 && day.hours <= 0) return {kind:'missing_data', text:'أضف ساعات العمل حتى أستطيع حساب ربحك الحقيقي لكل ساعة.'};
  if (day.goalRemaining === 0) return {kind:'goal_complete', text:'هدف اليوم مكتمل. راجع الملخص قبل إنهاء يوم العمل.'};
  if (day.expenseRate !== null && day.expenseRate >= .30) return {kind:'expense_check', text:'نسبة المصاريف مرتفعة اليوم؛ راجع أكبر مصروف قبل زيادة ساعات العمل.'};
  if (day.goalRemaining > 0 && day.estimatedHoursToGoal !== null) return {kind:'goal_plan', text:`بمعدل اليوم الحالي تحتاج تقريبًا ${day.estimatedHoursToGoal.toFixed(1)} ساعة إضافية للوصول للهدف إذا استمر المعدل نفسه.`};
  if (day.goalRemaining > 0) return {kind:'goal_gap', text:`باقي $${day.goalRemaining.toFixed(2)} على هدف اليوم.`};
  return {kind:'review', text:'بيانات اليوم جاهزة للتحليل.'};
}

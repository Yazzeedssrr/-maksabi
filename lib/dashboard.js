import { summarizeDay, summarizeRange, buildBrief, nextBestAction } from './insights.js';

export function localDate(offsetDays=0, now=new Date()) {
  const d=new Date(now); d.setDate(d.getDate()+offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function lastNDates(n=7, now=new Date()) {
  return Array.from({length:n},(_,i)=>localDate(i-(n-1),now));
}

export function dashboardModel(data, now=new Date()) {
  const today=localDate(0,now);
  const day=summarizeDay(data,today);
  const week=summarizeRange(data,lastNDates(7,now));
  return {
    today,
    day,
    week,
    brief: buildBrief(day),
    next: nextBestAction(day),
    cards: {
      net: day.net,
      income: day.income,
      expenses: day.expenses,
      netPerHour: day.netPerHour,
      netPerMile: day.netPerMile,
      goalRemaining: day.goalRemaining,
      weekNet: week.net,
      weekAverage: week.averageNetPerWorkedDay
    }
  };
}

export function aiContext(data, now=new Date()) {
  const model=dashboardModel(data,now);
  return {
    today:model.today,
    todaySummary:model.day,
    last7Days:{
      income:model.week.income,
      expenses:model.week.expenses,
      net:model.week.net,
      hours:model.week.hours,
      miles:model.week.miles,
      workedDays:model.week.workedDays,
      averageNetPerWorkedDay:model.week.averageNetPerWorkedDay,
      netPerHour:model.week.netPerHour,
      netPerMile:model.week.netPerMile,
      bestDay:model.week.bestDay
    },
    proactiveBrief:model.brief,
    nextBestAction:model.next,
    settings:data.settings||{},
    recentEntries:(data.entries||[]).slice(0,40),
    recentTrips:(data.trips||[]).slice(0,20)
  };
}

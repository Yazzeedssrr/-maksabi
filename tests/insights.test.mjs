import assert from 'node:assert/strict';
import {summarizeDay, summarizeRange, buildBrief, nextBestAction} from '../lib/insights.js';

const data={
  entries:[
    {date:'2026-09-16',type:'income',amount:240},
    {date:'2026-09-16',type:'expense',amount:45},
    {date:'2026-09-16',type:'expense',amount:18},
    {date:'2026-09-15',type:'income',amount:200}
  ],
  trips:[
    {date:'2026-09-16',miles:220,hours:9},
    {date:'2026-09-15',miles:180,hours:8}
  ],
  settings:{dailyGoal:200}
};

const d=summarizeDay(data,'2026-09-16');
assert.equal(d.income,240);
assert.equal(d.expenses,63);
assert.equal(d.net,177);
assert.equal(d.miles,220);
assert.equal(d.hours,9);
assert.equal(d.goalRemaining,23);
assert.ok(Math.abs(d.netPerHour-19.6666667)<0.001);
assert.ok(Math.abs(d.netPerMile-0.8045454)<0.001);
assert.ok(buildBrief(d).length>=3);
assert.equal(nextBestAction(d).kind,'expense_check');

const r=summarizeRange(data,['2026-09-15','2026-09-16']);
assert.equal(r.income,440);
assert.equal(r.expenses,63);
assert.equal(r.net,377);
assert.equal(r.workedDays,2);
assert.equal(r.bestDay.date,'2026-09-15');

const noHours=summarizeDay({entries:[{date:'2026-09-16',type:'income',amount:100}],trips:[],settings:{dailyGoal:200}},'2026-09-16');
assert.equal(noHours.netPerHour,null);
assert.equal(nextBestAction(noHours).kind,'missing_data');
console.log('insights tests passed');

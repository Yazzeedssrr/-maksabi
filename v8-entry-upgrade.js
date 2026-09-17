(()=>{
const $=id=>document.getElementById(id);
const incomeSources=['Amazon Flex','DoorDash','Uber','Lyft','وظيفة/راتب','بيع','عمل حر','دخل آخر'];
const expenseCats=['بنزين','طعام أثناء العمل','صيانة','زيت','إطارات','غسيل سيارة','رسوم طرق/مواقف','تأمين','قسط سيارة','هاتف','مشتريات للعمل','مصروف شخصي','مصروف آخر'];
function today(){const n=new Date();return n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function build(){const section=$('records');if(!section||$('entryUpgradeCard'))return;const old=$('entryType')?.closest('.card');if(!old)return;old.id='entryUpgradeCard';old.innerHTML=`
<h3>إضافة حركة</h3>
<div class="row"><select id="entryType"><option value="income">دخل</option><option value="expense">مصروف</option></select><input id="entryAmount" inputmode="decimal" placeholder="المبلغ"></div>
<div id="incomeFields">
<label>مصدر الدخل</label><select id="incomeSource">${incomeSources.map(x=>`<option>${esc(x)}</option>`).join('')}<option value="__custom">+ مصدر جديد</option></select>
<input id="incomeSourceCustom" class="hide" placeholder="اكتب مصدر الدخل الجديد">
</div>
<div id="expenseFields" class="hide">
<label>نوع المصروف</label><select id="expenseCategory">${expenseCats.map(x=>`<option>${esc(x)}</option>`).join('')}<option value="__custom">+ نوع مصروف جديد</option></select>
<input id="expenseCategoryCustom" class="hide" placeholder="اكتب نوع المصروف الجديد">
<label>مرتبط بأي عمل؟</label><select id="expenseWork"><option value="عام">السيارة/عام</option>${incomeSources.slice(0,4).map(x=>`<option>${esc(x)}</option>`).join('')}<option value="شخصي">شخصي</option><option value="__custom">+ عمل آخر</option></select>
<input id="expenseWorkCustom" class="hide" placeholder="اكتب العمل المرتبط بالمصروف">
</div>
<label>التاريخ</label><input id="entryDate" type="date" value="${today()}">
<button id="toggleEntryDetails" class="secondary wide" type="button">تفاصيل أكثر</button>
<div id="entryDetails" class="hide">
<div class="row"><input id="entryHours" inputmode="decimal" placeholder="ساعات العمل"><input id="entryMiles" inputmode="decimal" placeholder="الميلات"></div>
<input id="entryPlace" placeholder="المحطة / المنطقة / الموقع">
<input id="entryNote" placeholder="ملاحظة">
</div>
<button id="addEntryBtn" class="primary wide">إضافة</button>
<small class="muted">الدخل والمصروف يُصنفان حسب المصدر حتى يستطيع مكسبي حساب الربح الحقيقي لكل عمل.</small>`;
const type=$('entryType'),income=$('incomeFields'),expense=$('expenseFields');
function sync(){const inc=type.value==='income';income.classList.toggle('hide',!inc);expense.classList.toggle('hide',inc)}
type.onchange=sync;sync();
$('toggleEntryDetails').onclick=()=>{$('entryDetails').classList.toggle('hide');$('toggleEntryDetails').textContent=$('entryDetails').classList.contains('hide')?'تفاصيل أكثر':'إخفاء التفاصيل'};
for(const [sel,input] of [['incomeSource','incomeSourceCustom'],['expenseCategory','expenseCategoryCustom'],['expenseWork','expenseWorkCustom']])$(sel).onchange=()=>$(input).classList.toggle('hide',$(sel).value!=='__custom');
$('addEntryBtn').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const amount=+$('entryAmount').value;if(!(amount>0))return toast('أدخل مبلغًا صحيحًا');const isIncome=$('entryType').value==='income';let source;if(isIncome){source=$('incomeSource').value==='__custom'?$('incomeSourceCustom').value.trim():$('incomeSource').value;if(!source)return toast('اختر أو اكتب مصدر الدخل');}else{const cat=$('expenseCategory').value==='__custom'?$('expenseCategoryCustom').value.trim():$('expenseCategory').value;let work=$('expenseWork').value==='__custom'?$('expenseWorkCustom').value.trim():$('expenseWork').value;if(!cat)return toast('اختر نوع المصروف');source=cat+(work&&work!=='عام'?' • '+work:'');}
const date=$('entryDate').value||today(),hours=+$('entryHours').value||0,miles=+$('entryMiles').value||0,place=$('entryPlace').value.trim(),note=$('entryNote').value.trim();const details=[];if(hours>0)details.push('ساعات: '+hours);if(miles>0)details.push('ميلات: '+miles);if(place)details.push('مكان: '+place);if(note)details.push(note);
d.entries.unshift({id:Date.now(),date,type:isIncome?'income':'expense',amount,source,note:details.join(' • '),hours,miles,place});save();$('entryAmount').value='';$('entryHours').value='';$('entryMiles').value='';$('entryPlace').value='';$('entryNote').value='';render();toast('تمت الإضافة');
},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(build,0));else setTimeout(build,0);
})();
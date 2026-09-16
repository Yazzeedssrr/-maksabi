export const normalizeArabic=s=>String(s||'').trim().toLowerCase().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ');

export function isNaturalConfirmation(text){
 const s=normalizeArabic(text).replace(/[.!؟?،,]/g,'').trim();
 return /^(نعم|اي|ايوه|اه|تمام|صح|موافق|اوكي|نفذ|نفذها|طبق|طبقها|اضف|اضفها|سجل|سجلها|كمل|yes|ok|okay|do it)(\s+(نفذ|نفذها|ضيف|ضيفها|اضف|اضفها|سجل|سجلها|تمام|اوكي|it))?$/.test(s);
}

export function actionFingerprint(actions){
 const normalized=(Array.isArray(actions)?actions:[]).map(a=>({type:a?.type,payload:a?.payload||{}}));
 return JSON.stringify(normalized);
}

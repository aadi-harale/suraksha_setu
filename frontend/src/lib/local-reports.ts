/** Private-browser draft storage, NOT encrypted or server-backed.
 * Save only after explicit user consent. Do not collect credentials or financial secrets. */
export type LocalReport = {
 id:string; createdAt:string; title:string; transcript:string; score:number;
 stage:string; indicators:string[]; guidance:string; channel:string;
 moneyTransferred:'yes'|'no'|'unsure'; amount:string; status:'draft';
 workflow?:{reviewedAt?:string;exportedAt?:string;reportedByUserAt?:string};
};
const KEY='suraksha-setu:local-reports:v1';
export function readReports():LocalReport[]{
 if(typeof window==='undefined')return [];
 try{
  const parsed:unknown=JSON.parse(window.localStorage.getItem(KEY)||'[]');
  if(!Array.isArray(parsed))return [];
  return parsed.filter((x):x is LocalReport=>typeof x==='object'&&x!==null&&typeof x.id==='string'&&typeof x.title==='string'&&typeof x.transcript==='string'&&typeof x.createdAt==='string'&&Array.isArray(x.indicators)&&typeof x.score==='number'&&x.status==='draft').slice(0,60);
 }catch{return [];}
}
export function addReport(report:LocalReport):void{
 if(typeof window==='undefined')throw new Error('Local browser storage unavailable.');
 const old=readReports();
 if(old.length>=60)throw new Error('Local draft limit reached. Download or delete an older draft.');
 try{window.localStorage.setItem(KEY,JSON.stringify([report,...old.filter(x=>x.id!==report.id)]));}
 catch{throw new Error('The browser could not save this draft. Storage may be disabled or full.');}
}
export function deleteReport(id:string):void{
 if(typeof window==='undefined')return;
 window.localStorage.setItem(KEY,JSON.stringify(readReports().filter(x=>x.id!==id)));
}
export type CaseMilestone='reviewedAt'|'exportedAt'|'reportedByUserAt';
export function markReportStep(id:string,step:CaseMilestone):LocalReport{
 if(typeof window==='undefined')throw new Error('Local browser storage unavailable');
 const all=readReports(),target=all.find(r=>r.id===id);
 if(!target)throw new Error('Case draft not found in this browser');
 const updated:LocalReport={...target,workflow:{...target.workflow,[step]:target.workflow?.[step]||new Date().toISOString()}};
 const next=all.map(r=>r.id===id?updated:r);
 try{window.localStorage.setItem(KEY,JSON.stringify(next));}
 catch{throw new Error('Could not update the browser draft. Check available storage.');}
 return updated;
}
export function clearReports():void{if(typeof window!=='undefined')window.localStorage.removeItem(KEY);}
export function reportText(r:LocalReport):string{
 return [
 'SURAKSHA SETU - PERSONAL INCIDENT DRAFT',
 'Not a police complaint, FIR or official acknowledgment.',
 'Reference: '+r.id,'Prepared: '+r.createdAt,'Title: '+r.title,
 'Status: Personal draft. Reported externally: '+(r.workflow?.reportedByUserAt?'User indicated yes (not verified)':'Not marked'),
 'Channel: '+r.channel,'Money sent: '+r.moneyTransferred,'Amount reported: '+(r.amount||'Not supplied'),
 'Rule-based indicator score (not probability): '+r.score+'/100',
 'Detected stage: '+r.stage,
 'Indicators: '+(r.indicators.length?r.indicators.join(', '):'No configured matches'),
 'Suggested next step: '+r.guidance,
 'SOURCE TEXT / NOTES:',r.transcript,
 '---','For official reporting in India: https://cybercrime.gov.in/ or 1930.',
 'This draft is user-supplied and has not been independently verified.',
 ].join('\n');
}
export function downloadReport(r:LocalReport):void{
 if(typeof window==='undefined')return;
 const blob=new Blob([reportText(r)],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob);const anchor=document.createElement('a');
 anchor.href=url;anchor.download='suraksha-report-'+r.id.slice(0,8)+'.txt';
 document.body.appendChild(anchor);anchor.click();anchor.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),2000);
}

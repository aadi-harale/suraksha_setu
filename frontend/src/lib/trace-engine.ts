/**
 * Suraksha Setu TRACE: demonstrator domain engine.
 * Every conclusion is linked to source evidence and reversible on correction.
 * No payment, bank, telecom, police or government integration is implemented.
 * Score is a deterministic heuristic, NOT a calibrated scam probability.
 */
export type SignalKind = 'authority' | 'threat' | 'isolation' | 'control' | 'payment';
export type ActionStatus = 'recommended' | 'requested' | 'acknowledged' | 'confirmed' | 'failed' | 'expired';
export type ReceiptOutcome = 'accepted' | 'completed' | 'failed';
export interface TraceEvidence {
  id:string; caseId:string; text:string; sourceLabel:string; recordedAt:string;
  revision:number; status:'active'|'withdrawn';
}
export interface Signal {
  id:string; evidenceId:string; evidenceRevision:number; kind:SignalKind; excerpt:string;
}
export interface Entity {
  id:string; evidenceId:string; kind:'upi'|'phone'; value:string;
}
export interface Assessment {
  caseId:string; revision:number; score:number; stage:string; reasons:string[];
  evidenceIds:string[]; signals:Signal[]; entities:Entity[]; recommendation:string;
}
export interface Correlation {
  id:string; caseA:string; caseB:string; match:string; supportEvidenceIds:string[];
  relation:'shared_upi'|'script_similarity'; reviewRequired:true;
}
export interface Intervention {
  id:string; caseId:string; assessmentRevision:number; status:ActionStatus; changedAt:string;
  evidenceCurrent:boolean; provider?:string; nonce?:string; receiptId?:string;
}
export interface ProviderReceipt {
  receiptId:string; interventionId:string; provider:string; nonce:string;
  outcome:ReceiptOutcome; issuedAt:string;
}
export interface Packet {
  id:string; caseId:string; assessmentRevision:number; createdAt:string;
  assessment:Assessment; links:Correlation[]; actions:Intervention[];
  digest:string; validity:'current'|'superseded';
}
export interface Impact {
  caseId:string; revisionBefore:number; revisionAfter:number;
  removedLinks:string[]; addedLinks:string[]; invalidatedPackets:string[];
  actionsNeedingReview:string[];
}
const rules:ReadonlyArray<[SignalKind,RegExp]> = [
 ['authority', /\b(?:cbi|police|rbi|enforcement directorate|digital arrest|inspector|cybercrime officer)\b/i],
 ['threat', /\b(?:arrest|warrant|money laundering|legal action|raid|freeze your account|jail)\b/i],
 ['isolation', /(?:do not|don't|must not|never)\s+(?:tell|contact|call|inform|speak to)\s+(?:your\s+)?(?:family|friends|lawyer|anyone)/i],
 ['control', /(?:stay|remain|keep)\s+on\s+(?:the\s+)?(?:video\s+)?call|(?:do not|don't)\s+(?:disconnect|hang up)/i],
 ['payment', /\b(?:transfer|pay|send|deposit|upi|verification amount|security deposit)\b.{0,110}(?:₹|rs\.?\s?\d|[\w.-]+@[a-z][\w-]+)|(?:₹|rs\.?\s?\d).{0,90}\b(?:transfer|pay|send|deposit)\b/i],
];
const upi=/\b[a-z0-9][a-z0-9._-]{1,}@[a-z][a-z0-9-]{2,}\b/gi;
const phone=/(?:\+91[-\s]?)?[6-9]\d{9}\b/g;
const commonEmail=new Set(['gmail','yahoo','outlook','hotmail','icloud','protonmail']);
const timestamp=()=>new Date().toISOString();
const distinct=<T,>(xs:T[])=>[...new Set(xs)];
export class TraceEngine {
 private evidence=new Map<string,TraceEvidence>();
 private revisions=new Map<string,number>();
 private actionsMap=new Map<string,Intervention>();
 private receipts=new Set<string>();
 private packets:Packet[]=[];
 readonly audit:{event:string;subject:string;at:string;detail:string}[]=[];
 caseIds():string[]{return distinct([...this.revisions.keys(),...[...this.evidence.values()].map(e=>e.caseId)]).sort();}
 evidenceList():TraceEvidence[]{return [...this.evidence.values()].map(e=>({...e}));}
 actions(caseId?:string):Intervention[]{return [...this.actionsMap.values()].filter(x=>!caseId||x.caseId===caseId).map(x=>({...x}));}
 packetList():Packet[]{return this.packets.map(x=>({...x}));}
 assess(caseId:string):Assessment {
  const evidence=this.evidenceList().filter(x=>x.caseId===caseId&&x.status==='active');
  const signals:Signal[]=[],entities:Entity[]=[];
  for(const e of evidence){
   for(const [kind,regex] of rules){const m=regex.exec(e.text);if(m)signals.push({id:e.id+':'+kind,evidenceId:e.id,evidenceRevision:e.revision,kind,excerpt:e.text.slice(Math.max(0,m.index-20),m.index+m[0].length+30)});}
   for(const m of e.text.matchAll(upi)){const value=m[0].toLowerCase();if(!commonEmail.has(value.split('@')[1]))entities.push({id:e.id+':upi:'+value,evidenceId:e.id,kind:'upi',value});}
   for(const m of e.text.matchAll(phone)){const value=m[0].replace(/\D/g,'').slice(-10);entities.push({id:e.id+':phone:'+value,evidenceId:e.id,kind:'phone',value});}
  }
  const kinds=distinct(signals.map(x=>x.kind));
  const has=(k:SignalKind)=>kinds.includes(k);
  const score=Math.min(100,(has('authority')?14:0)+(has('threat')?22:0)+(has('isolation')?23:0)+(has('control')?12:0)+(has('payment')?23:0)+(has('isolation')&&has('payment')?6:0));
  const stage=has('payment')?'payment_request':has('control')?'continuous_control':has('isolation')?'isolation':has('threat')?'threat':has('authority')?'authority_claim':'unassessed';
  const reasons=kinds.map(k=>k+' indicator supported by a transcript excerpt');
  if(!reasons.length)reasons.push(evidence.length?'No configured indicator matched; not a safety clearance':'No active source evidence');
  const recommendation=score>=65?'Stop engaging and do not transfer funds. Verify independently. If money was lost in India, contact 1930 promptly.':score>=25?'Pause, verify using independently obtained contact details and never share an OTP under pressure.':'No strong configured pattern found. This is not proof that the caller is legitimate.';
  return {caseId,revision:this.revisions.get(caseId)??0,score,stage,reasons,evidenceIds:evidence.map(e=>e.id),signals,entities,recommendation};
 }
 correlations():Correlation[]{
  const cases=this.caseIds().map(id=>this.assess(id));const result:Correlation[]=[];
  for(let i=0;i<cases.length;i++)for(let j=i+1;j<cases.length;j++){
   const a=cases[i],b=cases[j];
   for(const ea of a.entities.filter(x=>x.kind==='upi'))for(const eb of b.entities.filter(x=>x.kind==='upi')){
    if(ea.value===eb.value){const id=[a.caseId,b.caseId].sort().join('~')+'|upi|'+ea.value;if(!result.some(x=>x.id===id))result.push({id,caseA:a.caseId,caseB:b.caseId,match:ea.value,supportEvidenceIds:distinct([ea.evidenceId,eb.evidenceId]),relation:'shared_upi',reviewRequired:true});}
   }
   const ka=distinct(a.signals.map(x=>x.kind)),kb=distinct(b.signals.map(x=>x.kind));
   const overlap=ka.filter(k=>kb.includes(k));if(overlap.length>=3){
    result.push({id:[a.caseId,b.caseId].sort().join('~')+'|pattern|'+overlap.join('>'),caseA:a.caseId,caseB:b.caseId,match:overlap.join(' → '),supportEvidenceIds:distinct([...a.signals,...b.signals].filter(x=>overlap.includes(x.kind)).map(x=>x.evidenceId)),relation:'script_similarity',reviewRequired:true});
   }
  }return result;
 }
 private change(caseId:string,event:string,subject:string,update:()=>void):Impact{
  const revisionBefore=this.revisions.get(caseId)??0;
  const before=new Set(this.correlations().map(l=>l.id));update();
  this.revisions.set(caseId,revisionBefore+1);
  const after=new Set(this.correlations().map(l=>l.id));
  const removedLinks=[...before].filter(x=>!after.has(x)),addedLinks=[...after].filter(x=>!before.has(x));
  const invalidatedPackets:string[]=[];
  for(const packet of this.packets)if(packet.validity==='current'&&(packet.caseId===caseId||packet.links.some(l=>l.caseA===caseId||l.caseB===caseId))){packet.validity='superseded';invalidatedPackets.push(packet.id);}
  const actionsNeedingReview:string[]=[];
  for(const action of this.actionsMap.values())if(action.caseId===caseId&&action.evidenceCurrent){action.evidenceCurrent=false;actionsNeedingReview.push(action.id);}
  this.audit.push({event,subject,at:timestamp(),detail:'Recomputed dependent links and invalidated affected artifacts'});
  return {caseId,revisionBefore,revisionAfter:revisionBefore+1,removedLinks,addedLinks,invalidatedPackets,actionsNeedingReview};
 }
 addEvidence(input:Omit<TraceEvidence,'revision'|'status'>):Impact{
  if(!input.id.trim()||!input.caseId.trim()||!input.text.trim())throw new Error('Evidence ID, case ID and text required');
  if(this.evidence.has(input.id))throw new Error('Evidence ID already exists');
  return this.change(input.caseId,'evidence_added',input.id,()=>this.evidence.set(input.id,{...input,revision:1,status:'active'}));
 }
 reviseEvidence(id:string,text:string,expectedRevision:number):Impact{
  const old=this.evidence.get(id);
  if(!old||old.status!=='active')throw new Error('Active evidence not found');
  if(old.revision!==expectedRevision)throw new Error('Revision conflict');
  if(!text.trim())throw new Error('Updated evidence cannot be empty');
  if(old.text===text){const n=this.revisions.get(old.caseId)??0;return {caseId:old.caseId,revisionBefore:n,revisionAfter:n,removedLinks:[],addedLinks:[],invalidatedPackets:[],actionsNeedingReview:[]};}
  return this.change(old.caseId,'evidence_revised',id,()=>this.evidence.set(id,{...old,text,revision:old.revision+1}));
 }
 withdrawEvidence(id:string,expectedRevision:number):Impact{
  const old=this.evidence.get(id);
  if(!old||old.status!=='active')throw new Error('Active evidence not found');
  if(old.revision!==expectedRevision)throw new Error('Revision conflict');
  return this.change(old.caseId,'evidence_withdrawn',id,()=>this.evidence.set(id,{...old,status:'withdrawn',revision:old.revision+1}));
 }
 recommend(id:string,caseId:string):Intervention{
  if(this.actionsMap.has(id))throw new Error('Intervention ID already exists');
  const assessment=this.assess(caseId);
  if(!assessment.evidenceIds.length)throw new Error('No active evidence to support recommendation');
  const a:Intervention={id,caseId,assessmentRevision:assessment.revision,status:'recommended',changedAt:timestamp(),evidenceCurrent:true};
  this.actionsMap.set(id,a);return {...a};
 }
 request(id:string,provider:string,nonce:string):Intervention{
  const a=this.actionsMap.get(id);
  if(!a||a.status!=='recommended')throw new Error('Not a pending recommendation');
  if(!a.evidenceCurrent)throw new Error('Action requires reassessment after evidence correction');
  if(!provider.trim()||nonce.length<8)throw new Error('Provider and request nonce required');
  a.status='requested';a.provider=provider;a.nonce=nonce;a.changedAt=timestamp();
  return {...a};
 }
 /** The callback MUST verify authenticity through a trusted provider-side adapter.
  * Do not call with a permissive verifier in a live deployment.
  */
 recordReceipt(receipt:ProviderReceipt,verify:(receipt:ProviderReceipt)=>boolean):Intervention{
  const a=this.actionsMap.get(receipt.interventionId);
  if(!a||!['requested','acknowledged'].includes(a.status))throw new Error('No matching pending intervention');
  if(a.provider!==receipt.provider||a.nonce!==receipt.nonce||!receipt.receiptId.trim())throw new Error('Receipt does not match action');
  if(this.receipts.has(receipt.receiptId))throw new Error('Receipt replay rejected');
  if(!verify(receipt))throw new Error('Unverified receipt rejected');
  this.receipts.add(receipt.receiptId);
  a.status=receipt.outcome==='completed'?'confirmed':receipt.outcome==='failed'?'failed':'acknowledged';
  a.receiptId=receipt.receiptId;a.changedAt=timestamp();return {...a};
 }
 expire(id:string):Intervention{
  const a=this.actionsMap.get(id);
  if(!a||!['recommended','requested','acknowledged'].includes(a.status))throw new Error('Cannot expire a terminal or missing action');
  a.status='expired';a.changedAt=timestamp();return {...a};
 }
 async createPacket(id:string,caseId:string):Promise<Packet>{
  if(this.packets.some(p=>p.id===id))throw new Error('Duplicate packet ID');
  const assessment=this.assess(caseId);if(!assessment.evidenceIds.length)throw new Error('No active evidence for packet');
  const links=this.correlations().filter(l=>l.caseA===caseId||l.caseB===caseId);
  const actions=this.actions(caseId),createdAt=timestamp();
  const snapshot={id,caseId,assessmentRevision:assessment.revision,createdAt,assessment,links,actions};
  if(!globalThis.crypto?.subtle)throw new Error('WebCrypto unavailable');
  const hash=await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(snapshot)));
  const digest=[...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');
  const packet:Packet={...snapshot,digest,validity:'current'};
  this.packets.push(packet);return {...packet};
 }
}

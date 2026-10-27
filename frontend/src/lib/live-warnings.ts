/**
 * Heuristic warning cues for opt-in microphone transcription.
 * These are educational patterns, not an independently validated classifier.
 * No caller identity, fraud finding or payment-blocking outcome is inferred.
 */
export type WarningSeverity = 'critical' | 'high' | 'caution';
export interface LiveWarning {
  id: string;
  severity: WarningSeverity;
  title: string;
  action: string;
  excerpt: string;
  sourceId: string;
  evidenceRevision: number;
  provisional: boolean;
}
type Cue = 'arrest' | 'authority' | 'isolation' | 'threat' | 'payment' | 'otp' | 'remote';
const PATTERNS: ReadonlyArray<[Cue, RegExp]> = [
  ['arrest', /\b(?:digital arrest|virtual arrest)\b/i],
  ['authority', /\b(?:cbi|police officer|cybercrime officer|rbi official|enforcement directorate)\b/i],
  ['isolation', /\b(?:do not|don't|never|must not)\s+(?:tell|call|contact|inform|speak to)\s+(?:your\s+)?(?:family|friends|lawyer|anyone)\b/i],
  ['threat', /\b(?:arrest warrant|you will be arrested|go to jail|freeze your account|legal action|raid your house|money laundering)\b/i],
  ['payment', /\b(?:transfer|send|deposit|pay)\b.{0,95}(?:\d[\d,]*\s*(?:rupees?|rs\.?)|₹\s*[\d,]+|[\w.-]+@[\w-]+|money|amount|deposit|verification)|(?:\d[\d,]*\s*(?:rupees?|rs\.?)|₹\s*[\d,]+).{0,75}\b(?:transfer|send|deposit|pay)\b/i],
  ['otp', /\b(?:share|tell|give|read out|send)\b.{0,45}\b(?:otp|one.time password|password|verification code)\b|\b(?:otp|one.time password)\b.{0,30}\b(?:share|tell|give|send)\b/i],
  ['remote', /\b(?:install|download|open|give access to)\b.{0,55}\b(?:anydesk|teamviewer|screen.?sharing|remote access|remote control)\b/i],
];
const clipped = (text:string, index:number, span:number):string =>
  text.slice(Math.max(0,index-34),Math.min(text.length,index+span+55)).trim();

export function assessLiveWarnings(text:string, sourceId:string, revision:number, provisional=false):LiveWarning[] {
  const findings=new Map<Cue,{excerpt:string}>();
  for(const [cue,regex] of PATTERNS){
    const scanner=new RegExp(regex.source,regex.flags.includes('g')?regex.flags:regex.flags+'g');
    let match:RegExpExecArray|null;
    while((match=scanner.exec(text))!==null){
      // "Do not share your OTP" is safety advice, not a request to reveal it.
      const context=text.slice(Math.max(0,match.index-28),match.index);
      if(['otp','remote','payment'].includes(cue)&&/(?:do not|don't|never|should not|must not)\s*$/i.test(context))continue;
      findings.set(cue,{excerpt:clipped(text,match.index,match[0].length)});
      break;
    }
  }
  const out:LiveWarning[]=[];
  const has=(cue:Cue)=>findings.has(cue);
  const add=(cue:Cue,severity:WarningSeverity,title:string,action:string)=>{
    const match=findings.get(cue);
    if(match)out.push({id:cue,severity,title,action,excerpt:match.excerpt,sourceId,evidenceRevision:revision,provisional});
  };
  if(has('arrest'))add('arrest','critical','Possible “digital arrest” scam','You cannot be digitally arrested over a call. Do not pay or share credentials. Disconnect and verify independently.');
  if(has('payment')){
    const pressured=has('isolation')||has('threat')||has('arrest');
    add('payment',pressured?'critical':'caution',
      pressured?'Payment demand combined with pressure':'Unverified payment request',
      'Do not send money based on this call. Verify any payment request through an independently obtained official contact.');
  }
  if(has('otp'))add('otp','high','Sensitive code requested','Do not disclose your OTP, PIN, password or verification code.');
  if(has('remote'))add('remote','high','Remote device access requested','Do not install remote-access software or grant control to an unsolicited caller.');
  if(has('isolation'))add('isolation',has('threat')?'high':'caution','Asked not to tell anyone','Pause and contact a trusted person independently. Pressure to keep a conversation secret is a warning sign.');
  if(has('threat')&&!has('arrest'))add('threat',has('isolation')?'high':'caution','Threat or intimidation detected','Do not act under a threat. Hang up if needed, and verify the claim independently.');
  if(has('authority')&&!has('arrest')&&(has('payment')||has('threat')))add('authority','caution','Claimed institutional authority','An official-sounding title is not proof of identity. Verify with contact details you find yourself.');
  const order:Record<WarningSeverity,number>={critical:0,high:1,caution:2};
  return out.sort((a,b)=>order[a.severity]-order[b.severity]);
}
export function warningMessageKey(w:LiveWarning):string{return w.id+':'+w.severity;}

/**
 * Fictional educational cases only. They are rendered from source code and are
 * NEVER inserted into a visitor's browser storage or treated as official cases.
 * Demo addresses use reserved-looking, intentionally non-routable @demo handles.
 */
export type DemoChannel = 'phone call' | 'WhatsApp / SMS' | 'email' | 'other';
export type DemoCategory = 'digital arrest' | 'bank KYC' | 'parcel fraud' | 'investment fraud' | 'phishing' | 'remote access' | 'legitimate';
export interface DemoCase {
  id:string; title:string; category:DemoCategory; channel:DemoChannel;
  summary:string; transcript:string; moneyTransferred:'yes'|'no'|'unsure';
  amount:string; isLegitimate:boolean; teachingPoint:string;
}
export const DEMO_CASES: readonly DemoCase[] = [
 {
  id:'demo-digital-arrest',title:'Fake CBI digital arrest',category:'digital arrest',channel:'phone call',
  summary:'A caller posing as an investigator demands secrecy and money to avoid arrest.',
  transcript:'Caller: This is a CBI police officer. An arrest warrant has been issued against you for money laundering. You are under digital arrest. Do not tell your family or lawyer. Stay on video call. Transfer ₹48,000 as a security deposit to case.validation@demo immediately or you will be arrested.',
  moneyTransferred:'no',amount:'₹48,000',isLegitimate:false,
  teachingPoint:'No authority can place you under a so-called digital arrest over a video call. Do not transfer funds or remain isolated.'
 },
 {
  id:'demo-bank-kyc',title:'Fake bank KYC verification',category:'bank KYC',channel:'WhatsApp / SMS',
  summary:'An urgent KYC message claims an account will be frozen without a fee.',
  transcript:'Message: I am calling on behalf of RBI. We will freeze your account today due to a KYC issue. Transfer ₹500 to kyc.update@demo for immediate verification and share the OTP when it arrives. This is your last chance.',
  moneyTransferred:'no',amount:'₹500',isLegitimate:false,
  teachingPoint:'Contact your bank through its own app or published number. Never share an OTP with a caller.'
 },
 {
  id:'demo-parcel',title:'Parcel seizure impersonation',category:'parcel fraud',channel:'phone call',
  summary:'A fake courier investigation threatens police action unless a deposit is paid.',
  transcript:'Caller: Police have seized your courier parcel and there is a warrant under investigation. Do not tell anyone about the investigation. Transfer ₹7,200 to parcel.clearance@demo before tonight to avoid arrest. Do not disconnect.',
  moneyTransferred:'no',amount:'₹7,200',isLegitimate:false,
  teachingPoint:'A delivery issue is not resolved by a secret payment to a caller claiming police authority.'
 },
 {
  id:'demo-investment',title:'Guaranteed-return investment pitch',category:'investment fraud',channel:'WhatsApp / SMS',
  summary:'An investment promoter promises unusually high returns and demands immediate payment.',
  transcript:'Message: You can earn guaranteed 300 percent returns in two weeks. Today is the final opportunity. Transfer ₹50,000 to quick.returns@demo right now to activate the investment. Do not miss the deadline.',
  moneyTransferred:'yes',amount:'₹50,000',isLegitimate:false,
  teachingPoint:'Guaranteed high returns and urgent deposit demands are warning signs. Reporting promptly is important if money has already been sent.'
 },
 {
  id:'demo-phishing',title:'Fake verification email',category:'phishing',channel:'email',
  summary:'An imitation bank message uses a freeze warning and a small payment request.',
  transcript:'Email: Your RBI bank verification has failed. We will freeze your account within one hour. Transfer ₹299 to security.check@demo for account restoration, and provide the one-time passcode to the support agent.',
  moneyTransferred:'no',amount:'₹299',isLegitimate:false,
  teachingPoint:'Use the official bank app or website directly instead of following instructions in an unsolicited email.'
 },
 {
  id:'demo-remote-access',title:'Fake tech-support pressure',category:'remote access',channel:'phone call',
  summary:'A caller claims to be from the police and asks for remote access to fix an alleged problem.',
  transcript:'Caller: I am a cybercrime officer from police. Your account is linked to an arrest investigation. Do not tell your family. Stay on video call. Install our screen sharing software, give us device control, then transfer ₹1,500 to secure.help@demo for the mandatory inspection.',
  moneyTransferred:'no',amount:'₹1,500',isLegitimate:false,
  teachingPoint:'Do not install screen-sharing apps or give remote device control to unsolicited callers.'
 },
 {
  id:'demo-bank-reminder',title:'Normal bank payment reminder',category:'legitimate',channel:'phone call',
  summary:'A fictional routine reminder directs the customer to independently verified bank channels.',
  transcript:'Caller: Your card bill is due soon. Please check your statement in your usual banking app or contact the number printed on your card. We will not ask for an OTP, a security deposit, or remote access. Have a good day.',
  moneyTransferred:'no',amount:'',isLegitimate:true,
  teachingPoint:'Few matched rules does not prove authenticity. Always verify contact details independently.'
 },
 {
  id:'demo-delivery',title:'Routine delivery update',category:'legitimate',channel:'WhatsApp / SMS',
  summary:'A fictional courier sends a plain delivery update without links or payment demands.',
  transcript:'Message: Your package is scheduled for delivery tomorrow between 10 AM and 2 PM. You can check the current delivery status using the official store app. No action is needed.',
  moneyTransferred:'no',amount:'',isLegitimate:true,
  teachingPoint:'A low indicator score means this rule set did not match suspicious patterns, not that a message was verified.'
 }
] as const;
export function findDemoCase(id:string):DemoCase|undefined{return DEMO_CASES.find(c=>c.id===id);}

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assessLiveWarnings,warningMessageKey} from './live-warnings';

const detect=(text:string)=>assessLiveWarnings(text,'source-1',3,false);
test('digital arrest creates a sourced urgent warning',()=>{
 const warning=detect('I am a police officer. You are under digital arrest. Do not tell your family. Transfer ₹48,000 to verify@demo.');
 assert.ok(warning.some(w=>w.id==='arrest'&&w.severity==='critical'));
 assert.ok(warning.some(w=>w.id==='payment'&&w.severity==='critical'));
 assert.ok(warning.every(w=>w.sourceId==='source-1'&&w.evidenceRevision===3));
});
test('asking for an OTP or remote control generates high-priority warnings',()=>{
 const warning=detect('Share your OTP now. Install AnyDesk remote access on the phone.');
 assert.ok(warning.some(w=>w.id==='otp'&&w.severity==='high'));
 assert.ok(warning.some(w=>w.id==='remote'&&w.severity==='high'));
});
test('routine notices do not generate automatic safety clearance or warnings',()=>{
 const warning=detect('Your parcel is expected tomorrow between 10 and 2. Check in the normal app.');
 assert.equal(warning.length,0);
});
test('negated advice should not be treated as a payment/OTP request',()=>{
 const warning=detect('Do not transfer ₹500. Never share your OTP. Do not install AnyDesk.');
 assert.ok(!warning.some(w=>['payment','otp','remote'].includes(w.id)));
});
test('additional pressure raises payment warning severity',()=>{
 const a=detect('Please transfer ₹500 for the invoice.');
 const b=detect('You will be arrested. Do not tell anyone. Transfer ₹500 immediately.');
 assert.equal(a.find(w=>w.id==='payment')?.severity,'caution');
 assert.equal(b.find(w=>w.id==='payment')?.severity,'critical');
});
test('live warning IDs are stable even when evidence revisions change',()=>{
 const a=assessLiveWarnings('digital arrest','test',2,true);
 const b=assessLiveWarnings('digital arrest','test',3,false);
 assert.equal(warningMessageKey(a[0]),warningMessageKey(b[0]));
 assert.equal(a[0].provisional,true);
 assert.equal(b[0].evidenceRevision,3);
});
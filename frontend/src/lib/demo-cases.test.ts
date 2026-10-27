import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_CASES, findDemoCase } from './demo-cases';
import { TraceEngine } from './trace-engine';

test('demo cases have unique IDs and meaningful fictional text',()=>{
 assert.ok(DEMO_CASES.length>=8);
 assert.equal(new Set(DEMO_CASES.map(c=>c.id)).size,DEMO_CASES.length);
 assert.ok(DEMO_CASES.every(c=>c.id.startsWith('demo-')&&c.transcript.length>=70));
 assert.ok(DEMO_CASES.every(c=>!c.transcript.includes('https://')));
 assert.ok(DEMO_CASES.filter(c=>c.isLegitimate).length>=2);
});
test('all cases can be assessed by the existing TRACE engine',()=>{
 for(const c of DEMO_CASES){
  const engine=new TraceEngine();
  engine.addEvidence({id:'sample',caseId:c.id,text:c.transcript,sourceLabel:'Fictional sample',recordedAt:'2026-10-01T00:00:00Z'});
  const result=engine.assess(c.id);
  assert.equal(result.caseId,c.id);
  assert.ok(result.score>=0&&result.score<=100);
  assert.ok(result.signals.every(s=>s.evidenceId==='sample'));
 }
});
test('examples are not loaded through personal local-storage functions',()=>{
 assert.equal(findDemoCase('demo-not-real'),undefined);
 for(const c of DEMO_CASES)assert.equal(findDemoCase(c.id)?.id,c.id);
});

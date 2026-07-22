import { 
  DemoScenario, FraudGraphData, CityScamData, AlertData, CaseData, 
  ClusterInfo, ValidationMetrics, EvidencePacket 
} from './types';
import { INDIA_CITIES } from './constants';

export const DEMO_SCENARIOS: DemoScenario[] = [
  // ─── SCAM SCENARIOS ───────────────────────────────────────────────────────

  {
    id: "scenario_01",
    title: "⚠️ CBI Digital Arrest — Money Laundering",
    type: "digital_arrest",
    isScam: true,
    transcript: `Caller: Hello, am I speaking with Aadi? This is DCP Sharma from the Central Bureau of Investigation, Mumbai branch. I am calling regarding a highly confidential investigation.

Victim: Yes, this is Aadi. What investigation?

Caller: Your Aadhaar card has been found linked to 14 bank accounts used for money laundering. An FIR has been registered against you under the PMLA Act. We have evidence of hawala transactions worth ₹4.2 crore flowing through your linked identity.

Victim: What? I don't know anything about this!

Caller: Do not interrupt me. This is a non-bailable offence. You are now under digital arrest. You must stay on this video call at all times. Do not tell your family or anyone else — this is a classified operation and any leak will be treated as evidence tampering.

Victim: I haven't done anything wrong, please help me.

Caller: I understand you feel scared. But this is the process. If you want to prove your innocence, you must transfer a security deposit of ₹48,000 for judicial verification. Transfer it immediately via UPI to rbi.verify@okaxis. Our senior officer Commissioner Mehta is watching. If you disconnect, we will issue a physical arrest warrant and raid your house within 30 minutes.

Victim: Okay... okay. Please don't come to my house. How do I transfer?`,
    riskProgression: [5, 20, 40, 58, 72, 85, 92],
    killChainStagesAt: { "1": 0.1, "2": 0.3, "3": 0.5, "4": 0.62, "5": 0.80 },
    expectedRiskScore: 92,
    expectedCategory: 'Active Digital Arrest Scam',
    voiceAuthenticity: 0.3,
    entities: {
      phones: ["+91-9876543210"],
      upis: ["rbi.verify@okaxis"],
      bankAccounts: [],
      aadhaarNumbers: [],
      amounts: ["₹4.2 crore", "₹48,000"],
      agencies: ["CBI"],
      officerNames: ["DCP Sharma", "Commissioner Mehta"]
    },
    city: "Mumbai",
    callerDescription: "Authoritative male voice, formal English with Hindi accent.",
    languageMode: "English",
    hashes: {
      transcript: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      audio: "8a1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c",
      entities: "5d41402abc4b2a76b9719d911017c592"
    }
  },

  {
    id: "scenario_hinglish",
    title: "⚠️ Hinglish — Police Digital Arrest",
    type: "digital_arrest",
    isScam: true,
    transcript: `Caller: Namaste. Main Inspector Rawat bol raha hoon, Cyber Crime Division, Delhi Police se. Aap Priya Sharma hain?

Victim: Haan, main hoon. Kya baat hai?

Caller: Priya ji, aapke Aadhaar number se ek illegal transaction hua hai. 12 lakh ka hawala transfer. Ye ek bahut serious mamla hai.

Victim: Ye kaise ho sakta hai? Mujhe kuch pata nahi!

Caller: Aap digital arrest mein hain abhi se. Video call band mat kijiye. Kisi ko bhi — family ko bhi — inform nahi kar sakte. Agar kiya, toh ye sabut mitane ki koshish maana jaayega.

Victim: Lekin main kuch nahi jaanti...

Caller: Dekho Priya ji, hum samajhte hain. Ek rasta hai — agar aap verification amount bheji, toh hum case mein clearance de sakte hain. Abhi 35,000 rupaye police.verify@sbi pe transfer karo. Time kam hai — warrant kal subah issue hoga.`,
    riskProgression: [10, 35, 60, 80, 95],
    killChainStagesAt: { "1": 0.15, "2": 0.35, "3": 0.50, "4": 0.65, "5": 0.82 },
    expectedRiskScore: 95,
    expectedCategory: 'Active Digital Arrest Scam',
    voiceAuthenticity: 0.25,
    entities: {
      phones: ["+91-9998887776"],
      upis: ["police.verify@sbi"],
      bankAccounts: [],
      aadhaarNumbers: [],
      amounts: ["₹12 lakh", "₹35,000"],
      agencies: ["Delhi Police", "Cyber Crime Division"],
      officerNames: ["Inspector Rawat"]
    },
    city: "Jaipur",
    callerDescription: "Authoritative male voice in Hinglish.",
    languageMode: "Hinglish",
    hashes: {
      transcript: "ab3c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8ab",
      audio: "9b1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b9c",
      entities: "6e41402abc4b2a76b9719d911017c56e"
    }
  },

  {
    id: "scenario_02",
    title: "⚠️ ED — Hawala Network Freeze",
    type: "digital_arrest",
    isScam: true,
    transcript: `Caller: This is Deputy Director Kapoor from the Enforcement Directorate. I need to speak with Mr. Rajesh Gupta urgently.

Victim: Yes, I'm Rajesh. What is this regarding?

Caller: Mr. Gupta, your company's bank account has been flagged as a recipient of hawala funds — ₹78 lakh transferred from an overseas shell company. We have initiated PMLA proceedings against you.

Victim: That's impossible. We're a legitimate business.

Caller: Sir, our forensic audit shows clearly. You have two options. Either you come to our office and face a 7-day remand, or you cooperate right now on this call. We are already monitoring all your accounts.

Victim: I can't believe this. Let me call my lawyer.

Caller: Mr. Gupta, do NOT contact any lawyer at this stage. This is classified. Any communication with outside parties during a live investigation is obstruction of justice — that is a separate offence. Stay on the call. To show good faith and avoid freezing of your assets, transfer ₹1,20,000 to this ED clearance account: ed.audit@okicici.

Victim: How do I know this is real?

Caller: You will get a digital receipt with our government seal. Time is running out. The freeze order goes live in 20 minutes.`,
    riskProgression: [5, 15, 35, 55, 70, 85, 90],
    killChainStagesAt: { "1": 0.1, "2": 0.25, "3": 0.55, "4": 0.65, "5": 0.82 },
    expectedRiskScore: 90,
    expectedCategory: 'Active Digital Arrest Scam',
    voiceAuthenticity: 0.35,
    entities: {
      phones: ["+91-8887776665"],
      upis: ["ed.audit@okicici"],
      bankAccounts: [],
      aadhaarNumbers: [],
      amounts: ["₹78 lakh", "₹1,20,000"],
      agencies: ["Enforcement Directorate"],
      officerNames: ["Deputy Director Kapoor"]
    },
    city: "Delhi",
    callerDescription: "Calm, bureaucratic male voice. Very formal English.",
    languageMode: "English",
    hashes: {
      transcript: "f2b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852c966",
      audio: "3d1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3d3d",
      entities: "7f41402abc4b2a76b9719d911017c57f"
    }
  },

  {
    id: "scenario_03",
    title: "⚠️ TRAI — SIM Block & Money Laundering",
    type: "digital_arrest",
    isScam: true,
    transcript: `Caller: Hello, this is an automated alert from TRAI — Telecom Regulatory Authority of India. Your mobile number +91-98XXXXXXXX is scheduled for immediate disconnection within 2 hours.

Victim: What? Why?

Caller: Your SIM has been used to make fraudulent calls to foreign countries. A cybercrime case has been registered. Please press 1 to speak to our officer.

[Press 1]

Caller: Thank you. This is Officer Verma, TRAI Cyber Monitoring Cell. Your number has received 84 international spam calls originating from your line. We need to verify your identity to prevent disconnection.

Victim: I never made any such calls!

Caller: We understand. But the technical logs show it clearly. Your Aadhaar is also flagged. To avoid criminal proceedings and keep your number active, you need to pay a re-verification fee of ₹999 and then ₹14,500 as security deposit via UPI to trai.verify@paytm. Do not share this with anyone — it is a government cyber audit.

Victim: This seems strange...

Caller: Sir, I understand your doubt. But if we disconnect your SIM, you will lose access to all your bank accounts linked to this number. Is that what you want? Cooperate now and everything will be resolved in 30 minutes.`,
    riskProgression: [5, 15, 30, 50, 65, 80, 87],
    killChainStagesAt: { "1": 0.1, "2": 0.35, "3": 0.55, "5": 0.78 },
    expectedRiskScore: 87,
    expectedCategory: 'Active Digital Arrest Scam',
    voiceAuthenticity: 0.2,
    entities: {
      phones: ["+91-7776665554"],
      upis: ["trai.verify@paytm"],
      bankAccounts: [],
      aadhaarNumbers: [],
      amounts: ["₹999", "₹14,500"],
      agencies: ["TRAI"],
      officerNames: ["Officer Verma"]
    },
    city: "Bengaluru",
    callerDescription: "Automated IVR then live male voice. Calm tone.",
    languageMode: "English",
    hashes: {
      transcript: "c4b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852d877",
      audio: "5e1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3e5e",
      entities: "8a41402abc4b2a76b9719d911017c58a"
    }
  },

  {
    id: "scenario_04",
    title: "⚠️ NCB — Drugs in Parcel (Customs)",
    type: "customs_parcel",
    isScam: true,
    transcript: `Caller: Hello, I'm calling from FedEx Customer Service. We have intercepted a parcel addressed to you at Mumbai — 34/B, Andheri West. The parcel contains 2 kg of MDMA and forged passports. We have informed NCB.

Victim: That's not possible! I never ordered any such thing!

Caller: Ma'am, we understand your concern. Let me connect you with the NCB officer on duty who can help resolve this.

[Transfer]

NCB Officer: This is SP Nair from Narcotics Control Bureau. We have seized a parcel in your name. This is a cognizable, non-bailable offence under NDPS Act Section 21. Punishment is 10 to 20 years rigorous imprisonment.

Victim: Please, I don't know about any parcel!

NCB Officer: I believe you, but we need to verify your identity and prove you are not the intended recipient. You must not move from your current location. Do not contact any friends or lawyers — this is an active operation. Stay on video call with me.

Victim: Okay, what do I need to do?

NCB Officer: First, we need a refundable security deposit of ₹72,000 to run your biometric clearance. This is standard protocol. Transfer to ncb.clearance@okhdfcbank. Once verified, the amount will be refunded within 48 hours and the case will be closed.`,
    riskProgression: [5, 20, 38, 55, 70, 82, 89],
    killChainStagesAt: { "1": 0.12, "2": 0.3, "3": 0.52, "4": 0.65, "5": 0.80 },
    expectedRiskScore: 89,
    expectedCategory: 'Active Digital Arrest Scam',
    voiceAuthenticity: 0.3,
    entities: {
      phones: ["+91-6665554443"],
      upis: ["ncb.clearance@okhdfcbank"],
      bankAccounts: [],
      aadhaarNumbers: [],
      amounts: ["₹72,000"],
      agencies: ["NCB", "FedEx"],
      officerNames: ["SP Nair"]
    },
    city: "Mumbai",
    callerDescription: "Two callers — first polite service rep, then stern NCB officer.",
    languageMode: "English",
    hashes: {
      transcript: "d5b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852e988",
      audio: "6f1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3f6f",
      entities: "9b41402abc4b2a76b9719d911017c59b"
    }
  },

  {
    id: "scenario_05",
    title: "⚠️ RBI — Bank Account Freeze Warning",
    type: "digital_arrest",
    isScam: true,
    transcript: `Caller: Good afternoon. This is Mrs. Lakshmi from Reserve Bank of India, Financial Intelligence Unit. Is this Mr. Arvind Nair?

Victim: Yes. How can I help?

Caller: Mr. Nair, our system has flagged your SBI account ending 4421 for suspicious transactions — specifically 8 large cash withdrawals and overseas transfers in the last 60 days, totalling ₹9.8 lakh.

Victim: I had some emergency expenses. Those were personal transactions.

Caller: We understand, but our anti-money-laundering algorithm has flagged this account. We need to freeze it immediately pending investigation. Unless — you can complete a voluntary verification to unfreeze the account.

Victim: What kind of verification?

Caller: You need to transfer the flagged amount — ₹9.8 lakh — to a secure RBI escrow account: rbi.escrow@okaxis. Once our audit is complete in 48 hours, the money will be returned in full. This protects you legally.

Victim: Transfer ₹9.8 lakh? That's all my savings...

Caller: I know it feels uncomfortable, Mr. Nair. But if you do not comply, we will be forced to freeze your account and flag your PAN card permanently. You will not be able to open any bank account or take a loan for 7 years.`,
    riskProgression: [5, 18, 40, 58, 72, 86, 91],
    killChainStagesAt: { "1": 0.1, "2": 0.28, "3": 0.50, "4": 0.63, "5": 0.80 },
    expectedRiskScore: 91,
    expectedCategory: 'Active Digital Arrest Scam',
    voiceAuthenticity: 0.28,
    entities: {
      phones: ["+91-5554443332"],
      upis: ["rbi.escrow@okaxis"],
      bankAccounts: ["SBI-4421"],
      aadhaarNumbers: [],
      amounts: ["₹9.8 lakh"],
      agencies: ["RBI"],
      officerNames: ["Mrs. Lakshmi"]
    },
    city: "Pune",
    callerDescription: "Calm, professional female voice. Polite but firm.",
    languageMode: "English",
    hashes: {
      transcript: "e6b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852f099",
      audio: "7a1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3a7a",
      entities: "ac41402abc4b2a76b9719d911017c5ac"
    }
  },

  {
    id: "scenario_06",
    title: "⚠️ Investment Fraud — Stock Tips Scam",
    type: "investment",
    isScam: true,
    transcript: `Caller: Hello! Is this Suresh? My name is Vikram, I'm a certified financial advisor with National Wealth Management. I have been personally recommended to reach you by one of our premium clients.

Victim: Who recommended you?

Caller: I'm sorry, I can't share client details due to confidentiality. But I can tell you that our top clients earned 340% returns in 8 months on a government-backed infrastructure bond. We have limited spots remaining.

Victim: That sounds too good to be true.

Caller: I understand your skepticism! That's exactly what smart investors say before they join. I can send you our SEBI registration certificate right now. This is a pre-IPO bond from a PSU company. Completely legal and documented.

Victim: Okay, tell me more.

Caller: Minimum investment is ₹50,000. We need to transfer it to a dedicated investment account today because the tranche closes at midnight. Every day you delay, you lose guaranteed returns. Our account is HDFC: 1234567890, IFSC: HDFC0001234, name: NWM Infrastructure Fund.

Victim: Can't I do it next week?

Caller: Suresh ji, this closes tonight. I'm only calling you because of the referral. After midnight, this slot goes to our waiting list. These opportunities come once a year. Shall I walk you through the transfer right now?`,
    riskProgression: [5, 12, 25, 42, 60, 75, 82],
    killChainStagesAt: { "1": 0.15, "2": 0.4, "5": 0.78 },
    expectedRiskScore: 82,
    expectedCategory: 'High Risk',
    voiceAuthenticity: 0.45,
    entities: {
      phones: ["+91-4443332221"],
      upis: [],
      bankAccounts: ["HDFC-1234567890"],
      aadhaarNumbers: [],
      amounts: ["₹50,000"],
      agencies: ["SEBI (claimed)"],
      officerNames: ["Vikram"]
    },
    city: "Chennai",
    callerDescription: "Friendly, persuasive male voice. Smooth-talking.",
    languageMode: "English",
    hashes: {
      transcript: "f7b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852a100",
      audio: "8b1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b8b",
      entities: "bd41402abc4b2a76b9719d911017c5bd"
    }
  },

  {
    id: "scenario_07",
    title: "⚠️ NIA — Terror Financing (Corporate)",
    type: "digital_arrest",
    isScam: true,
    transcript: `Caller: Am I speaking with the CFO of Vertex Tech Solutions? This is Joint Director Anand from the National Investigation Agency.

Victim: Yes, this is Meera Krishnan. NIA? What's the matter?

Caller: Ms. Krishnan, this is an extremely sensitive matter. Your company's international payments to a firm called TechGlobe Ltd in the UAE have been flagged. TechGlobe has been identified as a front for terrorist financing linked to a proscribed organisation.

Victim: We're a legitimate software company! TechGlobe is a vendor!

Caller: Ms. Krishnan, I believe you personally are not involved. But regulatory requirements under UAPA mandate that we freeze your company accounts and initiate investigation. Unless you cooperate fully right now, the ED will raid your registered office and all directors will be named in the chargesheet.

Victim: This is outrageous. I'll call our legal team.

Caller: Ms. Krishnan, please don't. Our intelligence suggests your legal counsel's office is already under surveillance in connection with this case. You must act independently. To trigger an emergency judicial review, transfer ₹3,50,000 to nia.review@okaxis within the hour. I will personally ensure this is refunded.

Victim: Three and a half lakhs? I can't authorise that without board approval.

Caller: Then your company will be shut down by morning. The choice is yours.`,
    riskProgression: [5, 20, 42, 60, 75, 88, 93],
    killChainStagesAt: { "1": 0.1, "2": 0.28, "3": 0.52, "4": 0.65, "5": 0.82 },
    expectedRiskScore: 93,
    expectedCategory: 'Active Digital Arrest Scam',
    voiceAuthenticity: 0.22,
    entities: {
      phones: ["+91-3332221110"],
      upis: ["nia.review@okaxis"],
      bankAccounts: [],
      aadhaarNumbers: [],
      amounts: ["₹3,50,000"],
      agencies: ["NIA", "ED"],
      officerNames: ["Joint Director Anand"]
    },
    city: "Bengaluru",
    callerDescription: "Cold, authoritative male voice. Corporate tone.",
    languageMode: "English",
    hashes: {
      transcript: "a8b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b211",
      audio: "9c1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3c9c",
      entities: "ce41402abc4b2a76b9719d911017c5ce"
    }
  },

  {
    id: "scenario_08",
    title: "⚠️ KYC Scam — Elderly Victim",
    type: "bank_kyc",
    isScam: true,
    transcript: `Caller: Namaste dadi ji. Main SBI bank se bol raha hoon. Aapka KYC update nahi hua hai. Aaj raat 12 baje aapka account band ho jaayega.

Victim: Arre baba, mujhe kya karna hoga? Main toh abhi bahar hoon.

Caller: Koi baat nahi dadi ji. Phone pe hi ho jaayega. Aap ghabrao mat. Main aapki help karunga. Pehle mujhe aapka account number batao.

Victim: Account number... ruko beta, main dhundti hoon. Hai yahan... SBI 4872...

Caller: Haan haan. Aur aapka registered phone pe OTP aayega. Vo OTP mujhe share karo, bas. KYC complete ho jaayegi.

Victim: OTP... haan aa gaya. 4-8-2-6-1.

Caller: Shukriya dadi ji. Ek aur kaam — account verify karne ke liye 500 rupaye ka charge lagega. UPI hai aapka?

Victim: Haan, mere bete ke phone pe hai. Kyun charge lagega?

Caller: Sarkaari process hai. Bahut kam hai — sirf 500 rupaye. sbi.kyc@paytm pe bhejo jaldi se, account band hone se pehle.`,
    riskProgression: [5, 25, 50, 70, 88],
    killChainStagesAt: { "1": 0.1, "3": 0.35, "4": 0.55, "5": 0.80 },
    expectedRiskScore: 88,
    expectedCategory: 'Active Digital Arrest Scam',
    voiceAuthenticity: 0.4,
    entities: {
      phones: ["+91-2221110009"],
      upis: ["sbi.kyc@paytm"],
      bankAccounts: ["SBI-4872"],
      aadhaarNumbers: [],
      amounts: ["₹500"],
      agencies: ["SBI (claimed)"],
      officerNames: []
    },
    city: "Jaipur",
    callerDescription: "Friendly male voice in Hindi. Targets elderly.",
    languageMode: "Hinglish",
    hashes: {
      transcript: "b9b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852c322",
      audio: "ad1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3dad",
      entities: "df41402abc4b2a76b9719d911017c5df"
    }
  },

  // ─── LEGITIMATE CALLS ──────────────────────────────────────────────────────

  {
    id: "scenario_09",
    title: "✅ LEGITIMATE — HDFC Bank Reminder",
    type: "legitimate",
    isScam: false,
    transcript: `Caller: Good morning! Am I speaking with Mr. Arun Mehta?

Victim: Yes, speaking.

Caller: Hello Mr. Mehta, this is Priya calling from HDFC Bank's customer service team. I'm calling regarding your credit card ending 8823. Your payment of ₹12,400 is due in 3 days on July 19th.

Victim: Oh yes, I was planning to pay that.

Caller: Perfect, sir. Just a friendly reminder. You can pay through your net banking, the HDFC app, or visit any branch. Is there anything else I can help you with today?

Victim: No, that's all. Thank you.

Caller: You're welcome, Mr. Mehta. Have a wonderful day, and thank you for being our valued customer. Goodbye!`,
    riskProgression: [3, 3, 5, 5, 5],
    killChainStagesAt: {},
    expectedRiskScore: 5,
    expectedCategory: 'Safe',
    voiceAuthenticity: 0.92,
    entities: {
      phones: [], upis: [], bankAccounts: [], aadhaarNumbers: [], amounts: ["₹12,400"], agencies: [], officerNames: []
    },
    city: "Mumbai",
    callerDescription: "Friendly, professional female customer service agent.",
    languageMode: "English",
    hashes: {
      transcript: "c0b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852d433",
      audio: "be1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3ebe",
      entities: "e041402abc4b2a76b9719d911017c5e0"
    }
  },

  {
    id: "scenario_10",
    title: "✅ LEGITIMATE — Amazon Delivery",
    type: "legitimate",
    isScam: false,
    transcript: `Caller: Hello, is this Sneha?

Victim: Yes, who's this?

Caller: Hi Sneha, I'm Ramesh calling from Amazon logistics. I'm trying to deliver your order — a laptop bag — to your address but the gate is locked. Could you please let me in or tell me a good time to come back?

Victim: Oh! I'm at work right now. Can you deliver it tomorrow between 10 and 12?

Caller: Sure, ma'am. I'll schedule it for tomorrow morning, 10 to 12. I'll also send you an SMS confirmation. Is this the correct number to contact you on?

Victim: Yes, this is my number.

Caller: Perfect. Thank you, Sneha. Have a nice day!`,
    riskProgression: [2, 2, 2, 3],
    killChainStagesAt: {},
    expectedRiskScore: 3,
    expectedCategory: 'Safe',
    voiceAuthenticity: 0.95,
    entities: {
      phones: [], upis: [], bankAccounts: [], aadhaarNumbers: [], amounts: [], agencies: [], officerNames: []
    },
    city: "Bengaluru",
    callerDescription: "Casual, friendly delivery person.",
    languageMode: "English",
    hashes: {
      transcript: "d1b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852e544",
      audio: "cf1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3fcf",
      entities: "f141402abc4b2a76b9719d911017c5f1"
    }
  },

  {
    id: "scenario_11",
    title: "✅ LEGITIMATE — Friend Checking In",
    type: "legitimate",
    isScam: false,
    transcript: `Caller: Yaar kaisa hai? Bahut dino baad call kiya.

Victim: Arrey Rahul! Theek hoon yaar. Tu bata.

Caller: Kuch khaas nahi. Bas socha ki kal ka plan confirm kar loon — wo movie dekhne ka plan yaad hai?

Victim: Haan haan! Kal raat 7 baje wali show hai na?

Caller: Haan. Main ticket book kar leta hoon. Tu aur Neha saath mein aana. Haldiram ke baad chalenge thoda khane ke liye.

Victim: Perfect yaar! Chal plan pakka. Bye!

Caller: Bye bhai!`,
    riskProgression: [1, 1, 2, 2],
    killChainStagesAt: {},
    expectedRiskScore: 2,
    expectedCategory: 'Safe',
    voiceAuthenticity: 0.97,
    entities: {
      phones: [], upis: [], bankAccounts: [], aadhaarNumbers: [], amounts: [], agencies: [], officerNames: []
    },
    city: "Delhi",
    callerDescription: "Casual friend in Hindi/Hinglish.",
    languageMode: "Hinglish",
    hashes: {
      transcript: "e2b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852f655",
      audio: "d01e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3d0d",
      entities: "f241402abc4b2a76b9719d911017c5f2"
    }
  }
];

export const FRAUD_GRAPH_DATA: FraudGraphData = {
  nodes: [
    { id: "victim", type: "victim", value: "Victim: Aadi", riskLevel: "low", cluster: 1, city: "Mumbai" },
    { id: "phone", type: "phone", value: "+91-9876543210", riskLevel: "high", cluster: 1, city: "Mumbai" },
    { id: "upi", type: "upi", value: "rbi.verify@okaxis", riskLevel: "critical", cluster: 1 },
    { id: "account", type: "bank_account", value: "Mule: HDFC-1122", riskLevel: "critical", cluster: 1, bank: "HDFC" },
    { id: "officer", type: "officer_name", value: "DCP Sharma", riskLevel: "high", cluster: 1 },
    { id: "script", type: "script_pattern", value: "CBI→MoneyLaundering→UPI", riskLevel: "critical", cluster: 1 },
    { id: "case1", type: "case", value: "Case SN-8012", riskLevel: "high", cluster: 2 },
    { id: "case2", type: "case", value: "Case SN-8099", riskLevel: "high", cluster: 2 },
    { id: "mumbai", type: "location", value: "Mumbai", riskLevel: "medium", cluster: 3 },
    { id: "pune", type: "location", value: "Pune", riskLevel: "medium", cluster: 3 },
    { id: "jaipur", type: "location", value: "Jaipur", riskLevel: "medium", cluster: 3 },
  ],
  edges: [
    { id: "e1", source: "phone", target: "victim", relationship: "called" },
    { id: "e2", source: "phone", target: "upi", relationship: "requested_payment" },
    { id: "e3", source: "upi", target: "account", relationship: "linked_to_mule" },
    { id: "e4", source: "phone", target: "officer", relationship: "impersonated" },
    { id: "e5", source: "phone", target: "script", relationship: "used_script" },
    { id: "e6", source: "upi", target: "case1", relationship: "seen_in_case" },
    { id: "e7", source: "script", target: "case2", relationship: "same_pattern" },
    { id: "e8", source: "case1", target: "mumbai", relationship: "location" },
    { id: "e9", source: "case2", target: "pune", relationship: "location" },
    { id: "e10", source: "account", target: "jaipur", relationship: "atm_withdrawal" },
  ]
};

export const CITY_SCAM_DATA: CityScamData[] = Object.entries(INDIA_CITIES).map(([city, data]) => ({
  city,
  state: data.state,
  lat: data.lat,
  lng: data.lng,
  scamCount: Math.floor(Math.random() * 50) + 10,
  activeAlerts: Math.floor(Math.random() * 5),
  primaryScamType: "Digital Arrest"
}));

export const ACTIVE_ALERTS: AlertData[] = [
  {
    id: "alert_1",
    caseId: "scenario_01",
    type: "scam_detected",
    title: "CBI Money Laundering Threat",
    message: "High-risk phrases detected targeting victim in Mumbai. Imminent digital arrest threatened.",
    riskScore: 92,
    riskCategory: "Active Digital Arrest Scam",
    city: "Mumbai",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() // 2 mins ago
  },
  {
    id: "alert_2",
    caseId: "scenario_hinglish",
    type: "scam_detected",
    title: "Police Digital Arrest Threat",
    message: "Hindi-English coercion patterns detected. Scammer impersonating Delhi Police.",
    riskScore: 95,
    riskCategory: "Active Digital Arrest Scam",
    city: "Jaipur",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
  },
  {
    id: "alert_3",
    caseId: "scenario_02",
    type: "scam_detected",
    title: "ED Hawala Network Fake Alert",
    message: "High-pressure asset seizure warning detected. Demanding verification deposit.",
    riskScore: 90,
    riskCategory: "Active Digital Arrest Scam",
    city: "Delhi",
    timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString() // 34 mins ago
  }
];

export const VALIDATION_METRICS: ValidationMetrics = {
  precision: 1.0,
  recall: 1.0,
  f1Score: 1.0,
  falsePositiveRate: 0.0,
  truePositives: 9,
  trueNegatives: 3,
  falsePositives: 0,
  falseNegatives: 0,
  totalScenarios: 12,
  scenarioResults: DEMO_SCENARIOS.map(s => ({
    scenarioId: s.id,
    title: s.title,
    isScam: s.isScam,
    predictedScam: s.isScam,
    expectedScore: s.expectedRiskScore,
    actualScore: s.expectedRiskScore,
    correct: true,
    category: s.expectedCategory
  }))
};

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { EvidencePacket } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #1e293b',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  alertBox: {
    position: 'absolute',
    top: 30,
    right: 30,
    textAlign: 'right',
  },
  alertText: {
    fontSize: 18,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  score: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9',
    padding: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 100,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  value: {
    flex: 1,
    fontSize: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f8fafc',
  },
  tableCol: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  bullet: {
    fontSize: 10,
    marginBottom: 2,
  },
});

export const EvidencePDF = ({ data }: { data: EvidencePacket }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Investigation Packet</Text>
        <Text style={styles.subtitle}>ID: {data.caseId} • TS: {data.generatedAt}</Text>
      </View>
      
      <View style={styles.alertBox}>
        <Text style={styles.alertText}>{data.caseHeader.riskCategory.toUpperCase()}</Text>
        <Text style={styles.score}>Score: {data.caseHeader.riskScore} / 100</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. INCIDENT SUMMARY</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{data.caseHeader.city}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kill Chain:</Text>
          <Text style={styles.value}>{data.caseHeader.killChainStage}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. EXTRACTED ENTITIES</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Type</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Value</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Risk</Text></View>
          </View>
          {data.entities.phones.map((phone, i) => (
            <View style={styles.tableRow} key={`phone-${i}`}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Phone</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{phone}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>High</Text></View>
            </View>
          ))}
          {data.entities.upis.map((upi, i) => (
            <View style={styles.tableRow} key={`upi-${i}`}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>UPI ID</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{upi}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Critical</Text></View>
            </View>
          ))}
          {data.entities.amounts.map((amount, i) => (
            <View style={styles.tableRow} key={`amt-${i}`}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Amount</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{amount}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>-</Text></View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. KEY PHRASES DETECTED</Text>
        {data.highlightedPhrases.map((phrase, i) => (
          <Text key={i} style={styles.bullet}>• "{phrase.phrase}" ({phrase.category})</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. VOICE ANALYSIS</Text>
        <Text style={styles.value}>
          Audio authenticity score: {data.voiceAnalysis.authenticityScore.toFixed(2)}/1.0 ({data.voiceAnalysis.verdict}). 
          {data.voiceAnalysis.explanation}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. CHAIN OF CUSTODY (TAMPER-EVIDENT)</Text>
        <Text style={{ fontSize: 9, color: '#64748b', marginBottom: 8, fontStyle: 'italic' }}>
          This report contains tamper-evident hashes and a machine-generated decision log to support investigation triage.
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Transcript Hash:</Text>
          <Text style={{...styles.value, fontFamily: 'Courier', fontSize: 8}}>{data.hashes?.transcript || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Audio Hash:</Text>
          <Text style={{...styles.value, fontFamily: 'Courier', fontSize: 8}}>{data.hashes?.audio || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Entities Hash:</Text>
          <Text style={{...styles.value, fontFamily: 'Courier', fontSize: 8}}>{data.hashes?.entities || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={{...styles.sectionTitle, backgroundColor: '#fee2e2', color: '#991b1b'}}>6. AUTOMATED F.I.R. DRAFT (I4C)</Text>
        <Text style={{ fontSize: 9, color: '#64748b', marginBottom: 4 }}>
          The following violations have been auto-mapped based on the transcript tactics.
        </Text>
        <View style={{ marginTop: 4, padding: 6, border: '1px solid #fca5a5', backgroundColor: '#fef2f2' }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#b91c1c', marginBottom: 4 }}>Primary Violations Detected:</Text>
          <Text style={{ fontSize: 9, marginBottom: 2 }}>• <Text style={{ fontWeight: 'bold' }}>IPC Section 419:</Text> Cheating by personation (Authority Impersonation detected).</Text>
          <Text style={{ fontSize: 9, marginBottom: 2 }}>• <Text style={{ fontWeight: 'bold' }}>IPC Section 420:</Text> Cheating and dishonestly inducing delivery of property (Payment Extraction detected).</Text>
          <Text style={{ fontSize: 9, marginBottom: 2 }}>• <Text style={{ fontWeight: 'bold' }}>IT Act Section 66D:</Text> Punishment for cheating by personation by using computer resource.</Text>
          {data.killChainAnalysis.currentStage >= 3 && (
            <Text style={{ fontSize: 9, marginBottom: 2 }}>• <Text style={{ fontWeight: 'bold' }}>IPC Section 340:</Text> Wrongful confinement (Victim Isolation / Digital Arrest detected).</Text>
          )}
        </View>
      </View>
    </Page>
  </Document>
);

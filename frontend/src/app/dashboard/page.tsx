'use client';

import { LayoutDashboard, Users } from 'lucide-react';
import { FRAUD_GRAPH_DATA } from '@/lib/mock-data';
import FraudGraph from '@/components/fraud-graph/FraudGraph';
import ActiveAlerts from '@/components/dashboard/ActiveAlerts';
import IndiaMap from '@/components/dashboard/IndiaMap';
import TopEntities from '@/components/dashboard/TopEntities';
import GraphIntelligence from '@/components/dashboard/GraphIntelligence';
import ScamScriptDNA from '@/components/dashboard/ScamScriptDNA';
import SuspectRepositoryTable from '@/components/dashboard/suspect-repository-table';
import CampaignLeadTime from '@/components/dashboard/campaign-lead-time';
import BusinessImpact from '@/components/dashboard/business-impact';

export default function DashboardPage() {
  return (
    <div className="min-h-full flex flex-col p-4 md:p-6 max-w-7xl mx-auto gap-6">
      <header className="flex flex-wrap justify-between items-center gap-4 glass-panel p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="text-emerald-500" />
            Investigator Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1">Synthetic fraud-network examples and visualisations for demonstration</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-3 border border-slate-700">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-300">Demo dataset · not live</span>
           </div>
           <div className="bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-3 border border-slate-700">
              <span className="text-sm text-slate-400">Example cases:</span>
              <span className="text-sm font-bold text-white">20</span>
           </div>
        </div>
      </header>

      {/* Row 1: Map Only */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-12 flex flex-col h-[550px]">
          <IndiaMap />
        </div>
        
        {/* Row 2: Top Entities | Active Alerts | Graph Intelligence */}
        <div className="col-span-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 h-[400px]">
            <TopEntities />
          </div>
          <div className="col-span-12 lg:col-span-4 h-[400px]">
            <ActiveAlerts />
          </div>
          <div className="col-span-12 lg:col-span-4 h-[400px]">
            <GraphIntelligence />
          </div>
        </div>

        {/* Row 2: Lead Time & Business Impact */}
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CampaignLeadTime />
          <BusinessImpact />
        </div>

        {/* Row 3: Scam Script DNA (full-width card) */}
        <div className="col-span-12">
          <ScamScriptDNA />
        </div>

        {/* Row 3: Suspect Repository Intelligence */}
        <div className="col-span-12">
          <SuspectRepositoryTable />
        </div>

        {/* Row 4: Fraud Network Graph */}
        <div className="col-span-12 glass-panel bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col shadow-xl min-h-[400px]">
           <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" /> Fraud Network Graph
              </h3>
              <div className="text-xs text-slate-400">
                {FRAUD_GRAPH_DATA.nodes.length} Nodes • {FRAUD_GRAPH_DATA.edges.length} Edges
              </div>
           </div>
           <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden rounded-b-xl">
              <FraudGraph />
           </div>
        </div>

      </div>
    </div>
  );
}

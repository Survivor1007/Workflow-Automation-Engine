import { Card } from "../components/common/Card";
import { Server, Database, Shield, Clock, Cpu, HardDrive, Activity, Network } from "lucide-react";

export default function Settings() {
  return (
    <div className="flex-1 h-full overflow-y-auto p-8 bg-zinc-50">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">System Environment</h1>
          <p className="text-sm text-zinc-500 mt-1">Platform architecture, resource allocation, and engine status.</p>
        </div>

        {/* Top Banner: Global Status */}
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900 text-white p-6 shadow-lg border border-zinc-800">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Server className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-green-400 uppercase tracking-wider">All Systems Operational</span>
              </div>
              <h2 className="text-3xl font-semibold">Engine v2.5.0</h2>
              <p className="text-zinc-400 mt-1">Local-First Orchestrator is running smoothly.</p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Uptime</div>
              <div className="text-xl font-mono">99.99%</div>
            </div>
          </div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Mock Resource Usage */}
          <Card className="col-span-1 md:col-span-2 p-6 border-zinc-200 hover:border-zinc-300 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-zinc-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" /> Resource Utilization
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-500 flex items-center"><Cpu className="w-4 h-4 mr-1.5"/> CPU</span>
                  <span className="font-mono font-medium text-zinc-900">12%</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-500 flex items-center"><HardDrive className="w-4 h-4 mr-1.5"/> Memory</span>
                  <span className="font-mono font-medium text-zinc-900">2.1 GB</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Scheduler Info */}
          <Card className="col-span-1 p-6 border-zinc-200 bg-gradient-to-br from-white to-zinc-50">
            <h3 className="text-base font-semibold text-zinc-900 flex items-center mb-4">
              <Clock className="w-5 h-5 mr-2 text-indigo-500" /> Background Tasks
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-zinc-100 shadow-sm">
                <span className="text-sm text-zinc-600">Scheduler</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-zinc-100 shadow-sm">
                <span className="text-sm text-zinc-600">Cron Jobs</span>
                <span className="text-sm font-mono text-zinc-900">0</span>
              </div>
            </div>
          </Card>

          {/* Database Info */}
          <Card className="col-span-1 md:col-span-2 p-6 border-zinc-200">
            <h3 className="text-base font-semibold text-zinc-900 flex items-center mb-6">
              <Database className="w-5 h-5 mr-2 text-emerald-500" /> Storage Architecture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Primary Database</div>
                <div className="text-sm font-medium text-zinc-900">SQLite (SQLAlchemy ORM)</div>
                <div className="mt-3 text-xs text-zinc-400 font-mono">./backend/data/workflow_engine.db</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Trace Logging</div>
                <div className="text-sm font-medium text-zinc-900">Line-Delimited JSON streams</div>
                <div className="mt-3 text-xs text-zinc-400 font-mono">./backend/logs/*.jsonl</div>
              </div>
            </div>
          </Card>

          {/* Security & Network */}
          <Card className="col-span-1 p-6 border-zinc-200">
            <h3 className="text-base font-semibold text-zinc-900 flex items-center mb-4">
              <Shield className="w-5 h-5 mr-2 text-rose-500" /> Security
            </h3>
            <div className="space-y-4">
              <div className="pt-2 border-t border-zinc-100">
                <div className="text-xs text-zinc-500 mb-1">Templating Engine</div>
                <div className="text-sm font-medium text-zinc-900">Jinja2 Sandboxed</div>
              </div>
              <div className="pt-2 border-t border-zinc-100">
                <div className="text-xs text-zinc-500 mb-1 flex items-center"><Network className="w-3 h-3 mr-1"/> API Endpoint</div>
                <div className="text-xs font-mono text-zinc-600 break-all">{import.meta.env.VITE_API_URL || "http://localhost:8000"}</div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
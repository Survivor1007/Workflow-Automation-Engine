import { useState } from 'react';

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper function to append text to our UI console
  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  const runWorkflowTest = async () => {
    setLoading(true);
    setLogs([]); // Clear previous logs
    const BASE_URL = "http://127.0.0.1:8000";

    try {
      addLog("⏳ 1. Creating new workflow pipeline...");
      const wfRes = await fetch(`${BASE_URL}/workflows/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Browser Generated Workflow", is_active: true }),
      });
      const wfData = await wfRes.json();
      const wfId = wfData.id;
      addLog(`✅ Workflow created with ID: ${wfId}`);

      addLog("⏳ 2. Pushing Webhook Trigger (Step 0)...");
      await fetch(`${BASE_URL}/workflows/${wfId}/steps/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step_order: 0,
          step_type: "TRIGGER",
          node_provider: "WEBHOOK",
          config_json: {}
        }),
      });

      addLog("⏳ 3. Pushing Text Formatter Action (Step 1)...");
      await fetch(`${BASE_URL}/workflows/${wfId}/steps/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step_order: 1,
          step_type: "ACTION",
          node_provider: "TEXT_FORMATTER",
          config_json: {
            text: "UI Alert: {{ trigger.body.user }} executed a pipeline from the browser!",
            transform: "uppercase"
          }
        }),
      });

      addLog("⏳ 4. Pushing Logger Action (Step 2)...");
      await fetch(`${BASE_URL}/workflows/${wfId}/steps/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step_order: 2,
          step_type: "ACTION",
          node_provider: "LOGGER",
          config_json: {
            level: "INFO",
            message: "Browser Output: {{ step_1.formatted_text }}",
            include_context: true
          }
        }),
      });

      addLog("🚀 5. Firing Webhook Payload...");
      const webhookRes = await fetch(`${BASE_URL}/webhook/${wfId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "Frontend Admin" }),
      });
      const webhookData = await webhookRes.json();
      
      addLog(`🎉 Server Response: ${JSON.stringify(webhookData)}`);
      addLog("✅ Success! Check your backend/logs/providers.jsonl file.");

    } catch (error) {
      addLog(`❌ Connection Error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6">
        
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Workflow Engine UI</h1>
          <p className="text-gray-500 text-sm mt-1">Minimal Dashboard for testing backend connectivity.</p>
        </div>

        <button 
          onClick={runWorkflowTest}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Executing Pipeline Sequence..." : "Run E2E Workflow Test"}
        </button>

        <div className="mt-8">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Execution Console</h2>
          <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-64 overflow-y-auto shadow-inner">
            {logs.length === 0 ? (
              <span className="text-gray-500">Waiting for execution...</span>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
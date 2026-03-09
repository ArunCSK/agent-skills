import { useState } from 'react';
import {
  Database,
  Play,
  Save,
  Settings,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  CloudLightning,
  RefreshCw,
  Fingerprint
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './index.css';

// Mock Data for Table (10 rows, 5 columns: ID, ProductName, Category, Price, Status)
const generateMockData = () => {
  return Array.from({ length: 10 }).map((_, idx) => ({
    id: `PRD-${1000 + idx}`,
    productName: ['Quantum Core', 'Aero Drive', 'Plasma Shield', 'Neural Chip', 'Grav Engine', 'Tachyon Sensor', 'Nova Reactor', 'Phase Emitter', 'Flux Capacitor', 'Ion Thruster'][idx],
    category: ['Electronics', 'Hardware', 'Defense', 'Components', 'Propulsion', 'Sensors', 'Energy', 'Weapons', 'TimeTravel', 'Engines'][idx],
    price: (Math.random() * 5000 + 100).toFixed(2),
    status: Math.random() > 0.3 ? 'VALID' : 'INVALID'
  }));
};

function App() {
  const [query, setQuery] = useState(`SELECT \n  product_id, \n  product_name, \n  category, \n  price\nFROM \n  sales_catalog.delta_table \nWHERE \n  price > 0 \n  AND category IS NOT NULL`);
  const [isDevMode, setIsDevMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'results'>('editor');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [ruleFormData, setRuleFormData] = useState({
    ruleGroupName: '',
    ruleName: '',
    targetTableName: '',
    targetKeyColumns: ''
  });

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleValidate = () => {
    setIsRunning(true);
    // Simulate Drools API call and processing time
    setTimeout(() => {
      setResults(generateMockData());
      setIsRunning(false);
      setActiveTab('results');
      displayToast('Validation complete. Evaluated 10 records.');
    }, 1200);
  };

  const handleOpenSaveModal = () => {
    if (!isDevMode) return;
    setShowSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
    setRuleFormData({ ruleGroupName: '', ruleName: '', targetTableName: '', targetKeyColumns: '' });
  };

  const handleSaveModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert logic to Excel
    const worksheet = XLSX.utils.json_to_sheet([
      {
        "Rule Type": "SQL Query",
        "Rule Group": ruleFormData.ruleGroupName,
        "Rule Name": ruleFormData.ruleName,
        "Target Table": ruleFormData.targetTableName,
        "Keys": ruleFormData.targetKeyColumns,
        "Logic": query
      },
      { "Rule Type": "BDQ validation", "Logic": "Run via Drools Engine" }
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Business Rules");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Simulate S3 Download Link
    saveAs(data, `${ruleFormData.ruleName || 'BDQ_Rules'}_Export.xlsx`);
    displayToast(`Rule '${ruleFormData.ruleName}' saved to Master Table & exported.`);
    handleCloseSaveModal();
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title-container">
          <CloudLightning size={28} className="header-icon" />
          <h1 className="header-title">Data Controls</h1>
        </div>

        <div className="dev-mode-toggle">
          <Settings size={18} />
          <span>Developer Enablement</span>
          <label className="switch" title="Toggle Developer Mode to enable Saving Rules">
            <input
              type="checkbox"
              checked={isDevMode}
              onChange={() => setIsDevMode(!isDevMode)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </header>

      <main className="main-content">
        <div className="card">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              SQL Editor
            </button>
            <button
              className={`tab ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              Validation Results {results && `(${results.length})`}
            </button>
          </div>

          {activeTab === 'editor' ? (
            <div className="tab-content" style={{ animation: 'fade-in 0.3s ease-out' }}>
              <div className="card-title">
                <Database size={20} />
                Databricks Delta Source Validation
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', marginTop: '-0.5rem' }}>
                Write your SQL formulation. On validation, this query is processed via Drools BDQ engine against 10 target records.
              </p>

              <textarea
                className="code-editor"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                spellCheck={false}
              />

              <div className="actions-row">
                <button
                  className={`btn btn-secondary ${!isDevMode ? 'disabled' : ''}`}
                  onClick={handleOpenSaveModal}
                  disabled={!isDevMode}
                  title={!isDevMode ? "Enable Dev Mode to Save" : "Save and Export to S3/Excel"}
                >
                  <Save size={18} />
                  Save Rules
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleValidate}
                  disabled={isRunning || !query.trim()}
                >
                  {isRunning ? (
                    <><RefreshCw size={18} className="spinner" /> Validating BDQ...</>
                  ) : (
                    <><Play size={18} /> Validate & Run</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="tab-content" style={{ animation: 'fade-in 0.3s ease-out' }}>
              <div className="card-title">
                <Fingerprint size={20} />
                Execution Results against Delta Table
              </div>

              {!results ? (
                <div className="empty-state">
                  <Database size={48} className="empty-icon" />
                  <h3>No Results Yet</h3>
                  <p>Run validation to see the BDQ evaluations.</p>
                  <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setActiveTab('editor')}>
                    Back to Editor
                  </button>
                </div>
              ) : (
                <>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Showing 10 analyzed records across 5 columns based on Drools processing.
                  </p>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Record ID</th>
                          <th>Product Name</th>
                          <th>Category</th>
                          <th>Price ($)</th>
                          <th>BDQ Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((row) => (
                          <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.productName}</td>
                            <td>{row.category}</td>
                            <td>{row.price}</td>
                            <td>
                              {row.status === 'VALID' ? (
                                <span className="status-badge status-valid">
                                  <CheckCircle size={12} /> Valid
                                </span>
                              ) : (
                                <span className="status-badge status-invalid">
                                  <AlertCircle size={12} /> Invalid
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="actions-row">
                    <button className="btn btn-secondary" onClick={() => setActiveTab('editor')}>
                      View Editor
                    </button>
                    {isDevMode && (
                      <button className="btn btn-success" onClick={handleOpenSaveModal}>
                        <FileSpreadsheet size={18} />
                        Save Rules & Export
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        <CheckCircle size={20} className="toast-icon" />
        <span>{toastMessage}</span>
      </div>

      {/* Save Rules Modal */}
      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <Save size={24} className="header-icon" />
              Save Rules to Master Table
            </div>
            <form onSubmit={handleSaveModalSubmit}>
              <div className="form-group">
                <label className="form-label">Rule Group Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={ruleFormData.ruleGroupName}
                  onChange={e => setRuleFormData({ ...ruleFormData, ruleGroupName: e.target.value })}
                  placeholder="e.g., Sales Validation"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rule Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={ruleFormData.ruleName}
                  onChange={e => setRuleFormData({ ...ruleFormData, ruleName: e.target.value })}
                  placeholder="e.g., Price Check"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Target Table Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={ruleFormData.targetTableName}
                  onChange={e => setRuleFormData({ ...ruleFormData, targetTableName: e.target.value })}
                  placeholder="e.g., sales_catalog.delta_table"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Target Table Key Columns</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={ruleFormData.targetKeyColumns}
                  onChange={e => setRuleFormData({ ...ruleFormData, targetKeyColumns: e.target.value })}
                  placeholder="e.g., product_id, region_id"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseSaveModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Export Excel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;

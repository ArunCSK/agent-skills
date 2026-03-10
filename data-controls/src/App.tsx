import { useState } from 'react';
import {
  Button,
  Card,
  Text,
  Switch,
  Input,
  FormField,
  FormFieldLabel,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  StackLayout,
  FlexLayout,
  GridLayout,
  Spinner,
  MultilineInput,
  Badge
} from '@salt-ds/core';

import {
  DatabaseIcon,
  PlayIcon,
  PlaySolidIcon,
  SaveIcon,
  SettingsIcon,
  ExportIcon,
  SearchIcon,
  SuccessSolidIcon,
  ErrorSolidIcon,
  DocumentIcon
} from '@salt-ds/icons';

import { saveAs } from 'file-saver';
import './index.css';

// Mock Data for Table
const generateMockData = () => {
  return Array.from({ length: 10 }).map((_, idx) => ({
    id: `PRD-${1000 + idx}`,
    productName: ['Quantum Core', 'Aero Drive', 'Plasma Shield', 'Neural Chip', 'Grav Engine', 'Tachyon Sensor', 'Nova Reactor', 'Phase Emitter', 'Flux Capacitor', 'Ion Thruster'][idx],
    category: ['Electronics', 'Hardware', 'Defense', 'Components', 'Propulsion', 'Sensors', 'Energy', 'Weapons', 'TimeTravel', 'Engines'][idx],
    price: (Math.random() * 5000 + 100).toFixed(2),
    status: Math.random() > 0.3 ? 'VALID' : 'INVALID'
  }));
};

type SavedRule = {
  id: string;
  ruleGroupName: string;
  ruleName: string;
  targetTableName: string;
  targetKeyColumns: string;
  query: string;
  status: 'Pending' | 'Enabled';
};

function App() {
  const [query, setQuery] = useState(`SELECT \n  product_id, \n  product_name, \n  category, \n  price\nFROM \n  sales_catalog.delta_table \nWHERE \n  price > 0 \n  AND category IS NOT NULL`);
  const [isDevMode, setIsDevMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [executionSummary, setExecutionSummary] = useState<{ time: string, evaluated: number, passed: number, failed: number } | null>(null);

  const [activeTab, setActiveTab] = useState<'editor' | 'results' | 'rules'>('editor');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [savedRules, setSavedRules] = useState<SavedRule[]>([]);

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
    const startTime = performance.now();

    setTimeout(() => {
      const execTime = performance.now() - startTime;
      const formattedTime = (execTime / 1000).toFixed(2);

      const data = generateMockData();
      const passed = data.filter(d => d.status === 'VALID').length;
      const failed = data.filter(d => d.status === 'INVALID').length;

      setResults(data);
      setExecutionSummary({ time: formattedTime, evaluated: 10, passed, failed });
      setIsRunning(false);
      setActiveTab('results');
      displayToast(`Validation complete in ${formattedTime}s.`);
    }, 1500 + Math.random() * 800);
  };

  const handleOpenSaveModal = () => {
    setShowSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
    setRuleFormData({ ruleGroupName: '', ruleName: '', targetTableName: '', targetKeyColumns: '' });
  };

  const handleSaveModalSubmit = () => {
    const newRule: SavedRule = {
      id: `rule-${Date.now()}`,
      ...ruleFormData,
      query,
      status: 'Pending'
    };

    setSavedRules([...savedRules, newRule]);
    displayToast(`Rule '${ruleFormData.ruleName}' saved successfully as Pending.`);
    handleCloseSaveModal();
    setActiveTab('rules');
  };

  const generateJobsYml = (rule: SavedRule) => {
    const safeName = rule.ruleName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const ymlContent = `# Databricks Asset Bundle / Jobs configuration
resources:
  jobs:
    ${safeName}_bdq_job:
      name: "${rule.ruleName} Business Data Quality"
      tasks:
        - task_key: "run_drools_validation"
          notebook_task:
            notebook_path: "/Workspace/BDQ/validation_engine"
            base_parameters:
              rule_group: "${rule.ruleGroupName}"
              target_table: "${rule.targetTableName}"
              query_logic: "${rule.query.replace(/\n/g, ' ')}"
`;
    const data = new Blob([ymlContent], { type: "text/yaml" });
    saveAs(data, `${safeName}_job.yml`);
  };

  const handleEnableRuleAndAttach = (id: string) => {
    setSavedRules(rules => rules.map(r => {
      if (r.id === id) {
        generateJobsYml(r);
        return { ...r, status: 'Enabled' };
      }
      return r;
    }));
    displayToast('Rule Enabled successfully! Databricks jobs.yml generated.');
  };

  const pendingCount = savedRules.filter(r => r.status === 'Pending').length;

  return (
    <StackLayout gap={3} className="app-container">
      {/* Header */}
      <Card variant="secondary" className="header-card">
        <FlexLayout justify="space-between" align="center">
          <FlexLayout align="center" gap={1}>
            <Text styleAs="h2" color="primary"><strong>JPMorganChase</strong> | Data Control</Text>
          </FlexLayout>

          <FlexLayout align="center" gap={1}>
            <SettingsIcon />
            <Text styleAs="label">Developer Enablement</Text>
            <Switch checked={isDevMode} onChange={(e: any) => setIsDevMode(e.target.checked)} title="Toggle Developer Mode" />
          </FlexLayout>
        </FlexLayout>
      </Card>

      {/* Main content */}
      <Card>
        <FlexLayout direction="column" gap={3}>
          <FlexLayout gap={1} align="center">
            <Button appearance="transparent" sentiment={activeTab === 'editor' ? 'accented' : 'neutral'} onClick={() => setActiveTab('editor')}>
              SQL Editor
            </Button>
            <Button appearance="transparent" sentiment={activeTab === 'results' ? 'accented' : 'neutral'} onClick={() => setActiveTab('results')}>
              Validation Results {results && `(${results.length})`}
            </Button>
            <Button appearance="transparent" sentiment={activeTab === 'rules' ? 'accented' : 'neutral'} onClick={() => setActiveTab('rules')} style={{ position: 'relative' }}>
              Rules Configuration
              {pendingCount > 0 && (
                <Badge value={pendingCount} color="red" style={{ position: 'absolute', top: -5, right: -15 }} />
              )}
            </Button>
          </FlexLayout>

          {activeTab === 'editor' && (
            <StackLayout gap={2}>
              <FlexLayout align="center" gap={1}>
                <DatabaseIcon />
                <Text styleAs="h3">Databricks Delta Source Validation</Text>
              </FlexLayout>
              <Text color="secondary" styleAs="label">
                Write your SQL formulation. On validation, this query is processed via Drools BDQ engine against 10 target records.
              </Text>

              <FormField>
                <div className="code-editor-container">
                  <MultilineInput
                    value={query}
                    onChange={(e: any) => setQuery(e.target.value)}
                    style={{ minHeight: 200, fontFamily: 'monospace' }}
                  />
                </div>
              </FormField>

              <FlexLayout justify="end" gap={1}>
                <Button appearance="bordered" sentiment="neutral" onClick={handleOpenSaveModal}>
                  <SaveIcon />
                  Save Rule
                </Button>
                <Button appearance="solid" sentiment="accented" onClick={handleValidate} disabled={isRunning || !query.trim()}>
                  {isRunning ? <Spinner size="small" /> : <PlayIcon />}
                  Validate & Run
                </Button>
              </FlexLayout>
            </StackLayout>
          )}

          {activeTab === 'results' && (
            <StackLayout gap={2}>
              <FlexLayout align="center" gap={1}>
                <SearchIcon />
                <Text styleAs="h3">Execution Results against Delta Table</Text>
              </FlexLayout>

              {!results ? (
                <FlexLayout direction="column" align="center" justify="center" gap={2} style={{ padding: '3rem' }}>
                  <DatabaseIcon size={2} />
                  <Text styleAs="h3">No Results Yet</Text>
                  <Text color="secondary">Run validation to see the BDQ evaluations.</Text>
                  <Button appearance="bordered" onClick={() => setActiveTab('editor')}>Back to Editor</Button>
                </FlexLayout>
              ) : (
                <StackLayout gap={2}>
                  {executionSummary && (
                    <GridLayout columns={4} gap={1}>
                      <Card variant="secondary">
                        <StackLayout gap={0.5}>
                          <Text styleAs="label" color="secondary">Total Execution Time</Text>
                          <Text styleAs="h2">{executionSummary.time} s</Text>
                        </StackLayout>
                      </Card>
                      <Card variant="secondary">
                        <StackLayout gap={0.5}>
                          <Text styleAs="label" color="secondary">Records Evaluated</Text>
                          <Text styleAs="h2">{executionSummary.evaluated}</Text>
                        </StackLayout>
                      </Card>
                      <Card variant="secondary" className="status-valid-bg">
                        <StackLayout gap={0.5}>
                          <Text styleAs="label" color="inherit">Validation Passed</Text>
                          <Text styleAs="h2" color="inherit">{executionSummary.passed}</Text>
                        </StackLayout>
                      </Card>
                      <Card variant="secondary" className="status-invalid-bg">
                        <StackLayout gap={0.5}>
                          <Text styleAs="label" color="inherit">Validation Failed</Text>
                          <Text styleAs="h2" color="inherit">{executionSummary.failed}</Text>
                        </StackLayout>
                      </Card>
                    </GridLayout>
                  )}

                  <Text color="secondary" styleAs="label">
                    Drools execution output for 10 limit rows against target table 5 column data.
                  </Text>

                  <div className="table-wrapper">
                    <table className="salt-table">
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
                                <FlexLayout align="center" gap={0.5} className="status-valid-text">
                                  <SuccessSolidIcon /> Valid
                                </FlexLayout>
                              ) : (
                                <FlexLayout align="center" gap={0.5} className="status-invalid-text">
                                  <ErrorSolidIcon /> Invalid
                                </FlexLayout>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <FlexLayout justify="end" gap={1}>
                    <Button appearance="bordered" onClick={() => setActiveTab('editor')}>View Editor</Button>
                    <Button appearance="solid" sentiment="accented" onClick={handleOpenSaveModal}>
                      <SaveIcon />
                      Save Rule
                    </Button>
                  </FlexLayout>
                </StackLayout>
              )}
            </StackLayout>
          )}

          {activeTab === 'rules' && (
            <StackLayout gap={2}>
              <FlexLayout align="center" gap={1}>
                <DocumentIcon />
                <Text styleAs="h3">Saved Rules Configuration</Text>
              </FlexLayout>
              <Text color="secondary" styleAs="label">
                Manage business data quality rules. Developers can enable them and generate Databricks job bindings.
              </Text>

              {savedRules.length === 0 ? (
                <FlexLayout direction="column" align="center" justify="center" gap={2} style={{ padding: '3rem' }}>
                  <DocumentIcon size={2} />
                  <Text styleAs="h3">No Rules Configured</Text>
                  <Text color="secondary">Save a rule from the SQL Editor to get started.</Text>
                </FlexLayout>
              ) : (
                <div className="table-wrapper">
                  <table className="salt-table">
                    <thead>
                      <tr>
                        <th>Rule Group</th>
                        <th>Rule Name</th>
                        <th>Target Table</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedRules.map((rule) => (
                        <tr key={rule.id}>
                          <td>{rule.ruleGroupName}</td>
                          <td>{rule.ruleName}</td>
                          <td><Text styleAs="label">{rule.targetTableName}</Text></td>
                          <td>
                            {rule.status === 'Enabled' ? (
                              <FlexLayout align="center" gap={0.5} className="status-valid-text">
                                <SuccessSolidIcon /> Enabled
                              </FlexLayout>
                            ) : (
                              <FlexLayout align="center" gap={0.5} style={{ color: 'var(--salt-color-orange-500)', fontWeight: 500 }}>
                                <ErrorSolidIcon /> Pending
                              </FlexLayout>
                            )}
                          </td>
                          <td>
                            <FlexLayout align="center" gap={1}>
                              {rule.status === 'Pending' && (
                                <Button
                                  appearance="bordered"
                                  sentiment="accented"
                                  disabled={!isDevMode}
                                  onClick={() => handleEnableRuleAndAttach(rule.id)}
                                  title={!isDevMode ? "Enable Developer Mode to Attach Rule" : "Attach rule to Databricks job"}
                                >
                                  <PlaySolidIcon /> Enable & Attach
                                </Button>
                              )}
                              {rule.status === 'Enabled' && (
                                <Button appearance="transparent" sentiment="neutral" onClick={() => generateJobsYml(rule)}>
                                  <ExportIcon /> Download jobs.yml
                                </Button>
                              )}
                            </FlexLayout>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </StackLayout>
          )}
        </FlexLayout>
      </Card>

      {/* Toast */}
      {showToast && (
        <Card className="app-toast" variant="secondary">
          <FlexLayout align="center" gap={1}>
            <SuccessSolidIcon />
            <Text>{toastMessage}</Text>
          </FlexLayout>
        </Card>
      )}

      {/* Save Rules Modal */}
      <Dialog open={showSaveModal}>
        <DialogHeader header="Save Rule Definition" />
        <DialogContent>
          <StackLayout gap={2}>
            <Text color="secondary" styleAs="label" style={{ marginBottom: '1rem' }}>
              Business users can save this rule as pending. A developer must later review and enable it to attach to the Databricks production jobs.
            </Text>
            <FormField>
              <FormFieldLabel>Rule Group Name</FormFieldLabel>
              <Input value={ruleFormData.ruleGroupName} onChange={(e: any) => setRuleFormData({ ...ruleFormData, ruleGroupName: e.target.value })} placeholder="e.g., Sales Validation" />
            </FormField>
            <FormField>
              <FormFieldLabel>Rule Name</FormFieldLabel>
              <Input value={ruleFormData.ruleName} onChange={(e: any) => setRuleFormData({ ...ruleFormData, ruleName: e.target.value })} placeholder="e.g., Price Check" />
            </FormField>
            <FormField>
              <FormFieldLabel>Target Table Name</FormFieldLabel>
              <Input value={ruleFormData.targetTableName} onChange={(e: any) => setRuleFormData({ ...ruleFormData, targetTableName: e.target.value })} placeholder="e.g., sales_catalog.delta_table" />
            </FormField>
            <FormField>
              <FormFieldLabel>Target Key Columns</FormFieldLabel>
              <Input value={ruleFormData.targetKeyColumns} onChange={(e: any) => setRuleFormData({ ...ruleFormData, targetKeyColumns: e.target.value })} placeholder="e.g., product_id, region_id" />
            </FormField>
          </StackLayout>
        </DialogContent>
        <DialogActions>
          <Button appearance="bordered" onClick={handleCloseSaveModal}>Cancel</Button>
          <Button appearance="solid" sentiment="accented" onClick={handleSaveModalSubmit}>Save as Pending</Button>
        </DialogActions>
      </Dialog>
    </StackLayout>
  );
}

export default App;

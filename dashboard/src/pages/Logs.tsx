import React, { useState, useEffect } from 'react';
import { service } from '../services';
import { CallLog } from '../services/api';
import LogsTable from '../components/LogsTable';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [modelFilter, setModelFilter] = useState('');

  const apiService = service();

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.getLogs(
        dateRange.from as string,
        dateRange.to as string,
        modelFilter || undefined
      );
      setLogs(result.items);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message || 'Unknown error'
          : 'Failed to fetch logs'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [dateRange.from, dateRange.to, modelFilter]);

  const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterChange = (filters: { model: string; apiKeyId: string }) => {
    setModelFilter(filters.model);
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          fontSize: '1.125rem',
          color: '#6c757d',
        }}
      >
        Loading logs...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '2rem',
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.75rem',
            fontWeight: '600',
            color: '#495057',
          }}
        >
          API Call Logs
        </h2>
      </div>

      {/* Date Range Filter */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef',
          marginBottom: '2rem',
        }}
      >
        <h3
          style={{
            margin: '0 0 1rem 0',
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#495057',
          }}
        >
          Date Range
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.25rem',
                color: '#495057',
              }}
            >
              From:
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={e => handleDateRangeChange('from', e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.25rem',
                color: '#495057',
              }}
            >
              To:
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={e => handleDateRangeChange('to', e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            />
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={fetchLogs}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <LogsTable items={logs} onFilterChange={handleFilterChange} />
    </div>
  );
};

export default Logs;

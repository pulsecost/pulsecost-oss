import React from 'react';
import { CallLog } from '../services/api';
import {
  formatDateTime,
  formatCurrency,
  formatNumber,
} from '../services/format';

interface LogsTableProps {
  items: CallLog[];
  onFilterChange?: (filters: { model: string; apiKeyId: string }) => void;
}

const LogsTable: React.FC<LogsTableProps> = ({ items, onFilterChange }) => {
  const [modelFilter, setModelFilter] = React.useState('');
  const [apiKeyIdFilter, setApiKeyIdFilter] = React.useState('');

  const handleModelFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setModelFilter(value);
    onFilterChange?.({ model: value, apiKeyId: apiKeyIdFilter });
  };

  const handleApiKeyIdFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setApiKeyIdFilter(value);
    onFilterChange?.({ model: modelFilter, apiKeyId: value });
  };

  const filteredItems = items.filter(
    item =>
      item.model.toLowerCase().includes(modelFilter.toLowerCase()) &&
      (!apiKeyIdFilter ||
        (item.api_key_id && item.api_key_id.includes(apiKeyIdFilter)))
  );

  return (
    <div>
      <div
        style={{
          marginBottom: '1rem',
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
            Filter by Model:
          </label>
          <input
            type="text"
            value={modelFilter}
            onChange={handleModelFilterChange}
            placeholder="e.g., gpt-4, gpt-3.5-turbo"
            style={{
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.875rem',
              width: '200px',
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
            Filter by API Key ID:
          </label>
          <input
            type="text"
            value={apiKeyIdFilter}
            onChange={handleApiKeyIdFilterChange}
            placeholder="e.g., abc123..."
            style={{
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.875rem',
              width: '200px',
            }}
          />
        </div>
        <div
          style={{
            fontSize: '0.875rem',
            color: '#6c757d',
          }}
        >
          Showing {filteredItems.length} of {items.length} logs
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#495057',
                  borderBottom: '1px solid #dee2e6',
                }}
              >
                Time
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#495057',
                  borderBottom: '1px solid #dee2e6',
                }}
              >
                Model
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#495057',
                  borderBottom: '1px solid #dee2e6',
                }}
              >
                API Key ID
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'right',
                  fontWeight: '600',
                  color: '#495057',
                  borderBottom: '1px solid #dee2e6',
                }}
              >
                Tokens
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'right',
                  fontWeight: '600',
                  color: '#495057',
                  borderBottom: '1px solid #dee2e6',
                }}
              >
                Cost
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#495057',
                  borderBottom: '1px solid #dee2e6',
                }}
              >
                Cache Hit
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'right',
                  fontWeight: '600',
                  color: '#495057',
                  borderBottom: '1px solid #dee2e6',
                }}
              >
                Latency
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(log => (
              <tr
                key={log.id}
                style={{
                  borderBottom: '1px solid #f1f3f4',
                }}
              >
                <td
                  style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#495057',
                  }}
                >
                  {formatDateTime(log.ts)}
                </td>
                <td
                  style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#495057',
                  }}
                >
                  {log.model}
                </td>
                <td
                  style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#495057',
                    fontFamily: 'monospace',
                  }}
                >
                  {log.api_key_id
                    ? log.api_key_id.substring(0, 8) + '...'
                    : '-'}
                </td>
                <td
                  style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#495057',
                    textAlign: 'right',
                  }}
                >
                  {log.prompt_tokens && log.completion_tokens ? (
                    <span>
                      {formatNumber(log.prompt_tokens)} +{' '}
                      {formatNumber(log.completion_tokens)} ={' '}
                      {formatNumber(log.total_tokens || 0)}
                    </span>
                  ) : (
                    formatNumber(log.total_tokens || 0)
                  )}
                </td>
                <td
                  style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#495057',
                    textAlign: 'right',
                  }}
                >
                  {log.cost ? formatCurrency(log.cost) : '-'}
                </td>
                <td
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: log.cache_hit ? '#d4edda' : '#f8d7da',
                      color: log.cache_hit ? '#155724' : '#721c24',
                    }}
                  >
                    {log.cache_hit ? 'Yes' : 'No'}
                  </span>
                </td>
                <td
                  style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#495057',
                    textAlign: 'right',
                  }}
                >
                  {log.latency_ms ? `${log.latency_ms}ms` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsTable;

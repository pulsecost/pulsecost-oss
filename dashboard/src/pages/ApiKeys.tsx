import React, { useState, useEffect } from 'react';
import { service } from '../services';
import { ApiKey, ApiKeyUsage } from '../services/api';
import { formatCurrency, formatNumber } from '../services/format';
import UsageByKeyChart from '../components/UsageByKeyChart';

const ApiKeys: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<ApiKeyUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiService = service();

  const getDateRange = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    return {
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0],
    };
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { from, to } = getDateRange(30);
      const [keysData, usageData] = await Promise.all([
        apiService.getApiKeys(),
        apiService.getApiKeyUsage(from as string, to as string),
      ]);
      setApiKeys(keysData);
      setUsage(usageData);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message || 'Unknown error'
          : 'Failed to fetch data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUsageForKey = (keyId: string) => {
    return usage.find(u => u.api_key_id === keyId);
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          fontSize: '16px',
          color: '#6B7280',
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: '#FEF2F2',
          color: '#DC2626',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #FECACA',
          fontSize: '14px',
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '32px',
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1F2937',
            margin: 0,
          }}
        >
          API Key Management
        </h1>
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: '#F3F4F6',
            color: '#6B7280',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Auto-created on successful AI calls
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Total Keys
          </h3>
          <div
            style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937' }}
          >
            {apiKeys.length}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Active Keys
          </h3>
          <div
            style={{ fontSize: '32px', fontWeight: '700', color: '#10B981' }}
          >
            {apiKeys.filter(k => k.is_active).length}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Total Usage (30 days)
          </h3>
          <div
            style={{ fontSize: '32px', fontWeight: '700', color: '#3B82F6' }}
          >
            {usage.reduce((sum, u) => sum + u.total_tokens, 0).toLocaleString()}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Total Cost (30 days)
          </h3>
          <div
            style={{ fontSize: '32px', fontWeight: '700', color: '#8B5CF6' }}
          >
            {formatCurrency(usage.reduce((sum, u) => sum + u.total_cost, 0))}
          </div>
        </div>
      </div>

      {/* Usage by Key Chart */}
      {usage.length > 0 && (
        <div
          style={{
            marginBottom: '32px',
          }}
        >
          <UsageByKeyChart usage={usage} />
        </div>
      )}

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            API Keys (Read-Only)
          </h3>
          <p
            style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6B7280' }}
          >
            Keys are automatically created when AI model calls succeed
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB' }}>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Key Prefix
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Created
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Last Used
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Usage (30d)
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Cost (30d)
                </th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map(key => {
                const keyUsage = getUsageForKey(key.id);
                return (
                  <tr
                    key={key.id}
                    style={{ borderBottom: '1px solid #E5E7EB' }}
                  >
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {key.key_prefix}...
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      {key.description || '-'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: key.is_active
                            ? '#D1FAE5'
                            : '#FEE2E2',
                          color: key.is_active ? '#065F46' : '#991B1B',
                        }}
                      >
                        {key.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      {key.last_used
                        ? new Date(key.last_used).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      {keyUsage ? formatNumber(keyUsage.total_tokens) : '0'}{' '}
                      tokens
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      {keyUsage
                        ? formatCurrency(keyUsage.total_cost)
                        : formatCurrency(0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApiKeys;

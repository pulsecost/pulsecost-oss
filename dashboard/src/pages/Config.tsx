import React, { useState, useEffect } from 'react';
import { service } from '../services';
import { SettingsView } from '../services/api';

const Config: React.FC = () => {
  const [config, setConfig] = useState<SettingsView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiService = service();

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.getConfig();
      setConfig(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch configuration'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

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
        Loading configuration...
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

  if (!config) {
    return (
      <div
        style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
        }}
      >
        No configuration data available
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
          Configuration
        </h2>
        <button
          onClick={fetchConfig}
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

      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          <div>
            <h3
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#495057',
              }}
            >
              Database Configuration
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    color: '#6c757d',
                  }}
                >
                  Database Driver:
                </label>
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#495057',
                    textTransform: 'capitalize',
                  }}
                >
                  {config.db_driver}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#495057',
              }}
            >
              Cache Configuration
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    color: '#6c757d',
                  }}
                >
                  TTL (Time To Live):
                </label>
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#495057',
                  }}
                >
                  {config.ttl_secs ? `${config.ttl_secs} seconds` : 'Not set'}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#495057',
              }}
            >
              API Configuration
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    color: '#6c757d',
                  }}
                >
                  OpenAI Base URL:
                </label>
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#495057',
                    wordBreak: 'break-all',
                  }}
                >
                  {config.openai_base || 'Not set'}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#495057',
              }}
            >
              System Information
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    color: '#6c757d',
                  }}
                >
                  Version:
                </label>
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#495057',
                  }}
                >
                  {config.version || 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Config;

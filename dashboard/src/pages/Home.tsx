import React, { useState, useEffect } from 'react';
import { service } from '../services';
import { ReportDaily, ApiKeyUsage, ApiKeyReport } from '../services/api';
import KPI from '../components/KPI';
import { UsageChart } from '../components/Charts';
import { ApiKeyUsageChart, ApiKeyTrendChart } from '../components/ApiKeyCharts';
import {
  ModelDistributionChart,
  CostEfficiencyChart,
  ApiKeyPerformanceChart,
  LatencyTrendChart,
} from '../components/AdvancedCharts';
import UsageByKeyChart from '../components/UsageByKeyChart';

const Home: React.FC = () => {
  const [data, setData] = useState<ReportDaily[]>([]);
  const [apiKeyUsage, setApiKeyUsage] = useState<ApiKeyUsage[]>([]);
  const [apiKeyReports, setApiKeyReports] = useState<ApiKeyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7' | '30'>('7');
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
      const { from, to } = getDateRange(parseInt(dateRange));
      const [dailyResult, usageResult, reportsResult] = await Promise.all([
        apiService.getDailyReport(from as string, to as string),
        apiService.getApiKeyUsage(from as string, to as string),
        apiService.getApiKeyDailyReports(from as string, to as string),
      ]);
      setData(dailyResult.days);
      setApiKeyUsage(usageResult);
      setApiKeyReports(reportsResult);
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
  }, [dateRange]);

  const calculateTotals = () => {
    const totalTokens = data.reduce((sum, day) => sum + day.total_tokens, 0);
    const totalCost = data.reduce((sum, day) => sum + day.cost, 0);

    return { totalTokens, totalCost };
  };

  const { totalTokens, totalCost } = calculateTotals();

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
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        padding: '0',
        margin: '0',
      }}
    >
      {/* Date Range Filter */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '32px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setDateRange('7')}
            style={{
              padding: '10px 20px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              backgroundColor: dateRange === '7' ? '#3B82F6' : '#F9FAFB',
              color: dateRange === '7' ? '#F8FAFC' : '#6B7280',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              fontWeight: '500',
              boxShadow:
                dateRange === '7'
                  ? '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                  : 'none',
            }}
            onMouseEnter={e => {
              if (dateRange !== '7') {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.borderColor = '#9CA3AF';
              }
            }}
            onMouseLeave={e => {
              if (dateRange !== '7') {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.borderColor = '#D1D5DB';
              }
            }}
          >
            Last 7 days
          </button>
          <button
            onClick={() => setDateRange('30')}
            style={{
              padding: '10px 20px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              backgroundColor: dateRange === '30' ? '#3B82F6' : '#F9FAFB',
              color: dateRange === '30' ? '#F8FAFC' : '#6B7280',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              fontWeight: '500',
              boxShadow:
                dateRange === '30'
                  ? '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                  : 'none',
            }}
            onMouseEnter={e => {
              if (dateRange !== '30') {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.borderColor = '#9CA3AF';
              }
            }}
            onMouseLeave={e => {
              if (dateRange !== '30') {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.borderColor = '#D1D5DB';
              }
            }}
          >
            Last 30 days
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 2,
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <KPI
          label="Total Tokens"
          value={totalTokens}
          subtext={`Over ${dateRange} days`}
          type="number"
        />
        <KPI
          label="Total Cost"
          value={totalCost}
          subtext={`Over ${dateRange} days`}
          type="currency"
        />
        <KPI
          label="Average Daily"
          value={Math.round(totalTokens / parseInt(dateRange))}
          subtext="Tokens per day"
          type="number"
        />
        <KPI
          label="Cost Efficiency"
          value={(totalCost / totalTokens) * 1000}
          subtext="Cost per 1K tokens"
          type="currency"
        />
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 2,
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <UsageChart data={data} />
        <div
          style={{
            background: '#FFFFFF',
            padding: '24px',
            borderRadius: '16px',
            border: `1px solid ${'#E5E7EB'}`,
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <h3
            style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
            }}
          >
            Recent Activity
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {data.slice(-5).map((day, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1F2937',
                    }}
                  >
                    {new Date(day.date).toLocaleDateString()}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6B7280',
                    }}
                  >
                    {day.total_tokens.toLocaleString()} tokens
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#059669',
                  }}
                >
                  ${day.cost.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Key Analytics */}
      {apiKeyUsage.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
            position: 'relative',
            zIndex: 2,
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          <ApiKeyUsageChart usage={apiKeyUsage} />
          {apiKeyReports.length > 0 && (
            <ApiKeyTrendChart reports={apiKeyReports} />
          )}
        </div>
      )}

      {/* Usage by Key Chart */}
      {apiKeyUsage.length > 0 && (
        <div
          style={{
            marginBottom: '40px',
            position: 'relative',
            zIndex: 2,
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          <UsageByKeyChart usage={apiKeyUsage} />
        </div>
      )}

      {/* Advanced Analytics Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 2,
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <ModelDistributionChart data={data} />
        <CostEfficiencyChart data={data} />
        {apiKeyUsage.length > 0 && (
          <ApiKeyPerformanceChart usage={apiKeyUsage} />
        )}
        <LatencyTrendChart data={data} />
      </div>

      {/* Additional Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          position: 'relative',
          zIndex: 2,
          maxWidth: '100%',
          overflow: 'hidden',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            padding: '24px',
            borderRadius: '16px',
            border: `1px solid ${'#E5E7EB'}`,
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
            }}
          >
            Top Models
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280', fontSize: '14px' }}>GPT-4</span>
              <span
                style={{
                  color: '#1F2937',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                45%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280', fontSize: '14px' }}>
                GPT-3.5
              </span>
              <span
                style={{
                  color: '#1F2937',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                35%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280', fontSize: '14px' }}>Claude</span>
              <span
                style={{
                  color: '#1F2937',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                20%
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            padding: '24px',
            borderRadius: '16px',
            border: `1px solid ${'#E5E7EB'}`,
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
            }}
          >
            Cost Trends
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280', fontSize: '14px' }}>
                This Week
              </span>
              <span
                style={{
                  color: '#10B981',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                -12%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280', fontSize: '14px' }}>
                This Month
              </span>
              <span
                style={{
                  color: '#10B981',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                -8%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280', fontSize: '14px' }}>
                This Quarter
              </span>
              <span
                style={{
                  color: '#EF4444',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                +5%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

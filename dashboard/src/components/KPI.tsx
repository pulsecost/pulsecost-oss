import React from 'react';
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from '../services/format';

interface KPIProps {
  label: string;
  value: number | string;
  subtext?: string;
  type?: 'currency' | 'number' | 'percentage';
}

const KPI: React.FC<KPIProps> = ({
  label,
  value,
  subtext,
  type = 'number',
}) => {
  const formatValue = () => {
    if (typeof value === 'string') return value;

    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'number':
      default:
        return formatNumber(value);
    }
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        transition: 'all 0.3s ease',
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        zIndex: 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow =
          '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.borderColor = '#3B82F6';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow =
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.borderColor = '#E5E7EB';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            color: '#6B7280',
            fontWeight: '500',
          }}
        >
          {label}
        </div>
      </div>

      <div
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '8px',
          lineHeight: 1,
        }}
      >
        {formatValue()}
      </div>

      {subtext && (
        <div
          style={{
            fontSize: '12px',
            color: '#9CA3AF',
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};

export default KPI;

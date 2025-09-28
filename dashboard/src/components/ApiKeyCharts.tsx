import React, { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { ApiKeyUsage, ApiKeyReport } from '../services/api';

const ApiKeyUsageChart: React.FC<{ usage: ApiKeyUsage[] }> = ({ usage }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<am5xy.XYChart | null>(null);

  useEffect(() => {
    if (!usage.length || !chartRef.current) return;

    if (chartRef2.current) {
      chartRef2.current.dispose();
    }
    chartRef.current.innerHTML = '';

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        paddingLeft: 0,
        paddingRight: 1,
        width: am5.percent(100),
        height: am5.percent(100),
        background: am5.Rectangle.new(root, {
          fill: am5.color('#FFFFFF'),
        }),
      })
    );

    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'key_prefix',
        renderer: am5xy.AxisRendererX.new(root, {
          pan: 'zoom',
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
          stroke: am5.color('#E5E7EB'),
          strokeOpacity: 0.5,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          pan: 'zoom',
          stroke: am5.color('#E5E7EB'),
          strokeOpacity: 0.5,
        }),
      })
    );

    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    );

    const tokensSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Tokens',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'tokens',
        categoryXField: 'key_prefix',
        stroke: am5.color('#3B82F6'),
        fill: am5.color('#3B82F6'),
        tooltip: am5.Tooltip.new(root, {
          labelText: 'Tokens: {valueY}',
          background: am5.Rectangle.new(root, {
            fill: am5.color('#FFFFFF'),
            stroke: am5.color('#E5E7EB'),
            strokeWidth: 1,
          }),
        }),
      })
    );

    const costSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Cost',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'cost',
        categoryXField: 'key_prefix',
        stroke: am5.color('#06B6D4'),
        fill: am5.color('#06B6D4'),
        tooltip: am5.Tooltip.new(root, {
          labelText: 'Cost: ${valueY}',
          background: am5.Rectangle.new(root, {
            fill: am5.color('#FFFFFF'),
            stroke: am5.color('#E5E7EB'),
            strokeWidth: 1,
          }),
        }),
      })
    );

    const chartData = usage.map(u => ({
      key_prefix: u.key_prefix,
      tokens: u.total_tokens,
      cost: u.total_cost,
    }));

    xAxis.data.setAll(chartData);
    tokensSeries.data.setAll(chartData);
    costSeries.data.setAll(chartData);

    chartRef2.current = chart;

    return () => {
      if (chartRef2.current) {
        chartRef2.current.dispose();
      }
    };
  }, [usage]);

  return (
    <div
      style={{
        background: '#FFFFFF',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'visible',
        height: '400px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#1F2937',
          }}
        >
          API Key Usage
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontSize: '12px',
            color: '#6B7280',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#3B82F6',
                borderRadius: '2px',
              }}
            />
            Tokens
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#06B6D4',
                borderRadius: '2px',
              }}
            />
            Cost
          </div>
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: '300px',
          flex: 1,
          minHeight: '300px',
          position: 'relative',
        }}
      >
        <div
          ref={chartRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '300px',
            position: 'relative',
          }}
        />
      </div>
    </div>
  );
};

const ApiKeyTrendChart: React.FC<{ reports: ApiKeyReport[] }> = ({
  reports,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<am5xy.XYChart | null>(null);

  useEffect(() => {
    if (!reports.length || !chartRef.current) return;

    if (chartRef2.current) {
      chartRef2.current.dispose();
    }
    chartRef.current.innerHTML = '';

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        paddingLeft: 0,
        paddingRight: 1,
        width: am5.percent(100),
        height: am5.percent(100),
        background: am5.Rectangle.new(root, {
          fill: am5.color('#FFFFFF'),
        }),
      })
    );

    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);

    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.3,
        baseInterval: {
          timeUnit: 'day',
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {
          pan: 'zoom',
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
          stroke: am5.color('#E5E7EB'),
          strokeOpacity: 0.5,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          pan: 'zoom',
          stroke: am5.color('#E5E7EB'),
          strokeOpacity: 0.5,
        }),
      })
    );

    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    );

    const chartData = reports.map(r => ({
      date: new Date(r.date).getTime(),
      tokens: r.total_tokens,
      cost: r.cost,
    }));

    const tokensSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Tokens',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'tokens',
        valueXField: 'date',
        stroke: am5.color('#3B82F6'),
        tooltip: am5.Tooltip.new(root, {
          labelText: 'Tokens: {valueY}',
          background: am5.Rectangle.new(root, {
            fill: am5.color('#FFFFFF'),
            stroke: am5.color('#E5E7EB'),
            strokeWidth: 1,
          }),
        }),
      })
    );
    tokensSeries.strokes.template.setAll({
      strokeWidth: 3,
    });

    const costSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Cost',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'cost',
        valueXField: 'date',
        stroke: am5.color('#06B6D4'),
        tooltip: am5.Tooltip.new(root, {
          labelText: 'Cost: ${valueY}',
          background: am5.Rectangle.new(root, {
            fill: am5.color('#FFFFFF'),
            stroke: am5.color('#E5E7EB'),
            strokeWidth: 1,
          }),
        }),
      })
    );
    costSeries.strokes.template.setAll({
      strokeWidth: 3,
    });

    tokensSeries.data.setAll(chartData);
    costSeries.data.setAll(chartData);

    chartRef2.current = chart;

    return () => {
      if (chartRef2.current) {
        chartRef2.current.dispose();
      }
    };
  }, [reports]);

  return (
    <div
      style={{
        background: '#FFFFFF',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'visible',
        height: '400px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#1F2937',
          }}
        >
          Usage Trends
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontSize: '12px',
            color: '#6B7280',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '10px',
                height: '3px',
                backgroundColor: '#3B82F6',
                borderRadius: '2px',
              }}
            />
            Tokens
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '10px',
                height: '3px',
                backgroundColor: '#06B6D4',
                borderRadius: '2px',
              }}
            />
            Cost
          </div>
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: '300px',
          flex: 1,
          minHeight: '300px',
          position: 'relative',
        }}
      >
        <div
          ref={chartRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '300px',
            position: 'relative',
          }}
        />
      </div>
    </div>
  );
};

export { ApiKeyUsageChart, ApiKeyTrendChart };

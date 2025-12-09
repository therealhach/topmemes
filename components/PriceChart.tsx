'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries, AreaSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, CandlestickData as LWCandlestickData, LineData, Time } from 'lightweight-charts';
import { fetchOHLCData, fetchMarketChart, TimeFrame as CGTimeFrame, CandlestickData } from '@/lib/coingecko';

interface PriceChartProps {
  tokenAddress: string;
  chain: string;
  tokenSymbol?: string;
  tokenLogoUrl?: string;
  className?: string;
}

type ChartType = 'candlestick' | 'line';

// CoinGecko timeframe options (in days)
const timeframeOptions: { value: CGTimeFrame; label: string }[] = [
  { value: '1', label: '1D' },
  { value: '7', label: '1W' },
  { value: '30', label: '1M' },
  { value: '90', label: '3M' },
  { value: '365', label: '1Y' },
];

// Extract color from image via API (avoids CORS)
const extractColorFromImage = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(`/api/extract-color?url=${encodeURIComponent(imageUrl)}`);
    const data = await response.json();
    return data.color || '#f59e0b';
  } catch {
    return '#f59e0b';
  }
};

export default function PriceChart({
  tokenAddress,
  chain,
  tokenSymbol = 'Token',
  tokenLogoUrl,
  className = '',
}: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Line'> | ISeriesApi<'Area'> | null>(null);

  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeframe, setTimeframe] = useState<CGTimeFrame>('30');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<{ value: number; percentage: number } | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [chartColor, setChartColor] = useState<string | null>(null);
  const [colorLoaded, setColorLoaded] = useState(false);
  const [useDexScreener, setUseDexScreener] = useState(false);

  // Extract color from token logo - do this FIRST before loading chart data
  useEffect(() => {
    setColorLoaded(false);
    if (tokenLogoUrl) {
      extractColorFromImage(tokenLogoUrl).then((color) => {
        setChartColor(color);
        setColorLoaded(true);
      });
    } else {
      setChartColor('#f59e0b');
      setColorLoaded(true);
    }
  }, [tokenLogoUrl]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#6b7280',
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: {
          color: 'rgba(107, 114, 128, 0.1)',
          style: 1,
        },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          visible: false,
        },
        horzLine: {
          visible: false,
        },
      },
      rightPriceScale: {
        visible: true,
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        autoScale: true,
      },
      localization: {
        priceFormatter: (price: number) => {
          if (price === 0) return '$0';
          if (price < 0.00000001) return `$${price.toFixed(10)}`;
          if (price < 0.0000001) return `$${price.toFixed(9)}`;
          if (price < 0.000001) return `$${price.toFixed(8)}`;
          if (price < 0.00001) return `$${price.toFixed(7)}`;
          if (price < 0.0001) return `$${price.toFixed(6)}`;
          if (price < 0.001) return `$${price.toFixed(5)}`;
          if (price < 0.01) return `$${price.toFixed(4)}`;
          if (price < 1) return `$${price.toFixed(3)}`;
          return `$${price.toFixed(2)}`;
        },
      },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        visible: true,
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
    });

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  // Load data and update chart
  useEffect(() => {
    const loadData = async () => {
      // Wait for color to be loaded before rendering chart
      if (!chartRef.current || !colorLoaded || !chartColor) return;

      setIsLoading(true);
      setError(null);
      setUseDexScreener(false);

      try {
        // Remove existing series
        if (seriesRef.current) {
          chartRef.current.removeSeries(seriesRef.current);
          seriesRef.current = null;
        }

        if (chartType === 'candlestick') {
          const data = await fetchOHLCData(tokenAddress, chain, timeframe);

          if (data.length === 0) {
            setError('No price data available');
            setUseDexScreener(true);
            setIsLoading(false);
            return;
          }

          // Calculate appropriate precision based on price
          const minPrice = Math.min(...data.map(d => Math.min(d.open, d.close, d.low)));
          let precision = 2;
          if (minPrice < 0.00000001) precision = 10;
          else if (minPrice < 0.0000001) precision = 9;
          else if (minPrice < 0.000001) precision = 8;
          else if (minPrice < 0.00001) precision = 7;
          else if (minPrice < 0.0001) precision = 6;
          else if (minPrice < 0.001) precision = 5;
          else if (minPrice < 0.01) precision = 4;
          else if (minPrice < 1) precision = 3;

          const candlestickSeries = chartRef.current.addSeries(CandlestickSeries, {
            upColor: '#10b981',
            downColor: '#ef4444',
            borderUpColor: '#10b981',
            borderDownColor: '#ef4444',
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
            priceFormat: {
              type: 'price',
              precision: precision,
              minMove: Math.pow(10, -precision),
            },
          });

          const chartData: LWCandlestickData<Time>[] = data.map((d: CandlestickData) => ({
            time: d.time as Time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }));

          candlestickSeries.setData(chartData);
          seriesRef.current = candlestickSeries;

          // Calculate price change
          if (data.length >= 2) {
            const firstPrice = data[0].open;
            const lastPrice = data[data.length - 1].close;
            const change = lastPrice - firstPrice;
            const percentage = ((lastPrice - firstPrice) / firstPrice) * 100;
            setPriceChange({ value: change, percentage });
            setCurrentPrice(lastPrice);
          }
        } else {
          const data = await fetchMarketChart(tokenAddress, chain, timeframe);

          if (data.length === 0) {
            setError('No price data available');
            setUseDexScreener(true);
            setIsLoading(false);
            return;
          }

          // Determine line color based on price change
          const firstPrice = data[0].value;
          const lastPrice = data[data.length - 1].value;
          const isPositive = lastPrice >= firstPrice;
          const lineColor = chartColor; // Dynamic color from token logo

          // Calculate appropriate precision based on price
          const minPrice = Math.min(...data.map(d => d.value));
          let precision = 2;
          if (minPrice < 0.00000001) precision = 10;
          else if (minPrice < 0.0000001) precision = 9;
          else if (minPrice < 0.000001) precision = 8;
          else if (minPrice < 0.00001) precision = 7;
          else if (minPrice < 0.0001) precision = 6;
          else if (minPrice < 0.001) precision = 5;
          else if (minPrice < 0.01) precision = 4;
          else if (minPrice < 1) precision = 3;

          const lineSeries = chartRef.current.addSeries(LineSeries, {
            color: lineColor,
            lineWidth: 2,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 5,
            crosshairMarkerBackgroundColor: lineColor,
            crosshairMarkerBorderColor: '#ffffff',
            crosshairMarkerBorderWidth: 2,
            lastValueVisible: true,
            priceLineVisible: true,
            priceLineWidth: 1,
            priceLineColor: lineColor,
            priceLineStyle: 2,
            priceFormat: {
              type: 'price',
              precision: precision,
              minMove: Math.pow(10, -precision),
            },
          });

          const chartData: LineData<Time>[] = data.map((d) => ({
            time: d.time as Time,
            value: d.value,
          }));

          lineSeries.setData(chartData);
          seriesRef.current = lineSeries;

          // Calculate price change
          if (data.length >= 2) {
            const change = lastPrice - firstPrice;
            const percentage = ((lastPrice - firstPrice) / firstPrice) * 100;
            setPriceChange({ value: change, percentage });
            setCurrentPrice(lastPrice);
          }
        }

        // Fit all content and add some padding
        chartRef.current.timeScale().fitContent();
        chartRef.current.timeScale().scrollToPosition(0, false);
      } catch (err) {
        console.error('Error loading chart data:', err);
        setError('Failed to load chart data');
      }

      setIsLoading(false);
    };

    loadData();
  }, [tokenAddress, chain, timeframe, chartType, colorLoaded, chartColor]);

  const formatPrice = (price: number): string => {
    if (price < 0.000001) return `$${price.toFixed(8)}`;
    if (price < 0.0001) return `$${price.toFixed(6)}`;
    if (price < 0.01) return `$${price.toFixed(4)}`;
    if (price < 1) return `$${price.toFixed(3)}`;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Price Display */}
      <div className="mb-3 px-1">
        {currentPrice && (
          <div className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            {formatPrice(currentPrice)}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: chartColor || '#f59e0b' }}></span>
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: chartColor || '#f59e0b' }}></span>
            </span>
          </div>
        )}
        {priceChange && (
          <div className={`text-sm font-medium ${
            priceChange.percentage >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {priceChange.percentage >= 0 ? '↑' : '↓'} {priceChange.value >= 0 ? '+' : ''}{formatPrice(Math.abs(priceChange.value))} ({priceChange.percentage >= 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%)
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="relative flex-1 min-h-[200px] rounded-lg overflow-hidden">
        {/* DexScreener Fallback */}
        {useDexScreener && !isLoading ? (
          <div className="w-full h-full" style={{ position: 'relative', paddingBottom: '65%' }}>
            <iframe
              src={`https://dexscreener.com/${chain}/${tokenAddress}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15`}
              style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 0 }}
              title="DexScreener Chart"
            />
          </div>
        ) : (
          <>
            <div ref={chartContainerRef} className="w-full h-full" />

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gray-400">Loading chart...</span>
                </div>
              </div>
            )}

            {/* Error Overlay - only show if not using DexScreener */}
            {error && !isLoading && !useDexScreener && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-500">{error}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Chart Controls - hide when using DexScreener */}
      {!useDexScreener && (
        <div className="flex items-center justify-end mt-3 px-1">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1">
            {timeframeOptions.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  timeframe === tf.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

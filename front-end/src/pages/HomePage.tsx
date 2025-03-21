import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import bitcoinIcon from '../assets/icons/coins/bitcoin.svg';
import ethereumIcon from '../assets/icons/coins/ethereum.svg';
import binanceIcon from '../assets/icons/coins/binance.svg';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  icon: string;
}

interface ForexData {
  code: string;
  rate: number;
  name: string;
}

interface HistoricalRate {
  date: string;
  rate: number;
}

const COMMON_CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'VND', name: 'Vietnamese Dong' },
];

const TIME_RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
];

const CHART_TYPES = [
  { label: 'Line', value: 'line' },
  { label: 'Bar', value: 'bar' },
  { label: 'Area', value: 'area' },
] as const;

type ChartType = typeof CHART_TYPES[number]['value'];

const HomePage = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [fromCoin, setFromCoin] = useState<string>('bitcoin');
  const [toCoin, setToCoin] = useState<string>('ethereum');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  
  // Forex states
  const [forexRates, setForexRates] = useState<ForexData[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [forexAmount, setForexAmount] = useState<string>('1');
  const [convertedForex, setConvertedForex] = useState<number>(0);
  const [historicalRates, setHistoricalRates] = useState<HistoricalRate[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<number>(7);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('line');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('EUR');

  useEffect(() => {
    fetchCoinData();
    fetchForexData();
  }, []);

  useEffect(() => {
    convertAmount();
  }, [fromAmount, fromCoin, toCoin]);

  useEffect(() => {
    convertForexAmount();
  }, [forexAmount, fromCurrency, toCurrency, forexRates]);

  useEffect(() => {
    fetchHistoricalRates();
  }, [selectedCurrency, selectedTimeRange]);

  const fetchCoinData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=false'
      );
      const data = await response.json();
      
      const coinData: CoinData[] = data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        icon: getCoinIcon(coin.id),
      }));
      
      setCoins(coinData);
    } catch (error) {
      console.error('Error fetching coin data:', error);
    }
  };

  const getCoinIcon = (coinId: string): string => {
    switch (coinId) {
      case 'bitcoin':
        return bitcoinIcon;
      case 'ethereum':
        return ethereumIcon;
      case 'binancecoin':
        return binanceIcon;
      default:
        return bitcoinIcon;
    }
  };

  const convertAmount = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${fromCoin},${toCoin}&vs_currencies=usd`
      );
      const data = await response.json();
      
      const fromPrice = data[fromCoin].usd;
      const toPrice = data[toCoin].usd;
      
      setConvertedAmount((Number(fromAmount) * fromPrice) / toPrice);
    } catch (error) {
      console.error('Error converting amount:', error);
    }
  };

  const fetchForexData = async () => {
    try {
      const response = await fetch(
        'https://v6.exchangerate-api.com/v6/662f3b9bca374bf662642db4/latest/USD'
      );

      const data = await response.json();
      
      const rates: ForexData[] = COMMON_CURRENCIES.map(currency => ({
        code: currency.code,
        name: currency.name,
        rate: data.conversion_rates[currency.code],
      }));
      
      setForexRates(rates);
    } catch (error) {
      console.error('Error fetching forex data:', error);
    }
  };

  const convertForexAmount = () => {
    const fromRate = forexRates.find(rate => rate.code === fromCurrency)?.rate || 1;
    const toRate = forexRates.find(rate => rate.code === toCurrency)?.rate || 1;
    
    setConvertedForex((Number(forexAmount) * toRate) / fromRate);
  };

  const fetchHistoricalRates = async () => {
    try {
      const dates = Array.from({ length: selectedTimeRange }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const rates: HistoricalRate[] = [];

      // Fetch all rates at once for better performance
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/662f3b9bca374bf662642db4/history/${selectedCurrency}/${dates[0]}`
      );
      const data = await response.json();

      if (data.conversion_rates) {
        // Calculate rate for selected currency (as base currency)
        const baseRate = 1 / data.conversion_rates[selectedCurrency];
        rates.push({
          date: new Date(dates[0]).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          rate: baseRate
        });

        // Fetch historical data for remaining dates
        for (let i = 1; i < dates.length; i++) {
          const response = await fetch(
            `https://v6.exchangerate-api.com/v6/662f3b9bca374bf662642db4/history/${selectedCurrency}/${dates[i]}`
          );
          const data = await response.json();
          
          if (data.conversion_rates) {
            const rate = 1 / data.conversion_rates[selectedCurrency];
            rates.push({
              date: new Date(dates[i]).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              }),
              rate: rate
            });
          }
        }
      }

      setHistoricalRates(rates);
    } catch (error) {
      console.error('Error fetching historical rates:', error);
    }
  };

  const formatCurrencyValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const chartData = {
    labels: historicalRates.map(rate => rate.date),
    datasets: [
      {
        label: `${selectedCurrency} Value in USD`,
        data: historicalRates.map(rate => rate.rate),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: selectedChartType === 'area',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: `${selectedCurrency} Value Over ${selectedTimeRange} Days`,
        color: 'white',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Value: ${formatCurrencyValue(context.raw)}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: false,
        ticks: { 
          color: 'white',
          callback: function(tickValue: string | number) {
            return typeof tickValue === 'number' ? formatCurrencyValue(tickValue) : tickValue;
          }
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        type: 'category' as const,
        ticks: { 
          color: 'white',
          maxRotation: 45,
          minRotation: 45
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  } as const;

  const renderChart = () => {
    switch (selectedChartType) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'area':
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      default:
        return <Line data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Market Overview Section */}
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Crypto Market Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <img src={coin.icon} alt={coin.name} className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-semibold text-white">{coin.name}</h3>
                  <p className="text-gray-400">{coin.symbol}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-white">${coin.current_price.toLocaleString()}</p>
                <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.price_change_percentage_24h.toFixed(2)}% (24h)
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Converter Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8">Crypto Converter</h2>
        <div className="bg-white/5 p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">From</label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={fromCoin}
                  onChange={(e) => setFromCoin(e.target.value)}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer min-w-[120px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {coins.map((coin) => (
                    <option key={coin.id} value={coin.id} className="bg-[#132042] text-white">
                      {coin.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">To</label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={convertedAmount.toFixed(6)}
                  readOnly
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={toCoin}
                  onChange={(e) => setToCoin(e.target.value)}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer min-w-[120px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {coins.map((coin) => (
                    <option key={coin.id} value={coin.id} className="bg-[#132042] text-white">
                      {coin.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forex Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8">Forex Market</h2>
        
        {/* Exchange Rate Chart */}
        <div className="bg-white/5 p-8 rounded-xl mb-12">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-bold text-white">Exchange Rate Trends</h3>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-white/10 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                {COMMON_CURRENCIES.filter(c => c.code !== 'USD').map(currency => (
                  <option key={currency.code} value={currency.code} className="bg-[#132042]">
                    {currency.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Chart Type:</span>
                <select
                  value={selectedChartType}
                  onChange={(e) => setSelectedChartType(e.target.value as ChartType)}
                  className="bg-white/10 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {CHART_TYPES.map(type => (
                    <option key={type.value} value={type.value} className="bg-[#132042]">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Time Range:</span>
                <div className="flex rounded-lg overflow-hidden">
                  {TIME_RANGES.map(range => (
                    <button
                      key={range.days}
                      onClick={() => setSelectedTimeRange(range.days)}
                      className={`px-3 py-1 text-sm ${
                        selectedTimeRange === range.days
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[400px]">
            {renderChart()}
          </div>
        </div>

        {/* Forex Rates Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {forexRates.map((currency) => (
            <div
              key={currency.code}
              className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{currency.code}</h3>
                  <p className="text-gray-400">{currency.name}</p>
                </div>
                <p className="text-2xl font-bold text-white">
                  {currency.rate.toFixed(4)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Forex Converter */}
        <div className="bg-white/5 p-8 rounded-xl">
          <h3 className="text-2xl font-bold text-white mb-6">Currency Converter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">From</label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={forexAmount}
                  onChange={(e) => setForexAmount(e.target.value)}
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer min-w-[120px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {COMMON_CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code} className="bg-[#132042] text-white">
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">To</label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={convertedForex.toFixed(2)}
                  readOnly
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer min-w-[120px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {COMMON_CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code} className="bg-[#132042] text-white">
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 
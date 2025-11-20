import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { DailyFlightStat, AirlineShare } from '../types';

interface FlightVolumeChartProps {
  data: DailyFlightStat[];
}

export const FlightVolumeChart: React.FC<FlightVolumeChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFlights" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Dotted grid lines look more like graph paper */}
          <CartesianGrid strokeDasharray="2 2" vertical={true} stroke="#cbd5e1" strokeOpacity={0.6} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
            tickFormatter={(value) => value.slice(5)} // Show MM-DD
            minTickGap={30}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '12px',
              fontWeight: 500
            }}
          />
          <Area 
            type="monotone" 
            dataKey="totalFlights" 
            name="Total Flights"
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorFlights)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
          />
          <Area 
            type="monotone" 
            dataKey="delayed" 
            name="Delayed"
            stroke="#f59e0b" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorDelayed)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface AirlineShareChartProps {
  data: AirlineShare[];
}

export const AirlineShareChart: React.FC<AirlineShareChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="flights"
            stroke="none" // Remove border for cleaner look inside the inset
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || '#cbd5e1'} 
                style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.1))' }} // Subtle depth for pie slices
              />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              fontSize: '12px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => <span className="text-slate-600 text-xs font-bold ml-1">{value}</span>}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface StatusDistributionProps {
  data: DailyFlightStat[];
}

export const StatusBarChart: React.FC<StatusDistributionProps> = ({ data }) => {
  const recentData = data.slice(-7);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={recentData} barSize={16}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.5} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(val) => val.slice(8)} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip 
            cursor={{fill: '#f1f5f9'}}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              fontSize: '12px'
            }}
          />
          {/* Rounded bars look more like pills/buttons */}
          <Bar dataKey="totalFlights" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} name="On Time" />
          <Bar dataKey="delayed" stackId="a" fill="#f59e0b" name="Delayed" />
          <Bar dataKey="cancelled" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} name="Cancelled" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
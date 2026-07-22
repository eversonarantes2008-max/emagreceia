import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

interface WeightEntry {
  data: string;
  peso: number;
}

interface WeightChartProps {
  history: WeightEntry[];
  targetWeight: number;
}

export function WeightChart({ history, targetWeight }: WeightChartProps) {
  // Ensure we sort chronologically by date
  const sortedHistory = [...history].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  // Formatter for date display (e.g., "2026-07-19" -> "19/07")
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    } catch (e) {
      return dateStr;
    }
  };

  const minWeight = Math.min(...sortedHistory.map(h => h.peso), targetWeight) - 2;
  const maxWeight = Math.max(...sortedHistory.map(h => h.peso), targetWeight) + 2;

  return (
    <div className="w-full h-64 md:h-72">
      {sortedHistory.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          Nenhum dado de pesagem disponível.
          <span className="text-xs mt-1">Insira seu primeiro peso para iniciar o histórico.</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sortedHistory}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
            
            <XAxis 
              dataKey="data" 
              tickFormatter={formatDate}
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            
            <YAxis 
              domain={[Math.floor(minWeight), Math.ceil(maxWeight)]}
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
              labelFormatter={(value) => `Data: ${new Date(value).toLocaleDateString('pt-BR')}`}
              formatter={(value: any) => [`${Number(value).toFixed(1)} kg`, 'Peso']}
            />

            {/* Target Weight line indicator */}
            <ReferenceLine 
              y={targetWeight} 
              stroke="#10b981" 
              strokeDasharray="4 4" 
              label={{ 
                value: `Meta: ${targetWeight}kg`, 
                fill: '#10b981', 
                position: 'top',
                fontSize: 10,
                fontWeight: 'bold'
              }} 
            />

            <Area 
              type="monotone" 
              dataKey="peso" 
              stroke="#2563eb" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorWeight)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#1d4ed8' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

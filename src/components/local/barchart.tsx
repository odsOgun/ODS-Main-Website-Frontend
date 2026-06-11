import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { year: '2020', attendees: 1000, color: '#A78BFA' },
  { year: '2021', attendees: 1500, color: '#86E1C3' },
  { year: '2022', attendees: 2000, color: '#000000' },
  { year: '2023', attendees: 2500, color: '#86E1C3' },
  { year: '2024', attendees: 3000, color: '#000000' },
  { year: '2025', attendees: 10000, color: '#A78BFA' }
];

const BarChartComponent: React.FC = () => {
  return (
    <div className='max-w-[700px] p-4 bg-[#F9F9FA] rounded-[16px] mx-auto mt-[28px]'>
      <h2 className='text-lg font-semibold mb-4'>Attendees</h2>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data} barSize={20}>
          <XAxis dataKey='year' tick={{ fill: '#A0AEC0' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#A0AEC0' }} axisLine={false} tickLine={false} domain={[0, 10000]} />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Bar dataKey='attendees' radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;

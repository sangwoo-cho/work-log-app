import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const DUMMY_DATA = [
  { name: 'Monday', count: 10 },
  { name: 'Tuesday', count: 5 },
  { name: 'Wednesday', count: 8 },
  { name: 'Thursday', count: 3 },
  { name: 'Friday', count: 12 },
];

function App() {
  return (
    <div>
      <h1>✅ 대시보드 복구 완료</h1>
      <div style={{ height: '500px', border: '5px solid red' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DUMMY_DATA}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;

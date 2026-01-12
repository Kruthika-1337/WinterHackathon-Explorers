import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";

function MonthlyProgress() {
  const { projectId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/project/${projectId}/images`)
      .then(res => res.json())
      .then(images => {
        const monthly = {};

        images.forEach(img => {
          const d = new Date(img.timestamp);
          const key = `${d.getFullYear()}-${d.getMonth()+1}`;
          monthly[key] = (monthly[key] || 0) + 1;
        });

        setData(
          Object.keys(monthly).map(m => ({
            month: m,
            uploads: monthly[m],
          }))
        );
      });
  }, [projectId]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="uploads"
          stroke="#ff9800"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default MonthlyProgress;
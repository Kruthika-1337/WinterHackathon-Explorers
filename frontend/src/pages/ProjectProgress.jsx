import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function ProjectProgress() {
  const { projectId } = useParams();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/project/${projectId}/images`)
      .then((res) => res.json())
      .then((images) => {
        const weeklyUploads = {};

        images.forEach((img) => {
          if (!img.timestamp) return;

          const date = new Date(img.timestamp);

          // SIMPLE + RELIABLE WEEK CALCULATION
          const weekNumber = Math.ceil(date.getDate() / 7);
          const label = `Week ${weekNumber}`;

          weeklyUploads[label] = (weeklyUploads[label] || 0) + 1;
        });

        // Convert to array & keep order
        const formattedData = Object.keys(weeklyUploads)
          .sort(
            (a, b) =>
              parseInt(a.replace("Week ", "")) -
              parseInt(b.replace("Week ", ""))
          )
          .map((week) => ({
            week,
            uploads: weeklyUploads[week],
          }));

        setChartData(formattedData);
      })
      .catch(console.error);
  }, [projectId]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Weekly Progress (Image Uploads)</h2>
      <p>Project ID: {projectId}</p>

      {chartData.length === 0 ? (
        <p>No uploads yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="linear"
              dataKey="uploads"
              stroke="#1976d2"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ProjectProgress;
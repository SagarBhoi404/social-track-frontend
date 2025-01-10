import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Metric = "engagement" | "impressions" | "reach";

// Component definition
export const PerformanceGraph = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState<Metric>("engagement");

  const metrics = {
    engagement: { color: "#9b87f5", label: "Engagement" },
    impressions: { color: "#0EA5E9", label: "Impressions" },
    reach: { color: "#10B981", label: "Reach" },
  };

  // Fetch data from the API
  useEffect(() => {
    fetch("https://social-track-backend.onrender.com/performance")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data); // Store API response
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="w-full animate-fade-up">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Performance Overview</CardTitle>
          <div className="flex gap-2">
            {(Object.keys(metrics) as Metric[]).map((metric) => (
              <Button
                key={metric}
                variant={selectedMetric === metric ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMetric(metric)}
                className="capitalize"
              >
                {metrics[metric].label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const currentValue = payload[0]?.value;
                    const previousValue = payload[1]?.value;

                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border">
                        <p className="font-bold">{label}</p>
                        <p className="text-sm text-gray-600">
                          Current:{" "}
                          {currentValue !== undefined ? currentValue : "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Previous:{" "}
                          {previousValue !== undefined ? previousValue : "N/A"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={metrics[selectedMetric].color}
                strokeWidth={2}
                name="Current Week"
              />
              <Line
                type="monotone"
                dataKey={`prev${
                  selectedMetric.charAt(0).toUpperCase() +
                  selectedMetric.slice(1)
                }`}
                stroke={metrics[selectedMetric].color}
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Previous Week"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

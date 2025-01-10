import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface AnalyticsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: number;
  sparklineData?: { value: number }[];
}

export const AnalyticsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend = 0,
  sparklineData = [],
}: AnalyticsCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 animate-fade-up group dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium dark:text-gray-100">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110 dark:text-primary-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold dark:text-gray-100">{value}</div>
        <div className="flex items-center space-x-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          {trend !== 0 && (
            <span className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        {sparklineData.length > 0 && (
          <div className="h-10 mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#9b87f5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
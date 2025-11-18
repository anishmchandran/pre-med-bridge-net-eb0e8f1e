import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface HoursChartProps {
  logs: any[];
}

const COLORS = {
  clinical: "hsl(var(--chart-1))",
  research: "hsl(var(--chart-2))",
  volunteer: "hsl(var(--chart-3))",
  shadowing: "hsl(var(--chart-4))",
  other: "hsl(var(--chart-5))",
};

export function HoursChart({ logs }: HoursChartProps) {
  const data = [
    {
      name: "Clinical",
      value: logs
        .filter((log) => log.experience_type === "clinical")
        .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0),
    },
    {
      name: "Research",
      value: logs
        .filter((log) => log.experience_type === "research")
        .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0),
    },
    {
      name: "Volunteer",
      value: logs
        .filter((log) => log.experience_type === "volunteer")
        .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0),
    },
    {
      name: "Shadowing",
      value: logs
        .filter((log) => log.experience_type === "shadowing")
        .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0),
    },
    {
      name: "Other",
      value: logs
        .filter((log) => log.experience_type === "other")
        .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0),
    },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No hours logged yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value.toFixed(1)} hours`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

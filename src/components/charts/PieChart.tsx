import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE", "#8884d8"];

interface DataForGraph {
  name: string;
  value: number;
}

interface PieChartGraphProps {
  datas: DataForGraph[];
}

export const PieChartGraph = ({ datas }: PieChartGraphProps) => {
  let totalPercent = 0;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 8;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    let roundedPercent = Math.round(percent * 10000) / 100;
    totalPercent += roundedPercent;
    if (totalPercent > 100) {
      roundedPercent -= Math.round((totalPercent - 100) * 100) / 100;
    }

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="0.9rem"
      >
        {roundedPercent > 0.1 ? `${roundedPercent}%` : ""}
      </text>
    );
  };

  return (
    <ResponsiveContainer
      minWidth={150}
      minHeight={270}
      width={"100%"}
      height={"100%"}
    >
      <PieChart>
        <Pie
          data={datas}
          cx="50%"
          cy="50%"
          label={renderCustomizedLabel}
          labelLine={false}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={4}
          dataKey="value"
        >
          {datas.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ paddingBottom: "10px", fontSize: "1rem" }}
          iconType="circle"
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

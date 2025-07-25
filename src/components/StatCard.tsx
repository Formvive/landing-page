type StatCardProps = {
    title: string;
    value: string;
    change: string;
  };
  
  export default function StatCard({ title, value, change }: StatCardProps) {
    const isPositive = change.startsWith("+");
  
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h4 className="text-sm text-gray-500 mb-1">{title}</h4>
        <div className="flex justify-between items-end">
          <p className="text-2xl font-bold">{value}</p>
          <span className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {change}
          </span>
        </div>
      </div>
    );
  }
  
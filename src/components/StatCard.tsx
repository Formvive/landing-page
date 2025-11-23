import { TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number; // Allow numbers too
  change: string;
  bg?: string;
};

export default function StatCard({ title, value, change, bg }: StatCardProps) {
  // Check if change string starts with '+'
  const isPositive = change.startsWith("+");
  
  // Safe background color logic:
  // If no bg provided -> white
  // If bg starts with '#' -> use as is
  // If bg is hex without hash -> add '#'
  const backgroundColor = bg 
    ? (bg.startsWith('#') ? bg : `#${bg}`) 
    : "#ffffff";

  return (
    <div
      className="p-6 rounded-xl shadow-sm transition-all hover:shadow-md"
      style={{ backgroundColor }}
    >
      <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
      
      <div className="flex justify-between items-end">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        
        <div className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          <span>{change}</span>
          {isPositive ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
        </div>
      </div>
    </div>
  );
}
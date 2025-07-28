import Image from "next/image";
type StatCardProps = {
  title: string;
  value: string;
  change: string;
  bg?: string;  // hex color code or tailwind class
};

export default function StatCard({ title, value, change, bg }: StatCardProps) {
  const isPositive = change.startsWith("+");

  return (
    <div
      className="StatCard p-5 rounded-xl shadow-sm"
      style={{ backgroundColor: bg ? `#${bg}` : "#ffffff" }}
    >
      <h4 className="text-sm text-gray-500 mb-1">{title}</h4>
      <div className="flex justify-between items-end">
        <p className="text-2xl font-bold">{value}</p>
        <div className="flex flex-row">
          <span className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {change}
          </span>
          <Image
            src={isPositive ? "/assets/icons/up.svg" : "/assets/icons/down.svg"}
            alt={isPositive ? "Up" : "Down"}
            width={16}
            height={16}
          />
        </div>
      </div>
    </div>
  );
}

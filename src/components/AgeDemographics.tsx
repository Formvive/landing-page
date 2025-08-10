export default function AgeDemographics({ data }: { data: Record<string, number> }) {
  const ageGroups = Object.entries(data);
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Demography by Age</h3>
      <ul className="space-y-2 text-sm">
        {ageGroups.map(([age, count]) => (
          <li key={age} className="flex items-center gap-2">
            <div className="w-6 h-1 bg-gray-800" />
            <span>{age} — {count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

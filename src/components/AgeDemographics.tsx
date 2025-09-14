"use client";

export default function AgeDemographics({ data }: { data: Record<string, number> }) {
  const ageGroups = Object.entries(data);
  const isEmpty = ageGroups.length === 0;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Demography by Age</h3>
      {isEmpty ? (
        <p className="text-center text-gray-500 mt-8 italic">No data available</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {ageGroups.map(([age, count]) => (
            <li key={age} className="flex items-center gap-2">
              <div className="w-6 h-1 bg-gray-800" />
              <span>{age} — {count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

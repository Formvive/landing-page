export default function AgeDemographics() {
    const ageGroups = [
      "18–23 years",
      "23–28 years",
      "28–35 years",
      "36–45 years",
      "45–55 years",
      "56 years >",
    ];
  
    return (
      <div>
        <h3 className="font-semibold text-lg mb-4">Demography by Age</h3>
        <ul className="space-y-2 text-sm">
          {ageGroups.map((age, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <div className="w-6 h-1 bg-gray-800" />
              <span>{age}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
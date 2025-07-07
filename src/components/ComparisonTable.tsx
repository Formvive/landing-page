
  export default function ComparisonTable() {
    return (
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-8">Traditional Feedback Is Too Late</h2>
        <div className="overflow-x-auto max-w-4xl mx-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-purple-100 text-purple-700">
                <th className="p-3">Parameter</th>
                <th className="p-3">Old Forms</th>
                <th className="p-3">FORMVIVE</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t">
                <td className="p-3">Speed</td>
                <td className="p-3">Slower</td>
                <td className="p-3 font-bold text-green-600">Better</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Precision</td>
                <td className="p-3">Slower</td>
                <td className="p-3 font-bold text-green-600">Better</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Persona Control</td>
                <td className="p-3">Slower</td>
                <td className="p-3 font-bold text-green-600">Better</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    )
  }
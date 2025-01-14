export default function ResultsDisplay({ results }: { results: string[] }) {
    return (
      <div className="p-4 bg-gray-100">
        <h2 className="text-lg font-semibold mb-2">Results</h2>
        {results.length > 0 ? (
          <ul className="space-y-1">
            {results.map((result, index) => (
              <li key={index} className="text-sm">{result}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Spin the wheel to see results!</p>
        )}
      </div>
    )
  }
  
  
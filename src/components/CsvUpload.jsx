import Papa from 'papaparse';
import { csvRowToFormData } from '../types';

export function CsvUpload({ onDataLoaded }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (result) => {
        if (result.data && result.data.length > 0) {
          const formData = csvRowToFormData(result.data[0]);
          onDataLoaded(formData);
        }
      },
      error: (err) => {
        console.error('CSV parse error:', err);
        alert('Failed to parse CSV file');
      },
    });
  };

  return (
    <div className="csv-upload">
      <label htmlFor="csv-file">Upload CSV (optional):</label>
      <input
        type="file"
        id="csv-file"
        accept=".csv"
        onChange={handleFileChange}
      />
    </div>
  );
}

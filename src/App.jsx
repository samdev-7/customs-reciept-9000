import { useState, useEffect } from 'react';
import { CsvUpload } from './components/CsvUpload';
import { ReceiptForm } from './components/ReceiptForm';
import { ItemSection } from './components/ItemSection';
import { createEmptyFormData } from './types';
import { loadTemplate, generateReceiptPdf, downloadBlob } from './utils/pdfGenerator';
import './App.css';

function App() {
  const [formData, setFormData] = useState(createEmptyFormData());
  const [itemName, setItemName] = useState('');
  const [itemValue, setItemValue] = useState('');
  const [presets, setPresets] = useState([]);
  const [templateBytes, setTemplateBytes] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch('/presets.json')
      .then((res) => res.json())
      .then((data) => setPresets(data))
      .catch((err) => console.warn('Could not load presets:', err));
  }, []);

  const handleCsvLoaded = (data) => {
    setFormData(data);
  };

  const handleItemChange = ({ itemName: name, itemValue: value }) => {
    setItemName(name);
    setItemValue(value);
  };

  const handleGeneratePdf = async () => {
    setGenerating(true);
    try {
      let bytes = templateBytes;
      if (!bytes) {
        bytes = await loadTemplate();
        setTemplateBytes(bytes);
      }
      const allData = { ...formData, ItemName: itemName, ItemValue: itemValue };
      const blob = await generateReceiptPdf(bytes, allData);
      const filename = `receipt-${formData.TrackingNumber || 'customs'}.pdf`;
      downloadBlob(blob, filename);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Make sure TEMPLATE.pdf exists in the public folder.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Customs Receipt Generator</h1>
        <p>Generate customs declaration receipts directly in your browser</p>
      </header>

      <main className="main">
        <CsvUpload onDataLoaded={handleCsvLoaded} />
        
        <ReceiptForm values={formData} onChange={setFormData} />

        <ItemSection
          itemName={itemName}
          itemValue={itemValue}
          onChange={handleItemChange}
          presets={presets}
        />

        <div className="actions">
          <button 
            onClick={handleGeneratePdf} 
            disabled={generating}
            className="generate-btn"
          >
            {generating ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </main>

      <footer className="footer">
        <p>All data is processed locally in your browser</p>
      </footer>
    </div>
  );
}

export default App;

import { FIELD_DEFINITIONS } from '../types';

export function ReceiptForm({ values, onChange }) {
  const handleChange = (templateKey, value) => {
    onChange({ ...values, [templateKey]: value });
  };

  return (
    <div className="receipt-form">
      {FIELD_DEFINITIONS.map((field) => (
        <div key={field.templateKey} className="form-field">
          <label htmlFor={field.templateKey}>{field.label}</label>
          <input
            type="text"
            id={field.templateKey}
            value={values[field.templateKey] || ''}
            onChange={(e) => handleChange(field.templateKey, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export function ItemSection({ itemName, itemValue, onChange, presets }) {
  const handlePresetClick = (preset) => {
    onChange({ itemName: preset.name, itemValue: preset.value });
  };

  return (
    <div className="item-section">
      <h3>Item Details</h3>
      
      {presets.length > 0 && (
        <div className="presets">
          <span className="presets-label">Presets:</span>
          {presets.map((preset, index) => (
            <button
              key={index}
              type="button"
              className="preset-btn"
              onClick={() => handlePresetClick(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      )}

      <div className="item-fields">
        <div className="form-field">
          <label htmlFor="itemName">Item Name</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => onChange({ itemName: e.target.value, itemValue })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="itemValue">Item Value</label>
          <input
            type="text"
            id="itemValue"
            value={itemValue}
            onChange={(e) => onChange({ itemName, itemValue: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

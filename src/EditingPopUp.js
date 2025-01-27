import React, { useState, useEffect } from 'react';

function EditingPopUp({ editStyling, item_id, layout, setLayout }) {
  const selectedItem = layout.find((item) => item.item_id === item_id);

  const [styles, setStyles] = useState({
    color: selectedItem?.styles?.color || '#000000',
    background_color: selectedItem?.styles?.background_color || '#ffffff',
    text_align: selectedItem?.styles?.text_align || 'left',
  });

  const handleInputChange = (key, value) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const updatedLayout = layout.map((item) =>
      item.item_id === item_id
        ? {
            ...item,
            styles: { ...item.styles, ...styles }, // Update or create styles
          }
        : item
    );
    setLayout(updatedLayout); // Update the layout array in the parent component
    editStyling(false); // Close the popup
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '200',
      }}
    >
      <div style={{ background: 'white', border: '1px solid grey', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Custom Styling</span>
          <span onClick={() => editStyling(false)} style={{ cursor: 'pointer', color: 'red' }}>
            Close
          </span>
        </div>
        <div>
          <div>
            <span>Text Color</span>
            <input
              type="color"
              value={styles.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
            />
          </div>
          <div>
            <span>Background Color</span>
            <input
              type="color"
              value={styles.background_color}
              onChange={(e) => handleInputChange('background_color', e.target.value)}
            />
          </div>
          <div>
            <span>Text Align</span>
            <select
              value={styles.text_align}
              onChange={(e) => handleInputChange('text_align', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default EditingPopUp;

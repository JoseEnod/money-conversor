import React from 'react';
import RNPickerSelect from 'react-native-picker-select';

export default function Picker({ currencies, onChange }) {
  const placeholder = {
    label: 'Selecione uma moeda...',
    value: null,
    color: '#000',
  }

  return (
    <RNPickerSelect
      placeholder={placeholder}
      items={currencies}
      onValueChange={(value) => onChange(value)}
      style={{
        inputAndroid: {
          fontSize: 20,
          color: '#000'
        },
        inputIOS: {
          fontSize: 20,
          color: '#000'
        }
      }}
    />
  )
}
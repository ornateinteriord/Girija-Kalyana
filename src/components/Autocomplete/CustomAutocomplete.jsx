import { Autocomplete, TextField } from "@mui/material";
import { useState, memo } from "react";

const CustomAutocomplete = ({
  options,
  label,
  value,
  onChange,
  name,
  required = false,
  sx = {},
  freeSolo = true,
}) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleInputChange = (_, inputValue) => {
    onChange({ target: { name, value: inputValue } });

    if (inputValue) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        Math.min(prev + 1, filteredOptions.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      onChange({ 
        target: { 
          name, 
          value: filteredOptions[highlightedIndex] 
        } 
      });
      setHighlightedIndex(-1);
    }
  };

  return (
    <Autocomplete
      freeSolo={freeSolo}
      options={filteredOptions}
      value={value}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          fullWidth
          required={required}
          sx={sx}
        />
      )}
      renderOption={(props, option, { selected }) => (
        <li 
          {...props} 
          style={{ 
            backgroundColor: highlightedIndex === filteredOptions.indexOf(option) 
              ? '#f5f5f5' 
              : 'inherit',
            padding: '8px 16px'
          }}
        >
          {option}
        </li>
      )}
    />
  );
};

export default memo(CustomAutocomplete);
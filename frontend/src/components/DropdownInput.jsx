import React, { useRef, useState } from "react";

function DropdownInput({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  suggestions = [],
  disabled = false,
  onMissingValue = null, // 👈 callback if value not in suggestions
}) {
  const inputRef = useRef(null);
  const lowerSuggestions = suggestions.map((s) => s.toLowerCase());

  const handleBlur = (e) => {
    const inputVal = e.target.value.trim();
    if (inputVal && !lowerSuggestions.includes(inputVal.toLowerCase())) {
      onMissingValue?.(inputVal);
    }
    onBlur?.(e);
  };

  const handleChange = (e) => {
    onChange(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      inputRef.current?.blur(); // Trigger blur to check for missing value
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        list={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
      />
      <datalist id={id}>
        {suggestions.map((s, i) => (
          <option key={i} value={s} />
        ))}
      </datalist>
    </>
  );
}

export default DropdownInput;
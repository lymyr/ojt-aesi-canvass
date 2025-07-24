import React, { useRef } from "react";

function DropdownInput({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  suggestions = [],
  allowAdd = true,
  onAdd = () => {},
  disabled = false,
}) {
  const inputRef = useRef(null);

  const lowerSuggestions = suggestions.map((s) => s.toLowerCase());
  const showAddOption =
    allowAdd && value && !lowerSuggestions.includes(value.toLowerCase());

  const handleBlur = (e) => {
    // Keep this for fallback cases
    onBlur?.(e);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;

    // If the user selects the "Add ..." option
    if (newValue.startsWith('Add "') && newValue.endsWith('"')) {
      const actual = newValue.slice(5, -1);
      onAdd(actual);

      // Force unfocus only when selected from dropdown
      inputRef.current?.blur();
      return;
    }

    onChange(e);
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
        placeholder={placeholder}
        disabled={disabled}
      />
      <datalist id={id}>
        {showAddOption && <option value={`Add "${value}"`} />}
        {suggestions.map((s, i) => (
          <option key={i} value={s} />
        ))}
      </datalist>
    </>
  );
}

export default DropdownInput;
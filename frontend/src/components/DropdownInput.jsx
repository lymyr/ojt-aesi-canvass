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
    onBlur?.(e);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (newValue.startsWith('Add "') && newValue.endsWith('"')) {
      const actual = newValue.slice(5, -1);
      onAdd(actual);
      inputRef.current?.blur();
      return;
    }

    onChange(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const inputValue = value.trim();
      const isNew = allowAdd && inputValue && !lowerSuggestions.includes(inputValue.toLowerCase());

      if (isNew) {
        onAdd(inputValue); // Auto-add on enter if not in list
      }

      inputRef.current?.blur(); // Unfocus
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
        {showAddOption && <option value={`Add "${value}"`} />}
        {suggestions.map((s, i) => (
          <option key={i} value={s} />
        ))}
      </datalist>
    </>
  );
}

export default DropdownInput;
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
  disabled={disabled}
}) {
  const inputRef = useRef(null);

  const lowerSuggestions = suggestions.map((s) => s.toLowerCase());
  const showAddOption =
    allowAdd && value && !lowerSuggestions.includes(value.toLowerCase());

  const handleBlur = (e) => {
    if (value.startsWith('Add "') && value.endsWith('"')) {
      const actual = value.slice(5, -1);
      onAdd(actual);
    }
    onBlur?.(e);
  };

  const handleChange = (e) => {
    onChange(e);

    const newValue = e.target.value;

    if (newValue.startsWith('Add "') && newValue.endsWith('"')) {
      setTimeout(() => {
        inputRef.current?.blur();
      }, 0);
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

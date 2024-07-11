import React from "react";

function FormRow({ type, name, labelText, defaultValue = "", onChange }) {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        onChange={onChange}
        className="form-input"
        defaultValue={defaultValue || ""}
        required
      />
    </div>
  );
}

export default FormRow;

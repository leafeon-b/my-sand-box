// HintInputForm.tsx

import React from "react";

interface HintInputFormProps {
  onSubmit: (hint: string) => void;
}

const HintInputForm: React.FC<HintInputFormProps> = ({ onSubmit }) => {
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      hint: { value: string };
    };
    const hint = target.hint.value;
    onSubmit(hint);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        ヒント:
        <input type="text" name="hint" />
      </label>
      <button type="submit">ヒントを提供</button>
    </form>
  );
};

export default HintInputForm;

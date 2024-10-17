import { FC } from "react";

interface CheckMarkInputProps {
  isChecked: boolean;
  onChange: () => void;
  label?: string;
}

const CheckMarkInput: FC<CheckMarkInputProps> = ({ isChecked, onChange, label }) => {
  return (
    <section className="">
      <div className="flex items-center justify-between">
        <span className="flex items-center">{label || null}</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={isChecked} onChange={onChange} />
          <CheckMark isChecked={isChecked} />
        </label>
      </div>
    </section>
  );
};

const CheckMark: FC<{ isChecked: boolean }> = ({ isChecked }) => {
  return (
    <div
      className={`w-6 h-6 rounded-md border-2 border-black flex items-center justify-center ${
        isChecked ? "bg-primary-400" : "bg-white"
      }`}
    >
      {isChecked && (
        <svg
          className="w-4 h-4 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
};

export default CheckMarkInput;

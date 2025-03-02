import * as React from "react";

interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Optional icon for the left side; defaults to a lock icon. */
  iconSrc?: string;
}

export function PasswordInput({
  label,
  name,
  value,
  onChange,
  iconSrc = "/icons/lock.svg",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="bg-[#E0E8F3] rounded-lg min-w-[300px] min-h-[48px] flex items-center gap-x-1.5 p-4 w-full max-w-xl">
      {/* Left Icon */}
      <img
        className="w-6 h-6 object-contain mr-2"
        alt="Password icon"
        src={iconSrc}
      />

      {/* Actual Password Input */}
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        className="bg-transparent outline-none flex-1 text-[#737285] placeholder-[#B0B0B0] text-sm"
      />

      {/* Eye Toggle */}
      <button type="button" onClick={togglePassword}>
        <img
          className="w-6 h-6 object-contain"
          alt="Toggle password visibility"
          src={showPassword ? "/icons/eye-off.svg" : "/icons/eye.svg"}
        />
      </button>
    </div>
  );
}

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

type OTPInputProps = {
  length: number;
  onComplete: (otp: string) => void;
};

export const OTPForm = ({ length, onComplete }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (!newOtp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-y-6 rounded-xl bg-white p-8 text-center shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800">Enter your OTP</h2>
      <p className="text-sm text-gray-500">
        We’ve sent a code to your email. Enter it below to verify your identity.
      </p>
      <div className="flex justify-center gap-x-3">
        {otp.map((digit, index) => (
          <motion.div
            key={index}
            className={`flex h-14 w-14 items-center justify-center rounded-lg border shadow-sm ${
              otp[index]
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-gray-50"
            }`}
            animate={{
              scale: otp[index] ? 1.1 : 1,
              borderColor: otp[index] ? "#16a34a" : "#d1d5db",
              backgroundColor: otp[index] ? "#f0fdf4" : "#f9fafb",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              value={digit}
              maxLength={1}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => inputRefs.current[index]?.focus()}
              className="h-full w-full bg-transparent text-center text-2xl font-semibold text-gray-800 outline-none"
            />
          </motion.div>
        ))}
      </div>
      <button
        className="mt-4 rounded-lg bg-secondary px-6 py-3 font-medium text-white transition duration-300 hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-300"
        onClick={() => onComplete(otp.join(""))}
      >
        Verify OTP
      </button>
    </div>
  );
};

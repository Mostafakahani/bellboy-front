import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import { PhoneNumberEditDialogProps, Step } from "./ProfileTypes";
import Image from "next/image";
import { showSuccess } from "@/lib/toastService";
import { ApiResponse, useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";

export const PhoneNumberEditDialog: React.FC<PhoneNumberEditDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentPhoneNumber,
  handlePhoneEdit,
}) => {
  const authenticatedFetch = useAuthenticatedFetch();

  const [step, setStep] = useState<Step>(Step.PHONE);
  const phoneNumber = currentPhoneNumber;
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isFinished, setIsFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (timeLeft > 0 && step === Step.OTP) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [timeLeft, step]);

  useEffect(() => {
    if (isOpen) {
      setStep(Step.OTP);
      setTimeLeft(120);
      setIsFinished(false);
      console.log(`Sending OTP to ${currentPhoneNumber}`);
    }
  }, [isOpen]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handlePhoneEdit();
    console.log(`Sending OTP to ${phoneNumber}`);
    setStep(Step.OTP);
    setTimeLeft(120);
    setIsFinished(false);
  };

  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setErrorMessage("لطفا کد 4 رقمی را کامل وارد کنید");
      return;
    }

    try {
      // setLoading(true);
      setErrorMessage("");

      const { data, error, message, status } = await authenticatedFetch<ApiResponse>("/users/otp", {
        method: "POST",
        body: JSON.stringify({ phone: phoneNumber, otp: otpValue }),
      });

      if (error) {
        throw new Error(formatErrorMessage(message));
      }

      if (data?.statusCode && data.statusCode !== 201) {
        throw new Error(formatErrorMessage(data.message));
      }

      if (data?.token && status === "success") {
        showSuccess(message);
        setStep(Step.NEW_PHONE);
      } else {
        throw new Error(formatErrorMessage(data?.message) || "خطا در تایید کد");
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      // setLoading(false);
    }
  };

  const handleNewPhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Updating phone number to ${newPhoneNumber}`);
    onSave(newPhoneNumber);
    // setShowSuccessDialog(true);
  };

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePhoneChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const input = e.target.value.replace(/\D/g, "");
    setNewPhoneNumber(input);

    if (input.length > 0 && !input.startsWith("09")) {
      setErrorMessage("شماره وارد شده باید با 09 شروع شود");
    } else if (input.length > 11) {
      setErrorMessage("شماره موبایل وارد شده باید 11 رقم باشد");
    } else {
      setErrorMessage("");
    }
  };

  const renderStep = () => {
    switch (step) {
      case Step.OTP:
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-7 mt-48">
            <h2 className="text-xl text-center font-bold mt-24">
              برای تغییر شماره تلفن همراه
              <br />
              کد تأیید را وارد کنید!
            </h2>
            <div className="w-full flex justify-center">
              {!isFinished ? (
                <div>
                  <p className="font-bold">{formatTime(timeLeft)}</p>
                </div>
              ) : (
                <div>
                  <button
                    className="text-blue-500/90 font-bold text-sm"
                    onClick={handlePhoneSubmit}
                  >
                    ارسال مجدد کد
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-row-reverse justify-center space-x-4 rtl:space-x">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  value={digit}
                  onChange={(
                    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
                  ) => handleChange(index, e.target.value)}
                  onKeyDown={(
                    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
                  ) => handleKeyDown(index, e)}
                  className={`w-[4.32rem] h-[4.32rem] text-center text-2xl border-2 rounded-xl ${
                    errorMessage ? "border-red-500" : "border-gray-500"
                  } focus:!border-green-500 focus:!ring-green-500`}
                  maxLength={1}
                  required
                />
              ))}
            </div>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={otp.join("").length !== 4}
              onXsIsText
            >
              ادامه
            </Button>
            <button
              type="button"
              onClick={() => setStep(Step.PHONE)}
              className="w-full flex flex-row justify-center items-center gap-3 font-bold text-sm"
            >
              <Pencil size={18} />
              تغییر شماره {phoneNumber}
            </button>
          </form>
        );
      case Step.NEW_PHONE:
        return (
          <>
            <form onSubmit={handleNewPhoneSubmit} className="space-y-7 mt-48">
              <h2 className="text-xl font-bold text-center">شماره موبایل جدید را وارد کنید</h2>
              <Input
                name="newPhoneNumber"
                value={newPhoneNumber}
                onChange={(e) => handlePhoneChange(e)}
                type="tel"
                placeholder="09120000000"
                maxLength={11}
                minLength={11}
                required
                className="text-center placeholder:text-slate-400 w-full"
                variant={errorMessage ? "error" : "default"}
                style={{ textAlign: "center" }}
                errorMessage={errorMessage}
              />
              <Button
                disabled={!!errorMessage || newPhoneNumber.length !== 11}
                className="w-full"
                variant="primary"
                onXsIsText
                type="submit"
              >
                ذخیره شماره جدید
              </Button>
            </form>
          </>
        );
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/0 bg-opacity-50flex items-end justify-center z-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white w-full p-6 transform transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0 scale-100 h-screen" : "translate-x-full scale-95 h-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h5 className="font-black text-xl">ویرایش شماره تلفن همراه</h5>
          <button
            onClick={() => {
              onClose();
              setOtp(["", "", "", ""]);
            }}
          >
            <Image width={24} height={24} src="/images/icons/close.svg" alt="close" />
          </button>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

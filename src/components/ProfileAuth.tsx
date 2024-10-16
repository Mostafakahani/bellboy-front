import React, { useState, ChangeEvent, FormEvent, useRef, KeyboardEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/Input/Input";
// import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import Button from "./ui/Button/Button";
import { Pencil } from "lucide-react";

type Step = "phone" | "otp" | "details";

interface UserDetails {
  name: string;
  lastname: string;
}

// interface UserStatus {
//   isRegistered: boolean;
//   details?: UserDetails;
// }

const ProfileAuth: React.FC = () => {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120); // 120 seconds = 2 minutes

  // State to track if the timer has finished
  const [isFinished, setIsFinished] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [userDetails, setUserDetails] = useState<UserDetails>({ name: "", lastname: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  // const authenticatedFetch = useAuthenticatedFetch(); // Use the hook

  useEffect(() => {
    if (timeLeft > 0) {
      // Set up the countdown
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      // Clean up the timer on component unmount
      return () => clearTimeout(timer);
    } else {
      // When the timer hits 0, set the finished state
      setIsFinished(true);
    }
  }, [timeLeft]);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const handlePhoneSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errorMessage) return;
    setTimeLeft(120);

    // const { data, error, isLoading } = await authenticatedFetch<ApiResponse>("/api/send-otp", {
    //   method: "POST",
    //   body: JSON.stringify({ phone }),
    // });

    // if (isLoading) {
    //   // Handle loading state if needed
    // } else if (error) {
    //   setErrorMessage("Failed to send OTP. Please try again.");
    // } else if (data && data.success) {
    setStep("otp");
    // }
  };

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 4) {
      // const { data, error, isLoading } = await authenticatedFetch<UserStatus>("/api/verify-otp", {
      //   method: "POST",
      //   body: JSON.stringify({ phone, otp }),
      // });

      // if (isLoading) {
      //   // Handle loading state if needed
      // } else if (error) {
      //   setErrorMessage("Invalid OTP. Please try again.");
      // } else if (data) {
      //   if (data.isRegistered) {
      //     router.push("/dashboard");
      //   } else {
      setStep("details");
      //   }
      // }
      // For demo purposes:
      // const demoUserStatus: UserStatus = {
      //   isRegistered: true,
      // };

      // if (demoUserStatus.isRegistered) {
      //   router.push("/dashboard");
      // } else {
      //   setStep("details");
      // }
      console.log("OTP submitted:", otpValue);
    } else {
      setErrorMessage("Please enter a valid 4-digit code");
    }
  };

  const handleDetailsSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const { data, error, isLoading } = await authenticatedFetch<ApiResponse>(
    //   "/api/submit-details",
    //   {
    //     method: "POST",
    //     body: JSON.stringify(userDetails),
    //   }
    // );

    // if (isLoading) {
    //   // Handle loading state if needed
    // } else if (error) {
    //   setErrorMessage("Failed to submit user details. Please try again.");
    // } else if (data && data.success) {
    router.push("/dashboard");
    // }
  };

  const handlePhoneChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const input = e.target.value.replace(/\D/g, "");
    setPhone(input);

    if (input.length > 0 && !input.startsWith("09")) {
      setErrorMessage("شماره وارد شده باید با 09 شروع شود");
    } else if (input.length > 11) {
      setErrorMessage("شماره موبایل وارد شده باید 11 رقم باشد");
    } else {
      setErrorMessage("");
    }
  };

  const handleUserDetailsChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
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
      inputRefs[index + 1].current?.focus();
    }
  };
  const renderStep = () => {
    switch (step) {
      case "phone":
        return (
          <form onSubmit={handlePhoneSubmit} className="space-y-7">
            <div className="mb-24">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl text-center font-bold mt-24">شماره موبایل خود را وارد کنید!</h2>
            <Input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="09123456789"
              className="text-center placeholder:text-slate-400 w-full"
              maxLength={11}
              minLength={11}
              required
              variant={errorMessage ? "error" : "default"}
              style={{ textAlign: "center" }}
              errorMessage={errorMessage}
            />
            <Button
              type="submit"
              className="w-full"
              variant="primary"
              disabled={!!errorMessage || phone.length !== 11}
              onXsIsText
            >
              ثبت و ادامه
            </Button>
          </form>
        );
      case "otp":
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-7">
            <h2 className="text-xl text-center font-bold mt-24">کد تأیید را وارد کنید!</h2>
            <div className="w-full flex justify-center">
              {!isFinished ? (
                <div>
                  <p className="font-bold">{formatTime(timeLeft)}</p>
                </div>
              ) : (
                <div>
                  <button
                    className="text-blue-500/90 font-bold text-sm"
                    onClick={() => handlePhoneSubmit}
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
                  // autoFocus
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
              onClick={() => setStep("phone")}
              className="w-full flex flex-row justify-center items-center gap-3 font-bold text-sm"
            >
              <Pencil size={18} />
              تغییر شماره {phone}
            </button>
          </form>
        );
      case "details":
        return (
          <form onSubmit={handleDetailsSubmit} className="space-y-8">
            <h2 className="text-xl text-center font-bold mt-24">مشخصات خود را وارد کنید!</h2>
            <Input
              label="نام"
              type="text"
              name="name"
              autoFocus
              value={userDetails.name}
              onChange={handleUserDetailsChange}
              required
            />
            <Input
              label="نام خانوادگی"
              type="text"
              name="lastname"
              value={userDetails.lastname}
              onChange={handleUserDetailsChange}
              required
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!userDetails.name || !userDetails.lastname}
              onXsIsText
            >
              ثبت
            </Button>
          </form>
        );
    }
  };

  return <div className="max-w-md mx-auto mt-24 p-6 bg-white">{renderStep()}</div>;
};

export default ProfileAuth;

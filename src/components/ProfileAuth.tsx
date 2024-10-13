import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/Input/Input";
import { ApiResponse, useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";

type Step = "phone" | "otp" | "details";

interface UserDetails {
  name: string;
  familyName: string;
}

interface UserStatus {
  isRegistered: boolean;
  details?: UserDetails;
}

const ProfileAuth: React.FC = () => {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [userDetails, setUserDetails] = useState<UserDetails>({ name: "", familyName: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const authenticatedFetch = useAuthenticatedFetch(); // Use the hook

  const handlePhoneSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errorMessage) return;

    const { data, error, isLoading } = await authenticatedFetch<ApiResponse>("/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });

    if (isLoading) {
      // Handle loading state if needed
    } else if (error) {
      setErrorMessage("Failed to send OTP. Please try again.");
    } else if (data && data.success) {
      setStep("otp");
    }
  };

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error, isLoading } = await authenticatedFetch<UserStatus>("/api/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });

    if (isLoading) {
      // Handle loading state if needed
    } else if (error) {
      setErrorMessage("Invalid OTP. Please try again.");
    } else if (data) {
      if (data.isRegistered) {
        router.push("/dashboard");
      } else {
        setStep("details");
      }
    }
    // For demo purposes:
    const demoUserStatus: UserStatus = {
      isRegistered: true,
    };

    if (demoUserStatus.isRegistered) {
      router.push("/dashboard");
    } else {
      setStep("details");
    }
  };

  const handleDetailsSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error, isLoading } = await authenticatedFetch<ApiResponse>(
      "/api/submit-details",
      {
        method: "POST",
        body: JSON.stringify(userDetails),
      }
    );

    if (isLoading) {
      // Handle loading state if needed
    } else if (error) {
      setErrorMessage("Failed to submit user details. Please try again.");
    } else if (data && data.success) {
      router.push("/dashboard");
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleUserDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case "phone":
        return (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">شماره موبایل خود را وارد کنید!</h2>
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
            <button
              type="submit"
              className="w-full p-2 bg-emerald-500 text-white rounded disabled:bg-emerald-300"
              disabled={!!errorMessage || phone.length !== 11}
            >
              Submit and Continue
            </button>
          </form>
        );
      case "otp":
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Enter the verification code</h2>
            <Input
              type="text"
              value={otp}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              placeholder="1234"
              className="w-full p-2 border rounded text-center"
              required
              maxLength={4}
              pattern="\d{4}"
              errorMessage={errorMessage}
            />
            <button
              type="submit"
              className="w-full p-2 bg-emerald-500 text-white rounded disabled:bg-emerald-300"
              disabled={otp.length !== 4}
            >
              Verify and Continue
            </button>
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full p-2 text-emerald-500"
            >
              Change number: {phone}
            </button>
          </form>
        );
      case "details":
        return (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Enter your details</h2>
            <Input
              type="text"
              name="name"
              value={userDetails.name}
              onChange={handleUserDetailsChange}
              placeholder="Name"
              className="w-full p-2 border rounded"
              required
            />
            <Input
              type="text"
              name="familyName"
              value={userDetails.familyName}
              onChange={handleUserDetailsChange}
              placeholder="Family Name"
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-emerald-500 text-white rounded disabled:bg-emerald-300"
              disabled={!userDetails.name || !userDetails.familyName}
            >
              Complete Registration
            </button>
          </form>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white">
      <div className="mb-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
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
      {renderStep()}
    </div>
  );
};

export default ProfileAuth;

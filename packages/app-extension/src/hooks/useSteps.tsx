import { useState } from "react";

export const useSteps = () => {
  const [step, setStep] = useState(0);
  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => {
    if (step > 0) setStep((prevStep) => prevStep - 1);
  };

  return {
    step,
    setStep,
    nextStep,
    prevStep,
  };
};

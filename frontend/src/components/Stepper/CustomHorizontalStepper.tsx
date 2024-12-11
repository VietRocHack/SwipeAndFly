import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { FormRequirements } from "../../utils/types";
import { useState } from "react";
import { Alert } from "@mui/material";
// import Typography from "@mui/material/Typography";

interface StepperDetails {
  steps: string[];
  requirements: FormRequirements[];
  nodes: React.ReactNode[];
}

/**
 * Return a Stepper with multiple different ReactNodes as its steps
 */
export default function CustomHorizontalStepper({
  steps,
  requirements,
  nodes,
}: StepperDetails) {
  const [activeStep, setActiveStep] = useState(0);
  const [isError, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleNext = () => {
    const requirement = requirements[activeStep];
    if (!requirement.condition()) {
      setError(true);
      handleShake();
    } else {
      setError(false);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setError(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShake = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 500); // Reset shake after animation duration
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} sx={{ margin: 4 }}>
          {steps.map((label) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {nodes[activeStep]}

        {isError && (
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              mx: 5,
              mt: 3,
              animation: shake ? "shake 0.5s" : "none",
            }}
          >
            {requirements[activeStep].errorMsg}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep != steps.length ? (
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </>
  );
}

import React from 'react';
import { Step, Button, FormInput, InfoBox } from '../ui';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface StartSessionStepProps {
  stepNumber: number;
}

export const StartSessionStep: React.FC<StartSessionStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    emailCode,
    authenticatorId,
    wrapper,
    addLog,
    markStepComplete,
    setEmailCode,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];

  const isActive = currentStep === stepNumber;
  const canSubmit = isActive && emailCode.trim() !== '';

  const handleStartSession = async () => {
    if (!wrapper || !emailCode || !authenticatorId) {
      addLog('❌ Please enter the email verification code first', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 6: Starting session with verification code...');
    
    try {
      await wrapper.startSession({
        code: emailCode,
        authenticatorId: authenticatorId
      });
      addLog(`✅ Session started successfully!`, 'success');
      markStepComplete(stepNumber - 1);
      addLog(`➡️ Next: Get KYC link`, 'info');
    } catch (error) {
      addLog(`❌ Failed to start session: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const actions = (
    <Button
      onClick={handleStartSession}
      disabled={!canSubmit}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Session Started' : 'Start Session'}
    </Button>
  );

  return (
    <Step
      title="Enter Email Code & Start Session"
      description="Check your email for the verification code and enter it below:"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      <FormInput
        id="emailCode"
        label="Email Verification Code:"
        value={emailCode}
        onChange={setEmailCode}
        placeholder="Enter code from email"
        disabled={!isActive}
      />
    </Step>
  );
}; 
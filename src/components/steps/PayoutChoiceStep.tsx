import React from 'react';
import { Step, Button, InfoBox, RadioGroup } from '../ui';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface PayoutChoiceStepProps {
  stepNumber: number;
}

export const PayoutChoiceStep: React.FC<PayoutChoiceStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    isUsingCancellationFlow,
    setIsUsingCancellationFlow,
    addLog,
    setCompletedSteps,
    setCurrentStep,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];
  const isActive = currentStep === stepNumber;

  const choiceOptions = [
    { label: '🚀 Execute Payout', value: 'execute' },
    { label: '❌ Cancel Payout', value: 'cancel' }
  ];

  const selectedChoice = isUsingCancellationFlow ? 'cancel' : 'execute';

  const handleChoiceChange = (value: string) => {
    setIsUsingCancellationFlow(value === 'cancel');
  };

  const handleContinue = async () => {
    setStepLoading(stepNumber - 1, true);
    
    if (isUsingCancellationFlow) {
      addLog('🔄 Step 12: Proceeding with payout cancellation flow...');
      addLog('⚠️ You chose to cancel the payout. The next steps will help you cancel it.', 'warning');
    } else {
      addLog('🔄 Step 12: Proceeding with payout execution flow...');
      addLog('✅ You chose to execute the payout. The next steps will complete the payout.', 'success');
    }
    
    // Mark current step as complete
    const currentIndex = stepNumber - 1;
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentIndex] = true;
    setCompletedSteps(newCompletedSteps);
    
    // Set next step based on choice: 13 for execution, 14 for cancellation
    const nextStep = isUsingCancellationFlow ? 14 : 13;
    setCurrentStep(nextStep);
    
    addLog(`➡️ Next: ${isUsingCancellationFlow ? 'Get cancellation body' : 'Get payout body'}`, 'info');
    setStepLoading(stepNumber - 1, false);
  };

  const actions = (
    <Button
      onClick={handleContinue}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Choice Made' : 'Continue'}
    </Button>
  );

  return (
    <Step
      title="Choose Payout Action"
      description="Decide whether to execute or cancel the payout"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {!isCompleted && (
        <InfoBox variant="info">
          <p style={{ marginBottom: '15px' }}>
            Now that you've created a payout, you can either:
          </p>
          <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
            <li><strong>Execute the payout:</strong> Sign and submit it for processing</li>
            <li><strong>Cancel the payout:</strong> Sign a cancellation request to cancel it</li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            Choose your preferred action below:
          </p>
        </InfoBox>
      )}
      
      {!isCompleted && (
        <div style={{ marginTop: '20px' }}>
          <RadioGroup
            name="payoutChoice"
            options={choiceOptions}
            value={selectedChoice}
            onChange={handleChoiceChange}
            label="What would you like to do with the payout?"
          />
        </div>
      )}
      
      {isCompleted && (
        <InfoBox variant={isUsingCancellationFlow ? "warning" : "success"}>
          <p style={{ marginBottom: 0 }}>
            <strong>Choice made:</strong> {isUsingCancellationFlow ? 'Cancel the payout' : 'Execute the payout'}
          </p>
        </InfoBox>
      )}
    </Step>
  );
};

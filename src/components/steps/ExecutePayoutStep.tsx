import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';
import { MuralApiClient } from '../../index';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface ExecutePayoutStepProps {
  stepNumber: number;
}

export const ExecutePayoutStep: React.FC<ExecutePayoutStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    payoutStatus,
    signature,
    payoutId,
    orgId,
    isUsingCancellationFlow,
    addLog,
    markStepComplete,
    setPayoutStatus,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];
  const isActive = currentStep === stepNumber && !isUsingCancellationFlow;

  const handleExecutePayout = async () => {
    if (!signature || !payoutId || !orgId) {
      addLog('❌ Please complete previous steps first', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 15: Executing payout...');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.executeEndUserCustodialPayout(payoutId, signature, orgId);
      setPayoutStatus('SUCCESS');
      addLog(`✅ Payout executed successfully!`, 'success');
      addLog(`💸 Status: SUCCESS`, 'success');
      markStepComplete(stepNumber - 1);
      addLog(`🎉 Congratulations! You have completed the entire end-user custodial payout execution flow!`, 'success');
    } catch (error) {
      addLog(`❌ Failed to execute payout: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const actions = (
    <Button
      onClick={handleExecutePayout}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Payout Executed' : 'Execute Payout'}
    </Button>
  );

  // Only show this step if using execution flow
  if (isUsingCancellationFlow) {
    return null;
  }

  return (
    <Step
      title="Execute Payout"
      description="Submit the signed payout for execution"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {isCompleted && (
        <InfoBox variant="success">
          <h4 style={{ marginTop: 0 }}>🎉 Congratulations!</h4>
          <p>You have successfully completed the end-user custodial payout execution flow:</p>
          <ul style={{ marginBottom: '10px' }}>
            <li>✅ Created organization and completed KYC</li>
            <li>✅ Initialized SDK and authenticated</li>
            <li>✅ Created and funded account</li>
            <li>✅ Created, signed, and executed $2 USDC payout</li>
          </ul>
          <p style={{ marginBottom: 0, fontWeight: 'bold' }}>
            The payout is now being processed and will be delivered to John Smith's bank account.
          </p>
        </InfoBox>
      )}
    </Step>
  );
}; 
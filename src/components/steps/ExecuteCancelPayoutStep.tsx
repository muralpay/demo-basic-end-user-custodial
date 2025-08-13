import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';
import { MuralApiClient } from '../../index';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface ExecuteCancelPayoutStepProps {
  stepNumber: number;
}

export const ExecuteCancelPayoutStep: React.FC<ExecuteCancelPayoutStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    payoutStatus,
    cancelSignature,
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
  const isActive = currentStep === stepNumber && isUsingCancellationFlow;

  const handleExecuteCancelPayout = async () => {
    if (!cancelSignature || !payoutId || !orgId) {
      addLog('❌ Please complete previous steps first', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 15: Executing payout cancellation...');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.cancelEndUserCustodialPayout(payoutId, cancelSignature, orgId);
      setPayoutStatus('CANCELLED');
      addLog(`✅ Payout cancelled successfully!`, 'success');
      addLog(`❌ Status: CANCELLED`, 'warning');
      markStepComplete(stepNumber - 1);
      addLog(`🎉 Payout cancellation completed! The payout has been cancelled and will not be processed.`, 'success');
    } catch (error) {
      addLog(`❌ Failed to cancel payout: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const actions = (
    <Button
      onClick={handleExecuteCancelPayout}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Payout Cancelled' : 'Cancel Payout'}
    </Button>
  );

  // Only show this step if using cancellation flow
  if (!isUsingCancellationFlow) {
    return null;
  }

  return (
    <Step
      title="Execute Cancel Payout"
      description="Submit the signed cancellation request to cancel the payout"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      <InfoBox variant="warning">
        <p style={{ marginBottom: 0 }}>
          ⚠️ <strong>Final Step:</strong> This will permanently cancel the payout.
        </p>
      </InfoBox>
      
      {isCompleted && (
        <InfoBox variant="warning">
          <h4 style={{ marginTop: 0 }}>❌ Payout Cancelled</h4>
          <p>You have successfully completed the payout cancellation flow:</p>
          <ul style={{ marginBottom: '10px' }}>
            <li>✅ Created organization and completed KYC</li>
            <li>✅ Initialized SDK and authenticated</li>
            <li>✅ Created and funded account</li>
            <li>✅ Created $2 USDC payout</li>
            <li>❌ <strong>Cancelled the payout instead of executing it</strong></li>
          </ul>
          <p style={{ marginBottom: 0, fontWeight: 'bold' }}>
            The payout has been cancelled and will NOT be delivered. No funds will be transferred.
          </p>
        </InfoBox>
      )}
    </Step>
  );
};

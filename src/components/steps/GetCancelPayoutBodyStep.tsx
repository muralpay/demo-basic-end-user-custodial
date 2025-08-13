import React from 'react';
import { Step, Button, InfoBox, ResultDisplay, FormInput } from '../ui';
import { MuralApiClient } from '../../index';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface GetCancelPayoutBodyStepProps {
  stepNumber: number;
}

export const GetCancelPayoutBodyStep: React.FC<GetCancelPayoutBodyStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    cancelPayload,
    payoutId,
    orgId,
    isUsingCancellationFlow,
    addLog,
    markStepComplete,
    setCancelPayload,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];
  const isActive = currentStep === stepNumber && isUsingCancellationFlow;

  const handleGetCancelPayoutBody = async () => {
    if (!payoutId || !orgId) {
      addLog('❌ Please create a payout first', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 13: Getting payout cancellation body for signing...');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.getCancelPayoutRequestBody(payoutId, orgId);
      addLog(`✅ Payout cancellation body retrieved successfully!`, 'success');
      setCancelPayload(JSON.stringify(result, null, 2));
      markStepComplete(stepNumber - 1);
      addLog(`➡️ Next: Sign the payout cancellation payload`, 'info');
    } catch (error) {
      addLog(`❌ Failed to get payout cancellation body: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const actions = (
    <Button
      onClick={handleGetCancelPayoutBody}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Cancel Body Retrieved' : 'Get Cancel Body'}
    </Button>
  );

  // Only show this step if using cancellation flow
  if (!isUsingCancellationFlow) {
    return null;
  }

  return (
    <Step
      title="Get Cancel Payout Body"
      description="Retrieve the payout cancellation data that needs to be signed"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      <InfoBox variant="warning">
        <p style={{ marginBottom: 0 }}>
          ⚠️ <strong>Cancellation Flow:</strong> This will retrieve the data needed to cancel the payout.
        </p>
      </InfoBox>
      
      {cancelPayload && (
        <ResultDisplay>
          <FormInput
            id="cancelPayload"
            label="Cancel Payout Payload:"
            type="textarea"
            value={cancelPayload}
            onChange={() => {}}
            readOnly
            fontFamily="monospace"
            fontSize="small"
            rows={6}
          />
        </ResultDisplay>
      )}
    </Step>
  );
};

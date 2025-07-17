import React from 'react';
import { Step, Button, InfoBox, ResultDisplay, FormInput } from '../ui';
import { MuralApiClient } from '../../index';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface GetPayoutBodyStepProps {
  stepNumber: number;
}

export const GetPayoutBodyStep: React.FC<GetPayoutBodyStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    payoutPayload,
    payoutId,
    orgId,
    addLog,
    markStepComplete,
    setPayoutPayload,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];
  const isActive = currentStep === stepNumber;

  const handleGetPayoutBody = async () => {
    if (!payoutId || !orgId) {
      addLog('❌ Please create a payout first', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 12: Getting payout body for signing...');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.getPayoutRequestBody(payoutId, orgId);
      addLog(`✅ Payout body retrieved successfully!`, 'success');
      setPayoutPayload(JSON.stringify(result, null, 2));
      markStepComplete(stepNumber - 1);
      addLog(`➡️ Next: Sign the payout payload`, 'info');
    } catch (error) {
      addLog(`❌ Failed to get payout body: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const actions = (
    <Button
      onClick={handleGetPayoutBody}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Payout Body Retrieved' : 'Get Payout Body'}
    </Button>
  );

  return (
    <Step
      title="Get Payout Body"
      description="Retrieve the payout data that needs to be signed"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {payoutPayload && (
        <ResultDisplay>
          <FormInput
            id="payoutPayload"
            label="Payout Payload:"
            type="textarea"
            value={payoutPayload}
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
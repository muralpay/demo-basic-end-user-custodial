import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface SignCancelPayoutStepProps {
  stepNumber: number;
}

export const SignCancelPayoutStep: React.FC<SignCancelPayoutStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    cancelSignature,
    cancelPayload,
    wrapper,
    isUsingCancellationFlow,
    addLog,
    markStepComplete,
    setCancelSignature,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];
  const isActive = currentStep === stepNumber && isUsingCancellationFlow;

  const handleSignCancelPayout = async () => {
    if (!cancelPayload || !wrapper) {
      addLog('❌ Please complete previous steps first', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 14: Signing payout cancellation with SDK...');
    
    try {
      const parsedPayload = JSON.parse(cancelPayload);
      const signedPayload = await wrapper.signPayoutPayload(parsedPayload);
      
      if (signedPayload === null) {
        throw new Error('Failed to sign cancellation payload - signature returned null');
      }
      
      setCancelSignature(signedPayload);
      addLog(`✅ Payout cancellation signed successfully!`, 'success');
      markStepComplete(stepNumber - 1);
      addLog(`➡️ Next: Execute the payout cancellation`, 'info');
    } catch (error) {
      addLog(`❌ Failed to sign payout cancellation: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const signatureDisplayStyles = {
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '0.75rem',
    fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
    wordBreak: 'break-all' as const,
    lineHeight: '1.4',
    maxHeight: '200px',
    overflowY: 'auto' as const
  };

  const actions = (
    <Button
      onClick={handleSignCancelPayout}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Cancellation Signed' : 'Sign Cancellation'}
    </Button>
  );

  // Only show this step if using cancellation flow
  if (!isUsingCancellationFlow) {
    return null;
  }

  return (
    <Step
      title="Sign Cancel Payout"
      description="Cryptographically sign the payout cancellation payload using your private key"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      <InfoBox variant="warning">
        <p style={{ marginBottom: 0 }}>
          ⚠️ <strong>Cancellation Flow:</strong> This will sign the cancellation request.
        </p>
      </InfoBox>
      
      {cancelSignature && (
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Cancellation Signature:
          </label>
          <div style={signatureDisplayStyles}>
            {cancelSignature}
          </div>
        </div>
      )}
    </Step>
  );
};

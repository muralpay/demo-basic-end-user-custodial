import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface SignPayoutStepProps {
  stepNumber: number;
}

export const SignPayoutStep: React.FC<SignPayoutStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    signature,
    payoutPayload,
    wrapper,
    addLog,
    markStepComplete,
    setSignature,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];
  const isActive = currentStep === stepNumber;

  const handleSignPayout = async () => {
    if (!payoutPayload || !wrapper) {
      addLog('❌ Please complete previous steps first', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 13: Signing payout with SDK...');
    
    try {
      const parsedPayload = JSON.parse(payoutPayload);
      const signedPayload = await wrapper.signPayoutPayload(parsedPayload);
      
      if (signedPayload === null) {
        throw new Error('Failed to sign payload - signature returned null');
      }
      
      setSignature(signedPayload);
      addLog(`✅ Payout signed successfully!`, 'success');
      markStepComplete(stepNumber - 1);
      addLog(`➡️ Next: Execute the payout`, 'info');
    } catch (error) {
      addLog(`❌ Failed to sign payout: ${error instanceof Error ? error.message : String(error)}`, 'error');
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
      onClick={handleSignPayout}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Payout Signed' : 'Sign Payout'}
    </Button>
  );

  return (
    <Step
      title="Sign Payout"
      description="Cryptographically sign the payout payload using your private key"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {signature && (
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Signature:
          </label>
          <div style={signatureDisplayStyles}>
            {signature}
          </div>
        </div>
      )}
    </Step>
  );
}; 
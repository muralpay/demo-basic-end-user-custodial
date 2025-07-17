import React from 'react';
import { Step, Button, InfoBox, ResultDisplay, FormInput } from '../ui';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';
import { MuralApiClient, EndUserCustodialSDKWrapper } from '../../index';

interface InitiateChallengeStepProps {
  stepNumber: number;
}

export const InitiateChallengeStep: React.FC<InitiateChallengeStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    approversList,
    selectedApproverIndex,
    authenticatorId,
    orgId,
    approverId,
    wrapper,
    addLog,
    markStepComplete,
    setAuthenticatorId,
    setSelectedApproverIndex,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];

  const isActive = currentStep === stepNumber;

  const handleInitiateChallenge = async () => {
    if (!orgId || !approverId || !wrapper) {
      addLog('❌ Please complete previous steps first', 'error');
      return;
    }

    // Get public key from the SDK
    const publicKey = wrapper.getPublicKey();
    if (!publicKey) {
      addLog('❌ Failed to get public key from SDK', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 5: Initiating authentication challenge...');
    addLog(`🔑 Using Public Key: ${publicKey}`, 'info');
    addLog(`📋 Using Approver ID: ${approverId}`, 'info');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.initiateChallenge({ publicKey, approverId }, orgId);
      addLog(`✅ Challenge initiated successfully!`, 'success');
      addLog(`📋 Authenticator ID: ${result.authenticatorId}`, 'success');
      setAuthenticatorId(result.authenticatorId);
      markStepComplete(stepNumber - 1);
      addLog(`➡️ Next: Start session with email code`, 'info');
    } catch (error) {
      addLog(`❌ Failed to initiate challenge: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const actions = (
    <Button
      onClick={handleInitiateChallenge}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Challenge Initiated' : 'Initiate Challenge'}
    </Button>
  );

  return (
    <Step
      title="Initiate Authentication Challenge"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {/* Show selected approver info */}
      {approversList.length > 0 && (
        <InfoBox variant="info">
          <strong>👤 Selected Approver:</strong><br/>
          <span>{approversList[selectedApproverIndex]?.name} ({approversList[selectedApproverIndex]?.email})</span>
          {approversList.length > 1 && (
            <p style={{ marginTop: '5px', fontSize: '12px' }}>
              💡 You can change the approver selection in Step 1 if needed.
            </p>
          )}
        </InfoBox>
      )}
      
      {authenticatorId && (
        <ResultDisplay>
          <strong>Authenticator ID:</strong> {authenticatorId}
        </ResultDisplay>
      )}
    </Step>
  );
}; 
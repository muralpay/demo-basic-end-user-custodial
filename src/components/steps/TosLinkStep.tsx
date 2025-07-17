import React from 'react';
import { Step, Button, FormInput, InfoBox, ResultDisplay } from '../ui';
import { MuralApiClient } from '../../index';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface TosLinkStepProps {
  stepNumber: number;
}

export const TosLinkStep: React.FC<TosLinkStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    tosLink,
    tosLinkVisible,
    orgId,
    addLog,
    markStepComplete,
    setTosLink,
    setTosLinkVisible,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];
  const isActive = currentStep === stepNumber;

  const handleGetTosLink = async () => {
    if (!orgId) {
      addLog('❌ Please create an organization first', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 2: Getting Terms of Service link...');
    
    try {
      const apiClient = new MuralApiClient();
      const link = await apiClient.getOrganizationTosLink(orgId);
      addLog(`✅ TOS link retrieved successfully!`, 'success');
      setTosLink(link);
      setTosLinkVisible(true);
      markStepComplete(stepNumber - 1);
      addLog(`🔗 Please open the TOS link and complete the acceptance process`, 'warning');
      addLog(`➡️ Next: Accept Terms of Service, then initialize SDK`, 'info');
    } catch (error) {
      addLog(`❌ Failed to get TOS link: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const actions = (
    <Button
      onClick={handleGetTosLink}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ TOS Link Retrieved' : 'Get TOS Link'}
    </Button>
  );

  return (
    <Step
      title="Get Terms of Service Link"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {tosLinkVisible && (
        <ResultDisplay>
          <FormInput
            id="tosLink"
            label="Terms of Service Link:"
            value={tosLink}
            onChange={() => {}}
            readOnly
          />
          <div style={{ marginTop: '10px' }}>
            <Button
              href={tosLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="success"
            >
              🚀 Open TOS Link
            </Button>
            <InfoBox variant="error">
              <strong>Important:</strong> You must click on the link and accept the Terms of Service before proceeding.
            </InfoBox>
          </div>
        </ResultDisplay>
      )}
    </Step>
  );
}; 
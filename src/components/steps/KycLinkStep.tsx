import React from 'react';
import { Step, Button, FormInput, InfoBox, ResultDisplay } from '../ui';
import { MuralApiClient } from '../../index';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface KycLinkStepProps {
  stepNumber: number;
}

export const KycLinkStep: React.FC<KycLinkStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    kycLink,
    kycLinkVisible,
    orgId,
    addLog,
    markStepComplete,
    setKycLink,
    setKycLinkVisible,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];
  const isActive = currentStep === stepNumber;

  const handleGetKycLink = async () => {
    if (!orgId) {
      addLog('❌ Please complete previous steps first', 'error');
      return;
    }
  
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 7: Getting KYC link...');
    
    try {
      const apiClient = new MuralApiClient();
      const link = await apiClient.getOrganizationKycLink(orgId);
      addLog(`✅ KYC link retrieved successfully!`, 'success');
      setKycLink(link);
      setKycLinkVisible(true);
      markStepComplete(stepNumber - 1);
      addLog(`🔗 Please open the KYC link and complete the verification process`, 'warning');
      addLog(`➡️ Next: Check KYC status`, 'info');
    } catch (error) {
      addLog(`❌ Failed to get KYC link: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const actions = (
    <Button
      onClick={handleGetKycLink}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ KYC Link Retrieved' : 'Get KYC Link'}
    </Button>
  );

  return (
    <Step
      title="Get KYC Link"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {kycLinkVisible && (
        <ResultDisplay>
          <FormInput
            id="kycLink"
            label="KYC Link:"
            value={kycLink}
            onChange={() => {}}
            readOnly
          />
          <div style={{ marginTop: '10px' }}>
            <Button
              href={kycLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="success"
            >
              🚀 Open KYC Link
            </Button>
            <InfoBox variant="info">
              <p style={{ marginBottom: '10px' }}>
                <strong>🧪 Testing Environment Note:</strong> In testing environments, KYC validation is done automatically in the background. You don't need to click the link above. This typically takes around 10 minutes to complete.
              </p>
              <InfoBox variant="error" style={{ margin: 0 }}>
                <strong>Important:</strong> You must complete the KYC process before proceeding to account creation.
              </InfoBox>
            </InfoBox>
          </div>
        </ResultDisplay>
      )}
    </Step>
  );
}; 
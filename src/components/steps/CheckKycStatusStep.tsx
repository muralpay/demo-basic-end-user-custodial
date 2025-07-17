import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';
import { MuralApiClient } from '../../index';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface CheckKycStatusStepProps {
  stepNumber: number;
}

export const CheckKycStatusStep: React.FC<CheckKycStatusStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    kycStatus,
    kycResponse,
    orgId,
    addLog,
    markStepComplete,
    onKycStatusChange,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];
  const isActive = currentStep === stepNumber;

  const handleCheckKycStatus = async () => {
    if (!orgId) {
      addLog('❌ Please complete previous steps first', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 8: Checking KYC verification status...');
    
    try {
      const apiClient = new MuralApiClient();
      const orgDetails = await apiClient.getOrganization(orgId);
      const kycStatusValue = orgDetails.kycStatus?.type;
      
      onKycStatusChange(kycStatusValue, orgDetails);
      
      if (kycStatusValue === 'approved') {
        addLog(`✅ KYC verification has been approved!`, 'success');
        markStepComplete(stepNumber - 1);
        addLog(`➡️ Next: Create account`, 'info');
      } else if (kycStatusValue === 'pending') {
        addLog(`⚠️ KYC verification is pending review. Please wait for approval.`, 'warning');
      } else if (kycStatusValue === 'submitted') {
        addLog(`⚠️ KYC has been submitted and is being reviewed. Please wait for approval.`, 'warning');
      } else {
        addLog(`❌ KYC verification has not been completed yet. Status: ${kycStatusValue || 'NOT_STARTED'}`, 'error');
        addLog(`🔗 Please open the KYC link and complete the verification process.`, 'warning');
      }
    } catch (error) {
      addLog(`❌ Failed to check KYC status: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const actions = (
    <Button
      onClick={handleCheckKycStatus}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ KYC Verified' : 'Check KYC Status'}
    </Button>
  );

  const getKycVariant = () => {
    if (kycStatus === 'approved') return 'success';
    if (kycStatus === 'pending' || kycStatus === 'submitted') return 'warning';
    return 'error';
  };

  return (
    <Step
      title="Check KYC Verification Status"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {kycResponse && (
        <ResultDisplay>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
              KYC Validation Response:
            </label>
            <InfoBox variant={getKycVariant()}>
              <p style={{ marginBottom: '10px' }}>
                <strong>Status:</strong> {kycStatus?.toUpperCase() || 'NOT_STARTED'}
              </p>
              {kycResponse.kycStatus?.message && (
                <p style={{ marginBottom: '10px' }}>
                  <strong>Message:</strong> {kycResponse.kycStatus.message}
                </p>
              )}
              {kycStatus === 'approved' && (
                <p style={{ marginBottom: 0, fontSize: '14px' }}>
                  ✅ KYC verification has been completed successfully! You can now proceed to create an account.
                </p>
              )}
              {(kycStatus === 'pending' || kycStatus === 'submitted') && (
                <p style={{ marginBottom: 0, fontSize: '14px' }}>
                  ⏳ KYC verification is still being processed. In testing environments, this typically completes within 10 minutes.
                </p>
              )}
              {(!kycStatus || kycStatus === 'NOT_STARTED') && (
                <p style={{ marginBottom: 0, fontSize: '14px' }}>
                  ❌ KYC verification has not been started yet. Please complete the KYC process via the link in Step 7.
                </p>
              )}
            </InfoBox>
          </div>
        </ResultDisplay>
      )}
    </Step>
  );
}; 
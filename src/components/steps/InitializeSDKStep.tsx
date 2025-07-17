import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';
import { EndUserCustodialSDKWrapper } from '../../index';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface InitializeSDKStepProps {
  stepNumber: number;
}

export const InitializeSDKStep: React.FC<InitializeSDKStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    addLog,
    markStepComplete,
    setWrapper,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];

  const isActive = currentStep === stepNumber;

  const handleInitializeSDK = async () => {
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 4: Initializing SDK...');
    
    try {
      const newWrapper = new EndUserCustodialSDKWrapper();
      const success = await newWrapper.initialize('auth-iframe-container-id');
      if (success) {
        setWrapper(newWrapper);
        addLog('✅ SDK initialized successfully!', 'success');
        markStepComplete(stepNumber - 1);
        addLog(`➡️ Next: Get public key and initiate challenge`, 'info');
      } else {
        throw new Error('SDK initialization failed');
      }
    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const actions = (
    <Button
      onClick={handleInitializeSDK}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ SDK Initialized' : 'Initialize SDK'}
    </Button>
  );

  return (
    <Step
      title="Initialize SDK"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      <div id="auth-iframe-container-id" style={{ height: '1px', width: '1px', overflow: 'hidden' }}></div>
    </Step>
  );
}; 
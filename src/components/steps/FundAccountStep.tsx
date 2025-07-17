import React from 'react';
import { Step, Button, FormInput, InfoBox, ResultDisplay } from '../ui';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface FundAccountStepProps {
  stepNumber: number;
}

export const FundAccountStep: React.FC<FundAccountStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    accountAddress,
    addLog,
    markStepComplete,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];

  const isActive = currentStep === stepNumber;

  const handleProceedToFunding = async () => {
    if (!accountAddress) {
      addLog('❌ Account address not available. Please create account first.', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('ℹ️ Step 10: Please follow the funding instructions above', 'info');
    addLog('💰 Once you have funded your account with USDC, click "Continue to Payout"', 'warning');
    markStepComplete(stepNumber - 1);
    addLog(`➡️ Next: Create a payout`, 'info');
    setStepLoading(stepNumber - 1, false);
  };

  const actions = (
    <Button
      onClick={handleProceedToFunding}
      disabled={!isActive || !accountAddress}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Ready for Payout' : 'Continue to Payout'}
    </Button>
  );

  const linkStyles = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500'
  };

  return (
    <Step
      title="Fund Your Account"
      description="Your account needs to be funded with USDC to execute payouts. Use Circle's testnet faucet to add funds."
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {accountAddress ? (
        <ResultDisplay>
          <FormInput
            id="accountAddressDisplay"
            label="Your Account Address:"
            value={accountAddress}
            onChange={() => {}}
            readOnly
          />
          
          <InfoBox variant="info">
            <h4 style={{ marginTop: 0 }}>📋 Funding Instructions:</h4>
            <ol style={{ marginBottom: '10px' }}>
              <li>Open the <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" style={linkStyles}>Circle Testnet Faucet</a></li>
              <li>Select <strong>USDC</strong> as the token</li>
              <li>Select <strong>Polygon PoS Amoy</strong> as the network</li>
              <li>Paste your account address: <code style={{ backgroundColor: '#fff', padding: '2px 4px', borderRadius: '3px' }}>{accountAddress}</code></li>
              <li>Click "Send 10 USDC" to fund your account</li>
              <li>Wait for the transaction to complete (usually takes 1-2 minutes)</li>
              <li>Return here and click "Continue to Payout" below</li>
            </ol>
            <p style={{ marginBottom: 0, fontSize: '14px', fontStyle: 'italic' }}>
              💡 The faucet provides 10 USDC which is more than enough for the demo payout of $2 USDC.
            </p>
          </InfoBox>
          
          <div style={{ marginTop: '15px' }}>
            <Button
              href="https://faucet.circle.com/"
              target="_blank"
              rel="noopener noreferrer"
              variant="success"
            >
              🚀 Open Circle Faucet
            </Button>
          </div>
        </ResultDisplay>
      ) : (
        <InfoBox variant="warning">
          Account address not available. Please create an account first.
        </InfoBox>
      )}
    </Step>
  );
}; 
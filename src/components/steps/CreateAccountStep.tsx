import React from "react";
import { Step, Button, FormInput, InfoBox, ResultDisplay } from "../ui";
import { MuralApiClient } from '../../index';
import { useEndUserCustodialContext } from '../../context/EndUserCustodialContext';

interface CreateAccountStepProps {
  stepNumber: number;
}

export const CreateAccountStep: React.FC<CreateAccountStepProps> = ({
  stepNumber
}) => {
  const {
    currentStep,
    completedSteps,
    loadingStates,
    accountName,
    accountId,
    accountAddress,
    accountInitializing,
    isLoadingAccountDetails,
    orgId,
    wrapper,
    addLog,
    markStepComplete,
    setAccountName,
    setAccountId,
    setAccountAddress,
    setAccountInitializing,
    setIsLoadingAccountDetails,
    setStepLoading
  } = useEndUserCustodialContext();

  const isCompleted = completedSteps[stepNumber - 1];
  const isLoading = loadingStates[stepNumber - 1];
  const isActive = currentStep === stepNumber;

  const handleCreateAccount = async () => {
    if (!orgId || !accountName) {
      addLog('❌ Please fill in account name', 'error');
      return;
    }
    
    setStepLoading(stepNumber - 1, true);
    addLog('🔄 Step 9: Creating account...');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.createAccount({
        name: accountName,
        description: 'Demo account for testing payouts'
      }, orgId);
      addLog(`✅ Account created successfully!`, 'success');
      addLog(`📋 Account ID: ${result.id}`, 'success');
      setAccountId(result.id);
      
      // Check account status
      const accountStatus = result.status;
      addLog(`📋 Account Status: ${accountStatus}`, 'info');
      
      if (accountStatus === 'INITIALIZING') {
        setAccountInitializing(true);
        addLog(`⏳ Account is initializing. This typically takes around 3 minutes.`, 'warning');
        addLog(`💡 Click "Check Initialization Status" button to check when it's ready.`, 'info');
        // Mark step as complete since account was created, even if initializing
        markStepComplete(stepNumber - 1);
        addLog(`➡️ Next: Wait for account initialization, then fund your account`, 'info');
        return; // Don't try to extract wallet address yet
      }
      
      // Try to extract account address if account is ready
      let walletAddress = null;
      
      // Try different possible paths for the wallet address
      if (result.accountDetails?.walletDetails?.walletAddress) {
        walletAddress = result.accountDetails.walletDetails.walletAddress;
      } else if (result.address) {
        walletAddress = result.address;
      } else if (result.walletAddress) {
        walletAddress = result.walletAddress;
      } else if (result.accountDetails?.address) {
        walletAddress = result.accountDetails.address;
      }
      
      if (walletAddress) {
        setAccountAddress(walletAddress);
        setAccountInitializing(false);
        addLog(`📋 Account Address: ${walletAddress}`, 'success');
        markStepComplete(stepNumber - 1);
        addLog(`➡️ Next: Fund your account using Circle faucet`, 'info');
      } else {
        addLog(`⚠️ Account created but wallet address not found in response`, 'warning');
        setAccountInitializing(true);
        addLog(`💡 The account may still be initializing. You can check the account status.`, 'warning');
        markStepComplete(stepNumber - 1);
        addLog(`➡️ Next: Check account details to retrieve wallet address`, 'info');
      }
      
    } catch (error) {
      addLog(`❌ Failed to create account: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setStepLoading(stepNumber - 1, false);
    }
  };

  const handleGetAccountDetails = async () => {
    if (!orgId || !accountId) {
      addLog('❌ Please create account first', 'error');
      return;
    }
    
    if (setIsLoadingAccountDetails) {
      setIsLoadingAccountDetails(true);
    }
    addLog('🔄 Getting account details to check initialization status...');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.getAccount(accountId, orgId);
      
      const accountStatus = result.status;
      addLog(`📋 Account Status: ${accountStatus}`, 'info');
      
      if (accountStatus === 'INITIALIZING') {
        setAccountInitializing(true);
        addLog(`⏳ Account is still initializing. Please wait a bit longer.`, 'warning');
        addLog(`💡 Initialization typically takes around 3 minutes total.`, 'info');
        return;
      }
      
      // If account is ready, try to extract wallet address
      let walletAddress = null;
      
      if (result.accountDetails?.walletDetails?.walletAddress) {
        walletAddress = result.accountDetails.walletDetails.walletAddress;
      } else if (result.address) {
        walletAddress = result.address;
      } else if (result.walletAddress) {
        walletAddress = result.walletAddress;
      } else if (result.accountDetails?.address) {
        walletAddress = result.accountDetails.address;
      }
      
      if (walletAddress) {
        setAccountAddress(walletAddress);
        setAccountInitializing(false);
        addLog(`✅ Account initialized successfully!`, 'success');
        addLog(`📋 Wallet Address: ${walletAddress}`, 'success');
        addLog(`➡️ Next: Fund your account using Circle faucet`, 'info');
      } else {
        addLog(`⚠️ Account status is ${accountStatus} but wallet address not found.`, 'warning');
        addLog(`💡 Please try again in a few moments.`, 'info');
      }
      
    } catch (error) {
      addLog(`❌ Failed to get account details: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      if (setIsLoadingAccountDetails) {
        setIsLoadingAccountDetails(false);
      }
    }
  };

  const actions = (
    <>
      <Button
        onClick={handleCreateAccount}
        disabled={!isActive}
        loading={isLoading}
        variant={isCompleted ? "success" : "primary"}
      >
        {isCompleted ? "✅ Account Created" : "Create Account"}
      </Button>
      {accountId && (
        <Button
          onClick={handleGetAccountDetails}
          loading={isLoadingAccountDetails}
          variant="primary"
        >
          {accountInitializing
            ? "⏳ Check Initialization Status"
            : "Get Account Details"}
        </Button>
      )}
    </>
  );

  return (
    <Step
      title="Create Account"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      <div style={{ marginBottom: "10px" }}>
        <InfoBox variant="info">
          <p
            style={{ marginBottom: "5px", marginTop: "10px", fontSize: "14px" }}
          >
            <strong>📋 Account Initialization:</strong>
          </p>
          <p style={{ marginBottom: 0, fontSize: "14px" }}>
            After creating an account, it needs to be initialized which
            typically takes around 3 minutes. The wallet address will be
            available once initialization is complete.
          </p>
        </InfoBox>
      </div>

      <FormInput
        id="accountName"
        label="Account Name:"
        value={accountName}
        onChange={setAccountName}
        placeholder="Demo Account"
        disabled={!isActive}
      />

      {accountId && (
        <ResultDisplay>
          <strong>Account ID:</strong> {accountId}
          {accountInitializing && (
            <InfoBox variant="warning">
              <p style={{ marginBottom: 0, fontSize: "14px" }}>
                ⏳ <strong>Account Initializing:</strong> The account is being
                set up and a wallet address is being generated. This process
                typically takes around 3 minutes. You can click "Check
                Initialization Status" below to see if it's ready.
              </p>
            </InfoBox>
          )}
          {accountAddress && !accountInitializing && (
            <>
              <br />
              <strong>Account Address:</strong> {accountAddress}
              <InfoBox variant="success">
                <p style={{ marginBottom: 0, fontSize: "14px" }}>
                  ✅ <strong>Account Ready:</strong> Your account has been
                  successfully initialized and is ready for funding!
                </p>
              </InfoBox>
            </>
          )}
        </ResultDisplay>
      )}
    </Step>
  );
};

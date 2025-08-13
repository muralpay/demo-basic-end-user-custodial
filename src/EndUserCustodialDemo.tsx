// If you encounter a "Cannot find module 'react'" error, run: npm install @types/react

import React from 'react';
import { EndUserCustodialProvider, useEndUserCustodialContext } from './context/EndUserCustodialContext';

// Import UI components
import {
  ProgressTracker,
  LogContainer,
  Header
} from './components/ui';

// Import step components
import {
  CreateOrganizationStep,
  TosLinkStep,
  CheckTosStatusStep,
  InitializeSDKStep,
  InitiateChallengeStep,
  StartSessionStep,
  KycLinkStep,
  CheckKycStatusStep,
  CreateAccountStep,
  FundAccountStep,
  CreatePayoutStep,
  PayoutChoiceStep,
  GetPayoutBodyStep,
  GetCancelPayoutBodyStep,
  SignPayoutStep,
  SignCancelPayoutStep,
  ExecutePayoutStep,
  ExecuteCancelPayoutStep
} from './components/steps';

const EndUserCustodialDemoContent: React.FC = () => {
  const {
    log,
    clearLog,
    status,
    currentStep,
    completedSteps
  } = useEndUserCustodialContext();

  // Step names for progress tracker
  const stepNames = [
    'Create Organization',
    'Get TOS Link', 
    'Accept TOS',
    'Initialize SDK',
    'Initiate Challenge',
    'Start Session',
    'Get KYC Link',
    'Check KYC Status',
    'Create Account',
    'Fund Account',
    'Create Payout',
    'Choose Action',
    'Get Payout Body',
    'Get Cancel Body',
    'Sign Payout',
    'Sign Cancel',
    'Execute Payout',
    'Execute Cancel'
  ];

  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  };

  return (
    <div style={containerStyles}>
      <Header 
        title="🎨 End-User Custodial Browser SDK Demo"
        status={status}
      />
      
      <ProgressTracker
        steps={stepNames}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <LogContainer
        log={log}
        onClear={clearLog}
      />

      {/* All steps now only need stepNumber as prop */}
      <CreateOrganizationStep stepNumber={1} />
      <TosLinkStep stepNumber={2} />
      <CheckTosStatusStep stepNumber={3} />
      <InitializeSDKStep stepNumber={4} />
      <InitiateChallengeStep stepNumber={5} />
      <StartSessionStep stepNumber={6} />
      <KycLinkStep stepNumber={7} />
      <CheckKycStatusStep stepNumber={8} />
      <CreateAccountStep stepNumber={9} />
      <FundAccountStep stepNumber={10} />
      <CreatePayoutStep stepNumber={11} />
      <PayoutChoiceStep stepNumber={12} />
      <GetPayoutBodyStep stepNumber={13} />
      <GetCancelPayoutBodyStep stepNumber={14} />
      <SignPayoutStep stepNumber={15} />
      <SignCancelPayoutStep stepNumber={16} />
      <ExecutePayoutStep stepNumber={17} />
      <ExecuteCancelPayoutStep stepNumber={18} />

      {/* Hidden iframe container for SDK */}
      <div id="auth-iframe-container-id" style={{ display: 'none' }}></div>
    </div>
  );
};

const EndUserCustodialDemo: React.FC = () => {
  return (
    <EndUserCustodialProvider>
      <EndUserCustodialDemoContent />
    </EndUserCustodialProvider>
  );
};

export default EndUserCustodialDemo; 

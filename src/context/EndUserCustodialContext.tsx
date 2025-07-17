import React, { createContext, useContext, useState, ReactNode } from 'react';
import {  EndUserCustodialSDKWrapper } from '../index';

// Types
interface ApproverData {
  id: string;
  name: string;
  email: string;
}

interface StatusData {
  message: string;
  type: 'ready' | 'error' | 'warning';
}

interface EndUserCustodialContextType {
  // Logging
  log: string[];
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  clearLog: () => void;
  
  // Status
  status: StatusData;
  updateStatus: (message: string, type?: 'ready' | 'error' | 'warning') => void;
  
  // SDK
  wrapper: EndUserCustodialSDKWrapper | null;
  setWrapper: (wrapper: EndUserCustodialSDKWrapper | null) => void;
  
  // Organization fields
  orgType: 'endUserCustodialIndividual' | 'endUserCustodialBusiness';
  setOrgType: (type: 'endUserCustodialIndividual' | 'endUserCustodialBusiness') => void;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  businessName: string;
  setBusinessName: (name: string) => void;
  businessEmail: string;
  setBusinessEmail: (email: string) => void;
  approvers: string;
  setApprovers: (approvers: string) => void;
  
  // Flow state
  orgId: string;
  setOrgId: (id: string) => void;
  approverId: string;
  setApproverId: (id: string) => void;
  approversList: ApproverData[];
  setApproversList: (list: ApproverData[]) => void;
  selectedApproverIndex: number;
  setSelectedApproverIndex: (index: number) => void;
  authenticatorId: string;
  setAuthenticatorId: (id: string) => void;
  emailCode: string;
  setEmailCode: (code: string) => void;
  
  // TOS state
  tosLink: string;
  setTosLink: (link: string) => void;
  tosLinkVisible: boolean;
  setTosLinkVisible: (visible: boolean) => void;
  tosStatus: string;
  setTosStatus: (status: string) => void;
  tosResponse: any;
  setTosResponse: (response: any) => void;
  onTosStatusChange: (status: string, response: any) => void;
  
  // KYC state
  kycLink: string;
  setKycLink: (link: string) => void;
  kycLinkVisible: boolean;
  setKycLinkVisible: (visible: boolean) => void;
  kycStatus: string;
  setKycStatus: (status: string) => void;
  kycResponse: any;
  setKycResponse: (response: any) => void;
  onKycStatusChange: (status: string, response: any) => void;
  
  // Account fields
  accountId: string;
  setAccountId: (id: string) => void;
  accountName: string;
  setAccountName: (name: string) => void;
  accountAddress: string;
  setAccountAddress: (address: string) => void;
  accountInitializing: boolean;
  setAccountInitializing: (initializing: boolean) => void;
  isLoadingAccountDetails: boolean;
  setIsLoadingAccountDetails: (loading: boolean) => void;
  
  // Payout fields
  payoutId: string;
  setPayoutId: (id: string) => void;
  payoutPayload: string;
  setPayoutPayload: (payload: string) => void;
  signature: string;
  setSignature: (signature: string) => void;
  payoutStatus: string;
  setPayoutStatus: (status: string) => void;
  
  // Flow progress
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: boolean[];
  setCompletedSteps: (steps: boolean[]) => void;
  loadingStates: boolean[];
  setLoadingStates: (states: boolean[]) => void;
  
  // Helper functions
  setStepLoading: (stepIndex: number, loading: boolean) => void;
  markStepComplete: (stepIndex: number) => void;
}

const EndUserCustodialContext = createContext<EndUserCustodialContextType | undefined>(undefined);

interface EndUserCustodialProviderProps {
  children: ReactNode;
}

export const EndUserCustodialProvider: React.FC<EndUserCustodialProviderProps> = ({ children }) => {
  // All the state variables
  const [wrapper, setWrapper] = useState<EndUserCustodialSDKWrapper | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusData>({ 
    message: 'Ready to start end-user custodial flow', 
    type: 'ready' 
  });
  
  // Organization creation fields
  const [orgType, setOrgType] = useState<'endUserCustodialIndividual' | 'endUserCustodialBusiness'>('endUserCustodialIndividual');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [businessEmail, setBusinessEmail] = useState<string>('');
  const [approvers, setApprovers] = useState<string>('');
  
  // Flow state
  const [orgId, setOrgId] = useState<string>('');
  const [approverId, setApproverId] = useState<string>('');
  const [approversList, setApproversList] = useState<ApproverData[]>([]);
  const [selectedApproverIndex, setSelectedApproverIndex] = useState<number>(0);
  const [authenticatorId, setAuthenticatorId] = useState<string>('');
  const [emailCode, setEmailCode] = useState<string>('');
  const [tosLink, setTosLink] = useState<string>('');
  const [tosLinkVisible, setTosLinkVisible] = useState<boolean>(false);
  const [tosStatus, setTosStatus] = useState<string>('');
  const [tosResponse, setTosResponse] = useState<any>(null);
  const [kycLink, setKycLink] = useState<string>('');
  const [kycLinkVisible, setKycLinkVisible] = useState<boolean>(false);
  const [kycStatus, setKycStatus] = useState<string>('');
  const [kycResponse, setKycResponse] = useState<any>(null);
  
  // Account fields
  const [accountId, setAccountId] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('Demo Account');
  const [accountAddress, setAccountAddress] = useState<string>('');
  const [accountInitializing, setAccountInitializing] = useState<boolean>(false);
  const [isLoadingAccountDetails, setIsLoadingAccountDetails] = useState<boolean>(false);
  
  // Payout fields
  const [payoutId, setPayoutId] = useState<string>('');
  const [payoutPayload, setPayoutPayload] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [payoutStatus, setPayoutStatus] = useState<string>('');
  
  // Flow progress tracking
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(14).fill(false));
  const [loadingStates, setLoadingStates] = useState<boolean[]>(new Array(14).fill(false));

  // Helper functions
  const addLog = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLog((prev: string[]) => [...prev, logEntry]);
  };

  const updateStatus = (message: string, type: 'ready' | 'error' | 'warning' = 'ready') => {
    setStatus({ message, type });
  };

  const setStepLoading = (stepIndex: number, loading: boolean) => {
    setLoadingStates(prev => {
      const newStates = [...prev];
      newStates[stepIndex] = loading;
      return newStates;
    });
  };

  const markStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newSteps = [...prev];
      newSteps[stepIndex] = true;
      return newSteps;
    });
    setCurrentStep(stepIndex + 2);
    setStepLoading(stepIndex, false);
  };

  const onKycStatusChange = (status: string, response: any) => {
    setKycStatus(status);
    setKycResponse(response);
  };

  const onTosStatusChange = (status: string, response: any) => {
    setTosStatus(status);
    setTosResponse(response);
  };

  const clearLog = () => {
    setLog(['🧹 Log cleared.']);
  };

  const contextValue: EndUserCustodialContextType = {
    // Logging
    log,
    addLog,
    clearLog,
    
    // Status
    status,
    updateStatus,
    
    // SDK
    wrapper,
    setWrapper,
    
    // Organization fields
    orgType,
    setOrgType,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    businessName,
    setBusinessName,
    businessEmail,
    setBusinessEmail,
    approvers,
    setApprovers,
    
    // Flow state
    orgId,
    setOrgId,
    approverId,
    setApproverId,
    approversList,
    setApproversList,
    selectedApproverIndex,
    setSelectedApproverIndex,
    authenticatorId,
    setAuthenticatorId,
    emailCode,
    setEmailCode,
    
    // TOS state
    tosLink,
    setTosLink,
    tosLinkVisible,
    setTosLinkVisible,
    tosStatus,
    setTosStatus,
    tosResponse,
    setTosResponse,
    onTosStatusChange,
    
    // KYC state
    kycLink,
    setKycLink,
    kycLinkVisible,
    setKycLinkVisible,
    kycStatus,
    setKycStatus,
    kycResponse,
    setKycResponse,
    onKycStatusChange,
    
    // Account fields
    accountId,
    setAccountId,
    accountName,
    setAccountName,
    accountAddress,
    setAccountAddress,
    accountInitializing,
    setAccountInitializing,
    isLoadingAccountDetails,
    setIsLoadingAccountDetails,
    
    // Payout fields
    payoutId,
    setPayoutId,
    payoutPayload,
    setPayoutPayload,
    signature,
    setSignature,
    payoutStatus,
    setPayoutStatus,
    
    // Flow progress
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    loadingStates,
    setLoadingStates,
    
    // Helper functions
    setStepLoading,
    markStepComplete,
  };

  return (
    <EndUserCustodialContext.Provider value={contextValue}>
      {children}
    </EndUserCustodialContext.Provider>
  );
};

export const useEndUserCustodialContext = () => {
  const context = useContext(EndUserCustodialContext);
  if (context === undefined) {
    throw new Error('useEndUserCustodialContext must be used within a EndUserCustodialProvider');
  }
  return context;
}; 

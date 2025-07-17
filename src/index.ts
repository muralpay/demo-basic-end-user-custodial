// Non-Custodial SDK Wrapper Demo
// This wraps the @muralpay/browser-sdk for testing

import { EndUserCustodialSDK } from '@muralpay/browser-sdk';
import { MURAL_API_CONFIG } from './config';

// Mural API Client for making API calls
export class MuralApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = MURAL_API_CONFIG.API_URL!;
    this.apiKey = MURAL_API_CONFIG.API_KEY!;
    console.log('MuralApiClient initialized with config');
  }

  // Create a non-custodial organization
  async createEndUserCustodialOrg(payload: any, onBehalfOf?: string): Promise<any> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };

      if (onBehalfOf) {
        headers['on-behalf-of'] = onBehalfOf;
      }

      const response = await fetch(`${this.baseUrl}/api/organizations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create organization:', error);
      throw error;
    }
  }

  // Initiate a non-custodial challenge
  // Note: approverId should be the approver.id from the individual's approver object,
  // NOT the organization ID. The orgId is used for the on-behalf-of header.
  async initiateChallenge(payload: { publicKey: string, approverId: string }, orgId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/approvers/end-user-custodial/initiate-challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'on-behalf-of': orgId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to initiate challenge:', error);
      throw error;
    }
  }

  // Get payout request body to sign
  async getPayoutRequestBody(payoutId: string, orgId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payouts/payout/end-user-custodial/body-to-sign/${payoutId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'on-behalf-of': orgId
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get payout request body:', error);
      throw error;
    }
  }

  // Execute a non-custodial payout
  async executeEndUserCustodialPayout(payoutId: string, signature: string, orgId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payouts/payout/end-user-custodial/execute/${payoutId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'on-behalf-of': orgId
        },
        body: JSON.stringify({ signature })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to execute payout:', error);
      throw error;
    }
  }

  // Get the Terms of Service link for an organization
  async getOrganizationTosLink(orgId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/organizations/${orgId}/tos-link`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data.tosLink;
    } catch (error) {
      console.error('Failed to get TOS link:', error);
      throw error;
    }
  }

  // Get organization details
  async getOrganization(orgId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/organizations/${orgId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get organization details:', error);
      throw error;
    }
  }

  // Get the KYC link for an organization
  async getOrganizationKycLink(orgId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/organizations/${orgId}/kyc-link`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data.kycLink;
    } catch (error) {
      console.error('Failed to get KYC link:', error);
      throw error;
    }
  }

  // Create a payout request
  async createPayout(payload: any, orgId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payouts/payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'on-behalf-of': orgId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create payout:', error);
      throw error;
    }
  }

  // Create an account
  async createAccount(payload: { name: string; description?: string }, orgId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'on-behalf-of': orgId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  }

  // Get all accounts
  async getAccounts(orgId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/accounts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'on-behalf-of': orgId
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get accounts:', error);
      throw error;
    }
  }

  // Get account by ID
  async getAccount(accountId: string, orgId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/accounts/${accountId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'on-behalf-of': orgId
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get account:', error);
      throw error;
    }
  }
}

export class EndUserCustodialSDKWrapper {
  private sdk: EndUserCustodialSDK | null = null;
  private iframeElement: HTMLElement | null = null;

  constructor() {
    console.log('EndUserCustodialSDKWrapper initialized');
  }

  async initialize(iframeContainerId: string = 'auth-iframe-container-id') {
    try {
      // Create iframe container if it doesn't exist
      this.iframeElement = document.getElementById(iframeContainerId);
      if (!this.iframeElement) {
        this.iframeElement = document.createElement('div');
        this.iframeElement.id = iframeContainerId;
        this.iframeElement.style.display = 'none'; // Hide the iframe for demo
        document.body.appendChild(this.iframeElement);
      }

      console.log('Creating EndUserCustodialSDK instance...');
      this.sdk = await EndUserCustodialSDK.createInstance({
        iframeElement: this.iframeElement,
        iframeContainerId: iframeContainerId,
      });

      console.log('SDK wrapper ready for initialization');
      return true;
    } catch (error) {
      console.error('Failed to initialize SDK:', error);
      return false;
    }
  }

  // Get the public key for email auth flow
  getPublicKey(): string | null {
    if (!this.sdk) {
      console.error('SDK not initialized');
      return null;
    }
    try {
      const publicKey = this.sdk.getPublicKey();
      console.log('Public key retrieved:', publicKey);
      return publicKey;
    } catch (error) {
      console.error('Failed to get public key:', error);
      return null;
    }
  }

  // Start a session with the SDK
  async startSession(payload: { code: string; authenticatorId: string }) {
    if (!this.sdk) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }
    
    console.log('Starting session with payload:', payload);
    try {
      await this.sdk.startSession(payload);
      console.log('Session started successfully');
      return true;
    } catch (error) {
      console.error('Failed to start session:', error);
      throw error;
    }
  }

  // Check if session is active
  isSessionActive(): boolean {
    if (!this.sdk) {
      console.log('SDK not initialized');
      return false;
    }
    
    const isActive = this.sdk.isSessionActive();
    console.log('Session active:', isActive);
    return isActive;
  }

  // Clear the current session
  clearSession(): void {
    if (!this.sdk) {
      console.log('SDK not initialized');
      return;
    }
    
    console.log('Clearing session...');
    this.sdk.clearSession();
    console.log('Session cleared');
  }

  // Get session expiry
  getSessionExpiry(): Date | null {
    if (!this.sdk) {
      console.log('SDK not initialized');
      return null;
    }
    
    const expiry = this.sdk.getClientSessionExpiry();
    console.log('Session expiry:', expiry);
    return expiry;
  }

  // Sign a payout payload
  async signPayoutPayload(payload: any): Promise<string | null> {
    if (!this.sdk) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }
    
    console.log('Signing payout payload:', payload);
    try {
      const signature = await this.sdk.signPayoutPayload(payload);
      console.log('Payload signed successfully');
      return signature;
    } catch (error) {
      console.error('Failed to sign payout payload:', error);
      throw error;
    }
  }

  getStatus() {
    const status = {
      initialized: this.sdk !== null,
      sessionActive: this.isSessionActive(),
      sessionExpiry: this.getSessionExpiry(),
      publicKey: this.sdk ? this.getPublicKey() : null,
    };
    console.log('SDK status:', status);
    return status;
  }
}

export default EndUserCustodialSDKWrapper; 

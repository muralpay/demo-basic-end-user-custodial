import React from 'react';
import { CreateOrganizationStep } from '../src/components/steps/CreateOrganizationStep';
import { InitiateChallengeStep } from '../src/components/steps/InitiateChallengeStep';
import { useEndUserCustodialContext } from '../src/context/EndUserCustodialContext';
import { MuralApiClient } from '../src/index';

jest.mock('../src/context/EndUserCustodialContext', () => ({
  useEndUserCustodialContext: jest.fn(),
}));
jest.mock('../src/index', () => ({
  MuralApiClient: jest.fn(),
}));

// ---- Test helpers ----
interface TestElement {
  type: unknown;
  props: {
    children?: React.ReactNode;
    actions?: React.ReactNode;
    name?: string;
    value?: number;
    onChange?: () => void;
    onClick?: () => Promise<void>;
  };
}

/** Inspect the component's rendered callbacks without involving the SDK or network. */
function findElement(
  node: React.ReactNode,
  matches: (element: TestElement) => boolean,
): TestElement | undefined {
  for (const child of React.Children.toArray(node)) {
    if (!React.isValidElement(child)) continue;
    const element = child as unknown as TestElement;
    if (matches(element)) return element;
    const nested = findElement(element.props.children, matches)
      || findElement(element.props.actions, matches);
    if (nested) return nested;
  }
  return undefined;
}
// ---- End test helpers ----

const approvers = [
  { id: 'approver-john', name: 'John', email: 'john@example.com' },
  { id: 'approver-jane', name: 'Jane', email: 'jane@example.com' },
];

/** Exercise the selection callback and then the real challenge submission callback. */
async function initiateForSelection(indices: number[]) {
  const challenge = jest.fn().mockResolvedValue({ authenticatorId: 'authenticator' });
  (MuralApiClient as jest.Mock).mockImplementation(() => ({ initiateChallenge: challenge }));
  const state = {
    orgType: 'endUserCustodialBusiness',
    orgId: 'organization',
    approverId: approvers[0].id,
    approversList: approvers,
    selectedApproverIndex: 0,
    currentStep: 5,
    completedSteps: new Array(14).fill(false),
    loadingStates: new Array(14).fill(false),
    wrapper: { getPublicKey: () => 'public-key' },
    addLog: jest.fn(),
    markStepComplete: jest.fn(),
    setStepLoading: jest.fn(),
    setAuthenticatorId: jest.fn(),
    setSelectedApproverIndex: (index: number) => { state.selectedApproverIndex = index; },
    setApproverId: (id: string) => { state.approverId = id; },
  };
  (useEndUserCustodialContext as jest.Mock).mockImplementation(() => state);

  for (const index of indices) {
    const organization = await CreateOrganizationStep({ stepNumber: 1 });
    const radio = findElement(organization, element =>
      element.type === 'input'
      && element.props.name === 'selectedApprover'
      && element.props.value === index);
    expect(radio).toBeDefined();
    radio!.props.onChange!();
  }

  const challengeStep = await InitiateChallengeStep({ stepNumber: 5 });
  const button = findElement(challengeStep, element => Boolean(element.props.onClick));
  expect(button).toBeDefined();
  await button!.props.onClick!();
  return { state, challenge };
}

test('choosing the second business approver challenges that approver', async () => {
  const { state, challenge } = await initiateForSelection([1]);
  expect(state.selectedApproverIndex).toBe(1);
  expect(challenge).toHaveBeenCalledWith(
    { publicKey: 'public-key', approverId: 'approver-jane' }, 'organization');
  expect(state.approverId).toBe('approver-jane');
});

test('switching back challenges the currently selected approver', async () => {
  const { state, challenge } = await initiateForSelection([1, 0]);
  expect(state.selectedApproverIndex).toBe(0);
  expect(state.approverId).toBe('approver-john');
  expect(challenge).toHaveBeenCalledWith(
    { publicKey: 'public-key', approverId: 'approver-john' }, 'organization');
});

test('the first approver remains the default without a selection', async () => {
  const { challenge } = await initiateForSelection([]);
  expect(challenge).toHaveBeenCalledWith(
    { publicKey: 'public-key', approverId: 'approver-john' }, 'organization');
});

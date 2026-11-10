import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  canSign,
  groupContractsByOrganization,
  isValidOtp,
  resolveReturnPath,
} from '../src/services/identity/identity-contract/contract-signing.js';

const pendingContract = {
  status: { name: 'pending_signature' },
  signers: [
    { identity: 'person-1', status: 'pending' },
    { identity: 'person-2', status: 'signed' },
  ],
};

test('only a pending signer of a contract awaiting signature can sign', () => {
  assert.equal(canSign(pendingContract, 'person-1'), true);
  assert.equal(canSign(pendingContract, 'person-2'), false);
  assert.equal(canSign(pendingContract, 'stranger'), false);
  assert.equal(canSign({ ...pendingContract, status: { name: 'signed' } }, 'person-1'), false);
  assert.equal(canSign(null, 'person-1'), false);
});

test('the OTP is exactly six digits', () => {
  assert.equal(isValidOtp('123456'), true);
  assert.equal(isValidOtp(' 123456 '), true);
  assert.equal(isValidOtp('12345'), false);
  assert.equal(isValidOtp('12a456'), false);
  assert.equal(isValidOtp(''), false);
});

test('return_path stays inside trusted origins', () => {
  const options = { currentOrigin: 'https://id.example.com', allowedOrigins: ['https://app.example.com'] };

  assert.equal(resolveReturnPath('/payroll/contracts', options), '/payroll/contracts');
  assert.equal(resolveReturnPath('https://app.example.com/apps/x', options), 'https://app.example.com/apps/x');
  assert.equal(resolveReturnPath('//evil.com/x', options), null);
  assert.equal(resolveReturnPath('/\\evil.com', options), null);
  assert.equal(resolveReturnPath('https://evil.com/x', options), null);
  assert.equal(resolveReturnPath('javascript:alert(1)', options), null);
  assert.equal(resolveReturnPath('', options), null);
});

test('contracts are grouped by organization keeping order', () => {
  const groups = groupContractsByOrganization([
    { id: 'a', organization_id: 'org-1', organization_name: 'One' },
    { id: 'b', organization_id: 'org-2', organization_name: 'Two' },
    { id: 'c', organization_id: 'org-1', organization_name: 'One' },
  ]);

  assert.equal(groups.length, 2);
  assert.deepEqual(groups[0].contracts.map((contract) => contract.id), ['a', 'c']);
});

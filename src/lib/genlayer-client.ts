import { createClient, createAccount } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { CONTRACT_ADDRESS } from './constants';

const PRIVATE_KEY_STORAGE_KEY = 'opsverdict:private_key';

export function getOrCreatePrivateKey(): `0x${string}` {
  if (typeof window === 'undefined') {
    const { generatePrivateKey } = require('genlayer-js');
    return generatePrivateKey();
  }
  let pk = localStorage.getItem(PRIVATE_KEY_STORAGE_KEY);
  if (!pk) {
    const { generatePrivateKey } = require('genlayer-js');
    pk = generatePrivateKey();
    localStorage.setItem(PRIVATE_KEY_STORAGE_KEY, pk);
  }
  return pk as `0x${string}`;
}

export function getReadClient() {
  return createClient({ chain: studionet });
}

export function getWriteClient() {
  const pk = getOrCreatePrivateKey();
  const account = createAccount(pk);
  return { client: createClient({ chain: studionet, account }), account };
}

export function getAccountAddress(): string {
  const pk = getOrCreatePrivateKey();
  const account = createAccount(pk);
  return account.address;
}

export async function readContract(method: string, args: any[] = []) {
  const client = getReadClient();
  return client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
  });
}

export async function writeContract(method: string, args: any[] = []) {
  const { client } = getWriteClient();
  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
    value: BigInt(0),
  });
  return hash;
}

export { CONTRACT_ADDRESS };

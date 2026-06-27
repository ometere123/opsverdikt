import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { CONTRACT_ADDRESS } from './constants';

export function getReadClient() {
  return createClient({ chain: studionet });
}

export function getWriteClient(address: `0x${string}`) {
  const provider = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
  if (!provider) throw new Error('No injected wallet found. Install MetaMask or another wallet.');

  return createClient({
    chain: studionet,
    account: address,
    provider,
  } as any);
}

export async function readContract(method: string, args: any[] = []) {
  const client = getReadClient();
  return client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
  });
}

export async function writeContract(account: `0x${string}`, method: string, args: any[] = []) {
  const client = getWriteClient(account);
  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
    value: BigInt(0),
  });
  return hash;
}

export { CONTRACT_ADDRESS };

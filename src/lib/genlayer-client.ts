import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { CONTRACT_ADDRESS } from './constants';

export function getClient() {
  return createClient({ chain: studionet });
}

export async function readContract(method: string, args: any[] = []) {
  const client = getClient();
  return client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
  });
}

export async function writeContract(method: string, args: any[] = []) {
  const client = getClient();
  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
    value: BigInt(0),
  });
  return hash;
}

export { CONTRACT_ADDRESS };

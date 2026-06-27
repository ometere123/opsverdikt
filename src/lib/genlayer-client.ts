import { createClient, createAccount } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { CONTRACT_ADDRESS } from './constants';

export function getReadClient() {
  return createClient({ chain: studionet });
}

export function getWriteClient(privateKey?: `0x${string}`) {
  const account = privateKey ? createAccount(privateKey) : createAccount();
  return createClient({ chain: studionet, account });
}

export async function readContract(method: string, args: any[] = []) {
  const client = getReadClient();
  const result = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
  });
  return result;
}

export async function writeContract(
  _account: `0x${string}`,
  method: string,
  args: any[] = [],
) {
  const client = getReadClient();
  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: method,
    args,
    value: BigInt(0),
  });
  return hash;
}

export { CONTRACT_ADDRESS };

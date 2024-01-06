import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Op = { 'burn' : { 'amount' : bigint } } |
  { 'mint' : null } |
  { 'transfer' : { 'to' : Principal, 'amount' : bigint } };
export interface _SERVICE {
  'balance_of' : ActorMethod<[Principal], bigint>,
  'export' : ActorMethod<[[] | [Principal]], Array<[Principal, bigint]>>,
  'getlog' : ActorMethod<[], Array<string>>,
  'op' : ActorMethod<[Op], undefined>,
  'stats' : ActorMethod<[], [bigint, bigint, bigint]>,
}

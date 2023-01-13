import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdText = string;
export type AccountIdText__1 = string;
export type Balance = { 'e6s' : bigint } |
  { 'e8s' : bigint };
export interface Comment {
  'ctime' : bigint,
  'user' : Principal,
  'comment' : string,
}
export type Currency = { 'ICP' : null } |
  { 'ICET' : null };
export type Currency__1 = { 'ICP' : null } |
  { 'ICET' : null };
export interface EscrowAccount { 'id' : AccountIdText, 'index' : Subaccount }
export interface EscrowService {
  'accountBalance' : ActorMethod<[AccountIdText__1, Currency__1], Balance>,
  'availableCycles' : ActorMethod<[], bigint>,
  'cancel' : ActorMethod<[bigint], Result>,
  'changeItemStatus' : ActorMethod<[bigint, ItemStatus], Result>,
  'close' : ActorMethod<[bigint], Result>,
  'comment' : ActorMethod<[bigint, string], Result>,
  'create' : ActorMethod<[NewOrder], Result>,
  'deleteItem' : ActorMethod<[bigint], Result>,
  'deliver' : ActorMethod<[bigint], Result>,
  'deposit' : ActorMethod<[bigint], Result>,
  'getAccountId' : ActorMethod<[bigint], string>,
  'getAllOrders' : ActorMethod<[bigint], Array<Order>>,
  'getBackupItems' : ActorMethod<[], Array<U_Item>>,
  'getBalanceBySub' : ActorMethod<[bigint, Currency__1], Balance>,
  'getItem' : ActorMethod<[bigint], [] | [Item]>,
  'getItemsSize' : ActorMethod<[], bigint>,
  'getMyAccountId' : ActorMethod<[bigint], string>,
  'getMyBalanceBySub' : ActorMethod<[bigint, Currency__1], Balance>,
  'getMyItems' : ActorMethod<[bigint], Array<Item>>,
  'getOrder' : ActorMethod<[bigint], [] | [Order]>,
  'getOrders' : ActorMethod<[], Array<Order>>,
  'getSystemData' : ActorMethod<
    [],
    { 'memory' : bigint, 'heap' : bigint, 'cycles' : bigint }
  >,
  'listItem' : ActorMethod<[NewItem], Result>,
  'receive' : ActorMethod<[bigint], Result>,
  'refund' : ActorMethod<[bigint], Result>,
  'release' : ActorMethod<[bigint], Result>,
  'searchItems' : ActorMethod<[Itype, bigint], Array<Item>>,
}
export interface Item {
  'id' : bigint,
  'status' : ItemStatus,
  'listime' : bigint,
  'owner' : Principal,
  'name' : string,
  'description' : string,
  'currency' : { 'ICP' : null } |
    { 'ICET' : null },
  'image' : string,
  'itype' : Itype,
  'price' : bigint,
}
export type ItemStatus = { 'pending' : null } |
  { 'list' : null } |
  { 'sold' : null } |
  { 'unlist' : null };
export type Itype = { 'nft' : null } |
  { 'service' : null } |
  { 'merchandise' : null } |
  { 'other' : null } |
  { 'coin' : null };
export interface Log {
  'log' : string,
  'logger' : { 'seller' : null } |
    { 'buyer' : null } |
    { 'escrow' : null },
  'ltime' : bigint,
}
export interface NewItem {
  'status' : ItemStatus,
  'name' : string,
  'description' : string,
  'currency' : { 'ICP' : null } |
    { 'ICET' : null },
  'image' : string,
  'itype' : Itype,
  'price' : bigint,
}
export interface NewOrder {
  'memo' : string,
  'seller' : Principal,
  'expiration' : bigint,
  'currency' : Currency,
  'amount' : bigint,
}
export interface Order {
  'id' : bigint,
  'status' : Status,
  'blockout' : bigint,
  'updatetime' : bigint,
  'blockin' : bigint,
  'logs' : Array<Log>,
  'memo' : string,
  'seller' : Principal,
  'createtime' : bigint,
  'expiration' : bigint,
  'currency' : Currency,
  'lockedby' : Principal,
  'account' : EscrowAccount,
  'buyer' : Principal,
  'comments' : Array<Comment>,
  'amount' : bigint,
}
export type Result = { 'ok' : bigint } |
  { 'err' : string };
export type Status = { 'new' : null } |
  { 'deposited' : null } |
  { 'closed' : null } |
  { 'canceled' : null } |
  { 'refunded' : null } |
  { 'released' : null } |
  { 'delivered' : null } |
  { 'received' : null };
export type Subaccount = bigint;
export interface U_Item {
  'id' : bigint,
  'status' : U_Status,
  'listime' : bigint,
  'owner' : Principal,
  'name' : string,
  'currency' : { 'ICP' : null } |
    { 'ICET' : null },
  'image' : string,
  'itype' : U_Itype,
  'price' : bigint,
}
export type U_Itype = { 'NFT' : null } |
  { 'MERCHANDIS' : null } |
  { 'SERVICE' : null } |
  { 'OTHER' : null };
export type U_Status = { 'list' : null } |
  { 'sold' : null } |
  { 'locked' : Principal };
export interface _SERVICE extends EscrowService {}

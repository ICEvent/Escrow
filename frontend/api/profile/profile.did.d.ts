import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Canister {
  'desc' : string,
  'name' : string,
  'posts' : string,
  'canisterid' : Principal,
  'gallery' : string,
}
export interface Favorite {
  'owner' : Principal,
  'name' : string,
  'address' : string,
}
export interface Inbox { 'owner' : Principal, 'inboxid' : string }
export interface Link { 'url' : string, 'name' : string }
export type Network = { 'ic' : null } |
  { 'ethereum' : null } |
  { 'bitcoin' : null };
export interface NewProfile {
  'id' : string,
  'bio' : string,
  'pfp' : string,
  'name' : string,
}
export interface Profile {
  'id' : string,
  'bio' : string,
  'pfp' : string,
  'owner' : Principal,
  'name' : string,
  'createtime' : bigint,
  'links' : Array<Link>,
}
export type Result = { 'ok' : bigint } |
  { 'err' : string };
export type Result_1 = { 'ok' : Favorite } |
  { 'err' : string };
export interface UpdateProfile {
  'bio' : string,
  'pfp' : string,
  'name' : string,
}
export interface Wallet {
  'name' : string,
  'addresses' : Array<{ 'network' : Network, 'address' : string }>,
}
export interface _SERVICE {
  'addAdmin' : ActorMethod<[string], Result>,
  'addFavorite' : ActorMethod<
    [{ 'name' : string, 'address' : string }],
    Result_1
  >,
  'addFeaturedProfile' : ActorMethod<[string], Result>,
  'addInbox' : ActorMethod<[string], Result>,
  'addLink' : ActorMethod<[string, Link], Result>,
  'addWallet' : ActorMethod<[string, Wallet], Result>,
  'availableCycles' : ActorMethod<[], bigint>,
  'changeId' : ActorMethod<[string, string], Result>,
  'createProfile' : ActorMethod<[NewProfile], Result>,
  'deleteLink' : ActorMethod<[string, string], Result>,
  'editCanister' : ActorMethod<[Canister], Result>,
  'getDefaultProfiles' : ActorMethod<[bigint], Array<Profile>>,
  'getInbox' : ActorMethod<[string], [] | [Inbox]>,
  'getMyCanister' : ActorMethod<[], [] | [Canister]>,
  'getMyFavorites' : ActorMethod<[], Array<Favorite>>,
  'getMyInbox' : ActorMethod<[], [] | [Inbox]>,
  'getMyProfile' : ActorMethod<[], [] | [Profile]>,
  'getProfile' : ActorMethod<[string], [] | [Profile]>,
  'getProfileByPrincipal' : ActorMethod<[string], [] | [Profile]>,
  'getProfileCanister' : ActorMethod<[Principal], [] | [Canister]>,
  'getProfileCount' : ActorMethod<[], bigint>,
  'getProfiles' : ActorMethod<[bigint, bigint], Array<Profile>>,
  'removeFeaturedProfile' : ActorMethod<[string], Result>,
  'reserveid' : ActorMethod<[string], Result>,
  'searchProfilesByName' : ActorMethod<[string], Array<Profile>>,
  'updateProfile' : ActorMethod<[string, UpdateProfile], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

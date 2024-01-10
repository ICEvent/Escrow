import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Link { 'url' : string, 'name' : string }
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
export interface UpdateProfile {
  'bio' : string,
  'pfp' : string,
  'name' : string,
}
export interface _SERVICE {
  'addLink' : ActorMethod<[string, Link], Result>,
  'createProfile' : ActorMethod<[NewProfile], Result>,
  'deleteLink' : ActorMethod<[string, string], Result>,
  'dumpProfiles' : ActorMethod<[], Array<[string, Profile]>>,
  'dumpUserProfiles' : ActorMethod<[], Array<[Principal, string]>>,
  'getMyProfile' : ActorMethod<[], [] | [Profile]>,
  'getProfile' : ActorMethod<[string], [] | [Profile]>,
  'listProfiles' : ActorMethod<[], Array<Profile>>,
  'updateProfile' : ActorMethod<[string, UpdateProfile], Result>,
}

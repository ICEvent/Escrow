import { Actor, HttpAgent } from "@dfinity/agent";
import { CANISTER_ONEBLOCK } from "../../lib/constants";

// Imports and re-exports candid interface
import { idlFactory } from "./profile.did.js";
export { idlFactory } from "./profile.did.js";

// CANISTER_ID is replaced by webpack based on node environment
export const canisterId =  process.env.PROFILE_CANISTER_ID;

export const createActor = (agent,actorOptions) => {
  // const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  // if (agent && actorOptions) {
  //   console.warn(
  //     "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
  //   );
  // }

  // Fetch root key for certificate validation during development
  // if (process.env.DFX_NETWORK !== "ic") {
  //   agent.fetchRootKey().catch((err) => {
  //     console.warn(
  //       "Unable to fetch root key. Check to ensure that your local replica is running"
  //     );
  //     console.error(err);
  //   });
  // }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    actorOptions,
  });
};

export const profile = createActor(canisterId);

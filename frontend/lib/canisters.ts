import { HttpAgent } from "@dfinity/agent";

export const HOST = "https://ic0.app";

export const IDENTITY_PROVIDER = 'https://identity.ic0.app';

export const defaultAgent = new HttpAgent({
  host: HOST,
});

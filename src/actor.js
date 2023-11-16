import { Actor, HttpAgent } from "@dfinity/agent";
import {
  idlFactory,
  canisterId,
} from "dfx-generated/recipe_book";

const agent = new HttpAgent();
const actor = Actor.createActor(idlFactory, { agent, canisterId });

export default actor;
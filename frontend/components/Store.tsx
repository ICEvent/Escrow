import React, { createContext, useContext, useReducer } from "react"

import { Actor, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import { defaultAgent } from "../lib/canisters"

import ONEBLOCKService from "../api/profile/profile.did"
import * as ONEBLOCK from "../api/profile/index"

import ESCROWService from "../api/escrow/escrow.did"
import * as ESCROW from "../api/escrow/index"

import INDEXERService from "../api/indexer/indexer.did";
import * as INDEXER from "../api/indexer/index";

import CKETHService from "../api/cketh/cketh.did";
import * as CKETH from "../api/cketh/index";

export type State = {
  agent: HttpAgent
  cketh: ActorSubclass<CKETHService._SERVICE>
  oneblock: ActorSubclass<ONEBLOCKService._SERVICE>
  escrow: ActorSubclass<ESCROWService._SERVICE>
  indexer: ActorSubclass<INDEXERService._SERVICE>
  isAuthed: boolean
  principal: Principal | null
  loading: Boolean
  menu: String
}

const createActors = (agent: HttpAgent = defaultAgent) => ({
  oneblock: ONEBLOCK.createActor(agent),
  cketh : CKETH.createActor(agent, { actorOptions: {} }),
  escrow: ESCROW.createActor(agent, { actorOptions: {} }),
  indexer: INDEXER.createActor(agent, { actorOptions: {} })
});

const initialState: State = {
  ...createActors(),
  agent: defaultAgent,
  isAuthed: false,
  principal: null,
  loading: false,
  menu: "home",
}

type Action =
  | {
      type: "SET_AGENT"
      agent: HttpAgent | null
      isAuthed?: boolean
    }
  | {
      type: "SET_PRINCIPAL"
      principal: Principal
    }
  | {
      type: "SET_IDENTITY"
      identity: Identity
    }
  | {
      type: "SET_LOADING"
      loading: Boolean
    }
  | {
      type: "SET_MENU"
      menu: String
    }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_AGENT":
      const agent = action.agent || defaultAgent
      return {
        ...state,
        ...createActors(agent),
        agent,
        isAuthed: !!action.isAuthed,
      }
    case "SET_PRINCIPAL":
      return {
        ...state,
        principal: action.principal,
      }
   
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      }
    case "SET_MENU":
      return {
        ...state,
        menu: action.menu,
      }
    default:
      return { ...state }
  }
}

const Context = createContext({
  state: initialState,
  dispatch: (_: Action) => null,
})

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(Context)
  if (context === undefined) {
    console.log("context is undefined")
    throw new Error("useGlobalContext must be used within a CountProvider")
  }
  return context
}

export const useCKETH = () => {
  const context = useGlobalContext()
  return context.state.cketh
}
export const useOneblock = () => {
  const context = useGlobalContext()
  return context.state.oneblock
}

export const useEscrow = () => {
  const context = useGlobalContext()
  return context.state.escrow
}

export const useIndexer = () =>{
  const context = useGlobalContext()
  return context.state.indexer
};

export const useSetAgent = () => {
  const { dispatch } = useGlobalContext()

  return async ({
    agent,
    isAuthed,
  }: {
    agent: HttpAgent
    isAuthed?: boolean
  }) => {
    dispatch({ type: "SET_AGENT", agent, isAuthed })

    if (isAuthed) {
      const principal = await agent.getPrincipal()
      console.log("authed", principal.toText())

      dispatch({
        type: "SET_PRINCIPAL",
        principal,
      })
    } else {
      dispatch({ type: "SET_PRINCIPAL", principal: null })
      console.log("not authed")
    }
  }
}

export const useSetIdentity = () => {
  const { dispatch } = useGlobalContext()
  return async (identity: Identity) => {
    console.log("set identity",identity)
    dispatch({
      type: "SET_IDENTITY",
      identity,
    })
  }
}


export const useLoading = () => {
  const { dispatch, state } = useGlobalContext()
  return {
    loading: state.loading,
    setLoading: (loading: Boolean) => {
      dispatch({
        type: "SET_LOADING",
        loading,
      })
    },
  }
}

export const useMenu = () => {
  const { dispatch, state } = useGlobalContext()
  return {
    menu: state.menu,
    setMenu: (menu: String) => {
      dispatch({
        type: "SET_MENU",
        menu,
      })
    },
  }
}

export default Store

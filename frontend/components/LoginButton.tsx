import React, { useState, useEffect } from "react"
import { HttpAgent } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import PlugConnect from "@psychedelic/plug-connect"
import {
  WHITELIST,
  IDENTITY_PROVIDER_NFID,
  DERIVATION_ORIGION,
  APP_LOGO,
  ONE_WEEK_NS,
  IDENTITY_PROVIDER_IC,
} from "../lib/constants"
import GoogleIcon from "@mui/icons-material/Google"

import { useGlobalContext, useSetAgent ,useSetIdentity} from "../components/Store"
const HOST = "https://ic0.app"

const DropdownMenu: React.FC = () => {
  const setIdentity = useSetIdentity();
  const setAgent = useSetAgent()
  const [authClient, setAuthClient] = useState<any>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  useEffect(() => {
    (async () => {
      const authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true,
        },
      })
      setAuthClient(authClient)

      // if (await window?.ic?.plug?.isConnected()) {
      //   if (!window.ic.plug.agent) {
      //     await window.ic.plug.createAgent({
      //       whitelist: WHITELIST,
      //       host: HOST,
      //     });
      //   }
      //   handlePlugLogin();
      // } else {
      if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient)
      }
      // }
    })()
  }, [])
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const DfinityIcon = () => (
    <img
      src="/assets/dfinity.png"
      alt="Menu"
      style={{ width: 24, height: 24 }}
    />
  )
  const handleAuthenticated = async (authClient) => {
    // auth.signin(authClient,()=>{});
    const identity = authClient.getIdentity()
    console.log("get identity: ", identity)
    setIdentity(identity);
    setAgent({
      agent: new HttpAgent({
        identity,
        host: HOST,
      }),
      isAuthed: true,
    })
  }

  const [showIILogin, setShowIILogin] = useState(false)

  const APPLICATION_NAME = "ICEvent"
  const APPLICATION_LOGO_URL = APP_LOGO

  const AUTH_PATH =
    "/authenticate/?applicationName=" +
    APPLICATION_NAME +
    "&applicationLogo=" +
    APPLICATION_LOGO_URL +
    "#authorize"

  const handleNFIDLogin = async () => {
    authClient.login({
      identityProvider: IDENTITY_PROVIDER_NFID + AUTH_PATH,
      maxTimeToLive: ONE_WEEK_NS,
      // derivationOrigin: DERIVATION_ORIGION,
      windowOpenerFeatures:
        `left=${window.screen.width / 2 - 525}, ` +
        `top=${window.screen.height / 2 - 705},` +
        `toolbar=0,location=0,menubar=0,width=525,height=705`,
      onSuccess: () => {handleLogin()},
    })
  }

  const handleIILogin = async () => {

    authClient.login({
      // derivationOrigin: DERIVATION_ORIGION,
      identityProvider: IDENTITY_PROVIDER_IC,
      maxTimeToLive: ONE_WEEK_NS,
      onSuccess: () => {handleLogin()},
    })
  }
  const handlePlugLogin = async () => {

    setAgent({
      agent: await window?.ic?.plug?.agent,
      isAuthed: true,
    })
    // navigate('/profile', { replace: true })
    // closeModal();
  }

  async function handleLogin() {
    const authClient = await AuthClient.create(
      {
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      }
    );
    setAuthClient(authClient);

    if (await authClient.isAuthenticated()) {
      handleAuthenticated(authClient);
    };
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Login
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleIILogin}>
          <ListItemIcon>
            <DfinityIcon />
          </ListItemIcon>
          Internet Identity
        </MenuItem>
        <MenuItem onClick={handleNFIDLogin}>
          <ListItemIcon>
            <GoogleIcon />
          </ListItemIcon>
          NFID - Gmail
        </MenuItem>
        <MenuItem >
          <PlugConnect
            whitelist={WHITELIST}
            host={HOST}
            onConnectCallback={handlePlugLogin}
          />
        </MenuItem>
      </Menu>
    </div>
  )
}

export default DropdownMenu

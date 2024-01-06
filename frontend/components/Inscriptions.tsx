import React, { useEffect, useId, useState } from "react"
import { TextField, Button, Alert, Grid } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import IconButton from "@mui/material/IconButton"
import InputAdornment from '@mui/material/InputAdornment';
import { Box } from "@mui/system"
import { Principal } from "@dfinity/principal"

import { useGlobalContext, useLoading , useIdentity, useIndexer, useCKETH} from "./Store"
import icblast from "@infu/icblast"
import {
  CANISTER_CKETH_INDEXER,
  CANISTER_ICRC_CKETH,
  ckETH_DECIMALS,
  ckETH_FEE,
} from "../lib/constants"
export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

const MyForm: React.FC = () => {

    const identity = useIdentity();
    const ckethActor = useCKETH();
    const indexer = useIndexer();
  const { setLoading } = useLoading()
  const [notice, setNotice] = useState<string | null>()
  const [userid, setUserid] = useState<string>("")
  const [toUserid, setToUserid] = useState<string>("")
  const [sendAmmount, setSendAmount] = useState(1)
  const [balance, setBalance] = useState(0)
  const [ckethBalance, setCkethBalance] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const [openTransferForm, setOpenTransferForm] = useState(false)

  const {
    state: { isAuthed, principal },
  } = useGlobalContext()

  let ic = icblast({identity:identity})

  useEffect(() => {
    if (isAuthed) {
      setUserid(principal.toString())
      loadWallet(principal.toString())
      console.log(identity)
    }
  }, [principal])

  async function loadWallet(uid: string) {
    setLoading(true)
    let indexer = await ic(CANISTER_CKETH_INDEXER)
    let b = await indexer.balance_of(uid)
    setBalance(parseInt(b))

    let cketh = await ic(CANISTER_ICRC_CKETH)
    let eth = await cketh.icrc1_balance_of({ owner: uid })
    setCkethBalance(parseInt(eth))
    //check allowance
    let { allowance, expires_at } = await cketh.icrc2_allowance({
      account: { owner: uid },
      spender: { owner: CANISTER_CKETH_INDEXER },
    })
    console.log("allowance", allowance)
    setAllowance(parseInt(allowance))
    setLoading(false)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotice(null)
    let name = event.target.name
    let value = event.target.value
    if (name == "userid") {
      setUserid(value)
    } else if (name == "toUserid") {
      setToUserid(value)
    } else if (name == "sendAmount") {
      setSendAmount(parseInt(value))
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle the form submission
    console.log(userid)
  }
  async function check() {
    setLoading(true)
    let indexer = await ic(CANISTER_CKETH_INDEXER)
    let b = await indexer.balance_of(userid)
    setBalance(parseInt(b))
    setLoading(false)
  }

  async function approve() {
    setNotice(null)
    setLoading(true)
    try {
      let cketh = await ic(CANISTER_ICRC_CKETH)
      let p = Principal.fromText(CANISTER_CKETH_INDEXER);
      console.log(p)
      await ckethActor.icrc2_approve({
        spender: {
          owner: p,
          'subaccount' : [] 
        },
        'fee' : [],
          'memo' : [],
          'from_subaccount' : [] ,
          'created_at_time' : [] ,
          'amount' : BigInt(ckethBalance),
          'expected_allowance' :[],
          'expires_at' :[]
      })
      //check allowance again
      let { allowance, expires_at } = await cketh.icrc2_allowance({
        account: { owner: userid },
        spender: { owner: CANISTER_CKETH_INDEXER },
      })
      console.log("allowance", allowance)
      setAllowance(parseInt(allowance))
    } catch (err) {
      console.error(err)
      setNotice(Object.getOwnPropertyNames(err)[0])
    }
    setLoading(false)
  }

  async function send() {
    setNotice(null)
    setLoading(true)
    try {
    //   let indexer = await ic(CANISTER_CKETH_INDEXER)
      let res = await indexer.op({
        transfer: { to: Principal.fromText(toUserid), amount: BigInt(sendAmmount) },
      })
    } catch (err) {
      console.error(err)
      setNotice(Object.getOwnPropertyNames(err)[0])
    }
    //reload wallet
    await loadWallet(userid)
    setLoading(false)
  }
  function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    )
  }
  return (
    <form>
      <Alert severity="info">
        ckETH Inscription (login to load your balance or search any principal)
      </Alert>
      <TextField
        label="Principal ID"
        variant="outlined"
        name="userid"
        value={userid}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <TextField
        label="$🍌🍌🍌 Balance"
        variant="outlined"
        
        value={balance}
        style={{ marginBottom: "10px" }}

      />
      <TextField
        label="$ckEth Balance"
        variant="outlined"
        value={ckethBalance / ckETH_DECIMALS}
        style={{ marginBottom: "10px" }}
        
      />
      <Button
        sx={{ mr: 1 }}
        variant="contained"
        color="primary"
        type="button"
        disabled={!userid}
        onClick={check}
      >
        Check Balance
      </Button>

      {isAuthed && <Button
        variant="contained"
        type="button"
        onClick={() => setOpenTransferForm(true)}
        disabled={balance == 0 || ckethBalance == 0}
      >
        transfer
      </Button>}

      <Dialog
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={false}
        open={openTransferForm}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setOpenTransferForm(false)}
        >
          Transfer $GG
        </BootstrapDialogTitle>
        <Box sx={{ m: 1, p: 2 }}>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={16}>
                <TextField
                  label="Send  to Principal ID"
                  variant="outlined"
                  name="toUserid"
                  value={toUserid}
                  onChange={handleInputChange}
                  style={{ marginRight: "10px" }}
                />
                <TextField
                  label="$GIG Amount to send"
                  variant="outlined"
                  name="sendAmount"
                  value={sendAmmount}
                  onChange={handleInputChange}
                  style={{ marginRight: "10px" }}
                />
              </Grid>
              <Grid item xs={16}>
                {allowance == 0 && (
                  <Button
                    sx={{ mr: 1 }}
                    variant="outlined"
                    color="primary"
                    type="button"
                    onClick={approve}
                  >
                    Approve
                  </Button>
                )}
                <Button
                  sx={{ mr: 1 }}
                  variant="outlined"
                  color="primary"
                  type="button"
                  onClick={send}
                  disabled={allowance == 0 || !toUserid || sendAmmount == 0}
                >
                  Send
                </Button>
              </Grid>
              <Grid item xs={16}>
                <Alert style={{ marginTop: "10px" }} severity="info">
                  Indexer allowance : {allowance/ckETH_DECIMALS}
                </Alert>
                {notice && <Alert severity="error">{notice}</Alert>}
              </Grid>
            </Grid>
          </form>
        </Box>
      </Dialog>
    </form>
  )
}

export default MyForm

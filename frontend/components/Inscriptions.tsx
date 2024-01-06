import React, { useEffect, useId, useState } from "react"
import { TextField, Button, Alert, Grid } from "@mui/material"
import moment from "moment"

import CloseIcon from "@mui/icons-material/Close"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItem from "@mui/material/ListItem"
import InputAdornment from "@mui/material/InputAdornment"
import { Box } from "@mui/system"
import { Principal } from "@dfinity/principal"
import { toast } from "react-toastify"
import {
  useGlobalContext,
  useEscrow,
  useLoading,
  useIndexer,
  useCKETH,
} from "./Store"

import {
  CANISTER_CKETH_INDEXER,
  CANISTER_ICRC_CKETH,
  ckETH_DECIMALS,
  ckETH_FEE,
  LEDGER_E8S,
} from "../lib/constants"
export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

const MyForm: React.FC = () => {
  const cketh = useCKETH()
  const indexer = useIndexer()
  const escrow = useEscrow()
  const { setLoading } = useLoading()
  const [notice, setNotice] = useState<string | null>()
  const [holders, setHolders] = useState([])
  const [price, setPrice] = useState<string>("")
  const [userid, setUserid] = useState<string>("")
  const [toUserid, setToUserid] = useState<string>("")
  const [sendAmmount, setSendAmount] = useState(1)
  const [sellAmmount, setSellAmount] = useState(1)

  const [balance, setBalance] = useState(0)
  const [ckethBalance, setCkethBalance] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const [openTransferForm, setOpenTransferForm] = useState(false)
  const [openListForm, setOpenListForm] = useState(false)

  const {
    state: { isAuthed, principal },
  } = useGlobalContext()

  useEffect(() => {
    dump()
  }, [])

  useEffect(() => {
    if (isAuthed) {
      setUserid(principal.toString())
      loadWallet(principal.toString())
    }
    dump()
  }, [principal])

  async function loadWallet(uid: string) {
    setLoading(true)

    let b = await indexer.balance_of(Principal.fromText(uid))
    setBalance(Number(b))

    let eth = await cketh.icrc1_balance_of({
      owner: Principal.fromText(uid),
      subaccount: [],
    })
    setCkethBalance(Number(eth))
    //check allowance
    let { allowance, expires_at } = await cketh.icrc2_allowance({
      account: { owner: Principal.fromText(uid), subaccount: [] },
      spender: {
        owner: Principal.fromText(CANISTER_CKETH_INDEXER),
        subaccount: [],
      },
    })
    console.log("allowance", allowance)
    setAllowance(Number(allowance))
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
    } else if (name == "sellAmount") {
      setSellAmount(parseInt(value))
    } else if (name == "price") {
      setPrice(value)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle the form submission
    console.log(userid)
  }

  // async function check() {
  //   setLoading(true)

  //   let b = await indexer.balance_of(Principal.fromText(userid));
  //   setBalance(Number(b))
  //   setLoading(false)
  // };

  async function approve(amt) {
    setNotice(null)
    setLoading(true)
    try {
      let p = Principal.fromText(CANISTER_CKETH_INDEXER)
      console.log(p)
      await cketh.icrc2_approve({
        spender: {
          owner: p,
          subaccount: [],
        },
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [BigInt(moment().unix())],
        amount: BigInt(amt),
        expected_allowance: [],
        expires_at: [
          amt == 0 ? BigInt(0) : BigInt(moment().add(1, "month").unix()),
        ],
      })
      //check allowance again
      let { allowance, expires_at } = await cketh.icrc2_allowance({
        account: { owner: Principal.fromText(userid), subaccount: [] },
        spender: {
          owner: Principal.fromText(CANISTER_CKETH_INDEXER),
          subaccount: [],
        },
      })
      console.log("allowance", allowance)
      setAllowance(Number(allowance))
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
        transfer: {
          to: Principal.fromText(toUserid),
          amount: BigInt(sendAmmount),
        },
      })
    } catch (err) {
      console.error(err)
      setNotice(Object.getOwnPropertyNames(err)[0])
    }
    //reload wallet
    await loadWallet(userid)
    setLoading(false)
  }

  async function dump() {
    let exp = await indexer.export(userid ? [Principal.fromText(userid)] : [])
    setHolders(exp)
  }

  function listOrder() {
    try {
      setLoading(true)
      escrow
        .listItem({
          name: "APE20",
          description: "",
          image: "",
          itype: { coin: null },
          price: BigInt(parseFloat(price) * LEDGER_E8S),
          currency: { ICP: null },
          status: { list: null },
        })
        .then((res) => {
          setOpenListForm(false)
          setLoading(false)
          if (res["ok"]) {
            toast.success("your order has created!")
          } else {
            toast.error(res["err"].toString())
          }
        })
    } catch (err) {
      setLoading(false)
      toast.error(err.toString())
    }
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

  const holderList = holders.map((h) => (
    <ListItem
      key={h[0].toString()}
      disablePadding
      secondaryAction={
        <ListItemButton role={undefined} dense>
          {Number(h[1])}
        </ListItemButton>
      }
    >
      <ListItemButton role={undefined} dense>
        <ListItemText id={h[0].toString()} primary={h[0].toString()} />
      </ListItemButton>
    </ListItem>
  ))
  return (
    <>
      <Alert sx={{ mt: 2 }} severity="info">
        Inscription on ckETH
      </Alert>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Principal ID"
            variant="outlined"
            name="userid"
            value={userid}
            onChange={handleInputChange}
            sx={{ bgcolor: "background.paper" }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="🍌🍌🍌 $GIG Balance"
            variant="outlined"
            value={balance}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="$ckEth Balance (pay for transaction fee)"
            variant="outlined"
            value={ckethBalance / ckETH_DECIMALS}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            sx={{ mr: 1 }}
            variant="contained"
            color="primary"
            type="button"
            disabled={!userid}
            onClick={() => loadWallet(userid)}
          >
            Check Balance
          </Button>

          {isAuthed && (
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              type="button"
              onClick={() => setOpenTransferForm(true)}
              disabled={balance == 0 || ckethBalance == 0}
            >
              transfer
            </Button>
          )}

          {isAuthed && balance > 0 && (
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              type="button"
              onClick={() => setOpenListForm(true)}
              disabled={balance == 0}
            >
              sell
            </Button>
          )}
        </Grid>
      </Grid>
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
          Transfer $GIG
        </BootstrapDialogTitle>
        <Box sx={{ m: 1, p: 2 }}>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={16}>
                <TextField
                  fullWidth
                  label="Send  to Principal ID"
                  variant="outlined"
                  name="toUserid"
                  value={toUserid}
                  onChange={handleInputChange}
                  style={{ marginRight: "10px" }}
                />
              </Grid>
              <Grid item xs={16}>
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
                  <Tooltip title="Allow GIG ledger to make ckETH ledger transactions for you">
                    <Button
                      sx={{ mr: 1 }}
                      variant="outlined"
                      color="primary"
                      type="button"
                      onClick={() => approve(ckethBalance)}
                    >
                      Approve
                    </Button>
                  </Tooltip>
                )}
                {allowance > 0 && (
                  <Tooltip title="Revoke allowance from indexer as spender">
                    <Button
                      sx={{ mr: 1 }}
                      variant="outlined"
                      color="primary"
                      type="button"
                      onClick={() => approve(0)}
                    >
                      Revoke
                    </Button>
                  </Tooltip>
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
                  Allow indexer spend {allowance / ckETH_DECIMALS} ckETH on your
                  behalf
                </Alert>
                {notice && <Alert severity="error">{notice}</Alert>}
              </Grid>
            </Grid>
          </form>
        </Box>
      </Dialog>
      <Dialog
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={false}
        open={openListForm}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setOpenListForm(false)}
        >
          Selling $GIG
        </BootstrapDialogTitle>
        <Box sx={{ m: 1, p: 2 }}>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="$GIG Amount to Sell"
                  variant="outlined"
                  name="sellAmount"
                  value={sellAmmount}
                  onChange={handleInputChange}
                  style={{ marginRight: "10px" }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Price(ICP)"
                  variant="outlined"
                  name="price"
                  value={price}
                  onChange={handleInputChange}
                  style={{ marginRight: "10px" }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ mr: 1 }}
                  variant="outlined"
                  color="primary"
                  type="button"
                  onClick={listOrder}
                  disabled={sellAmmount == 0}
                >
                  List
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Dialog>
      <List sx={{ mt: 1, width: "100%", bgcolor: "background.paper" }}>
        <ListItem
          key={"head"}
          disablePadding
          secondaryAction={
            <ListItemButton role={undefined} dense>
              {"balance"}
            </ListItemButton>
          }
        >
          <ListItemButton role={undefined} dense>
            <ListItemText id={"principal"} primary={"Principal ID (100)"} />
          </ListItemButton>
        </ListItem>
        {holderList}
      </List>
    </>
  )
}

export default MyForm

import * as React from "react"

import Grid from "@mui/material/Grid"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import OfferCard from "./OfferCard"
import { Button, DialogContent, Divider, List, Stack } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ListItemForm from "./ListItemForm"
import { toast } from "react-toastify"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import AddIcon from '@mui/icons-material/Add';
import { useEscrow, useLoading, useGlobalContext } from "../Store"

import Inscriptions from "../Inscriptions"

import { Itype, NewOrder, NewSellOrder } from "../../api/escrow/escrow.did"
import { Item } from "../../api/escrow/escrow.did"
import {
  LIST_ITEM_NFT,
  LIST_ITEM_COIN,
  LIST_ITEM_MERCHANDISE,
  LIST_ITEM_SERVICE,
  LIST_ITEM_OTHER,
  LIST_ITEM_INSCRIPTION,
} from "../../lib/constants"
import OfferItem from "./OfferItem"
import { Box } from "@mui/system"
import OrderForm from "../orders/OrderForm"

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}
export default () => {
  const {
    state: { isAuthed },
  } = useGlobalContext()
  const escrow = useEscrow()
  const { setLoading } = useLoading()
  const [openListForm, setOpenListForm] = React.useState(false)
  const [openOrderForm, setOpenOrderForm] = React.useState(false)

  const [itemType, setItemType] = React.useState(LIST_ITEM_INSCRIPTION)
  const [offers, setOffers] = React.useState<Item[]>([])

  React.useEffect(() => {
    if (itemType == LIST_ITEM_INSCRIPTION) {
        setOffers([])
    } else {
      loadOffers()
    }
  }, [itemType])

  const saveList = (data) => {
    setOpenListForm(false)
    setLoading(true)
    escrow.listItem(data).then((res) => {
      if (res["ok"]) {
        toast.success("Item has been listed")
        loadOffers()
      } else {
        toast.error(res["err"])
      }

      setLoading(false)
    })
  }
  const loadOffers = () => {
    let sitype: Itype = { nft: null }
    switch (itemType) {
      case LIST_ITEM_NFT:
        sitype = { nft: null }
        break
      case LIST_ITEM_COIN:
        sitype = { coin: null }
        break
      case LIST_ITEM_MERCHANDISE:
        sitype = { merchandise: null }
        break
      case LIST_ITEM_SERVICE:
        sitype = { service: null }
        break
      case LIST_ITEM_OTHER:
        sitype = { other: null }
        break
    }
    setLoading(true)
    escrow.searchItems(sitype, BigInt(1)).then((res) => {
      console.log(res)
      setLoading(false)
      setOffers(res)
    })
  }

  function buy(newOrder: NewOrder) {
    try {
      setLoading(true)
      escrow.buy(newOrder).then((res) => {
        setLoading(false)
        if (res["ok"]) {
          toast.success("your order has created!")
        } else {
          toast.error(res["err"].toString())
        }
      })
      setOpenOrderForm(false)
    } catch (err) {
      toast.error(err.toString())
    }
  }

  function sell(newOrder: NewSellOrder) {
    try {
      setLoading(true)
      escrow.sell(newOrder).then((res) => {
        setLoading(false)
        if (res["ok"]) {
          toast.success("your order has created!")
        } else {
          toast.error(res["err"].toString())
        }
      })
      setOpenOrderForm(false)
    } catch (err) {
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
  const ol = offers.map((o) =>
    itemType == LIST_ITEM_NFT || itemType == LIST_ITEM_MERCHANDISE ? (
      <OfferCard key={o.id} offer={o} />
    ) : (
      <OfferItem key={o.id} offer={o} />
    ),
  )

  return (
    <React.Fragment>
      {isAuthed && (
        <Button  sx={{ mr: 1, mbb: 1 }} variant="contained" onClick={() => setOpenListForm(true)} startIcon={<AddIcon />}>
          List My Item
        </Button>
      )}
      {isAuthed && (
        <Button sx={{ mr: 1, mbb: 1 }} variant="contained" onClick={() => setOpenOrderForm(true)} startIcon={<AddIcon />}>
          New Escrow Order
        </Button>
      )}
      <Divider />

      <Stack
        direction="row"
        sx={{ mt: 2 }}
        // justifyContent="center"
        // alignItems="center"
        spacing={2}
      >
        <Button
          variant={itemType == LIST_ITEM_INSCRIPTION ? "outlined" : "text"}
          onClick={() => setItemType(LIST_ITEM_INSCRIPTION)}
        >
          APE20($GIG)
        </Button>
        <Button
          variant={itemType == LIST_ITEM_NFT ? "outlined" : "text"}
          onClick={() => setItemType(LIST_ITEM_NFT)}
        >
          NFTs
        </Button>
        <Button
          variant={itemType == LIST_ITEM_COIN ? "outlined" : "text"}
          onClick={() => setItemType(LIST_ITEM_COIN)}
        >
          Crypto Currencies
        </Button>
        <Button
          variant={itemType == LIST_ITEM_SERVICE ? "outlined" : "text"}
          onClick={() => setItemType(LIST_ITEM_SERVICE)}
        >
          Services
        </Button>
        <Button
          variant={itemType == LIST_ITEM_MERCHANDISE ? "outlined" : "text"}
          onClick={() => setItemType(LIST_ITEM_MERCHANDISE)}
        >
          Merchandises
        </Button>
        <Button
          variant={itemType == LIST_ITEM_OTHER ? "outlined" : "text"}
          onClick={() => setItemType(LIST_ITEM_OTHER)}
        >
          Others
        </Button>
      </Stack>

      <Box sx={{
                '& .MuiTextField-root': {mt:2, mb: 1, width: '100%' }
            }}>
        {itemType == LIST_ITEM_INSCRIPTION && <Inscriptions />}
        {(itemType == LIST_ITEM_NFT || itemType == LIST_ITEM_MERCHANDISE) && (
          <Grid container spacing={2} direction="row">
            {ol}
          </Grid>
        )}
        {itemType != LIST_ITEM_NFT && itemType != LIST_ITEM_MERCHANDISE && (
          <Box>
            <List>{ol}</List>
          </Box>
        )}
      </Box>
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
          Input Item Information
        </BootstrapDialogTitle>
        <ListItemForm submit={saveList} itype={itemType} />
      </Dialog>

      <Dialog
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={false}
        open={openOrderForm}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setOpenOrderForm(false)}
        >
          New Escrow Contract
        </BootstrapDialogTitle>
        <DialogContent>
          <OrderForm buy={buy} sell={sell} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

import * as React from "react"

import Grid from "@mui/material/Grid"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import OfferCard from "./OfferCard"
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import { Button, DialogContent, Divider, List, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ListItemForm from "./ListItemForm"
import { toast } from "react-toastify"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import AddIcon from '@mui/icons-material/Add';
import { useEscrow, useLoading, useGlobalContext } from "../Store"
import ItemList from "../items/ItemList";
import { Tabs, Tab } from '@mui/material';


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

  const [itemType, setItemType] = React.useState(LIST_ITEM_NFT)
  const [offers, setOffers] = React.useState<Item[]>([])
  const [tabValue, setTabValue] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);

  React.useEffect(() => {

    loadOffers()

  }, [page])


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
    setLoading(true)
    escrow.getItems(BigInt(page)).then((res) => {

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


  return (
    <React.Fragment>

      <Box sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        mt: 1
      }}>
        {isAuthed && (
          <>
            <Button
              variant="contained"
              onClick={() => setOpenListForm(true)}
              startIcon={<AddIcon />}
              sx={{ minWidth: '160px' }}
            >
              List Item
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenOrderForm(true)}
              startIcon={<AddIcon />}
              sx={{ minWidth: '160px' }}
            >
              New Escrow Order
            </Button>
          </>
        )}
      </Box>

      <ItemList items={offers} />
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1}
          startIcon={<NavigateBeforeIcon />}
        >
          Previous
        </Button>
        <Typography sx={{ mx: 2, alignSelf: 'center' }}>
          Page {page}
        </Typography>
        <Button
          onClick={() => setPage(p => p + 1)}
          endIcon={<NavigateNextIcon />}
        >
          Next
        </Button>
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

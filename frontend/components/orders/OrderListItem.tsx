import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import { Button, Dialog, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import OrderDetail from './OrderDetail';

export default (props) => {

    const [openOrder, setOpenOrder] = React.useState(false)
    const currency = Object.getOwnPropertyNames(props.order.currency)[0];
    let es = currency == "ICP" ? 100000000 : 1000000;
    return (
        <TableRow
            key={props.order.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell >
                <Button variant="text" onClick={() => setOpenOrder(true)}>{parseInt(props.order.id)}</Button>

            </TableCell>
            <TableCell >
                {props.order.memo}
            </TableCell>
            <TableCell align="right">{parseInt(props.order.amount) / es} (${currency})</TableCell>

            <TableCell align="right">{moment.unix(parseInt(props.order.createtime) / 1000000000).format("YYYY-MM-DD hh:mm")}</TableCell>
            <TableCell align="right">

            </TableCell>

            <Dialog
                maxWidth="md"
                fullWidth
                disableEscapeKeyDown={true}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        setOpenOrder(false);
                    }
                }}
                open={openOrder}
            >
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    Order: {props.order.memo}
                    <IconButton
                        onClick={() => setOpenOrder(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <OrderDetail order={props.order} />
            </Dialog>

        </TableRow>
    )
}
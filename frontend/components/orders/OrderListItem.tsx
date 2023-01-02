import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';


export default (props) => {

    return (
        <TableRow
            key={props.order.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell component="th" scope="row">
                {props.order.memo}
            </TableCell>
            <TableCell align="right">{parseInt(props.order.amount)}</TableCell>
            <TableCell align="right">{props.order.buyer.toString()}</TableCell>
            <TableCell align="right">{moment.unix(parseInt(props.order.createtime)/1000000000).format("YYYY-MM-DD hh:mm")}</TableCell>
        </TableRow>
    )
}
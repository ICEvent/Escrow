import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import moment from 'moment';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { ORDER_STATUS_CANCELED, ORDER_STATUS_CLOSED, ORDER_STATUS_DELIVERED, ORDER_STATUS_DEPOSITED, ORDER_STATUS_NEW, ORDER_STATUS_RECEIVED, ORDER_STATUS_RELEASED } from '../../lib/constants';
import { Button } from '@mui/material';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { toast } from 'react-toastify';

import { useEscrow, useGlobalContext } from '../Store';
import Comments from './OrderComments';


export default (props) => {


    const { state: {
        principal
    } } = useGlobalContext();
    const escrow = useEscrow();

    const order = props.order;
    const [status, setStatus] = React.useState<string>(Object.getOwnPropertyNames(order.status)[0])

    const currency = Object.getOwnPropertyNames(order.currency)[0];
    let es = currency == "ICP" ? 100000000 : 1000000;
    
    const activeStep =
        status == ORDER_STATUS_DEPOSITED ? 2 :
            status == ORDER_STATUS_DELIVERED ? 3 :
                status == ORDER_STATUS_RECEIVED ? 4 :
                    status == ORDER_STATUS_CLOSED ? 5 : 1;

    const [loading, setLoading] = React.useState(false)
    const [confirmed, setConfirmed] = React.useState(false)
    const [balance, setBalance] = React.useState(0)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmed(event.target.checked);
    };

    function fetchBalance() {
        setLoading(true)
        escrow.accountBalance(order.account.id, order.currency).then(res => {
            if (res["e6s"]) {
                setBalance(parseInt(res["e6s"]) / 1000000)
            } else if (res["e8s"]) {
                setBalance(parseInt(res["e8s"]) / 100000000)
            }
            setLoading(false)

        })
    };
    const deposit = () => {
        setLoading(true)
        escrow.deposit(order.id).then(res => {
            if (res["ok"]) {
                toast.success("Status has changed");
                setStatus(ORDER_STATUS_DEPOSITED)
            } else {
                toast.error(res["err"])
            };
            setLoading(false);
        })
    };

    const deliver = () => {
        setLoading(true);
        escrow.deliver(order.id).then(res => {
            if (res["ok"]) {
                toast.success("Status has changed");
                setStatus(ORDER_STATUS_DELIVERED)
            } else {
                toast.error(res["err"])
            }
            setLoading(false);
        })
    };
    const receive = () => {
        setLoading(true);
        escrow.receive(order.id).then(res => {
            if (res["ok"]) {
                toast.success("Status has changed");
                setStatus(ORDER_STATUS_RECEIVED)
            } else {
                toast.error(res["err"])
            }
            setLoading(false);
        })
    };
    const release = () => {
        setLoading(true);
        escrow.release(order.id).then(res => {
            if (res["ok"]) {
                toast.success("Status has changed, check your fund ");
                setStatus(ORDER_STATUS_RELEASED)
            } else {
                toast.error(res["err"])
            }
            setLoading(false);
        })
    };
    const cancelOrder = () => {
        setLoading(true);
        escrow.cancel(order.id).then(res => {
            if (res["ok"]) {
                toast.success("the order has been canceled");
                setStatus(ORDER_STATUS_CANCELED)
            } else {
                toast.error(res["err"])
            }
            setLoading(false);
        })
    };  

    const saveComment = (c) => {
        setLoading(true);
        escrow.comment(order.id, c).then(res=>{
            setLoading(false);
            if(res["ok"]){
                toast.success("saved comment");
            }else{
                toast.error(res["err"])
            };
        })
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                <TableBody>

                    <TableRow>
                        <TableCell align="right">Create Time</TableCell>
                        <TableCell >{moment.unix(parseInt(order.createtime) / 1000000000).format("YYYY-MM-DD hh:mm")}</TableCell>
                    </TableRow>
                    <TableRow
                    >
                        <TableCell align="right">
                            ID
                        </TableCell>

                        <TableCell >
                            {parseInt(order.id)}
                        </TableCell>

                    </TableRow>

                    <TableRow>
                        <TableCell align="right">Amount({currency})</TableCell>
                        <TableCell >{parseInt(order.amount) / es}</TableCell>
                    </TableRow>



                    <TableRow>
                        <TableCell align="right">Buyer</TableCell>
                        <TableCell >{order.buyer.toString()}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell align="right">Seller</TableCell>
                        <TableCell >{order.seller.toString()}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell align="right">Escrow Account</TableCell>
                        <TableCell >{order.account.id}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell align="right">Balance </TableCell>
                        <TableCell >
                           { balance }
                            <Button onClick={fetchBalance}>Check</Button>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell align="right">Status</TableCell>
                        <TableCell  >
                            <Stepper alternativeLabel activeStep={activeStep}>

                                <Step key={1} >
                                    <StepLabel>{"New"}</StepLabel>
                                </Step>

                                <Step key={2} >
                                    <StepLabel>{"Deposited"}</StepLabel>
                                </Step>

                                <Step key={3} >
                                    <StepLabel>{"Delivered"}</StepLabel>
                                </Step>

                                <Step key={4} >
                                    <StepLabel>{"Received"}</StepLabel>
                                </Step>

                                <Step key={5} >
                                    <StepLabel>{"Close"}</StepLabel>
                                </Step>

                            </Stepper>

                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align='center' colSpan={2}>
                            {status == ORDER_STATUS_NEW && principal.toString() == order.buyer.toString() && <Alert severity="info">Before change the order status, make sure you already deposit [{parseInt(order.amount) / es} {currency}] to the escrow account {order.account.id} </Alert>}
                            {status == ORDER_STATUS_NEW && principal.toString() == order.seller.toString() && <Alert severity="info">Please wait for buyer to deposit fund [{parseInt(order.amount) / es} {currency}] to escrow account, or you can cancel it</Alert>}
                            {status == ORDER_STATUS_DEPOSITED && principal.toString() == order.seller.toString() &&<Alert severity="info">Have you deliver {order.memo} to buyer? </Alert>}
                            {status == ORDER_STATUS_DEPOSITED && principal.toString() == order.buyer.toString() &&<Alert severity="info">Before the following steps, please wait for seller to deliver {order.memo} to you.</Alert>}
                            {status == ORDER_STATUS_DELIVERED && principal.toString() == order.buyer.toString() &&<Alert severity="info">Are you sure you receive {order.memo} from seller? Once you change order status, the fund will be released to seller and can't be refunded.</Alert>}
                            {status == ORDER_STATUS_RECEIVED && principal.toString() == order.seller.toString() &&<Alert severity="info">Now you can request to fund release.</Alert>}
                            {(status == ORDER_STATUS_NEW  ||
                            status == ORDER_STATUS_DEPOSITED && principal.toString() == order.seller.toString()||
                            status == ORDER_STATUS_DELIVERED && principal.toString() == order.buyer.toString()
                            )&& 
                            <FormGroup>
                                <FormControlLabel control={<Checkbox onChange={handleChange} />} label="YES,I confirmed" />
                            </FormGroup>
                            }

                            {status == ORDER_STATUS_NEW && principal.toString() == order.buyer.toString() && <Button variant="contained" disabled={!confirmed} onClick={deposit}>Deposit</Button>}
                            {status == ORDER_STATUS_DEPOSITED && principal.toString() == order.seller.toString() && <Button  disabled={!confirmed} variant="contained" onClick={deliver}>Deliver</Button>}
                            {status == ORDER_STATUS_DELIVERED && principal.toString() == order.buyer.toString() && <Button   disabled={!confirmed} variant="contained" onClick={receive}>Receive</Button>}
                            {status == ORDER_STATUS_CANCELED && principal.toString() == order.buyer.toString() && <Button variant="contained">Request to refund</Button>}
                            {status == ORDER_STATUS_RECEIVED && principal.toString() == order.seller.toString() && <Button variant="contained"  onClick={release}>Request to release fund</Button>}
                            {status == ORDER_STATUS_NEW && <Button disabled={!confirmed} onClick={cancelOrder}>Cancel</Button>}
                        </TableCell>
                    </TableRow>

                </TableBody>


            </Table>
            <Comments comments={order.comments} submit={saveComment}/>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </TableContainer>

    )
}
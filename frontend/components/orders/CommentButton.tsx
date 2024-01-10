import React, { useState } from "react";

import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { useEscrow, useGlobalContext, useLoading } from '../Store';
import { toast } from 'react-toastify';
export default (props) => {

    const { state: {
        principal
    } } = useGlobalContext();
    const escrow = useEscrow();
    const { setLoading } = useLoading();

    const [openCommentForm, setOpenCommentForm] = useState(false);

    const [comment, setComment] = useState<string | null>();

    const saveComment = () => {
        if (comment && props.id) {
            setLoading(true);
            escrow.comment(props.id, comment).then(res => {
                setLoading(false);
                if (res["ok"]) {
                    toast.success("saved comment");
                    props.reload ? props.reload() :null;
                } else {
                    toast.error(res["err"])
                };
            })
            setOpenCommentForm(false)
        }

    }
    return (
        <React.Fragment>
            <Button onClick={() => setOpenCommentForm(true)}>Comment</Button>
            <Dialog
                maxWidth="md"
                fullWidth
                open={openCommentForm} onClose={() => setOpenCommentForm(false)}>
                <DialogTitle>Leave your comment</DialogTitle>
                <DialogContent>
                    <TextField
                        id="standard-multiline-static"

                        defaultValue=""
                        variant="standard"
                        fullWidth
                        onChange={e => setComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCommentForm(false)}>Cancel</Button>
                    <Button disabled={!comment} onClick={saveComment}>Post</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
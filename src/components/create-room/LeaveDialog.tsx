import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
interface Pros{
    openDialog: boolean;
    handleCloseDialog: ()=>void;
    handleCloseRoom: ()=>void;
}
const LeaveDialog = ({openDialog,handleCloseDialog,handleCloseRoom}:Pros) => {

  return (
    <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">confirm leaving</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure you want to leave the room?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button onClick={handleCloseRoom} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default LeaveDialog

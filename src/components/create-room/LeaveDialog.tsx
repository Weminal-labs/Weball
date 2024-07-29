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
        <DialogTitle id="alert-dialog-title">Xác nhận rời phòng !!!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bộ mày rảnh lắm hả
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>hủy</Button>
          <Button onClick={handleCloseRoom} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default LeaveDialog

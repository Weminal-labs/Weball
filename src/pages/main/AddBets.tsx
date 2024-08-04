import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import WaitingRoom from '../../components/create-room/WaitingRoom';

const FriendList: React.FC = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <Box sx={{
            height: '100vh',
            width: '100vw',
            backgroundColor: '#F5F5F5',
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
        }}>
            {/* <JoinRoom roomId='0x123abc' apt={15} codeId='123abc'/> */}
        </Box>
      //   <div>
      //   <Button variant="contained" onClick={handleOpen}>
      //     Open Waiting Room
      //   </Button>
      //   {/* <WaitingRoom open={open} handleClose={handleClose} /> */}
      // </div>
    );


};
export default FriendList;
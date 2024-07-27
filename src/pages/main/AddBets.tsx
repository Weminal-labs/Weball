import React from 'react';
import JoinRoom from '../../components/join-room/JoinRoom'
import { Box } from '@mui/material';

const AddBets: React.FC = () => {
    return (
        <Box sx={{
            height: '100vh',
            width: '100vw',
            backgroundColor: '#F5F5F5',
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
        }}>
            <JoinRoom roomId='0x123abc' apt={15} codeId='123abc'/>
        </Box>
    );
};
export default AddBets;
import { Box, Button, TextField, Typography } from "@mui/material";

interface RoomProps {
    roomId: string,
    apt: number,
    codeId: string
}

const JoinRoom: React.FC<RoomProps> = ({ roomId, apt, codeId }) => {

    return (
        <Box sx={{
            position: 'relative',
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "35%",
            height: "50%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 3,
            border: "2px solid primary",
            paddingX: 4,
            paddingY: 3,
            borderRadius: 5,
            background: "white",
            boxShadow: "4px 4px 20px rgba(0, 0, 0.1, 0.2)",
        }}>
            <Typography variant="h4" align="center">
                Are You Ready?
            </Typography>
            <TextField id="outlined-basic" label="Code Id" variant="outlined" sx={{
                width: '80%',
                outline: '120px'
            }} />
            <Box sx={{ fontSize: 24, fontWeight: "bold", border: '2px solid black', width: '80%', height: '100px', display: 'flex',  alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', borderRadius: '16px'}}>
                <div style={{display: 'flex', gap: '8px', flexDirection: 'column'}}>
                
                    <Typography sx={{
                        fontSize: "20px",       
                        fontWeight: "bold",     
                    }}>
                        TOTAL: {apt} APT
                    </Typography>
                </div>
                <Button variant="outlined" size="large" sx={{width: '120px', border: '2px solid black', color: 'black', borderRadius: '8px'}}>Join</Button>
            </Box>
        </Box>
    )
};


export default JoinRoom;

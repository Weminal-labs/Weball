import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Room from '../components/Room';
import RoomModal from '../components/RoomModal';
import useModal from '../hooks/useModal';
import { Aptos, AptosConfig, InputViewFunctionData, Network } from '@aptos-labs/ts-sdk';
import { RoomType } from '../type/type';
import { Pagination, Stack } from '@mui/material';
import { MODULE_ADDRESS } from '../utils/Var';
const ITEMS_PER_PAGE = 6;

const JoinRoom: React.FC = () => {
    const { isShowing, toggle, modalContent } = useModal();
    const [isLoading, setIsLoading] =useState<boolean>(true)
    const [list,setList]=useState<RoomType[]>([])
    const [page, setPage] = useState<number>(1);

    useEffect(()=>{
        getRooms();
    },[])

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const displayedRooms = list.slice(startIndex, endIndex);

    const getRooms =async ()=>{
        const aptosConfig = new AptosConfig({ network: Network.TESTNET });
        const aptos = new Aptos(aptosConfig);
        console.log(MODULE_ADDRESS)
        const payload: InputViewFunctionData = {
          function: `${MODULE_ADDRESS}::gamev3::get_all_rooms`,
        };
         
        const data = (await aptos.view({ payload }));
        setIsLoading(false)
        setList(data[0])
    }
    if(isLoading){
        return <div>Loading...</div>
    }
    return (
        <JoinRoomContainer>
        {displayedRooms.map((room, index) => (
            <Room 
                key={index} 
                roomType={room}
                
            />
        ))}
        {isShowing && <RoomModal room={modalContent} onClose={toggle} />}
        <Stack spacing={2}>
            <Pagination
                count={Math.ceil(list.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={handlePageChange}
            />
        </Stack>
    </JoinRoomContainer>
    );
};

const JoinRoomContainer = styled.div`
    display: flex;
    align-items: start;
    justify-content: start;
    height: 100%;
    overflow-y: scroll;
    flex-wrap: wrap;
    gap: 25px;
    padding: 50px;
    background: linear-gradient(45deg, #7ad8f5 30%, #26de57 90%);
`;


export default JoinRoom;

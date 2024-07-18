import React from 'react';
import styled from 'styled-components';
import Room from '../components/Room';
import RoomModal from '../components/RoomModal';
import useModal from '../hooks/useModal';

const JoinRoom: React.FC = () => {
    const { isShowing, toggle, modalContent } = useModal();

    const rooms = [
        { roomName: "Room 1", currentName: "Longvu", opponentName: "", bettingAmount: 25 },
        { roomName: "Room 2", currentName: "Longvu", opponentName: "", bettingAmount: 5 },
        { roomName: "Room 3", currentName: "Longvu", opponentName: "", bettingAmount: 50 },
        { roomName: "Room 4", currentName: "Longvu", opponentName: "", bettingAmount: 30 },
        { roomName: "Room 5", currentName: "Longvu", opponentName: "", bettingAmount: 100 }
    ];

    return (
        <JoinRoomContainer>
            {rooms.map((room, index) => (
                <Room 
                    key={index} 
                    roomName={room.roomName} 
                    currentName={room.currentName} 
                    opponentName={room.opponentName} 
                    bettingAmount={room.bettingAmount} 
                    onClick={() => toggle(room)} 
                />
            ))}
            {isShowing && <RoomModal room={modalContent} onClose={toggle} />}
        </JoinRoomContainer>
    );
};

const JoinRoomContainer = styled.div`
    display: flex;
    align-items: start;
    justify-content: start;
    height: 100%;
    flex-wrap: wrap;
    gap: 25px;
    padding: 50px;
`;

export default JoinRoom;

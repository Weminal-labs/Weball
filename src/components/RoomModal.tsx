import React from 'react';
import styled from 'styled-components';

const RoomModal: React.FC<{ room: any, onClose: () => void }> = ({ room, onClose }) => {
    if (!room) return null;

    return (
        <ModalOverlay>      
            <ModalContent>
                <h2>{room.roomName}</h2>
                <p>Current Name: {room.currentName}</p>
                <p>Opponent Name: {room.opponentName}</p>
                <p>Betting Amount: ${room.bettingAmount}</p>
                <ReadyButton>Ready</ReadyButton>
                <CloseButton onClick={onClose}>X</CloseButton>
            </ModalContent>
        </ModalOverlay>
    );
};

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    position: relative;
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    text-align: center;
`;

const CloseButton = styled.button`
    position: absolute;
    top: -10px;
    right: 10px;
    padding: 5px 10px;
    margin-top: 20px;
    border: none;
    background-color: #333;
    color: white;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
        background-color: #555;
    }
`;

const ReadyButton = styled.button`
  font-family: "Open Sans", sans-serif;
  font-size: 26px;
  letter-spacing: 2px;
  text-decoration: none;
  text-transform: uppercase;
  color: #000;
  cursor: pointer;
  border: 3px solid;
  padding: 0.25em 0.5em;
  box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:active {
    box-shadow: 0px 0px 0px 0px;
    top: 5px;
    left: 5px;
  }
  @media (min-width: 768px) {
    padding: 0.25em 0.75em;
  }
`
export default RoomModal;

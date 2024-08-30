import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { CreateRoomType, RoomType } from "../../type/type";
import { useAptimusFlow, useKeylessLogin } from "aptimus-sdk-test/react";
import useContract from "../../hooks/useContract";
import { useAlert } from "../../contexts/AlertProvider";
import styled from "styled-components";
import { shortenAddress } from "../../utils/Shorten";
import CustomButton from "../buttons/CustomButton";

interface Pros {
  open: boolean;
  room: RoomType | null;
  closeModal: () => void;
  openWaitingRoom: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const JoinRoomDialog: React.FC<Pros> = ({
  open,
  room,
  closeModal,
  setIsLoading,
  openWaitingRoom,
}) => {

  const { callContract, loading, error } = useContract();
  const { setAlert } = useAlert()
  const JoinRoomHandle = async () => {
    closeModal();
    setIsLoading(true);
    await callContract({
      functionName: "join_room_by_room_id",
      functionArgs: [Number(room?.room_id)],
      onSuccess(result) {
        setIsLoading(false);
        openWaitingRoom();
      },
      onError(error) {
        console.error("Lỗi khi:", error.status);

        console.error("Lỗi khi gọi hàm smart contract:", error);
        setAlert("Can't join this room", "info")
      },
      onFinally() {

      },
    })
  };
  return (
    <Modal
      open={open}
      aria-labelledby="waiting-room-title"
      aria-describedby="waiting-room-description"
      onClose={closeModal}
      sx={{
        backdropFilter: "blur(5px)",
      }}
    >
      <Box sx={style}>
        <Title>
          Are You Ready
        </Title>
        <ReadyContent>
          <ReadyList>
            <SpanReady>
              Creator: {shortenAddress(room?.creator ?? "", 5)}
            </SpanReady>
            <SpanId>
              ID: {room?.room_id}
            </SpanId>
            <ReadyAPT>
              <Player>
                <PlayerAvatar>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1792 10.3768L11.947 20.8411L6 8.94701L11.947 3L13.6248 4.6778C13.9193 5.20514 14.4706 6.19244 14.7182 6.6359C16.2628 9.40236 16.053 9.02649 15.0413 9.40236L11.947 10.4337L7.48673 8.94701L11.947 17.8675L15.8989 9.96374C16.2955 10.1625 16.7259 10.3038 17.1792 10.3768Z" fill="white" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.00004 10.3768L12.2322 20.8411L18.1792 8.94701L12.2322 3L10.5544 4.6778C10.2599 5.20514 9.70864 6.19244 9.46103 6.6359C7.91635 9.40236 8.12622 9.02649 9.13792 9.40236L12.2322 10.4337L16.6925 8.94701L12.2322 17.8675L8.28029 9.96374C7.88368 10.1625 7.4533 10.3038 7.00004 10.3768Z" fill="white" />
                    <path d="M6.69029 13.3808L10.4071 20.8146L2.97339 16.3544V12.6375L6.69029 13.3808Z" fill="white" />
                    <path d="M17.0978 13.3808L13.3809 20.8146L20.8147 16.3544V12.6375L17.0978 13.3808Z" fill="white" />
                  </svg>
                </PlayerAvatar>

                <PlayerUser>
                  1/2 PLAYER
                </PlayerUser>
              </Player>

              <APT>
                <APTAvatar>
                  <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.696 12.888C12.696 14.264 12.232 15.328 11.304 16.08C10.392 16.832 9.04 17.272 7.248 17.4V19.848H5.256V17.352C3.672 17.192 2.408 16.728 1.464 15.96C0.536 15.176 0.072 14.184 0.072 12.984H2.688C2.688 13.464 2.912 13.864 3.36 14.184C3.824 14.504 4.456 14.728 5.256 14.856V11.304C3.528 11.192 2.272 10.824 1.488 10.2C0.704 9.576 0.312 8.624 0.312 7.344C0.312 6.08 0.728 5.088 1.56 4.368C2.408 3.632 3.64 3.192 5.256 3.048V0.719999H7.248V3.048C8.816 3.176 10.072 3.632 11.016 4.416C11.976 5.2 12.456 6.208 12.456 7.44H9.816C9.816 6.944 9.584 6.528 9.12 6.192C8.656 5.856 8.032 5.64 7.248 5.544V8.832C9.152 8.896 10.536 9.256 11.4 9.912C12.264 10.552 12.696 11.544 12.696 12.888ZM2.976 7.344C2.976 7.76 3.152 8.088 3.504 8.328C3.872 8.552 4.456 8.704 5.256 8.784V5.568C4.52 5.648 3.952 5.84 3.552 6.144C3.168 6.448 2.976 6.848 2.976 7.344ZM7.248 14.88C8.16 14.816 8.856 14.608 9.336 14.256C9.832 13.904 10.08 13.448 10.08 12.888C10.08 12.392 9.856 12.024 9.408 11.784C8.96 11.544 8.24 11.392 7.248 11.328V14.88Z" fill="white" />
                  </svg>
                </APTAvatar>
                <APTAmount>
                  TOTAL: {Number(room?.bet_amount) / 10000000} APT
                </APTAmount>
              </APT>
            </ReadyAPT>
          </ReadyList>

          <ReadyButton>
            <CustomButton
              content="Join"
              disabled={false}
              isMain={true}
              onClick={JoinRoomHandle}
            >
            </CustomButton>
          </ReadyButton>
        </ReadyContent>
      </Box>
    </Modal>
  );
};

const style = {
  position: "absolute",
  width: "479px",
  height: "408px",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "60px",
  gap: "40px",
background: "linear-gradient(180deg, rgba(68, 97, 108, 0.6) 0%, rgba(42, 72, 74, 0.6) 100%)",
  borderRadius: "12px",
  boxSizing: "border-box",
};

const Title = styled.span`
  width: 359px;
  height: 48px;
  font-family: 'Nord', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 40px;
  line-height: 48px;
  text-align: center;
  color: #FFFFFF;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;
const ReadyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 40px;
  width: 359px;
  height: 200px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`;
const ReadyList = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 16px;

width: 267px;
height: 99px;


/* Inside auto layout */
flex: none;
order: 0;
flex-grow: 0;
`;


const ReadyItem = styled.div`
  font-size: 20px;
  font-weight: 100;
  color: white;
  /* Frame 405 */
  /* Auto layout */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 10px;
  width: 228px;
  height: 19px;
  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
`;
const ReadyButton = styled.div`

display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 24px;

width: 359px;
height: 61px;


/* Inside auto layout */
flex: none;
order: 1;
align-self: stretch;
flex-grow: 0;
`;
const SpanReady = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 10px;
  height: 19px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;
const SpanId = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 10px;
  height: 19px;
  font-family: 'Nord', sans-serif;
  font-style: normal;
  font-weight: 100;
  font-size: 16px;
  line-height: 19px;
  color: rgba(255, 255, 255, 0.5);
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  /* ID: 123456 */
`;
const ReadyAPT = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
padding: 0px;
gap: 60px;
height: 29px;
flex: none;
order: 2;
align-self: stretch;
flex-grow: 0;
`;
const Player = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 8px;
  height: 24px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;
const PlayerUser = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px;
  height: 17px;
  font-family: 'Nord';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: rgba(255, 255, 255, 0.6);
  flex: none;
  order: 1;
  flex-grow: 0;
`;
const PlayerAvatar = styled.div`
  width: 24px;
  height: 24px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;
const APT = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px;
  gap: 8px;
  height: 29px;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

const APTAmount = styled.div`
  align-self: center;
  height: 17px;
  font-family: 'Nord', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: rgba(255, 255, 255, 0.6);
  flex: none;
  order: 1;
  flex-grow: 0;
`;
const APTAvatar = styled.div`
  align-self: center;
  font-family: 'Nord', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #FFFFFF;
  order: 0;
  flex-grow: 0;
`;

export default JoinRoomDialog;
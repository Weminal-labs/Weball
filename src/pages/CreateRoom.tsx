import styled from "styled-components";

const CreateRoom: React.FC = () => {
    return (
        <CreateRoomContainer>
            <h1>Create Room Page</h1>
            {/* Add your create room content here */}
        </CreateRoomContainer>
    );
};

const CreateRoomContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90%;
    width: 100%;
`;

export default CreateRoom;

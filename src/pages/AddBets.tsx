import React from 'react';
import styled from 'styled-components';

const AddBets: React.FC = () => {
    return (
        <AddBetsContainer>
            <h1>Add Bets Page</h1>
            {/* Add your content here */}
        </AddBetsContainer>
    );
};

const AddBetsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90%;
    width: 100%;
`;

export default AddBets;


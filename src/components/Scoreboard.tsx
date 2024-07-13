// src/components/Scoreboard.tsx
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    text-align: center;
    padding: 20px;
    font-family: 'Arial', sans-serif;
`;

const WrapperTitle = styled.div`
    width: 120px;
    height: 30px;
    background-color: #9FB2C0;
    margin-bottom: 20px;
    clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);

`;

const Title = styled.h2`
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ScoreboardContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const TeamContainer = styled.div`
    position: absolute;
    margin: 20px;
    width: 550px;
    height: 50px;
    background-color: #9FB2C0;
    display: flex;
    justify-content: center;
    align-items: center;
    clip-path: polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%);
    
`;

const TeamName = styled.h2`
    color: #fff;
    font-size: 22px;
    font-weight: bold;
    font-family: "Lumanosimo", cursive;
`;


const ScoreContainer = styled.div`
    background-color: #131845;
    width: 180px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Score = styled.h2`
    margin-bottom: 20px;
    font-size: 30px;
    font-weight: bold;
    color: #fff;
    font-family: "Lumanosimo", cursive;

`;

interface ScoreboardProps {
    homeName: string;
    homeScore: number;
    awayName: string;
    awayScore: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({
    homeName,
    homeScore,
    awayName,
    awayScore,
}) => (
    <Container>
        <WrapperTitle>
            <Title>FULL TIME</Title>
        </WrapperTitle>
        <ScoreboardContainer>
            <TeamContainer>
                <TeamName>{homeName}</TeamName>
                <ScoreContainer>
                        <Score>{homeScore}</Score>
                        <Score> - </Score>
                        <Score>{awayScore}</Score>
                </ScoreContainer>
                <TeamName>{awayName}</TeamName>
            </TeamContainer>
        </ScoreboardContainer>
    </Container>
);

export default Scoreboard;

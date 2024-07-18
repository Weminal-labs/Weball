import styled from "styled-components";

const Leaderboard: React.FC = () => {
    return (
        <LeaderboardContainer>
            <h1>Leaderboard Page</h1>
            {/* Add your leaderboard content here */}
        </LeaderboardContainer>
    );
};

const LeaderboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90%;
    width: 100%;
`;

export default Leaderboard;

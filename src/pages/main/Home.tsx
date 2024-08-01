import React from "react";
import styled from "styled-components";


const Home: React.FC = () => {


  

  return (
    <ContentContainer>
      {/* <ShowModalButton onClick={toggle}>
        <ShowModalText className="play-game">PLAY GAME</ShowModalText>
      </ShowModalButton>
      <UnityModal isShowing={isShowing} hide={toggle} /> */}
    </ContentContainer>
  );
};

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: grey;
`;

const ShowModalButton = styled.button`
  background-color: #e3d7cb;
  border: 2px solid #422800;
  border-radius: 30px;
  box-shadow: #422800 4px 4px 0 0;
  color: #422800;
  cursor: pointer;
  display: inline-block;
  font-weight: 600;
  font-size: 18px;
  padding: 0 18px;
  line-height: 50px;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:hover {
    background-color: #fff;
  }

  &:active {
    box-shadow: #422800 2px 2px 0 0;
    transform: translate(2px, 2px);
  }

  @media (min-width: 768px) {
    min-width: 120px;
    padding: 0 25px;
  }
`;

const ShowModalText = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #422800;
  text-align: center;
  margin: 10px 0;
  display: block;
`;

export default Home;

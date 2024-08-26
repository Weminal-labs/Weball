import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { ClipLoader } from 'react-spinners';
import { Box } from '@mui/material';

const GlobalStyle = createGlobalStyle`
::-webkit-scrollbar {
  width: 12px; /* Width of the scrollbar */
}

::-webkit-scrollbar-track {
  background: #0cbd16; /* Background of the scrollbar track - changed to green */
}

::-webkit-scrollbar-thumb {
  background-color: #1E90FF; /* Color of the scrollbar thumb */
  border-radius: 6px; /* Roundness of the scrollbar thumb */
  border: 3px solid #0cbd16; /* Space around the scrollbar thumb - changed to green */
}

/* Scrollbar styles for Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #1E90FF #0cbd16; /* Thumb color and track color for Firefox - changed track color to green */
}
`;

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <GlobalStyle />
      {loading ? (
        <LoadingContainer>
          <ClipLoader color="#00f" loading={loading} size={150} />
        </LoadingContainer>
      ) : (
        <PageContainer>
          <ContentContainer>
            <ImageHomeMain 
              src="bg-gome.webp" 
              alt="Main Image" 
              // onLoad={() => setImageLoaded(true)}
            />
            <TextContainer>
              <UpperBlocks>
                <Block>Aptos</Block>
                <Block>Sport</Block>
              </UpperBlocks>
              <OnchainText>ONCHAIN GAME</OnchainText>
              <LowerBlocks>
                <Block>Tournament</Block>
                <Block>Start Date</Block>
              </LowerBlocks>
            </TextContainer>
          </ContentContainer>
          <GifContainer>
            <GifMain 
              src="game-gif.gif" 
              alt="Game GIF" 
              // onLoad={() => setGifLoaded(true)}
            />
          </GifContainer>
        </PageContainer>
      )}
    </>
  );
};

const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70vh;
  position: relative;
  padding: 5px;
`;

const ImageHomeMain = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const GifContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #219CE2 30%,#0CBD16 90%);
  padding: 5px;
`;

const GifMain = styled.img`
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const TextContainer = styled.div`
  position: absolute;
  bottom: 70px;
  left: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.3);
  padding: 10px;
  border-radius: 5px;
`;

const UpperBlocks = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const LowerBlocks = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Block = styled.div`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
`;

const OnchainText = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
`;

export default Home;
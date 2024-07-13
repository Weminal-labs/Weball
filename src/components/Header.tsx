import React from 'react';
import styled from 'styled-components';
import PersonIcon from '@mui/icons-material/Person';

const HeaderContainer = styled.div`
    width: 95%;
    height: 50px;
    padding: 40px;
    text-align: left;
    font-family: 'Arial', sans-serif;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`;

const LeftHeader = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const TitleContainer = styled.header`
    background: linear-gradient(to right, #3A6084, #0E235E);
    width: 190px;
    height: 30px;
    background-color: #0E235E;
    padding: 20px;
    font-family: 'Arial', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    cursor: pointer;
`;

const Logo = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50px;
    margin-right: 15px
`;

const Title = styled.h1`
    color: #fff;
    font-size: 30px;
    font-weight: bold;
    letter-spacing: 3px;
`;

const FeaturesContainer = styled.div`
    padding-right: 100px
    margin-left: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 100%;
    cursor: pointer;
    gap: 30px
`;

const Feature = styled.div`
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

// const RoomsContainer = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 250px;
//     height: 50px;
//     // background-color: #E72222;
//     border-radius: 50px;
//     margin-right: 25px;
//     cursor: pointer;
// `;

// const Rooms = styled.div`
//     color: #fff;
//     font-size: 30px;
//     font-weight: bold;
// `;

const RightHeader = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
    width: 150px;
    height: 50px;
`

const ProfileButton = styled.button`
    width: 50px;
    height: 50px;
    background-color: #3D4B61;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 15px;
`;


const Header: React.FC = () => (
    <HeaderContainer>
        <LeftHeader>
            <TitleContainer>
                <Logo>
                    <img style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50px' }} src={'../public/logo.jpg'} alt="logo" />
                </Logo>
                <Title>WEBALL</Title>
            </TitleContainer>
            <FeaturesContainer>
                <Feature>
                    <p>Home</p>
                </Feature>
                <Feature>
                    <p>Rooms</p>
                </Feature>
            </FeaturesContainer>
        </LeftHeader>
        <RightHeader>
            <ProfileButton>
                <PersonIcon/>
            </ProfileButton>
        </RightHeader>
    </HeaderContainer>
);

export default Header;
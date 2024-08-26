import React from 'react';
import styled from 'styled-components';

interface CustomInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    isMain?: boolean;
    disabled?: boolean;
}

const CustomInput = ({ value, onChange, placeholder, isMain = false, disabled = false }: CustomInputProps) => {
    return (
        <TextFieldStyled 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder}
            isMain={isMain}
            disabled={disabled}
        />
    );
};

// Styled component for the input field
const TextFieldStyled = styled.input<{ isMain?: boolean }>` 
    padding: 10px;
    font-size: 12px;
    border-radius: 5px;
    border: 2px solid transparent; /* Border is transparent initially */
    background-color: ${({ isMain }) => (isMain ? '#152D31' : '#E0E0E0')};
    color: ${({ isMain }) => (isMain ? '#F0F4F4' : '#333')};
    width: 100%;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.3s;
    
    /* Border gradient effect */
    border-image: linear-gradient(to right, rgba(255, 222, 100, 0.3), rgba(67, 49, 0, 0.3)); 
    border-image-slice: 1;
    
    &:focus {
        border-color: ${({ isMain }) => (isMain ? '#1E2A2A' : '#0D3B3A')};
    }

    &:disabled {
        background-color: #f5f5f5;
        border-color: #ddd;
        cursor: not-allowed;
    }
`;

export default CustomInput;

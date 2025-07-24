import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ModalOverlay, ModalContent } from './ModalOverlay';
import styled from 'styled-components';

const GramsInputModalContainer = ({ product, onAdd, onCancel }) => {
  const [grams, setGrams] = useState('');

  const handleAdd = () => {
    if (grams) {
      onAdd({ ...product, grams });
    }
  };

  return (
    <ModalOverlay>
      <GramsModalContent>
        <h3>Введите количество граммов</h3>
        <StyledLabel>
          Укажите количество в граммах:
          <StyledInput
            type="number"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            required
          />
        </StyledLabel>
        <ButtonContainer>
          <StyledButton type="button" onClick={onCancel}>
            Отмена
          </StyledButton>
          <StyledButton type="button" onClick={handleAdd}>
            Добавить
          </StyledButton>
        </ButtonContainer>
      </GramsModalContent>
    </ModalOverlay>
  );
};

const GramsModalContent = styled(ModalContent)`
  width: 400px;
  height: 200px;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
`;

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  background: linear-gradient(
    to right,
    rgb(58 115 229 / 70%),
    rgb(239 85 83 / 70%)
  );
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  &:hover {
    background: linear-gradient(
      to right,
      rgb(58 115 229 / 100%),
      rgb(239 85 83 / 100%)
    );
  }
`;

export const GramsInputModal = GramsInputModalContainer;

GramsInputModalContainer.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    carbohydratesIn100Grams: PropTypes.number.isRequired,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

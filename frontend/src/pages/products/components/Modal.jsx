import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [product, setProduct] = useState({
    name: '',
    carbohydratesIn100Grams: '',
    proteins: '',
    fats: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
    setProduct({
      name: '',
      carbohydratesIn100Grams: '',
      proteins: '',
      fats: '',
    });
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Добавить продукт</h2>
        <form onSubmit={handleSubmit}>
          <StyledLabel>
            Название:
            <StyledInput
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </StyledLabel>
          <StyledLabel>
            Углеводы:
            <StyledInput
              type="number"
              name="carbohydratesIn100Grams"
              value={product.carbohydratesIn100Grams}
              onChange={handleChange}
              required
            />
          </StyledLabel>
          <StyledLabel>
            Белки:
            <StyledInput
              type="number"
              name="proteins"
              value={product.proteins}
              onChange={handleChange}
              required
            />
          </StyledLabel>
          <StyledLabel>
            Жиры:
            <StyledInput
              type="number"
              name="fats"
              value={product.fats}
              onChange={handleChange}
              required
            />
          </StyledLabel>
          <StyledButton type="submit">Добавить</StyledButton>
          <StyledButton type="button" onClick={onClose}>
            Отмена
          </StyledButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: linear-gradient(
    to right,
    rgba(165, 231, 233, 1),
    rgba(251, 243, 174, 1)
  );
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledButton = styled.button`
  margin-top: 10px;
  padding: 8px;
  background: linear-gradient(
    to right,
    rgb(58 115 229 / 70%),
    rgb(239 85 83 / 70%)
  );
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: linear-gradient(
      to right,
      rgb(58 115 229 / 100%),
      rgb(239 85 83 / 100%)
    );
  }
`;

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

import { useState } from 'react';
import PropTypes from 'prop-types';
import { ModalOverlay, ModalContent } from './modal';
import { request } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ConfirmationModalContainer = ({ data, onCancel }) => {
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const entryData = {
      date: new Date().toISOString(),
      sugarLevel: parseFloat(data.sugarLevel),
      shortInsulinValue: parseFloat(data.shortInsulinValue),
      longInsulinValue: data.longInsulinValue
        ? parseFloat(data.longInsulinValue)
        : null,
      products: data.selectedProducts.map((product) => ({
        productId: product._id,
        grams: parseFloat(product.grams),
      })),
      totalBreadUnits: data.selectedProducts.reduce(
        (total, product) => total + parseFloat(product.breadUnits || 0),
        0
      ),
      comment,
    };
    try {
      const response = await request('/diary', 'POST', entryData);
      if (response.error) {
        console.error('Error saving data:', response.error);
      } else {
        navigate('/diary');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const totalBreadUnits = data.selectedProducts
    .reduce((total, product) => total + parseFloat(product.breadUnits || 0), 0)
    .toFixed(2);

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Подтверждение данных</h2>
        <DataSummary>
          <h3>Уровень сахара: {data.sugarLevel}</h3>
          <h3>Общее количество ХЕ: {totalBreadUnits}</h3>
          <h3>Продукты:</h3>
          <ul>
            {data.selectedProducts.map((product, index) => (
              <li key={index}>
                {product.name} - {product.grams} г
              </li>
            ))}
          </ul>
          <h3>Короткий инсулин: {data.shortInsulinValue}</h3>
          <h3>Длинный инсулин: {data.longInsulinValue || 'Не указано'}</h3>
        </DataSummary>
        <form onSubmit={handleSubmit}>
          <StyledLabel>
            Комментарий:
            <StyledTextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </StyledLabel>
          <ModalActions>
            <StyledButton type="button" onClick={onCancel}>
              Отмена
            </StyledButton>
            <StyledButton type="submit">Готово</StyledButton>
          </ModalActions>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

const DataSummary = styled.div`
  margin-bottom: 20px;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StyledTextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 100px;
  width: 300px;
  resize: none;
`;

const ModalActions = styled.div`
  display: flex;
  margin: 8px 0px 0px 80px;
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
  margin-right: 10px;
  &:hover {
    background: linear-gradient(
      to right,
      rgb(58 115 229 / 100%),
      rgb(239 85 83 / 100%)
    );
  }
`;

export const ConfirmationModal = ConfirmationModalContainer;

ConfirmationModalContainer.propTypes = {
  data: PropTypes.shape({
    sugarLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    selectedProducts: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        grams: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        breadUnits: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ).isRequired,
    shortInsulinValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    longInsulinValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
};

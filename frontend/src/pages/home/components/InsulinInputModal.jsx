import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalOverlay, ModalContent } from './modal';
import { request } from '../../../utils';
import { InsulinCalculator } from './calculator';
import styled from 'styled-components';

const InsulinInputModalContainer = ({
  currentSugarLevel,
  totalBreadUnits,
  userEmail,
  onNext,
  onCancel,
}) => {
  const [shortInsulinValue, setShortInsulinValue] = useState(0);
  const [longInsulinValue, setLongInsulinValue] = useState('');
  const [userSettings, setUserSettings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await request(`/settings?email=${userEmail}`);
        if (response.data) {
          setUserSettings(response.data);
        } else {
          setError(
            'У вас не заполнены необходимые поля на странице Настройки.'
          );
        }
      } catch (err) {
        setError('Произошла ошибка при загрузке настроек. Перейдите в раздел Настройки и заполните, пожалуйста, все поля.');
      }
    };
    fetchUserSettings();
  }, [userEmail]);

  useEffect(() => {
    if (userSettings) {
      try {
        const calculatedInsulin = InsulinCalculator({
          currentSugarLevel,
          totalBreadUnits,
          userSettings,
        });
        if (!isNaN(calculatedInsulin)) {
          setShortInsulinValue(calculatedInsulin);
        }
      } catch (err) {
        setError(err.message);
      }
    }
  }, [userSettings, currentSugarLevel, totalBreadUnits]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ shortInsulinValue, longInsulinValue });
  };

  if (error) {
    return (
      <ModalOverlay>
        <ModalContent>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <StyledButton type="button" onClick={onCancel}>
            Закрыть
          </StyledButton>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (!userSettings) {
    return (
      <ModalOverlay>
        <ModalContent>
          <h2>Загрузка...</h2>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Ввод инсулина</h2>
        <form onSubmit={handleSubmit}>
          <StyledLabel>
            Рассчитанное значение короткого инсулина:
            <StyledInput
              type="number"
              value={shortInsulinValue}
              onChange={(e) => setShortInsulinValue(e.target.value)}
              required
            />
          </StyledLabel>
          <StyledLabel>
            Введите значение длинного инсулина:
            <StyledInput
              type="number"
              value={longInsulinValue}
              onChange={(e) => setLongInsulinValue(e.target.value)}
              placeholder="Введите значение"
            />
          </StyledLabel>
          <ModalActions>
            <StyledButton type="button" onClick={onCancel}>
              Отмена
            </StyledButton>
            <StyledButton type="submit">Далее</StyledButton>
          </ModalActions>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
`;

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 8px 0px 0px 0px;
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

export const InsulinInputModal = InsulinInputModalContainer;

InsulinInputModalContainer.propTypes = {
  currentSugarLevel: PropTypes.number.isRequired,
  totalBreadUnits: PropTypes.number.isRequired,
  userEmail: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

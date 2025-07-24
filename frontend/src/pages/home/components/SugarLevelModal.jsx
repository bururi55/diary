import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalOverlay, ModalContent } from './modal';
import { H2 } from '../../../components';
import { request } from '../../../utils';
import styled from 'styled-components';

const SugarLevelModalContainer = ({ className, onNext, onCancel }) => {
  const [sugarLevel, setSugarLevel] = useState('6.3');
  const [glucoseScale, setGlucoseScale] = useState({
    severeHypoglycemia: 3.0,
    hypoglycemia: 3.9,
    normalGlucose: 5.5,
    hyperglycemia: 7.0,
    severeHyperglycemia: 11.0,
    precoma: 16.5,
  });
  const [currentGlucoseStatus, setCurrentGlucoseStatus] =
    useState('Гипергликемия');

  useEffect(() => {
    const fetchGlucoseScale = async () => {
      try {
        const response = await request('/settings');
        if (response.data) {
          setGlucoseScale({
            severeHypoglycemia: response.data.severeHypoglycemia,
            hypoglycemia: response.data.hypoglycemia,
            normalGlucose: response.data.normalGlucose,
            hyperglycemia: response.data.hyperglycemia,
            severeHyperglycemia: response.data.severeHyperglycemia,
            precoma: response.data.precoma,
          });
        }
      } catch (error) {
        console.error('Error fetching glucose scale:', error);
      }
    };
    fetchGlucoseScale();
  }, []);

  useEffect(() => {
    if (sugarLevel) {
      const level = parseFloat(sugarLevel);
      if (level < glucoseScale.severeHypoglycemia) {
        setCurrentGlucoseStatus('Тяжелая гипогликемия');
      } else if (level < glucoseScale.hypoglycemia) {
        setCurrentGlucoseStatus('Гипогликемия');
      } else if (level < glucoseScale.normalGlucose) {
        setCurrentGlucoseStatus('Норма');
      } else if (level < glucoseScale.hyperglycemia) {
        setCurrentGlucoseStatus('Гипергликемия');
      } else if (level < glucoseScale.severeHyperglycemia) {
        setCurrentGlucoseStatus('Тяжелая гипергликемия');
      } else {
        setCurrentGlucoseStatus('Прекома');
      }
    }
  }, [sugarLevel, glucoseScale]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(sugarLevel);
  };

  const handleSliderChange = (e) => {
    setSugarLevel(e.target.value);
  };

  return (
    <ModalOverlay>
      <ModalContent className={className}>
        <H2>Уровень сахара в крови</H2>
        <GlucoseStatusContainer>
          <GlucoseStatus>{currentGlucoseStatus}</GlucoseStatus>
        </GlucoseStatusContainer>
        <form onSubmit={handleSubmit}>
          <GlucoseValueContainer>
            <GlucoseValue>{sugarLevel}</GlucoseValue>
          </GlucoseValueContainer>
          <SliderContainer>
            <SliderInput
              type="range"
              min="0.0"
              max="30.0"
              step="0.1"
              value={sugarLevel}
              onChange={handleSliderChange}
            />
          </SliderContainer>
          <StyledLabel>
            Введите уровень сахара:
            <StyledInput
              type="number"
              value={sugarLevel}
              onChange={(e) => setSugarLevel(e.target.value)}
              required
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

const GlucoseStatusContainer = styled.div`
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GlucoseStatus = styled.div`
  font-size: 1.5em;
  color: green;
  text-align: center;
  width: 100%;
`;

const GlucoseValueContainer = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GlucoseValue = styled.div`
  font-size: 3em;
  font-weight: bold;
  text-align: center;
  width: 100%;
`;

const SliderContainer = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const SliderInput = styled.input`
  width: 100%;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 20px 0;
`;

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  width: 100%;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0 0 0;
`;

const StyledButton = styled.button`
  padding: 7px 16px;
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

export const SugarLevelModal = styled(SugarLevelModalContainer)``;

SugarLevelModalContainer.propTypes = {
  onNext: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

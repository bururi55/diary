import styled from 'styled-components';
import PropTypes from 'prop-types';

const AddEntryButtonContainer = ({ className, onClick }) => {
  return (
    <button className={className} onClick={onClick}>
      Добавить запись
    </button>
  );
};

export const AddEntryButton = styled(AddEntryButtonContainer)`
  background-color: rgb(217, 237, 213);
  color: #000;
  border: 8px solid rgb(194, 227, 146);
  border-radius: 60%;
  width: 320px;
  height: 320px;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgb(203, 237, 206);
    box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.4);
  }
`;

AddEntryButtonContainer.propTypes = {
  onClick: PropTypes.func.isRequired,
};

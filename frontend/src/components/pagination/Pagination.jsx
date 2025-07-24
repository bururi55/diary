import { Icon } from '../icon/Icon';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import startIcon from '../../../src/assets/icons/start-icon.png';
import backIcon from '../../../src/assets/icons/back-icon.png';
import forwardIcon from '../../../src/assets/icons/forward-icon.png';
import finalIcon from '../../../src/assets/icons/final-icon.png';

const PaginationContainer = ({ className, page, lastPage, setPage }) => {
  return (
    <div className={className}>
      <button
        className="pagination-button"
        disabled={page === 1}
        onClick={() => setPage(1)}
      >
        <Icon src={startIcon} fontSize="38px" />
      </button>
      <button
        className="pagination-button"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <Icon src={backIcon} fontSize="32px" />
      </button>
      <div className="current-page">Страница: {page}</div>
      <button
        className="pagination-button"
        disabled={page === lastPage}
        onClick={() => setPage(page + 1)}
      >
        <Icon src={forwardIcon} fontSize="32px" />
      </button>
      <button
        className="pagination-button"
        disabled={page === lastPage}
        onClick={() => setPage(lastPage)}
      >
        <Icon src={finalIcon} fontSize="38px" />
      </button>
    </div>
  );
};

export const Pagination = styled(PaginationContainer)`
  display: flex;
  justify-content: center;
  margin: -5px auto;
  padding: 2px;

  .pagination-button {
    margin: 0 5px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pagination-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .pagination-button:disabled > * {
    pointer-events: none;
  }

  .current-page {
    width: 150px;
    height: 32px;
    margin: 0 10px;
    padding-top: 5px;
    text-align: center;
    border: 1px solid #000;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 5px;
    line-height: 26px;
    background: linear-gradient(
      to right,
      rgb(161, 245, 248),
      rgb(240, 230, 140)
    );
  }
`;

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};

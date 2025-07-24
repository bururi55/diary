import { H2 } from '../h2/h2';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ErrorContainer = ({ className, error }) => {
  return (
    error && (
      <div className={className}>
        <H2>Ошибка</H2>
        <div>{error}</div>
      </div>
    )
  );
};

export const Error = styled(ErrorContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
`;

Error.propTypes = {
  error: PropTypes.string,
};

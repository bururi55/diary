import styled from 'styled-components';

const TableContainer = ({ className, children }) => (
  <div className={className}>{children}</div>
);

export const TableRow = styled(TableContainer)`
  display: flex;
  align-items: center;
  border: ${({ border }) => (border ? ' 1px solid #000' : 'none')};

  & > div {
    display: flex;
    padding: 0 10px;
  }

  & .login-column {
    width: 172px;
  }

  & .registered-at-column {
    width: 213px;
  }

  & .role-column {
    width: auto;
  }
`;

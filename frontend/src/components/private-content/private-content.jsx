import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Error } from '../error/error';
import { selectUserRole } from '../../selectors';
import { ERROR } from '../../constants';
import { checkAccess } from '../../utils';
import styled from 'styled-components';

const PrivateContentContainer = ({
  children,
  className,
  access,
  serverError = null,
}) => {
  const userRole = useSelector(selectUserRole);
  const accessError = checkAccess(access, userRole)
    ? null
    : ERROR.ACCESS_DENIED;
  const error = serverError || accessError;
  return error ? (
    <Error error={error} />
  ) : (
    <div className={className}>{children}</div>
  );
};

export const PrivateContent = styled(PrivateContentContainer)``;

PrivateContent.propTypes = {
  children: PropTypes.node.isRequired,
  access: PropTypes.arrayOf(PropTypes.string).isRequired,
  serverError: PropTypes.string,
};

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../../../components';
import { TableRow } from '../table-row/table-row';
import { request } from '../../../../utils';
import saveIcon from '/src/assets/icons/save-icon.png';
import trashIcon from '/src/assets/icons/trash-icon.png';
import styled from 'styled-components';

const UserRowContainer = ({
  className,
  id,
  login,
  registeredAt,
  roleId: userRoleId,
  roles,
  onUserRemove,
}) => {
  const [initialRoleId, setInitialRoleId] = useState(Number(userRoleId));
  const [selectedRoleId, setSelectedRoleId] = useState(Number(userRoleId));

  const onRoleChange = ({ target }) => {
    setSelectedRoleId(Number(target.value));
  };

  const isSaveButtonDisabled = selectedRoleId === Number(initialRoleId);

  const onRoleSave = (userId, newUserRoleId) => {
    request(`/users/${userId}`, 'PATCH', { roleId: newUserRoleId }).then(() => {
      setInitialRoleId(newUserRoleId);
    });
  };

  return (
    <div className={className}>
      <TableRow border={true}>
        <div className="login-column">{login}</div>
        <div className="registered-at-column">{registeredAt}</div>
        <div className="role-column">
          <select value={selectedRoleId} onChange={onRoleChange}>
            {roles.map(({ id: roleId, name: roleName }) => (
              <option key={roleId} value={roleId}>
                {roleName}
              </option>
            ))}
          </select>
          <Icon
            src={saveIcon}
            margin="0px 0px 0px 10px"
            disabled={isSaveButtonDisabled}
            onClick={() => onRoleSave(id, selectedRoleId)}
            style={{
              cursor: isSaveButtonDisabled ? 'default' : 'pointer',
              opacity: isSaveButtonDisabled ? 0.5 : 1,
            }}
          />
        </div>
      </TableRow>
      <Icon
        src={trashIcon}
        margin="5px 0px 5px -40px"
        onClick={onUserRemove}
        style={{ cursor: 'pointer' }}
        fontSize="30px"
      />
    </div>
  );
};

export const UserRow = styled(UserRowContainer)`
  display: flex;
  margin-top: 10px;

  & select {
    font-size: 16px;
    padding: 0 5px;
  }

  .login-column {
    flex: 1;
  }

  .registered-at-column {
    flex: 1;
  }

  .role-column {
    flex: 1;
    display: flex;
    align-items: center;
  }
`;

UserRowContainer.propTypes = {
  className: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  login: PropTypes.string.isRequired,
  registeredAt: PropTypes.string.isRequired,
  roleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUserRemove: PropTypes.func.isRequired,
};

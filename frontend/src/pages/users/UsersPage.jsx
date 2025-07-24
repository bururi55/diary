import { Header, Footer } from '../../components';
import { H2, PrivateContent } from '../../components';
import { TableRow, UserRow } from './components';
import { useEffect, useState } from 'react';
import { ROLE } from '../../constants';
import { checkAccess } from '../../utils';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../selectors';
import { request } from '../../utils';
import { Icon } from '../../components';
import loginIcon from '/src/assets/icons/login-icon.png';
import calendarIcon from '/src/assets/icons/calendar-icon.png';
import roleIcon from '/src/assets/icons/role-icon.png';
import styled from 'styled-components';

const UsersPageContainer = ({ className }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [shouldUpdateUserList, setShouldUpdateUserList] = useState(false);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    if (!checkAccess([ROLE.ADMIN], userRole)) {
      return;
    }

    Promise.all([request('/users'), request('/users/roles')]).then(
      ([usersRes, rolesRes]) => {
        if (usersRes.error || rolesRes.error) {
          setErrorMessage(usersRes.error || rolesRes.error);
          return;
        }
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
      }
    );
  }, [shouldUpdateUserList, userRole]);

  const onUserRemove = (userId) => {
    if (!checkAccess([ROLE.ADMIN], userRole)) {
      return;
    }
    request(`/users/${userId}`, 'DELETE').then(() => {
      setShouldUpdateUserList(!shouldUpdateUserList);
    });
  };

  return (
    <PrivateContent access={[ROLE.ADMIN]} serverError={errorMessage}>
      <div className={className}>
        <Header />
        <H2>Пользователи</H2>
        <div>
          <TableRow>
            <div className="login-column">
              <Icon src={loginIcon} fontSize="32px" inactive={true} />
              Логин
            </div>
            <div className="registered-at-column">
              <Icon src={calendarIcon} fontSize="32px" inactive={true} />
              Дата регистрации
            </div>
            <div className="role-column">
              <Icon src={roleIcon} fontSize="32px" inactive={true} />
              Роль
            </div>
          </TableRow>
          {users.map(({ id, login, registeredAt, roleId }) => (
            <UserRow
              key={id}
              id={id}
              login={login}
              registeredAt={registeredAt}
              roleId={roleId}
              roles={roles.filter(({ id: roleId }) => roleId !== ROLE.GUEST)}
              onUserRemove={() => onUserRemove(id)}
            />
          ))}
        </div>
        <Footer />
      </div>
    </PrivateContent>
  );
};

export const UsersPage = styled(UsersPageContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 570px;


  H2 {
  margin-top: 120px}

  .login-column,
  .registered-at-column,
  .role-column {
    display: flex;
    align-items: center;
    gap: 5px;
`;

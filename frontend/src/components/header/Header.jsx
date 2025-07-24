import { Icon } from '../icon/Icon';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserRole } from '../../selectors';
import { logout } from '../../actions/logout';
import { ROLE } from '../../constants/role';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import homeIcon from '/src/assets/icons/home-icon.png';
import diaryIcon from '/src/assets/icons/diary-icon.png';
import usersIcon from '/src/assets/icons/users-icon.png';
import productsIcon from '/src/assets/icons/products-icon.png';
import settingsIcon from '/src/assets/icons/settings-icon.png';
import logoutIcon from '/src/assets/icons/logout-icon.png';
import loginIcon from '/src/assets/icons/login-icon.png';

const HeaderContainer = ({ className }) => {
  const dispatch = useDispatch();
  const roleId = useSelector(selectUserRole);

  const onLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem('userData');
  };

  return (
    <header className={className}>
      <h1>Дневник диабета</h1>
      <nav>
        <Link to="/">
          <Icon src={homeIcon} fontSize="32px" />
          Главная
        </Link>
        {roleId !== ROLE.GUEST && (
          <Link to="/diary">
            <Icon src={diaryIcon} fontSize="30px" />
            Дневник
          </Link>
        )}
        {roleId === ROLE.ADMIN && (
          <Link to="/users">
            <Icon src={usersIcon} fontSize="30px" />
            Пользователи
          </Link>
        )}
        {roleId !== ROLE.GUEST && (
          <Link to="/products">
            <Icon src={productsIcon} fontSize="30px" />
            Продукты
          </Link>
        )}
        {roleId !== ROLE.GUEST && (
          <Link to="/settings">
            <Icon src={settingsIcon} fontSize="30px" />
            Настройки
          </Link>
        )}
        {roleId !== ROLE.GUEST && (
          <Link to="#" onClick={onLogout}>
            <Icon src={logoutIcon} fontSize="30px" />
            Выйти
          </Link>
        )}
        {roleId === ROLE.GUEST && (
          <Link to="/login">
            <Icon src={loginIcon} fontSize="30px" />
            Войти
          </Link>
        )}
      </nav>
    </header>
  );
};

export const Header = styled(HeaderContainer)`
  background: linear-gradient(to right, rgb(161, 245, 248), rgb(240, 230, 140));
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: -5px;
  width: 100%;
  box-shadow: 0px -2px 13px #000;
  height: 45px;

  h1 {
    margin: 0px 0px 0px 10px;
    font-size: 2rem;
    cursor: default;
    user-select: none;
  }

  nav {
    display: flex;
    gap: 1rem;
    margin-right: 2rem;

    a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: #333;
      padding: 0.5rem;
      cursor: pointer;
    }
  }
`;

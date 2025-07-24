import { useState } from 'react';
import { Header, Footer } from '../../components';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserRole } from '../../selectors';
import { useResetForm } from '../../hooks';
import { ROLE } from '../../constants';
import { request } from '../../utils';
import { setUser } from '../../actions';
import { Navigate, Link } from 'react-router-dom';
import styled from 'styled-components';

const regFormSchema = yup.object().shape({
  login: yup
    .string()
    .required('Заполните Имя пользователя')
    .matches(
      /^\w+$/,
      'Неверно заполнено Имя пользователя. Допускаются только буквы и цифры'
    )
    .min(3, 'Неверно заполнено Имя пользователя. Минимум 3 символа')
    .max(15, 'Неверно заполнено Имя пользователя. Максимум 15 символов'),
  email: yup
    .string()
    .email('Неверный формат электронной почты')
    .required('Заполните электронную почту'),
  password: yup
    .string()
    .required('Заполните пароль')
    .matches(
      /^[\w#%]+$/,
      'Неверно заполнен пароль. Допускаются буквы, цифры и знаки # %'
    )
    .min(6, 'Неверно заполнен пароль. Минимум 6 символов')
    .max(30, 'Неверно заполнен пароль. Максимум 30 символов'),
  passcheck: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Пароли не совпадают')
    .required('Заполните повтор пароля'),
});

const RegisterPageContainer = ({ className }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login: '',
      password: '',
      passcheck: '',
    },
    resolver: yupResolver(regFormSchema),
  });

  const [serverError, setServerError] = useState(null);

  const dispatch = useDispatch();
  const roleId = useSelector(selectUserRole);

  useResetForm(reset);

  const onSubmit = ({ login, email, password }) => {
    request('/register', 'POST', { login, email, password }).then(
      ({ error, user }) => {
        if (error) {
          setServerError(`Ошибка запроса: ${error}`);
          return;
        }

        dispatch(setUser(user));
        sessionStorage.setItem('userData', JSON.stringify(user));
      }
    );
  };

  const formError =
    errors?.email?.message ||
    errors?.password?.message ||
    errors?.passcheck?.message;
  const errorMessage = formError || serverError;

  if (roleId !== ROLE.GUEST) {
    return <Navigate to="/" />;
  }

  return (
    <div className={className}>
      <Header />
      <main>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Логин:</label>
            <input
              type="text"
              {...register('login', {
                onChange: () => setServerError(null),
              })}
            />
            {errors.login && <p className="error">{errors.login.message}</p>}
          </div>
          <div>
            <label>Электронная почта:</label>
            <input
              type="email"
              {...register('email', {
                onChange: () => setServerError(null),
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div>
            <label>Пароль:</label>
            <input
              type="password"
              {...register('password', {
                onChange: () => setServerError(null),
              })}
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label>Подтвердите пароль:</label>
            <input
              type="password"
              {...register('passcheck', {
                onChange: () => setServerError(null),
              })}
            />
            {errors.passcheck && (
              <p className="error">{errors.passcheck.message}</p>
            )}
          </div>
          <button type="submit">Зарегистрироваться</button>
        </form>

        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export const RegisterPage = styled(RegisterPageContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    margin-top: -12rem;

    h2 {
      margin-bottom: 1.5rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 300px;

      div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      button {
        padding: 0.5rem;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #218838;
        }
      }
    }

    .error {
      color: red;
      margin-bottom: 1rem;
    }
  }
`;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Navigate, Link } from 'react-router-dom';
import { Header, Footer, H2 } from '../../components';
import { selectUserRole } from '../../selectors';
import { useResetForm } from '../../hooks';
import { ROLE } from '../../constants';
import { request } from '../../utils';
import { setUser } from '../../actions';
import styled from 'styled-components';

const authFormSchema = yup.object().shape({
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
});

const LoginPageContainer = ({ className }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(authFormSchema),
  });

  const [serverError, setServerError] = useState(null);
  const dispatch = useDispatch();
  const roleId = useSelector(selectUserRole);

  useResetForm(reset);

  const onSubmit = ({ email, password }) => {
    request('/login', 'POST', { email, password })
      .then(({ error, user }) => {
        if (error) {
          setServerError(`Ошибка запроса: ${error}`);
          return;
        }

        dispatch(setUser(user));
        sessionStorage.setItem('userData', JSON.stringify(user));
      })
      .catch((error) => {
        setServerError(`Ошибка запроса: ${error.message}`);
      });
  };

  const formError = errors?.email?.message || errors?.password?.message;
  const errorMessage = formError || serverError;

  if (roleId !== ROLE.GUEST) {
    return <Navigate to="/" />;
  }

  return (
    <div className={className}>
      <Header />
      <main>
        <H2>Вход</H2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Электронная почта:</label>
            <input
              type="email"
              placeholder="Почта..."
              {...register('email', {
                onChange: () => setServerError(null),
              })}
            />
          </div>
          <div>
            <label>Пароль:</label>
            <input
              type="password"
              placeholder="Пароль..."
              {...register('password', {
                onChange: () => setServerError(null),
              })}
            />
          </div>
          <button type="submit">Войти</button>
        </form>
        <p>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export const LoginPage = styled(LoginPageContainer)`
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
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #0056b3;
        }
      }
    }

    .error {
      color: red;
      margin-bottom: 1rem;
    }
  }
`;

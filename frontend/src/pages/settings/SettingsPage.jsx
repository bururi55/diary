import { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { request } from '../../utils';
import { Header, Footer, Error, Icon, H2 } from '../../components';
import {
  selectUserEmail,
  selectUserRole,
  selectUserLogin,
} from '../../selectors';
import { ROLE } from '../../constants';
import { setUser, setUserSettings } from '../../actions';
import * as yup from 'yup';
import editIcon from '../../assets/icons/edit-icon.png';
import saveIcon from '../../assets/icons/save-icon.png';
import styled from 'styled-components';

const settingsSchema = yup.object().shape({
  insulinCoefficient: yup.number().required('Обязательное поле'),
  compensationCoefficient: yup.number().required('Обязательное поле'),
  targetSugar: yup.number().required('Обязательное поле'),
  dailyDoseOfInsulin: yup.number().required('Обязательное поле'),
  weight: yup.number().required('Обязательное поле'),
  birthDate: yup.date().required('Обязательное поле'),
  rounding: yup.string().required('Обязательное поле'),
  carbohydratesIn1Unit: yup.number().required('Обязательное поле'),
  severeHypoglycemia: yup.number().required('Обязательное поле'),
  hypoglycemia: yup.number().required('Обязательное поле'),
  normalGlucose: yup.number().required('Обязательное поле'),
  hyperglycemia: yup.number().required('Обязательное поле'),
  severeHyperglycemia: yup.number().required('Обязательное поле'),
  precoma: yup.number().required('Обязательное поле'),
});

const SettingsPageContainer = ({ className }) => {
  const userEmail = useSelector(selectUserEmail);
  const userRole = useSelector(selectUserRole);
  const userLogin = useSelector(selectUserLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState(null);
  const [editGeneral, setEditGeneral] = useState(false);
  const [editInsulin, setEditInsulin] = useState(false);
  const [editGlucoseScale, setEditGlucoseScale] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(settingsSchema),
  });

  useLayoutEffect(() => {
    const currentUserDataJSON = sessionStorage.getItem('userData');
    if (currentUserDataJSON) {
      const currentUserData = JSON.parse(currentUserDataJSON);
      dispatch(
        setUser({
          ...currentUserData,
          roleId: Number(currentUserData.roleId),
        })
      );
    }
  }, [dispatch]);

  useLayoutEffect(() => {
    if (userRole === ROLE.GUEST) {
      navigate('/error/403');
      return;
    }
    request(`/settings?email=${userEmail}`)
      .then((response) => {
        if (response.error) {
          setServerError(response.error);
          return;
        }
        reset(response.data);
        setValue('userName', userLogin);
      })
      .catch((error) => {
        setServerError(error.message || 'Произошла неизвестная ошибка');
      });
  }, [userEmail, userRole, navigate, reset, setValue, userLogin]);

  const onSubmit = async (data) => {
    try {
      const response = await request(
        `/settings?email=${userEmail}`,
        'PATCH',
        data
      );
      if (response.error) {
        setServerError(response.error);
        return;
      }
      dispatch(setUserSettings(response.data));
    } catch (error) {
      setServerError(error.message || 'Произошла неизвестная ошибка');
    }
  };

  const handleSaveGeneral = async () => {
    await handleSubmit(onSubmit)();
    setEditGeneral(false);
  };

  const handleSaveInsulin = async () => {
    await handleSubmit(onSubmit)();
    setEditInsulin(false);
  };

  const handleSaveGlucoseScale = async () => {
    await handleSubmit(onSubmit)();
    setEditGlucoseScale(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  };

  return (
    <div className={className}>
      <Header />
      <main>
        <H2>Настройки</H2>
        {serverError && <Error error={serverError} />}
        <div className="settings-container">
          <div className="section">
            <div className="section-header">
              <h3>Общие данные</h3>
              <div className="section-icons">
                {editGeneral ? (
                  <Icon
                    src={saveIcon}
                    fontSize="28px"
                    onClick={handleSaveGeneral}
                  />
                ) : (
                  <Icon
                    src={editIcon}
                    fontSize="35px"
                    onClick={() => setEditGeneral(true)}
                  />
                )}
              </div>
            </div>
            <div className="field">
              <label>Имя пользователя:</label>
              <div className="value">{userLogin}</div>
            </div>
            <div className="field">
              <label>Масса тела:</label>
              {editGeneral ? (
                <input type="number" {...register('weight')} />
              ) : (
                <div className="value">{watch('weight')}</div>
              )}
              {errors.weight && editGeneral && (
                <p className="error-message">{errors.weight.message}</p>
              )}
            </div>
            <div className="field">
              <label>Дата рождения:</label>
              {editGeneral ? (
                <input type="date" {...register('birthDate')} />
              ) : (
                <div className="value">{formatDate(watch('birthDate'))}</div>
              )}
              {errors.birthDate && editGeneral && (
                <p className="error-message">{errors.birthDate.message}</p>
              )}
            </div>
          </div>
          <div className="section">
            <div className="section-header">
              <h3>Расчет инсулина</h3>
              <div className="section-icons">
                {editInsulin ? (
                  <Icon
                    src={saveIcon}
                    fontSize="28px"
                    onClick={handleSaveInsulin}
                  />
                ) : (
                  <Icon
                    src={editIcon}
                    fontSize="35px"
                    onClick={() => setEditInsulin(true)}
                  />
                )}
              </div>
            </div>
            <div className="field">
              <label>Коэффициент инсулина на 1 ХЕ:</label>
              {editInsulin ? (
                <input type="number" {...register('insulinCoefficient')} />
              ) : (
                <div className="value">{watch('insulinCoefficient')}</div>
              )}
              {errors.insulinCoefficient && editInsulin && (
                <p className="error-message">
                  {errors.insulinCoefficient.message}
                </p>
              )}
            </div>
            <div className="field">
              <label>Компенсация:</label>
              {editInsulin ? (
                <input type="number" {...register('compensationCoefficient')} />
              ) : (
                <div className="value">{watch('compensationCoefficient')}</div>
              )}
              {errors.compensationCoefficient && editInsulin && (
                <p className="error-message">
                  {errors.compensationCoefficient.message}
                </p>
              )}
            </div>
            <div className="field">
              <label>Целевой уровень сахара:</label>
              {editInsulin ? (
                <input type="number" {...register('targetSugar')} />
              ) : (
                <div className="value">{watch('targetSugar')}</div>
              )}
              {errors.targetSugar && editInsulin && (
                <p className="error-message">{errors.targetSugar.message}</p>
              )}
            </div>
            <div className="field">
              <label>Суточная доза инсулина:</label>
              {editInsulin ? (
                <input type="number" {...register('dailyDoseOfInsulin')} />
              ) : (
                <div className="value">{watch('dailyDoseOfInsulin')}</div>
              )}
              {errors.dailyDoseOfInsulin && editInsulin && (
                <p className="error-message">
                  {errors.dailyDoseOfInsulin.message}
                </p>
              )}
            </div>
            <div className="field">
              <label>Округление:</label>
              {editInsulin ? (
                <select {...register('rounding')}>
                  <option value="Отключить">Отключить</option>
                  <option value="К большему">К большему</option>
                  <option value="К меньшему">К меньшему</option>
                </select>
              ) : (
                <div className="value">{watch('rounding')}</div>
              )}
              {errors.rounding && editInsulin && (
                <p className="error-message">{errors.rounding.message}</p>
              )}
            </div>
            <div className="field">
              <label>Количество углеводов в ХЕ:</label>
              {editInsulin ? (
                <input type="number" {...register('carbohydratesIn1Unit')} />
              ) : (
                <div className="value">{watch('carbohydratesIn1Unit')}</div>
              )}
              {errors.carbohydratesIn1Unit && editInsulin && (
                <p className="error-message">
                  {errors.carbohydratesIn1Unit.message}
                </p>
              )}
            </div>
          </div>
          <div className="section">
            <div className="section-header">
              <h3>Шкала глюкозы</h3>
              <div className="section-icons">
                {editGlucoseScale ? (
                  <Icon
                    src={saveIcon}
                    fontSize="28px"
                    onClick={handleSaveGlucoseScale}
                  />
                ) : (
                  <Icon
                    src={editIcon}
                    fontSize="35px"
                    onClick={() => setEditGlucoseScale(true)}
                  />
                )}
              </div>
            </div>
            <div className="field">
              <label>Тяжелая гипогликемия:</label>
              {editGlucoseScale ? (
                <input type="number" {...register('severeHypoglycemia')} />
              ) : (
                <div className="value">{watch('severeHypoglycemia')}</div>
              )}
              {errors.severeHypoglycemia && editGlucoseScale && (
                <p className="error-message">
                  {errors.severeHypoglycemia.message}
                </p>
              )}
            </div>
            <div className="field">
              <label>Гипогликемия:</label>
              {editGlucoseScale ? (
                <input type="number" {...register('hypoglycemia')} />
              ) : (
                <div className="value">{watch('hypoglycemia')}</div>
              )}
              {errors.hypoglycemia && editGlucoseScale && (
                <p className="error-message">{errors.hypoglycemia.message}</p>
              )}
            </div>
            <div className="field">
              <label>Нормальная глюкоза:</label>
              {editGlucoseScale ? (
                <input type="number" {...register('normalGlucose')} />
              ) : (
                <div className="value">{watch('normalGlucose')}</div>
              )}
              {errors.normalGlucose && editGlucoseScale && (
                <p className="error-message">{errors.normalGlucose.message}</p>
              )}
            </div>
            <div className="field">
              <label>Гипергликемия:</label>
              {editGlucoseScale ? (
                <input type="number" {...register('hyperglycemia')} />
              ) : (
                <div className="value">{watch('hyperglycemia')}</div>
              )}
              {errors.hyperglycemia && editGlucoseScale && (
                <p className="error-message">{errors.hyperglycemia.message}</p>
              )}
            </div>
            <div className="field">
              <label>Тяжелая гипергликемия:</label>
              {editGlucoseScale ? (
                <input type="number" {...register('severeHyperglycemia')} />
              ) : (
                <div className="value">{watch('severeHyperglycemia')}</div>
              )}
              {errors.severeHyperglycemia && editGlucoseScale && (
                <p className="error-message">
                  {errors.severeHyperglycemia.message}
                </p>
              )}
            </div>
            <div className="field">
              <label>Прекома:</label>
              {editGlucoseScale ? (
                <input type="number" {...register('precoma')} />
              ) : (
                <div className="value">{watch('precoma')}</div>
              )}
              {errors.precoma && editGlucoseScale && (
                <p className="error-message">{errors.precoma.message}</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const SettingsPage = styled(SettingsPageContainer)`
  display: flex;
  flex-direction: column;
  height: 100%;
  H2 {
    font-size: 2em;
  }
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .settings-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    justify-content: center;
  }
  .section {
    flex: 1;
    min-width: 500px;
    min-height: 600px;
    background: linear-gradient(
      to left,
      rgba(165 231 233 / 0.7),
      rgba(251 243 174 / 0.8)
    );
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.6);
  }
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 1.7em;
  }
  .section-icons {
    display: flex;
    gap: 10px;
  }
  .field {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
  }
  label {
    margin: 7px;
    font-weight: bold;
    font-size: 1.17em;
  }
  .value {
    cursor: pointer;
    flex-grow: 1;
    font-size: 1.17em;
  }
  input,
  select {
    flex-grow: 1;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
  }
  .error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
  }
`;

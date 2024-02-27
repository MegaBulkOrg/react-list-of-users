import { useCreateNewUserInfoMutation, useSignupMutation } from 'Redux/api/users';
import { changeRegStatus } from 'Redux/authSlice';
import { useAppDispatch } from 'Redux/hooks';
import { Icon } from 'Shared/components/icons/Icon';
import { EIcon } from 'Shared/components/icons/enums';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './regform.sass';

export function RegForm() {
  // для возможности перейти на страницу входа
  const navigation = useNavigate()
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })
  const [formVerified, setFormVerified] = useState({
    nameVerified: false,
    emailVerified: false,
    passwordVerified: false,
    passwordConfirmVerified: false,
    duplicatedUsersVerified: false,
    firstSubmit: false
  })

  // для записи пользователя в список пользователей
  const [createUser, {isSuccess: createUserSuccess, isError: createUserError, isLoading: createUserLoading}] = useSignupMutation()
  // для создания объекта с информацией о пользователе
  const dispatch = useAppDispatch()
  const [createUserInfo] = useCreateNewUserInfoMutation()
  
  // получение значений полей
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  // изменение объекта проверки
  const formVerifiedChange = (name:string, value:boolean) => {
    setFormVerified((prevState) =>  {
      return {...prevState,[name]: value}
    })
  }

  // проверка полей формы
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    // меняем флаг первой попытки отправки (условие не дает постоянно менять значение после первой отправки)
    if (!formVerified.firstSubmit) formVerifiedChange('firstSubmit', true)
    // проверка поля с именем
    formVerifiedChange('nameVerified', form.name.length >= 3)
    // проверка поля с email
    const emailRegEx = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u
    formVerifiedChange('emailVerified', emailRegEx.test(form.email))
    // проверка поля с паролем
    form.password.length < 6 || /\s/.test(form.password) || /[а-яёА-ЯЁ]/.test(form.password) ? formVerifiedChange('passwordVerified', false) : formVerifiedChange('passwordVerified', true)
    // проверка поля с подтверждением пароля
    formVerifiedChange('passwordConfirmVerified', form.passwordConfirm === form.password)
    // изменение (может и ошибочное) значения state проверки на дубли чтобы была возможность заново запустить отправку данных при изменении e-mail
    formVerifiedChange('duplicatedUsersVerified', true)
  }

  // отправка формы
  useEffect(() => {
    async function signup() {
      if (formVerified.nameVerified && formVerified.emailVerified && formVerified.passwordVerified && formVerified.passwordConfirmVerified) {
        const response = await createUser({
          email: form.email,
          password: form.password
        }).unwrap()
          // по идее из-за использования createUserInfo функцию в then надо делать асинхронной но оно работает и так
          .then(payload => {
            // добавляем в Redux временный токен генерируемый при регистрации для создания карточки с информацией о новом пользователе
            dispatch(changeRegStatus({regToken: payload.accessToken}))
            // создание карточки с информацией о новом пользователе
            createUserInfo({
              user_id: payload.user.id,
              name: form.name,
              phone: '',
              avatar: '',
              role: '',
              description: ''
            })
            // стираем временный токен
            dispatch(changeRegStatus({regToken: null}))
            // очистка полей формы
            setForm({
              name: '',
              email: '',
              password: '',
              passwordConfirm: ''
            })
            // откат объекта проверки формы
            setFormVerified({
              nameVerified: false,
              emailVerified: false,
              passwordVerified: false,
              passwordConfirmVerified: false,
              duplicatedUsersVerified: false,
              firstSubmit: false
            })
          })
          .catch(error => {
            if (error.data === 'Email already exists') formVerifiedChange('duplicatedUsersVerified', false)
          })
      }
    }
    signup();
  // вместо единого formVerified прописываем отдельно только нужные поля чтобы не реагировать на изменение formVerified.duplicatedUsersVerified
  }, [formVerified.nameVerified, formVerified.emailVerified, formVerified.passwordVerified, formVerified.passwordConfirmVerified, formVerified.duplicatedUsersVerified])

  // функция для кнопки перехода на страницу входа
  function goToLogin() {
    navigation('/login')
  }
  
  // глазик для полей с паролем
  const refPassword = useRef<HTMLInputElement>(null)
  const refPasswordConfirm = useRef<HTMLInputElement>(null)
  function showPassword(field:HTMLInputElement | null) {
    if (field && field !== null) {
      field.type === 'password' ? field.type = 'text' : field.type = 'password'
    }
  }

  return (
    <main className='main'>
      <section className={styles.formPage}>
        <div className={styles.formPageContainer}>
          <p className={styles.formPageFormTitle}>Регистрация</p>
          <form onSubmit={handleSubmit} autoComplete='on'>
            
            <div className={styles.formGroup}>
              <label htmlFor='inputName' className={styles.formLabel}>Имя</label>
              <input type='text' name='name' value={form.name} className={!formVerified.nameVerified && formVerified.firstSubmit ? styles.formControlError : styles.formControl} id='inputName' placeholder='Артур' onChange={handleChange} required />
              {!formVerified.nameVerified && formVerified.firstSubmit &&
                <p className={styles.formErrorMsg}>Длина имени должна быть не менее 3 символов</p>
              }
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='inputEmail' className={styles.formLabel}>Электронная почта</label>
              <input type='email' name='email' value={form.email} className={!formVerified.emailVerified && formVerified.firstSubmit ? styles.formControlError : styles.formControl} id='inputEmail' placeholder='example@mail.ru' onChange={handleChange} required />
              {!formVerified.emailVerified && formVerified.firstSubmit &&
                <p className={styles.formErrorMsg}>Укажите e-mail в правильном формате</p>
              }
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='inputPassword' className={styles.formLabel}>Пароль</label>
              <input type='password' name='password' value={form.password} ref={refPassword} autoComplete='on' className={!formVerified.passwordVerified && formVerified.firstSubmit ? styles.formControlError : styles.formControl} id='inputPassword' placeholder='******' onChange={handleChange} required />
              <Icon name={EIcon.formEye} width={24} height={24} action={() => showPassword(refPassword.current)} />
              {!formVerified.passwordVerified && formVerified.firstSubmit &&
                <p className={styles.formErrorMsg}>Пароль должен быть от 6 символов, без пробелов и кириллицы</p>
              }
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='inputPasswordConfirm' className={styles.formLabel}>Подтвердите пароль</label>
              <input type='password' name='passwordConfirm' value={form.passwordConfirm} ref={refPasswordConfirm} autoComplete='on' className={!formVerified.passwordConfirmVerified && formVerified.firstSubmit ? styles.formControlError : styles.formControl} id='inputPasswordConfirm' placeholder='******' onChange={handleChange} required />
              <Icon name={EIcon.formEye} width={24} height={24} action={() => showPassword(refPasswordConfirm.current)} />
              {!formVerified.passwordConfirmVerified && formVerified.firstSubmit &&
                <p className={styles.formErrorMsg}>Пароли не совпадают</p>
              }
            </div>

            {!formVerified.duplicatedUsersVerified && formVerified.firstSubmit &&
              <p className={styles.formErrorMsgBig}>Пользователь с таким e-mail уже зарегистрирован</p>
            }

            {formVerified.duplicatedUsersVerified && !createUserLoading && createUserError &&
              <p className={styles.formErrorMsgBig}>Произошла ошибка. Повторите попытку позже.</p>
            }

            {createUserSuccess &&
              <p className={styles.formSuccessMsgBig}>
                Благодарим за регистрацию!<br/>Теперь Вы можете войти на сайт<br/>с указанными данными.
              </p>
            }

            <button type='submit' className={styles.formSubmit}>Зарегистрироваться</button>

            <div className={styles.formGroup} style={{marginTop:'16px'}}>
              <p className={styles.formLabel}>Есть учетная запись?</p>
              <button className={styles.formSubmit} onClick={goToLogin}>Войти</button>
            </div>

          </form> 
        </div>
      </section>
    </main>   
  )
}
import { useCreateUserMutation, useLazyCheckingUserByEmailQuery } from 'Redux/api/users';
import { Icon } from 'Shared/components/icons/Icon';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './regform.sass';

export function RegForm() {
  // для возможности перейти на страницу входа
  const navigation = useNavigate()
  
  // состояния для полей, их ошибок и первого входа
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [nameVerified, setNameVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [passwordVerified, setPasswordVerified] = useState(false)
  const [passwordConfirmVerified, setPasswordConfirmVerified] = useState(false)
  const [duplicatedUsersVerified, setDuplicatedUsersVerified] = useState(false)
  const [firstSubmit, setFirstSubmit] = useState(false)

  // для проверки на дубль
  const [trigger, {isSuccess: emailCheckSuccess, isLoading: emailCheckLoading, isError: emailCheckError}] = useLazyCheckingUserByEmailQuery()
  // для отправки формы
  const [createUser, {isSuccess: createUserSuccess, isError: createUserError, isLoading: createUserLoading}] = useCreateUserMutation()
  
  // ловим значения полей
  function handleChangeName(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value)
  }
  function handleChangeEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }
  function handleChangePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }
  function handleChangePasswordConfirm(event: ChangeEvent<HTMLInputElement>) {
    setPasswordConfirm(event.target.value)
  }
  
  // проверка полей формы
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFirstSubmit(true)
    // проверка поля с именем
    name.length < 3 ? setNameVerified(false) : setNameVerified(true)
    // проверка поля с email
    const emailRegEx = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u
    emailRegEx.test(email) ? setEmailVerified(true) : setEmailVerified(false)
    // проверка поля с паролем
    password.length < 6 || /\s/.test(password) || /[а-яёА-ЯЁ]/.test(password) ? setPasswordVerified(false) : setPasswordVerified(true)
    // проверка поля с подтверждением пароля
    passwordConfirm !== password ? setPasswordConfirmVerified(false) : setPasswordConfirmVerified(true)
    // проверка: есть ли уже такой пользователь
    const {data: users} = await trigger(email)
    users?.length === 1 ? setDuplicatedUsersVerified(false) : setDuplicatedUsersVerified(true)
  }

  // отправка формы
  // тут по идее нужно сделать функцию асинхронной но так как в рамках данной функции после отправки ничего не происходит я не стал этого делать
  useEffect(() => {
    if (nameVerified && emailVerified && passwordVerified && passwordConfirmVerified && duplicatedUsersVerified) {
      createUser({
        name,
        email,
        phone: '',
        avatar: '',
        password,
        role: '',
        description: '',
        liked: false
      }).unwrap()
    }
  }, [nameVerified, emailVerified, passwordVerified, passwordConfirmVerified, duplicatedUsersVerified])

  // очистка полей формы
  useEffect(() => {
    setName('')
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
  }, [createUserSuccess])

  // функция для кнопки перехода на страницу входа
  function goToLogin() {
    navigation('/login')
  }
  
  // глазик для полей с паролем
  const refPassword = useRef<HTMLInputElement>(null)
  const refPasswordConfirm = useRef<HTMLInputElement>(null)
  enum EIcon {
    formEye = 'formEye'
  }
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
              <input type='text' value={name} 
                className={!nameVerified && firstSubmit ? styles.formControlError : styles.formControl} 
              id='inputName' placeholder='Артур' onChange={handleChangeName} required />
              {!nameVerified && firstSubmit &&
                <p className={styles.formErrorMsg}>Длина имени должна быть не менее 3 символов</p>
              }
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='inputEmail' className={styles.formLabel}>Электронная почта</label>
              <input type='email' value={email} 
                className={!emailVerified && firstSubmit ? styles.formControlError : styles.formControl} 
              id='inputEmail' placeholder='example@mail.ru' onChange={handleChangeEmail} required />
              {!emailVerified && firstSubmit &&
                <p className={styles.formErrorMsg}>Укажите e-mail в правильном формате</p>
              }
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='inputPassword' className={styles.formLabel}>Пароль</label>
              <input type='password' value={password} ref={refPassword} autoComplete='on'
                className={!passwordVerified && firstSubmit ? styles.formControlError : styles.formControl} 
              id='inputPassword' placeholder='******' onChange={handleChangePassword} required />
              <Icon name={EIcon.formEye} width={24} height={24} action={() => showPassword(refPassword.current)} />
              {!passwordVerified && firstSubmit &&
                <p className={styles.formErrorMsg}>Пароль должен быть от 6 символов, без пробелов и кириллицы</p>
              }
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='inputPasswordConfirm' className={styles.formLabel}>Подтвердите пароль</label>
              <input type='password' value={passwordConfirm} ref={refPasswordConfirm} autoComplete='on'
                className={!passwordConfirmVerified && firstSubmit ? styles.formControlError : styles.formControl} 
              id='inputPasswordConfirm' placeholder='******' onChange={handleChangePasswordConfirm} required />
              <Icon name={EIcon.formEye} width={24} height={24} action={() => showPassword(refPasswordConfirm.current)} />
              {!passwordConfirmVerified && firstSubmit &&
                <p className={styles.formErrorMsg}>Пароли не совпадают</p>
              }
            </div>

            {!emailCheckLoading && emailCheckSuccess && !duplicatedUsersVerified && firstSubmit &&
              <p className={styles.formErrorMsgBig}>Пользователь с таким e-mail уже зарегистрирован</p>
            }

            {!createUserLoading && createUserError &&
              <p className={styles.formErrorMsgBig}>Произошла ошибка</p>
            }

            {createUserSuccess &&
              <p className={styles.formSuccessMsgBig}>
                Благодарим за регистрацию!<br/>Теперь Вы можете войти на сайт с указанными данными.
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
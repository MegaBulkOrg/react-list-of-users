import users from 'Assets/users.json';
import { Icon } from 'Icons/Icon';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './regform.sass';

export function RegForm() {
  // для возможности перейти на страницу входа
  const navigation = useNavigate()
  // состояния для полей и их ошибок
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [nameVerified, setNameVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [passwordVerified, setPasswordVerified] = useState(false)
  const [passwordConfirmVerified, setPasswordConfirmVerified] = useState(false)
  const [duplicatedUsersVerified, setDuplicatedUsersVerified] = useState(false)
  // рефы для глазиков
  const refPassword = useRef<HTMLInputElement>(null)
  const refPasswordConfirm = useRef<HTMLInputElement>(null)
  // прочее
  const [firstSubmit, setFirstSubmit] = useState(false)
  let result = []
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
  
  // проверки формы
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFirstSubmit(true)
    // проверка поля с именем
    name.length < 3 || /\s/.test(name) ? setNameVerified(false) : setNameVerified(true)    
    // проверка поля с email
    const emailRegEx = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u
    emailRegEx.test(email) ? setEmailVerified(true) : setEmailVerified(false)
    // проверка поля с паролем
    password.length < 6 || /\s/.test(password) || /[а-яёА-ЯЁ]/.test(password) ? setPasswordVerified(false) : setPasswordVerified(true)
    // проверка поля с подтверждением пароля
    passwordConfirm !== password ? setPasswordConfirmVerified(false) : setPasswordConfirmVerified(true)
    // проверка: есть ли уже такой пользователь
    const asArray = Object.entries(users)
    result = asArray.filter(user => {
      return user[1].email.toLowerCase() === email.toLowerCase() && user[1].login.toLowerCase() === name.toLowerCase() 
    })
    if(result.length !== 0) {
      setDuplicatedUsersVerified(false)
      return
    } else {setDuplicatedUsersVerified(true)}
  }

  // очистка формы после успешной отправки
  useEffect(() => {
    if (firstSubmit && nameVerified && emailVerified && passwordVerified && passwordConfirmVerified && duplicatedUsersVerified) {
      setName('')
      setEmail('')
      setPassword('')
      setPasswordConfirm('')
    }
  }, [nameVerified, emailVerified, passwordVerified, passwordConfirmVerified, duplicatedUsersVerified, firstSubmit])

  // функция для кнопки перехода на страницу входа
  function goToLogin() {
    navigation('/login')
  }
  // глазик для полей с паролем
  enum EIcon {
    formEye = 'formEye'
  }
  // функция для глазика
  function showPassword(field:HTMLInputElement | null) {
    if (field && field !== null) {
      field.type === 'password' ? field.type = 'text' : field.type = 'password'
    }
  }

  return (        
    <main className='main'>
      <section className={styles.reg}>
        <div className={styles.regContainer}>    
          <p className={styles.regFormTitle}>Регистрация</p>
          <form onSubmit={handleSubmit} autoComplete='on'>
            
            <div className={styles.formGroup}>
              <label htmlFor='inputName' className={styles.formLabel}>Имя</label>
              <input type='text' value={name} 
                className={!nameVerified && firstSubmit ? styles.formControlError : styles.formControl} 
              id='inputName' placeholder='Артур' onChange={handleChangeName} required />
              {!nameVerified && firstSubmit &&
                <p className={styles.formErrorMsg}>Длина имени должна быть не менее 3 символов и не содержать пробелы</p>
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

            {!duplicatedUsersVerified && firstSubmit &&
              <p className={styles.formErrorMsgBig}>Пользователь с таким именем и e-mail уже зарегистрирован</p>
            }

            {nameVerified && emailVerified && passwordVerified && passwordConfirmVerified && duplicatedUsersVerified && firstSubmit &&
              <p className={styles.formSuccessMsgBig}>
                Благодарим за регистрацию! Вам на почту будет<br/>оправлено письмо для подтверждения.
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
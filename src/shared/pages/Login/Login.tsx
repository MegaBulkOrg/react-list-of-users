import users from 'Assets/users.json';
import { Icon } from 'Icons/Icon';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authorizationStatus } from 'Store/authorization';
import styles from './login.sass';

export function Login() {
  // перенаправление на случай если пользователь уже в системе
  const [entered, setEntered] = useState(false)
  const navigation = useNavigate()
  useEffect(() => {
    if (localStorage.getItem('user') !== null) navigation('/')
  },[])

  const dispatch = useDispatch<any>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstSubmit, setFirstSubmit] = useState(false)
  let result = []
  // реф для глазика
  const refPassword = useRef<HTMLInputElement>(null)
  // ловим значения полей
  function handleChangeEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }
  function handleChangePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }
  // проверка формы
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFirstSubmit(true) 
    const asArray = Object.entries(users)
    result = asArray.filter(user => {
      return user[1].email === email && user[1].password === password 
    })
    if(result.length !== 0) {
      dispatch(authorizationStatus(true))
      localStorage.setItem('user', result[0][0])
      setEntered(true)
    }
  }
    
  // функция для кнопки перехода на страницу регистрации
  function goToSignUp() {
    navigation('/sign-up')
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
      <section className={styles.login}>
        <div className={styles.loginContainer}>    
          <p className={styles.loginFormTitle}>Вход</p>
          <form onSubmit={handleSubmit} autoComplete="on">
            
            <div className={styles.formGroup}>
              <label htmlFor='inputEmail' className={styles.formLabel}>E-mail</label>
              <input type='email' value={email} 
                className={!entered && firstSubmit ? styles.formControlError : styles.formControl} 
              id='inputEmail' placeholder='example@mail.ru' onChange={handleChangeEmail} required />
              {!entered && firstSubmit &&
                <p className={styles.formErrorMsg}>Возможно, Вы указали неправильный e-mail</p>
              }
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor='inputPassword' className={styles.formLabel}>Пароль</label>
              <input type='password' value={password} ref={refPassword} autoComplete='on'
                className={!entered && firstSubmit ? styles.formControlError : styles.formControl} 
              id='inputPassword' placeholder='******' onChange={handleChangePassword} required />
              <Icon name={EIcon.formEye} width={24} height={24} action={() => showPassword(refPassword.current)} />
              {!entered && firstSubmit &&
                <p className={styles.formErrorMsg}>Возможно, Вы указали неправильный пароль</p>
              }
            </div>

            <button type='submit' className={styles.formSubmit}>Войти</button>

            <div className={styles.formGroup} style={{marginTop:'16px'}}>
              <p className={styles.formLabel}>Еще не зарегистрировались?</p>
              <button className={styles.formSubmit} onClick={goToSignUp}>Регистрация</button>
            </div>

          </form> 
        </div>
      </section>
    </main>   
  )
}
import { useLazyCheckingUserByEmailQuery } from 'Redux/api/users';
import { changeAuthStatus } from 'Redux/authSlice';
import { useAppDispatch, useAppSelector } from 'Redux/hooks';
import { Icon } from 'Shared/components/icons/Icon';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.sass';

export function Login() {
  // перенаправление на случай если пользователь уже в системе 
  const authStatus = useAppSelector(state => state.auth.authorized);
  const navigation = useNavigate()
  useEffect(() => {
    if (authStatus) navigation('/')
  },[])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
    
  const [firstSubmit, setFirstSubmit] = useState(false)
  
  const [showEmailErrorMsg, setShowEmailErrorMsg] = useState(false)
  const [showPasswordErrorMsg, setPasswordShowErrorMsg] = useState(false)

  const [trigger, {isSuccess: emailCheckSuccess, isLoading: emailCheckLoading, isError: emailCheckError}] = useLazyCheckingUserByEmailQuery()
  const dispatch = useAppDispatch()
    
  // ловим значения полей
  function handleChangeEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }
  function handleChangePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }
  
  // проверка формы
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFirstSubmit(true) 
    const {data: users} = await trigger(email)
    // если пользователь не найден
    if (users?.length === 0) setShowEmailErrorMsg(true)
    // если не подходит пароль
    if (users?.length === 1 && users[0].password !== password) {
      setShowEmailErrorMsg(false)
      setPasswordShowErrorMsg(true)
    }
    // если проверка прошла
    if (users?.length === 1 && users[0].password === password) {
      setShowEmailErrorMsg(false)
      setPasswordShowErrorMsg(false)
      dispatch(changeAuthStatus({
        authorized: true,
        userId: users[0].id
      }))
      navigation('/')
    }
  }
    
  // функция для кнопки перехода на страницу регистрации
  function goToSignUp() {
    navigation('/sign-up')
  }

  // глазик для поля с паролем
  const refPassword = useRef<HTMLInputElement>(null)
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
          <p className={styles.formPageFormTitle}>Вход</p>
          <form onSubmit={handleSubmit} autoComplete="on">
            
            <div className={styles.formGroup}>
              <label htmlFor='inputEmail' className={styles.formLabel}>E-mail</label>
              <input type='email' value={email} 
                className={firstSubmit ? styles.formControlError : styles.formControl} 
              id='inputEmail' placeholder='example@mail.ru' onChange={handleChangeEmail} required />
              {showEmailErrorMsg &&
                <p className={styles.formErrorMsg}>Пользователь с таким e-mail не найден</p>
              }
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor='inputPassword' className={styles.formLabel}>Пароль</label>
              <input type='password' value={password} ref={refPassword} autoComplete='on'
                className={firstSubmit ? styles.formControlError : styles.formControl} 
              id='inputPassword' placeholder='******' onChange={handleChangePassword} required />
              <Icon name={EIcon.formEye} width={24} height={24} action={() => showPassword(refPassword.current)} />
              {showPasswordErrorMsg &&
                <p className={styles.formErrorMsg}>Пароль не подходит</p>
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
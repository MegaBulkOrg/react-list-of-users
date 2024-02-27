import { useSigninMutation } from 'Redux/api/users';
import { changeAuthStatus } from 'Redux/authSlice';
import { useAppDispatch } from 'Redux/hooks';
import { Icon } from 'Shared/components/icons/Icon';
import { EIcon } from 'Shared/components/icons/enums';
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.sass';

export function Login() {
  const navigation = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  
  const [formCheckSettings, setFormCheckSettings] = useState({
    firstSubmit: false,
    emailFieldError: false,
    passwordFieldError: false
  })

  // для отправки формы
  const [signin] = useSigninMutation()

  // для записи в Redux токена
  const dispatch = useAppDispatch()

  // получение значений полей
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  // изменение объекта проверки
  const formCheckSettingsChange = (name:string, value:boolean) => {
    setFormCheckSettings((prevState) =>  {
      return {...prevState,[name]: value}
    })
  }

  // отправка формы и поиск данного пользователя
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!formCheckSettings.firstSubmit) formCheckSettingsChange('firstSubmit', true)
    signin({
      email: form.email,
      password: form.password
    }).unwrap()
      .then(payload => {
        dispatch(changeAuthStatus({
          accessToken: payload.accessToken,
          authedUserId: payload.user.id
        }))
        formCheckSettingsChange('emailFieldError', false)
        formCheckSettingsChange('passwordFieldError', false)
      })
      .catch(error => {
        if (error.data === 'Cannot find user') {
          formCheckSettingsChange('emailFieldError', true)
          formCheckSettingsChange('passwordFieldError', false)
        }
        if (error.data === 'Incorrect password') {
          formCheckSettingsChange('emailFieldError', false)
          formCheckSettingsChange('passwordFieldError', true)
        }
      })
  }
    
  // функция для кнопки перехода на страницу регистрации
  function goToSignUp() {
    navigation('/sign-up')
  }

  // глазик для поля с паролем
  const refPassword = useRef<HTMLInputElement>(null)
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
              <input type='email' name='email' value={form.email} className={formCheckSettings.firstSubmit && formCheckSettings.emailFieldError ? styles.formControlError : styles.formControl} id='inputEmail' placeholder='example@mail.ru' onChange={handleChange} required />
              {formCheckSettings.emailFieldError &&
                <p className={styles.formErrorMsg}>Пользователь с таким e-mail не найден</p>
              }
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor='inputPassword' className={styles.formLabel}>Пароль</label>
              <input type='password' name='password' value={form.password} ref={refPassword} autoComplete='on' 
                className={formCheckSettings.firstSubmit && formCheckSettings.passwordFieldError ? styles.formControlError : styles.formControl} 
              id='inputPassword' placeholder='******' onChange={handleChange} required />
              <Icon name={EIcon.formEye} width={24} height={24} action={() => showPassword(refPassword.current)} />
              {formCheckSettings.passwordFieldError &&
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
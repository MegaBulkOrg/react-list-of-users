import { changeAuthStatus } from 'Redux/authSlice';
import { useAppDispatch, useAppSelector } from 'Redux/hooks';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../global.sass';
import { Icon } from '../icons/Icon';

export function HeaderBtns() {
    // авторизация
    const authStatus = useAppSelector(state => state.auth.authorized);
    const [isAuth, setIsAuth] = useState(false) 
    const navigation = useNavigate()
    useEffect(() => {
        authStatus ? setIsAuth(true) : navigation('/login')
    },[isAuth])  
    const dispatch = useAppDispatch();
    function exit() {
        dispatch(changeAuthStatus({
        authorized: false,
        userId: null
      }))
        setIsAuth(false)
    }
    
    // перенаправление на Главную
    function back() {
        navigation('/')
    }

    // перенаправление на редактирование профиля
    function editProfile() {
        navigation('/users/edit-profile')
    }

    // значки
    enum EIcon {
        exit = 'exit',
        back = 'back',
        formEye = 'formEye',
        profileIcon = 'profileIcon'
    }

    return (
        <>
            <button className={styles.backBtnDesktop} onClick={back}>Главная</button>
            <button className={styles.backBtnMobile} onClick={back}>
                <Icon name={EIcon.back} width={7} height={14} />
            </button>
            <button className={styles.profileBtnDesktop} onClick={editProfile}>Профиль</button>
            <button className={styles.profileBtnMobile} onClick={editProfile}>
                <Icon name={EIcon.profileIcon} width={18} height={18} />
            </button>
            <button className={styles.exitBtnDesktop} onClick={exit}>Выход</button>
            <button className={styles.exitBtnMobile} onClick={exit}>
                <Icon name={EIcon.exit} width={18} height={18} />
            </button>
        </>
    );
}
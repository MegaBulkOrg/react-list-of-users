import { changeAuthStatus } from 'Redux/authSlice';
import { useAppDispatch } from 'Redux/hooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../global.sass';
import { Icon } from '../icons/Icon';
import { EIcon } from '../icons/enums';

export function HeaderBtns() {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    
    // перенаправление на форму логина при выходе
    function exit() {
        dispatch(changeAuthStatus({
            accessToken: null,
            authedUserId: null
        }))
        navigation('/login')
    }
    
    // перенаправление на Главную
    function back() {
        navigation('/')
    }

    // перенаправление на редактирование профиля
    function editProfile() {
        navigation('/users/edit-profile')
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
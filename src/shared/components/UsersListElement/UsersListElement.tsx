import nophoto from 'Assets/avatars/_no-photo.jpg';
import { IUserInfo } from 'Redux/apiInterfaces';
import { useAppSelector } from 'Redux/hooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./userslistelement.sass";

export function UsersListElement(props:IUserInfo) {
  const navigation = useNavigate()
  function getUserInfo() {
    navigation(`/users/${props.id}`)
  }

  // ID авторизованного пользователя (нужно для стилизации своей карточки)
  const authUserId = useAppSelector(state => state.auth.authedUserId);

  return (
    <div className={props.id === authUserId ? styles.userCard__authUser : styles.userCard} onClick={getUserInfo}>
      <div className={styles.userCardContent}>
        <div className={styles.userPhoto}>
          <img src={props.avatar ? `/assets/${props.avatar}` : nophoto} alt={props.name} />
        </div>
        <p className={styles.userName}>{props.name}</p>
        {props.id === authUserId &&
          <p className={styles.userName__me}>&#9733;</p>
        }
      </div>
    </div>
  );
}
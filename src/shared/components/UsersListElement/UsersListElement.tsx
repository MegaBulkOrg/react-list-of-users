import nophoto from 'Assets/avatars/_no-photo.jpg';
import { IUser } from 'Redux/apiInterfaces';
import { useAppSelector } from 'Redux/hooks';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./userslistelement.sass";

export function UsersListElement(props:IUser) {
  const navigation = useNavigate()
  function getUserInfo() {
    navigation(`/users/${props.id}`)
  }

  // объяснение этой громоздкой конструкции дано в компоненте UserInfo
  const [image, setImage] = useState('');
  useEffect(() => {
      async function getAvatar() { 
        const img = await import(`Assets/${props.avatar}`);
        setImage(img.default)
      }
      getAvatar()
  }, []);

  //  ID авторизованного пользователя
  const authUserId = useAppSelector(state => state.auth.userId);

  return (
    <div className={props.id === authUserId ? styles.userCard__authUser : styles.userCard} onClick={getUserInfo}>
      <div className={styles.userCardContent}>
        <div className={styles.userPhoto}>
          <img src={props.avatar ? image : nophoto} alt={props.name} />
        </div>
        <p className={styles.userName}>{props.name}</p>
        {props.id === authUserId &&
          <p className={styles.userName__me}>&#9733;</p>
        }
      </div>
    </div>
  );
}
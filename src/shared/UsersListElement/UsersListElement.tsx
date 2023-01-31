import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./userslistelement.sass";

export interface IUsersListElementProps {
  id: string
  first_name: string
  last_name: string
  img: string
  email: string
}

export function UsersListElement(props:IUsersListElementProps) {
  const navigation = useNavigate()
  function getUserInfo() {
    navigation(`/users/${props.id}`)
  }
  
  return (
    <div className={styles.userCard} onClick={getUserInfo}>
      <div className={styles.userCardContent}>
        <img className={styles.userPhoto} src={props.img} alt={props.first_name} />
        <p className={styles.userName}>{props.first_name} {props.last_name}</p>
      </div>
    </div>
  );
}
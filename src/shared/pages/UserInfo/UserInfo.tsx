import nophoto from 'Assets/avatars/_no-photo.jpg';
import { useGetCurrentUserEmailQuery, useGetCurrentUserQuery, } from 'Redux/api/users';
import { HeaderBtns } from 'Shared/components/HeaderBtns';
import { Icon } from 'Shared/components/icons/Icon';
import { EIcon } from 'Shared/components/icons/enums';
import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './userinfo.sass';

export function UserInfo() {  
  const { user } = useParams()
  const {data: userInfo, isError, isSuccess } = useGetCurrentUserQuery(Number(user))
  const {data: addUserInfo} = useGetCurrentUserEmailQuery(Number(user))

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <HeaderBtns />
          {isSuccess && 'id' in userInfo &&
            <>
              <div className={styles.userAvatar}>
                <img src={userInfo.avatar ? `/assets/${userInfo.avatar}` : nophoto} alt={userInfo.name} />
              </div>
              <div className={styles.userHeader}>
                <h1 className={styles.userName}>{userInfo.name}</h1>
                <p className={styles.userStatus}>{userInfo.role ? userInfo.role : 'Должность не указана'}</p>
              </div>
            </>
          }
          {isError &&
            <h1 className={styles.errorTitle}>Ошибка</h1>
          }
        </div>
      </header>
      <main className='main'>
        <section className={styles.userInfo}>
          {isSuccess && 'id' in userInfo &&
            <div className={styles.userInfoContainer}>
              <div className={styles.userAbout}>
                <p>{userInfo.description ? userInfo.description : 'Описание отсутствует'}</p>
              </div>
              <div className={styles.userContactInfo}>
                <p>
                  <Icon name={EIcon.phone} width={20} height={20} />
                  {userInfo.phone ? userInfo.phone : 'Телефон не указан'}
                </p>
                <p>
                  <Icon name={EIcon.email} width={21} height={15} />
                  {addUserInfo?.email}
                </p>
              </div>
            </div>
          }
          {isError &&
            <div className={styles.userInfoContainer}>
              <p className={styles.errorText}>К сожалению, пользователя с данным ID не существует в базе данных</p>
            </div>
          }
        </section>
      </main>
    </>
  );
}
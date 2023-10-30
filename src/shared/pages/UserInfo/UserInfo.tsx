import nophoto from 'Assets/avatars/_no-photo.jpg';
import { useGetCurrentUserQuery } from 'Redux/api/users';
import { HeaderBtns } from 'Shared/components/HeaderBtns';
import { Icon } from 'Shared/components/icons/Icon';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './userinfo.sass';

export function UserInfo() {  
  const { user } = useParams()
  
  const {data: userInfo = {
    name: "",
    email: "",
    phone: "",
    avatar: "",
    password: "",
    role: "",
    description: "",
    liked: false,
    id: null
  }, isLoading, isError, isSuccess } = useGetCurrentUserQuery(Number(user))

  // для того чтобы можно было использовать динамический импорт в tsconfig.json 
  //    было задано новое значение настройке module: вместо es2015 поставил es2022
  // функция асинхронная потому что без этого не работает свойство default, 
  //    а оно нужно для доступа к экспорту модуля с картинкой
  // изначально просто была функция которая получала картинку и затем возвращала
  //    свойство default этой картинки, но она не работала так как в атрибут
  //    src попадало значение [object Promise] - поэтому пришлось сделать решение на хуках
  //    при этом зависимость userInfo.avatar является ключевым моментом в этом решении
  const [image, setImage] = useState('');
  useEffect(() => {
      async function getAvatar() { 
        const img = await import(`Assets/${userInfo.avatar}`);
        setImage(img.default)
      }
      getAvatar()
  }, [userInfo.avatar]);

  enum EIcon {
    phone = 'phone',
    email = 'email'
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <HeaderBtns />
          {isSuccess && 'id' in userInfo &&
            <>
              <div className={styles.userAvatar}>
                <img src={userInfo.avatar ? image : nophoto} alt={userInfo.name} />
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
                  {userInfo.email}
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
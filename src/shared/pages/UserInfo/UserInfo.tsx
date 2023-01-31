import { Icon } from 'Icons/Icon';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { authorizationStatus } from 'Store/authorization';
import { currentUserRequestAsync } from 'Store/currentUser';
import { RootState } from 'Store/store';
import styles from './userinfo.sass';

export interface IUserInfoProps {
  [K: string]: any
}

export function UserInfo() {  
  const dispatch = useDispatch<any>()
  const [isAuth, setIsAuth] = useState(false) 
  const navigation = useNavigate()
  const userData = useSelector<RootState, IUserInfoProps>((state) => state.currentUser.currentUserInfo)
  // const loading = useSelector<RootState, boolean>((state) => state.currentUser.loading)
  // const error = useSelector<RootState, string>((state) => state.currentUser.error)  
  const { user } = useParams()
  useEffect(() => {dispatch(currentUserRequestAsync(user))},[])
  
  // проверка авторизации
  useEffect(() => {
    localStorage.getItem('user') === null ? navigation('/login') :  setIsAuth(true)
  },[isAuth])
  
  function exit() {
    dispatch(authorizationStatus(false))
    localStorage.removeItem('user')
    setIsAuth(false)
  }

  function back() {
    navigation('/')
  }

  enum EIcon {
    exit = 'exit',
    back = 'back',
    phone = 'phone',
    email = 'email'
  }

  return (
    <>
      <header className={styles.header}>      
        <div className={styles.headerContainer}>
          {/*  */}
          <button className={styles.backBtnDesktop} onClick={back}>Назад</button>
          <button className={styles.backBtnMobile} onClick={back}>
            <Icon name={EIcon.back} width={7} height={14} />
          </button>
          {/*  */}
          <button className={styles.exitBtnDesktop} onClick={exit}>Выход</button>
          <button className={styles.exitBtnMobile} onClick={exit}>
            <Icon name={EIcon.exit} width={18} height={18} />
          </button>
          <img className={styles.userAvatar} src={userData.avatar} alt={userData.first_name} width='187' />
          <div className={styles.userHeader}>
            <h1 className={styles.userName}>{userData.first_name} {userData.last_name}</h1>
            <p className={styles.userStatus}>Партнер</p>
          </div>
        </div>
      </header>
      <main className='main'>
        <section className={styles.userInfo}>
          <div className={styles.userInfoContainer}>
            <div className={styles.userAbout}>
              <p>Клиенты видят в нем эксперта по вопросам разработки комплексных решений финансовых продуктов, включая такие аспекты, как организационная структура, процессы, аналитика и ИТ-компоненты. Он помогает клиентам лучше понимать структуру рисков их бизнеса, улучшать процессы за счет применения новейших технологий и увеличивать продажи, используя самые современные аналитические инструменты.</p>
              <p>В работе с клиентами недостаточно просто решить конкретную проблему или помочь справиться с трудностями. Не менее важно уделять внимание обмену знаниями: "Один из самых позитивных моментов — это осознание того, что ты помог клиенту перейти на совершенно новый уровень компетентности, уверенность в том, что после окончания проекта у клиента есть все необходимое, чтобы дальше развиваться самостоятельно".</p>
              <p>Помимо разнообразных проектов для клиентов финансового сектора, Сорин ведет активную предпринимательскую деятельность. Он является совладельцем сети клиник эстетической медицины в Швейцарии, предлагающей инновационный подход к красоте, а также инвестором других бизнес-проектов.</p>
            </div>
            <div className={styles.userContactInfo}>
              <p>
                <Icon name={EIcon.phone} width={20} height={20} />
                +7 (954) 333-44-55
              </p>
              <p>
                <Icon name={EIcon.email} width={21} height={15} />
                {userData.email}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
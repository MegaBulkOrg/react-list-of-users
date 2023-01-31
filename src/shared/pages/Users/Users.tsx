import { Icon } from 'Icons/Icon';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GenericElements } from 'Shared/GenericElements';
import { IUsersListElementProps, UsersListElement } from 'Shared/UsersListElement';
import { authorizationStatus } from 'Store/authorization';
import { RootState } from 'Store/store';
import { usersRequestAsync } from 'Store/users';
import styles from './users.sass';

export function Users() {  
  // проверка авторизации
  const [isAuth, setIsAuth] = useState(false)
  useEffect(() => {
    localStorage.getItem('user') === null ? navigation('/login') :  setIsAuth(true)
  },[isAuth])
  // состояния
  const navigation = useNavigate()  
  const dispatch = useDispatch<any>()
  const [nextPageNo, setNextPageNo] = useState(1)
  const [loadingButtonAction, setLoadingButtonAction] = useState(true)
  const [usersList, setUsersList] = useState<any[]>([])
  const response = useSelector<RootState, IUsersListElementProps[]>((state) => state.users.items)
  const loading = useSelector<RootState, boolean>((state) => state.users.loading)
  const error = useSelector<RootState, string>((state) => state.users.error)  
  
  // первоначальная загрузка (при открытии страницы)
  useEffect(() => {
    dispatch(usersRequestAsync(nextPageNo))
    setNextPageNo((prevPage) => prevPage + 1)
  },[])
    
  useEffect(() => {
    setUsersList((prevChildren) => {
      // проверяем полученные элементы на такие же в массиве
      let newUsersArray:Array<{[K:string]:any}> = []
      response.forEach(user => {
          const checking = prevChildren.find((prevUser) => prevUser.id === user.id)
          checking === undefined ? newUsersArray.push(user) : null
      })
      return prevChildren.concat(...newUsersArray)
    })
    // если больше нет результатов то и показывать кнопку "показать еще" не надо
    if (response.length === 0 && nextPageNo > 1) setLoadingButtonAction(false)
  }, [response])

  function load() {
    dispatch(usersRequestAsync(nextPageNo))
    setNextPageNo((prevPage) => prevPage + 1)
  }

  function exit() {
    dispatch(authorizationStatus(false))
    localStorage.removeItem('user')
    setIsAuth(false)
  }

  enum EIcon {
    exit = 'exit',
    likeTrue = 'likeTrue',
    likeFalse = 'likeFalse',
    loadMore = 'loadMore'
  }

  return (
    <>
      <header className={styles.header}>      
        <div className={styles.headerContainer}>
          {/* ВЫХОД */}
          <button className={styles.exitBtnDesktop} onClick={exit}>Выход</button>
          <button className={styles.exitBtnMobile} onClick={exit}>
            <Icon name={EIcon.exit} width={18} height={18} />
          </button>
          {/* ТЕКСТЫ */}
          <h1 className={styles.pageTitle}>Наша команда</h1>
          <p className={styles.pageDescription}>Это опытные специалисты, хорошо разбирающиеся во всех задачах, которые ложатся на их плечи, и умеющие находить выход из любых, даже самых сложных ситуаций. </p>
        </div>
      </header>
      <main className='main'>
        <section className={styles.usersList}>
          <div className={styles.usersListContainer}>
            {/* ОШИБКИ */}
            {!loading && error !== '' && 
              <p className={styles.info}>{error}</p>
            }
            {/* НЕТ РЕЗУЛЬТАТОВ */}
            {!loading && error === '' && usersList.length === 0 && 
                <h4 className={styles.info}>К сожалению, пока нет ни одного пользователя. Зайдите позже. Вероятно, они появятся.</h4>
            }
            {/* КАРТОЧКИ */}
            {usersList.length !== 0 && 
              <div className={styles.users}>
                <GenericElements<IUsersListElementProps> list={usersList} Template={UsersListElement}/>
              </div>
            }
            {/* ЗАГРУЗКА */}
            {loading && 
              <p className={styles.info} style={{marginTop: '56px'}}>Загрузка...</p>
            }
            {/* КНОПКА ЗАГРУЗКИ */}
            {loadingButtonAction &&
              <div className={styles.loadMoreBtnContainer}>
                {/* в onClick нельзя посто поместить dispatch(usersRequestAsync(nextPageNo)) так как у React будет много перенаправлений */}
                <button className={styles.loadMoreBtn} onClick={load}>
                  Показать еще
                  <Icon name={EIcon.loadMore} width={17} height={9} />
                </button>
              </div>
            }
            {/* СООБЩЕНИЕ ПРО КОНЕЦ СПИСКА */}
            {!loadingButtonAction && 
              <p className={styles.info} style={{marginTop: '56px'}}>Больше пользователей нет</p>
            }
          </div>
        </section>
      </main>    
    </>
  );
}

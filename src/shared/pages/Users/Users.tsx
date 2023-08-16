import { Icon } from 'Icons/Icon';
import { GenericElements } from 'Shared/GenericElements';
import { IUsersListElementProps, UsersListElement } from 'Shared/UsersListElement';
import { RootState } from 'Store/store';
import { usersRequestAsync } from 'Store/users';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './users.sass';

enum EIcon {
  exit = 'exit',
  likeTrue = 'likeTrue',
  likeFalse = 'likeFalse',
  loadMore = 'loadMore'
}

export function Users() {  
  // проверка авторизации
  const [isAuth, setIsAuth] = useState(false)
  const navigation = useNavigate()
  useEffect(() => {
    localStorage.getItem('user') === null ? navigation('/login') :  setIsAuth(true)
  },[isAuth])
  
  // состояния  
  const dispatch = useDispatch<any>()
  const [nextPageNo, setNextPageNo] = useState(1)
  const [loadingButtonAction, setLoadingButtonAction] = useState(true)
  // состояния: массив для хранения всех результатов (изначальные + подруженные) и вывода их на экран
  const [usersList, setUsersList] = useState<any[]>([])
  
  // Redux
  let response = useSelector<RootState, IUsersListElementProps[]>((state) => state.users.items)
  const loading = useSelector<RootState, boolean>((state) => state.users.loading)
  const error = useSelector<RootState, string>((state) => state.users.error)  
  
  // отправка запроса в Redux 
  function load() {
    dispatch(usersRequestAsync(nextPageNo))
    setNextPageNo((prevPage) => prevPage + 1)
  }
  
  // первоначальная загрузка (при открытии страницы)
  useEffect(() => {
    load()
    // эта очистка нужна чтобы не задваивались результаты после возврата к списку со страницы пользователя
    // смысл: при возврате на страницу списка сначала данные попадают в response и только потом идет запрос из API и только тогда данные стираются, загружаются и снова попадают в response - таким образом они и задваиваются
    response = []
  },[])
  
  // добавление данных в массив который используется для отображения пользователей
  useEffect(() => {
    setUsersList(prevChildren => prevChildren.concat(...response))
    // если больше нет результатов то и кнопка "показать еще" не нужна
    if (response.length === 0 && nextPageNo > 1) setLoadingButtonAction(false)
  }, [response])

  function exit() {
    localStorage.removeItem('user')
    setIsAuth(false)
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
                {/* в onClick нельзя просто поместить dispatch(usersRequestAsync(nextPageNo)) так как у React будет много перенаправлений */}
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

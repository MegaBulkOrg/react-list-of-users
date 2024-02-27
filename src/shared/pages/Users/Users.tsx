import { useLazyGetUsersListQuery } from 'Redux/api/users';
import { IUserInfo } from 'Redux/apiInterfaces';
import { useAppSelector } from 'Redux/hooks';
import { GenericElements } from 'Shared/components/GenericElements';
import { HeaderBtns } from 'Shared/components/HeaderBtns';
import { UsersListElement } from 'Shared/components/UsersListElement';
import { Icon } from 'Shared/components/icons/Icon';
import { EIcon } from 'Shared/components/icons/enums';
import React, { useEffect, useState } from 'react';
import styles from './users.sass';

export function Users() {  
  // состояния  
  const [nextPageNo, setNextPageNo] = useState(1)
  const [loadingButtonAction, setLoadingButtonAction] = useState(true)
  const [usersList, setUsersList] = useState<IUserInfo[]>([])
  
  // Redux
  const [trigger, {isSuccess: getUsersListSuccess, isLoading: getUsersListLoading, isError: getUsersListError}] = useLazyGetUsersListQuery()  
  async function load() {
    const {data: response} = await trigger(nextPageNo)
    if (response) setUsersList(prevChildren => prevChildren.concat(...response))
    setNextPageNo(prevPage => prevPage + 1)
    if (response && response.length === 0 && nextPageNo > 1) setLoadingButtonAction(false)
  }
  
  // первоначальная загрузка (при открытии страницы)
  const accessToken = useAppSelector(state => state.auth.accessToken)
  useEffect(() => {
    setUsersList([])
    load()
  },[])
  
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <HeaderBtns />
          {/* ТЕКСТЫ */}
          <h1 className={styles.pageTitle}>Наша команда</h1>
          <p className={styles.pageDescription}>Это опытные специалисты, хорошо разбирающиеся во всех задачах, которые ложатся на их плечи, и умеющие находить выход из любых, даже самых сложных ситуаций. </p>
        </div>
      </header>
      <main className='main'>
        <section className={styles.usersList}>
          <div className={styles.usersListContainer}>
            {/* ОШИБКИ */}
            {!getUsersListLoading && getUsersListError && 
              <p className={styles.info}>Произошла ошибка</p>
            }
            {/* НЕТ РЕЗУЛЬТАТОВ */}
            {!getUsersListLoading && !getUsersListError && usersList.length === 0 && 
                <h4 className={styles.info}>К сожалению, пока нет ни одного пользователя. Зайдите позже. Вероятно, они появятся.</h4>
            }
            {/* КАРТОЧКИ */}
            {getUsersListSuccess && usersList.length !== 0 && 
              <div className={styles.users}>
                <GenericElements<IUserInfo> list={usersList} Template={UsersListElement}/>
              </div>
            }
            {/* ЗАГРУЗКА */}
            {getUsersListLoading && 
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

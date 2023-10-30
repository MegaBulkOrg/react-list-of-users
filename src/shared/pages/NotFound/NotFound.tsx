import React from 'react';
import styles from './notfound.sass';

export function NotFound() {
  return (    
    <>
      <header className={styles.header}>      
        <div className={styles.headerContainer}>
          <h1 className={styles.pageTitle}>Ошибка 404</h1>
          <p className={styles.pageDescription}>Такой страницы нет!</p>
        </div>
      </header>
      <main className='main'>
        <section className={styles.mainContainer}>
          <p className={styles.info}>Страницы, которую Вы ищите, не существует</p>
        </section>
      </main>    
    </>
  )
}
import { useUploadAvatarMutation } from 'Redux/api/img';
import { useGetCurrentUserEmailQuery, useGetCurrentUserQuery, useLazyGetUserByEmailQuery, useUpdateUserEmailMutation, useUpdateUserMutation } from 'Redux/api/users';
import { IGetNewAvatarPath } from 'Redux/apiInterfaces';
import { useAppSelector } from 'Redux/hooks';
import { HeaderBtns } from 'Shared/components/HeaderBtns';
import React, { ChangeEvent, DragEvent, FormEvent, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from './editprofile.sass';

export function EditProfile() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: new FormData(),
        role: '',
        description: ''
    })
    const [formVerified, setFormVerified] = useState({
        firstSubmit: false,
        nameVerified: false,
        emailVerified: false,
        duplicatedEmailVerified: false,
        phoneVerified: false
    })


    // получаем данные пользователя
    const userId = useAppSelector(state => state.auth.authedUserId)
    // условные выражения в аргументах переданных в хуки нужны поскольку authedUserId может быть null
    // и хотя если эта страница открыта то authedUserId никак не может быть равен null TypeScript все-равно придирается
    const {data: userInfo = {
        name: '',
        phone: '',
        avatar: '',
        role: '',
        description: '',
        id: null
    }} = useGetCurrentUserQuery(userId || 0)
    const {data: addUserInfo = {
        email: '',
        password: '',
        id: 0
    }} = useGetCurrentUserEmailQuery(userId || 0)
    useEffect(() => {
        setForm({
            ...form,
            name: userInfo.name,
            email: addUserInfo.email,
            phone: userInfo.phone,
            role: userInfo.role,
            description: userInfo.description
        })
    },[userInfo, addUserInfo])


    // для аватара
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
    const [currentAvatar, setCurrentAvatar] = useState('')
    const [drag, setDrag] = useState(false)
    const [avatarFieldTitle, setAvatarFieldTitle] = useState('Перетащите изображение, чтобы загрузить его')
    useEffect(() => {
        setCurrentAvatar(`/assets/${userInfo.avatar}`)
    }, [userInfo.avatar]);
    function dragStartHandler(e: FormEvent) {
        e.preventDefault()
        setDrag(true)
        setAvatarFieldTitle('Отпустите файл, чтобы загрузить его')
    }
    function dragLeaveHandler(e: FormEvent) {
        e.preventDefault()
        setDrag(false)
        setAvatarFieldTitle('Перетащите изображение, чтобы загрузить его')
    }
    function onDropHandler(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        if (e.dataTransfer) {
            // чтобы тут не возникало ошибки "Тип "FileList" должен иметь метод "[Symbol.iterator]()", который возвращает итератор."
            // в tsconfig.json нужно добавить в lib значение dom.iterable
            const files = [...e.dataTransfer.files]
            if (files.length === 1) {
                if(files[0].type.includes('image')) {
                    const formData = new FormData()
                    formData.append('avatar', files[0])                    
                    setForm({...form, avatar: formData})
                    setDrag(false)
                    setAvatarFieldTitle(`Файл изображения: ${files[0].name}`)
                } else {                    
                    if(form.avatar.get('avatar')) {
                        setAvatarFieldTitle('Ошибка: файл не является картинкой')
                        setTimeout(() => {
                            // нельзя просто так обратиться к avatar.get('avatar').name
                            // подробнее тут: https://stackoverflow.com/questions/71090990/typescript-property-name-does-not-exist-on-type-formdataentryvalue
                            const file = form.avatar.get('avatar') as File
                            setAvatarFieldTitle(`Файл изображения: ${file.name}`)
                        }, 1000)
                    } else {
                        setAvatarFieldTitle('Ошибка: файл не является картинкой')
                        setTimeout(() => {
                            setAvatarFieldTitle(`Перетащите изображение, чтобы загрузить его`)
                        }, 1000)
                    }
                }
            } else {
                if(form.avatar.get('avatar')) {
                    setAvatarFieldTitle('Ошибка: можно загрузить не более 1 изображения')
                    setTimeout(() => {
                        const file = form.avatar.get('avatar') as File
                        setAvatarFieldTitle(`Файл изображения: ${file.name}`)
                    }, 1000)
                } else {
                    setAvatarFieldTitle('Ошибка: можно загрузить не более 1 изображения')
                    setTimeout(() => {
                        setAvatarFieldTitle(`Перетащите изображение, чтобы загрузить его`)
                    }, 1000)
                }
            }
        }
    }


    // для проверки email на дубли
    const [duplicatedEmailCheck] = useLazyGetUserByEmailQuery()
    // для обновления данных
    const [updateUser, {isSuccess: updateUserSuccess}] = useUpdateUserMutation()
    const [updateUserEmail, {isSuccess: updateUserEmailSuccess}] = useUpdateUserEmailMutation()
    // для отправки аватара
    const [uploadAvatar] = useUploadAvatarMutation()


    // получение значений полей
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [event.target.name]: event.target.value})
    }
    // для поля с описанием нужен отдельный обработчик так как тут используется другой тип
    const handleChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    // изменение объекта проверки
    const formVerifiedChange = (name:string, value:boolean) => {
        setFormVerified((prevState) =>  {
            return {...prevState,[name]: value}
        })
    }

    // глазик для поля с паролем временно не работает так как смена пароля в рамках использования json-server-auth не реализована
    // const refPassword = useRef<HTMLInputElement>(null)    
    // function showPassword(field:HTMLInputElement | null) {
    //     if (field && field !== null) {
    //         field.type === 'password' ? field.type = 'text' : field.type = 'password'
    //     }
    // }


    // удаление аватара
    function deleteCurrentAvatar() {
        updateUser({
            id: userInfo.id || 0,
            body: {
                name: form.name,
                phone: form.phone,
                avatar: '',
                role: form.role, 
                description: form.description
            }
        })
    }
    function deleteChosenAvatar() {
        setForm({...form, avatar: new FormData()})
        setAvatarFieldTitle(`Перетащите изображение, чтобы загрузить его`)
    }


    // проверка полей формы
    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        // меняем флаг первой попытки отправки (условие не дает постоянно менять значение после первой отправки)
        if (!formVerified.firstSubmit) formVerifiedChange('firstSubmit', true)
        // проверка поля с именем
        formVerifiedChange('nameVerified', form.name.length >= 3)
        // проверка поля с email - валидация
        const emailRegEx = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u
        formVerifiedChange('emailVerified', emailRegEx.test(form.email))
        // проверка поля с email - дубли
        const {data: duplicatedEmailCheckResponse} = await duplicatedEmailCheck(form.email)
        // -- вариант когда ввели новый email
        if (duplicatedEmailCheckResponse?.length === 0) formVerifiedChange('duplicatedEmailVerified', true)
        // -- вариант когда email остался прежний
        if (duplicatedEmailCheckResponse?.length === 1 && duplicatedEmailCheckResponse[0].email === addUserInfo.email) formVerifiedChange('duplicatedEmailVerified', true)
        // -- вариант когда введен чужой email
        if (duplicatedEmailCheckResponse?.length === 1 && duplicatedEmailCheckResponse[0].email !== addUserInfo.email) formVerifiedChange('duplicatedEmailVerified', false)
        // проверка поля с телефоном
        const phoneRegEx = /^\+\d+(-\d+)*$/
        formVerifiedChange('phoneVerified', phoneRegEx.test(form.phone))
        // проверка поля с паролем пока не работает так как смена пароля в рамках использования json-server-auth не реализована
        // password.length < 6 || /\s/.test(password) || /[а-яёА-ЯЁ]/.test(password) ? setPasswordVerified(false) : setPasswordVerified(true)
        // проверку полей с аватаром, ролью и описанием не стал делать
    }


    // отправка формы
    useEffect(() => {
        async function uploading() {
            if (formVerified.nameVerified && formVerified.emailVerified && formVerified.duplicatedEmailVerified && formVerified.phoneVerified) {
                // если поменял аватар
                if (form.avatar.get('avatar')) {
                    // загружаем картинку на сервер, получаем путь до картинки и записываем при помощи setAvatar()
                    // -- интерфейс IGetNewAvatarPath нужен поскольку метод uploadAvatar возвращает ответ с типом
                    // -- { data: IUploadAvatarResponse; } | { error: FetchBaseQueryError | SerializedError; }
                    // -- из которого так просто не вытащить data
                    const { data } : IGetNewAvatarPath = await uploadAvatar(form.avatar)
                    // нельзя просто отправить в качестве значения поля avatar (объект для body) полученный data?.avatar так как TypeScript
                    // предполагает что там может быть undefined - поэтому на всякий случай добавляем дефолтного значения пустую строку
                    const avatarToSave = data?.avatar || ''
                    // обновляем профиль
                    updateUser({
                        // на всякий случай подставляем сюда значение 0 по умолчанию чтобы TypeScript не ругался про значение null
                        id: userInfo.id || 0,
                        body: {
                            name: form.name,
                            phone: form.phone,
                            avatar: avatarToSave,
                            role: form.role,
                            description: form.description
                        }
                    })
                    updateUserEmail({
                        id: userInfo.id || 0,
                        body: {email: form.email}
                    })
                // если не стал менять аватар
                } else {
                    updateUser({
                        id: userInfo.id || 0,
                        body: {
                            name: form.name,
                            phone: form.phone,
                            avatar: userInfo.avatar,
                            role: form.role,
                            description: form.description
                        }
                    })
                    updateUserEmail({
                        id: userInfo.id || 0,
                        body: {email: form.email}
                    })
                }
                // ставим дефолтные значения полей у formVerified чтобы можно было повторно отправлять форму (даже если значения полей не изменились)
                setFormVerified({
                    firstSubmit: false,
                    nameVerified: false,
                    emailVerified: false,
                    duplicatedEmailVerified: false,
                    phoneVerified: false
                })
            }
        }
        uploading()
    }, [formVerified.nameVerified, formVerified.emailVerified, formVerified.duplicatedEmailVerified, formVerified.phoneVerified])


    return (
        <>
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    <HeaderBtns />
                    <h1 className={styles.pageTitle}>Редактирование профиля</h1>
                </div>
            </header>
            <main className='main'>
                <section className={styles.editProfile}>
                    <div className={styles.formPageContainer}>
                        <form onSubmit={handleSubmit} autoComplete='on'>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor='inputName' className={styles.formLabel}>Имя</label>
                                <input type='text' name='name' value={form.name} 
                                    className={!formVerified.nameVerified && formVerified.firstSubmit ? styles.formControlError : styles.formControl} 
                                id='inputName' placeholder='Артур' onChange={handleChange} required />
                                {!formVerified.nameVerified && formVerified.firstSubmit &&
                                    <p className={styles.formErrorMsg}>Длина имени должна быть не менее 3 символов</p>
                                }
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor='inputEmail' className={styles.formLabel}>Электронная почта</label>
                                <input type='email' name='email' value={form.email} 
                                    className={!formVerified.emailVerified && formVerified.firstSubmit ? styles.formControlError : styles.formControl} 
                                id='inputEmail' placeholder='example@mail.ru' onChange={handleChange} required />
                                {!formVerified.emailVerified && formVerified.firstSubmit &&
                                    <p className={styles.formErrorMsg}>Укажите e-mail в правильном формате</p>
                                }
                                {!formVerified.duplicatedEmailVerified && formVerified.firstSubmit &&
                                    <p className={styles.formErrorMsg}>Пользователь с таким e-mail уже зарегистрирован</p>
                                }
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='inputPhone' className={styles.formLabel}>Телефон</label>
                                <input type='phone' name='phone' value={form.phone} 
                                    className={!formVerified.phoneVerified && formVerified.firstSubmit ? styles.formControlError : styles.formControl} 
                                id='inputPhone' placeholder='+7-812-123-4567' onChange={handleChange} />
                                {!formVerified.phoneVerified && formVerified.firstSubmit &&
                                    <p className={styles.formErrorMsg}>Укажите телефон в правильном формате</p>
                                }
                            </div>

                            <div className={styles.formGroup}>
                                <p className={styles.formLabel}>Фото профиля</p>
                                <div className={styles.avatarContainer}>
                                    {userInfo.avatar && 
                                        <div className={styles.currentAvatar}>
                                            <img src={currentAvatar} alt={userInfo.name} />
                                        </div>
                                    }
                                    {!isMobile &&                                    
                                        <div className={styles.avataDeleteBtns}>
                                            {/* атрибут type="button" тут нужен поскольку без него будет происходить событие onSubmit как с type='submit' */}
                                            {userInfo.avatar &&
                                                <button className={styles.avataDeleteBtn} type="button" onClick={deleteCurrentAvatar}>Удалить текущее фото</button>
                                            }
                                            {form.avatar.get('avatar') &&
                                                <button className={styles.avataDeleteBtn} type="button" onClick={deleteChosenAvatar}>Отменить выбор</button>
                                            }
                                        </div>
                                    }
                                </div>
                                {isMobile
                                    ? <p className={styles.mobileAvatarMsg}>Загрузка и смена фото доступны только в десктопной версии</p>
                                    : drag
                                        ? <div className={styles.dropArea__active}
                                            onDragStart={e => dragStartHandler(e)}
                                            onDragLeave={e => dragLeaveHandler(e)}
                                            onDragOver={e => dragStartHandler(e)}
                                            onDrop={e => onDropHandler(e)}
                                        ><p>{avatarFieldTitle}</p></div>
                                        : <div className={styles.dropArea__empty}
                                            onDragStart={e => dragStartHandler(e)}
                                            onDragLeave={e => dragLeaveHandler(e)}
                                            onDragOver={e =>  dragStartHandler(e)}
                                        ><p>{avatarFieldTitle}</p></div>    
                                }
                            </div>

                            {/* <div className={styles.formGroup}>
                                <label htmlFor='inputPassword' className={styles.formLabel}>Пароль</label>
                                <input type='password' name='password' value={form.password} ref={refPassword} autoComplete='on'
                                    className={!formVerified.passwordVerified && formVerified.firstSubmit ? styles.formControlError : styles.formControl} 
                                id='inputPassword' placeholder='******' onChange={handleChange} required />
                                <Icon name={EIcon.formEye} width={24} height={24} action={() => showPassword(refPassword.current)} />
                                {!formVerified.passwordVerified && formVerified.firstSubmit &&
                                    <p className={styles.formErrorMsg}>Пароль должен быть от 6 символов, без пробелов и кириллицы</p>
                                }
                            </div> */}

                            <div className={styles.formGroup}>
                                <label htmlFor='inputRole' className={styles.formLabel}>Должность</label>
                                <input type='text' name='role' value={form.role} className={styles.formControl} id='inputRole' placeholder='CTO' onChange={handleChange} />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='inputDescription' className={styles.formLabel}>Описание</label>
                                <textarea value={form.description} name='description' className={styles.formControl} id='inputDescription' rows={5} placeholder='Характеристика сотрудника' onChange={handleChangeDescription} />
                            </div>

                            {updateUserSuccess && updateUserEmailSuccess && <p className={styles.formSuccessMsgBig}>Данные обновлены</p>}

                            <button type='submit' className={styles.formSubmit}>Сохранить</button>
                        </form>
                    </div>
                </section>
            </main>
        </>
    )
}
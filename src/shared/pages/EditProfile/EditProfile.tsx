import { useUploadAvatarMutation } from 'Redux/api/img';
import { useGetCurrentUserQuery, useLazyCheckingUserByEmailQuery, useUpdateUserMutation } from 'Redux/api/users';
import { IGetNewAvatarPath } from 'Redux/apiInterfaces';
import { useAppSelector } from 'Redux/hooks';
import { HeaderBtns } from 'Shared/components/HeaderBtns';
import { Icon } from 'Shared/components/icons/Icon';
import React, { ChangeEvent, DragEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from './editprofile.sass';

export function EditProfile() {
    // значки
    enum EIcon {
        formEye = 'formEye'
    }

    // состояния для полей и их ошибок
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [avatar, setAvatar] = useState(new FormData())
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [description, setDescription] = useState('')
    const [nameVerified, setNameVerified] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [duplicatedUsersVerified, setDuplicatedUsersVerified] = useState(false)
    const [phoneVerified, setPhoneVerified] = useState(false)
    const [passwordVerified, setPasswordVerified] = useState(false)
    // прочее
    const [firstSubmit, setFirstSubmit] = useState(false)
    const [currentAvatar, setCurrentAvatar] = useState('')

    // получаем данные пользователя
    const userId = useAppSelector(state => state.auth.userId);
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
    }, isLoading, isError, isSuccess } = useGetCurrentUserQuery(userId || 0)
    useEffect(() => {
        setName(userInfo.name)
        setEmail(userInfo.email)
        setPhone(userInfo.phone)
        setPassword(userInfo.password)
        setRole(userInfo.role)
        setDescription(userInfo.description)
    },[userInfo])

    // для аватара
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
    const [drag, setDrag] = useState(false)
    const [avatarFieldTitle, setAvatarFieldTitle] = useState('Перетащите изображение, чтобы загрузить его')
    // -- объяснение этой громоздкой конструкции дано в компоненте UserInfo
    useEffect(() => {
        async function getCurrentAvatar() { 
            const img = await import(`Assets/${userInfo.avatar}`);
            console.log('img.default - ',img.default);
            setCurrentAvatar(img.default)
        }
        getCurrentAvatar()
    }, [userInfo.avatar]);
    function dragStartHandler(e: FormEvent) {
        e.preventDefault()
        setDrag(true)
        setAvatarFieldTitle('Отпустите файлы, чтобы загрузить их')
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
                    setAvatar(formData)
                    setDrag(false)
                    setAvatarFieldTitle(`Файл изображения: ${files[0].name}`)
                } else {                    
                    if(avatar.get('avatar')) {
                        setAvatarFieldTitle('Ошибка: файл не является картинкой')
                        setTimeout(() => {
                            // нельзя просто так обратиться к avatar.get('avatar').name
                            // подробнее тут: https://stackoverflow.com/questions/71090990/typescript-property-name-does-not-exist-on-type-formdataentryvalue
                            const file = avatar.get('avatar') as File
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
                if(avatar.get('avatar')) {
                    setAvatarFieldTitle('Ошибка: можно загрузить не более 1 изображения')
                    setTimeout(() => {
                        const file = avatar.get('avatar') as File
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

    // для проверки email на дубль
    const [trigger, {isSuccess: emailCheckSuccess, isLoading: emailCheckLoading, isError: emailCheckError}] = useLazyCheckingUserByEmailQuery()
    // для отправки формы
    const [updateUser, {isSuccess: updateUserSuccess, isError: updateUserError, isLoading: updateUserLoading}] = useUpdateUserMutation()
    // для отправки аватара
    const [uploadAvatar, {isSuccess: uploadAvatarSuccess, isError: uploadAvatarError, isLoading: uploadAvatarLoading}] = useUploadAvatarMutation()

    // ловим значения полей
    function handleChangeName(event: ChangeEvent<HTMLInputElement>) {
        setName(event.target.value)
    }
    function handleChangeEmail(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value)
    }
    function handleChangePhone(event: ChangeEvent<HTMLInputElement>) {
        setPhone(event.target.value)
    }
    function handleChangePassword(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value)
    }
    function handleChangeRole(event: ChangeEvent<HTMLInputElement>) {
        setRole(event.target.value)
    }
    function handleChangeDescription(event: ChangeEvent<HTMLTextAreaElement>) {
        setDescription(event.target.value)
    }

    // глазик для поля с паролем
    const refPassword = useRef<HTMLInputElement>(null)    
    function showPassword(field:HTMLInputElement | null) {
        if (field && field !== null) {
            field.type === 'password' ? field.type = 'text' : field.type = 'password'
        }
    }

    // удаление аватара
    function deleteCurrentAvatar() {
        updateUser({
            id: userInfo.id || 0,
            body: {name, email, phone, avatar: '', password, role, description}
        }).unwrap()
    }
    function deleteChosenAvatar() {
        setAvatar(prev => {
            prev.delete('avatar')
            return prev
        })
        setAvatarFieldTitle(`Перетащите изображение, чтобы загрузить его`)
    }

    // проверка полей формы
    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setFirstSubmit(true)
        // проверка поля с именем
        name.length < 3 ? setNameVerified(false) : setNameVerified(true)
        // проверка поля с email (валидность email)
        const emailRegEx = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u
        emailRegEx.test(email) ? setEmailVerified(true) : setEmailVerified(false)
        // проверка поля с email (дубли)
        const {data: users} = await trigger(email)
        // -- вариант когда ввели новый email
        if (users?.length === 0) setDuplicatedUsersVerified(true)
        // -- вариант когда email остался прежний
        if (users?.length === 1 && users[0].email === userInfo.email) setDuplicatedUsersVerified(true)
        // -- вариант когда введен чужой email
        if (users?.length === 1 && users[0].email !== userInfo.email) setDuplicatedUsersVerified(false)
        // проверка поля с телефоном
        const phoneRegEx = /^\+\d+(-\d+)*$/
        phoneRegEx.test(phone) ? setPhoneVerified(true) : setPhoneVerified(false)
        // проверка поля с паролем
        password.length < 6 || /\s/.test(password) || /[а-яёА-ЯЁ]/.test(password) ? setPasswordVerified(false) : setPasswordVerified(true)
        // проверку полей с аватаром, ролью и описанием не стал делать
    }

    // отправка формы
    useEffect(() => {
        async function uploading() {
            if (nameVerified && emailVerified && duplicatedUsersVerified && phoneVerified && passwordVerified) {
                // если поменял аватар
                if (avatar.get('avatar')) {
                    // загружаем картинку на сервер, получаем путь до картинки и записываем при помощи setAvatar()
                    // -- интерфейс IGetNewAvatarPath нужен поскольку метод uploadAvatar возвращает ответ с типом
                    // -- { data: IUploadAvatarResponse; } | { error: FetchBaseQueryError | SerializedError; }
                    // -- из которого так просто не вытащить data
                    const { data } : IGetNewAvatarPath = await uploadAvatar(avatar)
                    // нельзя просто отправить в качестве значения поля avatar (объект для body) полученный data?.avatar так как TypeScript
                    // предполагает что там может быть undefined - поэтому на всякий случай добавляем дефолтного значения пустую строку
                    const avatarToSave = data?.avatar || ''
                    // обновляем профиль
                    updateUser({
                        // на всякий случай подставляем сюда значение 0 по умолчанию чтобы TypeScript не ругался про значение null
                        id: userInfo.id || 0,
                        body: {name, email, phone, avatar: avatarToSave, password, role, description}
                    }).unwrap()
                // если не стал менять аватар
                } else {
                    updateUser({
                        id: userInfo.id || 0,
                        body: {name, email, phone, avatar: userInfo.avatar, password, role, description}
                    }).unwrap()
                }
                // ставим дефолтные значения стейтов проверки чтобы можно было повторно отправлять форму
                // даже если значения полей не изменились
                setNameVerified(false)
                setEmailVerified(false)
                setDuplicatedUsersVerified(false)
                setPhoneVerified(false)
                setPasswordVerified(false)
                setFirstSubmit(false)
            }
        }
        uploading()
    }, [nameVerified && emailVerified && duplicatedUsersVerified && phoneVerified && passwordVerified])

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
                                <input type='text' value={name} 
                                    className={!nameVerified && firstSubmit ? styles.formControlError : styles.formControl} 
                                id='inputName' placeholder='Артур' onChange={handleChangeName} required />
                                {!nameVerified && firstSubmit &&
                                    <p className={styles.formErrorMsg}>Длина имени должна быть не менее 3 символов</p>
                                }
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor='inputEmail' className={styles.formLabel}>Электронная почта</label>
                                <input type='email' value={email} 
                                    className={!emailVerified && firstSubmit ? styles.formControlError : styles.formControl} 
                                id='inputEmail' placeholder='example@mail.ru' onChange={handleChangeEmail} required />
                                {!emailVerified && firstSubmit &&
                                    <p className={styles.formErrorMsg}>Укажите e-mail в правильном формате</p>
                                }
                                {!duplicatedUsersVerified && firstSubmit &&
                                    <p className={styles.formErrorMsg}>Пользователь с таким e-mail уже зарегистрирован</p>
                                }
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='inputPhone' className={styles.formLabel}>Телефон</label>
                                <input type='phone' value={phone} 
                                    className={!phoneVerified && firstSubmit ? styles.formControlError : styles.formControl} 
                                id='inputPhone' placeholder='+7-812-123-4567' onChange={handleChangePhone} />
                                {!phoneVerified && firstSubmit &&
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
                                            {avatar.get('avatar') &&
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

                            <div className={styles.formGroup}>
                                <label htmlFor='inputPassword' className={styles.formLabel}>Пароль</label>
                                <input type='password' value={password} ref={refPassword} autoComplete='on'
                                    className={!passwordVerified && firstSubmit ? styles.formControlError : styles.formControl} 
                                id='inputPassword' placeholder='******' onChange={handleChangePassword} required />
                                <Icon name={EIcon.formEye} width={24} height={24} action={() => showPassword(refPassword.current)} />
                                {!passwordVerified && firstSubmit &&
                                    <p className={styles.formErrorMsg}>Пароль должен быть от 6 символов, без пробелов и кириллицы</p>
                                }
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='inputRole' className={styles.formLabel}>Должность</label>
                                <input type='text' value={role} className={styles.formControl} id='inputRole' placeholder='CTO' onChange={handleChangeRole} />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='inputDescription' className={styles.formLabel}>Описание</label>
                                <textarea 
                                    value={description} className={styles.formControl} id='inputDescription' placeholder='Характеристика сотрудника' onChange={handleChangeDescription}
                                rows={5} />
                            </div>

                            {updateUserSuccess && <p className={styles.formSuccessMsgBig}>Данные обновлены</p>}

                            <button type='submit' className={styles.formSubmit}>Сохранить</button>
                        </form>
                    </div>
                </section>
            </main>
        </>
    )
}
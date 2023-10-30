import React from 'react';
import { BackIcon, EmailIcon, ExitIcon, FormEyeIcon, LikeFalseIcon, LikeTrueIcon, LoadMoreIcon, PhoneIcon, ProfileIcon } from '../AppIcons';

interface IIcons {
    [K: string]: JSX.Element
}

const icons:IIcons = {
    exit: <ExitIcon/>,
    back: <BackIcon/>,
    phone: <PhoneIcon/>,
    email: <EmailIcon/>,
    likeTrue: <LikeTrueIcon/>,
    likeFalse: <LikeFalseIcon/>,
    loadMore: <LoadMoreIcon/>,
    formEye: <FormEyeIcon/>,
    profileIcon: <ProfileIcon />
}

interface IIconProps {
    name: keyof typeof icons
    width?: number
    height?: number
    action?: () => void
}

export function Icon({name, width=15, height=15, action}: IIconProps) {
    return (
        <span style={{width:width, height:height}} onClick={action}>
            {icons[name]}
        </span>
    )
}
import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOutSuccess } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { BsFillBellFill, BsMoonFill, BsSunFill } from 'react-icons/bs';
import { useState } from 'react';
import vie from '../assets/flag/vi-flag.png';
import eng from '../assets/flag/en-flag.png';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logOutSuccess());
        navigate('/');
    };
    const user = useSelector((state) => state.auth.loginAdmin?.currentUser);

    const { t } = useTranslation('translation');
    const [currentLanguage, setCurrentLanguage] = useState('vie');
    const [flagImage, setFlagImage] = useState(vie);

    const changeLanguage = () => {
        const newLanguage = currentLanguage === 'eng' ? 'vie' : 'eng';
        setCurrentLanguage(newLanguage);
        setFlagImage(newLanguage === 'eng' ? eng : vie);
        i18n.changeLanguage(newLanguage);
    };

    return (
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg w-full">
            <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
                <div>
                    <div className="form-control">
                        <div className="input-group">
                            <input type="text" placeholder="Search…" className="input input-bordered" />
                            <button className="btn btn-ghost">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="flex items-center mx-2">
                        <span className="text-sm uppercase font-bold">{currentLanguage}</span>
                        <div className="btn btn-ghost btn-circle btn-sm" onClick={changeLanguage}>
                            <div className="indicator">
                                <img src={flagImage} alt="" className="rounded-full" />
                            </div>
                        </div>
                    </div>
                    {user ? (
                        <div className="dropdown dropdown-hover">
                            <label tabIndex={0} className="flex justify-center items-center space-x-1 ">
                                <div className="avatar online">
                                    <div className="w-10 rounded-full">
                                        <img src="https://cdn5.vectorstock.com/i/1000x1000/51/99/icon-of-user-avatar-for-web-site-or-mobile-app-vector-3125199.jpg" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold"> {user?.username}</h3>
                                    <span
                                        onClick={() => {
                                            handleLogout();
                                        }}
                                    >
                                        Đăng xuất
                                    </span>
                                </div>
                            </label>
                        </div>
                    ) : (
                        <div>
                            <Link to="/admin/auth/login">Login</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;

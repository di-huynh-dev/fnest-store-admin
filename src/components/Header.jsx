import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOutSuccess } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import vie from '../assets/flag/vi-flag.png';
import eng from '../assets/flag/en-flag.png';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logOutSuccess());
        navigate('/admin/auth/login');
        toast.success('Đăng xuất tài khoản thành công!');
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
                <div></div>
                <dialog id="dialog_profile" className="modal">
                    <div className="modal-box max-w-lg">
                        <h3 className="font-bold text-2xl text-center">THÔNG TIN TÀI KHOẢN</h3>
                        <form className="my-2" onSubmit={handleLogout}>
                            <div
                                onClick={() => document.getElementById('dialog_profile').close()}
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            >
                                X
                            </div>
                            <div className="">
                                <div className="flex items-center gap-1">
                                    <p className="font-bold">Mã người dùng:</p>
                                    <p>{user.id}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <p className="font-bold">Username:</p>
                                    <p>{user.username}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <p className="font-bold">Họ và tên:</p>
                                    <p>{user.fullName}</p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <p className="font-bold">Vai trò:</p>
                                    <p>{user.role}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <p className="font-bold">Trạng thái người dùng:</p>
                                    {user.status ? <p>Đang sử dụng</p> : <p>Bị vô hiệu hóa</p>}
                                </div>
                            </div>
                        </form>
                    </div>
                </dialog>
                <dialog id="dialog_logout" className="modal">
                    <div className="modal-box max-w-lg">
                        <h3 className="font-bold text-2xl text-center">ĐĂNG XUẤT TÀI KHOẢN</h3>
                        <form className="my-2" onSubmit={handleLogout}>
                            <div
                                onClick={() => document.getElementById('dialog_logout').close()}
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            >
                                X
                            </div>
                            <div className="text-center space-x-10">
                                <p className="my-10">Bạn chắc chắn đăng xuất?</p>
                                <div className="flex items-center mt-3 text-center justify-center">
                                    <button className="btn btn-primary text-white">Xác nhận</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </dialog>
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
                        <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
                            <label tabIndex={0} className="flex justify-center items-center space-x-1 ">
                                <div className="dropdown dropdown-hover">
                                    <div className="avatar online">
                                        <div className="w-12 mask mask-hexagon">
                                            <img src="https://cdn5.vectorstock.com/i/1000x1000/51/99/icon-of-user-avatar-for-web-site-or-mobile-app-vector-3125199.jpg" />
                                        </div>
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                    >
                                        <li>
                                            <span
                                                onClick={() => {
                                                    document.getElementById('dialog_profile').showModal();
                                                }}
                                            >
                                                Thông tin cá nhân
                                            </span>
                                        </li>
                                        <li>
                                            <span
                                                onClick={() => {
                                                    document.getElementById('dialog_logout').showModal();
                                                }}
                                            >
                                                Đăng xuất
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold"> {user?.username}</h3>
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

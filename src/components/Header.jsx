import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOutSuccess } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { BsFillBellFill, BsMoonFill, BsSunFill } from 'react-icons/bs';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logOutSuccess());
        navigate('/');
    };
    const user = useSelector((state) => state.auth.login?.currentUser);
    return (
        <div>
            <div className="navbar bg-base-100">
                <div className="flex-1 ml-10">
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
                <div className="flex-none gap-2">
                    <div className="">
                        {/* THEME SETUP */}
                        <label className="swap swap-rotate">
                            <input type="checkbox" />
                            {/* sun icon*/}
                            <BsSunFill className="swap-on h-4 w-4" />
                            {/* moon icon*/}
                            <BsMoonFill className="swap-off h-4 w-4" />
                        </label>
                        <NavLink to="/cart" className="btn btn-ghost btn-circle btn-md ml-4">
                            <div className="indicator">
                                <BsFillBellFill className="h-6 w-6" />
                                <span className="badge badge-sm badge-primary indicator-item text-white">0</span>
                            </div>
                        </NavLink>
                    </div>
                    <div className="mr-4 flex">
                        {user ? (
                            <div className="dropdown dropdown-hover">
                                <label tabIndex={0} className="flex justify-center items-center space-x-1 ">
                                    <div className="avatar online">
                                        <div className="w-10 rounded-full">
                                            <img src="https://cdn5.vectorstock.com/i/1000x1000/51/99/icon-of-user-avatar-for-web-site-or-mobile-app-vector-3125199.jpg" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold"> Huỳnh Tiến Dĩ</h3>
                                        <span>{user?.username}</span>
                                    </div>
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[2] menu shadow bg-base-100 rounded-box w-52"
                                >
                                    <li>
                                        <NavLink to="/profile">Quản lý tài khoản</NavLink>
                                    </li>

                                    <li>
                                        <p onClick={handleLogout}>Đăng xuất</p>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div>
                                <Link to="/admin/auth/login">Login</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;

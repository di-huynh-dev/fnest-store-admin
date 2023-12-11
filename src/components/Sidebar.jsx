import React, { useState, useEffect } from 'react';
import {
    User,
    BarChart,
    ShoppingBasket,
    MenuSquare,
    ListOrdered,
    ArrowRight,
    ArrowLeft,
    LucideBadgeDollarSign,
    SunSnow,
    DoorOpen,
    BadgePercent,
    LucideBookA,
    MessageSquarePlus,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../assets/logo/Logo.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const variants = {
    expanded: { width: '12%' },
    nonexpanded: { width: '6%' },
};

const transition = {
    type: 'spring',
    damping: 20,
    stiffness: 100,
};

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation('translation');
    const user = useSelector((state) => state.auth.loginAdmin?.currentUser);
    const token = useSelector((state) => state.auth.loginAdmin?.token);

    useEffect(() => {
        if (!token) {
            navigate('/admin/auth/login');
        }
    }, [token, navigate]);

    const navlinks = [
        {
            title: 'Dashboard',
            items: [
                // { id: 1, link: 'Dashboard', icon: <BarChart />, to: '/' },
                { id: 8, link: t('sales'), icon: <LucideBadgeDollarSign />, to: 'admin/sales' },
            ],
        },
        {
            title: 'Collections & Rooms',
            items: [
                { id: 2, link: t('collections'), icon: <SunSnow />, to: 'admin/collections' },
                { id: 3, link: t('rooms'), icon: <DoorOpen />, to: 'admin/rooms' },
            ],
        },

        {
            title: 'Products',
            items: [
                { id: 4, link: t('categories'), icon: <MenuSquare />, to: 'admin/categories' },
                { id: 5, link: t('products'), icon: <ShoppingBasket />, to: 'admin/products' },
                { id: 6, link: t('discounts'), icon: <BadgePercent />, to: 'admin/discounts' },
            ],
        },
        {
            title: 'Orders',
            items: [{ id: 7, link: t('orders'), icon: <ListOrdered />, to: 'admin/orders' }],
        },
        {
            title: 'Users',
            items: [
                { id: 9, link: t('users'), icon: <User />, to: 'admin/users' },
                // { id: 10, link: t('customers'), icon: <UserSquare />, to: 'admin/customers' },
                { id: 11, link: t('feedbacks'), icon: <MessageSquarePlus />, to: 'admin/feedbacks' },
            ],
        },
        {
            title: 'Newsletter',
            items: [{ id: 12, link: t('news'), icon: <LucideBookA />, to: 'admin/news' }],
        },
    ];

    const [selectedItem, setSelectedItem] = useState(null);

    const handleLinkClick = (item) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        if (selectedItem === null) {
            setSelectedItem(1);
        }
    }, []);

    return (
        <motion.div
            animate={isExpanded ? 'expanded' : 'nonexpanded'}
            variants={variants}
            transition={transition}
            className={
                'flex flex-col border border-r-1 h-full fixed sidebar bg-[#FDFDFD] ' +
                (isExpanded ? ' md:w-1/4 lg:w-1/5 px-4 py-8' : ' w-1/3 md:w-1/6 p-6 ')
            }
        >
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="cursor-pointer absolute -right-3 top-10 rounded-full w-6 h-6 bg-primary flex justify-center items-center"
            >
                {isExpanded ? <ArrowLeft className="w-10 text-white" /> : <ArrowRight className="w-10 text-white" />}
            </div>
            <div className="mb-6">
                <div className="mx-10">
                    <img src={Logo} alt="" className="w-[100px]" />
                </div>
            </div>
            <div className="flex flex-col space-y-3">
                <div className="overflow-y-auto">
                    {navlinks.map((group) => (
                        <div key={group.title}>
                            {isExpanded && <div className="text-sm font-semibold text-gray-600 p-2">{group.title}</div>}
                            {group.items.map((nav) => {
                                if (
                                    (group.title === 'Users' ||
                                        group.title === 'Newsletter' ||
                                        group.title === 'Users' ||
                                        group.title === 'Dashboard') &&
                                    user.role !== 'ADMIN'
                                ) {
                                    return null;
                                } else
                                    return (
                                        <NavLink
                                            key={nav.id}
                                            to={nav.to}
                                            className={`nav-links w-full rounded-lg  ${
                                                selectedItem === nav.id ? 'bg-secondary text-white' : ''
                                            }`}
                                            onClick={() => handleLinkClick(nav.id)}
                                        >
                                            <div
                                                className={`${
                                                    selectedItem === nav.id
                                                        ? 'bg-primary hover:bg-primary text-white'
                                                        : ''
                                                } flex space-x-3 text-sm w-full p-1 rounded hover:bg-base-200 hover:text`}
                                            >
                                                {nav.icon}
                                                <span className={!isExpanded ? 'hidden' : 'block'}>{nav.link}</span>
                                            </div>
                                        </NavLink>
                                    );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;

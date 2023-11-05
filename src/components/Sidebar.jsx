import React, { useState, useEffect } from 'react';
import {
    User,
    BarChart,
    UserSquare,
    ShoppingBasket,
    MenuSquare,
    ListOrdered,
    ArrowRight,
    ArrowLeft,
    LucideBadgeDollarSign,
    SunSnow,
    DoorOpen,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const variants = {
    expanded: { width: '15%' },
    nonexpanded: { width: '6%' },
};

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    const navlinks = [
        {
            title: 'Dashboard',
            items: [{ id: 1, link: 'Dashboard', icon: <BarChart />, to: '/' }],
        },
        {
            title: 'Users',
            items: [
                { id: 2, link: 'Users', icon: <User />, to: 'admin/users' },
                { id: 3, link: 'Customers', icon: <UserSquare />, to: 'admin/customers' },
            ],
        },
        {
            title: 'Products',
            items: [
                { id: 4, link: 'Products', icon: <ShoppingBasket />, to: 'admin/products' },
                { id: 5, link: 'Categories', icon: <MenuSquare />, to: 'admin/categories' },
            ],
        },
        {
            title: 'Orders & Sales',
            items: [
                { id: 6, link: 'Orders', icon: <ListOrdered />, to: 'admin/orders' },
                { id: 7, link: 'Sales', icon: <LucideBadgeDollarSign />, to: 'admin/sales' },
            ],
        },
        {
            title: 'Collections & Rooms',
            items: [
                { id: 8, link: 'Collections', icon: <SunSnow />, to: 'admin/collections' },
                { id: 9, link: 'Rooms', icon: <DoorOpen />, to: 'admin/rooms' },
            ],
        },
    ];

    const [selectedItem, setSelectedItem] = useState(null);

    const handleLinkClick = (item) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        if (selectedItem === null) {
            setSelectedItem(1); // Thiết lập mặc định cho Dashboard
        }
    }, []); // Sử dụng mảng rỗng để đảm bảo hiệu chỉnh chỉ diễn ra 1 lần sau khi component được tạo.

    return (
        <motion.div
            animate={isExpanded ? 'expanded' : 'nonexpanded'}
            variants={variants}
            className={'flex flex-col border border-r-1 bg-[#FDFDFD] relative' + (isExpanded ? ' p-8' : ' p-6')}
        >
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="cursor-pointer absolute -right-3 top-10 rounded-full w-6 h-6 bg-primary flex justify-center items-center"
            >
                {isExpanded ? <ArrowLeft className="w-10 text-white" /> : <ArrowRight className="w-10 text-white" />}
            </div>

            <div className="flex flex-col space-y-10">
                {navlinks.map((group) => (
                    <div key={group.title}>
                        {isExpanded && <div className="text-sm font-semibold text-gray-600 p-2">{group.title}</div>}
                        {group.items.map((nav) => (
                            <NavLink
                                key={nav.id}
                                to={nav.to}
                                className={`nav-links w-full rounded-lg  ${
                                    selectedItem === nav.id ? 'bg-primary text-white' : ''
                                }`}
                                onClick={() => handleLinkClick(nav.id)}
                            >
                                <div
                                    className={`${
                                        selectedItem === nav.id ? 'bg-primary hover:bg-primary text-white' : ''
                                    } flex space-x-3 w-full p-2 rounded hover:bg-base-200 hover:text`}
                                >
                                    {nav.icon}
                                    <span className={!isExpanded ? 'hidden' : 'block'}>{nav.link}</span>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Sidebar;

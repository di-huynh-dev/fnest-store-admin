import DataTable from 'react-data-table-component';
import { SortAsc, FolderEditIcon, TrashIcon } from 'lucide-react';
import customerServices from '../services/cumstomerServices';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BsSearchHeart } from 'react-icons/bs';
import { useMemo } from 'react';

const columns = [
    {
        name: 'ID',
        selector: (row) => row.id,
        sortable: true,
    },
    {
        name: 'Username',
        selector: (row) => row.username,
        sortable: true,
    },
    {
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
    },
    {
        name: 'Fullname',
        selector: (row) => row.role,
        sortable: true,
    },
    {
        name: 'Role',
        selector: (row) => row.role,
        sortable: true,
    },
    {
        name: 'Gender',
        selector: (row) => row.gender,
        sortable: true,
    },
    {
        name: 'Trạng thái',
        selector: (row) =>
            row.emailConfirmed ? (
                <>
                    <span class="text-sm px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                        Đã xác nhận
                    </span>
                </>
            ) : (
                <>
                    <span class="text-sm px-2 py-1 font-semibold leading-tight text-pink-700 bg-pink-100 rounded-full">
                        Chưa xác nhận
                    </span>
                </>
            ),
        sortable: true,
    },
    {
        name: 'Default Address',
        selector: (row) => row.defaultAddressId,
        sortable: true,
    },
    {
        name: 'Created At',
        selector: (row) => row.createdAt,
        sortable: true,
    },
    {
        name: 'action',
        cell: (row) => (
            <>
                <button className="btn btn-outline btn-error mx-2">
                    <TrashIcon />
                </button>
                <button className="btn btn-outline btn-success mx-2">
                    <FolderEditIcon />
                </button>
            </>
        ),
    },
];

const UsersManagement = () => {
    const token = useSelector((state) => state.auth.loginAdmin?.token);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/admin/auth/login');
        }
        if (token) {
            const getAllUsers = async () => {
                try {
                    const resp = await customerServices.getAllCumstomers(token);
                    setData(resp.data);
                } catch (error) {
                    console.log(error);
                }
            };
            getAllUsers();
        }
    }, []);

    //Search
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const filteredItems = data.filter(
        (item) =>
            item.username.toLowerCase().includes(filterText.toLowerCase()) ||
            item.email.toLowerCase().includes(filterText.toLowerCase()) ||
            item.role.toLowerCase().includes(filterText.toLowerCase()) ||
            item.gender.toLowerCase().includes(filterText.toLowerCase()) ||
            (item.emailConfirmed
                ? 'Đã xác nhận'.toLowerCase().includes(filterText.toLowerCase())
                : 'Chưa xác nhận'.toLowerCase().includes(filterText.toLowerCase())) ||
            item.defaultAddressId.toLowerCase().includes(filterText.toLowerCase()) ||
            item.createdAt.toLowerCase().includes(filterText.toLowerCase()),
    );

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };
        return (
            <div className="grid grid-cols-2 my-2">
                <div className="relative">
                    <label className="input-group w-full">
                        <input
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder="Nhập từ khóa tìm kiếm..."
                            className="input input-bordered max-w-xs"
                        />
                        <span className="bg-base-200">
                            <BsSearchHeart className="text-primary" />
                        </span>
                    </label>
                </div>
                <div className="flex items-center mx-5">
                    <button
                        className="btn bg-primary btn-ghost text-white"
                        onClick={() => {
                            setIsUpdateMode(false);
                            document.getElementById('dialog').showModal();
                        }}
                    >
                        + Thêm sản phẩm
                    </button>
                </div>
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <div className="m-10">
            <DataTable
                title="Danh sách người dùng hệ thống"
                fixedHeader
                fixedHeaderScrollHeight="550px"
                direction="auto"
                responsive
                pagination
                columns={columns}
                data={filteredItems}
                striped
                subHeader
                expandableRows
                paginationResetDefaultPage={resetPaginationToggle}
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
            />
        </div>
    );
};

export default UsersManagement;

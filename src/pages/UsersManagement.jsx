import DataTable from 'react-data-table-component';
import { SortAsc, FolderEditIcon, TrashIcon } from 'lucide-react';
import customerServices from '../services/cumstomerServices';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

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
    const token = useSelector((state) => state.auth.login?.token);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
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

    return (
        <div className="mx-20 my-10">
            <DataTable
                title="Danh sách người dùng hệ thống"
                fixedHeader
                fixedHeaderScrollHeight="550px"
                direction="auto"
                responsive
                pagination
                columns={columns}
                data={data}
                sortIcon={<SortAsc />}
                striped
                subHeader
                subHeaderComponent={
                    <>
                        <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                    </>
                }
            />
        </div>
    );
};

export default UsersManagement;

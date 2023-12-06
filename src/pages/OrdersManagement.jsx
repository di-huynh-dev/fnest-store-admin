import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { SubmitButton, FormInput, Loading, TableLoader } from '../components';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import orderServices from '../services/orderServices';
import { FolderEdit, Trash } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { BsSearchHeart } from 'react-icons/bs';
import PreviewImage from '../utils/helpers';
import { formatPrice, formatDate } from '../utils/helpers';

const OrdersManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.loginAdmin?.token);
    const [data, setData] = useState([]);
    console.log(data);
    const [isLoading, setIsLoading] = useState(false);
    const [pending, setPending] = useState(true);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/admin/auth/login');
        } else {
            fetchData();
        }
    }, [token, navigate]);
    const fetchData = async () => {
        try {
            const resp = await orderServices.getAllOrders(token);
            if (resp.status == 'OK') {
                setData(resp.data);
                setPending(false);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const filteredItems = data.filter(
        (item) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
    );

    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div className="my-2">
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
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            width: '100px',
        },

        {
            name: 'Ngày tạo',
            selector: (row) => <div className="text-sm">{formatDate(row.createdAt)}</div>,
            sortable: false,
            width: '120px',
        },
        {
            name: 'Ngày cập nhật',
            selector: (row) => <div className="text-sm">{formatDate(row.lastUpdatedAt)}</div>,
            sortable: false,
            width: '120px',
        },
        {
            name: 'Giảm giá',
            selector: (row) => <div className="text-sm">{formatPrice(row.codeDiscount)}</div>,
            sortable: false,
            width: '120px',
        },
        {
            name: 'Trạng thái',
            selector: (row) => <div className="text-sm">{row.status}</div>,
            sortable: false,
            width: '120px',
        },
        {
            name: 'Tổng đơn',
            selector: (row) => <div className="text-sm">{formatPrice(row.total)}</div>,
            sortable: false,
            width: '120px',
        },
        {
            name: 'Phí vận chuyển',
            selector: (row) => <div className="text-sm">{formatPrice(row.shippingCharge)}</div>,
            sortable: false,
            width: '120px',
        },
        {
            name: 'Địa chỉ',
            selector: (row) => <div className="text-sm">{row.deliveryAddress.deliveryAddress}</div>,
            sortable: false,
            width: '600px',
        },
        {
            name: '',
            cell: (row) => (
                <>
                    <button
                        className="btn btn-outline btn-success mx-2"
                        onClick={() => {
                            handleUpdate(row.id);
                        }}
                    >
                        <FolderEdit />
                    </button>
                </>
            ),
            width: '100px',
        },
    ];
    return (
        <div>
            <div className="container">
                <DataTable
                    title="QUẢN LÝ ĐƠN HÀNG FNEST"
                    fixedHeader
                    fixedHeaderScrollHeight="550px"
                    direction="auto"
                    responsive
                    pagination
                    columns={columns}
                    data={data}
                    highlightOnHover
                    striped
                    subHeader
                    paginationResetDefaultPage={resetPaginationToggle}
                    subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                    progressPending={pending}
                    progressComponent={<TableLoader />}
                    customStyles={{
                        table: {
                            fontSize: '30px',
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default OrdersManagement;

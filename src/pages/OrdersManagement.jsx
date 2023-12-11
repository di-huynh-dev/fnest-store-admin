import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { SubmitButton, FormInput, Loading, TableLoader } from '../components';
import { useNavigate } from 'react-router-dom';
import orderServices from '../services/orderServices';
import { FolderEdit, Trash } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { formatPrice, formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

const OrdersManagement = () => {
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.loginAdmin?.token);
    const user = useSelector((state) => state.auth.loginAdmin?.currentUser);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
    const [pending, setPending] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filteredItems = data.filter(
        (item) => item.receiverName && item.receiverName.toLowerCase().includes(filterText.toLowerCase()),
    );
    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div className="">
                <div className="relative">
                    <label className="input-group w-full">
                        <input
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder="Nhập tên khách hàng..."
                            className="input input-bordered max-w-xs"
                        />
                    </label>
                </div>
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    const closeDialog = () => {
        document.getElementById('dialog').close();
        setIsConfirmationDialogOpen(false);
    };

    const handleUpdateStatus = (id) => {
        setSelectedOrder(id);
        setSelectedOrderStatus(selectedOrder.status); // Issue here
        document.getElementById('dialog').showModal();
    };

    const handleStatusUpdate = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (user.role === 'STAFF') {
            try {
                const resp = await orderServices.updateOrderStatus(token, selectedOrder, selectedOrderStatus);
                if (resp.status === 'OK') {
                    toast.success('Thay đổi trạng thái thành công!');
                    fetchData();
                    setIsLoading(false);
                    closeDialog();
                }
            } catch (error) {
                setIsLoading(false);
                console.error(error);
            }
        } else {
            setIsLoading(false);
            toast.error('Không có quyền thực hiện!');
        }
    };

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            width: '60px',
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
            name: 'PT Thanh toán',
            selector: (row) => <div className="text-sm">{row.paymentMethod}</div>,
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
            width: '200px',
        },
        {
            name: '',
            cell: (row) => (
                <>
                    {user.role === 'STAFF' ? (
                        <button
                            className="btn btn-outline btn-success mx-2"
                            onClick={() => {
                                handleUpdateStatus(row.id);
                            }}
                        >
                            <FolderEdit />
                        </button>
                    ) : (
                        <></>
                    )}
                </>
            ),
            width: '100px',
        },
    ];
    const ExpandedComponent = ({ data }) => {
        return (
            <div className="mx-20 my-4">
                <div className="grid grid-cols-4 mb-2">
                    <div>
                        <strong>Mã đơn hàng:</strong> {data.id}
                    </div>
                    <div>
                        <strong>Tổng hóa đơn:</strong> {formatPrice(data.total)}
                    </div>
                    <div>
                        <strong>Giảm giá:</strong> {formatPrice(data.codeDiscount)}
                    </div>
                    <div>
                        <strong>Phí vận chuyển:</strong> {formatPrice(data.shippingCharge)}
                    </div>
                </div>
                <div className="mb-2">
                    <strong>Danh sách sản phẩm:</strong>
                    {data.orderItemList.map((item) => (
                        <div className="mb-2 grid grid-cols-7 gap-2">
                            <div className="mb-2">
                                <strong>Tên:</strong> <div className="text-sm">{item.productName}</div>
                            </div>
                            <div className="mb-2">
                                <strong>Kích thước:</strong> <div className="text-sm">{item.productSize}</div>
                            </div>
                            <div className="mb-2">
                                <strong>Vật liệu:</strong> <div className="text-sm">{item.productMaterial}</div>
                            </div>
                            <div className="mb-2">
                                <strong>Hình ảnh:</strong> <img src={item.productThumbnail} className="w-20 h-20" />
                            </div>
                            <div className="mb-2">
                                <strong>Số lượng:</strong> <div className="text-sm">{item.quantity}</div>
                            </div>
                            <div className="mb-2">
                                <strong>Giá SP:</strong> <div className="text-sm">{formatPrice(item.productPrice)}</div>
                            </div>
                            <div className="mb-2">
                                <strong>Tổng:</strong> <div className="text-sm">{formatPrice(item.total)}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <strong>Thông tin nhận hàng</strong>
                    <div className="mb-2">
                        <strong>Người nhận:</strong>{' '}
                        <div className="text-sm">
                            {data.deliveryAddress.receiverName},{data.deliveryAddress.receiverPhone}
                        </div>
                    </div>
                    <div className="mb-2">
                        <strong>Địa chỉ:</strong> <div className="text-sm">{data.deliveryAddress.deliveryAddress}</div>
                    </div>
                    <div className="mb-2">
                        <strong>Phương thức thanh toán:</strong> <div className="text-sm">{data.paymentMethod}</div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="m-10">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <dialog id="dialog" className="modal">
                        <div className="modal-box">
                            <form onSubmit={handleStatusUpdate}>
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                        ✕
                                    </button>
                                </form>
                                <h3 className="font-bold text-lg text-center uppercase">
                                    Cập nhật trạng thái đơn hàng
                                </h3>
                                <div className="flex items-center justify-center my-10">
                                    <select
                                        className="select select-bordered w-full max-w-xs"
                                        value={selectedOrderStatus}
                                        onChange={(e) => setSelectedOrderStatus(e.target.value)}
                                    >
                                        <option disabled value="">
                                            Trạng thái đơn
                                        </option>
                                        <option value="CONFIRMED">Đã xác nhận</option>
                                        <option value="IN_SHIPPING">Đang giao</option>
                                        <option value="COMPLETED">Đã giao</option>
                                        <option value="CANCELED">Đã hủy</option>
                                    </select>
                                </div>
                                <SubmitButton text="Cập nhật" color="primary" />
                            </form>
                        </div>
                    </dialog>
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
                        expandableRows
                        expandableRowsComponent={ExpandedComponent}
                        customStyles={{
                            table: {
                                fontSize: '30px',
                            },
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default OrdersManagement;

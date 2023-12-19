import DataTable from 'react-data-table-component';
import { FolderEditIcon, TrashIcon } from 'lucide-react';
import { FormInput, SubmitButton, Loading, TableLoader } from '../components';
import userServices from '../services/userServices';
import { useState, useEffect } from 'react';
import { BsSearchHeart } from 'react-icons/bs';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import customerServices from '../services/cumstomerServices';
import { FaCheckCircle, FaBan } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';

const UsersManagement = () => {
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.loginAdmin?.token);
    const [data, setData] = useState([]);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pending, setPending] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newStatus, setNewStatus] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/admin/auth/login');
        }
        if (token) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const resp = await customerServices.getAllCumstomers(token);
            setData(resp.data);
            setPending(false);
        } catch (error) {
            console.log(error);
        }
    };

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
                            document.getElementById('dialog').showModal();
                        }}
                    >
                        + Thêm nhân viên
                    </button>
                </div>
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    const closeDialog = () => {
        document.getElementById('dialog').close();
        resetForm();
    };

    const resetForm = () => {
        setSelectedUserId(null);
        formik.resetForm();
    };

    const handleUpdate = async (id, currentStatus) => {
        document.getElementById('dialog_update').showModal();
        setSelectedUserId(id);
        setNewStatus(!currentStatus);
    };

    const confirmStatusUpdate = async () => {
        setIsLoading(true);
        try {
            const resp = await userServices.updateUser(token, selectedUserId, newStatus);

            if (resp.status === 'OK') {
                setIsLoading(false);
                toast.success('Trạng thái đã được cập nhật!');
                fetchData();
            }
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.data && error.response.data.messages) {
                const errorMessages = error.response.data.messages[0];
                toast.error(errorMessages.join(', '));
            } else {
                toast.error('Có lỗi xảy ra.');
            }
        }
    };

    const handleSubmit = async (values) => {
        setIsLoading(true);
        try {
            closeDialog();
            const resp = await userServices.addStaff(
                token,
                values.username,
                values.password,
                values.displayName,
                values.role,
            );
            if (resp.status === 'OK') {
                setIsLoading(false);
                fetchData();
                toast.success(resp.messages[0]);
            }
        } catch (error) {
            setIsLoading(false);
            resetForm();
            if (error.response && error.response.data && error.response.data.messages) {
                const errorMessages = error.response.data.messages;
                toast.error(errorMessages.join(', '));
            } else {
                toast.error('Có lỗi xảy ra.');
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            password: '',
            displayName: '',
            role: 'STAFF',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Vui lòng nhập thông tin!'),
            password: Yup.string().required('Vui lòng nhập thông tin!'),
            displayName: Yup.string().required('Vui lòng nhập thông tin!'),
        }),
        onSubmit: handleSubmit,
    });

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            width: '100px',
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
            selector: (row) => row.fullName,
            sortable: true,
        },
        {
            name: 'Trạng thái',
            selector: (row) => (
                <div className="">
                    {row.status ? (
                        <FaCheckCircle className="text-success w-6 h-6" />
                    ) : (
                        <FaBan className="text-error w-6 h-6" />
                    )}
                </div>
            ),
            sortable: false,
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
            name: '',
            cell: (row) => (
                <>
                    <button
                        className="btn btn-outline btn-success mx-2"
                        onClick={() => handleUpdate(row.id, row.status)}
                    >
                        <FolderEditIcon />
                    </button>
                </>
            ),
        },
    ];
    const ExpandedComponent = ({ data }) => {
        return (
            <div className="mx-20 grid grid-cols-3">
                <div className="mb-2">
                    <strong>ID:</strong> {data.id}
                </div>

                <div className="mb-2">
                    <strong>Username:</strong> <div className="text-sm">{data.username}</div>
                </div>
                <div className="mb-2">
                    <strong>Fullname:</strong> <div className="text-sm">{data.fullName}</div>
                </div>
                <div className="mb-2">
                    <strong>Email:</strong> <div className="text-sm">{data.email}</div>
                </div>
                <div className="mb-2">
                    <strong>Giới tính:</strong> <div className="text-sm">{data.gender}</div>
                </div>
                <div className="mb-2">
                    <strong>Vai trò:</strong> <div className="text-sm">{data.role}</div>
                </div>
                <div className="mb-2">
                    <strong>Trạng thái tài khoản:</strong> <div className="text-sm">{data.status}</div>
                </div>
                <div className="mb-2">
                    <strong>Trạng thái email:</strong>{' '}
                    <div className="text-sm">{data.emailConfirmed ? <>Đã xác nhận</> : <>Chưa xác nhận</>}</div>
                </div>
                <div className="mb-2">
                    <strong>Ngày tạo:</strong> <div className="text-sm">{formatDate(data.createdAt)}</div>
                </div>
                <div className="mb-2">
                    <strong>Ngày cập nhật:</strong> <div className="text-sm">{formatDate(data.lastUpdatedAt)}</div>
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
                    <dialog id="dialog_update" className="modal">
                        <div className="modal-box max-w-lg">
                            <h3 className="font-bold text-2xl text-center">CẬP NHẬT TRẠNG THÁI NGƯỜI DÙNG</h3>
                            <form className="my-2" onSubmit={confirmStatusUpdate}>
                                <div
                                    onClick={() => document.getElementById('dialog_update').close()}
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                >
                                    X
                                </div>
                                <div className="text-center space-x-10">
                                    <p className="my-10">Bạn muốn cập nhật lại trạng thái người dùng?</p>
                                    <div className="flex items-center mt-3 text-center justify-center">
                                        <SubmitButton text="Cập nhật" color="primary" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </dialog>
                    <dialog id="dialog" className="modal">
                        <div className="modal-box max-w-2xl">
                            <h3 className="font-bold text-2xl text-center">Quản lý Nhân viên</h3>
                            <form className="my-2" onSubmit={formik.handleSubmit}>
                                <div
                                    onClick={closeDialog}
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                >
                                    X
                                </div>
                                <div className="text-center space-x-10">
                                    <div>
                                        <FormInput
                                            type="text"
                                            label="Tên nhân viên"
                                            name="displayName"
                                            value={formik.values.displayName}
                                            placeholder="Nhập tên nhân viên..."
                                            onchange={formik.handleChange}
                                        />
                                        {formik.errors.displayName && (
                                            <span className="text-error text-sm p-1 ">{formik.errors.displayName}</span>
                                        )}
                                        <FormInput
                                            type="text"
                                            label="Tên đăng nhập"
                                            name="username"
                                            value={formik.values.username}
                                            placeholder="Nhập username..."
                                            onchange={formik.handleChange}
                                        />
                                        {formik.errors.username && (
                                            <span className="text-error text-sm p-1 ">{formik.errors.username}</span>
                                        )}
                                        <FormInput
                                            type="text"
                                            label="Mật khẩu"
                                            name="password"
                                            value={formik.values.password}
                                            placeholder="Nhập pasword.."
                                            onchange={formik.handleChange}
                                        />
                                        {formik.errors.password && (
                                            <span className="text-error text-sm p-1 ">{formik.errors.password}</span>
                                        )}
                                        <div className="flex items-center mt-3 text-center justify-center">
                                            <SubmitButton text={isUpdateMode ? 'Cập nhật' : 'Thêm'} color="primary" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </dialog>
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
                        expandableRowsComponent={ExpandedComponent}
                        progressPending={pending}
                        progressComponent={<TableLoader />}
                        paginationResetDefaultPage={resetPaginationToggle}
                        subHeaderComponent={subHeaderComponentMemo}
                        persistTableHead
                    />
                </>
            )}
        </div>
    );
};

export default UsersManagement;

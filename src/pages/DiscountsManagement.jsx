import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { SubmitButton, FormInput, Loading, TableLoader } from '../components';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import couponServices from '../services/couponServices';
import { FolderEdit, Trash } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { BsSearchHeart } from 'react-icons/bs';
import { formatDate, formatPrice } from '../utils/helpers';

const DiscountsManagement = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.loginAdmin?.token);
    const user = useSelector((state) => state.auth.loginAdmin?.currentUser);

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pending, setPending] = useState(true);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [selectedCouponId, setSelectedCouponId] = useState(null);
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
            const resp = await couponServices.getAllCoupons();
            setData(resp.data);
            setPending(false);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredItems = data.filter(
        (item) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
    );
    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <div className={'grid my-2' + (user.role === 'ADMIN' && 'grid grid-cols-2')}>
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
                {user.role === 'ADMIN' && (
                    <div className="flex items-center mx-5">
                        <button
                            className="btn bg-primary btn-ghost text-white"
                            onClick={() => {
                                setIsUpdateMode(false);
                                document.getElementById('dialog').showModal();
                            }}
                        >
                            + Thêm mã giảm giá
                        </button>
                    </div>
                )}
            </div>
        );
    }, [filterText, resetPaginationToggle]);
    //Get

    const resetForm = () => {
        // setIdCollection(null);
        setIsUpdateMode(false);
        formik.resetForm();
    };

    const closeDialog = () => {
        document.getElementById('dialog').close();
        resetForm();
    };

    const handleUpdate = (id) => {
        setSelectedCouponId(id);
        setIsUpdateMode(true);
        document.getElementById('dialog').showModal();
    };
    // Define handleDelete function
    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            const resp = await couponServices.deleteCoupon(token, id);
            if (resp.status === 'OK') {
                setIsLoading(false);
                toast.success(resp.messages[0]);
                fetchData();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.messages) {
                const errorMessages = error.response.data.messages;
                toast.error(errorMessages.join(', '));
            } else {
                toast.error('Có lỗi xảy ra.');
            }
        }
    };
    const handleSubmit = async (values) => {
        setIsLoading(true);
        if (isUpdateMode) {
            try {
                // const resp = await categoryServices.updateCategory(token, selectedCategoryId, formData);
                // toast.success(resp.messages[0]);
                // closeDialog();
                // // After a successful update, fetch the latest data and update the state
                // const updatedData = await categoryServices.getAllCategories();
                // setIsLoading(false);
                // setData(updatedData.data);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.messages) {
                    const errorMessages = error.response.data.messages;
                    toast.error(errorMessages.join(', '));
                } else {
                    toast.error('Có lỗi xảy ra.');
                }
            }
        } else {
            try {
                closeDialog();
                const resp = await couponServices.addCoupon(
                    token,
                    values.code,
                    values.value,
                    values.description,
                    values.minOrderValue,
                    values.maxDiscount,
                    values.times,
                    values.beginDate,
                    values.endDate,
                );
                if (resp.status === 'OK') {
                    toast.success(resp.messages[0]);
                    setIsLoading(false);
                    fetchData();
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.messages) {
                    const errorMessages = error.response.data.messages;
                    toast.error(errorMessages.join(', '));
                    closeDialog();
                } else {
                    toast.error('Có lỗi xảy ra.');
                }
            }
        }
    };
    // Form validation using Formik and Yup
    const formik = useFormik({
        initialValues: {
            code: '',
            value: '',
            description: '',
            minOrderValue: '',
            maxDiscount: '',
            times: '',
            beginDate: '',
            endDate: '',
        },
        validationSchema: Yup.object({
            code: Yup.string().required('Vui lòng nhập thông tin!'),
            value: Yup.mixed().required('Vui lòng nhập thông tin!'),
            description: Yup.string().required('Vui lòng nhập thông tin!'),
            minOrderValue: Yup.mixed().required('Vui lòng nhập thông tin!'),
            maxDiscount: Yup.string().required('Vui lòng nhập thông tin!'),
            times: Yup.mixed().required('Vui lòng nhập thông tin!'),
            beginDate: Yup.mixed().required('Vui lòng nhập thông tin!'),
            endDate: Yup.mixed().required('Vui lòng nhập thông tin!'),
        }),
        onSubmit: handleSubmit,
    });

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            width: '60px',
        },
        {
            name: 'Mã giảm',
            selector: (row) => row.code,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Phần trăm giảm',
            selector: (row) => <>{row.value}%</>,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Mô tả',
            selector: (row) => <div className="text-sm">{row.description}</div>,
            sortable: false,
            width: '150px',
        },
        {
            name: 'Giá trị tối thiểu đơn',
            selector: (row) => formatPrice(row.minOrderValue),
            sortable: false,
            width: '120px',
        },
        {
            name: 'Số tiền tối đa',
            selector: (row) => formatPrice(row.maxDiscount),
            sortable: false,
            width: '120px',
        },
        {
            name: 'Số lần giảm',
            selector: (row) => row.times,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Bắt đầu',
            selector: (row) => formatDate(row.beginDate),
            sortable: false,
            width: '120px',
        },
        {
            name: 'Kết thúc',
            selector: (row) => formatDate(row.endDate),
            sortable: false,
            width: '120px',
        },
        {
            name: '',
            cell: (row) => (
                <>
                    {' '}
                    {user.role === 'ADMIN' && (
                        <>
                            <button className="btn btn-outline btn-error mx-2" onClick={() => handleDelete(row.id)}>
                                <Trash />
                            </button>
                            <button
                                className="btn btn-outline btn-success mx-2"
                                onClick={() => {
                                    handleUpdate(row.id);
                                }}
                            >
                                <FolderEdit />
                            </button>{' '}
                        </>
                    )}
                </>
            ),
            width: '100px',
        },
    ];

    const ExpandedComponent = ({ data }) => {
        return (
            <div className="mx-20">
                <div className="mb-2">
                    <strong>ID:</strong> {data.id}
                </div>
                <div className="mb-2">
                    <strong>Mã giảm giá:</strong> {data.code}
                </div>
                <div className="mb-2">
                    <strong>Phần trăm giảm,:</strong> {data.value}
                </div>

                <div className="mb-2">
                    <strong>Mô tả:</strong> <div className="text-sm">{data.description}</div>
                </div>
                <div className="mb-2">
                    <strong>Giá trị tối thiểu đơn hàng:</strong> {formatPrice(data.minOrderValue)}
                </div>
                <div className="mb-2">
                    <strong>Số tiền tối đa giảm được:</strong> {formatPrice(data.maxDiscount)}
                </div>
            </div>
        );
    };

    return (
        <div className="m-10">
            {isLoading ? <Loading></Loading> : <></>}
            <dialog id="dialog" className="modal">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-2xl text-center">Danh mục mã giảm giá</h3>
                    <form className="my-2" onSubmit={formik.handleSubmit}>
                        <div onClick={closeDialog} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            X
                        </div>
                        <div className=" space-x-10">
                            <div>
                                <FormInput
                                    type="text"
                                    label="Mã giảm"
                                    name="code"
                                    value={formik.values.code}
                                    placeholder="Nhập mã giảm..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.code && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.code}</span>
                                )}
                                <FormInput
                                    type="text"
                                    label="Phần trăm giảm"
                                    name="value"
                                    value={formik.values.value}
                                    placeholder="Nhập phần trăm giảm..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.value && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.value}</span>
                                )}
                                <FormInput
                                    type="text"
                                    label="Mô tả"
                                    name="description"
                                    value={formik.values.description}
                                    placeholder="Nhập mô tả..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.description && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.description}</span>
                                )}
                                <FormInput
                                    type="text"
                                    label="Giá trị tối thiểu của đơn hàng"
                                    name="minOrderValue"
                                    value={formik.values.minOrderValue}
                                    placeholder="Nhập giá trị đơn tối thiểu..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.minOrderValue && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.minOrderValue}</span>
                                )}
                                <FormInput
                                    type="text"
                                    label="Số tiền tối đa giảm được"
                                    name="maxDiscount"
                                    value={formik.values.maxDiscount}
                                    placeholder="Nhập số tiền tối đa..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.maxDiscount && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.maxDiscount}</span>
                                )}
                                <FormInput
                                    type="text"
                                    label="Số lần giảm"
                                    name="times"
                                    placeholder="Nhập số lần..."
                                    value={formik.values.times}
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.times && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.times}</span>
                                )}
                                <FormInput
                                    type="date"
                                    label="Ngày bắt đầu"
                                    name="beginDate"
                                    value={formik.values.beginDate}
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.beginDate && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.beginDate}</span>
                                )}
                                <FormInput
                                    type="date"
                                    label="Ngày kết thúc"
                                    name="endDate"
                                    value={formik.values.endDate}
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.endDate && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.endDate}</span>
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
                title="QUẢN LÝ MÃ GIẢM GIÁ FNEST"
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
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                progressPending={pending}
                progressComponent={<TableLoader />}
                customStyles={{
                    table: {
                        fontSize: '30px',
                    },
                }}
            />
        </div>
    );
};

export default DiscountsManagement;

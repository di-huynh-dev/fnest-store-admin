import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { SubmitButton, FormInput, Loading } from '../components';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import categoryServices from '../services/categoryServices';
import roomServices from '../services/roomServices';
import { FolderEdit, Trash } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCategorysSuccess } from '../features/categorySlice';
import { BsSearchHeart } from 'react-icons/bs';
import PreviewImage from '../utils/helpers';

const CategoriesManagement = () => {
    const dispatch = useDispatch();

    const token = useSelector((state) => state.auth.login?.token);
    const [data, setData] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [idCollection, setIdCollection] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
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
                        + Thêm danh mục
                    </button>
                </div>
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    const resetForm = () => {
        setIdCollection(null);
        setIsUpdateMode(false);
    };

    const closeDialog = () => {
        document.getElementById('dialog').close();
        resetForm();
    };

    const handleUpdate = (id) => {
        setSelectedCategoryId(id);
        setIsUpdateMode(true);
        document.getElementById('dialog').showModal();
    };

    const navigate = useNavigate();

    // Define handleDelete function
    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            const resp = await categoryServices.deleteCategory(token, id);
            setIsLoading(false);
            if (resp.messages && resp.messages.length > 0) {
                toast.success(resp.messages[0]);
                const updatedData = await categoryServices.getAllCategories();
                setData(updatedData.data);
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

    useEffect(() => {
        if (!token) {
            navigate('/admin/auth/login');
        } else {
            const getCategories = async () => {
                try {
                    const respCate = await categoryServices.getAllCategories();
                    const respRoom = await roomServices.getAllRooms();
                    dispatch(getAllCategorysSuccess(respCate.data));
                    setData(respCate.data);
                    setRooms(respRoom.data);
                } catch (error) {
                    console.log(error);
                }
            };
            getCategories();
        }
    }, [token, navigate]);

    // Form submission handler
    const handleSubmit = async (values) => {
        setIsLoading(true);
        if (isUpdateMode) {
            if (selectedCategoryId) {
                try {
                    const formData = new FormData();
                    formData.append('name', values.name);
                    formData.append('image', values.file);

                    const resp = await categoryServices.updateCategory(token, selectedCategoryId, formData);

                    toast.success(resp.messages[0]);
                    closeDialog();

                    // After a successful update, fetch the latest data and update the state
                    const updatedData = await categoryServices.getAllCategories();
                    setIsLoading(false);
                    setData(updatedData.data);
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.messages) {
                        const errorMessages = error.response.data.messages;
                        toast.error(errorMessages.join(', '));
                    } else {
                        toast.error('Có lỗi xảy ra.');
                    }
                }
            }
        } else {
            try {
                closeDialog();
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('image', values.file);
                formData.append('roomId', selectedRoomId);

                const resp = await categoryServices.addCategory(token, formData);
                if (resp.messages && resp.messages.length > 0) {
                    toast.success(resp.messages[0]);
                    const updatedData = await categoryServices.getAllCategories();
                    setData(updatedData.data);
                    setIsLoading(false);
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.messages) {
                    const errorMessages = error.response.data.messages;
                    toast.error(errorMessages.join(', '));
                } else {
                    toast.error('Có lỗi xảy ra.');
                }
            }
        }
    };

    // Form validation using Formik and Yup
    const formik = useFormik({
        initialValues: {
            name: '',
            file: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Vui lòng nhập thông tin!'),
            file: Yup.mixed().required('Vui lòng tải lên hình ảnh!'),
        }),
        onSubmit: handleSubmit,
    });

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: 'Hình ảnh',
            selector: (row) => <img src={row.image} className="w-14 h-14 my-2"></img>,
            sortable: false,
        },
        {
            name: 'Tên danh mục',
            selector: (row) => <div className="text-sm">{row.name}</div>,
            sortable: false,
        },
        {
            name: 'ID phòng',
            selector: (row) => row.roomId,
            sortable: false,
        },
        {
            name: '',
            cell: (row) => (
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
                    </button>
                </>
            ),
        },
    ];

    return (
        <div className="mx-20 my-10">
            {isLoading ? <Loading></Loading> : <></>}
            <dialog id="dialog" className="modal">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-2xl text-center">Danh mục sản phẩm</h3>
                    <form className="my-2" onSubmit={formik.handleSubmit}>
                        <div onClick={closeDialog} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            X
                        </div>
                        <div className=" space-x-10">
                            <div>
                                <FormInput
                                    type="text"
                                    label="Tên Danh mục"
                                    name="name"
                                    placeholder="Nhập tên danh muc..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.name && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.name}</span>
                                )}
                                <div className="my-4">
                                    <label className="block text-sm">Chọn Phòng</label>
                                    <select
                                        name="room"
                                        value={selectedRoomId}
                                        onChange={(e) => setSelectedRoomId(e.target.value)}
                                        className="select select-bordered  mt-1 p-2  rounded-md w-full"
                                    >
                                        <option value="">-- Chọn phòng --</option>
                                        {rooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.name}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedRoomId === '' && (
                                        <p className="text-error text-sm p-1">Vui lòng chọn phòng!</p>
                                    )}
                                </div>

                                <FormInput
                                    type="file"
                                    label="Hình ảnh"
                                    name="file"
                                    onchange={(e) => formik.setFieldValue('file', e.target.files[0])}
                                />
                                {formik.errors.file && <p className="text-error text-sm p-1">{formik.errors.file}</p>}
                                {formik.values.file && <PreviewImage file={formik.values.file} />}

                                <div className="flex items-center mt-3 text-center justify-center">
                                    <SubmitButton text={isUpdateMode ? 'Cập nhật' : 'Thêm'} color="primary" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </dialog>
            <DataTable
                title="QUẢN LÝ DANH MỤC FNEST"
                fixedHeader
                fixedHeaderScrollHeight="550px"
                direction="auto"
                responsive
                pagination
                columns={columns}
                data={filteredItems}
                highlightOnHover
                striped
                subHeader
                paginationResetDefaultPage={resetPaginationToggle}
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                customStyles={{
                    table: {
                        fontSize: '30px',
                    },
                }}
            />
        </div>
    );
};

export default CategoriesManagement;

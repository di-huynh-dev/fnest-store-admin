import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { SortAsc, FolderEdit, Trash } from 'lucide-react';
import { FormInput, SubmitButton, Loading } from '../components';
import { Form, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import collectionServices from '../services/collectionServices';
import { useSelector, useDispatch } from 'react-redux';
import { BsSearchHeart } from 'react-icons/bs';
import { getAllCollectionsSuccess } from '../features/collectionSlice';
import PreviewImage from '../utils/helpers';

const CollectionSManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.loginAdmin?.token);
    const [data, setData] = useState([]);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [idCollection, setIdCollection] = useState(null);

    //Search
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
                        + Thêm bộ sưu tập
                    </button>
                </div>
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    const closeDialog = () => {
        document.getElementById('dialog').close();
    };

    const resetForm = () => {
        setIdCollection(null);
        setIsUpdateMode(false);
        formik.resetForm();
        formik.setValues({
            name: '',
            description: '',
            file: '',
        });
    };

    //Get
    useEffect(() => {
        if (!token) {
            navigate('/admin/auth/login');
        } else {
            const getCollections = async () => {
                try {
                    const resp = await collectionServices.getAllCollections();
                    dispatch(getAllCollectionsSuccess(resp.data));
                    setData(resp.data);
                } catch (error) {
                    console.log(error);
                }
            };
            getCollections();
        }
    }, [token, navigate]);

    //Update
    const handleUpdate = (id) => {
        setIdCollection(id);
        setIsUpdateMode(true);
        document.getElementById('dialog').showModal();
    };

    // Define handleDelete function
    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            const resp = await collectionServices.deleteCollection(token, id);
            setIsLoading(false);
            if (resp.messages && resp.messages.length > 0) {
                toast.success(resp.messages[0]);
                const updatedData = await collectionServices.getAllCollections();
                dispatch(getAllCollectionsSuccess(updatedData.data));
                resetForm();
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

    // Form submission handler
    const handleSubmit = async (values) => {
        setIsLoading(true);
        if (isUpdateMode) {
            if (idCollection) {
                try {
                    closeDialog();

                    const formData = new FormData();
                    formData.append('name', values.name);
                    formData.append('description', values.description);
                    formData.append('image', values.file);
                    const resp = await collectionServices.updateCollection(token, idCollection, formData);

                    setIsLoading(false);
                    toast.success(resp.messages[0]);
                    // After a successful update, fetch the latest data and update the state
                    const updatedData = await collectionServices.getAllCollections();
                    dispatch(getAllCollectionsSuccess(updatedData.data));
                    setData(updatedData.data);
                    resetForm();
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
            }
        } else {
            try {
                closeDialog();
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('description', values.description);
                formData.append('image', values.file);

                const resp = await collectionServices.addCollection(token, formData);
                setIsLoading(false);
                if (resp.messages && resp.messages.length > 0) {
                    toast.success(resp.messages[0]);
                    const updatedData = await collectionServices.getAllCollections();
                    setData(updatedData.data);
                    resetForm();
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
        }
    };

    // Form validation using Formik and Yup
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            file: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Vui lòng nhập thông tin!'),
            description: Yup.string().required('Vui lòng nhập thông tin!'),
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
            selector: (row) => <img src={row.imageUrl} className="w-14 h-14 my-2"></img>,
            sortable: false,
        },
        {
            name: 'Tên bộ sưu tập',
            selector: (row) => <div className="text-sm">{row.name}</div>,
            sortable: false,
        },
        {
            name: 'Mô tả',
            selector: (row) => <div className="text-sm">{row.description}</div>,
            sortable: false,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button className="btn btn-outline btn-error mx-2" onClick={() => handleDelete(row.id)}>
                        <Trash />
                    </button>
                    <button
                        className="btn btn-outline btn-success m-2"
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
        <div className="mx-10 my-10">
            {isLoading ? <Loading></Loading> : <></>}
            <dialog id="dialog" className="modal">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-2xl text-center">Bộ sưu tập</h3>
                    <form className="my-2" onSubmit={formik.handleSubmit}>
                        <div onClick={closeDialog} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            X
                        </div>
                        <div className="text-center space-x-10">
                            <div>
                                <FormInput
                                    type="text"
                                    label="Tên Bộ sưu tập"
                                    name="name"
                                    value={formik.values.name}
                                    placeholder="Nhập tên bộ sưu tập..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.name && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.name}</span>
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
            <div className="container">
                <DataTable
                    title="QUẢN LÝ BỘ SƯU TẬP FNEST"
                    fixedHeader
                    fixedHeaderScrollHeight="550px"
                    direction="auto"
                    responsive
                    pagination
                    columns={columns}
                    data={filteredItems}
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
        </div>
    );
};

export default CollectionSManagement;

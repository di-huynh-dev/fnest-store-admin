import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { SortAsc, FolderEdit, Trash } from 'lucide-react';
import { FormInput, SubmitButton } from '../components';
import { Form, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import collectionServices from '../services/collectionServices';
import { useSelector, useDispatch } from 'react-redux';
import { BsSearchHeart } from 'react-icons/bs';
import { getAllCollectionsSuccess } from '../features/collectionSlice';

const CollectionSManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.login?.token);
    const data = useSelector((state) => state.collection.collection?.currentCollection);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
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

    const resetForm = () => {
        setIdCollection(null);
        setIsUpdateMode(false);
    };

    //Get
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            const getCollections = async () => {
                try {
                    const resp = await collectionServices.getAllCollections(token);
                    dispatch(getAllCollectionsSuccess(resp.data));
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
        try {
            const resp = await collectionServices.deleteCollection(token, id);
            if (resp.messages && resp.messages.length > 0) {
                toast.success(resp.messages[0]);
                const updatedData = await collectionServices.getAllCollections(token);
                dispatch(getAllCollectionsSuccess(updatedData.data));
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
        if (isUpdateMode) {
            if (idCollection) {
                try {
                    const resp = await collectionServices.updateCollection(token, idCollection, values.name);
                    document.getElementById('dialog').close();
                    toast.success(resp.messages[0]);
                    // After a successful update, fetch the latest data and update the state
                    const updatedData = await collectionServices.getAllCollections(token);
                    dispatch(getAllCollectionsSuccess(updatedData.data));
                    resetForm();
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
                const resp = await collectionServices.addCollection(token, values.name);
                if (resp.messages && resp.messages.length > 0) {
                    toast.success(resp.messages[0]);
                    const updatedData = await collectionServices.getAllCollections(token);
                    dispatch(getAllCollectionsSuccess(updatedData.data));
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
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Vui lòng nhập thông tin!'),
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
            name: 'Tên bộ sưu tập',
            selector: (row) => <div className="text-sm">{row.name}</div>,
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
        <div className="mx-20 my-10">
            <dialog id="dialog" className="modal">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-2xl text-center">Bộ sưu tập</h3>
                    <form className="my-2" onSubmit={formik.handleSubmit}>
                        <div
                            onClick={() => {
                                document.getElementById('dialog').close();
                                resetForm;
                            }}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            X
                        </div>
                        <div className="flex items-center text-center space-x-10">
                            <div>
                                <FormInput
                                    type="text"
                                    label="Tên Bộ sưu tập"
                                    name="name"
                                    placeholder="Nhập tên bộ sưu tập..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.name && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.name}</span>
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
            />
        </div>
    );
};

export default CollectionSManagement;

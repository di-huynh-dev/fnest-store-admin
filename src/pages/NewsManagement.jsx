import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { FolderEdit, Trash } from 'lucide-react';
import { FormInput, SubmitButton, Loading, TableLoader } from '../components';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import newsService from '../services/newsService';
import { useSelector } from 'react-redux';

const NewsManagement = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.loginAdmin?.token);
    const [data, setData] = useState([]);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pending, setPending] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/admin/auth/login');
        } else {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const resp = await newsService.getAllNews(token);
            setData(resp.data);
            setPending(false);
        } catch (error) {
            console.log(error);
        }
    };
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div className="grid my-2">
                <div className="flex items-center mx-5">
                    <button
                        className="btn bg-primary btn-ghost text-white"
                        onClick={() => {
                            setIsUpdateMode(false);
                            document.getElementById('dialog').showModal();
                        }}
                    >
                        + Thêm bài đăng
                    </button>
                </div>
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    const closeDialog = () => {
        document.getElementById('dialog').close();
        setIsUpdateMode(false);
        setSelectedPostId('');
        formik.resetForm();
    };

    const handleUpdate = (id) => {
        setSelectedPostId(id);
        setIsUpdateMode(true);
        document.getElementById('dialog').showModal();
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            const resp = await newsService.deletePost(token, id);
            setIsLoading(false);
            if (resp.messages && resp.messages.length > 0) {
                toast.success(resp.messages[0]);
                fetchData();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.messages) {
                const errorMessages = error.response.data.messages;
                setIsLoading(false);
                toast.error(errorMessages.join(', '));
            } else {
                toast.error('Có lỗi xảy ra.');
            }
        }
    };
    const handleSubmit = async (values) => {
        setIsLoading(true);
        if (isUpdateMode) {
            if (selectedPostId) {
                try {
                    closeDialog();
                    const formData = new FormData();
                    formData.append('title', values.title);
                    formData.append('description', values.description);
                    for (let i = 0; i < values.images.length; i++) {
                        formData.append('banners', values.images[i]);
                    }
                    const resp = await newsService.updatePost(token, selectedPostId, formData);
                    if (resp.messages && resp.messages.length > 0) {
                        setIsLoading(false);
                        toast.success(resp.messages[0]);
                        fetchData();
                    }
                } catch (error) {
                    setIsLoading(false);
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
                formData.append('title', values.title);
                formData.append('description', values.description);
                for (let i = 0; i < values.images.length; i++) {
                    formData.append('banners', values.images[i]);
                }
                const resp = await newsService.addPost(token, formData);
                if (resp.messages && resp.messages.length > 0) {
                    setIsLoading(false);
                    toast.success(resp.messages[0]);
                    fetchData();
                }
            } catch (error) {
                setIsLoading(false);
                if (error.response && error.response.data && error.response.data.messages) {
                    const errorMessages = error.response.data.messages;
                    toast.error(errorMessages.join(', '));
                } else {
                    toast.error('Có lỗi xảy ra.');
                }
            }
        }
    };
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            images: [],
        },
        validationSchema: isUpdateMode
            ? Yup.object({
                  description: Yup.string().required('Vui lòng nhập thông tin!'),
              })
            : Yup.object({
                  description: Yup.string().required('Vui lòng nhập thông tin!'),
                  images: Yup.mixed().required('Vui lòng tải lên hình ảnh!'),
              }),
        onSubmit: handleSubmit,
    });

    const ExpandedComponent = ({ data }) => {
        return (
            <div className="mx-20">
                <div className="mb-2">
                    <strong>ID:</strong> {data.id}
                </div>
                <div className="mb-2">
                    <strong>Hình ảnh:</strong>
                    <div className="flex">
                        {data.banners.map((image, index) => (
                            <img key={index} src={image} className="w-20 h-20" alt={`Product ${index + 1}`} />
                        ))}
                    </div>
                </div>
                <div className="mb-2">
                    <strong>Tiêu đề:</strong> <div className="text-sm">{data.title}</div>
                </div>
                <div className="mb-2">
                    <strong>Mô tả:</strong> <div className="text-sm">{data.description}</div>
                </div>
            </div>
        );
    };

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            width: '60px',
        },
        {
            name: 'Hình ảnh',
            cell: (row) => (
                <div className="flex items-center">
                    {row.banners.map((banner, index) => (
                        <img key={index} src={banner} alt="" className="w-14 h-14 my-2" />
                    ))}
                </div>
            ),
            sortable: false,
            width: '100px',
        },
        {
            name: 'Tiêu đề',
            selector: (row) => row.title,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Nội dung',
            selector: (row) => <div>{row.description}</div>,
            sortable: false,
            width: '700px',
        },
        {
            name: '',
            cell: (row) => (
                <>
                    <button
                        className="btn btn-outline btn-success m-2"
                        onClick={() => {
                            handleUpdate(row.id);
                        }}
                    >
                        <FolderEdit />
                    </button>
                    <button className="btn btn-outline btn-error mx-2" onClick={() => handleDelete(row.id)}>
                        <Trash />
                    </button>
                </>
            ),
            width: '100px',
        },
    ];
    return (
        <div className="m-10">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <dialog id="dialog" className="modal">
                        <div className="modal-box max-w-2xl">
                            <h3 className="font-bold text-2xl text-center">THƯƠNG HIỆU</h3>
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
                                            label="Tiêu đề"
                                            name="title"
                                            value={formik.values.title}
                                            placeholder="Nhập tiêu đề.."
                                            onchange={formik.handleChange}
                                        />
                                        {formik.errors.title && (
                                            <span className="text-error text-sm p-1 ">{formik.errors.title}</span>
                                        )}
                                        <FormInput
                                            type="text"
                                            label="Nội dung"
                                            name="description"
                                            value={formik.values.description}
                                            placeholder="Nhập tên thương hiệu..."
                                            onchange={formik.handleChange}
                                        />
                                        {formik.errors.description && (
                                            <span className="text-error text-sm p-1 ">{formik.errors.description}</span>
                                        )}
                                        <FormInput
                                            type="file"
                                            label="Hình ảnh"
                                            name="images"
                                            multiple="true"
                                            onchange={(e) => formik.setFieldValue('images', e.target.files)}
                                        />
                                        {formik.errors.images && (
                                            <p className="text-error text-sm p-1">{formik.errors.images}</p>
                                        )}
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
                            title="QUẢN LÝ BÀI ĐĂNG"
                            fixedHeader
                            fixedHeaderScrollHeight="550px"
                            direction="auto"
                            responsive
                            pagination
                            columns={columns}
                            data={data}
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
                    </div>
                </>
            )}
        </div>
    );
};

export default NewsManagement;

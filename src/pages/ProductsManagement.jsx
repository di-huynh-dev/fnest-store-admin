import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { SubmitButton, FormInput, Loading } from '../components';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import productServices from '../services/productServices';
import { FolderEdit, Trash } from 'lucide-react';
import { PiTargetLight } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import { BsSearchHeart } from 'react-icons/bs';
import PreviewImage from '../utils/helpers';

const ProductsManagement = () => {
    const categoryList = useSelector((state) => state.category.category?.currentCategory);
    const collectionList = useSelector((state) => state.collection.collection?.currentCollection);

    const token = useSelector((state) => state.auth.login?.token);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [isUpdateMode, setIsUpdateMode] = useState(false);
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
                        + Thêm sản phẩm
                    </button>
                </div>
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    const resetForm = () => {
        setSelectedProductId(null);
        setIsUpdateMode(false);
    };

    const handleUpdate = (id) => {
        setSelectedProductId(id);
        setIsUpdateMode(true);
        document.getElementById('dialog').showModal();
    };
    const navigate = useNavigate();

    // Define handleDelete function
    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            const resp = await productServices.deleteProduct(token, id);
            setIsLoading(false);
            if (resp.messages && resp.messages.length > 0) {
                toast.success(resp.messages[0]);
                const updatedData = await productServices.getAllProducts(token);
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
            const getProducts = async () => {
                try {
                    const respPro = await productServices.getAllProducts(token);
                    setData(respPro.data);
                } catch (error) {
                    console.log(error);
                }
            };
            getProducts();
        }
    }, [token, navigate]);

    // Form submission handler
    const handleSubmit = async (values) => {
        if (isUpdateMode) {
            if (selectedProductId) {
                try {
                    const formData = new FormData();
                    formData.append('name', values.name);
                    formData.append('image', values.file);

                    const resp = await productServices.getAllProducts(token);
                    document.getElementById('dialog').close();
                    toast.success(resp.messages[0]);
                    // After a successful update, fetch the latest data and update the state
                    const updatedData = await categoryServices.getAllCategories(token);
                    setData(updatedData.data);
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
            setIsLoading(true);
            try {
                document.getElementById('dialog').close();
                const productInfo = {
                    name: values.name,
                    price: values.price,
                    salePrice: values.salePrice,
                    description: values.description,
                    size: values.size,
                    material: values.material,
                    inStock: values.inStock,
                    featured: values.featured,
                    categoryId: values.categoryId,
                    collectionId: values.collectionId,
                };

                const json = JSON.stringify(productInfo);
                const blob = new Blob([json], {
                    type: 'application/json',
                });
                var formData = new FormData();

                formData.append('info', blob);
                formData.append('thumbnail', values.thumbnail);
                for (let i = 0; i < values.images.length; i++) {
                    formData.append('images', values.images[i]);
                }
                const resp = await productServices.addProduct(token, formData);
                setIsLoading(false);

                if (resp.messages && resp.messages.length > 0) {
                    toast.success(resp.messages[0]);
                    const updatedData = await productServices.getAllProducts(token);
                    setData(updatedData.data);
                    document.getElementById('dialog').close();
                    resetForm();
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
            thumbnail: '',
            images: [],
            price: '',
            salePrice: '',
            description: '',
            size: '',
            material: '',
            inStock: '',
            featured: false,
            categoryId: '',
            collectionId: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Vui lòng nhập thông tin!'),
            thumbnail: Yup.mixed().required('Vui lòng tải lên hình ảnh!'),
            images: Yup.mixed().required('Vui lòng tải lên hình ảnh!'),
            price: Yup.string().required('Vui lòng nhập thông tin!'),
            salePrice: Yup.string().required('Vui lòng nhập thông tin!'),
            description: Yup.string().required('Vui lòng nhập thông tin!'),
            size: Yup.string().required('Vui lòng nhập thông tin!'),
            material: Yup.string().required('Vui lòng nhập thông tin!'),
            inStock: Yup.string().required('Vui lòng nhập thông tin!'),
            featured: Yup.boolean().required('Vui lòng nhập thông tin!'),
        }),
        onSubmit: handleSubmit,
    });

    const ExpandedComponent = ({ data }) => {
        return (
            <div>
                <div className="flex m-2">
                    {data.imageUrls.map((imageUrl, index) => (
                        <div key={index}>
                            <img src={imageUrl} alt={`Product Image ${index}`} className="w-[50px] m-4 h-[50px]" />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: 'Hình ảnh',
            selector: (row) => <img src={row.thumbnail} className="w-14 h-14 my-2"></img>,
            sortable: false,
        },
        {
            name: 'Tên sản phẩm',
            selector: (row) => <div className="text-sm">{row.name}</div>,
            sortable: false,
        },
        {
            name: 'Giá',
            selector: (row) => <div className="text-sm">{row.price}</div>,
            sortable: false,
        },
        {
            name: 'Kích thước',
            selector: (row) => <div className="text-sm">{row.size}</div>,
            sortable: false,
        },
        {
            name: 'Chất liệu',
            selector: (row) => <div className="text-sm">{row.material}</div>,
            sortable: false,
        },
        {
            name: 'Kho',
            selector: (row) =>
                row.inStock > 0 ? (
                    <>
                        <span className="text-sm px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                            {row.inStock}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-sm px-2 py-1 font-semibold leading-tight text-pink-700 bg-pink-100 rounded-full">
                            Hết hàng
                        </span>
                    </>
                ),
            sortable: false,
        },
        {
            name: 'Nổi bật',
            selector: (row) =>
                row.featured ? (
                    <>
                        <PiTargetLight className="w-[30px] h-[30px] text-primary" />
                    </>
                ) : (
                    <></>
                ),
            sortable: false,
        },
        {
            name: 'Danh mục',
            selector: (row) => <div className="text-sm">{row.categoryId}</div>,
            sortable: false,
        },
        {
            name: 'Bộ sưu tập',
            selector: (row) => <div className="text-sm">{row.collectionId}</div>,
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
        <div className="m-10">
            <div>
                {isLoading ? (
                    <>
                        <Loading></Loading>
                    </>
                ) : (
                    <></>
                )}
            </div>
            <dialog id="dialog" className="modal">
                <div className="modal-box max-w-6xl">
                    <h3 className="font-bold text-2xl text-center">Thêm Sản phẩm mới</h3>
                    <form className="" onSubmit={formik.handleSubmit}>
                        <div className="my-2 grid grid-cols-3 space-x-5">
                            <div
                                onClick={() => {
                                    document.getElementById('dialog').close();
                                    resetForm;
                                }}
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            >
                                X
                            </div>
                            <div className="space-x-10">
                                <div>
                                    <FormInput
                                        type="text"
                                        label="Tên sản phẩm"
                                        name="name"
                                        placeholder="Nhập tên sản phẩm..."
                                        onchange={formik.handleChange}
                                    />
                                    {formik.errors.name && (
                                        <span className="text-error text-sm p-1 ">{formik.errors.name}</span>
                                    )}
                                    <FormInput
                                        type="text"
                                        label="Chất liệu"
                                        name="material"
                                        placeholder="Chất liệu..."
                                        onchange={formik.handleChange}
                                    />
                                    {formik.errors.material && (
                                        <span className="text-error text-sm p-1 ">{formik.errors.material}</span>
                                    )}
                                    <FormInput
                                        type="text"
                                        label="Số lượng trong kho"
                                        name="inStock"
                                        placeholder="Số lượng còn..."
                                        onchange={formik.handleChange}
                                    />
                                    {formik.errors.inStock && (
                                        <span className="text-error text-sm p-1 ">{formik.errors.inStock}</span>
                                    )}
                                    <div className="my-4">
                                        <label className="block text-sm">Chọn Danh mục</label>
                                        <select
                                            name="categoryId" // Use the correct field name
                                            value={formik.values.categoryId}
                                            onChange={formik.handleChange} // Use formik.handleChange
                                            className="select select-bordered mt-1 p-2 rounded-md w-full"
                                        >
                                            <option value="">-- Chọn danh mục --</option>
                                            {categoryList.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {/* {selectedCategoryId === '' && (
                                            <p className="text-error text-sm p-1">Vui lòng chọn phòng!</p>
                                        )} */}
                                    </div>

                                    <FormInput
                                        type="file"
                                        label="Thumbnail"
                                        name="thumbnail"
                                        onchange={(e) => formik.setFieldValue('thumbnail', e.target.files[0])}
                                    />
                                    {formik.errors.thumbnail && (
                                        <p className="text-error text-sm p-1">{formik.errors.thumbnail}</p>
                                    )}
                                    {formik.values.thumbnail && <PreviewImage file={formik.values.thumbnail} />}
                                </div>
                            </div>
                            <div>
                                <FormInput
                                    type="text"
                                    label="Giá nhập"
                                    name="price"
                                    placeholder="Giá nhập..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.price && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.price}</span>
                                )}
                                <FormInput
                                    type="text"
                                    label="Kích thước"
                                    name="size"
                                    placeholder="Kích thước..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.size && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.size}</span>
                                )}
                                <FormInput
                                    type="checkbox"
                                    label="Nổi bật"
                                    name="featured"
                                    checked={formik.values.featured}
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.featured && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.featured}</span>
                                )}
                                <div className="my-4">
                                    <label className="block text-sm">Chọn Bộ sưu tập</label>
                                    <select
                                        name="collectionId" // Use the correct field name
                                        value={formik.values.collectionId}
                                        onChange={formik.handleChange} // Use formik.handleChange
                                        className="select select-bordered mt-1 p-2 rounded-md w-full"
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {collectionList.map((collection) => (
                                            <option key={collection.id} value={collection.id}>
                                                {collection.name}
                                            </option>
                                        ))}
                                    </select>
                                    {/* {selectedCategoryId === '' && (
                                            <p className="text-error text-sm p-1">Vui lòng chọn phòng!</p>
                                        )} */}
                                </div>
                            </div>
                            <div>
                                <FormInput
                                    type="text"
                                    label="Giá bán"
                                    name="salePrice"
                                    placeholder="Nhập giá sản phẩm..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.salePrice && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.salePrice}</span>
                                )}
                                <FormInput
                                    type="text"
                                    label="Mô tả sản phẩm"
                                    name="description"
                                    placeholder="Mô tả sản phẩm..."
                                    onchange={formik.handleChange}
                                />
                                {formik.errors.description && (
                                    <span className="text-error text-sm p-1 ">{formik.errors.description}</span>
                                )}
                                <FormInput
                                    type="file"
                                    label="Hình ảnh sản phẩm"
                                    name="images"
                                    multiple="true"
                                    onchange={(e) => formik.setFieldValue('images', e.target.files)}
                                />
                                {formik.errors.images && (
                                    <p className="text-error text-sm p-1">{formik.errors.images}</p>
                                )}
                                {/* {formik.values.images && <PreviewImage file={formik.values.images} />} */}
                            </div>
                        </div>
                        <div className="flex items-center mt-3 text-center justify-center">
                            <SubmitButton text={isUpdateMode ? 'Cập nhật' : 'Thêm'} color="primary" />
                        </div>
                    </form>
                </div>
            </dialog>
            <DataTable
                title="QUẢN LÝ DANH MỤC SẢN PHẨM FNEST"
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
                expandableRows
                expandableRowExpanded={(row) => row.defaultExpanded}
                expandableRowsComponent={ExpandedComponent}
                paginationResetDefaultPage={resetPaginationToggle}
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
            />
        </div>
    );
};

export default ProductsManagement;

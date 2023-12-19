import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { FolderEdit, Trash } from 'lucide-react';
import { FormInput, SubmitButton, Loading, TableLoader } from '../components';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import feedbackService from '../services/feedbackService';
import { useSelector, useDispatch } from 'react-redux';

const FeedbacksManagement = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.loginAdmin?.token);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pending, setPending] = useState(true);
    useEffect(() => {
        if (!token) {
            navigate('/admin/auth/login');
        } else {
            const fetchData = async () => {
                try {
                    const resp = await feedbackService.getAllFeedbacks(token);
                    setData(resp.data);
                    setPending(false);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
        }
    }, []);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filteredItems = data.filter(
        (item) => item.fullName && item.fullName.toLowerCase().includes(filterText.toLowerCase()),
    );

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <div className="my-2">
                <div className="relative">
                    <label className="input-group w-full">
                        <input
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder="Nhập tên..."
                            className="input input-bordered max-w-xs"
                        />
                    </label>
                </div>
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    const ExpandedComponent = ({ data }) => {
        return (
            <div className="mx-20">
                <div className="mb-2">
                    <strong>ID:</strong> {data.id}
                </div>
                <div className="mb-2">
                    <strong>Họ và tên:</strong>
                    {data.fullName}
                </div>
                <div className="mb-2">
                    <strong>Nội dung:</strong>
                    {data.content}
                </div>
            </div>
        );
    };

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Họ và tên',
            selector: (row) => row.fullName,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Nội dung',
            selector: (row) => <div>{row.content}</div>,
            sortable: false,
            width: '600px',
        },
    ];
    return (
        <div className="m-10">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div className="container">
                        <DataTable
                            title="QUẢN LÝ ĐÁNH GIÁ CỦA KHÁCH HÀNG"
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
                            expandableRows
                            progressPending={pending}
                            progressComponent={<TableLoader />}
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

export default FeedbacksManagement;

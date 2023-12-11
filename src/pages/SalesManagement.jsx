import { LineChart, BarChart, Loading } from '../components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import statisticServices from '../services/statisticServices';
import { MdTableRestaurant } from 'react-icons/md';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { BsCartCheck } from 'react-icons/bs';
import { BiUserPlus } from 'react-icons/bi';
import { formatPrice } from '../utils/helpers';

const SalesManagement = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.loginAdmin?.token);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const getCurrentMonth = () => {
        const currentDate = new Date();
        return currentDate.getMonth() + 1; // Adding 1 because months are zero-based
    };

    const getCurrentYear = () => {
        const currentYear = new Date().getFullYear();
        return currentYear;
    };

    const fetchAndUpdateData = (month, year) => {
        fetchData(month || getCurrentMonth(), year || getCurrentYear());
    };

    useEffect(() => {
        fetchAndUpdateData(selectedMonth, selectedYear);
    }, [token, selectedMonth, selectedYear]);

    const fetchData = async (selectedMonth, selectedYear) => {
        try {
            const resp = await statisticServices.getStatistic(token, selectedMonth, selectedYear);
            setData(resp.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="m-10">
                    <div className="flex items-center justify-end">
                        <select
                            className="select select-bordered w-full max-w-xs"
                            onChange={(e) => {
                                const selectedValue = parseInt(e.target.value);
                                setSelectedMonth(selectedValue);
                                fetchAndUpdateData(selectedValue);
                            }}
                            value={selectedMonth || ''}
                        >
                            <option disabled value="">
                                Tháng
                            </option>
                            {Array.from({ length: 12 }, (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                </option>
                            ))}
                        </select>
                        <select
                            className="select select-bordered max-w-xs"
                            onChange={(e) => {
                                const selectedYearValue = parseInt(e.target.value);
                                setSelectedYear(selectedYearValue);
                                fetchAndUpdateData(selectedMonth);
                            }}
                            value={selectedYear || ''}
                        >
                            <option disabled value="">
                                Năm
                            </option>
                            {Array.from({ length: 5 }, (_, index) => (
                                <option key={index + 2023} value={index + 2023}>
                                    {index + 2023}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-4 justify-around gap-2 my-5">
                        <div className="card card-side bg-base-100">
                            <div className="mx-2">
                                <div className="grid grid-cols-2 items-center space-x-10">
                                    <div>
                                        <h3>Tổng đơn</h3>
                                        <span className="text-3xl font-bold">{data.numOfOrderByMonth}</span>
                                    </div>
                                    <div className="flex justify-end">
                                        <BsCartCheck className="w-20 h-20 text-blue-400" />
                                    </div>
                                </div>
                                <div>Total price</div>
                            </div>
                        </div>
                        <div className="card card-side bg-base-100">
                            <div className="mx-2">
                                <div className="grid grid-cols-2 items-center space-x-10">
                                    <div>
                                        <h3>Tổng SP bán ra</h3>
                                        <span className="text-3xl font-bold">{data.soldProduct}</span>
                                    </div>
                                    <div className="flex justify-end">
                                        <MdTableRestaurant className="w-20 h-20 text-green-400" />
                                    </div>
                                </div>
                                <div>Total price</div>
                            </div>
                        </div>

                        <div className="card card-side bg-base-100 ">
                            <div className="mx-2">
                                <div className="grid grid-cols-2 items-center space-x-10">
                                    <div>
                                        <h3>Doanh thu</h3>
                                        <span className="text-3xl font-bold">{formatPrice(data.income)}</span>
                                    </div>
                                    <div className="flex justify-end">
                                        <AiOutlineDollarCircle className="w-20 h-20 text-yellow-400" />
                                    </div>
                                </div>
                                <div>Total price</div>
                            </div>
                        </div>
                        <div className="card card-side bg-base-100 ">
                            <div className="mx-2">
                                <div className="grid grid-cols-2 items-center space-x-10">
                                    <div>
                                        <h3>Tổng người dùng </h3>
                                        <span className="text-3xl font-bold">{data.numOfUser}</span>
                                    </div>
                                    <div className="flex justify-end">
                                        <BiUserPlus className="w-20 h-20 text-red-400" />
                                    </div>
                                </div>
                                <div>Total price</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="rounded-md border w-full py-4 justify-center bg-white">
                            <BarChart data={data} />
                        </div>
                        <div className="rounded-md border w-full py-4 justify-center bg-white">
                            <LineChart data={data} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SalesManagement;

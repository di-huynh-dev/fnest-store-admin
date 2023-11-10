import { AiOutlineDollarCircle } from 'react-icons/ai';
import { BsCartCheck } from 'react-icons/bs';
import { BiUserPlus } from 'react-icons/bi';
import { Chart, BarChart } from '../components';

const Landing = () => {
    return (
        <div className="m-20">
            <div className="flex justify-between">
                <div className="card card-side bg-base-100 hover:shadow-xl ease-in-out duration-300">
                    <div className="m-3">
                        <div className="grid grid-cols-2 items-center space-x-20">
                            <div>
                                <h3>Earnings</h3>
                                <span className="text-3xl font-bold">25.000.000</span>
                            </div>
                            <div className="flex justify-end">
                                <AiOutlineDollarCircle className="w-20 h-20 text-yellow-400" />
                            </div>
                        </div>
                        <div>Total price</div>
                    </div>
                </div>

                <div className="card card-side bg-base-100 hover:shadow-xl ease-in-out duration-300">
                    <div className="m-3">
                        <div className="grid grid-cols-2 items-center space-x-20">
                            <div>
                                <h3>Earnings</h3>
                                <span className="text-3xl font-bold">2550</span>
                            </div>
                            <div className="flex justify-end">
                                <BsCartCheck className="w-20 h-20 text-green-400" />
                            </div>
                        </div>
                        <div>Total price</div>
                    </div>
                </div>
                <div className="card card-side bg-base-100 hover:shadow-xl ease-in-out duration-300">
                    <div className="m-3">
                        <div className="grid grid-cols-2 items-center space-x-20">
                            <div>
                                <h3>Earnings</h3>
                                <span className="text-3xl font-bold">25.000.000</span>
                            </div>
                            <div className="flex justify-end">
                                <AiOutlineDollarCircle className="w-20 h-20 text-yellow-400" />
                            </div>
                        </div>
                        <div>Total price</div>
                    </div>
                </div>
                <div className="card card-side bg-base-100 hover:shadow-xl ease-in-out duration-300">
                    <div className="m-3">
                        <div className="grid grid-cols-2 items-center space-x-20">
                            <div>
                                <h3>Earnings</h3>
                                <span className="text-3xl font-bold">1002</span>
                            </div>
                            <div className="flex justify-end">
                                <BiUserPlus className="w-20 h-20 text-red-400" />
                            </div>
                        </div>
                        <div>Total price</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <div className="flex space-x-8  py-6 w-full ease-in-out  hover:shadow-xl duration-300">
                    <div className="flex flex-col rounded-md border w-full p-8 justify-center bg-white">
                        Expenses Graph
                        <Chart />
                    </div>
                </div>
                <div className="flex space-x-8 py-6 w-full ease-in-out duration-300 hover:shadow-xl">
                    <div className="flex flex-col rounded-md  border w-full p-8 justify-center bg-white">
                        Expenses Graph
                        <BarChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;

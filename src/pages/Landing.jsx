import { AiOutlineDollarCircle } from 'react-icons/ai';
import { BsCartCheck } from 'react-icons/bs';
import { BiUserPlus } from 'react-icons/bi';
const Landing = () => {
    return (
        <div className="align-element">
            <div className="flex space-x-5">
                <div className="card card-side bg-base-100 shadow-xl">
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
                <div className="card card-side bg-base-100 shadow-xl">
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
                <div className="card card-side bg-base-100 shadow-xl">
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
        </div>
    );
};

export default Landing;

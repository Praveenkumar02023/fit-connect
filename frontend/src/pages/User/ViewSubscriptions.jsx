import { FaArrowLeft, FaCalendarAlt, FaMoneyBill, FaReceipt } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ViewSubscriptions = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Your Subscriptions</h1>
        <button
          onClick={() => navigate('/user/subscriptions')}
          className="flex items-center text-blue-600 hover:underline font-medium"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>

      <p className="text-gray-500 mb-4">Manage your current and past trainer subscriptions easily.</p>

      {/* Active Subscriptions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">🔵 Active Subscriptions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FiUser className="text-blue-600 text-2xl" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Sarah Johnson</h3>
                  <p className="text-sm text-gray-500">Yoga & Pilates</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Active</span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <div className="flex items-center gap-2"><FaCalendarAlt /> Start Date:</div>
                <span className="font-medium">Jan 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2"><FaCalendarAlt /> End Date:</div>
                <span className="font-medium">Jul 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2"><FaMoneyBill /> Amount Paid:</div>
                <span className="font-medium">$299.99</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2"><FaReceipt /> Payment ID:</div>
                <span className="font-medium">PAY_789123456</span>
              </div>
            </div>

            <button className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg">
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Expired Subscriptions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">⚫ Expired Subscriptions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FiUser className="text-blue-600 text-2xl" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">David Wilson</h3>
                  <p className="text-sm text-gray-500">CrossFit</p>
                </div>
              </div>
              <span className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">Expired</span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <div className="flex items-center gap-2"><FaCalendarAlt /> Start Date:</div>
                <span className="font-medium">Jun 1, 2023</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2"><FaCalendarAlt /> End Date:</div>
                <span className="font-medium">Dec 1, 2023</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2"><FaMoneyBill /> Amount Paid:</div>
                <span className="font-medium">$449.99</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2"><FaReceipt /> Payment ID:</div>
                <span className="font-medium">PAY_654321987</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSubscriptions;

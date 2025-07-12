import { FaCalendarAlt, FaMoneyBill, FaReceipt } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';

const ViewSubscriptions = () => {
  return (
    <div className="h-full overflow-y-auto bg-[#f9fafb] px-4 py-6 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Your Subscriptions</h1>
          <p className="text-gray-500 mt-2">
            Manage your current and past trainer subscriptions easily.
          </p>
        </div>

        {/* Active Subscriptions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔵 Active Subscriptions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">⚫ Expired Subscriptions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
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
    </div>
  );
};

export default ViewSubscriptions;

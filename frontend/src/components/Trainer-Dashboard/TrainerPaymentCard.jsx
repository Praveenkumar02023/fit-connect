import { Calendar, CreditCard, Copy, User } from "lucide-react";
import React from "react";

const TrainerPaymentCard = ({
  title,
  clientName,
  date,
  amount,
  transactionId,
  method = "Stripe",
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(transactionId);
  };

  return (
    <div className="flex flex-col border border-gray-200 sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow hover:shadow-md transition gap-4">
      {/* Left Side */}
      <div className="space-y-2 w-full sm:w-auto">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        <p className="flex items-center text-sm text-gray-700">
          <User size={16} className="mr-2" /> Received from: {clientName}
        </p>

        <p className="flex items-center text-sm text-gray-700">
          <Calendar size={16} className="mr-2" />
          {new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>

        <div className="flex flex-wrap items-center text-sm text-gray-700">
          <CreditCard size={16} className="mr-2" />
          {method} &nbsp; Transaction ID:
          <span className="bg-gray-100 px-2 py-1 rounded text-gray-800 text-sm mx-2 break-words max-w-[150px] sm:max-w-none">
            {transactionId}
          </span>
          <Copy
            size={16}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={handleCopy}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="text-left sm:text-right space-y-2 sm:ml-auto">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          Received
        </span>

        <h3 className="text-xl font-bold text-gray-900">₹{amount}</h3>
        <p className="text-blue-600 text-sm font-medium flex items-center sm:justify-end">
          ✓ Received
        </p>
      </div>
    </div>
  );
};

export default TrainerPaymentCard;

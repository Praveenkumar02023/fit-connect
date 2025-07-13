import { Calendar, CreditCard, Copy, User } from "lucide-react";
import React from "react";

const PaymentCard = ({
  title,
  name,
  date,
  amount,
  transactionId,
  status = "Completed",
  method = "Stripe",
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(transactionId);
  };

  return (
    <div className="flex justify-between items-start bg-white p-6 rounded-xl shadow hover:shadow-md transition">
      {/* Left Side */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="flex items-center text-sm text-gray-700">
          <User size={16} className="mr-2" /> {name}
        </p>

        <p className="flex items-center text-sm text-gray-700">
          <Calendar size={16} className="mr-2" /> {new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>

        <p className="flex items-center text-sm text-gray-700">
          <CreditCard size={16} className="mr-2" />
          {method} &nbsp; Transaction ID:
          <span className="bg-gray-100 px-2 py-1 rounded text-gray-800 text-sm mx-2">
            {transactionId}
          </span>
          <Copy
            size={16}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={handleCopy}
          />
        </p>
      </div>

      {/* Right Side */}
      <div className="text-right space-y-2">
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
          {status}
        </span>

        <h3 className="text-xl font-bold text-gray-900">₹{amount}</h3>
        <p className="text-green-600 text-sm font-medium flex items-center justify-end">
          ✓ Paid
        </p>
      </div>
    </div>
  );
};

export default PaymentCard;

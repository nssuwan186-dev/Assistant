import React from 'react';
import { Transaction } from '../types';
import { formatDate } from '../utils/dateFormatter';

interface TransactionsTableProps {
  transactions: Transaction[];
  onDownloadReceipt: (transaction: Transaction) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, onDownloadReceipt }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-gray-800 mb-3">ธุรกรรมล่าสุด</h2>
      {transactions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">ยังไม่มีธุรกรรม</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">รหัสธุรกรรม</th>
                <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">ห้อง</th>
                <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">วันที่เช็คอิน</th>
                <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้เข้าพัก</th>
                <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">ยอดรวม (บาท)</th>
                <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">การชำระเงิน</th>
                <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">ออกใบเสร็จแล้ว</th>
                <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">วันที่ออก</th>
                <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">ออกโดย</th>
                <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-2 py-1 whitespace-nowrap text-[11px] font-medium text-gray-900">{transaction.id}</td>
                  <td className="px-2 py-1 whitespace-nowrap text-[11px] text-gray-500">{transaction.roomNumber}</td>
                  <td className="px-2 py-1 whitespace-nowrap text-[11px] text-gray-500">{formatDate(transaction.checkIn)}</td>
                  <td className="px-2 py-1 whitespace-nowrap text-[11px] text-gray-500">{transaction.guestName}</td>
                  <td className="px-2 py-1 whitespace-nowrap text-[11px] text-gray-500">{transaction.total.toLocaleString()}</td>
                  <td className="px-2 py-1 whitespace-nowrap text-xs">
                    <span className={`px-1.5 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full ${transaction.paymentStatus === 'ชำระแล้ว' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {transaction.paymentStatus}
                    </span>
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-xs">
                    <span className={`px-1.5 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full ${transaction.receiptIssued ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {transaction.receiptIssued ? 'ใช่' : 'ไม่'}
                    </span>
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-[11px] text-gray-500">{formatDate(transaction.issueDate)}</td>
                  <td className="px-2 py-1 whitespace-nowrap text-[11px] text-gray-500">{transaction.issuedBy || 'N/A'}</td>
                   <td className="px-2 py-1 whitespace-nowrap text-center text-xs">
                    {transaction.receiptIssued && (
                      <button
                        onClick={() => onDownloadReceipt(transaction)}
                        className="text-teal-600 hover:text-teal-800 transition-colors duration-150 font-medium"
                        aria-label={`Download receipt for transaction ${transaction.id}`}
                      >
                        ดาวน์โหลด
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
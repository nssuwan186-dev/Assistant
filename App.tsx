import React, { useState } from 'react';
import { Room, Transaction } from './types';
import Button from './components/Button';
import Header from './components/Header';
import RoomStatusCard from './components/RecipeCard'; // Repurposed from RecipeCard
import TransactionsTable from './components/AnalysisResult'; // Repurposed from AnalysisResult
import BookingForm from './components/BookingForm'; // New component for booking
import { analyzeDocumentImage } from './services/geminiService';
import Sidebar from './components/Sidebar';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { formatDate } from './utils/dateFormatter';


// --- Mock Data based on provided context ---
const generateRooms = (): Room[] => {
  const rooms: Room[] = [];
  // Building A
  for (let i = 101; i <= 111; i++) rooms.push({ number: `A${i}`, type: i > 108 ? 'Standard Twin' : 'Standard', price: i > 108 ? 500 : 400, status: 'ว่าง' });
  for (let i = 201; i <= 211; i++) rooms.push({ number: `A${i}`, type: 'Standard', price: 400, status: 'ว่าง' });
  // Building B
  for (let i = 101; i <= 111; i++) rooms.push({ number: `B${i}`, type: 'Standard', price: 400, status: 'ว่าง' });
  for (let i = 201; i <= 207; i++) rooms.push({ number: `B${i}`, type: 'Standard', price: 400, status: 'ว่าง' });
  
  // Make some rooms occupied for realism
  rooms[2].status = 'ไม่ว่าง';
  rooms[5].status = 'ไม่ว่าง';
  rooms[15].status = 'ไม่ว่าง';
  return rooms;
};

const initialTransactions: Transaction[] = [
  { id: 'VP01244', roomNumber: 'A103', checkIn: '2024-08-15', guestName: 'Somsri Jaidee', total: 400, paymentStatus: 'ชำระแล้ว', receiptIssued: false },
  { id: 'VP01245', roomNumber: 'A106', checkIn: '2024-08-15', guestName: 'John Doe', total: 500, paymentStatus: 'ชำระแล้ว', receiptIssued: true, issueDate: '2024-08-15', issuedBy: 'Admin' },
  { id: 'VP01246', roomNumber: 'B201', checkIn: '2024-08-16', guestName: 'Somchai Rakdee', total: 800, paymentStatus: 'ชำระแล้ว', receiptIssued: false },
  { id: 'VP01247', roomNumber: 'A205', checkIn: '2024-08-17', guestName: 'Jane Smith', total: 400, paymentStatus: 'รอดำเนินการ', receiptIssued: false },
];
// --- End of Mock Data ---

type View = 'Dashboard' | 'Room Management' | 'Transactions' | 'Reports' | 'Settings';

const App: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(() => generateRooms());
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roomTypeFilter, setRoomTypeFilter] = useState<'All' | 'Standard' | 'Standard Twin'>('All');
  const [activeView, setActiveView] = useState<View>('Dashboard');


  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleBookRoom = (bookingDetails: { guestName: string; roomType: 'Standard' | 'Standard Twin'; checkIn: string; checkOut: string }): void => {
      const { guestName, roomType, checkIn } = bookingDetails;
      
      const availableRoom = rooms.find(r => r.type === roomType && r.status === 'ว่าง');

      if (!availableRoom) {
          showFeedback(`ขออภัย ไม่พบห้องพักประเภท '${roomType}' ที่ว่าง`, 'error');
          return;
      }

      // Update room status
      setRooms(prevRooms => 
          prevRooms.map(r => 
              r.number === availableRoom.number ? { ...r, status: 'ไม่ว่าง' } : r
          )
      );

      // Create new transaction
      const newTransaction: Transaction = {
          id: `VP${Math.floor(10000 + Math.random() * 90000)}`, // Generate random ID
          roomNumber: availableRoom.number,
          checkIn: checkIn,
          guestName: guestName,
          total: availableRoom.price, // Assuming 1 night for simplicity
          paymentStatus: 'รอดำเนินการ',
          receiptIssued: false,
      };

      setTransactions(prev => [newTransaction, ...prev]);
      showFeedback(`จองห้องพักหมายเลข ${availableRoom.number} สำหรับคุณ ${guestName} สำเร็จ`);
  };


  const handleIssueSingleReceipt = () => {
    const transactionId = prompt("กรุณาป้อนรหัสธุรกรรมเพื่อออกใบเสร็จ (เช่น VP01244):");
    if (!transactionId) return;

    const transaction = transactions.find(t => t.id === transactionId);

    if (!transaction) {
      showFeedback(`ไม่พบรหัสธุรกรรม '${transactionId}'`, 'error');
      return;
    }
    if (transaction.receiptIssued) {
      showFeedback(`มีการออกใบเสร็จสำหรับรหัสธุรกรรม ${transactionId} ไปแล้ว`, 'error');
      return;
    }
    if (transaction.paymentStatus !== 'ชำระแล้ว') {
      showFeedback(`ไม่สามารถออกใบเสร็จสำหรับธุรกรรมที่สถานะการชำระเงินเป็น 'รอดำเนินการ'`, 'error');
      return;
    }
    
    if (!window.confirm(`คุณต้องการออกใบเสร็จสำหรับรหัสธุรกรรม ${transactionId} ใช่หรือไม่?`)) {
        return;
    }

    setIsProcessing(true);
    setFeedback(null);

    setTimeout(() => {
      setTransactions(prev => prev.map(t => t.id === transactionId ? { 
        ...t, 
        receiptIssued: true,
        issueDate: new Date().toISOString().split('T')[0],
        issuedBy: 'Admin' // Dummy user
      } : t));
      setIsProcessing(false);
      showFeedback(`ออกใบเสร็จสำหรับรหัสธุรกรรม ${transactionId} สำเร็จ`);
    }, 1500);
  };

  const handleBatchIssueReceipts = () => {
    if (!window.confirm("คุณต้องการออกใบเสร็จสำหรับธุรกรรมที่ชำระแล้วทั้งหมดใช่หรือไม่?")) {
        return;
    }

    setIsProcessing(true);
    setFeedback(null);
    
    setTimeout(() => {
      let successCount = 0;
      const failures: string[] = [];

      const updatedTransactions = transactions.map(t => {
        if (t.receiptIssued) {
          return t; // Already issued, skip
        }
        if (t.paymentStatus !== 'ชำระแล้ว') {
          failures.push(`${t.id}: การชำระเงินยังคงรอดำเนินการ`);
          return t; // Not paid, skip
        }

        successCount++;
        return {
          ...t,
          receiptIssued: true,
          issueDate: new Date().toISOString().split('T')[0],
          issuedBy: 'Admin'
        };
      });

      setTransactions(updatedTransactions);
      setIsProcessing(false);

      let feedbackMessage = `ดำเนินการเป็นชุดเสร็จสิ้น\nออกใบเสร็จสำเร็จ ${successCount} ฉบับ`;
      if (failures.length > 0) {
        feedbackMessage += `\n\nไม่สามารถออกใบเสร็จได้ ${failures.length} ฉบับ:\n- ${failures.join('\n- ')}`;
         showFeedback(feedbackMessage, 'error');
      } else {
        showFeedback(feedbackMessage);
      }

    }, 2500);
  };
  
  const handleDownloadReceipt = (transaction: Transaction) => {
    const receiptContent = `
ใบเสร็จรับเงิน / Receipt
==================================
โรงแรมวิภา / Vipat Hotel

รหัสธุรกรรม (Transaction ID): ${transaction.id}
ชื่อผู้เข้าพัก (Guest Name): ${transaction.guestName}
หมายเลขห้อง (Room Number): ${transaction.roomNumber}

วันที่เช็คอิน (Check-in Date): ${formatDate(transaction.checkIn)}
วันที่ออกใบเสร็จ (Issue Date): ${formatDate(transaction.issueDate)}
ออกโดย (Issued By): ${transaction.issuedBy || 'N/A'}
----------------------------------
ยอดรวม (Total): ${transaction.total.toLocaleString('en-US', { minimumFractionDigits: 2 })} บาท (THB)
สถานะการชำระเงิน (Payment Status): ${transaction.paymentStatus}
==================================

ขอบคุณที่ใช้บริการ
Thank you for your stay
    `;

    const blob = new Blob([receiptContent.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${transaction.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showFeedback(`กำลังดาวน์โหลดใบเสร็จสำหรับ ${transaction.id}`);
  };


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      showFeedback('กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง', 'error');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setFeedback(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Url = reader.result as string;
      setSelectedImage(base64Url);

      try {
        const base64Data = base64Url.split(',')[1];
        const result = await analyzeDocumentImage(base64Data, file.type);
        setAnalysisResult(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่รู้จักระหว่างการวิเคราะห์";
        showFeedback(errorMessage, 'error');
        setSelectedImage(null);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredRooms = rooms.filter(room => {
    if (roomTypeFilter === 'All') return true;
    return room.type === roomTypeFilter;
  });

  const AiAnalyzerSection = () => (
    <section className="bg-white p-3 rounded-lg shadow-lg w-full">
      <h2 className="text-lg font-bold text-gray-800 mb-1.5">เครื่องมือวิเคราะห์เอกสารด้วย AI</h2>
      <p className="text-gray-600 mb-3 text-xs">อัปโหลดใบแจ้งหนี้หรือใบเสร็จเพื่อรับการวิเคราะห์ด้วย AI</p>
      <div>
        <label htmlFor="file-upload" className={`cursor-pointer inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white ${isAnalyzing ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}>
          {isAnalyzing ? 'กำลังวิเคราะห์...' : 'อัปโหลดรูปภาพเอกสาร'}
        </label>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={isAnalyzing} />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {selectedImage && (
          <div className="w-full">
            <h3 className="text-base font-semibold text-gray-700 mb-2">ตัวอย่างรูปภาพ:</h3>
            <img src={selectedImage} alt="Document Preview" className="rounded-lg shadow-md max-h-80 w-auto" />
          </div>
        )}
        {selectedImage && (
          <div className="w-full">
            <h3 className="text-base font-semibold text-gray-700 mb-2">ผลการวิเคราะห์:</h3>
            {isAnalyzing && !analysisResult ? (
                <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center h-40">
                    <svg className="animate-spin h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-2 text-gray-600 text-sm">กำลังวิเคราะห์เอกสาร...</span>
                </div>
            ) : analysisResult ? (
                <pre className="bg-gray-100 p-3 rounded-lg text-xs text-gray-800 whitespace-pre-wrap font-sans overflow-x-auto max-h-80">
                    {analysisResult}
                </pre>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );

  const ReceiptActionsSection = () => (
    <section className="bg-white p-3 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-gray-800 mb-3">จัดการใบเสร็จ</h2>
      <div className="grid grid-cols-1 gap-3">
        <Button onClick={handleIssueSingleReceipt} disabled={isProcessing || isAnalyzing}>
          ออกใบเสร็จรายฉบับ
        </Button>
        <Button onClick={handleBatchIssueReceipts} isLoading={isProcessing} disabled={isAnalyzing}>
          ออกใบเสร็จเป็นชุด
        </Button>
      </div>
    </section>
  );

  const RoomStatusSection = () => (
    <section>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">ภาพรวมสถานะห้องพัก</h2>
        <div className="mt-2 flex justify-center items-center space-x-2" role="group" aria-label="ตัวกรองประเภทห้องพัก">
          <button onClick={() => setRoomTypeFilter('All')} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${roomTypeFilter === 'All' ? 'bg-teal-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-pressed={roomTypeFilter === 'All'}>
            ทั้งหมด
          </button>
          <button onClick={() => setRoomTypeFilter('Standard')} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${roomTypeFilter === 'Standard' ? 'bg-teal-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-pressed={roomTypeFilter === 'Standard'}>
            Standard
          </button>
          <button onClick={() => setRoomTypeFilter('Standard Twin')} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${roomTypeFilter === 'Standard Twin' ? 'bg-teal-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-pressed={roomTypeFilter === 'Standard Twin'}>
            Standard Twin
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-2">
        {filteredRooms.map(room => (
          <RoomStatusCard key={room.number} room={room} />
        ))}
      </div>
    </section>
  );

  const renderActiveView = () => {
    switch (activeView) {
        case 'Dashboard':
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-1 space-y-6">
                            <BookingForm onBookRoom={handleBookRoom} />
                            <ReceiptActionsSection />
                        </div>
                        <div className="lg:col-span-2">
                            <AiAnalyzerSection />
                        </div>
                    </div>
                    <TransactionsTable transactions={transactions} onDownloadReceipt={handleDownloadReceipt} />
                    <RoomStatusSection />
                </div>
            );
        case 'Room Management':
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-1">
                            <BookingForm onBookRoom={handleBookRoom} />
                        </div>
                    </div>
                    <RoomStatusSection />
                </div>
            );
        case 'Transactions':
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-1">
                            <ReceiptActionsSection />
                        </div>
                    </div>
                    <TransactionsTable transactions={transactions} onDownloadReceipt={handleDownloadReceipt} />
                </div>
            );
        case 'Reports':
            return <Reports />;
        case 'Settings':
            return <Settings />;
        default:
            return <div>Not Found</div>;
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
       <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="container mx-auto">
              <Header />

              {feedback && (
                <div className={`my-4 text-center p-2 rounded-md text-xs ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <pre className="whitespace-pre-wrap font-sans">{feedback.message}</pre>
                </div>
              )}

              <div className="mt-4">
                {renderActiveView()}
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
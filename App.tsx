

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

// --- Real Data from user-provided CSVs ---
const roomsCSV = `Room_Number,Room_Type,Price,Status
A101,Standard,400,ว่าง
A102,Standard,400,ว่าง
A103,Standard,400,ว่าง
A104,Standard,400,ว่าง
A105,Standard,400,ว่าง
A106,Standard Twin,500,ว่าง
A107,Standard Twin,500,ว่าง
A108,Standard Twin,500,ว่าง
A109,Standard Twin,500,ว่าง
A110,Standard Twin,500,ว่าง
A111,Standard,400,ว่าง
A201,Standard,400,ว่าง
A202,Standard,400,ว่าง
A203,Standard,400,ว่าง
A204,Standard,400,ว่าง
A205,Standard,400,ว่าง
A206,Standard,400,ว่าง
A207,Standard,400,ว่าง
A208,Standard,400,ว่าง
A209,Standard,400,ว่าง
A210,Standard,400,ว่าง
A211,Standard,400,ว่าง
B101,Standard,400,ว่าง
B102,Standard,400,ว่าง
B103,Standard,400,ว่าง
B104,Standard,400,ว่าง
B105,Standard,400,ว่าง
B106,Standard,400,ว่าง
B107,Standard,400,ว่าง
B108,Standard,400,ว่าง
B109,Standard,400,ว่าง
B110,Standard,400,ว่าง
B111,Standard Twin,500,ว่าง
B201,Standard,400,ว่าง
B202,Standard,400,ว่าง
B203,Standard,400,ว่าง
B204,Standard,400,ว่าง
B205,Standard,400,ว่าง
B206,Standard,400,ว่าง
B207,Standard,400,ว่าง
B208,Standard,400,ว่าง
B209,Standard,400,ว่าง
B210,Standard,400,ว่าง
B211,Standard,400,ว่าง
N1,Standard Twin,600,ว่าง
N2,Standard,500,ว่าง
N3,Standard,500,ว่าง
N4,Standard Twin,600,ว่าง
N5,Standard Twin,600,ว่าง
N6,Standard Twin,600,ว่าง
N7,Standard,500,ว่าง`;

const transactionsCSV = `ประจำเดือน,,,,,,,สิงหาคม,  2568,,,,
เลขที่ลำดับ,Transaction ID,ประเภทการชำระเงิน,  วันเวลา เข้ามาพัก,ห้องพักเลขที่,ชื่อตัวและชื่อสกุล,สัญชาติ, เลขประจำตัวประชาชนหรือ    ใบสำคัญประจำตัวคนต่างด้าว  หรือหนังสือเดินทาง   เลขที่....ออกให้โดย, ที่อยู่ปัจจุบัน               อยู่ที่ ตำบล อำเภอ    จังหวัด หรือประเทศใด,อาชีพ,มาจากตำบล อำเภอ จังหวัด หรือประเทศใด,จะไปตำบล อำเภอ จังหวัด หรือประเทศใด,วันเวลาที่ออกไป
1,VP01146,เงินสด,02 ส.ค. 68,A111,เซาวลิต,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,03 ส.ค. 68
2,VP01147,เงินโอน QR,02 ส.ค. 68,B107,เหนือฟ้า,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,03 ส.ค. 68
3,VP01148,เงินโอน QR,02 ส.ค. 68,B105,ทวีศักดิ์,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,03 ส.ค. 68
4,VP01149,เงินสด,03 ส.ค. 68,B106,สุริยันห์  ยิ่งลาท,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,04 ส.ค. 68
5,VP01150,เงินสด,03 ส.ค. 68,A105,วีระยุทธ  วีระกร,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,04 ส.ค. 68
6,VP01151,เงินสด,03 ส.ค. 68,A106,ดวงฤดี ธนพรรัชต์,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,04 ส.ค. 68
7,VP01152,เงินโอน QR,03 ส.ค. 68,B106,ณัฐวุฒิ โพธิ์สว่าง,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,04 ส.ค. 68
8,VP01153,เงินสด,03 ส.ค. 68,N3,อภิชาติ,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,04 ส.ค. 68
9,VP01154,เงินโอน QR,04 ส.ค. 68,B107,วุฒิชัย เศษรักษา,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,05 ส.ค. 68
10,VP01155,เงินโอน QR,04 ส.ค. 68,A101,ชัชพล หลวงชา,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,05 ส.ค. 68
11,VP01156,เงินโอน QR,04 ส.ค. 68,B102,คุณปอนด์,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,05 ส.ค. 68
12,VP01157,เงินสด,04 ส.ค. 68,A106,เพลง,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,05 ส.ค. 68
13,VP01158,เงินโอน QR,04 ส.ค. 68,A105,โสภณ,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,05 ส.ค. 68
14,VP01159,เงินโอน QR,04 ส.ค. 68,A104,บริษัท โชวี่,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,05 ส.ค. 68
15,VP01160,เงินสด,04 ส.ค. 68,N7,คุณส้ม,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,05 ส.ค. 68
16,VP01161,เงินสด,04 ส.ค. 68,B108,เต้,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,05 ส.ค. 68
17,VP01162,เงินสด,05 ส.ค. 68,B107,อธิวัฒน์ ยาทองไชย,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,06 ส.ค. 68
18,VP01163,เงินโอน QR,05 ส.ค. 68,B109,พัชรินทร์,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,06 ส.ค. 68
19,VP01164,เงินสด,05 ส.ค. 68,A105,ราชสีมา,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,06 ส.ค. 68
20,VP01165,เงินโอน QR,05 ส.ค. 68,B105,กำธร โพธิ์เสน,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,06 ส.ค. 68
21,VP01166,เงินโอน QR,06 ส.ค. 68,A103,คุณเป๊ก,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,07 ส.ค. 68
22,VP01167,เงินโอน QR,06 ส.ค. 68,N7,พิชิตชัย,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,07 ส.ค. 68
23,VP01168,เงินสด,06 ส.ค. 68,A106,คุณ พีระ ตรีบวรกุศล,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,07 ส.ค. 68
24,VP01169,เงินโอน QR,06 ส.ค. 68,A105,บรรเจิด หอยทอง,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,07 ส.ค. 68
25,VP01170,เงินโอน QR,07 ส.ค. 68,A104,สมภพ โชติวงษ์,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,08 ส.ค. 68
26,VP01171,เงินสด,07 ส.ค. 68,B106,คุณสุพัตรา,ไทย,-,-,รับจ้าง,ปากคาด,บึงกาฬ,08 ส.ค. 68
27,VP01172,เงินสด,07 ส.ค. 68,A105,ลุงเลียม,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,08 ส.ค. 68
28,VP01173,เงินสด,07 ส.ค. 68,B101,วิชิต,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,08 ส.ค. 68
29,VP01174,เงินโอน QR,07 ส.ค. 68,B109,น้องฟ้า,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,08 ส.ค. 68
30,VP01175,เงินสด,08 ส.ค. 68,B110,ธีรพงษ์,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,09 ส.ค. 68
31,VP01176,เงินโอน QR,08 ส.ค. 68,A105,คมกริช กุหลาบขาว,ไทย,-,-,รับจ้าง,กทม,บึงกาฬ,09 ส.ค. 68
32,VP01177,เงินโอน QR,08 ส.ค. 68,A107,คุณวัน,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,09 ส.ค. 68
33,VP01178,เงินโอน QR,08 ส.ค. 68,A106,สำเริง เดือนคล้อย,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,09 ส.ค. 68
34,VP01179,เงินสด,09 ส.ค. 68,A104,จิณิพงษ์ ละการชั่ว,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,10 ส.ค. 68
35,VP01180,เงินโอน QR,09 ส.ค. 68,B103,ธาราวุธ,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,10 ส.ค. 68
36,VP01181,เงินโอน QR,09 ส.ค. 68,B107,จีระเดช แข็งขัน,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,10 ส.ค. 68
37,VP01182,เงินสด,09 ส.ค. 68,B107,นายวิทยา ชัยระเทศ,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,10 ส.ค. 68
38,VP01183,เงินสด,09 ส.ค. 68,B109,ชญานิศ ชินใหม่,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,10 ส.ค. 68
39,VP01184,เงินสด,09 ส.ค. 68,B104,สุกัญญา,ไทย,-,-,รับจ้าง,นครปฐม,บึงกาฬ,10 ส.ค. 68
40,VP01185,เงินโอน QR,09 ส.ค. 68,B106,ชัยศักดิ์ อัดตละ,ไทย,-,-,รับจ้าง,นนทบุรี,บึงกาฬ,10 ส.ค. 68
41,VP01186,เงินสด,09 ส.ค. 68,N2,ภณัชกร,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,10 ส.ค. 68
42,VP01187,เงินโอน QR,09 ส.ค. 68,A106,ต่าย,ไทย,-,-,รับจ้าง,อุดรธานี,บึงกาฬ,10 ส.ค. 68
43,VP01188,เงินโอน QR,09 ส.ค. 68,B104,บริษัท ชัวร์ ฟิลเตอร์ (ประเทศไทย) จำกัด,ไทย,745546000078,30/160 หมู่ที่ 1 ถนนเจษฏาวิถี ตำบลโคกขาม อำเภอเมืองสมุทรสาคร จ.สมุทรสาคร 74000,รับจ้าง,บึงกาฬ,บึงกาฬ,10 ส.ค. 68
44,VP01189,เงินโอน QR,10 ส.ค. 68,N3,วิญญู,ไทย,-,-,รับจ้าง,อุดรธานี,บึงกาฬ,11 ส.ค. 68
45,VP01190,เงินสด,10 ส.ค. 68,B106,คุณสมบัติ,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,11 ส.ค. 68
46,VP01191,เงินโอน QR,10 ส.ค. 68,A104,สันติ ขอมกิ่ง,ไทย,-,-,รับจ้าง,อุดรธานี,บึงกาฬ,11 ส.ค. 68
47,VP01192,เงินโอน QR,10 ส.ค. 68,A105,มนัส,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,11 ส.ค. 68
48,VP01193,เงินสด,10 ส.ค. 68,A104,บริษัท ดี.เอช.เอ.สยามวาลา จำกัด,ไทย,105485000257,202 ถนนสุรวงศ์ แขวงสี่พระยา เขตบางรัก กรุงเทพมหานคร 10500,รับจ้าง,อุดรธานี,บึงกาฬ,11 ส.ค. 68
49,VP01194,เงินสด,10 ส.ค. 68,B105,บริษัท ไบโอ,ไทย,-,-,รับจ้าง,อุดรธานี,บึงกาฬ,11 ส.ค. 68
50,VP01195,เงินสด,10 ส.ค. 68,A108,ปณต โพธิ์สว่าง,ไทย,-,-,รับจ้าง,ปทุมธานี,บึงกาฬ,11 ส.ค. 68
51,VP01196,เงินโอน QR,10 ส.ค. 68,B106,สุจิตรา ธรรมเจริญ,ไทย,-,-,รับจ้าง,อุดรธานี,บึงกาฬ,11 ส.ค. 68
52,VP01197,เงินสด,10 ส.ค. 68,A105,ประนมไพร,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,11 ส.ค. 68
53,VP01198,เงินโอน QR,10 ส.ค. 68,B106,วินัย,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,11 ส.ค. 68
54,VP01199,เงินโอน QR,10 ส.ค. 68,A106,ชุตินันต์,ไทย,-,-,รับจ้าง,อุดรธานี,บึงกาฬ,11 ส.ค. 68
55,VP01200,เงินโอน QR,10 ส.ค. 68,A108,ธีรยุทธ,ไทย,1550700105640,-,รับจ้าง,อุดรธานี,บึงกาฬ,11 ส.ค. 68
56,VP01201,เงินสด,10 ส.ค. 68,B107,นมดูเม็ก,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,11 ส.ค. 68
57,VP01202,เงินโอน QR,11 ส.ค. 68,A103,วงศ์วรัญ นารถชัย,ไทย,-,-,รับจ้าง,บึงกาฬ,บึงกาฬ,12 ส.ค. 68
58,VP01203,เงินโอน QR,11 ส.ค. 68,B105,บริษัท เค เทคนิคเชี่ยน แอนด์ เซอร์วิส จำกัด    (สำนักงานใหญ่),ไทย,135557015433,124/208 หมู่ที่ 1 ตำบลบึงยี่โถ อำเภอธัญบุรี จ.ปทุมธานี 12130,รับจ้าง,บึงกาฬ,บึงกาฬ,12 ส.ค. 68
59,VP01204,เงินสด,11 ส.ค. 68,A105,บริษัท ห้าม้า โอสถ จำกัด,ไทย,105546034385,145/5 ซอยเฉลิมพระเกียรติ ร.9 ซ. 30 แขวงดอกไม้ เขตประเวศ กรุงเทพมหานคร 10250,รับจ้าง,กทม.,บึงกาฬ,12 ส.ค. 68
60,VP01205,เงินสด,11 ส.ค. 68,A111,ศราวุฒิ,ไทย,-,-,รับจ้าง,เลย,บึงกาฬ,12 ส.ค. 68`;

const parseThaiDate = (thaiDate: string): string => {
  if (!thaiDate || typeof thaiDate !== 'string') return new Date().toISOString().split('T')[0];
  const parts = thaiDate.trim().split(' ');
  if (parts.length < 3) return new Date().toISOString().split('T')[0];

  const day = parts[0];
  const monthStr = parts[1].replace('.', '');
  const yearBE = parseInt(parts[2], 10);
  
  // Assuming Buddhist Era (BE) year. The year 68 corresponds to 2568 BE which is 2025 AD.
  const yearCE = yearBE + 2568 - 68;

  const monthMap: { [key: string]: string } = {
    'ม.ค': '01', 'ก.พ': '02', 'มี.ค': '03', 'เม.ย': '04', 'พ.ค': '05', 'มิ.ย': '06',
    'ก.ค': '07', 'ส.ค': '08', 'ก.ย': '09', 'ต.ค': '10', 'พ.ย': '11', 'ธ.ค': '12'
  };
  const month = monthMap[monthStr];
  if (!month) return new Date().toISOString().split('T')[0];

  return `${yearCE}-${month}-${String(day).padStart(2, '0')}`;
};


const loadInitialData = (): { rooms: Room[]; transactions: Transaction[] } => {
  const parsedRooms: Room[] = roomsCSV
    .split('\n')
    .slice(1)
    // FIX: Add explicit return type `Room | null` to the map callback to prevent TypeScript
    // from widening the `status` literal type to `string`, ensuring type compatibility with the `Room` interface.
    .map((line): Room | null => {
      const [number, type, priceStr] = line.split(',');
      if (!number || !type || !priceStr) return null;
      return {
        number: number.trim(),
        type: type.trim() as 'Standard' | 'Standard Twin',
        price: parseInt(priceStr.trim(), 10),
        status: 'ว่าง', // Default to available, will update based on transactions
      };
    })
    .filter((r): r is Room => r !== null);

  const roomPriceMap = new Map<string, number>(parsedRooms.map(r => [r.number, r.price]));

  const parsedTransactions: Transaction[] = transactionsCSV
    .split('\n')
    .slice(2)
    // FIX: Add explicit return type `Transaction | null` to the map callback. This ensures
    // the returned object conforms to the `Transaction` interface, specifically preventing
    // the `paymentStatus` literal from being widened to a generic `string`.
    .map((line, index): Transaction | null => {
      const columns = line.split(',');
      const id = columns[1]?.trim();
      const checkInDateStr = columns[3]?.trim();
      const roomNumber = columns[4]?.trim();
      const guestName = columns[5]?.trim();

      if (!id || !checkInDateStr || !roomNumber || !guestName) return null;

      const total = roomPriceMap.get(roomNumber) || 0;

      return {
        id,
        roomNumber,
        checkIn: parseThaiDate(checkInDateStr),
        guestName,
        total,
        paymentStatus: 'ชำระแล้ว',
        receiptIssued: index < 3, // Set first few as issued for demonstration
        issueDate: index < 3 ? '2025-08-18' : undefined,
        issuedBy: index < 3 ? 'System' : undefined,
      };
    })
    .filter((t): t is Transaction => t !== null);
    
  // Update room statuses based on transaction data
  const occupiedRooms = new Set(parsedTransactions.map(t => t.roomNumber));
  const updatedRooms = parsedRooms.map(r => 
      occupiedRooms.has(r.number) ? { ...r, status: 'ไม่ว่าง' } : r
  );

  return { rooms: updatedRooms, transactions: parsedTransactions.reverse() }; // Reverse to show most recent first
};

// --- End of Data Loading ---

type View = 'Dashboard' | 'Room Management' | 'Transactions' | 'Reports' | 'Settings';

const App: React.FC = () => {
  const [initialData] = useState(() => loadInitialData());
  const [rooms, setRooms] = useState<Room[]>(initialData.rooms);
  const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions);
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
          issueDate: new Date().toISOString().split('T')[0],
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
        issueDate: t.issueDate || new Date().toISOString().split('T')[0],
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
          issueDate: t.issueDate || new Date().toISOString().split('T')[0],
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
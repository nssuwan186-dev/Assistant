export interface Room {
  number: string;
  type: 'Standard' | 'Standard Twin';
  status: 'ว่าง' | 'ไม่ว่าง'; // Thai for Available | Occupied
  price: number;
}

export interface Transaction {
  id: string;
  roomNumber: string;
  checkIn: string;
  guestName: string;
  total: number;
  paymentStatus: 'ชำระแล้ว' | 'รอดำเนินการ';
  receiptIssued: boolean;
  issueDate?: string;
  issuedBy?: string;
}
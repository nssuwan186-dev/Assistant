import React, { useState, useEffect } from 'react';
import Button from './Button';

interface BookingFormProps {
    onBookRoom: (details: {
        guestName: string;
        roomType: 'Standard' | 'Standard Twin';
        checkIn: string;
        checkOut: string;
    }) => void;
}

interface FormErrors {
    guestName?: string;
    checkIn?: string;
    checkOut?: string;
}

const GUEST_NAME_STORAGE_KEY = 'vipat-hotel-guest-name';

const BookingForm: React.FC<BookingFormProps> = ({ onBookRoom }) => {
    const [guestName, setGuestName] = useState('');
    const [roomType, setRoomType] = useState<'Standard' | 'Standard Twin'>('Standard');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        const savedGuestName = localStorage.getItem(GUEST_NAME_STORAGE_KEY);
        if (savedGuestName) {
            setGuestName(savedGuestName);
        }
    }, []);
    
    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        const trimmedGuestName = guestName.trim();

        if (!trimmedGuestName) {
            newErrors.guestName = 'กรุณากรอกชื่อผู้เข้าพัก';
        }
        if (!checkIn) {
            newErrors.checkIn = 'กรุณาระบุวันที่เช็คอิน';
        }
        if (!checkOut) {
            newErrors.checkOut = 'กรุณาระบุวันที่เช็คเอาท์';
        } else if (checkIn && new Date(checkOut) <= new Date(checkIn)) {
            newErrors.checkOut = 'วันที่เช็คเอาท์ต้องอยู่หลังวันที่เช็คอิน';
        }
        return newErrors;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validateForm();
        
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        setErrors({}); // Clear errors before submission
        const trimmedGuestName = guestName.trim();
        onBookRoom({ guestName: trimmedGuestName, roomType, checkIn, checkOut });
        
        // Save guest name to localStorage on successful submission
        localStorage.setItem(GUEST_NAME_STORAGE_KEY, trimmedGuestName);

        // Reset form fields except for guest name for convenience
        setRoomType('Standard');
        setCheckIn('');
        setCheckOut('');
    };

    return (
        <section className="bg-white p-3 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-3">จองห้องพัก</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label htmlFor="guestName" className="block text-xs font-medium text-gray-700">ชื่อผู้เข้าพัก</label>
                    <input
                        type="text"
                        id="guestName"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className={`mt-1 block w-full px-2 py-1.5 bg-white border ${errors.guestName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm`}
                        placeholder="ตัวอย่าง: สมชาย ใจดี"
                        aria-invalid={!!errors.guestName}
                        aria-describedby={errors.guestName ? "guestName-error" : undefined}
                    />
                    {errors.guestName && (
                        <p id="guestName-error" className="mt-1 flex items-center text-xs text-red-600">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 mr-1 flex-shrink-0">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5ZM8 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                            </svg>
                            {errors.guestName}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="roomType" className="block text-xs font-medium text-gray-700">ประเภทห้องพัก</label>
                    <select
                        id="roomType"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value as 'Standard' | 'Standard Twin')}
                        className="mt-1 block w-full pl-2 pr-8 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md"
                    >
                        <option>Standard</option>
                        <option>Standard Twin</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="checkIn" className="block text-xs font-medium text-gray-700">เช็คอิน</label>
                        <input
                            type="date"
                            id="checkIn"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className={`mt-1 block w-full px-2 py-1.5 bg-white border ${errors.checkIn ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm`}
                             aria-invalid={!!errors.checkIn}
                             aria-describedby={errors.checkIn ? "checkIn-error" : undefined}
                        />
                         {errors.checkIn && (
                            <p id="checkIn-error" className="mt-1 flex items-center text-xs text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 mr-1 flex-shrink-0">
                                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5ZM8 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                                </svg>
                                {errors.checkIn}
                            </p>
                         )}
                    </div>
                    <div>
                        <label htmlFor="checkOut" className="block text-xs font-medium text-gray-700">เช็คเอาท์</label>
                        <input
                            type="date"
                            id="checkOut"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className={`mt-1 block w-full px-2 py-1.5 bg-white border ${errors.checkOut ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm`}
                            aria-invalid={!!errors.checkOut}
                            aria-describedby={errors.checkOut ? "checkOut-error" : undefined}
                        />
                        {errors.checkOut && (
                            <p id="checkOut-error" className="mt-1 flex items-center text-xs text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 mr-1 flex-shrink-0">
                                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5ZM8 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                                </svg>
                                {errors.checkOut}
                            </p>
                        )}
                    </div>
                </div>

                <Button type="submit">
                    ค้นหาและจองห้องพัก
                </Button>
            </form>
        </section>
    );
};

export default BookingForm;

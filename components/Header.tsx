import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-2 mb-2">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
        Vipat Hotel <span className="text-teal-600">แดชบอร์ดจัดการ</span>
      </h1>
      <p className="mt-1 text-sm text-gray-500 max-w-2xl mx-auto">
        ดูแลสถานะห้องพัก จัดการธุรกรรม และออกใบเสร็จได้อย่างง่ายดาย
      </p>
    </header>
  );
};

export default Header;

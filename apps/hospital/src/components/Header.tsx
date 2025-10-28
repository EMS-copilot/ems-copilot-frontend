import React from 'react';

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">EMS Copilot Korea</h1>
          <p className="text-sm text-gray-600">응급의료서비스 지원 시스템</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-400">
          <div className="w-full h-full bg-linear-to-br from-gray-400 to-gray-500"></div>
        </div>
      </div>
    </header>
  );
}
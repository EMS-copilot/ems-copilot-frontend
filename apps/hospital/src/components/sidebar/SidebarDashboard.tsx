import React from 'react';
import HospitalCardDashboard from './HospitalCardDashboard';
import RealtimeStats from './RealtimeStats';
import CapacityAndContacts from './CapacityAndContacts';

export default function SidebarDashboard() {
  return (
    <div className="col-span-3 space-y-6">
      <HospitalCardDashboard />
      <RealtimeStats />
      <CapacityAndContacts />
    </div>
  );
}

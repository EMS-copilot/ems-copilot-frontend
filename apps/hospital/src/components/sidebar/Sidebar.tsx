import React from 'react';
import HospitalCard from './HospitalCard';
import RealtimeStats from './RealtimeStats';
import CapacityAndContacts from './CapacityAndContacts';


export default function Sidebar() {
  return (
    <div className="col-span-3 space-y-6">
      <HospitalCard />
      <RealtimeStats />
      <CapacityAndContacts />
    </div>
  );
}
import React from 'react';
import { User, Clipboard, Activity, Phone } from 'lucide-react';
import HospitalCard from './sidebar/HospitalCard';
import RealtimeStats from './sidebar/RealtimeStats';
import DepartmentStats from './sidebar/DepartmentStats';
import EmergencyContacts from './sidebar/EmergencyContacts';

export default function Sidebar() {
  return (
    <div className="col-span-3 space-y-6">
      <HospitalCard />
      <RealtimeStats />
      <DepartmentStats />
      <EmergencyContacts />
    </div>
  );
}
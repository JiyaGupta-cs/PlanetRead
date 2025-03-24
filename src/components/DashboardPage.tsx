"use client";
import SignOut from "@/components/SignOutButton";
import Navbar from "@/components/Navbar";
import SearchInput from "@/components/SearchInput";
import { useState } from "react";
import { Device } from "@/utils/types";
import { TabletSmartphone, View, Timer } from "lucide-react";
import Link from "next/link";

interface DashboardPageProps {
  devices: Device[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ devices }) => {
  const [filteredDevices, setFilteredDevices] = useState(devices);

  const handleSearch = (query: string) => {
    const filtered = devices.filter((device) =>
      device.id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDevices(filtered);
  };

  return (
    <div className="h-screen bg-[#ECE6F0] flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-y-auto py-8 px-24">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center justify-center p-6 gap-1 bg-white rounded-md flex-col">
            <TabletSmartphone color={"purple"} size={35} />
            <p className="text-black text-2xl font-black">{devices.length}</p>
            <p className="text-gray-600 text-sm">Total Devices</p>
          </div>
          {/* <div className="flex items-center justify-center p-6 gap-1 bg-white rounded-md flex-col">
            <View color={"purple"} size={35} />
            <p className="text-black text-xl font-black">_</p>
            <p className="text-gray-600 text-sm">Total Views</p>
          </div>
          <div className="flex items-center justify-center p-6 gap-1 bg-white rounded-md flex-col">
            <Timer color={"purple"} size={35} />
            <p className="text-black text-xl font-black">_</p>
            <p className="text-gray-600 text-sm">Total Watch Time</p>
          </div> */}
        </div>

        <SearchInput onSearch={handleSearch} />
        <div className="w-full">
          <div className="grid grid-cols-4 gap-4">
            {filteredDevices.map((device) => (
              <Link key={device.id} href={`/details/${device.id}`}>
              <div className="bg-white rounded-md p-4">
                <p className="text-purple-700 text-lg">{device.id}</p>
                <p className="text-gray-500 text-sm">Device Id</p>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <SignOut />
    </div>
  );
};

export default DashboardPage;

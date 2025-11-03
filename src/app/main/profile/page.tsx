"use client";
import { useRouter } from "next/navigation";
import {
  Heart,
  MapPin,
  Info,
  LogOut,
  FileText,
  Edit,
  User,
  FileLock,
  FileQuestion,
  Share2,
  Star,
  Handshake,
} from "lucide-react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import React from "react";

export default function ProfilePage() {
  const router = useRouter();

  // ✅ Function to navigate to any route
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-6">
        <button
          type="button"
          className="absolute left-3 text-xl"
          onClick={() => window.history.back()}
        >
          <IoArrowBack />
        </button>
        <h2 className="text-3xl font-semibold">Profile</h2>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-6 relative">
        <div className="relative">
          {/* Circle Avatar */}
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <User size={48} className="text-gray-500" />
          </div>

          {/* Edit Icon */}
          <Link
            href="/main/profile/editProfile"
            className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full shadow-md hover:bg-blue-600 transition"
          >
            <Edit size={16} color="white" />
          </Link>
        </div>

        <h2 className="mt-3 text-lg font-semibold">Sahil Srivastava</h2>
        <p className="text-gray-500 text-sm">sahil@gmail.com</p>
      </div>

      {/* Options List */}
      <div className="mt-8 space-y-5 px-6 pb-20">
        <ProfileItem
          icon={<Heart size={20} />}
          label="Favourites"
          onClick={() => handleNavigation("/main/bag")}
        />
        <ProfileItem
          icon={<MapPin size={20} />}
          label="Location"
          onClick={() => handleNavigation("/main/profile/location")}
        />
        <ProfileItem
          icon={<Info size={20} />}
          label="About"
          onClick={() => handleNavigation("/main/profile/about")}
        />
        <ProfileItem
          icon={<FileLock size={20} />}
          label="Privacy Policy"
          onClick={() => handleNavigation("/main/profile/privacy")}
        />
        <ProfileItem
          icon={<FileText size={20} />}
          label="Terms & Conditions"
          onClick={() => handleNavigation("/main/profile/term")}
        />
        <ProfileItem
          icon={<FileQuestion size={20} />}
          label="FAQ"
          onClick={() => handleNavigation("/main/profile/FAQ")}
        />
        <ProfileItem
          icon={<Star size={20} />}
          label="Rate Us"
          onClick={() => handleNavigation("/main/profile/rate")}
        />
        <ProfileItem
          icon={<Share2 size={20} />}
          label="Connect With Us"
          onClick={() => handleNavigation("/main/profile/connect")}
        />
        <ProfileItem
          icon={<Handshake size={20} />}
          label="Partner With Us"
          onClick={() => handleNavigation("/main/profile/partner")}
        />
        <ProfileItem
          icon={<LogOut size={20} />}
          label="Logout"
          onClick={() => handleNavigation("/logout")}
        />
      </div>
    </div>
  );
}

// ✅ Fixed component typing (no TS errors)
function ProfileItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-5 shadow-sm hover:bg-gray-100 transition"
    >
      <div className="flex items-center gap-3 text-gray-700">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-gray-500">&gt;</span>
    </button>
  );
}

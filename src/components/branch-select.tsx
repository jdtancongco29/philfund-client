import Cookies from "js-cookie";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const selectedBranch = {
  label: "Main Branch",
  value: "main",
  image: "/man.png",
};

export default function BranchProfileDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear auth token and other session data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user"); // or any other related items

    // Optionally redirect to login page
    Cookies.remove('authToken');
    navigate("/login", {
      state: { message: "You have been logged out successfully." }
    });
  };

  return (
    <div className="relative w-[200px]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 border rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <img
            src={selectedBranch.image}
            alt={selectedBranch.label}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm font-medium">{selectedBranch.label}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 right-0 mt-1 w-full bg-white border rounded-md shadow-md overflow-hidden">
          <button
            onClick={() => {
              setOpen(false);
              // Redirect to profile page or handle it here
              console.log("Go to Profile");
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex align-middle gap-2 cursor-pointer"
          >
            <User width={20} height={20} />
            Profile
          </button>
          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex align-middle gap-2 cursor-pointer"
          >
            <LogOut width={20} height={20} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

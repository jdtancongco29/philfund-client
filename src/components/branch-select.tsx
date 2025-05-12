import { useState } from "react";

const branches = [
  {
    label: "Main Branch",
    value: "main",
    image: "/man.png",
  },
  {
    label: "Dev Branch",
    value: "dev",
    image: "/man.png",
  },
];

export default function BranchSelect() {
  const [selected, setSelected] = useState(branches[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-[200px]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 border rounded-md shadow-sm bg-white hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <img
            src={selected.image}
            alt={selected.label}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm font-medium">{selected.label}</span>
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
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-md">
          {branches.map((branch) => (
            <button
              key={branch.value}
              onClick={() => {
                setSelected(branch);
                setOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100"
            >
              <img
                src={branch.image}
                alt={branch.label}
                className="w-6 h-6 mr-2 rounded-full"
              />
              <span className="text-sm">{branch.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

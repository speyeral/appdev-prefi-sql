"use client";

import { useState, useRef, useEffect } from "react";

export default function CategoryRowActions({
  category,
  onUpdate,
  onDelete,
}: any) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    const result = await onDelete(category.id);
    if (result?.error) {
      alert(result.error);
    }
    setShowDelete(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-white/60 rounded-full transition-colors text-slate-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-36 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white z-10 py-2 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => {
              setShowEdit(true);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Edit Category
          </button>
          <button
            onClick={() => {
              setShowDelete(true);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md">
          <div className="bg-white/90 backdrop-blur-2xl border border-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Edit Category
            </h2>
            <form
              action={async (fd) => {
                await onUpdate(fd);
                setShowEdit(false);
              }}
              className="space-y-4"
            >
              <input type="hidden" name="id" value={category.id} />
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
                  Name
                </label>
                <input
                  name="name"
                  defaultValue={category.name}
                  required
                  className="w-full p-4 rounded-2xl bg-slate-100/50 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={category.description}
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-slate-100/50 outline-none resize-none"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-[2] bg-slate-800 text-white py-4 rounded-2xl font-bold"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="flex-1 bg-white border text-slate-600 py-4 rounded-2xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-sm text-center border border-slate-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Delete Category?
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
              This will permanently remove{" "}
              <span className="font-bold text-slate-700">{category.name}</span>.
              You cannot delete categories that are linked to medical tests.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

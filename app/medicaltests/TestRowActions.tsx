"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "@/components/Modal";
import type { Test, Category, UOM } from "@/types/types";

interface TestRowActionsProps {
  test: Test;
  categories: Category[];
  uoms: UOM[];
  onUpdate: (formData: FormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TestRowActions({
  test,
  categories,
  uoms,
  onUpdate,
  onDelete,
}: TestRowActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
    await onDelete(test.id);
    setShowDelete(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600"
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
        <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 z-10 py-2 animate-in fade-in slide-in-from-top-2 duration-150 rounded-none">
          <button
            onClick={() => {
              setShowEdit(true);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setShowDelete(true);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            Delete
          </button>
        </div>
      )}

      {/* Edit Dialog */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Update Test">
        <form
          action={async (fd) => {
            await onUpdate(fd);
            setShowEdit(false);
          }}
          className="space-y-4"
        >
          <input type="hidden" name="id" value={test.id} />
          <input
            name="name"
            defaultValue={test.name}
            required
            className="w-full p-3 rounded-none bg-white/50 border border-slate-200 outline-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              name="idcategory"
              defaultValue={test.idcategory}
              className="p-3 rounded-none bg-white/50 border border-slate-200 outline-none"
            >
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              name="iduom"
              defaultValue={test.iduom}
              className="p-3 rounded-none bg-white/50 border border-slate-200 outline-none"
            >
              {uoms.map((u: UOM) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="min"
              type="number"
              step="0.01"
              defaultValue={test.normalmin}
              className="p-3 rounded-none bg-white/50 border border-slate-200 outline-none"
            />
            <input
              name="max"
              type="number"
              step="0.01"
              defaultValue={test.normalmax}
              className="p-3 rounded-none bg-white/50 border border-slate-200 outline-none"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 rounded-none font-semibold hover:bg-blue-600"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="flex-1 bg-slate-100 text-gray-600 py-3 rounded-none font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Test?"
        className="max-w-sm"
      >
        <div className="text-center">
          <p className="text-slate-500 mb-6">
            Are you sure? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white py-3 rounded-none font-semibold hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDelete(false)}
              className="flex-1 bg-slate-100 text-gray-600 py-3 rounded-none font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

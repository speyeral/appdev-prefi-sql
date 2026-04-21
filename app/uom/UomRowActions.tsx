"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "@/components/Modal";
import type { UOM } from "@/types/types";

interface DeleteResult {
  success?: boolean;
  error?: string;
}

interface UomRowActionsProps {
  uom: UOM;
  onUpdate: (formData: FormData) => Promise<void>;
  onDelete: (id: number) => Promise<DeleteResult | void>;
}

export default function UomRowActions({ uom, onUpdate, onDelete }: UomRowActionsProps) {
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
    const result = await onDelete(uom.id);
    if (result?.error) {
      alert(result.error);
    }
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

      {/* The dropdown menu stays local but needs a high z-index */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 z-[50] py-2 animate-in fade-in slide-in-from-top-2 rounded-none">
          <button
            onClick={() => {
              setShowEdit(true);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Edit Unit
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

      {/* Edit Dialog */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Unit"
        className="max-w-lg"
      >
        <form
          action={async (fd) => {
            await onUpdate(fd);
            setShowEdit(false);
          }}
          className="space-y-4"
        >
          <input type="hidden" name="id" value={uom.id} />
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
              Abbreviation
            </label>
            <input
              name="name"
              defaultValue={uom.name}
              required
              maxLength={15}
              className="w-full p-4 rounded-none bg-slate-100/50 outline-none focus:ring-2 focus:ring-blue-400 transition-all border border-slate-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={uom.description}
              rows={3}
              className="w-full p-4 rounded-none bg-slate-100/50 outline-none resize-none focus:ring-2 focus:ring-blue-400 transition-all border border-slate-200"
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-[2] bg-blue-600 text-white py-4 rounded-none font-bold hover:bg-blue-700 transition-all"
            >
              Update Unit
            </button>
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 py-4 rounded-none font-bold hover:bg-slate-200 transition-all"
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
        title="Remove Unit?"
        className="max-w-sm"
      >
        <div className="text-center">
          <p className="text-slate-500 mb-6 text-sm">
            Deleting <span className="font-bold text-slate-700">{uom.name}</span>{" "}
            is only possible if no medical tests are using it.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white py-3 rounded-none font-bold hover:bg-red-600 transition-all"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDelete(false)}
              className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-none font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

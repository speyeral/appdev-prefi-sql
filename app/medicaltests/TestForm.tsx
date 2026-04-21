"use client";

import { useState } from "react";
import type { Category, UOM } from "@/types/types";
import Modal from "@/components/Modal";

interface TestFormProps {
  categories: Category[];
  uoms: UOM[];
  addTestAction: (formData: FormData) => Promise<void>;
}

export default function TestForm({
  categories,
  uoms,
  addTestAction,
}: TestFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-6 py-2 rounded-none transition-all font-medium hover:bg-blue-600"
      >
        + Create New Test
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Medical Test">
        <form
          action={async (formData) => {
            await addTestAction(formData);
            setIsOpen(false);
          }}
          className="space-y-4"
        >
          <input
            name="name"
            placeholder="Test Name (e.g. Hemoglobin)"
            required
            className="w-full p-3 rounded-none border border-slate-200 bg-white/50 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="idcategory"
              className="p-3 rounded-none border border-slate-200 bg-white/50 outline-none"
            >
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              name="iduom"
              className="p-3 rounded-none border border-slate-200 bg-white/50 outline-none"
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
              placeholder="Min"
              className="p-3 rounded-none border border-slate-200 bg-white/50 outline-none"
            />
            <input
              name="max"
              type="number"
              step="0.01"
              placeholder="Max"
              className="p-3 rounded-none border border-slate-200 bg-white/50 outline-none"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 rounded-none font-semibold hover:bg-blue-600 transition-colors"
            >
              Save Test
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-200/50 text-gray-600 py-3 rounded-none font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

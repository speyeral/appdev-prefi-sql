"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export default function UomForm({
  addAction,
}: {
  addAction: (formData: FormData) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await addAction(formData);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add UOM", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-8 py-3 rounded-none hover:bg-blue-700 transition-all font-semibold"
      >
        + Add Unit
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="New Unit (UOM)"
        className="max-w-lg"
      >
        <p className="text-slate-500 -mt-4 mb-6">
          Standardize a new unit of measurement.
        </p>

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
              Abbreviation / Name
            </label>
            <input
              name="name"
              placeholder="e.g. mg/dL"
              maxLength={15}
              required
              className="w-full p-4 rounded-none border border-slate-200 bg-slate-100/50 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
              Full Description
            </label>
            <textarea
              name="description"
              placeholder="e.g. Measures concentration of substances in blood"
              rows={3}
                  className="w-full p-4 rounded-none border border-slate-200 bg-slate-100/50 focus:ring-2 focus:ring-blue-400 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isPending}
                  className="flex-[2] bg-blue-600 text-white py-4 rounded-none font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Unit"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
                  className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 py-4 rounded-none font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

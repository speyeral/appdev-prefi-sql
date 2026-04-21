"use client";

import { useState } from "react";

export default function CategoryForm({
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
      console.error("Failed to add category", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white/40 border border-white/60 backdrop-blur-md px-8 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-800 font-semibold hover:bg-white/60"
      >
        + Add Category
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-2xl border border-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                New Category
              </h2>
              <p className="text-slate-500 mt-2">
                Define a new group for medical procedures.
              </p>
            </div>

            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Category Name
                </label>
                <input
                  name="name"
                  placeholder="e.g. Blood Glucose Test"
                  required
                  className="w-full p-4 rounded-2xl border-none bg-slate-100/50 shadow-inner focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="What does this category cover?"
                  rows={4}
                  className="w-full p-4 rounded-2xl border-none bg-slate-100/50 shadow-inner focus:ring-2 focus:ring-blue-400 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-[2] bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-900 transition-all disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Create Category"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

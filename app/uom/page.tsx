import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import UomForm from "./UomForm";
import UomRowActions from "./UomRowActions";
import { UOM } from "@/types/types";

export const dynamic = "force-dynamic";

export default async function UomPage() {
  const result = await query("SELECT * FROM uom ORDER BY id DESC");

  async function addUom(formData: FormData) {
    "use server";
    await query("INSERT INTO uom (name, description) VALUES ($1, $2)", [
      formData.get("name"),
      formData.get("description"),
    ]);
    revalidatePath("/uom");
  }

  async function updateUom(formData: FormData) {
    "use server";
    await query("UPDATE uom SET name = $1, description = $2 WHERE id = $3", [
      formData.get("name"),
      formData.get("description"),
      formData.get("id"),
    ]);
    revalidatePath("/uom");
    revalidatePath("/medicaltests");
  }

  async function deleteUom(id: number) {
    "use server";
    const check = await query(
      "SELECT COUNT(*) FROM medicaltests WHERE iduom = $1",
      [id],
    );
    if (parseInt(check.rows[0].count) > 0) {
      return {
        error: "This unit is in use by medical tests and cannot be deleted.",
      };
    }
    await query("DELETE FROM uom WHERE id = $1", [id]);
    revalidatePath("/uom");
    return { success: true };
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16 px-8 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
              Units of Measure
            </h1>
            <p className="text-slate-500 mt-1">
              Standardized metrics for lab results.
            </p>
          </div>
          <UomForm addAction={addUom} />
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {result.rows.map((u: UOM) => (
            <div
              key={u.id}
              className="bg-white border border-slate-200 p-6 transition-all relative"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-blue-600">
                    {u.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Internal ID: {u.id}
                  </span>
                </div>
                <UomRowActions
                  uom={u}
                  onUpdate={updateUom}
                  onDelete={deleteUom}
                />
              </div>
              <p className="text-slate-600 text-sm leading-relaxed pr-8">
                {u.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

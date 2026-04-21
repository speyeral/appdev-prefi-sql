// app/medicaltests/page.tsx
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import TestForm from "@/app/medicaltests/TestForm";
import TestRowActions from "@/app/medicaltests/TestRowActions"; // New Component
import { Test, Category, UOM } from "@/types/types";
import ExportButtons from "./ExportButtons";

export const dynamic = "force-dynamic";

export default async function Page() {
  // We include idcategory and iduom in the select for the Edit form
  const tests = await query(`
    SELECT mt.id, mt.name, tc.name AS category, u.name AS unit, 
           mt.normalmin, mt.normalmax, mt.idcategory, mt.iduom
    FROM medicaltests mt
    JOIN testcategories tc ON mt.idcategory = tc.id
    JOIN uom u ON mt.iduom = u.id
    ORDER BY mt.id DESC
  `);

  const categories = await query("SELECT id, name FROM testcategories");
  const uoms = await query("SELECT id, name FROM uom");

  async function addTest(formData: FormData) {
    "use server";
    await query(
      "INSERT INTO medicaltests (name, idcategory, iduom, normalmin, normalmax) VALUES ($1, $2, $3, $4, $5)",
      [
        formData.get("name"),
        formData.get("idcategory"),
        formData.get("iduom"),
        formData.get("min"),
        formData.get("max"),
      ],
    );
    revalidatePath("/medicaltests");
  }

  async function updateTest(formData: FormData) {
    "use server";
    await query(
      "UPDATE medicaltests SET name=$1, idcategory=$2, iduom=$3, normalmin=$4, normalmax=$5 WHERE id=$6",
      [
        formData.get("name"),
        formData.get("idcategory"),
        formData.get("iduom"),
        formData.get("min"),
        formData.get("max"),
        formData.get("id"),
      ],
    );
    revalidatePath("/medicaltests");
  }

  async function deleteTest(id: number) {
    "use server";
    await query("DELETE FROM medicaltests WHERE id = $1", [id]);
    revalidatePath("/medicaltests");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-8 md:px-16 pb-8 md:pb-16 pt-24 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-800">
              Medical Tests
            </h1>
            <p className="text-slate-500 mt-2">
              Manage clinical test parameters and ranges.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ExportButtons data={tests.rows} />
            <TestForm
              categories={categories.rows}
              uoms={uoms.rows}
              addTestAction={addTest}
            />
          </div>
        </header>

        <div className="overflow-hidden border border-slate-200 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-5 font-semibold text-slate-600">Test Name</th>
                <th className="p-5 font-semibold text-slate-600">Category</th>
                <th className="p-5 font-semibold text-slate-600">Unit</th>
                <th className="p-5 font-semibold text-slate-600">
                  Normal Range
                </th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tests.rows.map((test: any) => (
                <tr
                  key={test.id}
                  className="hover:bg-white/40 transition-colors group"
                >
                  <td className="p-5 font-medium">{test.name}</td>
                  <td className="p-5 text-slate-500">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                      {test.category}
                    </span>
                  </td>
                  <td className="p-5 text-slate-500 italic">{test.unit}</td>
                  <td className="p-5 font-mono text-sm">
                    {test.normalmin} — {test.normalmax}
                  </td>
                  <td className="p-5 text-right">
                    {/* The 3-dots actions component */}
                    <TestRowActions
                      test={test}
                      categories={categories.rows}
                      uoms={uoms.rows}
                      onUpdate={updateTest}
                      onDelete={deleteTest}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

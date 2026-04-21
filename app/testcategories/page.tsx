import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import CategoryForm from "./CategoryForm";
import CategoryRowActions from "./CategoryRowActions";
import { Category } from "@/types/types";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const result = await query("SELECT * FROM testcategories ORDER BY id DESC");

  async function addCategory(formData: FormData) {
    "use server";
    await query(
      "INSERT INTO testcategories (name, description) VALUES ($1, $2)",
      [formData.get("name"), formData.get("description")],
    );
    revalidatePath("/testcategories");
  }

  async function updateCategory(formData: FormData) {
    "use server";
    await query(
      "UPDATE testcategories SET name = $1, description = $2 WHERE id = $3",
      [formData.get("name"), formData.get("description"), formData.get("id")],
    );
    revalidatePath("/testcategories");
    revalidatePath("/medicaltests"); // Update names in medical tests if they changed
  }

  async function deleteCategory(id: number) {
    "use server";

    // Safety Check: Verify if any medical tests use this category
    const check = await query(
      "SELECT COUNT(*) FROM medicaltests WHERE idcategory = $1",
      [id],
    );
    if (parseInt(check.rows[0].count) > 0) {
      return {
        error:
          "This category is currently in use by medical tests and cannot be deleted.",
      };
    }

    await query("DELETE FROM testcategories WHERE id = $1", [id]);
    revalidatePath("/testcategories");
    return { success: true };
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16 px-8 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
              Test Categories
            </h1>
            <p className="text-slate-500 mt-1">
              Classification of medical diagnostics.
            </p>
          </div>
          <CategoryForm addAction={addCategory} />
        </header>

        <div className="overflow-hidden border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-6 font-semibold text-slate-400 text-xs">
                  Category Name
                </th>
                <th className="p-6 font-semibold text-slate-400 text-xs">
                  Description
                </th>
                <th className="p-6 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.rows.map((cat: Category) => (
                <tr
                  key={cat.id}
                  className="hover:bg-white/30 transition-colors group"
                >
                  <td className="p-6 font-bold text-slate-800">{cat.name}</td>
                  <td className="p-6 text-slate-500 text-sm">
                    {cat.description}
                  </td>
                  <td className="p-6 text-right">
                    <CategoryRowActions
                      category={cat}
                      onUpdate={updateCategory}
                      onDelete={deleteCategory}
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

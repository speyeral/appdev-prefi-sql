"use client";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface MedicalTest {
  name: string;
  category: string;
  unit: string;
  normalmin: number;
  normalmax: number;
}

export default function ExportButtons({ data }: { data: MedicalTest[] }) {
  const exportToExcel = () => {
    // 1. Prepare data (mapping to friendly headers)
    const excelData = data.map((item) => ({
      "Test Name": item.name,
      Category: item.category,
      Unit: item.unit,
      "Min Range": item.normalmin,
      "Max Range": item.normalmax,
    }));

    // 2. Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Medical Tests");

    // 3. Download file
    XLSX.writeFile(workbook, "Medical_Tests_Report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add Title to the PDF
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Medical Tests Laboratory Report", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 30);

    // Define table columns and rows
    const columns = ["Test Name", "Category", "Unit", "Min Range", "Max Range"];
    const rows = data.map((item) => [
      item.name,
      item.category,
      item.unit,
      item.normalmin,
      item.normalmax,
    ]);

    // Generate AutoTable
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 40,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [71, 85, 105], textColor: 255 }, // Slate-600
      alternateRowStyles: { fillColor: [248, 250, 252] }, // Slate-50
      margin: { top: 40 },
    });

    // Save PDF
    doc.save("Medical_Tests_A4_Report.pdf");
  };

  return (
    <div className="flex items-center gap-3">
      {/* EXCEL BUTTON */}
      <button
        onClick={exportToExcel}
        className="flex items-center gap-2 bg-white/80 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-none text-sm font-semibold hover:bg-emerald-50 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M8 13h2" />
          <path d="M8 17h2" />
          <path d="M14 13h2" />
          <path d="M14 17h2" />
        </svg>
        Export Excel
      </button>

      {/* PDF BUTTON */}
      <button
        onClick={exportToPDF}
        className="flex items-center gap-2 bg-white/80 border border-rose-200 text-rose-700 px-4 py-2 rounded-none text-sm font-semibold hover:bg-rose-50 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15h3a2 2 0 0 1 0 4h-3V13h3a2 2 0 0 1 0 4" />
        </svg>
        Print PDF (A4)
      </button>
    </div>
  );
}

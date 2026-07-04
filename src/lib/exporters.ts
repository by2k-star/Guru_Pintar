/**
 * Helper export PDF generik — render elemen DOM ke canvas lalu PDF.
 * Pakai jsPDF + html2canvas. Hanya berjalan di browser.
 */
import { toast } from "sonner";

export async function exportElementToPDF(element: HTMLElement, filename: string) {
  const { default: html2canvas } = await import("html2canvas");
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 48;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 24;
  pdf.addImage(imgData, "PNG", 24, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - 48;

  while (heightLeft > 0) {
    pdf.addPage();
    position = -(imgHeight - heightLeft) + 24;
    pdf.addImage(imgData, "PNG", 24, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 48;
  }

  pdf.save(filename);
  toast.success("PDF berhasil diunduh.");
}

export async function exportElementToPNG(element: HTMLElement, filename: string) {
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  toast.success("Gambar berhasil diunduh.");
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  AlertTriangle,
  PackageSearch,
} from "lucide-react";
import { FiPrinter } from "react-icons/fi";
import WarpingStockPrintoutPage from "@/customPrintouts/warpingStockPrintout";
import { useReactToPrint } from "react-to-print";

export default function YarnStockForm() {
  const [rows, setRows] = useState([]);
  const [warpingStock, setWarpingStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [error, setError] = useState(false);

  const [manageOpen, setManageOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingIdx, setEditingIdx] = useState(null);
  const [formData, setFormData] = useState({});

  // FIELDS: Type removed from choices, it will be forced to Yarn.
  const yarnFields = [
    { key: "Description", label: "Description", type: "text" },
    {
      key: "UnitOfMeasure",
      label: "Unit of Measure",
      type: "select",
      options: ["Kgs", "Pieces"],
    },
    { key: "QuantityOnHand", label: "Quantity On Hand", type: "number" },
    { key: "StockIndex", label: "Stock Index (optional)", type: "number" },
  ];

  const fetchWarpingStock = async () => {
    setError(false);
    setLoading(true);
    try {
      const res = await fetch("/api/warping-stock", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch WarpingStock");

      const data = await res.json();

      // ONLY YARN ALLOWED HERE
      const yarn = data
        .filter((x) => x.Type?.toLowerCase() === "yarn")
        .sort((a, b) => (a.StockIndex || 0) - (b.StockIndex || 0));

      setWarpingStock(yarn);
      setRows(yarn);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarpingStock();
  }, []);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Yarn Stock Report",
    pageStyle: `
      @page { size: A4; margin: 12mm; }
      body { -webkit-print-color-adjust: exact !important; }
    `,
  });

  const handleChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // UPDATE  ONLY YARN ROWS 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/warping-stock/bulk-update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows), // rows ONLY contain Yarn
      });

      if (!res.ok) throw new Error("Bulk update failed");

      toast.success("Yarn stock updated!");
      await fetchWarpingStock();
    } catch (err) {
      console.error(err);
      toast.error("Could not update yarn stock");
    } finally {
      setSaving(false);
    }
  };

  //  ADD OR EDIT ITEM — ONLY YARN 
  const handleSaveItem = async () => {
    setSavingItem(true);
    try {
      const method = editingIdx === "new" ? "POST" : "PUT";
      const url =
        editingIdx === "new"
          ? "/api/warping-stock"
          : `/api/warping-stock/${formData.ID}`;

      const payload = {
        ...formData,
        Type: "Yarn", // FORCE YARN only
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success(
        editingIdx === "new"
          ? "New yarn added!"
          : "Yarn item updated!"
      );

      await fetchWarpingStock();
    } catch (err) {
      console.error(err);
      toast.error("Error saving yarn item");
    } finally {
      setSavingItem(false);
      setEditingIdx(null);
    }
  };

  const confirmDeleteItem = async () => {
    if (!confirmDelete) return;
    try {
      const item = warpingStock.find(
        (s) => s.Description === confirmDelete
      );
      if (!item) throw new Error("Item not found");

      const res = await fetch(`/api/warping-stock/${item.ID}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success(`Deleted yarn: ${confirmDelete}`);
      await fetchWarpingStock();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting yarn");
    } finally {
      setConfirmDelete(null);
    }
  };

  // ------------------- UI STATES --------------------

  if (loading) {
    return (
      <div className="flex flex-col mt-[170px] items-center justify-center bg-white">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-6 bg-blue-500 rounded animate-[wave_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>

        <p className="mt-6 text-lg font-semibold text-gray-800">
          Loading Yarn Stock...
        </p>

        <style>{`
          @keyframes wave {
            0%, 40%, 100% { transform: scaleY(0.4); } 
            20% { transform: scaleY(1.0); }
          }
        `}</style>
      </div>
    );
  }

  if (error)
    return (
      <div className="flex flex-col items-center justify-center mt-36 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
        <p className="text-gray-700 font-medium mb-2">
          Failed to load Yarn Stock.
        </p>
        <Button onClick={fetchWarpingStock} variant="outline">
          Retry
        </Button>
      </div>
    );

  // ------------------- MAIN RETURN --------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-xl bg-slate-50 p-4 shadow-md mb-5"
    >
      {/* HEADER + BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="font-semibold text-blue-800 text-lg ml-2">
          Update Yarn Stock
        </h2>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Updates"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setManageOpen(true)}
          >
            Manage Stock
          </Button>

            <button
             onClick={handlePrint}
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm"
          >
            <FiPrinter className="w-4 h-4" /> Print report
          </button>

          <div className="absolute -left-[9999px] top-0">
            <WarpingStockPrintoutPage ref={componentRef} />
          </div>
        </div>
      </div>

      {/* MANAGE MODAL — YARN ONLY */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader className="flex justify-between items-center pb-3 border-b">
            <DialogTitle className="flex items-center gap-2 text-blue-800">
              <PackageSearch className="text-black" />
              Yarn Master List
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-3 border rounded-md">
            {warpingStock.length === 0 ? (
              <p className="text-sm text-slate-500 p-3">
                No yarn stock found.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="px-3 py-1 text-left font-bold">Description</th>
                    <th className="px-3 py-1 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {warpingStock
                    .filter((item) => item.Type?.toLowerCase() === "yarn")
                    .map((item, idx) => (

                    <tr key={item.ID} className="border-t even:bg-slate-50">
                      <td className="px-3 py-1">{item.Description}</td>
                      <td className="px-3 py-1 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingIdx(idx);
                            setFormData(item);
                          }}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setConfirmDelete(item.Description)}
                        >
                          <Trash2 className="text-red-500" size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setEditingIdx("new");
                setFormData({ Type: "Yarn" });
              }}
              className="mx-auto flex items-center gap-2"
            >
              <Plus size={16} /> New Yarn Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ADD/EDIT MODAL */}
      <Dialog open={editingIdx !== null} onOpenChange={() => setEditingIdx(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-800">
              {editingIdx === "new" ? "Add Yarn" : "Edit Yarn"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveItem();
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* FIXED TYPE=YARN ROW */}
              <div className="flex items-center gap-3 border rounded-md p-2 bg-slate-100">
                <label className="w-1/3 text-sm font-semibold text-gray-800">
                  Type
                </label>
                <input
                  value="Yarn"
                  disabled
                  className="flex-1 border rounded-md px-2 py-1 text-sm bg-slate-200"
                />
              </div>

              {/* OTHER FIELDS */}
              {yarnFields.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center gap-3 border rounded-md p-2 bg-slate-50"
                >
                  <label className="w-1/3 text-sm font-semibold text-gray-800">
                    {field.label}
                  </label>

                  {field.type === "select" ? (
                    <select
                      className="flex-1 border rounded-md px-2 py-1 text-sm bg-white"
                      value={formData[field.key] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.key]: e.target.value })
                      }
                    >
                      <option value="">-- Select --</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="flex-1 border rounded-md px-2 py-1 text-sm bg-white"
                      value={formData[field.key] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.key]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingIdx(null)}>
                Cancel
              </Button>

              <Button type="submit" disabled={savingItem}>
                {savingItem ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingIdx === "new" ? (
                  "Add Yarn"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* YARN TABLE ONLY */}
      <div className="border rounded-md overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead className="bg-slate-200 sticky top-0 z-30">
              <tr>
                <th className="border px-2 py-1 text-center w-36">Type</th>
                <th className="border px-2 py-1 text-center w-48">Description</th>
                <th className="border px-2 py-1 text-center w-36">Current Stock</th>
                <th className="border px-2 py-1 text-center w-28">Unit</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr key={row.ID || i} className="bg-white even:bg-slate-50">
                  <td className="border px-2 py-1 text-left text-gray-700 font-medium">
                    Yarn
                  </td>
                  <td className="border px-2 py-1">{row.Description}</td>
                  <td className="border px-2 py-1 text-center">
                    <input
                      type="number"
                      value={row.QuantityOnHand}
                      onChange={(e) =>
                        handleChange(i, "QuantityOnHand", e.target.value)
                      }
                      className="w-28 border rounded-md px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {row.UnitOfMeasure}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Yarn Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{confirmDelete}</span>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={confirmDeleteItem}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

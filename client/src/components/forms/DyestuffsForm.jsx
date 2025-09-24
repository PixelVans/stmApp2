"use client";

import { useEffect, useState } from "react";
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
import { Pencil, Trash2, Plus, Droplet, Loader2 } from "lucide-react";

export default function DyestuffsForm() {
  const [rows, setRows] = useState([]);
  const [dyestuffs, setDyestuffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingDyestuff, setSavingDyestuff] = useState(false);

  // Manage modal state
  const [manageOpen, setManageOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Add/Edit modal state
  const [editingIdx, setEditingIdx] = useState(null);
  const [formData, setFormData] = useState({});

  const dyestuffFields = [
    { key: "Description", label: "Description", type: "text" },
    { key: "DyestuffsIndex", label: "Dyestuff Index", type: "number" },
    { key: "QuantityonHand", label: "Quantity on Hand", type: "number" },
    {
      key: "UnitofMeasure",
      label: "Unit of Measure",
      type: "select",
      options: ["kilogram (kg)", "litres (ltrs)"],
    },
    { key: "CostperKgLt", label: "Cost per Kg/Lt", type: "number" },
    { key: "SupplierName", label: "Supplier Name", type: "text" },
    { key: "SupplierItemCode", label: "Supplier Item Code", type: "text" },
    { key: "SellingUnits", label: "Selling Units", type: "number" },
    { key: "UnitCost", label: "Unit Cost", type: "number" },
    { key: "UnitCostgm", label: "Unit Cost (gm)", type: "number" },
    { key: "VATCostKg", label: "VAT Cost/Kg", type: "number" },
    { key: "VATCostgm", label: "VAT Cost/gm", type: "number" },
    { key: "VATUnitCost", label: "VAT Unit Cost", type: "number" },
  ];

  // Reusable fetch function with sorting
  const fetchDyestuffs = async () => {
    try {
      const res = await fetch("/api/dyestuffs-stock");
      if (!res.ok) throw new Error("Failed to fetch Dyestuff");
      const data = await res.json();

      // Sort alphabetically by Description
      let sorted = [...data].sort((a, b) =>
        a.Description.localeCompare(b.Description)
      );

      // Move "IDO" after "Water" if both exist
      const waterIdx = sorted.findIndex((c) => c.Description === "Water");
      const idoIdx = sorted.findIndex((c) => c.Description === "IDO");

      if (waterIdx !== -1 && idoIdx !== -1) {
        const [ido] = sorted.splice(idoIdx, 1);
        sorted.splice(waterIdx + 1, 0, ido);
      }

      setDyestuffs(sorted);
      setRows(
        sorted.map((chem) => ({
          ...chem,
          in: "",
          out: "",
          balance: "",
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Could not load Dyestuffs");
    } finally {
      setLoading(false);
    }
  };

  // Load Dyestuffs on mount
  useEffect(() => {
    fetchDyestuffs();
  }, []);

  const handleChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // Save stock updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/dyestuffs-stock/bulk-update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      });

      if (!res.ok) throw new Error("Failed to update stock");
      toast.success("Dyestuffs stock data updated!");
    } catch (err) {
      console.error(err);
      toast.error("Could not update Dyestuffs stock data");
    } finally {
      setSaving(false);
    }
  };

  // Add/Edit Dyestuff
  const handleSaveDyestuff = async () => {
    setSavingDyestuff(true);
    try {
      let res;
      if (editingIdx === "new") {
        res = await fetch("/api/dyestuffs-stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        const chemId = dyestuffs[editingIdx].ID;
        res = await fetch(`/api/dyestuffs-stock/${chemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) throw new Error("Request failed");
      toast.success(
        editingIdx === "new" ? "New Dyestuff added!" : "Dyestuff updated!"
      );

      await fetchDyestuffs();
    } catch (err) {
      console.error(err);
      toast.error("Error saving Dyestuff");
    } finally {
      setSavingDyestuff(false);
      setEditingIdx(null);
    }
  };

  // Delete Dyestuff
  const confirmDeleteDyestuff = async () => {
    if (!confirmDelete) return;
    try {
      const dye = dyestuffs.find((c) => c.Description === confirmDelete);
      if (!dye) return;

      const res = await fetch(`/api/dyestuffs-stock/${chem.ID}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success(`Deleted Dyestuff: ${confirmDelete}`);
      await fetchDyestuffs();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting Dyestuff");
    } finally {
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="animate-spin h-7 w-7 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-sm font-medium text-gray-700">
          Loading Dyestuffs Stock Data...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-xl bg-slate-50 p-5 shadow-md mb-5 hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="font-semibold text-blue-800 text-lg">
          Update Dyestuffs Stock
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

        <Button type="button" variant="outline" onClick={() => setManageOpen(true)}>
                Manage Dyestuffs
        </Button>
      </div>
              

        {/* Manage Dyestuffs Modal */}
        <Dialog open={manageOpen} onOpenChange={setManageOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 mt-2 mb-5 text-center mx-auto text-blue-800">
                <Droplet fill="yellow" size={20} className="text-blue-600" />
                Dyestuffs Master List
              </DialogTitle>
            </DialogHeader>

            <div className="border rounded-md overflow-hidden">
              {dyestuffs.length === 0 ? (
                <p className="text-sm text-slate-500 p-3">No Dyestuffs found.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="text-left px-2 py-1 font-bold">
                        Description
                      </th>
                      <th className="px-2 py-1 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dyestuffs.map((dye, idx) => (
                      <tr
                        key={dye.ID}
                        className="border-t even:bg-slate-50 hover:bg-slate-100"
                      >
                        <td className="px-2 py-1">{dye.Description}</td>
                        <td className="px-2 py-1 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setEditingIdx(idx);
                                setFormData(dye);
                              }}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setConfirmDelete(dye.Description)
                              }
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Add New Dyestuff Button */}
            <div className="mt-4">
              <Button
                onClick={() => {
                  setEditingIdx("new");
                  setFormData({});
                }}
              >
                <Plus size={14} className="mr-1" /> Add New Dyestuff
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Dyestuff Modal */}
        <Dialog
          open={editingIdx !== null}
          onOpenChange={() => setEditingIdx(null)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingIdx === "new" ? "Add New Dyestuff" : "Edit Dyestuff"}
              </DialogTitle>
            </DialogHeader>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSaveDyestuff();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dyestuffFields.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-center gap-3 border rounded-md p-2 bg-slate-50"
                  >
                    <label className="w-1/3 text-sm font-semibold text-gray-800">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        className="flex-1 border rounded-md px-2 py-1 text-sm bg-slate-300 focus:ring-2 focus:ring-blue-500"
                        value={formData[field.key] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.key]: e.target.value,
                          })
                        }
                        required={field.key === "Description"}
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
                        className="flex-1 border rounded-md px-2 py-1 text-sm bg-slate-300 focus:ring-2 focus:ring-blue-500"
                        value={formData[field.key] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.key]: e.target.value,
                          })
                        }
                        required={field.key === "Description"}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingIdx(null)}
                  disabled={savingDyestuff}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={savingDyestuff}>
                  {savingDyestuff ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingIdx === "new" ? "Adding..." : "Saving..."}
                    </>
                  ) : editingIdx === "new" ? (
                    "Add Dyestuff"
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

    {/* Editable Table */}
      <div className="border rounded-md overflow-hidden ">
        <div className="max-h-[500px] overflow-y-auto ">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead className="bg-slate-200 sticky top-0 z-30">
              <tr className="bg-slate-200">
                <th className="border px-2 py-1 text-left">Item Description</th>
                <th className="border px-2 py-1">Current Stock</th>
                <th className="border px-2 py-1">In</th>
                <th className="border px-2 py-1">Out</th>
                <th className="border px-2 py-1">Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.ID || i} className="bg-white even:bg-slate-50">
                  <td className="border px-2 py-1">{row.Description}</td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      value={row.QuantityonHand}
                      onChange={(e) =>
                        handleChange(i, "QuantityonHand", e.target.value)
                      }
                      className="w-full border rounded-md px-2 py-1 text-sm"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Tab") {
                          e.preventDefault();
                          const nextInput = document.querySelector(
                            `#stock-input-${i + 1}`
                          );
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      id={`stock-input-${i}`}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      value={row.in}
                      onChange={(e) => handleChange(i, "in", e.target.value)}
                      className="w-full border rounded-md px-2 py-1 text-sm"
                      tabIndex={-1}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      value={row.out}
                      onChange={(e) => handleChange(i, "out", e.target.value)}
                      className="w-full border rounded-md px-2 py-1 text-sm"
                      tabIndex={-1}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      value={row.balance}
                      onChange={(e) => handleChange(i, "balance", e.target.value)}
                      className="w-full border rounded-md px-2 py-1 text-sm"
                      tabIndex={-1}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dyestuff</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{confirmDelete}</span>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDeleteDyestuff}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

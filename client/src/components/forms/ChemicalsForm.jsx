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
import { Pencil, Trash2, Plus, FlaskConical, Loader2 } from "lucide-react";

export default function ChemicalsForm() {
  const [rows, setRows] = useState([]);
  const [chemicals, setChemicals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingChemical, setSavingChemical] = useState(false);

  // Manage modal state
  const [manageOpen, setManageOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Add/Edit modal state
  const [editingIdx, setEditingIdx] = useState(null);
  const [formData, setFormData] = useState({});

  const chemicalFields = [
    { key: "Description", label: "Description", type: "text" },
    { key: "ChemicalsIndex", label: "Chemical Index", type: "number" },
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

  // Fetch chemicals
  const fetchChemicals = async () => {
    try {
      const res = await fetch("/api/chemicals-stock");
      if (!res.ok) throw new Error("Failed to fetch chemicals");
      const data = await res.json();

      let sorted = [...data].sort((a, b) =>
        a.Description.localeCompare(b.Description)
      );

      const waterIdx = sorted.findIndex((c) => c.Description === "Water");
      const idoIdx = sorted.findIndex((c) => c.Description === "IDO");

      if (waterIdx !== -1 && idoIdx !== -1) {
        const [ido] = sorted.splice(idoIdx, 1);
        sorted.splice(waterIdx + 1, 0, ido);
      }

      setChemicals(sorted);
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
      toast.error("Could not load chemicals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChemicals();
  }, []);

  const handleChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/chemicals-stock/bulk-update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      });

      if (!res.ok) throw new Error("Failed to update stock");
      toast.success("Chemicals stock data updated!");
    } catch (err) {
      console.error(err);
      toast.error("Could not update chemicals stock data");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChemical = async () => {
    setSavingChemical(true);
    try {
      let res;
      if (editingIdx === "new") {
        res = await fetch("/api/chemicals-stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        const chemId = chemicals[editingIdx].ID;
        res = await fetch(`/api/chemicals-stock/${chemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) throw new Error("Request failed");
      toast.success(
        editingIdx === "new" ? "New chemical added!" : "Chemical updated!"
      );

      await fetchChemicals();
    } catch (err) {
      console.error(err);
      toast.error("Error saving chemical");
    } finally {
      setSavingChemical(false);
      setEditingIdx(null);
    }
  };

  const confirmDeleteChemical = async () => {
    if (!confirmDelete) return;
    try {
      const chem = chemicals.find((c) => c.Description === confirmDelete);
      if (!chem) return;

      const res = await fetch(`/api/chemicals-stock/${chem.ID}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success(`Deleted chemical: ${confirmDelete}`);
      await fetchChemicals();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting chemical");
    } finally {
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="animate-spin h-7 w-7 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-sm font-medium text-gray-700">
          Loading Chemicals Stock Data...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-xl bg-slate-50 p-5 shadow-md mb-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="font-semibold text-blue-800 text-lg">
          Update Chemicals Stock
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
            className='hover:bg-slate-200'
            type="button"
            variant="outline"
            onClick={() => setManageOpen(true)}
          >
            Manage Chemicals
          </Button>
        </div>

        {/* Manage Chemicals Modal */}
        <Dialog open={manageOpen} onOpenChange={setManageOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
            {/* Fixed Header Section */}
            <DialogHeader className="flex justify-between items-center pb-3 border-b">
              <DialogTitle className="flex items-center gap-2 text-blue-800">
                <FlaskConical fill="yellow" size={20} className="text-black" />
                Chemicals Master List
              </DialogTitle>
            


             
            </DialogHeader>

            {/* Scrollable Table Section */}
            <div className="flex-1 overflow-y-auto mt-3 border rounded-md">
              {chemicals.length === 0 ? (
                <p className="text-sm text-slate-500 p-3">No chemicals found.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 sticky top-0 z-10">
                    <tr>
                      <th className="text-left px-2 sm:px-4 py-1 font-bold">
                        Description
                      </th>
                      <th className="px-2 sm:px-6 py-1 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chemicals.map((chem, idx) => (
                      <tr
                        key={chem.ID}
                        className="border-t even:bg-slate-50 hover:bg-slate-100"
                      >
                        <td className="px-2 py-1">{chem.Description}</td>
                        <td className="px-2 py-1 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setEditingIdx(idx);
                                setFormData(chem);
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
                                setConfirmDelete(chem.Description)
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
           {/* Add New Chemical Button */}
            <div className="mt-4">
                <Button
                variant="outline"
                onClick={() => {
                  setEditingIdx("new");
                  setFormData({});
                }}
                className="flex mx-auto items-center gap-2 mt-2 bg-white hover:bg-slate-300 border border-slate-500 text-slate-700"
              >
                <Plus size={16} className="text-slate-600" />
                Add New Chemical
              </Button>
            </div>
            
          </DialogContent>
        </Dialog>

        {/* Add/Edit Chemical Modal (unchanged) */}
        <Dialog
          open={editingIdx !== null}
          onOpenChange={() => setEditingIdx(null)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-blue-800">
                {editingIdx === "new" ? "Add a New Chemical" : "Edit Chemical"}
              </DialogTitle>
            </DialogHeader>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSaveChemical();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {chemicalFields.map((field) => (
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
                  disabled={savingChemical}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={savingChemical}>
                  {savingChemical ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingIdx === "new" ? "Adding..." : "Saving..."}
                    </>
                  ) : editingIdx === "new" ? (
                    "Add Chemical"
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
      <div className="border rounded-md overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead className="bg-slate-200 sticky top-0 z-30">
              <tr>
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
                      onChange={(e) =>
                        handleChange(i, "balance", e.target.value)
                      }
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
            <AlertDialogTitle>Delete Chemical</AlertDialogTitle>
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
              onClick={confirmDeleteChemical}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

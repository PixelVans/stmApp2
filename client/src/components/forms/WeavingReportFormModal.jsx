
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useDyeingStore from "@/store/zustand";
import { saveWeavingProduction } from "@/api/dyeingApi";
import { CheckCircle2, XCircle } from "lucide-react";

export default function WeavingReportFormModal({ open, onClose }) {
  const { selectedWeek } = useDyeingStore();

  const [formData, setFormData] = useState({
    weekNo: "",
    day: "",
    machineNo: "",
    machineReadingShiftA: "",
    machineReadingShiftB: "",
    stopReasonShiftA: "",
    stopReasonShiftB: "",
    beamNoShiftA: "",
    beamNoShiftB: "",
    counterShiftA: "",
    counterShiftB: "",
    article: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModal, setStatusModal] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const stopReasons = [
    "",
    "Article - Change",
    "Beam Fall - Pile",
    "Beam Fall - Ground",
    "Denting",
    "Drawing",
    "Electrical",
    "Knotting - Pile",
    "Knotting - Ground",
    "Mechanical",
    "No Shift",
    "No Power",
    "No Weft",
    "Other",
    "Passing Knots",
    "Setting",
    "Stopped",
  ];

  // sync week with store
  useEffect(() => {
    if (selectedWeek) {
      setFormData((prev) => ({ ...prev, weekNo: selectedWeek }));
    }
  }, [selectedWeek]);

  // set day
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "short",
    });
    setFormData((prev) => ({ ...prev, day: today }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.machineNo) return; 

    try {
      setIsSubmitting(true);
      await saveWeavingProduction(formData);
      setStatusModal("success");
    } catch (err) {
      console.error("Save error:", err);
      setErrorMessage(err.message || "Failed to submit form.");
      setStatusModal("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Main Form Modal */}
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setFormData((prev) => ({ ...prev })); 
            onClose();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold mt-9 text-center">
              Update Weaving Production For (Week {selectedWeek})
            </DialogTitle>

            {formData.machineNo && (
              <p className="text-2xl font-bold text-gray-800 mt-3 text-center">
                Machine No: {formData.machineNo}
              </p>
            )}
          </DialogHeader>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Machine Dropdown */}
            <div>
              <label className="text-sm font-medium">Select Machine</label>
              <select
                required
                value={formData.machineNo}
                onChange={(e) =>
                  setFormData({ ...formData, machineNo: e.target.value })
                }
                className="w-full border border-gray-500  rounded-lg px-2 py-1
                focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value=""></option>
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Shift Sections */}
            <div className="grid grid-cols-2 gap-3 lg:gap-6">
              {/* Shift A */}
              <div className="space-y-3 border rounded-lg p-3">
                <h3 className="text-sm sm:text-md font-semibold text-blue-700 text-center">
                  Shift A
                </h3>
                <div>
                  <label className="text-sm font-medium">Meter Reading</label>
                  <input
                    type="number"
                    value={formData.machineReadingShiftA}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        machineReadingShiftA: e.target.value,
                      })
                    }
                    className="w-full border border-slate-500 rounded-lg px-2 py-1
                    focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stop Reason</label>
                  <select
                    value={formData.stopReasonShiftA}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stopReasonShiftA: e.target.value,
                      })
                    }
                    className="w-full border border-slate-500 rounded-lg px-2 py-1
                    focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    {stopReasons.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Beam Number</label>
                  <input
                    type="text"
                    value={formData.beamNoShiftA}
                    onChange={(e) =>
                      setFormData({ ...formData, beamNoShiftA: e.target.value })
                    }
                    className="w-full border border-slate-500 rounded-lg px-2 py-1
                    focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Counter</label>
                  <input
                    type="number"
                    value={formData.counterShiftA}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        counterShiftA: e.target.value,
                      })
                    }
                    className="w-full border border-slate-500 rounded-lg px-2 py-1
                    focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Shift B */}
              <div className="space-y-3 border rounded-lg p-3 bg-blue-50">
                <h3 className="text-sm sm:text-md font-semibold text-blue-700 text-center">
                  Shift B
                </h3>
                <div>
                  <label className="text-sm font-medium">Meter Reading</label>
                  <input
                    type="number"
                    value={formData.machineReadingShiftB}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        machineReadingShiftB: e.target.value,
                      })
                    }
                    className="w-full border
                    focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 border-slate-500 rounded-lg px-2 py-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stop Reason</label>
                  <select
                    value={formData.stopReasonShiftB}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stopReasonShiftB: e.target.value,
                      })
                    }
                    className="w-full border border-slate-500 rounded-lg px-2 py-1
                    focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    {stopReasons.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Beam Number</label>
                  <input
                    type="text"
                    value={formData.beamNoShiftB}
                    onChange={(e) =>
                      setFormData({ ...formData, beamNoShiftB: e.target.value })
                    }
                    className="w-full border border-slate-500 rounded-lg px-2 py-1
                    focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Counter</label>
                  <input
                    type="number"
                    value={formData.counterShiftB}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        counterShiftB: e.target.value,
                      })
                    }
                    className="w-full border border-slate-500 rounded-lg px-2 py-1
                    focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Article */}
            <div className="w-72 text-center mx-auto">
              <label className="text-sm font-medium">
                {formData.machineNo
                  ? `Article ${formData.machineNo}`
                  : "Article"}
              </label>
              <input
                type="text"
                value={formData.article}
                onChange={(e) =>
                  setFormData({ ...formData, article: e.target.value })
                }
                className="w-full border border-slate-500 rounded-lg px-2 py-1
                focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status Modal */}
      <Dialog
        open={statusModal !== null}
        onOpenChange={() => {
          setStatusModal(null);
          setErrorMessage("");
          onClose(); 
        }}
      >
        <DialogContent className="max-w-md text-center">
          {statusModal === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <h2 className="text-xl font-semibold">Report Submitted Successfully!</h2>
              <Button onClick={() => setStatusModal(null)}>Close</Button>
            </div>
          )}

          {statusModal === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="w-16 h-16 text-red-500" />
              <h2 className="text-xl font-semibold">Submission Failed</h2>
              <p className="text-red-600">{errorMessage}</p>
              <Button onClick={() => setStatusModal(null)}>Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}



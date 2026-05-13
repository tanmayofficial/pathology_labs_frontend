import React, { useEffect, useRef, useState } from "react";
import {
  getLedgers,
  createLedger,
  updateLedger,
  deleteLedger,
} from "../services/ledgerService";
import { toast } from "react-toastify";
import GoBack from "../components/GoBack";
import { ClipLoader } from "react-spinners";

const Ledger = () => {
  const [ledgerData, setLedgerData] = useState({
    name: "",
    type: "",
    particulars: "",
    debit: "",
    credit: "",
    balance: "",
  });
  const [ledgers, setLedgers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [updateId, setUpdateId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const ledgerNameRef = useRef(null);

  const handleChange = (e) => {
    setLedgerData({ ...ledgerData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (const key in ledgerData) {
      if (!ledgerData[key]) {
        toast.warning(
          `${key.charAt(0).toUpperCase() + key.slice(1)} is required`
        );

        const fieldRef = document.querySelector(`[name="${key}"]`);
        if (fieldRef) fieldRef.focus();

        return false;
      }
    }
    return true;
  };

  const handleAddOrUpdateLedger = async () => {
    if (!ledgerData.name) {
      toast.warning(`Name is required`);
      return;
    }

    if (editIndex !== null) {
      try {
        const response = await updateLedger(
          {
            name: ledgerData?.name,
            type: ledgerData.type || "",
            particulars: ledgerData.particulars || "",
            debit: parseFloat(ledgerData.debit) || 0,
            credit: parseFloat(ledgerData.credit) || 0,
            balance: parseFloat(ledgerData.balance) || 0,
          },
          updateId
        );
        // console.log("update res ---> ", response);
        if (response.status === 200 || response.status === 201) {
          const updatedLedgers = [...ledgers];
          updatedLedgers[editIndex] = response?.data?.data;
          setLedgers(updatedLedgers);
          toast.success(
            `Ledger '${ledgerData.name || "No Name"}' updated successfully`
          );
          handleClear();
        } else {
          toast.error(
            response?.data?.message || `Failed to update ${ledgerData.name}`
          );
        }
      } catch (error) {
        toast.error(
          error?.message ||
            error?.data?.message ||
            "Error while updating ledger"
        );
      }
    } else {
      try {
        const response = await createLedger({
          name: ledgerData.name,
          type: ledgerData.type || "",
          particulars: ledgerData.particulars || "",
          debit: parseFloat(ledgerData.debit) || 0,
          credit: parseFloat(ledgerData.credit) || 0,
          balance: parseFloat(ledgerData.balance) || 0,
        });
        console.log("res ---> ", response);
        if (response.status === 200 || response.status === 201) {
          setLedgers([response?.data?.data, ...ledgers]);
          toast.success("Ledger added successfully");
          handleClear();
        } else {
          toast.error(response?.data?.message || "Failed to add ledger");
        }
      } catch (error) {
        toast.error(
          error?.message || error?.data?.message || "Error while adding ledger"
        );
      }
    }
  };

  const handleEditLedger = (index, id) => {
    const selectedLedger = ledgers[index];
    if (!selectedLedger) return;
    // console.log("sledger", selectedLedger);

    setLedgerData({
      name: selectedLedger?.name || "",
      type: selectedLedger?.type || "",
      particulars: selectedLedger?.particulars || "",
      debit: selectedLedger?.debit || "",
      credit: selectedLedger?.credit || "",
      balance: selectedLedger?.balance || "",
    });
    setEditIndex(index);
    setUpdateId(id);
    ledgerNameRef.current.focus();
  };

  const handleDeleteLedger = async (id, name) => {
    try {
      const response = await deleteLedger(id);
      if (response.status === 200) {
        setLedgers(
          ledgers.length > 0
            ? ledgers.filter((ledger) => ledger._id !== id)
            : []
        );
        toast.success(`Ledger '${name || "No Name"}' deleted successfully`);
      } else {
        toast.error(
          response?.message || response?.data?.message || "Failed to delete ledger"
        );
      }
    } catch (error) {
      toast.error(
        error?.message || error?.data?.message || "Error while deleting ledger"
      );
    }
  };

  const handleClear = () => {
    setLedgerData({
      name: "",
      type: "",
      particulars: "",
      debit: "",
      credit: "",
      balance: "",
    });
    setEditIndex(null);
  };

  const fetchLedgers = async () => {
    setIsLoading(true);
    try {
      const response = await getLedgers();
      if (response.status === 200) {
        setLedgers(response?.data?.data);
        // setTotalPages(Math.ceil(response?.data?.data.length / ledgersPerPage));
      } else {
        console.log("No ledgers to display! ", response);
      }
    } catch (error) {
      toast.error("Error fetching ledgers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  const paginatedLedgers = ledgers?.slice(0, visibleCount);

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">
        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Ledger</h1>
          </div>
        </div>

        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                ref={ledgerNameRef}
                type="text"
                name="name"
                value={ledgerData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <input
                type="text"
                name="type"
                value={ledgerData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Particulars
              </label>
              <input
                type="text"
                name="particulars"
                value={ledgerData.particulars}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Debit</label>
              <input
                type="number"
                name="debit"
                value={ledgerData.debit}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Credit</label>
              <input
                type="number"
                name="credit"
                value={ledgerData.credit}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Balance</label>
              <input
                type="number"
                name="balance"
                value={ledgerData.balance}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleAddOrUpdateLedger}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {editIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>

        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Ledger List</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <ClipLoader size={50} color="#e94560" />
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full border border-gray-300">
                <thead className="sticky top-0 bg-gray-100 shadow-md z-100">
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">S. No.</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Type</th>
                    <th className="border px-4 py-2">Particulars</th>
                    <th className="border px-4 py-2">Debit</th>
                    <th className="border px-4 py-2">Credit</th>
                    <th className="border px-4 py-2">Balance</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLedgers?.length > 0 ? (
                    paginatedLedgers?.map((ledger, index) => (
                      <tr key={ledger._id}>
                        <td className="border px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border px-4 py-2">{ledger.name}</td>
                        <td className="border px-4 py-2">{ledger.type}</td>
                        <td className="border px-4 py-2">
                          {ledger.particulars}
                        </td>
                        <td className="border px-4 py-2">{ledger.debit}</td>
                        <td className="border px-4 py-2">{ledger.credit}</td>
                        <td className="border px-4 py-2">{ledger.balance}</td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleEditLedger(index, ledger._id)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteLedger(ledger._id, ledger.name)
                            }
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center py-4">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-center">
            <button
              onClick={() =>
                setVisibleCount((prev) => Math.min(prev + 10, ledgers?.length))
              }
              className="mt-4 px-4 py-2 items-center bg-blue-600 text-white rounded-lg"
              disabled={visibleCount >= ledgers?.length}
            >
              {visibleCount >= ledgers?.length
                ? "No More Data"
                : "Load More..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ledger;

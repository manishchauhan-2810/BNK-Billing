import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { amountToWords } from '../../utils/amountToWords';
import { preventWheelChange } from '../../utils/uiHelpers';

// quickAddOptions (optional): [{ procedure, rate }] — when provided, renders
// a "pick a procedure" dropdown above the table (used by the CT Scan tab).
// Picking an option appends a new row pre-filled with that procedure & rate.
const ChargeTable = ({ items, setItems, discount, setDiscount, quickAddOptions }) => {
  const handleAddItem = () => {
    setItems([...items, { particular: '', amount: '' }]);
  };

  const handleQuickAdd = (e) => {
    const procedure = e.target.value;
    if (!procedure) return;
    const option = quickAddOptions.find(o => o.procedure === procedure);
    if (!option) return;

    // If the first row is still empty, fill it instead of adding a new one.
    const firstEmptyIndex = items.findIndex(i => !i.particular && !i.amount);
    if (firstEmptyIndex !== -1) {
      const newItems = [...items];
      newItems[firstEmptyIndex] = { particular: option.procedure, amount: option.rate };
      setItems(newItems);
    } else {
      setItems([...items, { particular: option.procedure, amount: option.rate }]);
    }
    e.target.value = '';
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const validDiscount = Math.min(Math.max(parseFloat(discount) || 0, 0), subtotal);
  const grandTotal = subtotal - validDiscount;

  return (
    <div className="space-y-4">
      {quickAddOptions && quickAddOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quick Add from Rate List</label>
          <select
            onChange={handleQuickAdd}
            defaultValue=""
            className="w-full sm:w-80 px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary text-sm bg-white"
          >
            <option value="" disabled>Select a procedure to add...</option>
            {quickAddOptions.map(o => (
              <option key={o.procedure} value={o.procedure}>{o.procedure} — ₹{o.rate}</option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 text-sm font-semibold text-gray-700 w-3/5">Particulars</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-700 w-1/3">Amount (₹)</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <tr key={index} className="bg-white">
                <td className="py-2 px-4">
                  <input
                    type="text"
                    value={item.particular}
                    onChange={(e) => handleChange(index, 'particular', e.target.value)}
                    placeholder="E.g. Package Details"
                    className="w-full px-3 py-2 border-none focus:ring-0 text-sm"
                  />
                </td>
                <td className="py-2 px-4 border-l border-gray-100">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) => handleChange(index, 'amount', e.target.value)}
                    onWheel={preventWheelChange}
                    placeholder="0.00"
                    className="no-spinner w-full px-3 py-2 border-none focus:ring-0 text-sm"
                  />
                </td>
                <td className="py-2 px-4 border-l border-gray-100 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                    className="text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center text-sm font-medium text-bnk-primary hover:text-[#1a5a4d] transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Row
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1">
          <div className="bg-bnk-secondary/5 border border-bnk-secondary/20 rounded-xl p-4 mt-4">
            <p className="text-xs text-gray-500 mb-1">Amount in words</p>
            <p className="text-sm font-medium text-bnk-primary italic">
              {amountToWords(grandTotal)}
            </p>
          </div>
        </div>

        <div className="w-full md:w-72 space-y-3">
          <div className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-xl">
            <span className="text-sm font-medium text-gray-600">Subtotal</span>
            <span className="text-sm font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2 bg-white border border-gray-200 rounded-xl">
            <span className="text-sm font-medium text-gray-600">Discount (₹)</span>
            <input
              type="number"
              min="0"
              max={subtotal}
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              onWheel={preventWheelChange}
              className="no-spinner w-24 text-right px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-bnk-secondary text-sm"
              placeholder="0.00"
            />
          </div>
          <div className="flex justify-between items-center px-4 py-3 bg-bnk-primary text-white rounded-xl shadow-md">
            <span className="text-base font-semibold">Grand Total</span>
            <span className="text-lg font-bold">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargeTable;
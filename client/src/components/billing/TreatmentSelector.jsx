import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { TREATMENTS } from '../../utils/constants';

const TreatmentSelector = ({ selectedTreatments, onChange }) => {
  const [customTreatment, setCustomTreatment] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const toggleTreatment = (treatment) => {
    if (selectedTreatments.includes(treatment)) {
      onChange(selectedTreatments.filter(t => t !== treatment));
    } else {
      onChange([...selectedTreatments, treatment]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (customTreatment.trim() && !selectedTreatments.includes(customTreatment.trim())) {
      onChange([...selectedTreatments, customTreatment.trim()]);
      setCustomTreatment('');
      setIsAddingCustom(false);
    }
  };

  const allTreatments = Array.from(new Set([...TREATMENTS, ...selectedTreatments]));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {allTreatments.map((treatment) => {
          const isSelected = selectedTreatments.includes(treatment);
          return (
            <button
              key={treatment}
              type="button"
              onClick={() => toggleTreatment(treatment)}
              className={`
                px-4 py-3 rounded-xl text-sm font-medium transition-all text-left border
                ${isSelected 
                  ? 'bg-bnk-primary text-white border-bnk-primary shadow-md' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-bnk-secondary/50 hover:bg-bnk-secondary/5'
                }
              `}
            >
              {treatment}
            </button>
          );
        })}
        
        {isAddingCustom ? (
          <form onSubmit={handleAddCustom} className="relative">
            <input
              type="text"
              autoFocus
              value={customTreatment}
              onChange={(e) => setCustomTreatment(e.target.value)}
              placeholder="Type & Enter..."
              className="w-full px-4 py-3 rounded-xl text-sm border border-bnk-secondary focus:outline-none focus:ring-2 focus:ring-bnk-secondary/20"
              onBlur={() => {
                if (!customTreatment.trim()) setIsAddingCustom(false);
              }}
            />
            <button 
              type="button" 
              onClick={() => setIsAddingCustom(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCustom(true)}
            className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium border border-dashed border-gray-300 text-gray-500 hover:text-bnk-primary hover:border-bnk-primary hover:bg-bnk-secondary/5 transition-all"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Custom
          </button>
        )}
      </div>
    </div>
  );
};

export default TreatmentSelector;

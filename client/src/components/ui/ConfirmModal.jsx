import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="bg-white rounded-2xl p-6 w-full max-w-md relative z-10 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 text-sm">{message}</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {cancelText}
              </button>
              <button 
                onClick={() => { onConfirm(); onClose(); }} 
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-bnk-primary hover:bg-[#1a5a4d]'}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;

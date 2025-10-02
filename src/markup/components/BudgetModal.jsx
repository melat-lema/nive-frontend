// src/components/BudgetModal.jsx
import React, { useState } from 'react';

function BudgetModal({ onClose, onSave, currentBudget }) {
    const [budgetAmount, setBudgetAmount] = useState(currentBudget || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (budgetAmount && parseFloat(budgetAmount) > 0) {
            onSave(parseFloat(budgetAmount));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Set Monthly Budget</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monthly Budget Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                value={budgetAmount}
                                onChange={(e) => setBudgetAmount(e.target.value)}
                                min="0"
                                step="0.01"
                                required
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Set your monthly spending limit to track your expenses
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Save Budget
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BudgetModal;
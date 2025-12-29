
import React, { useState } from 'react';
import { Transaction } from '../types';

interface FinanceTrackerProps {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
}

const FinanceTracker: React.FC<FinanceTrackerProps> = ({ transactions, addTransaction }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;
    addTransaction({
      id: Math.random().toString(36).substr(2, 9),
      description: desc,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString().split('T')[0],
      category: 'Geral'
    });
    setDesc('');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Controle Financeiro 💸</h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Descrição</label>
            <input 
              type="text" 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
              className="w-full border-brand border rounded-lg p-2 bg-gray-50"
              placeholder="Ex: Consultoria Cliente X"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Valor (R$)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="w-full border-brand border rounded-lg p-2 bg-gray-50"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Tipo</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as any)}
              className="w-full border-brand border rounded-lg p-2 bg-gray-50"
            >
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>
          <button type="submit" className="bg-brand text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Adicionar
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand/10">
            <tr>
              <th className="p-4 text-xs font-bold text-brand uppercase">Data</th>
              <th className="p-4 text-xs font-bold text-brand uppercase">Descrição</th>
              <th className="p-4 text-xs font-bold text-brand uppercase">Tipo</th>
              <th className="p-4 text-xs font-bold text-brand uppercase">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500">{t.date}</td>
                <td className="p-4 text-sm text-gray-700 font-medium">{t.description}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className="p-4 text-sm font-bold text-gray-800">
                  R$ {t.amount.toLocaleString()}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400 italic">Nenhuma transação registrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceTracker;

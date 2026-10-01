import React from 'react';
import { Database, Save } from 'lucide-react';

export default function DataEntry({ role, metrics, onMetricChange }) {
  const roleTitle = role.toUpperCase();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#121212] p-8 rounded-2xl border border-[#1f1f22]">
        <div className="flex justify-between items-center mb-8 border-b border-[#1f1f22] pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Funil de Dados - {roleTitle}</h2>
              <p className="text-sm text-gray-500 mt-1">Insira os dados atualizados para alimentar o dashboard e as projeções.</p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-lg text-sm font-medium transition-colors">
            <Save size={16} />
            Salvar Dados
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1f1f22]">
                <th className="pb-4 text-xs uppercase tracking-wider font-semibold text-gray-400">Indicador do Funil</th>
                <th className="pb-4 text-xs uppercase tracking-wider font-semibold text-gray-400 w-1/3">Valor Atual</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(metrics).map((key, index) => (
                <tr key={key} className="border-b border-[#1f1f22]/50 hover:bg-[#1a1a1a]/30 transition-colors">
                  <td className="py-5 text-sm font-medium text-gray-200">
                    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </td>
                  <td className="py-5">
                    <input 
                      type="number" 
                      value={metrics[key]}
                      onChange={(e) => onMetricChange(role, key, e.target.value)}
                      className="w-full max-w-[200px] bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg py-2 px-4 text-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

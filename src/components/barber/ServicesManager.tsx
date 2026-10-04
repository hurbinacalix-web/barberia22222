import React, { useState } from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import { Scissors, DollarSign, Check, Edit2, Plus, Clock } from 'lucide-react';
import { Service, ServiceCategory } from '../../types/barber';

export const ServicesManager: React.FC = () => {
  const { services, updateServicePrice, addService } = useBarberData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // New Service Modal
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ServiceCategory>('hair');
  const [newPrice, setNewPrice] = useState<number>(20);
  const [newDuration, setNewDuration] = useState<number>(30);
  const [newDesc, setNewDesc] = useState('');

  const handleStartEdit = (service: Service) => {
    setEditingId(service.id);
    setTempPrice(service.price);
  };

  const handleSavePrice = (id: string) => {
    updateServicePrice(id, tempPrice);
    setEditingId(null);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addService({
      name: newName.trim(),
      category: newCategory,
      price: Number(newPrice),
      durationMinutes: Number(newDuration),
      description: newDesc.trim() || 'Servicio profesional de barbería.',
      included: ['Atención personalizada', 'Productos de calidad'],
    });

    setIsAddingNew(false);
    setNewName('');
    setNewDesc('');
  };

  return (
    <div id="tarifas-servicios" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-800 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            Catálogo & Precios del Estudio
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            ADMINISTRACIÓN DE SERVICIOS Y TARIFAS
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Modifica los precios o crea nuevas opciones. Todos los ajustes se reflejan al instante
            en la aplicación para clientes.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>+ Agregar Nuevo Servicio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => {
          const isEditing = editingId === srv.id;

          return (
            <div
              key={srv.id}
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-amber-400 shrink-0" />
                    <h3 className="text-sm font-bold text-white leading-snug">{srv.name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-3">
                  <Clock className="w-3 h-3" />
                  <span>{srv.durationMinutes} min</span>
                  <span>·</span>
                  <span className="capitalize">{srv.category}</span>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              {/* Price adjustment row */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">
                    Precio actual
                  </span>
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-amber-400 font-bold">$</span>
                      <input
                        type="number"
                        min="1"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(Number(e.target.value))}
                        className="w-16 bg-neutral-950 border border-amber-500 rounded px-2 py-0.5 text-xs text-white font-mono-num font-bold focus:outline-none"
                      />
                      <span className="text-[10px] text-neutral-400">USD</span>
                    </div>
                  ) : (
                    <span className="text-lg font-black font-display text-amber-400 font-mono-num">
                      ${srv.price} <span className="text-[11px] font-normal text-neutral-400">USD</span>
                    </span>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <button
                      onClick={() => handleSavePrice(srv.id)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Guardar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(srv)}
                      className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Modificar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Service Modal */}
      {isAddingNew && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsAddingNew(false)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold font-display text-white mb-4">
              CREAR NUEVO SERVICIO
            </h3>

            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1">Nombre del Servicio *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Tinte & Matiz para Barba"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Precio ($ USD) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1">Duración (min) *</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 font-mono-num"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100"
                >
                  <option value="hair">Cortes de Cabello</option>
                  <option value="beard">Barba & Afeitado</option>
                  <option value="combo">Combos VIP</option>
                  <option value="spa">Tratamientos Spa</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detalla lo que incluye el servicio..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl cursor-pointer"
                >
                  Guardar Servicio
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

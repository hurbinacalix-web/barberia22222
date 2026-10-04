/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarberProvider, useBarberData } from './context/BarberDataContext';
import { TopNavigation } from './components/common/TopNavigation';
import { ToastContainer } from './components/common/ToastContainer';
import { ClientApp } from './components/client/ClientApp';
import { BarberApp } from './components/barber/BarberApp';
import { Scissors, User, ArrowRightLeft, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeApp, setActiveApp, appointments, haircuts } = useBarberData();
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner explaining live sync between both apps */}
      <div className="bg-amber-500 text-neutral-950 text-[11px] font-bold py-1 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">
          <strong>2 Aplicaciones Conectadas en Vivo:</strong> Lo que agendes como cliente se refleja en la agenda del barbero, y las fotos que suban los barberos aparecen en la galería de clientes.
        </span>
        <button
          onClick={() => setActiveApp(activeApp === 'client' ? 'barber' : 'client')}
          className="ml-2 px-2 py-0.5 bg-neutral-950 text-amber-400 hover:text-white rounded-md text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          <ArrowRightLeft className="w-2.5 h-2.5" />
          <span>Cambiar a {activeApp === 'client' ? 'Portal Barbero' : 'App Clientes'}</span>
        </button>
      </div>

      {/* Top Navigation conforming to strict Top Bar Contract */}
      <TopNavigation onOpenTracker={() => setIsTrackerOpen(true)} />

      {/* Main View: Client App or Barber App */}
      <main className="flex-1">
        {activeApp === 'client' ? (
          <ClientApp
            isTrackerOpen={isTrackerOpen}
            setIsTrackerOpen={setIsTrackerOpen}
          />
        ) : (
          <BarberApp />
        )}
      </main>

      {/* Floating Quick Switcher Pill for easy testing */}
      <aside aria-label="Selector de portal" className="fixed bottom-6 left-6 z-40">
        <div className="bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-md rounded-2xl p-2 shadow-2xl flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-400 text-[11px]">Viendo:</span>
            <strong className="text-amber-400 font-semibold text-xs">
              {activeApp === 'client' ? 'App Clientes' : 'Portal Barberos'}
            </strong>
          </div>

          <button
            onClick={() => setActiveApp(activeApp === 'client' ? 'barber' : 'client')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10 cursor-pointer whitespace-nowrap active:scale-95"
            title="Alternar entre la aplicación de clientes y la de barberos"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Ir a {activeApp === 'client' ? 'Portal Barberos' : 'App Clientes'}</span>
          </button>
        </div>
      </aside>

      {/* Universal Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BarberProvider>
      <MainLayout />
    </BarberProvider>
  );
}

import React, { useState, useRef } from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import { HaircutCategory, Haircut } from '../../types/barber';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Eye,
  Scissors,
  Sparkles,
  Camera,
  X,
} from 'lucide-react';

import sampleFadeCrop from '../../assets/images/haircut_fade_crop_1791087952760.jpg';
import sampleBeardSculpt from '../../assets/images/haircut_beard_sculpt_1791087962761.jpg';
import sampleClassicTaper from '../../assets/images/haircut_classic_taper_1791087973440.jpg';

export const HaircutUploader: React.FC = () => {
  const {
    barbers,
    activeBarberId,
    haircuts,
    addHaircut,
    deleteHaircut,
    showToast,
    setActiveApp,
  } = useBarberData();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [barberId, setBarberId] = useState(
    activeBarberId !== 'all' ? activeBarberId : barbers[0].id
  );
  const [category, setCategory] = useState<HaircutCategory>('fade');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Fade, Textura, BarberStudio');
  const [imageUrl, setImageUrl] = useState('');
  const [previewError, setPreviewError] = useState(false);

  // Quick preset shots for convenience
  const presetPhotos = [
    { label: 'Mid Fade Crop', url: sampleFadeCrop },
    { label: 'Barba al Vapor', url: sampleBeardSculpt },
    { label: 'Pompadour Taper', url: sampleClassicTaper },
  ];

  // Handle local file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Formato no válido', 'Por favor selecciona un archivo de imagen (JPG, PNG, WEBP).', 'warning');
      return;
    }

    // Limit to reasonable size for browser storage (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      showToast('Imagen muy pesada', 'Recomendamos fotos de menos de 3MB para rendimiento óptimo.', 'warning');
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Título requerido', 'Por favor ingresa un nombre para el corte.', 'warning');
      return;
    }

    if (!imageUrl) {
      showToast('Imagen requerida', 'Sube una foto del corte o selecciona una muestra.', 'warning');
      return;
    }

    const authorBarber = barbers.find((b) => b.id === barberId) || barbers[0];

    // Clean tags
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const todayStr = new Date().toISOString().split('T')[0];

    addHaircut({
      title: title.trim(),
      barberId: authorBarber.id,
      barberName: authorBarber.name,
      category,
      imageUrl,
      description: description.trim() || 'Corte profesional realizado en nuestro estudio.',
      date: todayStr,
      tags: tags.length > 0 ? tags : ['CortePro', 'LaHermandad'],
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setTagsInput('Fade, Textura, BarberStudio');
  };

  // Filter haircuts published by current active barber
  const myPublishedHaircuts = haircuts.filter((h) =>
    activeBarberId === 'all' ? true : h.barberId === activeBarberId
  );

  return (
    <div id="subir-corte" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-800 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            Publicador Directo al Portafolio de Clientes
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            SUBIR NUEVO CORTE REALIZADO
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Sube la fotografía del corte que acabas de realizar en el sillón. Al publicarlo,
            aparecerá de inmediato en la galería pública para que los clientes puedan verlo y solicitarlo.
          </p>
        </div>

        <button
          onClick={() => setActiveApp('client')}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto"
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Ver Galería en App Clientes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Form Column (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* 1. Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-200 mb-1.5">
              Título o Estilo del Corte *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Low Taper Fade con Textura & Barba Cuadrada"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 2. Barber & Category row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-200 mb-1.5">
                Barbero Creador *
              </label>
              <select
                value={barberId}
                onChange={(e) => setBarberId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.nickname})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-200 mb-1.5">
                Categoría del Corte *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HaircutCategory)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="fade">Degradados & Fades</option>
                <option value="beard">Barba & Navaja</option>
                <option value="classic">Clásicos & Tijera</option>
                <option value="modern">Moderno & Textura</option>
                <option value="design">Diseños Freestyle</option>
              </select>
            </div>
          </div>

          {/* 3. Image Upload Options */}
          <div>
            <label className="block text-xs font-semibold text-neutral-200 mb-1.5">
              Fotografía del Corte Realizado *
            </label>

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Drag & drop upload box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-700 hover:border-amber-400/80 rounded-2xl p-6 text-center cursor-pointer bg-neutral-950/60 hover:bg-neutral-950 transition-all flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-neutral-200">
                Toca aquí para subir foto desde tu teléfono o computadora
              </p>
              <span className="text-[11px] text-neutral-500">
                Formatos JPG, PNG, WEBP tomados en el estudio
              </span>
            </div>

            {/* Or choose from studio presets */}
            <div className="mt-3">
              <span className="text-[11px] text-neutral-400 block mb-1.5">
                O selecciona una foto de muestra del estudio:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {presetPhotos.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setImageUrl(preset.url);
                      setPreviewError(false);
                    }}
                    className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      imageUrl === preset.url
                        ? 'bg-neutral-800 border-amber-500 text-amber-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="text-[11px] font-medium truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Description & Technique */}
          <div>
            <label className="block text-xs font-semibold text-neutral-200 mb-1.5">
              Descripción de la Técnica / Productos Usados
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Desvanecido iniciado desde 0 con navaja japonesa. Marcado de contorno con lápiz blanco y secado con cepillo esqueleto y cera mate de fijación fuerte."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* 5. Tags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-200 mb-1.5">
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ej. LowFade, Textura, Tijera, PomadaMate"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 cursor-pointer active:scale-98"
          >
            <Upload className="w-4 h-4" />
            <span>Publicar Corte en la Galería de Clientes</span>
          </button>
        </form>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 lg:sticky lg:top-28">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vista Previa en App Clientes</span>
            </span>
            <span className="text-[11px] text-neutral-500">Tal como lo verá el cliente</span>
          </div>

          <div className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
            {/* Preview Image */}
            <div className="relative aspect-[4/3] bg-neutral-900 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-neutral-600">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">Sube o selecciona una foto para ver la previa</p>
                </div>
              )}

              {imageUrl && (
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="p-1 rounded-full bg-neutral-950/80 text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Preview Text */}
            <div className="p-4">
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block mb-1">
                {barbers.find((b) => b.id === barberId)?.name || 'Barbero'}
              </span>

              <h4 className="text-sm font-bold text-white mb-1">
                {title || 'Título del Corte'}
              </h4>

              <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                {description || 'Aquí aparecerá la descripción de la técnica y detalles que redactes.'}
              </p>

              <div className="flex flex-wrap gap-1 text-[10px] text-neutral-500 mb-3">
                {tagsInput.split(',').map((t, i) => (
                  <span key={i}>#{t.trim()}</span>
                ))}
              </div>

              <div className="w-full py-2 bg-neutral-800 text-neutral-300 text-center text-xs rounded-lg font-medium">
                Quiero este corte con {barbers.find((b) => b.id === barberId)?.nickname || 'el Barbero'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery of published cuts with delete management */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold font-display text-white">
              CORTES PUBLICADOS EN LA GALERÍA
            </h3>
            <span className="text-xs text-neutral-400">
              Gestiona las fotos activas en la aplicación de clientes ({myPublishedHaircuts.length} fotos)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {myPublishedHaircuts.map((cut) => (
            <div
              key={cut.id}
              className="bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-neutral-950">
                <img
                  src={cut.imageUrl}
                  alt={cut.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => deleteHaircut(cut.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-neutral-950/80 hover:bg-red-600 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Eliminar corte de la galería"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3">
                <h4 className="text-xs font-bold text-neutral-200 truncate">{cut.title}</h4>
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">{cut.barberName}</p>
                <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-2 pt-2 border-t border-neutral-800">
                  <span>{cut.date}</span>
                  <span>{cut.likes} me gusta</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

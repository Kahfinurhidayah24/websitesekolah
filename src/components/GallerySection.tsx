import React, { useState } from 'react';
import { Camera, ZoomIn, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useContent } from '../lib/content';
import { assetUrl } from '../lib/router';

export const GallerySection: React.FC = () => {
  const { content } = useContent();
  const galleryItems = content.gallery;
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['Semua', 'Kegiatan', 'Prestasi', 'Fasilitas', 'Seni Budaya'];

  const filteredItems = selectedCategory === 'Semua'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  return (
    <section id="galeri" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Camera className="w-3.5 h-3.5 text-green-600" />
            <span>Dokumentasi Sekolah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Galeri Foto Kegiatan & Prestasi
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
            Merekam jejak kebersamaan, kreativitas siswa, dan momen berharga di SDN Lubang Buaya 04 Pagi.
          </p>

          {/* Clean Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid - Uniform 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-forest-900 shadow-sm border border-slate-200 hover:border-green-400 transition-all cursor-pointer"
            >
              <img
                src={assetUrl(item.image)}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {item.category}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300 mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold font-['Outfit'] line-clamp-2">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/90 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-forest-900 rounded-3xl overflow-hidden shadow-2xl border border-forest-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-forest-950/80 text-white hover:bg-forest-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] bg-black">
              <img
                src={assetUrl(currentItem.image)}
                alt={currentItem.title}
                className="w-full h-full object-contain"
              />

              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-forest-900/80 text-white hover:bg-white hover:text-slate-900 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-forest-900/80 text-white hover:bg-white hover:text-slate-900 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 bg-forest-900 text-white border-t border-forest-800">
              <div className="flex items-center gap-2 text-xs text-amber-400 mb-1">
                <span className="px-2 py-0.5 rounded bg-green-900 text-green-200 font-bold">
                  {currentItem.category}
                </span>
                <span>{currentItem.date}</span>
              </div>
              <h3 className="text-base font-bold font-['Outfit'] text-white">
                {currentItem.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {currentItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

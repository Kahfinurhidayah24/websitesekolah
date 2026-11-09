import React, { useState } from 'react';
import { Newspaper, Calendar, Clock, ArrowRight, User, X, Sparkles } from 'lucide-react';
import { useContent } from '../lib/content';
import { NewsItem } from '../types';
import { assetUrl } from '../lib/router';

interface NewsSectionProps {
  onGoToPPDB: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onGoToPPDB }) => {
  const { content } = useContent();
  const newsItems = content.news;
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  return (
    <section id="berita" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Newspaper className="w-3.5 h-3.5 text-green-600" />
              <span>Kabar & Prestasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Berita & Prestasi Sekolah
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm max-w-xl">
              Liputan kegiatan siswa, capaian kejuaraan sains & olahraga, serta pengumuman resmi SDN Lubang Buaya 04 Pagi.
            </p>
          </div>

          <div>
            <button
              onClick={onGoToPPDB}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Info PPDB 2026/2027</span>
            </button>
          </div>
        </div>

        {/* News Grid - Clean 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-green-400 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={assetUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-green-600 text-white">
                    {item.category}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      {item.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-green-500" />
                      {item.readTime}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-['Outfit'] line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <div className="flex items-center justify-between text-xs font-bold text-green-600 pt-3 border-t border-slate-200">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
            <div className="relative aspect-[16/9]">
              <img
                src={assetUrl(selectedNews.image)}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-forest-900/80 text-white hover:bg-forest-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded bg-green-600 text-white text-[11px] font-bold">
                {selectedNews.category}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  {selectedNews.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-green-500" />
                  {selectedNews.author}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] leading-snug">
                {selectedNews.title}
              </h3>

              <div className="mt-4 space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
                {selectedNews.content}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedNews(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-forest-900 text-white hover:bg-forest-800 cursor-pointer"
                >
                  Tutup Artikel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

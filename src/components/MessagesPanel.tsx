import React, { useEffect, useState } from 'react';
import { Inbox, Loader2, Mail, MailOpen, MessageCircle, Phone, RefreshCw, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { waLink } from '../lib/maps';
import { ContactMessage } from '../types';

export const MessagesPanel: React.FC<{ onUnreadChange?: (n: number) => void }> = ({ onUnreadChange }) => {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await api.listMessages();
      setItems(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat pesan.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    onUnreadChange?.(items.filter((m) => !m.isRead).length);
  }, [items, onUnreadChange]);

  const shown = items.filter((m) => filter === 'all' || !m.isRead);
  const selected = items.find((m) => m.id === selectedId) ?? null;

  const setRead = async (m: ContactMessage, isRead: boolean) => {
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, isRead } : x)));
    try {
      await api.setMessageRead(m.id, isRead);
    } catch {
      setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, isRead: m.isRead } : x)));
    }
  };

  const open = (m: ContactMessage) => {
    setSelectedId(m.id);
    if (!m.isRead) setRead(m, true);
  };

  const remove = async (m: ContactMessage) => {
    if (!window.confirm(`Hapus pesan dari ${m.name}?`)) return;
    try {
      await api.deleteMessage(m.id);
      setItems((prev) => prev.filter((x) => x.id !== m.id));
      if (selectedId === m.id) setSelectedId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menghapus pesan.');
    }
  };

  const unread = items.filter((m) => !m.isRead).length;

  return (
    <div className="rounded-3xl border border-green-100 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-100 p-4">
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold ${filter === f ? 'bg-green-600 text-white' : 'bg-green-50 text-slate-600 hover:bg-green-100'}`}
            >
              {f === 'all' ? `Semua (${items.length})` : `Belum Dibaca (${unread})`}
            </button>
          ))}
        </div>
        <button onClick={load} className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-green-100">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Segarkan
        </button>
      </div>

      {error && <p className="m-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}

      {loading && items.length === 0 ? (
        <div className="flex justify-center py-16 text-green-600"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
          <Inbox className="h-10 w-10" />
          <p className="text-sm">{filter === 'unread' ? 'Tidak ada pesan yang belum dibaca.' : 'Belum ada pesan masuk.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <ul className="max-h-[560px] divide-y divide-green-50 overflow-y-auto lg:col-span-2 lg:border-r lg:border-green-100">
            {shown.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => open(m)}
                  className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left hover:bg-green-50 ${selectedId === m.id ? 'bg-green-50' : ''}`}
                >
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${m.isRead ? 'bg-transparent' : 'bg-amber-500'}`} />
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-xs ${m.isRead ? 'text-slate-700' : 'font-extrabold text-slate-900'}`}>{m.name}</span>
                    <span className="block truncate text-[11px] text-slate-500">{m.subject || m.message}</span>
                    <span className="block text-[10px] text-slate-400">{m.createdAt}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="p-5 lg:col-span-3">
            {!selected ? (
              <p className="py-10 text-center text-sm text-slate-400">Pilih pesan di sebelah kiri untuk membacanya.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-['Outfit'] text-base font-extrabold text-slate-900">{selected.subject || 'Tanpa subjek'}</h3>
                  <p className="text-xs text-slate-500">Dari <b className="text-slate-800">{selected.name}</b> &bull; {selected.createdAt}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-1.5 font-semibold text-sky-700 hover:bg-sky-100">
                      <Mail className="h-3.5 w-3.5" /> {selected.email}
                    </a>
                  )}
                  {selected.phone && (
                    <>
                      <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 font-semibold text-green-700 hover:bg-green-100">
                        <Phone className="h-3.5 w-3.5" /> {selected.phone}
                      </a>
                      {waLink(selected.phone) && (
                        <a href={waLink(selected.phone)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-100">
                          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                      )}
                    </>
                  )}
                </div>
                <p className="whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">{selected.message}</p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setRead(selected, !selected.isRead)} className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-green-50">
                    <MailOpen className="h-3.5 w-3.5" /> Tandai {selected.isRead ? 'belum dibaca' : 'dibaca'}
                  </button>
                  <button onClick={() => remove(selected)} className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50">
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import { ContactMessage, PPDBRegistration, RegistrationStatus } from '../types';

// Relatif terhadap index.html, jadi aman dipasang di htdocs/<folder-apa-saja>.
// Mode dev: /api di-proxy ke Apache (lihat vite.config.ts). Produksi: relatif terhadap <base> halaman.
const API_BASE: string = (import.meta.env.VITE_API_URL as string | undefined) ?? (import.meta.env.DEV ? '/api' : './api');

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/${path}`, { credentials: 'include', ...init });
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Pastikan Apache & MySQL (XAMPP) sudah aktif.');
  }
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server tidak mengembalikan JSON. Pastikan Apache aktif dan folder website ada di htdocs. Jika memakai npm run dev, jalankan dengan PHP_SERVER=http://localhost/NAMA_FOLDER (lihat README).");
  }
  if (!res.ok) throw new Error(data?.error || `Terjadi kesalahan (${res.status}).`);
  return data as T;
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export interface RegisterPayload extends Omit<PPDBRegistration, 'id' | 'registrationNo' | 'documents' | 'status' | 'createdAt' | 'distanceKm'> {}

export const api = {
  async register(payload: RegisterPayload, files: { kk?: File; akta?: File; foto?: File }) {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v ?? '')));
    (['kk', 'akta', 'foto'] as const).forEach((k) => {
      const f = files[k];
      if (f) fd.append(k, f);
    });
    const r = await request<{ registration: PPDBRegistration }>('register.php', { method: 'POST', body: fd });
    return r.registration;
  },

  async checkStatus(q: string) {
    const r = await request<{ registration: PPDBRegistration | null }>(`status.php?q=${encodeURIComponent(q)}`);
    return r.registration;
  },

  session: () => request<{ loggedIn: boolean; name: string | null }>('auth.php'),
  login: (username: string, password: string) =>
    request<{ loggedIn: boolean; name: string }>('auth.php', json('POST', { action: 'login', username, password })),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ ok: boolean }>('auth.php', json('POST', { action: 'change_password', currentPassword, newPassword })),
  logout: () => request<{ ok: boolean }>('auth.php', json('POST', { action: 'logout' })),

  async listRegistrations() {
    const r = await request<{ registrations: PPDBRegistration[] }>('registrations.php');
    return r.registrations;
  },
  async addRegistration(reg: Partial<PPDBRegistration>) {
    const r = await request<{ registration: PPDBRegistration }>('registrations.php', json('POST', reg));
    return r.registration;
  },
  async updateStatus(id: string, status: RegistrationStatus, notes?: string) {
    const r = await request<{ registration: PPDBRegistration }>('registrations.php', json('PATCH', { id, status, notes }));
    return r.registration;
  },
  async getContent() {
    const r = await request<{ content: Record<string, any> }>('content.php');
    return r.content;
  },
  saveContent: (key: string, data: unknown) =>
    request<{ ok: boolean }>('content.php', json('POST', { key, data })),
  async uploadImage(file: File) {
    const fd = new FormData();
    fd.append('image', file);
    const r = await request<{ url: string }>('upload_image.php', { method: 'POST', body: fd });
    return r.url;
  },

  // ----- Pesan Kontak -----
  sendMessage: (m: { name: string; email: string; phone: string; subject: string; message: string; website?: string }) =>
    request<{ ok: boolean }>('messages.php', json('POST', m)),
  async listMessages() {
    const r = await request<{ messages: ContactMessage[] }>('messages.php');
    return r.messages;
  },
  setMessageRead: (id: string, isRead: boolean) =>
    request<{ ok: boolean }>('messages.php', json('PATCH', { id, isRead })),
  deleteMessage: (id: string) => request<{ ok: boolean }>('messages.php', json('DELETE', { id })),

  deleteRegistration: (id: string) => request<{ ok: boolean }>('registrations.php', json('DELETE', { id })),
};

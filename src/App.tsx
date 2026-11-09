import React from 'react';
import { currentRoute } from './lib/router';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import AdminPage from './pages/AdminPage';

/**
 * Setiap rute adalah halaman penuh:
 *   /            -> Landing Page
 *   /pendaftaran -> Formulir Pendaftaran PPDB Online
 *   /admin       -> Panel Admin
 */
export default function App() {
  const route = currentRoute();
  if (route === 'pendaftaran') return <RegistrationPage />;
  if (route === 'admin') return <AdminPage />;
  return <LandingPage />;
}

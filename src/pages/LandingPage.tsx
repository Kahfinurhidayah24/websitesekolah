import React, { useState, useEffect } from 'react';
import { LoadingScreen } from '../components/LoadingScreen';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { StatsCounter } from '../components/StatsCounter';
import { ProfileVisionSection } from '../components/ProfileVisionSection';
import { PPDBInfoSection } from '../components/PPDBInfoSection';
import { AcademicProgramsSection } from '../components/AcademicProgramsSection';
import { ProgramsFacilitiesSection } from '../components/ProgramsFacilitiesSection';
import { GallerySection } from '../components/GallerySection';
import { NewsSection } from '../components/NewsSection';
import { AchievementsSection } from '../components/AchievementsSection';
import { PPDBStatusChecker } from '../components/PPDBStatusChecker';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { goTo } from '../lib/router';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('beranda');
  // Dari halaman /pendaftaran: "Lacak Status" membawa nomor registrasi lewat ?reg=...
  const [statusCheckTarget] = useState(() => new URLSearchParams(window.location.search).get('reg') ?? '');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Buka langsung ke bagian tertentu bila URL memuat #id (mis. /#cek-status)
  useEffect(() => {
    if (isLoading) return;
    const id = window.location.hash.replace('#', '');
    if (id) setTimeout(() => scrollToSection(id), 150);
  }, [isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['beranda', 'profil', 'info-ppdb', 'program', 'galeri', 'berita', 'cek-status', 'kontak'];
      const scrollY = window.scrollY + 180;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
          setActiveSection(sectionId);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-green-600 selection:text-white antialiased">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />
      <HeroSection onSearch={scrollToSection} />
      <StatsCounter />
      <ProfileVisionSection />
      <PPDBInfoSection />
      <AcademicProgramsSection />
      <ProgramsFacilitiesSection />
      <GallerySection />
      <NewsSection onGoToPPDB={() => goTo('/pendaftaran')} />
      <AchievementsSection />
      <PPDBStatusChecker initialSearchQuery={statusCheckTarget} onGoToPPDBForm={() => goTo('/pendaftaran')} />
      <ContactSection />
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}

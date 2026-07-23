import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import { useLocation } from 'react-router';
import { getLenis, useLenis } from '@/hooks/useLenis';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '@/components/Preloader';
import GrainOverlay from '@/components/GrainOverlay';
import Footer from '@/components/Footer';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import SkillsSection from '@/sections/SkillsSection';
import ExperienceSection from '@/sections/ExperienceSection';
import ProjectsSection from '@/sections/ProjectsSection';
import AchievementsSection from '@/sections/AchievementsSection';
import ReplyPilotLanding from '@/pages/replypilot';
import ProjectComingSoonPage from '@/pages/ProjectComingSoonPage';
import ReplyPilotDocsPage from '@/pages/ReplyPilotDocsPage';

function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const resetScroll = () => {
      const lenis = getLenis();
      const root = document.documentElement;
      const body = document.body;

      root.scrollTop = 0;
      body.scrollTop = 0;

      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    };

    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  return null;
}

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  useLenis();

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const scrollTarget = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (scrollTarget !== 'projects') return;

    const timer = window.setTimeout(() => {
      const projectsSection = document.querySelector('#projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isLoaded, location.state]);

  return (
    <div className="relative">
      <Preloader onComplete={handlePreloaderComplete} />
      <GrainOverlay />
      <CustomCursor />
      <Navigation />
      <main>
        <HeroSection isReady={isLoaded} />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <AchievementsSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/replypilot" element={<ReplyPilotLanding />} />
        <Route path="/projects/replypilot" element={<ReplyPilotLanding />} />
        <Route path="/projects/modelhub" element={<ProjectComingSoonPage />} />
        <Route path="/replypilot-docs" element={<ReplyPilotDocsPage />} />
      </Routes>
    </HashRouter>
  );
}

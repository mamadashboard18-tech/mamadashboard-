import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import InicioPanel from "./components/InicioPanel";
import ControlCitas from "./components/ControlCitas";
import BienestarPanel from "./components/BienestarPanel";
import PerfilPanel from "./components/PerfilPanel";
import ComunidadPanel from "./components/ComunidadPanel";
import MultimediaPanel from "./components/MultimediaPanel";
import FeatureListPanel from "./components/FeatureListPanel";
import LandingPage from "./components/landing/LandingPage";
import AuthPage from "./components/auth/AuthPage";
import OnboardingForm from "./components/onboarding/OnboardingForm";
import PartnerJoinScreen from "./components/partner/PartnerJoinScreen";
import PartnerDashboard from "./components/partner/PartnerDashboard";
import { getSession, logout, onAuthChange } from "./data/auth";
import { loadPerfil } from "./data/perfil";
import { isPartnerSession } from "./data/partner";

function getPartnerInviteToken() {
  return new URLSearchParams(window.location.search).get("partner_invite");
}

export default function App() {
  const [mode, setMode] = useState("loading");
  const [authTab, setAuthTab] = useState("login");
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("inicio");

  const handleNavigate = (section) => {
    setActive(section);
  };

  const enterApp = async (session) => {
    setUser(session);
    const esPartner = await isPartnerSession(session.id);
    if (esPartner) {
      setMode("partner-dashboard");
      return;
    }
    const perfil = await loadPerfil();
    setMode(perfil.onboardingCompleted ? "dashboard" : "onboarding");
  };

  useEffect(() => {
    const inviteToken = getPartnerInviteToken();

    getSession().then((session) => {
      if (session && !inviteToken) {
        enterApp(session);
        return;
      }
      setUser(null);
      setMode(inviteToken ? "partner-join" : "landing");
    });

    return onAuthChange((session) => {
      if (session) {
        if (getPartnerInviteToken()) return;
        enterApp(session);
      } else {
        setUser(null);
        setMode((current) =>
          ["dashboard", "onboarding", "partner-dashboard"].includes(current) ? "landing" : current
        );
      }
    });
  }, []);

  const handleAuthSuccess = (loggedUser) => {
    enterApp(loggedUser);
  };

  const handleOnboardingComplete = () => {
    setMode("dashboard");
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setMode("landing");
  };

  if (mode === "loading") {
    return null;
  }

  if (mode === "partner-join") {
    return (
      <PartnerJoinScreen
        token={getPartnerInviteToken()}
        onJoined={() => {
          const params = new URLSearchParams(window.location.search);
          params.delete("partner_invite");
          const query = params.toString();
          window.history.replaceState({}, "", window.location.pathname + (query ? `?${query}` : ""));
          getSession().then((session) => session && enterApp(session));
        }}
      />
    );
  }

  if (mode === "partner-dashboard") {
    return <PartnerDashboard />;
  }

  if (mode === "landing") {
    return (
      <LandingPage
        onGoToAuth={(tab) => {
          setAuthTab(tab);
          setMode("auth");
        }}
        onDevPreview={() => setMode("dashboard")}
      />
    );
  }

  if (mode === "auth") {
    return (
      <AuthPage
        initialTab={authTab}
        onSuccess={handleAuthSuccess}
        onBack={() => setMode("landing")}
      />
    );
  }

  if (mode === "onboarding") {
    return <OnboardingForm nombre={user?.nombre} onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="h-dvh bg-[var(--bg)] flex flex-col">
      <div className="flex flex-1 min-h-0">
        <Sidebar active={active} onSelect={(id) => handleNavigate(id)} onLogout={handleLogout} />
        <main className="flex-1 p-4 pb-28 sm:p-6 lg:p-8 lg:pb-8 max-w-5xl overflow-y-auto">
          {active === "inicio" ? (
            <InicioPanel nombre={user?.nombre} onNavigate={handleNavigate} />
          ) : active === "citas" ? (
            <ControlCitas onNavigate={handleNavigate} />
          ) : active === "bienestar" ? (
            <BienestarPanel onNavigate={handleNavigate} />
          ) : active === "perfil" ? (
            <PerfilPanel onLogout={handleLogout} />
          ) : active === "comunidad" ? (
            <ComunidadPanel nombre={user?.nombre} />
          ) : active === "multimedia" ? (
            <MultimediaPanel />
          ) : (
            <FeatureListPanel sectionId={active} />
          )}
        </main>
      </div>
      <BottomNav active={active} onSelect={(id) => handleNavigate(id)} />
    </div>
  );
}

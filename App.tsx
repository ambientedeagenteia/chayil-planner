
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AppView, AppState, Transaction } from './types';
import { INITIAL_WHEEL, HABITS_LIST } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WheelOfLife from './components/WheelOfLife';
import HabitTracker from './components/HabitTracker';
import TasksHub from './components/TasksHub';
import FinanceTracker from './components/FinanceTracker';
import ContentPlanner from './components/ContentPlanner';
import AICoach from './components/AICoach';

// Supabase Configuration provided by user
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yakrabucpqunsraciwcu.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlha3JhYnVjcHF1bnNyYWNpd2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjEwNzYsImV4cCI6MjA4MjU5NzA3Nn0.XZdaQu3DD3MAA0HJmyL-ofzcWQt-TJV1zlixX-AjZX0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AUTO_AFFIRMATIONS = [
  "Eu sou capaz de transformar meus sonhos em realidade com disciplina e foco.",
  "Minha mente é focada e meus objetivos são claros.",
  "Cada desafio é uma oportunidade de crescimento para minha empresa.",
  "Eu atraio prosperidade e abundância em todos os meus projetos.",
  "Minha liderança inspira e motiva todos ao meu redor.",
  "A disciplina é o segredo que me leva aos mais altos patamares.",
  "Hoje eu escolho a excelência em cada pequena ação."
];

interface UserAuth {
  id: string;
  name: string;
  email: string;
}

const Logo3D = ({ className = "" }: { className?: string }) => (
  <h1 className={`font-normal text-black serif no-select flex justify-center items-end leading-none ${className}`}>
    Chay<span className="relative inline-block leading-none">ı<span className="absolute top-[2px] left-[1px] w-3 h-3 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.4),2px_2px_4px_rgba(0,0,0,0.2)]" style={{ background: 'radial-gradient(circle at 35% 35%, #FFF9E3 0%, #D4AF37 40%, #8B6B10 100%)' }}></span></span>l
  </h1>
);

const LoginScreen = ({ onLoginSuccess }: { onLoginSuccess: (user: UserAuth) => void }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (signUpError) throw signUpError;
        setNeedsVerification(true);
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        if (data.user) {
          onLoginSuccess({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata.full_name || 'Usuária Chayıl'
          });
        }
      }
    } catch (err: any) {
      setError(err.message || "Erro na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  if (needsVerification) {
    return (
      <div className="min-h-screen bg-[#f4ecdc] flex items-center justify-center p-6 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-black/5">
          <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <span className="text-3xl">✉️</span>
          </div>
          <h2 className="text-3xl font-black serif italic mb-4">Verifique seu e-mail</h2>
          <p className="text-gray-600 mb-8 serif leading-relaxed">Enviamos um link de ativação para o seu e-mail. <br/><strong>O acesso será liberado automaticamente após a confirmação.</strong></p>
          <button onClick={() => setNeedsVerification(false)} className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black transition-all">Voltar para o Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4ecdc] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#fbe3d1] rounded-[3rem] shadow-2xl overflow-hidden border border-black/5 animate-fade-in">
        <div className="bg-black p-10 text-center">
          <Logo3D className="text-white text-4xl" />
          <p className="text-[10px] tracking-[0.2em] text-[#e2b089] uppercase mt-4 font-black">Luxury Planner Hub</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-[10px] font-bold text-center rounded-xl border border-red-100">{error}</div>}
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome Completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como deseja ser chamada?" className="w-full p-4 bg-white/50 border border-black/5 rounded-2xl text-sm outline-none serif italic" required />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full p-4 bg-white/50 border border-black/5 rounded-2xl text-sm outline-none" required />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-4 bg-white/50 border border-black/5 rounded-2xl text-sm outline-none" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-[#D4AF37] transition-all disabled:opacity-50 shadow-xl active:scale-95">
            {loading ? 'Aguarde...' : (isRegistering ? 'Cadastrar Agora' : 'Acessar Meu Hub')}
          </button>
          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-black/5 w-full absolute"></div>
            <span className="bg-[#fbe3d1] px-4 text-[10px] text-gray-400 font-black uppercase relative z-10">ou</span>
          </div>
          <button type="button" onClick={handleGoogleLogin} className="w-full bg-white border border-black/10 text-gray-700 p-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm">
             <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
             Entrar com Google
          </button>
          <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="w-full text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all pt-4">
            {isRegistering ? 'Já possui conta? Clique aqui' : 'Não tem conta? Cadastre-se gratuitamente'}
          </button>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeUser, setActiveUser] = useState<UserAuth | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [currentView, setView] = useState<AppView>(AppView.DASHBOARD);
  const [state, setState] = useState<AppState>({
    userName: "", tasks: [], habits: HABITS_LIST.map((h, i) => ({ id: `h-${i}`, name: h, days: new Array(7).fill(false) })),
    wheel: INITIAL_WHEEL, wheelHistory: [], ideas: "", notes: "", dailyAffirmation: "", focoHoje: "",
    team: [], clients: [], meetings: [], planning: { diario: "", semanal: "", mensal: "", anual: "" },
    selfCare: [], family: [], financePersonal: [], financeBusiness: [], healthRecords: []
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setActiveUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || 'Usuária Chayıl'
        });
      }
      setInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setActiveUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || 'Usuária Chayıl'
        });
      } else {
        setActiveUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (activeUser) {
      const storageKey = `chayil_v3_data_${activeUser.id}`;
      const savedData = localStorage.getItem(storageKey);
      const randomAff = AUTO_AFFIRMATIONS[Math.floor(Math.random() * AUTO_AFFIRMATIONS.length)];
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setState({ ...parsed, dailyAffirmation: randomAff });
      } else {
        setState(prev => ({ ...prev, userName: activeUser.name, dailyAffirmation: randomAff }));
      }
    }
  }, [activeUser]);

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem(`chayil_v3_data_${activeUser.id}`, JSON.stringify(state));
    }
  }, [state, activeUser]);

  const updateState = (updates: Partial<AppState>) => setState(prev => ({ ...prev, ...updates }));

  const renderView = () => {
    switch (currentView) {
      case AppView.TASKS_HUB: return <TasksHub state={state} updateState={updateState} />;
      case AppView.WHEEL_OF_LIFE: return <WheelOfLife state={state} updateState={updateState} />;
      case AppView.HABIT_TRACKER: return <HabitTracker state={state} updateState={updateState} />;
      case AppView.FINANCE_PERSONAL: 
        return <FinanceTracker transactions={state.financePersonal} addTransaction={(t) => updateState({ financePersonal: [...state.financePersonal, t] })} />;
      case AppView.FINANCE_BUSINESS: 
        return <FinanceTracker transactions={state.financeBusiness} addTransaction={(t) => updateState({ financeBusiness: [...state.financeBusiness, t] })} />;
      case AppView.MARKETING_HUB: return <ContentPlanner />;
      case AppView.SETTINGS: return <AICoach />;
      case AppView.DASHBOARD:
      default:
        return <Dashboard state={state} updateState={updateState} setView={setView} />;
    }
  };

  if (initializing) return (
    <div className="min-h-screen bg-[#f4ecdc] flex flex-col items-center justify-center">
      <Logo3D className="text-4xl mb-6 animate-pulse" />
      <div className="w-48 h-1 bg-black/5 rounded-full overflow-hidden">
        <div className="w-full h-full bg-[#D4AF37] animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
  );

  if (!activeUser) return <LoginScreen onLoginSuccess={setActiveUser} />;

  return (
    <div className="flex min-h-screen bg-[#f4ecdc]">
      <Sidebar currentView={currentView} setView={setView} />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 lg:p-12 overflow-x-hidden transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10 md:hidden">
             <Logo3D className="text-2xl" />
             <button onClick={() => setView(AppView.DASHBOARD)} className="bg-black text-white p-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Início</button>
          </div>
          {renderView()}
        </div>
      </main>
      
      {/* Mobile Floating Logout Button */}
      <button 
        onClick={() => { if(confirm("Deseja sair?")) supabase.auth.signOut(); }}
        className="fixed bottom-6 right-6 md:hidden w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border border-black/5 z-50 active:scale-90 transition-transform"
      >
        <span className="text-xl">🚪</span>
      </button>
    </div>
  );
};
export default App;

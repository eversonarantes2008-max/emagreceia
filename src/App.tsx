/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db 
} from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  onSnapshot,
  collection,
  getDocs
} from 'firebase/firestore';

import { 
  Heart, 
  Droplet, 
  Dumbbell, 
  CheckCircle, 
  BookOpen, 
  Scale, 
  Download, 
  ShoppingCart, 
  Sparkles, 
  User as UserIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  Moon, 
  Sun, 
  ChevronRight, 
  Play, 
  Volume2, 
  Flame, 
  Clock, 
  HelpCircle,
  Lock,
  Copy,
  Check,
  Eye,
  EyeOff,
  Loader2,
  CreditCard,
  QrCode,
  ShieldCheck,
  Mail,
  Zap,
  CheckCircle2,
  AlertCircle,
  Award,
  Crown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Subcomponents
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { QuestionnaireForm } from './components/QuestionnaireForm';
import { WeightChart } from './components/WeightChart';
import { WorkoutTimer } from './components/WorkoutTimer';
import { PushWorkoutGuide } from './components/PushWorkoutGuide';
import { NotificationBanner } from './components/NotificationBanner';
import { HydrationTipCard } from './components/HydrationTipCard';
import { BeforeAfterComparison } from './components/BeforeAfterComparison';
import { SleepHygieneCard } from './components/SleepHygieneCard';
import { WeeklyProgressCard } from './components/WeeklyProgressCard';
import { RemindersWidget } from './components/RemindersWidget';
import { HealthyShoppingTipsCard } from './components/HealthyShoppingTipsCard';
import { downloadPlanPDF, downloadHealthReportPDF } from './utils/pdfGenerator';
import { UserProfile, QuestionnaireData, LevePlan, Meal, Recipe, Workout, ShoppingCategory } from './types';
import { LogoIcon, FullLogo } from './components/Logo';
import { generateMockPlan, generateMealsForDay } from './mockGenerator';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // App Navigation & Theme
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'meals' | 'workouts' | 'shopping' | 'progress' | 'faq'>('dashboard');
  const [selectedMealDay, setSelectedMealDay] = useState<number>(1);
  const [darkMode, setDarkMode] = useState(false);

  // Active workout timer modal
  const [activeWorkoutForTimer, setActiveWorkoutForTimer] = useState<Workout | null>(null);

  // Quick weight log entry modal or field
  const [weightInput, setWeightInput] = useState('');

  // Active recipe modal for detailed instructions
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDaily, setIsGeneratingDaily] = useState(false);
  const [generationWarning, setGenerationWarning] = useState('');

  // Checklist of purchased grocery items
  const [purchasedGroceries, setPurchasedGroceries] = useState<string[]>([]);
  const [workoutSubTab, setWorkoutSubTab] = useState<'guide' | 'cards'>('guide');

  // Plans & Payment Modal State
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<'basic' | 'premium' | null>(null);
  const [paymentMethodTab, setPaymentMethodTab] = useState<'pix' | 'credit_card'>('pix');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [adminUsersList, setAdminUsersList] = useState<UserProfile[]>([]);
  const [isLoadingAdminUsers, setIsLoadingAdminUsers] = useState(false);

  // Fetch users for Master Admin Panel
  const fetchAdminUsers = async () => {
    setIsLoadingAdminUsers(true);
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const fetchedList: UserProfile[] = [];
      querySnapshot.forEach((docSnap) => {
        fetchedList.push(docSnap.data() as UserProfile);
      });

      // Sort: pending users first
      fetchedList.sort((a, b) => {
        if (a.isApproved === b.isApproved) return 0;
        return a.isApproved ? 1 : -1;
      });

      setAdminUsersList(fetchedList);
    } catch (err) {
      console.warn('Error fetching Firestore users for admin panel, checking local storage:', err);
      const localUsers: UserProfile[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('profile_')) {
          try {
            const val = JSON.parse(localStorage.getItem(key) || '{}');
            if (val && val.email) localUsers.push(val);
          } catch (e) {}
        }
      }
      setAdminUsersList(localUsers);
    } finally {
      setIsLoadingAdminUsers(false);
    }
  };

  // Master Admin approves user and plan
  const handleApproveUserByAdmin = async (targetUser: UserProfile, targetPlan: 'basic' | 'premium') => {
    try {
      const isPrem = targetPlan === 'premium';
      const targetRef = doc(db, 'users', targetUser.uid);
      const updatePayload = {
        isApproved: true,
        isPremium: isPrem,
        planType: targetPlan,
        paymentStatus: 'paid',
        premiumStatus: isPrem ? 'approved' : 'none',
        hasEnteredPremiumPassword: true
      };

      try {
        await updateDoc(targetRef, updatePayload);
      } catch (writeErr) {
        console.warn('Could not write to Firestore directly, updating local fallback profile:', writeErr);
        localStorage.setItem(`profile_${targetUser.uid}`, JSON.stringify({
          ...targetUser,
          ...updatePayload
        }));
      }

      // Send confirmation email notification to user
      try {
        await fetch('/api/notify-user-approval', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: targetUser.email,
            planType: targetPlan
          })
        });
      } catch (apiErr) {
        console.warn('Erro ao notificar usuário via e-mail:', apiErr);
      }

      alert(`Acesso do usuário ${targetUser.email} para o Plano ${targetPlan.toUpperCase()} liberado com sucesso! E-mail de confirmação enviado.`);
      await fetchAdminUsers();
    } catch (err) {
      console.error('Erro na aprovação do administrador:', err);
      alert('Ocorreu um erro ao tentar liberar o acesso do usuário.');
    }
  };

  // 1. Monitor Authentication State and Setup Real-time Profile Listener
  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        unsubscribeProfile = await setupProfileListener(currentUser);
      } else {
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
        setProfile(null);
        setIsAuthLoading(false);
      }
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const setupProfileListener = async (firebaseUser: User) => {
    const isMaster = firebaseUser.email === 'everson.arantes.2008@gmail.com';
    const localKey = `profile_${firebaseUser.uid}`;

    const getLocalSkeleton = (): UserProfile => {
      const saved = localStorage.getItem(localKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            if (isMaster) {
              parsed.isApproved = true;
              parsed.isPremium = true;
              parsed.planType = 'premium';
              parsed.paymentStatus = 'paid';
            }
            return parsed;
          }
        } catch (err) {
          console.error('Error parsing local profile:', err);
        }
      }
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        createdAt: new Date().toISOString(),
        streakDays: 1,
        currentWeight: 75,
        weightHistory: [],
        waterLogs: {},
        completedChecklist: {},
        isApproved: isMaster,
        planType: isMaster ? 'premium' : undefined,
        paymentStatus: isMaster ? 'paid' : 'pending',
        isPremium: isMaster,
        premiumStatus: isMaster ? 'approved' : 'none',
        hasEnteredPremiumPassword: isMaster,
        hasCompletedOnboarding: false
      };
    };

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      
      // Attempt to retrieve profile from Firestore
      let userSnap;
      try {
        userSnap = await getDoc(userRef);
      } catch (firestoreErr) {
        console.warn('Firestore is unreachable or permission denied. Falling back to localStorage.', firestoreErr);
        const fallbackProfile = getLocalSkeleton();
        setProfile(fallbackProfile);
        setIsAuthLoading(false);
        // If there has no plan, show onboarding, else skip
        if (fallbackProfile.plan || fallbackProfile.hasCompletedOnboarding) {
          setShowOnboarding(false);
        } else {
          setShowOnboarding(true);
        }
        return () => {};
      }

      if (!userSnap.exists()) {
        const initialProfile = getLocalSkeleton();
        try {
          await setDoc(userRef, initialProfile);
        } catch (writeErr) {
          console.warn('Failed to write initial profile to Firestore. Using local fallback.', writeErr);
          localStorage.setItem(localKey, JSON.stringify(initialProfile));
        }
      } else {
        // Ensure master email has premium activated
        const existingData = userSnap.data() as UserProfile;
        if (isMaster && (!existingData.isPremium || existingData.premiumStatus !== 'approved')) {
          try {
            await updateDoc(userRef, {
              isPremium: true,
              premiumStatus: 'approved',
              hasEnteredPremiumPassword: true
            });
          } catch (writeErr) {
            console.warn('Failed to update premium on Firestore:', writeErr);
          }
        }
      }

      // Sync grocery checklist state from storage or fallback
      const savedGroceries = localStorage.getItem(`groceries_${firebaseUser.uid}`);
      if (savedGroceries) {
        setPurchasedGroceries(JSON.parse(savedGroceries));
      }

      // Setup real-time listener for profile modifications
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          
          // Ensure arrays and maps are initialized to prevent crashes
          if (!data.weightHistory) data.weightHistory = [];
          if (!data.waterLogs) data.waterLogs = {};
          if (!data.completedChecklist) data.completedChecklist = {};
          if (data.streakDays === undefined) data.streakDays = 1;
          
          // Guarantee that UI state for master user is always approved & premium
          if (isMaster) {
            data.isApproved = true;
            data.isPremium = true;
            data.planType = 'premium';
            data.paymentStatus = 'paid';
            data.premiumStatus = 'approved';
            data.hasEnteredPremiumPassword = true;
          }

          localStorage.setItem(localKey, JSON.stringify(data));
          setProfile(data);
          
          // If user already has completed onboarding or has a plan, skip onboarding
          if (data.plan || data.hasCompletedOnboarding) {
            setShowOnboarding(false);
          } else {
            setShowOnboarding(true);
          }
        } else {
          const fallback = getLocalSkeleton();
          setProfile(fallback);
        }
        setIsAuthLoading(false);
      }, (error) => {
        console.warn('Error on profile snapshot listener. Falling back to localStorage.', error);
        const fallback = getLocalSkeleton();
        setProfile(fallback);
        setIsAuthLoading(false);
        if (fallback.plan || fallback.hasCompletedOnboarding) {
          setShowOnboarding(false);
        } else {
          setShowOnboarding(true);
        }
      });

      return unsubscribe;
    } catch (e) {
      console.error('Error setting up profile listener, using local fallback:', e);
      const fallback = getLocalSkeleton();
      setProfile(fallback);
      setIsAuthLoading(false);
      if (fallback.plan || fallback.hasCompletedOnboarding) {
        setShowOnboarding(false);
      } else {
        setShowOnboarding(true);
      }
      return () => {};
    }
  };

  const saveProfileUpdate = async (updatedFields: Partial<UserProfile>) => {
    if (!user || !profile) return;
    const mergedProfile = { ...profile, ...updatedFields };
    
    // 1. Update local state
    setProfile(mergedProfile);
    
    // 2. Save copy to localStorage as robust fallback
    localStorage.setItem(`profile_${user.uid}`, JSON.stringify(mergedProfile));
    
    // 3. Try saving to Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updatedFields);
    } catch (e) {
      console.warn('Failed to write update to Firestore, fallback to local storage succeeded.', e);
    }
  };

  // 2. Load custom Dark Mode
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 3. User Sign In & Sign Up Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);
    try {
      if (isRegistering) {
        if (email.trim().toLowerCase() === 'everson.arantes.2008@gmail.com') {
          setAuthError('O e-mail Master já está registrado. Por favor, use a opção de Entrar com a senha correta.');
          setIsAuthLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Notify admin via email route
        try {
          await fetch('/api/notify-admin-signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: userCredential.user.email,
              uid: userCredential.user.uid,
              planType: 'pending'
            })
          });
        } catch (notifyErr) {
          console.warn('Falha ao enviar notificação ao administrador:', notifyErr);
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        setAuthError('Senha incorreta.');
      } else if (err.code === 'auth/user-not-found') {
        setAuthError('Usuário não encontrado.');
      } else if (err.code === 'auth/email-already-in-use') {
        setAuthError('E-mail já cadastrado.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('A senha deve ter pelo menos 6 caracteres.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setAuthError('O login por E-mail e Senha está desativado no Firebase Console. Ative em: Authentication > Sign-in method.');
      } else {
        setAuthError('Erro ao realizar autenticação. Tente novamente.');
      }
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Generate coaching plan with Gemini
  const handleGeneratePlan = async (questionnaire: QuestionnaireData) => {
    if (!user || !profile) return;
    setIsGenerating(true);
    setGenerationWarning('');

    try {
      console.log('Sending request to /api/generate-plan with questionnaire...');
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionnaire })
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar o plano do servidor.');
      }

      const responseData = await response.json();
      const generatedPlan = responseData.plan as LevePlan;

      if (responseData.warning) {
        setGenerationWarning(responseData.warning);
      }

      const todayString = new Date().toISOString().split('T')[0];

      // Add start weight into weight history
      const history = profile.weightHistory || [];
      const initialWeightHistory = history.length === 0 
        ? [{ data: todayString, peso: questionnaire.peso }]
        : history;

      const updatedProfile: Partial<UserProfile> = {
        questionnaire,
        plan: generatedPlan,
        currentWeight: questionnaire.peso,
        weightHistory: initialWeightHistory,
        hasCompletedOnboarding: true
      };

      await saveProfileUpdate(updatedProfile);

      // Successfully completed, skip to dashboard
      setShowOnboarding(false);
      setCurrentTab('dashboard');
    } catch (err: any) {
      console.error('Error generating plan, falling back to local generator:', err);
      try {
        const generatedPlan = generateMockPlan(questionnaire);
        const todayString = new Date().toISOString().split('T')[0];

        const history = profile.weightHistory || [];
        const initialWeightHistory = history.length === 0 
          ? [{ data: todayString, peso: questionnaire.peso }]
          : history;

        const updatedProfile: Partial<UserProfile> = {
          questionnaire,
          plan: generatedPlan,
          currentWeight: questionnaire.peso,
          weightHistory: initialWeightHistory,
          hasCompletedOnboarding: true
        };

        await saveProfileUpdate(updatedProfile);
        setGenerationWarning('Nota: Plano gerado com sucesso localmente. Aproveite seu acompanhamento!');

        // Successfully completed, skip to dashboard
        setShowOnboarding(false);
        setCurrentTab('dashboard');
      } catch (fallbackErr) {
        console.error('Fallback generation failed:', fallbackErr);
        alert('Erro ao se conectar ao servidor de IA. Tente novamente.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // 5. User Interactive Logging (Water, weight, Checklist)
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleAddWater = async (amountMl: number) => {
    if (!user || !profile) return;
    const today = getTodayDateString();
    const currentWater = profile.waterLogs[today] || 0;
    const nextWater = Math.max(0, currentWater + amountMl);

    const updatedWaterLogs = {
      ...profile.waterLogs,
      [today]: nextWater
    };

    await saveProfileUpdate({ waterLogs: updatedWaterLogs });
  };

  const handleLogWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(weightInput);
    if (isNaN(value) || value <= 0 || !user || !profile) return;

    const today = getTodayDateString();
    const cleanHistory = profile.weightHistory ? [...profile.weightHistory] : [];
    
    // Check if we already logged weight today, if so, replace it
    const existingIndex = cleanHistory.findIndex(h => h.data === today);
    if (existingIndex >= 0) {
      cleanHistory[existingIndex].peso = value;
    } else {
      cleanHistory.push({ data: today, peso: value });
    }

    await saveProfileUpdate({
      currentWeight: value,
      weightHistory: cleanHistory
    });
    setWeightInput('');
    alert('Peso registrado com sucesso no histórico!');
  };

  const handleToggleChecklistItem = async (item: string) => {
    if (!user || !profile) return;
    const today = getTodayDateString();
    const completedForToday = profile.completedChecklist[today] ? [...profile.completedChecklist[today]] : [];

    let nextList: string[];
    if (completedForToday.includes(item)) {
      nextList = completedForToday.filter((i) => i !== item);
    } else {
      nextList = [...completedForToday, item];
    }

    const nextChecklist = {
      ...profile.completedChecklist,
      [today]: nextList
    };

    await saveProfileUpdate({ completedChecklist: nextChecklist });
  };

  const handleToggleGrocery = (item: string) => {
    let nextList: string[];
    if (purchasedGroceries.includes(item)) {
      nextList = purchasedGroceries.filter((g) => g !== item);
    } else {
      nextList = [...purchasedGroceries, item];
    }
    setPurchasedGroceries(nextList);
    if (user) {
      localStorage.setItem(`groceries_${user.uid}`, JSON.stringify(nextList));
    }
  };

  // 6. Reset Plan / Recalculate
  const handleResetPlan = async () => {
    if (window.confirm('Deseja realmente atualizar suas informações e gerar um novo plano do Gemini? Seu histórico de progresso continuará salvo.')) {
      await saveProfileUpdate({
        plan: null,
        questionnaire: null,
        hasCompletedOnboarding: true
      });
      setShowOnboarding(false);
    }
  };

  const handleGenerateDailyVariation = async () => {
    if (!user || !profile || !profile.questionnaire) return;
    setIsGeneratingDaily(true);
    try {
      const todayStr = getTodayDateString();
      const activeDayVal = getActiveDayOfPlan();
      
      const response = await fetch('/api/generate-daily-variation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionnaire: profile.questionnaire,
          activeDay: activeDayVal
        })
      });
      
      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }
      
      const data = await response.json();
      const variation = data.variation;
      
      const updatedVariations = {
        ...(profile.dailyVariations || {}),
        [todayStr]: variation
      };
      
      await saveProfileUpdate({
        dailyVariations: updatedVariations
      });
      
      if (data.warning) {
        alert(data.warning);
      } else {
        alert('Sensacional! Novas receitas e treinos inovadores foram gerados pela inteligência artificial para o seu dia de hoje para garantir a diversidade e flexibilidade de sua rotina!');
      }
    } catch (error) {
      console.error('Erro ao gerar variação diária, usando fallback local inteligente:', error);
      const todayStr = getTodayDateString();
      const activeDayVal = getActiveDayOfPlan();
      const { generateMockDailyVariation: fallbackGenerator } = await import('./mockGenerator');
      const fallbackVariation = fallbackGenerator(profile.questionnaire, activeDayVal);
      const updatedVariations = {
        ...(profile.dailyVariations || {}),
        [todayStr]: fallbackVariation
      };
      await saveProfileUpdate({
        dailyVariations: updatedVariations
      });
      alert('Variação diária inteligente com novas opções de receitas e treino criada com sucesso!');
    } finally {
      setIsGeneratingDaily(false);
    }
  };

  // Current active day calculation based on user's registration
  const getActiveDayOfPlan = () => {
    if (!profile?.createdAt) return 1;
    const diffTime = Math.abs(new Date().getTime() - new Date(profile.createdAt).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(30, diffDays);
  };

  const activeDay = getActiveDayOfPlan();
  const todayStr = getTodayDateString();
  const currentDayPlan = profile?.plan?.plano30Dias.find((d) => d.dia === activeDay) || profile?.plan?.plano30Dias[0];

  // Render main login / registration
  const renderLogin = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        
        {/* Soft decorative background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-6 flex flex-col items-center justify-center">
          <FullLogo size={110} />
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wide">
            Seu Coach de Saúde Personalizado com Inteligência Artificial
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400">
            {authError}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
              Endereço de E-mail
            </label>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
              Sua Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer p-1"
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                id="toggle-password-visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isAuthLoading ? 'Aguarde...' : isRegistering ? 'Cadastrar Minha Conta' : 'Entrar no LeveAI'}
          </button>
        </form>

        <div className="mt-4 flex justify-center items-center text-xs">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            {isRegistering ? 'Já tem conta? Faça Login' : 'Criar nova conta'}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed text-center">
          <strong>🔒 Autenticação e Dados Seguros:</strong> Implementado com Firebase Authentication para garantir a máxima segurança dos seus dados de saúde.
        </div>
      </div>
    </div>
  );

  // Loading animation view
  const renderLoadingScreen = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
      <div className="p-4 mb-3">
        <LogoIcon size={90} className="animate-pulse" />
      </div>
      <p className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 animate-pulse">
        Carregando seu plano saudável...
      </p>
    </div>
  );

  // Splash view wrapper
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Auth checking wrapper
  if (isAuthLoading) {
    return renderLoadingScreen();
  }

  // Login view wrapper
  if (!user) {
    return renderLogin();
  }

  // Onboarding wrapper
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Onboarding onComplete={async () => {
          setShowOnboarding(false);
          await saveProfileUpdate({ hasCompletedOnboarding: true });
        }} />
      </div>
    );
  }

  // Questionnaire wrapper (if plan doesn't exist yet)
  if (!profile?.plan) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:py-12">
        {isGenerating ? (
          <div className="text-center p-6 max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl">
            <div className="relative inline-flex p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100/30 text-blue-600 dark:text-blue-400 mb-4 animate-spin">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Sua Inteligência Saudável está em Preparo!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              O Gemini está gerando um cronograma de 30 dias totalmente exclusivo, incluindo metas diárias, plano alimentar, lista de compras e rotina de exercícios com base nas suas preferências e restrições.
            </p>
            {/* Staggered progress bar */}
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-6 overflow-hidden relative">
              <div className="absolute top-0 bottom-0 left-0 bg-blue-600 dark:bg-blue-500 animate-pulse w-3/4" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-3">
              "A saúde é a maior das vitórias. Aguarde alguns segundos."
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white mb-1">
              Fale-nos sobre você
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 text-center max-w-sm">
              Seus dados serão processados de maneira segura pela IA do Gemini para gerar seu cardápio de 30 dias.
            </p>
            <QuestionnaireForm onSubmit={handleGeneratePlan} isGenerating={isGenerating} />
          </>
        )}
      </div>
    );
  }

  // Payment Modal Helper
  const renderPaymentModal = () => {
    if (!showPaymentModal || !selectedPlanForPayment) return null;

    const isPremiumPlan = selectedPlanForPayment === 'premium';
    const planName = isPremiumPlan ? 'Plano Premium LeveAI' : 'Plano Básico LeveAI';
    const planPrice = isPremiumPlan ? 'R$ 27,00' : 'R$ 15,00';
    const pixKey = "00020126360014BR.GOV.BCB.PIX0114+551199999999952040000530398654000000000";

    const handleCopyPix = () => {
      navigator.clipboard.writeText(pixKey);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2500);
    };

    const handleConfirmPayment = async () => {
      setIsProcessingPayment(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const isPrem = selectedPlanForPayment === 'premium';
      const isMasterUser = user?.email === 'everson.arantes.2008@gmail.com';

      // Send email notification request to server for Master Admin
      try {
        await fetch('/api/notify-admin-plan-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: profile?.email || user?.email,
            userUid: profile?.uid || user?.uid,
            planType: selectedPlanForPayment,
            paymentMethod: paymentMethodTab
          })
        });
      } catch (err) {
        console.warn('Erro ao notificar Administrador Master:', err);
      }

      if (isMasterUser) {
        // Master user gets instant approval
        await saveProfileUpdate({
          planType: selectedPlanForPayment,
          paymentMethod: paymentMethodTab,
          paymentStatus: 'paid',
          isApproved: true,
          isPremium: isPrem,
          premiumStatus: isPrem ? 'approved' : 'none',
          hasEnteredPremiumPassword: true
        });
        alert(`Pagamento do ${planName} (${planPrice}/mês) confirmado para a conta Master! Acesso liberado.`);
      } else {
        // Regular user: Pending confirmation from Master Login
        await saveProfileUpdate({
          planType: selectedPlanForPayment,
          paymentMethod: paymentMethodTab,
          paymentStatus: 'pending_confirmation',
          isApproved: false,
          isPremium: false,
          premiumStatus: isPrem ? 'pending_admin_confirmation' : 'none'
        });
        alert(`Solicitação do ${planName} registrada com sucesso!\n\nUma notificação por e-mail foi enviada para o Administrador Master (everson.arantes.2008@gmail.com).\n\nO seu acesso ao Plano Premium/Básico será liberado assim que o recebimento for confirmado pelo login Master.`);
      }

      setIsProcessingPayment(false);
      setShowPaymentModal(false);
    };

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setShowPaymentModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-2xl ${isPremiumPlan ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600' : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600'}`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Assinatura Mensal LeveAI</span>
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">
                {planName} — <span className="text-emerald-600 dark:text-emerald-400">{planPrice}</span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setPaymentMethodTab('pix')}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                paymentMethodTab === 'pix'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-500" />
              PIX (Instantâneo)
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethodTab('credit_card')}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                paymentMethodTab === 'credit_card'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-500" />
              Cartão de Crédito
            </button>
          </div>

          {paymentMethodTab === 'pix' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 inline-block">
                <div className="w-40 h-40 mx-auto bg-white p-3 rounded-xl shadow-inner border border-slate-200 flex flex-col items-center justify-center relative">
                  <QrCode className="w-28 h-28 text-slate-900" />
                  <span className="text-[9px] font-mono text-emerald-600 font-bold mt-1">PIX LEVEAI</span>
                </div>
              </div>

              <div className="text-left bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Chave PIX Copia e Cola
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixKey}
                    className="w-full text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                  >
                    {pixCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {pixCopied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessingPayment}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirmando Pagamento PIX...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Confirmar Pagamento PIX ({planPrice})
                  </>
                )}
              </button>
            </div>
          )}

          {paymentMethodTab === 'credit_card' && (
            <form onSubmit={(e) => { e.preventDefault(); handleConfirmPayment(); }} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome exatamente como está no cartão"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                    Validade (MM/AA)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full p-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                    CVV
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full p-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processando Cartão...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Pagar {planPrice} no Cartão
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Pagamento 100% Criptografado e Seguro SSL</span>
          </div>
        </motion.div>
      </div>
    );
  };

  // Render Master Admin Control Panel Modal
  const renderAdminPanelModal = () => {
    if (!adminPanelOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">
                  Painel de Controle Master Admin
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Gerencie liberações de Planos Básico e Premium e confirmações de pagamentos.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchAdminUsers}
                disabled={isLoadingAdminUsers}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                title="Atualizar lista"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingAdminUsers ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setAdminPanelOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 pr-1 space-y-3">
            {isLoadingAdminUsers ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                Carregando lista de cadastros e solicitações...
              </div>
            ) : adminUsersList.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                Nenhum usuário cadastrado encontrado no momento.
              </div>
            ) : (
              adminUsersList.map((usr) => {
                const isPending = !usr.isApproved || usr.paymentStatus === 'pending_confirmation' || usr.premiumStatus === 'pending_admin_confirmation';
                const requestedPlan = usr.planType || 'premium';

                return (
                  <div 
                    key={usr.uid}
                    className={`p-4 rounded-2xl border ${
                      isPending 
                        ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
                    } flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {usr.email}
                        </span>
                        {isPending ? (
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
                            ⏳ Pendente de Liberação Master
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
                            ✓ Acesso Liberado ({usr.planType === 'premium' ? 'Premium' : 'Básico'})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>Plano Solicitado: <strong className="text-slate-700 dark:text-slate-200 uppercase">{requestedPlan}</strong></span>
                        <span>•</span>
                        <span>Método: <strong className="text-slate-700 dark:text-slate-200 uppercase">{usr.paymentMethod || 'PIX'}</strong></span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-slate-400">UID: {usr.uid.slice(0, 8)}...</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleApproveUserByAdmin(usr, 'premium')}
                        className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Liberar Premium (R$ 27)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApproveUserByAdmin(usr, 'basic')}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Liberar Básico (R$ 15)
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Administrador: <strong>everson.arantes.2008@gmail.com</strong></span>
            <span>E-mail de confirmação é enviado ao aprovar.</span>
          </div>
        </motion.div>
      </div>
    );
  };

  // Pending Approval View
  if (profile && !profile.isApproved && profile.email !== 'everson.arantes.2008@gmail.com') {
    const isPendingMasterConfirmation = profile.paymentStatus === 'pending_confirmation' || profile.premiumStatus === 'pending_admin_confirmation';

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
          
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-900/40">
            <Mail className="w-8 h-8" />
          </div>

          <h2 className="text-xl md:text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
            Status da Sua Conta LeveAI
          </h2>

          {isPendingMasterConfirmation ? (
            <div className="p-5 bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl text-left mb-6 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-sm">
                <Clock className="w-5 h-5 animate-spin shrink-0 text-amber-500" />
                Aguardando Confirmação de Recebimento pelo Master Login
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Um e-mail de notificação de pagamento do <strong>Plano {profile.planType === 'premium' ? 'Premium (R$ 27,00)' : 'Básico (R$ 15,00)'}</strong> foi enviado para o Administrador Master (<strong>everson.arantes.2008@gmail.com</strong>).
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                O seu acesso completo será liberado automaticamente na sua conta assim que o recebimento for confirmado pelo login master.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
              Para liberar o seu acesso, escolha um dos planos abaixo e confirme o pagamento. Uma notificação por e-mail será enviada diretamente para o Administrador Master (<strong>everson.arantes.2008@gmail.com</strong>) para a liberação.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
            <div className="p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between hover:border-blue-500 transition-all">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full uppercase tracking-wider">
                  Essencial
                </span>
                <h3 className="font-display font-extrabold text-lg text-slate-800 dark:text-white mt-3">
                  Plano Básico
                </h3>
                <div className="my-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">R$ 15,00</span>
                  <span className="text-xs text-slate-400 font-medium">/ mês</span>
                </div>
                <ul className="space-y-2 my-4 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-1.5">✓ Cardápio Personalizado 30 Dias</li>
                  <li className="flex items-center gap-1.5">✓ Painel de Hábitos e Metas de Água</li>
                  <li className="flex items-center gap-1.5">✓ Histórico de Peso com Gráfico</li>
                  <li className="flex items-center gap-1.5">✓ Guias Nutricionais e FAQs</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlanForPayment('basic');
                  setShowPaymentModal(true);
                }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                {profile.planType === 'basic' && isPendingMasterConfirmation ? 'Re-enviar Pagamento Básico' : 'Assinar Plano Básico (R$ 15/mês)'}
              </button>
            </div>

            <div className="p-5 rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/5 to-orange-500/5 dark:from-amber-950/20 dark:to-orange-950/20 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-3 py-1 rounded-bl-2xl uppercase tracking-widest">
                ⭐ Recomendado
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full uppercase tracking-wider">
                  IA Completa + Treinos
                </span>
                <h3 className="font-display font-extrabold text-lg text-slate-800 dark:text-white mt-3">
                  Plano Premium
                </h3>
                <div className="my-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">R$ 27,00</span>
                  <span className="text-xs text-slate-400 font-medium">/ mês</span>
                </div>
                <ul className="space-y-2 my-4 text-xs text-slate-700 dark:text-slate-200 font-medium">
                  <li className="flex items-center gap-1.5">✓ <strong>Tudo do Plano Básico incluso</strong></li>
                  <li className="flex items-center gap-1.5">✓ Treinos Interativos com Timer</li>
                  <li className="flex items-center gap-1.5">✓ Lista de Compras Inteligente</li>
                  <li className="flex items-center gap-1.5">✓ Variações Diárias Ilimitadas da IA</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlanForPayment('premium');
                  setShowPaymentModal(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {profile.planType === 'premium' && isPendingMasterConfirmation ? 'Re-enviar Pagamento Premium' : 'Assinar Plano Premium (R$ 27/mês)'}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span>Confirmação necessária pelo Master Login (everson.arantes.2008@gmail.com)</span>
            <button
              type="button"
              onClick={async () => {
                const userRef = doc(db, 'users', profile.uid);
                const snap = await getDoc(userRef);
                if (snap.exists()) {
                  const updatedData = snap.data() as UserProfile;
                  setProfile(updatedData);
                  if (updatedData.isApproved) {
                    alert('🎉 Parabéns! Seu acesso foi confirmado e liberado pelo Administrador Master!');
                  } else {
                    alert('Sua conta ainda está aguardando a confirmação do recebimento pelo Administrador Master.');
                  }
                } else {
                  alert('Sua conta ainda está aguardando a confirmação do recebimento pelo Administrador Master.');
                }
              }}
              className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl font-bold hover:bg-blue-100 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Verificar Se Fui Liberado
            </button>
          </div>

          {renderPaymentModal()}
        </div>
      </div>
    );
  }

  // Destructure Plan
  const plan = profile.plan;
  const todayWater = profile.waterLogs[getTodayDateString()] || 0;
  const waterTarget = plan.planoHidratacao.metaDiariaMl;
  const waterPercent = Math.min(100, Math.round((todayWater / waterTarget) * 100));

  // Checklist computation
  const todayChecklist = currentDayPlan?.checklist || [];
  const completedTodayList = profile.completedChecklist[getTodayDateString()] || [];
  const completedPercent = todayChecklist.length > 0 
    ? Math.round((completedTodayList.length / todayChecklist.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Dynamic Notifications Banner */}
      <NotificationBanner />

      {/* API Generation Warn message (e.g. mock notice) */}
      {generationWarning && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-xs font-semibold flex justify-center items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          {generationWarning}
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <LogoIcon size={34} />
            <span className="font-display font-black text-md text-slate-900 dark:text-white tracking-tight">
              Leve<span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Master Admin Panel Button */}
            {(user?.email === 'everson.arantes.2008@gmail.com' || profile?.email === 'everson.arantes.2008@gmail.com') && (
              <button
                type="button"
                onClick={() => {
                  setAdminPanelOpen(true);
                  fetchAdminUsers();
                }}
                className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                Painel Master
              </button>
            )}

            {/* Reset plan option */}
            <button
              onClick={handleResetPlan}
              className="px-3 py-2 text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl transition-all"
            >
              Atualizar Plano
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 transition-colors"
              title="Sair da Conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* INNER VIEWPORTS LIMITER */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 pb-24">
        
        {/* Navigation Sidebar/Top rail */}
        <div className="flex overflow-x-auto gap-2 p-1.5 mb-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-2xl shadow-sm scrollbar-none">
          {[
            { id: 'dashboard', label: 'Painel', icon: <Heart className="w-4 h-4" /> },
            { id: 'meals', label: 'Alimentação', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'workouts', label: 'Treinos', icon: <Dumbbell className="w-4 h-4" />, isLocked: !profile?.isPremium },
            { id: 'shopping', label: 'Lista de Compras', icon: <ShoppingCart className="w-4 h-4" />, isLocked: !profile?.isPremium },
            { id: 'progress', label: 'Histórico & Peso', icon: <Scale className="w-4 h-4" /> },
            { id: 'faq', label: 'Dúvidas & Ciência', icon: <HelpCircle className="w-4 h-4" /> },
            { id: 'premium', label: 'Planos & Assinatura ⭐', icon: <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />, isPremiumTab: true }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.isLocked) {
                  setCurrentTab('premium');
                } else {
                  setCurrentTab(tab.id as any);
                }
              }}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                currentTab === tab.id
                  ? tab.isPremiumTab
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/10'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : tab.isPremiumTab
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                    : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.isLocked && <Lock className="w-3 h-3 text-slate-400" />}
            </button>
          ))}
        </div>

        {/* TAB 1: DASHBOARD / PAINEL */}
        {currentTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Cell 1: Welcome & AI Insight Hero (col-span-8) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              {/* Soft decorative background glow */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-md relative z-10">
                <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight mb-2 text-slate-900 dark:text-white">
                  Bom dia, {profile.questionnaire?.nome || 'Ana'}! 👋
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Você completou <span className="text-blue-600 dark:text-blue-400 font-bold">{profile.streakDays} dias</span> de foco total. Sua meta está mais próxima hoje!
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 text-blue-750 dark:text-blue-300 px-4 py-2 rounded-full text-[11px] font-semibold">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                    Insight da IA: "Foco de hoje: {currentDayPlan?.foco}. {currentDayPlan?.mensagemMotivacional}"
                  </div>

                  <button
                    onClick={() => downloadHealthReportPDF(profile, todayWater)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[11px] font-bold transition-all shadow-xs cursor-pointer shrink-0"
                    title="Baixar Relatório Completo de Saúde em PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Relatório de Saúde (PDF)</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-8 items-end justify-between md:justify-end shrink-0 relative z-10">
                 <div className="text-center">
                   <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Atual</p>
                   <p className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white font-mono">{profile.currentWeight}<span className="text-sm font-normal text-slate-400">kg</span></p>
                 </div>
                 <div className="w-px h-12 bg-slate-200 dark:bg-slate-800 mb-1"></div>
                 <div className="text-center">
                   <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Meta</p>
                   <p className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400 font-mono">{profile.questionnaire?.metaPeso || 60}<span className="text-sm font-normal text-blue-300">kg</span></p>
                 </div>
              </div>
            </div>

            {/* Cell 2: Hydration Tracker (col-span-4) */}
            <div className="lg:col-span-4 bg-blue-600 dark:bg-blue-700 rounded-[2rem] p-6 md:p-8 text-white shadow-lg shadow-blue-200 dark:shadow-none flex flex-col justify-between min-h-[220px]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">Hidratação</h3>
                  <p className="text-blue-100 text-xs">
                    {waterPercent >= 100 ? 'Meta diária alcançada! 🎉' : `Faltam ${Math.max(0, waterTarget - todayWater) / 1000}L para a meta`}
                  </p>
                </div>
                <div className="p-2 bg-blue-500 dark:bg-blue-600 rounded-xl text-lg">💧</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end text-2xl md:text-3xl font-black font-mono">
                  <span>{(todayWater / 1000).toFixed(1)}L <span className="text-sm font-normal opacity-60">/ {(waterTarget / 1000).toFixed(1)}L</span></span>
                  <span className="text-xs font-bold bg-white text-blue-600 px-3 py-1 rounded-full">{waterPercent}%</span>
                </div>
                <div className="w-full h-3 bg-blue-400/50 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${waterPercent}%` }} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddWater(250)}
                    className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer"
                  >
                    +250ml 🥛
                  </button>
                  <button
                    onClick={() => handleAddWater(500)}
                    className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer"
                  >
                    +500ml 💧
                  </button>
                </div>
              </div>
            </div>

            {/* Cell 2.5: Gemini Hydration & Sleep Hygiene Cards (col-span-12) */}
            <div className="lg:col-span-12 grid grid-cols-1 xl:grid-cols-2 gap-6">
              <HydrationTipCard 
                profile={profile} 
                todayWater={todayWater} 
                waterTarget={waterTarget} 
                onAddWater={handleAddWater} 
              />
              <SleepHygieneCard 
                profile={profile} 
              />
            </div>

            {/* Cell 2.8: Weekly Progress & Reminders Widget Grid (col-span-12) */}
            <div className="lg:col-span-12 grid grid-cols-1 xl:grid-cols-2 gap-6">
              <WeeklyProgressCard profile={profile} />
              <RemindersWidget />
            </div>

            {/* Cell 3: Today's Tasks Checklist (col-span-4) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between min-h-[340px]">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                      Tarefas de Hoje
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      Hábitos Saudáveis
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
                    {completedPercent}%
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto scrollbar-none pr-1">
                  {todayChecklist.length === 0 ? (
                    <div className="text-xs text-slate-400 py-4 text-center">Nenhuma tarefa listada para hoje.</div>
                  ) : (
                    todayChecklist.map((item, idx) => {
                      const isCompleted = completedTodayList.includes(item);
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleChecklistItem(item)}
                          className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                            isCompleted
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100/20 dark:border-emerald-900/20 text-slate-400 line-through'
                              : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <CheckCircle className={`w-4 h-4 shrink-0 transition-colors ${
                            isCompleted ? 'text-emerald-500 fill-emerald-500/10' : 'text-slate-300'
                          }`} />
                          <span className="text-xs font-semibold leading-relaxed">
                            {item}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Cell 4: Today's Workout Preview (col-span-4) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between min-h-[340px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Dumbbell className="w-5 h-5 text-indigo-500" />
                    Treino de Hoje
                  </h3>
                  <span className="text-[10px] font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full uppercase">
                    Foco: Queima
                  </span>
                </div>
                {plan.planoExercicios.length > 0 ? (
                  <div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-2xl shrink-0">🏃‍♀️</div>
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-white leading-snug">{plan.planoExercicios[0].nome}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{plan.planoExercicios[0].duracao} • {plan.planoExercicios[0].exercicios.length} Exercícios</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 py-4">Nenhum treino planejado.</div>
                )}
                <div className="mt-4 space-y-1.5 max-h-[110px] overflow-y-auto scrollbar-none pr-1">
                  {plan.planoExercicios[0]?.exercicios.slice(0, 2).map((ex, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>• {ex.nome}</span>
                      <span className="font-semibold">{ex.series}x{ex.repeticoes}</span>
                    </div>
                  ))}
                  {plan.planoExercicios[0]?.exercicios.length > 2 && (
                    <p className="text-[10px] text-slate-400 italic font-medium">+ {plan.planoExercicios[0].exercicios.length - 2} exercícios adicionais</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  if (!profile?.isPremium) {
                    setCurrentTab('premium');
                    alert('Os treinos e o timer interativo são recursos exclusivos do Plano Premium. Adquira agora via PIX!');
                  } else {
                    setCurrentTab('workouts');
                    setActiveWorkoutForTimer(plan.planoExercicios[0]);
                  }
                }}
                className="w-full py-3 mt-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Iniciar Treino com Timer
              </button>
            </div>

            {/* Cell 5: Weight Status & Quick Entry (col-span-4) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between min-h-[340px]">
              <div>
                <h3 className="font-display font-bold text-base text-slate-800 dark:text-white flex items-center gap-1.5 mb-2">
                  <Scale className="w-5 h-5 text-emerald-500" />
                  Registro de Peso
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Registre seu peso para calibrar o algoritmo da IA do plano de 30 dias.
                </p>

                <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100/60 dark:border-slate-800 flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-black text-slate-800 dark:text-white font-mono">{profile.currentWeight}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">kg atual</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-500 font-mono">{profile.questionnaire?.metaPeso || 60}kg</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Meta</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleLogWeight} className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="Ex: 68.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
                <button
                  type="submit"
                  className="px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-750 text-white font-bold text-xs rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
                >
                  Salvar
                </button>
              </form>
            </div>

            {/* Cell 6: Weight Loss Chart (col-span-8) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between min-h-[340px]">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                    Evolução do seu Peso
                  </h3>
                  <button
                    onClick={() => setCurrentTab('progress')}
                    className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Ver Detalhes
                  </button>
                </div>
                <div className="flex-1 w-full min-h-[220px]">
                  <WeightChart history={profile.weightHistory} targetWeight={profile.questionnaire?.metaPeso || 60} />
                </div>
              </div>
            </div>

            {/* Cell 7: Shopping List Preview (col-span-4) */}
            <div className="lg:col-span-4 bg-slate-900 dark:bg-slate-950 rounded-[2rem] p-6 text-white flex flex-col justify-between min-h-[240px] relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-bold text-base">Lista de Compras</h3>
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded font-bold uppercase">
                    {purchasedGroceries.length} comprados
                  </span>
                </div>
                
                <div className="space-y-2.5 max-h-[110px] overflow-y-auto scrollbar-none pr-1">
                  {plan.listaCompras.slice(0, 1).map((cat) => (
                    <div key={cat.categoria} className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{cat.categoria}</p>
                      {cat.itens.slice(0, 2).map((item) => {
                        const isBought = purchasedGroceries.includes(item);
                        return (
                          <div 
                            key={item} 
                            onClick={() => handleToggleGrocery(item)}
                            className="flex items-center gap-2 text-xs opacity-90 cursor-pointer hover:opacity-100 transition-opacity"
                          >
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] ${
                              isBought ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/30'
                            }`}>
                              {isBought && '✓'}
                            </div>
                            <span className={isBought ? 'line-through text-white/50' : ''}>{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <p className="text-[10px] text-slate-400 italic">Mais categorias disponíveis na aba completa...</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!profile?.isPremium) {
                    setCurrentTab('premium');
                    alert('A Lista de Compras completa é um recurso exclusivo do Plano Premium. Adquira agora via PIX!');
                  } else {
                    setCurrentTab('shopping');
                  }
                }}
                className="mt-4 text-center w-full py-3 bg-white/10 hover:bg-white/20 active:scale-[0.98] rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Abrir Lista Completa
              </button>
            </div>

            {/* Cell 8: Meal Planning Mini (col-span-8) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between min-h-[240px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">Cardápio do Dia</h3>
                  <button 
                    onClick={() => setCurrentTab('meals')}
                    className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Ver Detalhes & Receitas
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  {plan.cardapioDiario.slice(0, 4).map((meal, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between min-h-[110px]">
                      <div>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">
                          {meal.horario}
                        </p>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-white leading-tight">
                          {meal.nome}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 font-mono font-bold">~{meal.calorias} kcal</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PDF Direct Generation Option Card */}
            <div className="lg:col-span-12 bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h4 className="font-display font-bold text-sm text-slate-850 dark:text-white">Deseja guardar seu cronograma completo?</h4>
                <p className="text-xs text-slate-400 mt-0.5">Exporte seu plano alimentar de 30 dias, receitas completas, e treinos em um arquivo PDF de alta definição.</p>
              </div>
              <button
                onClick={() => downloadPlanPDF(profile.questionnaire!, plan)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                Gerar PDF do Meu Plano
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: MEALS & RECIPES / ALIMENTAÇÃO */}
        {currentTab === 'meals' && (() => {
          const selectedDayObj = plan.plano30Dias.find((d) => d.dia === selectedMealDay);
          const selectedDayMeals: Meal[] = selectedDayObj?.cardapio && selectedDayObj.cardapio.length > 0
            ? selectedDayObj.cardapio
            : (profile?.questionnaire ? generateMealsForDay(selectedMealDay, profile.questionnaire, selectedDayObj?.caloriasAlvo || 1600) : plan.cardapioDiario);

          return (
            <div className="space-y-6">
              {/* 30-Day Menu Selector Header */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                        Cardápios Diários dos 30 Dias Inicial
                      </h3>
                      <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" /> 30 Dias de Variedade
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Navegue pelos 30 cardápios exclusivos desenvolvidos para diversificar suas refeições ao longo de todo o acompanhamento.
                    </p>
                  </div>

                  {selectedMealDay !== activeDay && (
                    <button
                      onClick={() => setSelectedMealDay(activeDay)}
                      className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voltar para Hoje (Dia {activeDay})</span>
                    </button>
                  )}
                </div>

                {/* Day selector carousel */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
                    const isSelected = selectedMealDay === dayNum;
                    const isToday = dayNum === activeDay;
                    return (
                      <button
                        key={dayNum}
                        onClick={() => setSelectedMealDay(dayNum)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-105'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        <span>Dia {dayNum}</span>
                        {isToday && (
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-emerald-500'}`} title="Dia Atual" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Diet Cardápio */}
                <div className="md:col-span-2 space-y-6">
                  {/* Banner do Dia Selecionado */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-md space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles className="w-24 h-24 text-white" />
                    </div>
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-white/20 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                          Dia {selectedMealDay} de 30 {selectedMealDay === activeDay ? '• HOJE' : ''}
                        </span>
                        <span className="text-xs font-medium text-blue-100 font-mono">
                          ~{selectedDayObj?.caloriasAlvo || 1600} kcal
                        </span>
                      </div>
                      <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full">
                        {profile.questionnaire?.quantidadeRefeicoes} refeições
                      </span>
                    </div>

                    <h4 className="text-lg font-bold font-display relative z-10">
                      Foco: {selectedDayObj?.foco || 'Adaptação e Nutrição Equilibrada'}
                    </h4>

                    <p className="text-xs text-blue-100 italic relative z-10">
                      "{selectedDayObj?.mensagemMotivacional || 'Siga firme no seu propósito!'}"
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                        Refeições Recomendadas do Dia {selectedMealDay}
                      </h3>
                      <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
                        {selectedDayMeals.length} refeições
                      </span>
                    </div>

                    <div className="relative border-l-2 border-blue-100 dark:border-blue-950 pl-4 space-y-6 py-2">
                      {selectedDayMeals.map((meal, idx) => (
                        <div key={idx} className="relative group">
                          {/* Timeline node */}
                          <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-white dark:bg-slate-900 transition-colors" />

                          <div className="flex justify-between items-baseline mb-2">
                            <span className="font-display font-bold text-sm text-slate-800 dark:text-white">
                              {meal.nome}
                            </span>
                            <span className="text-xs font-bold text-slate-400 font-mono">
                              {meal.horario} • ~{meal.calorias} kcal
                            </span>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-2xl border border-slate-100/40 dark:border-slate-800/50 space-y-1.5">
                            {meal.alimentos.map((food, fidx) => (
                              <div key={fidx} className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                                {food}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recipes Side panel */}
                <div className="space-y-6">
                  {/* Daily variation banner / card */}
                  {profile?.dailyVariations?.[todayStr] ? (
                    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/30 dark:to-teal-950/30 p-5 rounded-3xl border border-emerald-100/50 dark:border-emerald-900/30 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 text-emerald-500/20">
                        <Sparkles className="w-12 h-12 rotate-12" />
                      </div>
                      <h4 className="font-display font-bold text-xs text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5" /> IA Ativada • Variedade Extra
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Sua rotina hoje possui receitas exclusivas turbinadas pela IA!
                      </p>
                      <button
                        onClick={handleGenerateDailyVariation}
                        disabled={isGeneratingDaily}
                        className="mt-3 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {isGeneratingDaily ? 'Gerando novas...' : 'Gerar outras receitas de hoje com IA'}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-950/30 dark:to-indigo-950/30 p-5 rounded-3xl border border-blue-100/50 dark:border-blue-900/30 shadow-sm">
                      <h4 className="font-display font-bold text-xs text-blue-800 dark:text-blue-400 flex items-center gap-1.5 uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5" /> Variedade Instantânea com IA
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Deseja uma alternativa surpresa para hoje (Dia {activeDay})? Peça para a IA gerar novas receitas personalizadas.
                      </p>
                      <button
                        onClick={handleGenerateDailyVariation}
                        disabled={isGeneratingDaily}
                        className="mt-3 w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-[10px] rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        {isGeneratingDaily ? (
                          <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Gerando Opções...</span>
                        ) : (
                          '✨ Criar Variedade de Hoje'
                        )}
                      </button>
                    </div>
                  )}

                  {/* Today's Special Recipes list */}
                  {profile?.dailyVariations?.[todayStr] && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                      <h3 className="font-display font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Receitas Novas de Hoje
                      </h3>
                      <div className="space-y-3">
                        {profile.dailyVariations[todayStr].receitas.map((recipe) => (
                          <div
                            key={recipe.id}
                            onClick={() => setSelectedRecipe(recipe)}
                            className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-100/40 dark:border-emerald-900/30 rounded-2xl cursor-pointer transition-all group"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-display font-bold text-xs text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors">
                                {recipe.nome}
                              </h4>
                              <ChevronRight className="w-4 h-4 text-emerald-500" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Prep: {recipe.tempoPreparo} • ~{recipe.calorias} kcal
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Original Plan Recipes */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                    <h3 className="font-display font-bold text-xs text-slate-800 dark:text-white mb-4 uppercase tracking-wider">
                      Receitas Clássicas do Plano
                    </h3>

                    <div className="space-y-4">
                      {plan.receitas.map((recipe) => (
                        <div
                          key={recipe.id}
                          onClick={() => setSelectedRecipe(recipe)}
                          className="p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 rounded-2xl cursor-pointer transition-all group"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-display font-bold text-xs text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                              {recipe.nome}
                            </h4>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Prep: {recipe.tempoPreparo} • ~{recipe.calorias} kcal
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 3: WORKOUTS / TREINOS */}
        {currentTab === 'workouts' && (
          <div className="space-y-6">
            
            {/* Sub-tab switcher inside Workouts */}
            <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setWorkoutSubTab('guide')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  workoutSubTab === 'guide'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Guia Animado Push (Peitoral, Ombros & Tríceps)</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkoutSubTab('cards')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  workoutSubTab === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Dumbbell className="w-4 h-4 text-indigo-500" />
                <span>Minhas Fichas de Treino ({plan.planoExercicios.length})</span>
              </button>
            </div>

            {/* Quick Timer overlay component if active */}
            {activeWorkoutForTimer ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/60 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-extrabold text-base text-slate-800 dark:text-white">
                    Executando: {activeWorkoutForTimer.nome}
                  </h3>
                  <button
                    onClick={() => setActiveWorkoutForTimer(null)}
                    className="text-xs text-rose-500 hover:underline font-semibold"
                  >
                    Encerrar Modo Cronômetro
                  </button>
                </div>
                <WorkoutTimer 
                  exercises={activeWorkoutForTimer.exercicios} 
                  onComplete={() => {
                    alert('Parabéns! Você completou com sucesso todos os exercícios de hoje.');
                    setActiveWorkoutForTimer(null);
                  }}
                />
              </div>
            ) : null}

            {workoutSubTab === 'guide' ? (
              <PushWorkoutGuide 
                onApplyWorkoutToPlan={(exerciseList) => {
                  const pushWorkoutObj: Workout = {
                    id: 'push-ia-guia',
                    nome: 'Treino Push Hipertrofia (Peito, Ombros e Tríceps)',
                    duracao: '45 - 50 min',
                    equipamentos: 'Halteres, Banco e Polia/Corda',
                    exercicios: [
                      { nome: 'Supino Reto com Halteres', series: 4, repeticoes: '8 - 12 reps', descanso: '60s' },
                      { nome: 'Desenvolvimento Militar de Ombros', series: 4, repeticoes: '10 - 12 reps', descanso: '60s' },
                      { nome: 'Flexão de Braço Técnica', series: 3, repeticoes: '12 - 15 reps', descanso: '45s' },
                      { nome: 'Elevação Lateral de Ombros', series: 4, repeticoes: '12 - 15 reps', descanso: '45s' },
                      { nome: 'Tríceps Pulley / Cordeiro', series: 4, repeticoes: '10 - 12 reps', descanso: '45s' }
                    ]
                  };
                  setActiveWorkoutForTimer(pushWorkoutObj);
                  alert('⚡ Ficha de Treino Push ativada com sucesso! O cronômetro interativo foi aberto.');
                }}
                onStartTimerForExercise={(exName) => {
                  const singleExWorkout: Workout = {
                    id: `push-ex-${Date.now()}`,
                    nome: `Treino Guiado: ${exName}`,
                    duracao: '15 min',
                    equipamentos: 'Halteres ou Peso Corporal',
                    exercicios: [
                      { nome: exName, series: 4, repeticoes: '10 - 12 reps', descanso: '45s' }
                    ]
                  };
                  setActiveWorkoutForTimer(singleExWorkout);
                  alert(`⏱️ Cronômetro iniciado para: ${exName}`);
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* Daily variation banner / card in Workouts if not yet generated */}
                {!profile?.dailyVariations?.[todayStr] && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-3xl border border-blue-100/50 dark:border-blue-900/30 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-500/15 rounded-2xl text-blue-600 dark:text-blue-400 shrink-0">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white">
                          Treino Diversificado de Hoje com Inteligência Artificial
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                          Para manter a consistência e obter mais resultados, peça à IA para montar um treino inovador sob medida para você treinar hoje (Dia {activeDay})!
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleGenerateDailyVariation}
                      disabled={isGeneratingDaily}
                      className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-sm shrink-0 transition-all active:scale-95 cursor-pointer"
                    >
                      {isGeneratingDaily ? (
                        <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Gerando...</span>
                      ) : (
                        '✨ Gerar Treino Exclusivo'
                      )}
                    </button>
                  </div>
                )}

                {/* Workouts cards list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* If there is a daily variation workout, show it first! */}
                  {profile?.dailyVariations?.[todayStr]?.planoExercicios?.map((workout) => (
                    <div key={workout.id} className="bg-gradient-to-b from-emerald-50/20 to-teal-50/20 dark:from-emerald-950/10 dark:to-teal-950/10 p-6 rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-md flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold px-3 py-1 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Treino do Dia {activeDay}
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-3 pr-20">
                          <h3 className="font-display font-extrabold text-md text-slate-800 dark:text-white">
                            {workout.nome}
                          </h3>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                            {workout.duracao}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400 font-semibold mb-4 uppercase tracking-wider">
                          Equipamentos: {workout.equipamentos}
                        </p>

                        <div className="space-y-3 mb-6">
                          {workout.exercicios.map((ex, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/20">
                              <div>
                                <span className="text-xs font-bold text-slate-800 dark:text-white block">{ex.nome}</span>
                                <span className="text-[10px] text-slate-400">Séries: {ex.series}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">Reps: {ex.repeticoes}</span>
                                <span className="text-[10px] text-slate-400">Rest: {ex.descanso}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveWorkoutForTimer(workout)}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Começar Treino IA de Hoje
                      </button>
                    </div>
                  ))}

                  {/* Show base plan workouts */}
                  {plan.planoExercicios.map((workout) => (
                    <div key={workout.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-display font-extrabold text-md text-slate-800 dark:text-white">
                            {workout.nome}
                          </h3>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
                            {workout.duracao}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400 font-semibold mb-4 uppercase tracking-wider">
                          Equipamentos: {workout.equipamentos}
                        </p>

                        <div className="space-y-3 mb-6">
                          {workout.exercicios.map((ex, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                              <div>
                                <span className="text-xs font-bold text-slate-800 dark:text-white block">{ex.nome}</span>
                                <span className="text-[10px] text-slate-400">Séries: {ex.series}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Reps: {ex.repeticoes}</span>
                                <span className="text-[10px] text-slate-400">Rest: {ex.descanso}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveWorkoutForTimer(workout)}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Começar Treino Interativo (Base)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: SHOPPING LIST / LISTA DE COMPRAS */}
        {currentTab === 'shopping' && (
          <div className="space-y-6">
            {/* Healthy Shopping Tips & AI Label Analyzer */}
            <HealthyShoppingTipsCard profile={profile} />

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                    Lista de Compras Inteligente
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ingredientes saudáveis organizados por categorias para facilitar seu mercado
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  {purchasedGroceries.length} itens comprados
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plan.listaCompras.map((cat, cidx) => (
                  <div key={cidx} className="space-y-3">
                    <h4 className="font-display font-bold text-sm text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                      {cat.categoria}
                    </h4>
                    
                    <div className="space-y-2">
                      {cat.itens.map((item, iidx) => {
                        const isBought = purchasedGroceries.includes(item);
                        return (
                          <div
                            key={iidx}
                            onClick={() => handleToggleGrocery(item)}
                            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                              isBought
                                ? 'bg-slate-50 dark:bg-slate-800/30 text-slate-400 line-through'
                                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className={`w-4.5 h-4.5 rounded-lg border flex items-center justify-center transition-colors ${
                              isBought ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-700'
                            }`}>
                              {isBought && <span className="text-[10px] font-bold">✓</span>}
                            </div>
                            <span className="text-xs font-medium">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROGRESS HISTORY / HISTÓRICO */}
        {currentTab === 'progress' && (
          <div className="space-y-6">
            {/* Visual Transformation Before & After Card */}
            <BeforeAfterComparison profile={profile} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Weight entry card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-2">
                  Adicionar Nova Pesagem
                </h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Pese-se preferencialmente pela manhã em jejum de forma regular e acompanhe a consistência no gráfico.
                </p>

                <form onSubmit={handleLogWeight} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                      Peso Atual (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="Ex: 68.2"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-blue-600 font-mono text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Registrar Peso no Histórico
                  </button>
                </form>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                <strong>📈 Dica de Ciência:</strong> Pequenas oscilações diárias de peso são absolutamente normais e referem-se à água e digestão. O que importa é a tendência de queda a médio e longo prazo!
              </div>
            </div>

            {/* Trend History Grid */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-4">
                  Seu Histórico de Registros
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Data</th>
                        <th className="py-2.5 px-3">Peso Registrado</th>
                        <th className="py-2.5 px-3 text-right">Comparação Inicial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                      {profile.weightHistory.map((h, idx) => {
                        const startW = profile.weightHistory[0]?.peso || h.peso;
                        const diff = h.peso - startW;
                        const diffText = diff === 0 
                          ? 'Início' 
                          : diff > 0 ? `+${diff.toFixed(1)}kg` : `${diff.toFixed(1)}kg`;
                        return (
                          <tr key={idx} className="text-slate-700 dark:text-slate-300">
                            <td className="py-3 px-3 font-mono">{new Date(h.data).toLocaleDateString('pt-BR')}</td>
                            <td className="py-3 px-3 font-bold font-mono">{h.peso} kg</td>
                            <td className={`py-3 px-3 text-right font-bold ${
                              diff === 0 ? 'text-slate-400' : diff > 0 ? 'text-rose-500' : 'text-emerald-500'
                            }`}>{diffText}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* TAB 6: FAQ & SCIENCE / DÚVIDAS */}
        {currentTab === 'faq' && (
          <div className="space-y-6">
            
            {/* Clinical Evidence Guides */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-4">
                Pilares Científicos do Seu Emagrecimento
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.guiasNutricionais.map((guide, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                    <div className="flex gap-2 items-start">
                      <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold font-mono">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {guide}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive FAQs */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-4">
                Dúvidas Comuns Desmistificadas
              </h3>

              <div className="space-y-4">
                {plan.perguntasFrequentes.map((faq, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100/40 dark:border-slate-800">
                    <h4 className="font-display font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                      {faq.pergunta}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {faq.resposta}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 7: PLANS & SUBSCRIPTION / PLANOS E ASSINATURA */}
        {currentTab === 'premium' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                ⭐ Planos de Assinatura LeveAI
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900 dark:text-white">
                Escolha o Plano Ideal para Transformar sua Saúde
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                Acesse cronogramas alimentares de 30 dias gerados por IA, suporte inteligente, acompanhamento diário e treinos adaptados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* PLANO BÁSICO CARD */}
              <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border-2 ${
                profile?.planType === 'basic' 
                  ? 'border-blue-600 dark:border-blue-500 shadow-xl shadow-blue-500/10' 
                  : 'border-slate-200 dark:border-slate-800'
              } flex flex-col justify-between relative`}>
                {profile?.planType === 'basic' && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <Check className="w-3 h-3" /> Seu Plano Atual
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full uppercase tracking-wider">
                    Essencial
                  </span>
                  <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mt-3">
                    Plano Básico
                  </h3>
                  <div className="my-3 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">R$ 15,00</span>
                    <span className="text-xs text-slate-400 font-medium">/ mês</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                    Ideal para quem busca o plano alimentar completo de 30 dias com hidratação e acompanhamento de peso.
                  </p>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Cardápio Alimentar Personalizado 30 Dias</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Painel de Hábitos Diários & Metas de Água</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Acompanhamento de Histórico de Peso e Gráfico</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Guias Nutricionais Clínicos e FAQs Científicos</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  {profile?.planType === 'basic' ? (
                    <div className="w-full py-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl text-center border border-blue-200 dark:border-blue-900/50">
                      ✓ Plano Básico Ativo
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedPlanForPayment('basic');
                        setShowPaymentModal(true);
                      }}
                      className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Assinar Plano Básico (R$ 15,00/mês)
                    </button>
                  )}
                </div>
              </div>

              {/* PLANO PREMIUM CARD */}
              <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border-2 ${
                profile?.isPremium 
                  ? 'border-amber-500 shadow-xl shadow-amber-500/10' 
                  : 'border-amber-500/50'
              } bg-gradient-to-b from-amber-500/5 via-transparent to-orange-500/5 dark:from-amber-950/20 dark:to-orange-950/20 flex flex-col justify-between relative overflow-hidden`}>
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-sm">
                  ⭐ Recomendado
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full uppercase tracking-wider">
                    IA Completa + Treinos
                  </span>
                  <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mt-3">
                    Plano Premium
                  </h3>
                  <div className="my-3 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">R$ 27,00</span>
                    <span className="text-xs text-slate-400 font-medium">/ mês</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                    A experiência definitiva: Treinos com Timer, Lista de Compras Inteligente e Variações Diárias Ilimitadas da IA.
                  </p>
                  
                  <div className="space-y-3 pt-4 border-t border-amber-500/20 text-xs font-medium">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>Tudo do Plano Básico incluso</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>Treinos Físicos Interativos</strong> com Timer</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>Lista de Compras Inteligente</strong> por categoria</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>Variações Diárias Ilimitadas</strong> de Receitas e Treinos</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>Suporte Prioritário</strong> por E-mail</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  {profile?.isPremium ? (
                    <div className="w-full py-3 bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-xl text-center border border-amber-500/30">
                      ⭐ Plano Premium Ativo
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedPlanForPayment('premium');
                        setShowPaymentModal(true);
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      Seja Premium por R$ 27,00/mês
                    </button>
                  )}
                </div>
              </div>

            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Formas de pagamento aceitas: <strong>PIX</strong> e <strong>Cartão de Crédito</strong></span>
              </div>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-mono">
                Sem fidelidade • Cancele quando quiser
              </span>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER / CITATIONS */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 py-6 px-4 text-center text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
        <div className="max-w-xl mx-auto space-y-2">
          <p>
            <strong>AVISO IMPORTANTE DE SAÚDE:</strong> O LeveAI destina-se estritamente para promoção de hábitos saudáveis, educação alimentar, organização e motivação. O plano fornecido é educativo e não substitui de nenhuma forma consultas clínicas com médicos ou nutricionistas qualificados. Não deve ser usado para diagnóstico ou prescrição.
          </p>
          <p>© 2026 LeveAI • Powered by Google Gemini AI & Firebase Storage</p>
        </div>
      </footer>

      {/* RECIPE DETAIL POPUP MODAL */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg border border-slate-100 dark:border-slate-800 shadow-2xl overflow-y-auto max-h-[85vh] scrollbar-none"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    ~{selectedRecipe.calorias} kcal por porção
                  </span>
                  <h3 className="font-display font-black text-lg text-slate-800 dark:text-white mt-2">
                    {selectedRecipe.nome}
                  </h3>
                  <p className="text-[10px] text-slate-400">Tempo de preparo: {selectedRecipe.tempoPreparo}</p>
                </div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-xl font-bold text-xs"
                >
                  Fechar
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-display font-bold text-xs text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2">
                    Ingredientes Necessários
                  </h4>
                  <ul className="space-y-1">
                    {selectedRecipe.ingredientes.map((ing, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-display font-bold text-xs text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2">
                    Modo de Preparo Passo a Passo
                  </h4>
                  <ol className="space-y-2">
                    {selectedRecipe.instrucoes.map((step, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                        <span className="p-1 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-lg font-mono">
                          {idx + 1}
                        </span>
                        <p className="flex-1 pt-0.5 leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom AI Floating Assistant */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => {
            setCurrentTab('faq');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-3 bg-white dark:bg-slate-900 p-2 pr-6 rounded-full shadow-2xl border border-slate-100 dark:border-slate-800/80 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl shadow-inner">🤖</div>
          <div className="text-left">
            <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Falar com LeveAI</p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-tight font-bold">Dúvidas & Ciência</p>
          </div>
        </button>
      </div>

      {/* Modals */}
      {renderPaymentModal()}
      {renderAdminPanelModal()}

    </div>
  );
}

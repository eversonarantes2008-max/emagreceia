import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  Volume2, 
  ToggleLeft, 
  ToggleRight, 
  Droplet, 
  Utensils, 
  Dumbbell, 
  Moon, 
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  enabled: boolean;
  category: 'water' | 'meal' | 'workout' | 'sleep' | 'custom';
}

export function RemindersWidget() {
  const defaultReminders: ReminderItem[] = [
    { id: '1', title: 'Beba 300ml de Água Pura', time: '09:00', enabled: true, category: 'water' },
    { id: '2', title: 'Refeição Proteica de Almoço', time: '12:30', enabled: true, category: 'meal' },
    { id: '3', title: 'Hora da Hidratação da Tarde', time: '15:00', enabled: true, category: 'water' },
    { id: '4', title: 'Sessão de Exercícios e Treino', time: '17:30', enabled: true, category: 'workout' },
    { id: '5', title: 'Desligar Telas / Ritual do Sono', time: '21:30', enabled: true, category: 'sleep' }
  ];

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('emagreceia_reminders');
    return saved ? JSON.parse(saved) : defaultReminders;
  });

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [newCategory, setNewCategory] = useState<ReminderItem['category']>('custom');
  const [showAddForm, setShowAddForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('emagreceia_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const updateTime = (id: string, time: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, time } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ReminderItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      time: newTime,
      enabled: true,
      category: newCategory
    };

    setReminders(prev => [...prev, newItem]);
    setNewTitle('');
    setShowAddForm(false);
    triggerToast(`Lembrete "${newItem.title}" adicionado para as ${newItem.time}!`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const testNotification = (item: ReminderItem) => {
    triggerToast(`🔔 LEMBRETE (${item.time}): ${item.title}`);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Emagrece IA - Lembrete', {
        body: item.title,
        icon: '/favicon.ico'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const getCategoryIcon = (category: ReminderItem['category']) => {
    switch (category) {
      case 'water':
        return <Droplet className="w-4 h-4 text-cyan-500 fill-current" />;
      case 'meal':
        return <Utensils className="w-4 h-4 text-amber-500" />;
      case 'workout':
        return <Dumbbell className="w-4 h-4 text-emerald-500" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-indigo-400 fill-current" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between space-y-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-100 dark:border-purple-900/40">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
              Lembretes Diários
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Notificações de água, refeições e treinos no horário certo
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 rounded-xl transition-all text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo Lembrete</span>
        </button>
      </div>

      {/* ADD FORM MODAL / COLLAPSIBLE */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={addReminder}
            className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3"
          >
            <div className="text-xs font-black text-slate-700 dark:text-slate-200">
              Criar Novo Lembrete Personalizado
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Título do Lembrete (ex: Água com Limão)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="sm:col-span-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                required
              />

              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ReminderItem['category'])}
                className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="water">💧 Hidratação / Água</option>
                <option value="meal">🥗 Alimentação / Refeição</option>
                <option value="workout">🏋️ Treino / Atividade</option>
                <option value="sleep">🌙 Sono / Desaceleração</option>
                <option value="custom">🔔 Lembrete Geral</option>
              </select>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* REMINDERS LIST */}
      <div className="space-y-2">
        {reminders.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              item.enabled
                ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                : 'bg-slate-100/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/40 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xs shrink-0">
                {getCategoryIcon(item.category)}
              </div>

              <div className="min-w-0 space-y-0.5">
                <p className={`text-xs font-bold truncate ${item.enabled ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500 line-through'}`}>
                  {item.title}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={item.time}
                    onChange={(e) => updateTime(item.id, e.target.value)}
                    className="bg-transparent text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 focus:outline-none cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">diariamente</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Test Notification Trigger */}
              <button
                onClick={() => testNotification(item)}
                className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-lg transition-all cursor-pointer"
                title="Testar alarme de notificação agora"
              >
                <Send className="w-3.5 h-3.5" />
              </button>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleReminder(item.id)}
                className={`p-1 rounded-full transition-all cursor-pointer ${
                  item.enabled ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'
                }`}
                title={item.enabled ? 'Desativar lembrete' : 'Ativar lembrete'}
              >
                {item.enabled ? (
                  <ToggleRight className="w-7 h-7 stroke-[2]" />
                ) : (
                  <ToggleLeft className="w-7 h-7 stroke-[2]" />
                )}
              </button>

              {/* Delete button */}
              <button
                onClick={() => deleteReminder(item.id)}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/40 text-slate-300 hover:text-red-500 rounded-lg transition-all cursor-pointer"
                title="Excluir lembrete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TOAST / NOTIFICATION SIMULATION POPUP */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-purple-900 text-purple-100 p-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg border border-purple-500/30"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>{toastMessage}</span>
            </div>
            <span className="text-[10px] text-purple-300 font-mono">EmagreceIA Alert</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

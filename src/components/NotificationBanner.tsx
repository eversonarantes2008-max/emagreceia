import React, { useEffect, useState } from 'react';
import { Bell, X, Sparkles, Droplet, Dumbbell, Apple } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  type: 'water' | 'workout' | 'meal' | 'motivation' | 'weight';
  title: string;
  message: string;
}

export function NotificationBanner() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // List of possible smart notifications to pop up periodically as realistic triggers
    const triggerTemplates: Omit<Notification, 'id'>[] = [
      {
        type: 'water',
        title: 'Hora de se Hidratar! 💧',
        message: 'Beba um copo de água agora para manter seu metabolismo ativo e bater a meta.'
      },
      {
        type: 'workout',
        title: 'Hora do Treino! ⚡',
        message: 'Seu corpo foi feito para se mover. Pratique o treino de hoje em apenas alguns minutos!'
      },
      {
        type: 'meal',
        title: 'Próxima Refeição 🍎',
        message: 'Lembre-se de comer devagar, saboreando cada porção recomendada do seu cardápio.'
      },
      {
        type: 'motivation',
        title: 'Pílula de Motivação ✨',
        message: 'A constância diária supera a intensidade esporádica. Você está evoluindo!'
      },
      {
        type: 'weight',
        title: 'Registro Semanal ⚖️',
        message: 'Dia de pesagem! Registre seu peso para ver sua evolução no gráfico.'
      }
    ];

    // Trigger first notification after 8 seconds
    const initialTimer = setTimeout(() => {
      triggerRandomNotification();
    }, 10000);

    // Then trigger every 60 seconds
    const intervalTimer = setInterval(() => {
      triggerRandomNotification();
    }, 60000);

    function triggerRandomNotification() {
      const randomTemplate = triggerTemplates[Math.floor(Math.random() * triggerTemplates.length)];
      const newNotification: Notification = {
        ...randomTemplate,
        id: Math.random().toString(36).substr(2, 9)
      };

      setNotifications((prev) => {
        // Limit to max 2 concurrent alerts
        if (prev.length >= 2) {
          return [...prev.slice(1), newNotification];
        }
        return [...prev, newNotification];
      });

      // Play subtle sound in browser if allowed
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
      } catch (e) {
        // Audio context block is common on first loads, skip gracefully
      }
    }

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'water':
        return <Droplet className="w-5 h-5 text-blue-500" />;
      case 'workout':
        return <Dumbbell className="w-5 h-5 text-indigo-500" />;
      case 'meal':
        return <Apple className="w-5 h-5 text-emerald-500" />;
      case 'motivation':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'weight':
        return <Bell className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm px-4 md:px-0 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: 100 }}
            className="pointer-events-auto bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-800 flex gap-3 items-start relative overflow-hidden"
          >
            {/* Top color indicator bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${
              n.type === 'water' ? 'bg-blue-500' :
              n.type === 'workout' ? 'bg-indigo-500' :
              n.type === 'meal' ? 'bg-emerald-500' :
              n.type === 'motivation' ? 'bg-amber-500' : 'bg-rose-500'
            }`} />

            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl mt-1">
              {getIcon(n.type)}
            </div>

            <div className="flex-1 pr-6">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                {n.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {n.message}
              </p>
            </div>

            <button
              onClick={() => removeNotification(n.id)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

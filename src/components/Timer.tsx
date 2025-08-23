import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Clock, Coffee, Sparkles } from 'lucide-react';

const Timer: React.FC = () => {
  const [timeUntilUnlock, setTimeUntilUnlock] = useState<string>('');
  const [isBlocked, setIsBlocked] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const mexicoTimeZone = 'America/Mexico_City';
  const unlockHour = 23; // 11 PM

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Convert current time to Mexico timezone
      const mexicoTime = toZonedTime(now, mexicoTimeZone);
      
      // Create target time for today at 11 PM Mexico time
      const targetTime = new Date(mexicoTime);
      targetTime.setHours(unlockHour, 0, 0, 0);
      
      // If it's already past 11 PM today, set target to tomorrow
      if (mexicoTime.getHours() >= unlockHour) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      // Calculate time difference in milliseconds
      const timeDiff = targetTime.getTime() - mexicoTime.getTime();
      
      if (timeDiff <= 0) {
        setIsBlocked(false);
        setTimeUntilUnlock('¡Sistema desbloqueado!');
      } else {
        setIsBlocked(true);
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setTimeUntilUnlock(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const mexicoTime = toZonedTime(currentTime, mexicoTimeZone);

  if (!isBlocked) {
    return null; // Don't show timer when unlocked
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 flex items-center justify-center z-50">
      <div className="card p-8 max-w-lg w-full mx-4 text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-200 rounded-full translate-y-12 -translate-x-12 opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-soft">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-5 h-5 text-primary-500 animate-pulse" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            ¡Tómate un descanso!
          </h1>
          
          <p className="text-secondary-600 mb-6 text-lg">
            El sistema estará disponible a las 11:00 PM
          </p>
          
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mb-6 border border-primary-200">
            <div className="flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-secondary-700">Tiempo restante</span>
            </div>
            <div className="text-4xl font-mono font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {timeUntilUnlock}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-6 border border-secondary-200">
            <div className="text-sm text-secondary-600 space-y-1">
              <p className="flex items-center justify-center">
                <span className="font-medium">Hora actual en México:</span>
                <span className="ml-2 font-mono text-primary-600">{format(mexicoTime, 'HH:mm:ss')}</span>
              </p>
              <p className="flex items-center justify-center">
                <span className="font-medium">Fecha:</span>
                <span className="ml-2 font-mono text-primary-600">{format(mexicoTime, 'dd/MM/yyyy')}</span>
              </p>
            </div>
          </div>
          
          <div className="border-t border-secondary-200 pt-4">
            <p className="text-sm text-secondary-500">
              El sistema se desbloqueará automáticamente a las 11:00 PM
            </p>
            <p className="text-xs text-secondary-400 mt-1">
              ¡Gracias por tu paciencia!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;

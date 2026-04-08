import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Users, CheckCircle2, Trophy, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/cn';

// MOCK DATA
const MOCK_UPCOMING = [
  { id: 'e1', title: 'Spring Hackathon 2026', type: 'Hackathon', desc: '48 hours of building the future. Prizes worth $5000.', date: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), location: 'Offline - Main Hall', registered: 145, maxCap: 200, isRegistered: false },
  { id: 'e2', title: 'Advanced UI/UX Workshop', type: 'Workshop', desc: 'Learn Figma auto-layout and advanced prototyping.', date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), location: 'Online - Zoom', registered: 89, maxCap: 100, isRegistered: true },
  { id: 'e3', title: 'Algorithm Code Sprint', type: 'Competition', desc: 'Competitive programming contest on LeetCode.', date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), location: 'Online', registered: 210, maxCap: 500, isRegistered: false },
  { id: 'e4', title: 'Cloud Architecture Talk', type: 'Tech Talk', desc: 'Guest speaker from AWS discussing serverless.', date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), location: 'Offline - Room 402', registered: 45, maxCap: 60, isRegistered: false },
];

const MOCK_PAST = [
  { id: 'pe1', title: 'Winter Web3 Hack', date: '2026-01-15', winner: 'Arjun S.', second: 'Priya M.', third: 'Rahul T.', participants: 120 },
  { id: 'pe2', title: 'React Performance Challenge', date: '2025-12-05', winner: 'Priya M.', second: 'Vikram D.', third: 'Sneha P.', participants: 85 },
  { id: 'pe3', title: 'Design System Sprint', date: '2025-11-20', winner: 'Sneha P.', second: 'Kavya S.', third: 'Arjun S.', participants: 40 },
  { id: 'pe4', title: 'Backend Scaling Contest', date: '2025-10-10', winner: 'Rahul T.', second: 'Vikram D.', third: 'Siddharth N.', participants: 65 },
  { id: 'pe5', title: 'Freshers Code Jam', date: '2025-09-25', winner: 'Ananya K.', second: 'Rohan M.', third: 'Neha G.', participants: 200 },
  { id: 'pe6', title: 'AI Prompt Engineering', date: '2025-09-10', winner: 'Arjun S.', second: 'Ananya K.', third: 'Priya M.', participants: 150 },
];

const EventCountdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }

      setIsUrgent(diff < 24 * 60 * 60 * 1000);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className={cn("flex gap-2 font-space font-bold text-lg", isUrgent ? "text-red-400" : "text-accent-amber")}>
      <div className="flex flex-col items-center w-8">
        <span>{timeLeft.days.toString().padStart(2, '0')}</span>
        <span className="text-[9px] uppercase text-text-muted font-sans">Days</span>
      </div>
      <span className="opacity-50">:</span>
      <div className="flex flex-col items-center w-8">
        <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="text-[9px] uppercase text-text-muted font-sans">Hrs</span>
      </div>
      <span className="opacity-50">:</span>
      <div className="flex flex-col items-center w-8">
        <span>{timeLeft.mins.toString().padStart(2, '0')}</span>
        <span className="text-[9px] uppercase text-text-muted font-sans">Min</span>
      </div>
      <span className="opacity-50">:</span>
      <div className="flex flex-col items-center w-8">
        <span>{timeLeft.secs.toString().padStart(2, '0')}</span>
        <span className="text-[9px] uppercase text-text-muted font-sans">Sec</span>
      </div>
    </div>
  );
};

export const EventsPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState(MOCK_UPCOMING);
  const [toast, setToast] = useState<string | null>(null);

  const handleRegister = (id: string) => {
    setUpcomingEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        return { ...ev, isRegistered: true, registered: ev.registered + 1 };
      }
      return ev;
    }));
    setToast('Registered! ✓');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto">
      <div className="mb-12 space-y-4">
        <h1 className="font-space text-4xl md:text-5xl font-bold text-text-primary">Events & Challenges</h1>
        <p className="text-text-secondary text-lg max-w-2xl">Compete, learn, and grow with the community. Register for upcoming events or check past results.</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Results</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6 outline-none">
          {upcomingEvents.map(event => {
            const isUrgent = new Date(event.date).getTime() - Date.now() < 24 * 60 * 60 * 1000;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <GlassCard className={cn(
                  "p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between transition-colors",
                  isUrgent && "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                )}>
                  {/* Left: Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-md",
                        event.type === 'Hackathon' ? 'bg-accent-purple/20 text-accent-purple' :
                        event.type === 'Workshop' ? 'bg-accent-cyan/20 text-accent-cyan' :
                        'bg-accent-amber/20 text-accent-amber'
                      )}>
                        <Trophy size={20} />
                      </div>
                      <h3 className="font-space text-2xl font-bold text-text-primary">{event.title}</h3>
                    </div>
                    <p className="text-text-secondary">{event.desc}</p>
                  </div>

                  {/* Center: Details */}
                  <div className="flex-1 grid grid-cols-2 gap-4 text-sm text-text-secondary w-full lg:w-auto border-y lg:border-y-0 lg:border-x border-border-subtle py-4 lg:py-0 lg:px-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-text-muted" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-text-muted" />
                      <span>{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-text-muted" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-text-muted" />
                      <span>{event.registered} / {event.maxCap}</span>
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="flex-1 flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto">
                    <EventCountdown targetDate={event.date} />
                    
                    {event.isRegistered ? (
                      <div className="w-full lg:w-auto px-6 py-2.5 rounded-md bg-accent-green/10 text-accent-green font-bold border border-accent-green/20 flex items-center justify-center gap-2">
                        <CheckCircle2 size={18} /> Registered
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleRegister(event.id)}
                        disabled={event.registered >= event.maxCap}
                        className="w-full lg:w-auto px-6 py-2.5 rounded-md bg-accent-cyan text-bg-base font-bold hover:bg-accent-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {event.registered >= event.maxCap ? 'Waitlist Full' : 'Register Now'}
                      </button>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="past" className="outline-none">
          <GlassCard className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>🥇 Winner</TableHead>
                  <TableHead>🥈 2nd Place</TableHead>
                  <TableHead>🥉 3rd Place</TableHead>
                  <TableHead className="text-right">Participants</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PAST.map((event, i) => (
                  <TableRow key={event.id} className={i === 0 ? "bg-accent-amber/5" : ""}>
                    <TableCell className="font-medium text-text-primary">{event.title}</TableCell>
                    <TableCell className="text-text-secondary">{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-bold text-accent-amber cursor-pointer hover:underline">{event.winner}</TableCell>
                    <TableCell className="text-text-secondary">{event.second}</TableCell>
                    <TableCell className="text-text-secondary">{event.third}</TableCell>
                    <TableCell className="text-right text-text-secondary">{event.participants}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 bg-accent-green text-bg-base px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

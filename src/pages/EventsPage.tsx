import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from 'convex/react';
import { Calendar, MapPin, Users, CheckCircle2, Trophy, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { GlassCard } from '../components/ui/GlassCard';
import { cn } from '../lib/cn';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useToast } from '../components/ui/Toast';
import { api } from '../../convex/_generated/api';

const EventCountdown = ({ targetDate }: { targetDate: number }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = targetDate - Date.now();

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
    <div className={cn('flex gap-2 font-space font-bold text-lg', isUrgent ? 'text-red-400' : 'text-accent-amber')}>
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
  const upcoming = useQuery(api.events.getUpcomingEvents);
  const past = useQuery(api.events.getPastEvents);
  const { user: currentUser } = useCurrentUser();
  const registerForEvent = useMutation(api.events.registerForEvent);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [isRegisteringId, setIsRegisteringId] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleRegister = async (eventId: any) => {
    if (!currentUser) {
      showToast('Sign in to register for this event', 'warning');
      return;
    }

    setIsRegisteringId(String(eventId));
    try {
      await registerForEvent({
        userId: currentUser._id,
        eventId,
      });
      setRegisteredEvents((prev) => new Set([...prev, String(eventId)]));
      showToast('Registered! +50 XP', 'success');
    } catch (err: any) {
      showToast(err?.message ?? 'Registration failed', 'error');
    } finally {
      setIsRegisteringId(null);
    }
  };

  const pastRows = useMemo(() => past ?? [], [past]);

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
          {upcoming === undefined ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-white/5 rounded-lg h-24" />
            ))
          ) : (
            upcoming.map((event) => {
              const isUrgent = event.date - Date.now() < 24 * 60 * 60 * 1000;
              const isRegistered = registeredEvents.has(String(event._id));

              return (
                <motion.div
                  key={String(event._id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <GlassCard className={cn(
                    'p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between transition-colors',
                    isUrgent && 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                  )}>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'p-2 rounded-md',
                          event.type === 'Hackathon' ? 'bg-accent-purple/20 text-accent-purple' :
                            event.type === 'Workshop' ? 'bg-accent-cyan/20 text-accent-cyan' :
                              'bg-accent-amber/20 text-accent-amber'
                        )}>
                          <Trophy size={20} />
                        </div>
                        <h3 className="font-space text-2xl font-bold text-text-primary">{event.title}</h3>
                      </div>
                      <p className="text-text-secondary">{event.description}</p>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4 text-sm text-text-secondary w-full lg:w-auto border-y lg:border-y-0 lg:border-x border-border-subtle py-4 lg:py-0 lg:px-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-text-muted" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-text-muted" />
                        <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-text-muted" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-text-muted" />
                        <span>{event.registeredCount} / {event.maxCapacity}</span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto">
                      <EventCountdown targetDate={event.date} />

                      {isRegistered ? (
                        <div className="w-full lg:w-auto px-6 py-2.5 rounded-md bg-accent-green/10 text-accent-green font-bold border border-accent-green/20 flex items-center justify-center gap-2">
                          <CheckCircle2 size={18} /> Registered
                        </div>
                      ) : (
                        <button
                          onClick={() => void handleRegister(event._id)}
                          disabled={event.registeredCount >= event.maxCapacity || isRegisteringId === String(event._id)}
                          className="w-full lg:w-auto px-6 py-2.5 rounded-md bg-accent-cyan text-bg-base font-bold hover:bg-accent-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isRegisteringId === String(event._id) ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg-base/30 border-t-bg-base" />
                              Registering...
                            </>
                          ) : event.registeredCount >= event.maxCapacity ? 'Waitlist Full' : 'Register Now'}
                        </button>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })
          )}
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
                {past === undefined ? (
                  <TableRow>
                    <TableCell colSpan={6}><div className="animate-pulse bg-white/5 rounded-lg h-24" /></TableCell>
                  </TableRow>
                ) : (
                  pastRows.map((event, index) => (
                    <TableRow key={String(event._id)} className={index === 0 ? 'bg-accent-amber/5' : ''}>
                      <TableCell className="font-medium text-text-primary">{event.title}</TableCell>
                      <TableCell className="text-text-secondary">{new Date(event.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-bold text-accent-amber cursor-pointer hover:underline">TBD</TableCell>
                      <TableCell className="text-text-secondary">TBD</TableCell>
                      <TableCell className="text-text-secondary">TBD</TableCell>
                      <TableCell className="text-right text-text-secondary">{event.registeredCount}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </GlassCard>
        </TabsContent>
      </Tabs>

    </div>
  );
};

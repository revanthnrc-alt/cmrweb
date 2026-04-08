import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronDown, Trophy, Zap, Target, Flame, 
  Github, Twitter, Linkedin, Star, ArrowRight, Lightbulb 
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

// MOCK: replace with Convex query later
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Spring Hackathon 2026',
    type: 'Hackathon',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
  },
  {
    id: '2',
    title: 'Advanced UI/UX Workshop',
    type: 'Workshop',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(), // 3 days 5 hours
  },
  {
    id: '3',
    title: 'Algorithm Code Sprint',
    type: 'Competition',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  }
];

const MOCK_PROJECTS = [
  {
    id: 'p1',
    title: 'Nexus AI Code Reviewer',
    gradient: 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20',
    tech: ['React', 'Python', 'OpenAI'],
    stars: 128,
    author: 'Arjun S.',
    authorAvatar: 'AS'
  },
  {
    id: 'p2',
    title: 'Campus Event Tracker',
    gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-600/20',
    tech: ['Next.js', 'Convex', 'Tailwind'],
    stars: 84,
    author: 'Priya M.',
    authorAvatar: 'PM'
  },
  {
    id: 'p3',
    title: 'Decentralized Voting App',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-600/20',
    tech: ['Solidity', 'React', 'Ethers.js'],
    stars: 256,
    author: 'Rahul T.',
    authorAvatar: 'RT'
  }
];

const MOCK_LEADERBOARD = "🥇 Arjun S. — 4,820 XP  •  🥈 Priya M. — 4,210 XP  •  🥉 Kiran R. — 3,990 XP  •  🔥 Rahul T. — 3,500 XP  •  ⚡ Sneha P. — 3,200 XP  •  ";

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }

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
    <div className="flex gap-3 text-accent-amber font-space">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{timeLeft.days}</span>
        <span className="text-[10px] uppercase tracking-wider text-text-secondary">Days</span>
      </div>
      <span className="text-2xl font-bold opacity-50">:</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="text-[10px] uppercase tracking-wider text-text-secondary">Hrs</span>
      </div>
      <span className="text-2xl font-bold opacity-50">:</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{timeLeft.mins.toString().padStart(2, '0')}</span>
        <span className="text-[10px] uppercase tracking-wider text-text-secondary">Mins</span>
      </div>
    </div>
  );
};

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 20s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* SECTION 1 — Hero */}
      <section className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-center overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
        
        {/* Floating Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-amber/10 rounded-full blur-[128px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 px-4 w-full max-w-5xl mx-auto">
          <div className="space-y-2">
            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-space text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-none"
            >
              BUILD.
            </motion.h1>
            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="font-space text-6xl md:text-8xl lg:text-9xl font-bold text-accent-cyan tracking-tight leading-none"
            >
              COMPETE.
            </motion.h1>
            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="font-space text-6xl md:text-8xl lg:text-9xl font-bold text-accent-amber tracking-tight leading-none"
            >
              EVOLVE.
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto"
          >
            The platform where college builders track growth, compete in challenges, and get AI-powered career guidance.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <button className="bg-accent-cyan text-bg-base font-bold px-8 py-4 rounded-full shadow-[var(--glow-cyan)] hover:scale-105 transition-transform">
              Start Competing
            </button>
            <button className="border border-border-subtle text-text-primary px-8 py-4 rounded-full hover:bg-bg-hover transition-colors">
              Explore the Club
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* SECTION 2 — Live Stats Bar */}
      <section className="border-y border-border-subtle bg-bg-surface/50 backdrop-blur-md py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border-subtle">
          <div className="flex flex-col items-center text-center px-4">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <Trophy size={16} className="text-accent-amber" /> 
              <span className="text-sm font-medium uppercase tracking-wider">XP Awarded This Week</span>
            </div>
            <AnimatedCounter value={1247} className="text-accent-cyan" />
          </div>
          <div className="flex flex-col items-center text-center px-4">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <Zap size={16} className="text-accent-purple" /> 
              <span className="text-sm font-medium uppercase tracking-wider">Active Members</span>
            </div>
            <AnimatedCounter value={34} className="text-accent-cyan" />
          </div>
          <div className="flex flex-col items-center text-center px-4">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <Target size={16} className="text-accent-green" /> 
              <span className="text-sm font-medium uppercase tracking-wider">Challenges Completed</span>
            </div>
            <AnimatedCounter value={89} className="text-accent-cyan" />
          </div>
          <div className="flex flex-col items-center text-center px-4">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <Flame size={16} className="text-accent-amber" /> 
              <span className="text-sm font-medium uppercase tracking-wider">Day Streak Record</span>
            </div>
            <AnimatedCounter value={12} className="text-accent-cyan" />
          </div>
        </div>
      </section>

      {/* SECTION 3 — Live Leaderboard Ticker */}
      <section className="border-b border-border-subtle bg-bg-surface overflow-hidden py-3 relative z-20">
        <div className="flex whitespace-nowrap animate-ticker w-max cursor-default">
          <span className="text-text-primary font-space text-lg px-4 tracking-wide">{MOCK_LEADERBOARD}</span>
          <span className="text-text-primary font-space text-lg px-4 tracking-wide">{MOCK_LEADERBOARD}</span>
        </div>
      </section>

      {/* SECTION 4 — Upcoming Events Strip */}
      <section className="py-24 max-w-7xl mx-auto px-4 w-full overflow-hidden">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-space text-3xl md:text-4xl font-bold">Upcoming Events</h2>
          <button className="text-accent-cyan hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {MOCK_EVENTS.map(event => (
            <GlassCard key={event.id} hover className="min-w-[320px] md:min-w-[380px] p-6 snap-start shrink-0 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-xl text-text-primary">{event.title}</h3>
                <Badge variant="amber">{event.type}</Badge>
              </div>
              
              <div className="bg-bg-base/50 rounded-lg p-4 border border-border-subtle">
                <CountdownTimer targetDate={event.date} />
              </div>

              <button className="mt-auto flex items-center justify-between w-full text-accent-cyan hover:text-white transition-colors group font-medium">
                Register Now 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* SECTION 5 — Featured Projects Carousel */}
      <section className="py-24 max-w-7xl mx-auto px-4 w-full">
        <h2 className="font-space text-3xl md:text-4xl font-bold mb-10">What Members Are Building</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROJECTS.map((project, i) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard hover className="overflow-hidden flex flex-col h-full">
                <div className={`h-48 w-full ${project.gradient} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                </div>
                <div className="p-6 flex flex-col flex-grow gap-4 -mt-12 relative z-10">
                  <h3 className="font-bold text-2xl text-text-primary">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.tech.map(t => (
                      <Badge key={t} variant="gray">{t}</Badge>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-border-subtle flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center text-xs font-bold border border-accent-cyan/30">
                        {project.authorAvatar}
                      </div>
                      <span className="text-sm font-medium text-text-secondary">{project.author}</span>
                    </div>
                    <div className="flex items-center gap-1 text-accent-amber font-medium">
                      <Star size={16} fill="currentColor" /> {project.stars}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 6 — AI Highlight Block */}
      <section className="py-24 relative border-y border-border-subtle bg-accent-cyan/[0.02] overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[800px] h-[800px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="font-space text-4xl md:text-5xl font-bold leading-tight">
              AI That Knows Your <br />
              <span className="text-accent-cyan">Journey</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed max-w-xl">
              Powered by our Groq skill graph, NexusClub analyzes your commits, challenge submissions, and event participation to recommend the exact next step to accelerate your career.
            </p>
            <button className="text-accent-cyan font-medium flex items-center gap-2 hover:text-white transition-colors">
              Learn how it works <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="relative lg:ml-auto w-full max-w-md">
            {/* Floating Widget */}
            <motion.div 
              animate={{ y: [-8, 8, -8] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <GlassCard glow className="p-6 border-accent-amber/30 bg-bg-card/90 backdrop-blur-xl shadow-2xl shadow-accent-amber/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-accent-amber/20 text-accent-amber shrink-0">
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-accent-amber mb-2 font-space tracking-wide">NEXT BEST ACTION</h4>
                    <p className="text-text-primary text-lg font-medium mb-4 leading-snug">
                      Submit a Medium Full-Stack Challenge
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Badge variant="green">+250 XP</Badge>
                      <span className="text-text-secondary flex items-center gap-1">
                        <ArrowRight size={14} /> Reach Expert Rank
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
            
            {/* Decorative background elements for the widget */}
            <div className="absolute -z-10 top-8 -right-8 w-full h-full border border-border-subtle rounded-xl bg-bg-surface/50" />
            <div className="absolute -z-20 top-16 -right-16 w-full h-full border border-border-subtle rounded-xl bg-bg-base/50" />
          </div>
        </div>
      </section>

      {/* SECTION 7 — Footer */}
      <footer className="py-16 border-t border-border-subtle bg-bg-base relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <span className="font-space text-2xl font-bold tracking-wider text-text-primary">
              NE<span className="text-accent-cyan">X</span>US
            </span>
            <p className="text-text-secondary text-sm mt-2">The premium tech club for builders.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#" className="hover:text-text-primary transition-colors">Guidelines</a>
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Contact</a>
          </div>
          
          <div className="flex gap-5 text-text-secondary">
            <a href="#" className="hover:text-text-primary transition-colors p-2 hover:bg-bg-hover rounded-full">
              <Github size={20} />
            </a>
            <a href="#" className="hover:text-text-primary transition-colors p-2 hover:bg-bg-hover rounded-full">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-text-primary transition-colors p-2 hover:bg-bg-hover rounded-full">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        
        <div className="text-center text-text-muted text-sm mt-16 font-medium">
          Built with ❤️ for college builders
        </div>
      </footer>
    </div>
  );
};

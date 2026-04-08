import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Github, Linkedin, ExternalLink, Trophy, Target, Star } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { GlassCard } from '../ui/GlassCard';

export interface Member {
  id: string;
  name: string;
  role: string;
  domain: string;
  bio: string;
  avatar: string;
  skills: string[];
  xp: number;
  challenges: number;
  topProject: string;
  tier: 1 | 2 | 3;
  github?: string;
  linkedin?: string;
}

interface MemberModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({ member, isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && member && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        />
      )}
      {isOpen && member && (
        <motion.div
          key="panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-bg-surface border-l border-border-subtle shadow-2xl overflow-y-auto"
        >
            <div className="p-6 space-y-8">
              {/* Header */}
              <div className="flex justify-between items-start">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-bg-base text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex gap-3">
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-text-primary transition-colors">
                      <Github size={20} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-text-primary transition-colors">
                      <Linkedin size={20} />
                    </a>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-bg-card border-2 border-accent-cyan flex items-center justify-center text-3xl font-bold text-accent-cyan shadow-[var(--glow-cyan)]">
                  {member.avatar}
                </div>
                <div>
                  <h2 className="font-space text-2xl font-bold text-text-primary">{member.name}</h2>
                  <p className="text-accent-cyan font-medium">{member.role}</p>
                </div>
                <Badge variant="purple">{member.domain}</Badge>
                <p className="text-text-secondary text-sm max-w-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <GlassCard className="p-4 text-center space-y-1">
                  <Trophy size={20} className="mx-auto text-accent-amber mb-2" />
                  <div className="font-space text-xl font-bold text-text-primary">{member.xp.toLocaleString()}</div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Total XP</div>
                </GlassCard>
                <GlassCard className="p-4 text-center space-y-1">
                  <Target size={20} className="mx-auto text-accent-green mb-2" />
                  <div className="font-space text-xl font-bold text-text-primary">{member.challenges}</div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Challenges</div>
                </GlassCard>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <h3 className="font-space font-bold text-lg text-text-primary">Skills & Tech</h3>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map(skill => (
                    <Badge key={skill} variant="gray">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Top Project */}
              <div className="space-y-3">
                <h3 className="font-space font-bold text-lg text-text-primary">Top Project</h3>
                <GlassCard className="p-4 flex items-center justify-between group cursor-pointer hover:border-accent-cyan transition-colors">
                  <div className="flex items-center gap-3">
                    <Star size={18} className="text-accent-amber" />
                    <span className="font-medium text-text-primary">{member.topProject}</span>
                  </div>
                  <ExternalLink size={16} className="text-text-muted group-hover:text-accent-cyan transition-colors" />
                </GlassCard>
              </div>

              {/* Action */}
              <button className="w-full py-3 rounded-md bg-accent-cyan/10 text-accent-cyan font-bold border border-accent-cyan/20 hover:bg-accent-cyan/20 transition-colors flex items-center justify-center gap-2 mt-8">
                View Full Profile <ExternalLink size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

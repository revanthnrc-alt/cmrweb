import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { useQuery } from 'convex/react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { MemberModal, Member } from '../components/team/MemberModal';
import { cn } from '../lib/cn';
import { api } from '../../convex/_generated/api';

const DOMAINS = ['All', 'Web', 'Full-Stack', 'AI/ML', 'Mobile', 'DevOps', 'Design'];

export const TeamPage = () => {
  const [activeDomain, setActiveDomain] = useState('All');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const allUsers = useQuery(api.users.getAllUsers);

  const filteredUsers = useMemo(() => {
    const users = allUsers ?? [];
    return users.filter((user) => activeDomain === 'All' || user.domain === activeDomain);
  }, [activeDomain, allUsers]);

  const members = useMemo(() => filteredUsers.map((user) => ({
    id: String(user._id),
    name: user.name,
    role: user.role === 'admin' ? 'Club Lead' : ['Elite', 'Legend', 'Expert'].includes(user.rank) ? 'Core Member' : 'Member',
    domain: user.domain ?? 'Web',
    bio: user.bio ?? 'Building with NexusClub.',
    avatar: user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    skills: user.skills,
    xp: user.xp,
    challenges: Math.max(1, Math.round(user.xp / 350)),
    topProject: `${user.domain ?? 'Nexus'} Showcase`,
    tier: user.role === 'admin' ? 1 : ['Elite', 'Legend', 'Expert'].includes(user.rank) ? 2 : 3,
    github: user.githubUrl,
    linkedin: user.linkedinUrl,
  } satisfies Member)), [filteredUsers]);

  const leads = members.filter((member) => member.tier === 1);
  const core = members.filter((member) => member.tier === 2);
  const generalMembers = members.filter((member) => member.tier === 3);

  const MemberCard = ({ member, borderClass }: { member: Member; borderClass: string }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={() => setSelectedMember(member)}
    >
      <GlassCard hover className={cn('p-6 cursor-pointer border-t-2 flex flex-col h-full', borderClass)}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-16 h-16 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-xl font-bold text-text-primary">
            {member.avatar}
          </div>
          <div className="flex gap-2 text-text-muted">
            {member.github && <Github size={18} className="hover:text-text-primary transition-colors" />}
            {member.linkedin && <Linkedin size={18} className="hover:text-text-primary transition-colors" />}
          </div>
        </div>

        <div className="mb-4 flex-grow">
          <h3 className="font-space text-xl font-bold text-text-primary">{member.name}</h3>
          <p className="text-text-secondary text-sm mb-2">{member.role}</p>
          <Badge variant={member.domain === 'Web' || member.domain === 'Full-Stack' ? 'cyan' : member.domain === 'AI/ML' ? 'purple' : 'amber'}>
            {member.domain}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border-subtle">
          {member.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="text-xs text-text-muted bg-bg-base px-2 py-1 rounded-md border border-border-subtle">
              {skill}
            </span>
          ))}
          {member.skills.length > 3 && (
            <span className="text-xs text-text-muted bg-bg-base px-2 py-1 rounded-md border border-border-subtle">
              +{member.skills.length - 3}
            </span>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );

  return (
    <div className="min-h-screen pb-24">
      <section className="pt-20 pb-16 px-4 text-center max-w-4xl mx-auto space-y-6">
        <h1 className="font-space text-5xl md:text-6xl font-bold text-text-primary tracking-tight">
          Meet the <span className="text-accent-cyan">Builders</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          The minds behind NexusClub. We are a collective of developers, designers, and creators pushing the boundaries of what's possible.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-8">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
                activeDomain === domain
                  ? 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan shadow-[var(--glow-cyan)]'
                  : 'bg-bg-surface border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted'
              )}
            >
              {domain}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {allUsers === undefined ? (
          <div className="space-y-4">
            <div className="animate-pulse bg-white/5 rounded-lg h-24" />
            <div className="animate-pulse bg-white/5 rounded-lg h-24" />
            <div className="animate-pulse bg-white/5 rounded-lg h-24" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {leads.length > 0 && (
              <motion.section layout key="tier1" className="space-y-6">
                <h2 className="font-space text-2xl font-bold text-text-primary border-b border-border-subtle pb-2">Club Leads</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leads.map((member) => (
                    <MemberCard key={member.id} member={member} borderClass="border-t-accent-cyan" />
                  ))}
                </div>
              </motion.section>
            )}

            {core.length > 0 && (
              <motion.section layout key="tier2" className="space-y-6">
                <h2 className="font-space text-2xl font-bold text-text-primary border-b border-border-subtle pb-2">Core Members</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {core.map((member) => (
                    <MemberCard key={member.id} member={member} borderClass="border-t-accent-amber" />
                  ))}
                </div>
              </motion.section>
            )}

            {generalMembers.length > 0 && (
              <motion.section layout key="tier3" className="space-y-6">
                <h2 className="font-space text-2xl font-bold text-text-primary border-b border-border-subtle pb-2">Members</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {generalMembers.map((member) => (
                    <MemberCard key={member.id} member={member} borderClass="border-t-accent-purple" />
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        )}

        {allUsers !== undefined && members.length === 0 && (
          <div className="text-center py-20 text-text-muted">
            No members found in this domain.
          </div>
        )}
      </div>

      <MemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
};

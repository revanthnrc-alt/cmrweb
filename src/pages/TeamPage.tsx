import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { MemberModal, Member } from '../components/team/MemberModal';
import { cn } from '../lib/cn';

// MOCK DATA
const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Arjun Sharma', role: 'Club Lead', domain: 'AI/ML', bio: 'Building scalable ML models and leading the AI division.', avatar: 'AS', skills: ['Python', 'TensorFlow', 'PyTorch', 'AWS'], xp: 12500, challenges: 45, topProject: 'Nexus AI Reviewer', tier: 1, github: '#', linkedin: '#' },
  { id: '2', name: 'Priya Patel', role: 'Club Lead', domain: 'Web', bio: 'Full-stack developer obsessed with performance and UX.', avatar: 'PP', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'], xp: 11200, challenges: 42, topProject: 'Campus Event Tracker', tier: 1, github: '#', linkedin: '#' },
  { id: '3', name: 'Kiran Reddy', role: 'Core Member', domain: 'Mobile', bio: 'Flutter enthusiast building cross-platform experiences.', avatar: 'KR', skills: ['Flutter', 'Dart', 'Firebase', 'Swift'], xp: 8900, challenges: 30, topProject: 'Student Connect App', tier: 2, github: '#', linkedin: '#' },
  { id: '4', name: 'Rahul Tiwari', role: 'Core Member', domain: 'DevOps', bio: 'Automating all the things. Kubernetes fanboy.', avatar: 'RT', skills: ['Docker', 'Kubernetes', 'CI/CD', 'Go'], xp: 8500, challenges: 28, topProject: 'Auto-Grader Infrastructure', tier: 2, github: '#', linkedin: '#' },
  { id: '5', name: 'Sneha Prasad', role: 'Core Member', domain: 'Design', bio: 'Creating beautiful, accessible, and intuitive interfaces.', avatar: 'SP', skills: ['Figma', 'UI/UX', 'Framer', 'CSS'], xp: 8200, challenges: 25, topProject: 'Nexus Design System', tier: 2, github: '#', linkedin: '#' },
  { id: '6', name: 'Vikram Desai', role: 'Core Member', domain: 'Web', bio: 'Backend specialist focusing on distributed systems.', avatar: 'VD', skills: ['Rust', 'Go', 'Redis', 'Kafka'], xp: 7900, challenges: 26, topProject: 'High-Throughput Chat API', tier: 2, github: '#', linkedin: '#' },
  { id: '7', name: 'Ananya Kumar', role: 'Member', domain: 'AI/ML', bio: 'Exploring NLP and generative AI applications.', avatar: 'AK', skills: ['Python', 'HuggingFace', 'LangChain'], xp: 4500, challenges: 15, topProject: 'Study Notes Summarizer', tier: 3 },
  { id: '8', name: 'Rohan Mehta', role: 'Member', domain: 'Web', bio: 'Frontend developer learning React and Tailwind.', avatar: 'RM', skills: ['HTML', 'CSS', 'JavaScript', 'React'], xp: 3200, challenges: 10, topProject: 'Personal Portfolio', tier: 3 },
  { id: '9', name: 'Neha Gupta', role: 'Member', domain: 'Mobile', bio: 'iOS developer building native experiences.', avatar: 'NG', skills: ['Swift', 'SwiftUI', 'CoreData'], xp: 3800, challenges: 12, topProject: 'Habit Tracker iOS', tier: 3 },
  { id: '10', name: 'Aditya Verma', role: 'Member', domain: 'Web', bio: 'Full-stack learner exploring the MERN stack.', avatar: 'AV', skills: ['MongoDB', 'Express', 'React', 'Node.js'], xp: 2900, challenges: 8, topProject: 'E-commerce Clone', tier: 3 },
  { id: '11', name: 'Kavya Singh', role: 'Member', domain: 'Design', bio: 'Graphic designer transitioning to UI/UX.', avatar: 'KS', skills: ['Illustrator', 'Figma', 'Prototyping'], xp: 2500, challenges: 7, topProject: 'Hackathon Branding', tier: 3 },
  { id: '12', name: 'Siddharth Nair', role: 'Member', domain: 'DevOps', bio: 'Learning cloud infrastructure and automation.', avatar: 'SN', skills: ['Linux', 'Bash', 'AWS', 'Terraform'], xp: 2100, challenges: 5, topProject: 'Automated Server Setup', tier: 3 },
];

const DOMAINS = ['All', 'Web', 'AI/ML', 'Mobile', 'DevOps', 'Design'];

export const TeamPage = () => {
  const [activeDomain, setActiveDomain] = useState('All');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filteredMembers = MOCK_MEMBERS.filter(
    m => activeDomain === 'All' || m.domain === activeDomain
  );

  const tier1 = filteredMembers.filter(m => m.tier === 1);
  const tier2 = filteredMembers.filter(m => m.tier === 2);
  const tier3 = filteredMembers.filter(m => m.tier === 3);

  const MemberCard = ({ member, borderClass }: { member: Member, borderClass: string }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={() => setSelectedMember(member)}
    >
      <GlassCard hover className={cn("p-6 cursor-pointer border-t-2 flex flex-col h-full", borderClass)}>
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
          <Badge variant={member.domain === 'Web' ? 'cyan' : member.domain === 'AI/ML' ? 'purple' : 'amber'}>
            {member.domain}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border-subtle">
          {member.skills.slice(0, 3).map(skill => (
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
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center max-w-4xl mx-auto space-y-6">
        <h1 className="font-space text-5xl md:text-6xl font-bold text-text-primary tracking-tight">
          Meet the <span className="text-accent-cyan">Builders</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          The minds behind NexusClub. We are a collective of developers, designers, and creators pushing the boundaries of what's possible.
        </p>
        
        {/* Domain Filter */}
        <div className="flex flex-wrap justify-center gap-3 pt-8">
          {DOMAINS.map(domain => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                activeDomain === domain 
                  ? "bg-accent-cyan/10 border-accent-cyan text-accent-cyan shadow-[var(--glow-cyan)]"
                  : "bg-bg-surface border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted"
              )}
            >
              {domain}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <AnimatePresence mode="popLayout">
          {/* TIER 1: Club Leads */}
          {tier1.length > 0 && (
            <motion.section layout key="tier1" className="space-y-6">
              <h2 className="font-space text-2xl font-bold text-text-primary border-b border-border-subtle pb-2">Club Leads</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tier1.map(member => (
                  <MemberCard key={member.id} member={member} borderClass="border-t-accent-cyan" />
                ))}
              </div>
            </motion.section>
          )}

          {/* TIER 2: Core Members */}
          {tier2.length > 0 && (
            <motion.section layout key="tier2" className="space-y-6">
              <h2 className="font-space text-2xl font-bold text-text-primary border-b border-border-subtle pb-2">Core Members</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tier2.map(member => (
                  <MemberCard key={member.id} member={member} borderClass="border-t-accent-amber" />
                ))}
              </div>
            </motion.section>
          )}

          {/* TIER 3: Members */}
          {tier3.length > 0 && (
            <motion.section layout key="tier3" className="space-y-6">
              <h2 className="font-space text-2xl font-bold text-text-primary border-b border-border-subtle pb-2">Members</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tier3.map(member => (
                  <MemberCard key={member.id} member={member} borderClass="border-t-accent-purple" />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {filteredMembers.length === 0 && (
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

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, MapPin, Link as LinkIcon, Calendar, Edit3, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import type { Id } from '../../convex/_generated/dataModel';

import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';

import { ActivityHeatmap } from '../components/profile/ActivityHeatmap';
import { XPLineChart } from '../components/profile/XPLineChart';
import { SkillRadar } from '../components/profile/SkillRadar';
import { NextBestActionWidget } from '../components/profile/NextBestActionWidget';
import { RankBadge, RankTier } from '../components/profile/RankBadge';
import { cn } from '../lib/cn';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { api } from '../../convex/_generated/api';

const RANK_NEXT_XP: Record<RankTier, number> = {
  Newbie: 500,
  Learner: 1500,
  Builder: 3000,
  Expert: 6000,
  Elite: 10000,
  Legend: 10000,
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'approved': return <Badge variant="green" className="flex gap-1 items-center"><CheckCircle2 size={12} /> Approved</Badge>;
    case 'pending': return <Badge variant="amber" className="flex gap-1 items-center"><Clock size={12} /> Pending</Badge>;
    case 'rejected': return <Badge variant="gray" className="flex gap-1 items-center"><XCircle size={12} /> Needs Work</Badge>;
    default: return null;
  }
};

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { id } = useParams();
  const { user: currentUser } = useCurrentUser();
  const userId = (id === 'me' ? currentUser?._id : id) as Id<'users'> | undefined;

  const profileUser = useQuery(api.users.getUserById, userId ? { userId } : 'skip');
  const submissions = useQuery(api.submissions.getSubmissionsByUser, userId ? { userId } : 'skip');
  const projects = useQuery(api.projects.getProjectsByUser, userId ? { userId } : 'skip');
  const xpHistory = useQuery(api.xp.getUserXPHistory, userId ? { userId } : 'skip');

  const isOwnProfile = currentUser?._id === profileUser?._id;

  const heatmapData = useMemo(() => {
    if (!xpHistory) return [];
    const map: Record<string, number> = {};
    xpHistory.forEach((transaction) => {
      const date = new Date(transaction.createdAt).toISOString().slice(0, 10);
      map[date] = (map[date] || 0) + transaction.amount;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [xpHistory]);

  const xpChartData = useMemo(() => {
    if (!xpHistory) return [];
    const map: Record<string, number> = {};
    xpHistory.forEach((transaction) => {
      const month = new Date(transaction.createdAt).toLocaleString('default', { month: 'short' });
      map[month] = (map[month] || 0) + transaction.amount;
    });
    return Object.entries(map).map(([month, xp]) => ({ month, xp }));
  }, [xpHistory]);

  const skillData = useMemo(() => {
    if (!profileUser?.skills?.length) return [];
    return profileUser.skills.map((skill, index) => ({
      skill,
      value: Math.max(35, 90 - index * 8),
    }));
  }, [profileUser]);

  const challengeRows = useMemo(() => {
    return submissions?.map(({ submission, challenge }) => ({
      id: String(submission._id),
      title: challenge?.title ?? 'Unknown Challenge',
      category: challenge?.category ?? 'General',
      score: submission.score ?? 0,
      status: submission.status,
      date: submission.submittedAt,
    })) ?? [];
  }, [submissions]);

  const activityRows = useMemo(() => {
    return (xpHistory ?? []).slice(0, 6).map((transaction) => ({
      id: String(transaction._id),
      type: transaction.sourceType === 'event_attended' ? 'event' : transaction.sourceType === 'streak_bonus' ? 'streak' : 'challenge',
      title: transaction.reason,
      xp: `${transaction.amount > 0 ? '+' : ''}${transaction.amount} XP`,
      date: format(new Date(transaction.createdAt), 'MMM d, yyyy'),
    }));
  }, [xpHistory]);

  const projectCards = useMemo(() => {
    return projects?.map((project, index) => ({
      id: String(project._id),
      title: project.title,
      gradient: `bg-gradient-to-br from-[hsl(${(index * 45) % 360}_80%_55%_/_0.15)] to-[hsl(${(index * 75 + 30) % 360}_80%_45%_/_0.2)]`,
      tech: project.techStack,
      stars: project.stars,
    })) ?? [];
  }, [projects]);

  if (profileUser === undefined || submissions === undefined || projects === undefined || xpHistory === undefined) {
    return (
      <div className="min-h-screen pb-20 px-4 pt-24">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse bg-white/5 rounded-lg h-24" />
          <div className="animate-pulse bg-white/5 rounded-lg h-24" />
          <div className="animate-pulse bg-white/5 rounded-lg h-24" />
        </div>
      </div>
    );
  }

  if (profileUser === null) {
    return (
      <div className="min-h-screen pb-20 px-4 pt-24">
        <div className="max-w-3xl mx-auto text-center py-24 text-text-muted">
          This builder profile could not be found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="relative">
        <div className="h-64 w-full bg-gradient-to-r from-bg-surface via-accent-cyan/10 to-bg-surface border-b border-border-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-bg-base bg-bg-surface overflow-hidden ring-2 ring-accent-cyan/50 ring-offset-4 ring-offset-bg-base">
                <img src={profileUser.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser.name}`} alt={profileUser.name} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex-grow space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-space text-3xl md:text-4xl font-bold text-text-primary">{profileUser.name}</h1>
                  <p className="text-accent-cyan font-medium">@{profileUser.username}</p>
                </div>
                {isOwnProfile && (
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-bg-surface border border-border-subtle text-text-primary hover:bg-bg-hover transition-colors text-sm font-medium">
                    <Edit3 size={16} /> Edit Profile
                  </button>
                )}
              </div>

              <p className="text-text-secondary max-w-2xl">{profileUser.bio ?? 'No bio added yet.'}</p>

              <div className="flex flex-wrap gap-4 text-sm text-text-muted pt-2">
                <span className="flex items-center gap-1"><MapPin size={14} /> {profileUser.domain ?? 'NexusClub'}</span>
                {profileUser.githubUrl && (
                  <span className="flex items-center gap-1"><LinkIcon size={14} /> <a href={profileUser.githubUrl} className="hover:text-accent-cyan transition-colors">{profileUser.githubUrl}</a></span>
                )}
                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {format(new Date(profileUser.createdAt), 'MMMM yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 max-w-full overflow-x-auto justify-start whitespace-nowrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="overview" className="mt-0 outline-none">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-3 space-y-6">
                    <GlassCard className="p-6">
                      <RankBadge
                        rank={profileUser.rank as RankTier}
                        xp={profileUser.xp}
                        nextRankXP={RANK_NEXT_XP[profileUser.rank as RankTier]}
                      />
                    </GlassCard>

                    <GlassCard className="p-6 space-y-4">
                      <h3 className="font-space font-bold text-lg">Skill Graph</h3>
                      <SkillRadar data={skillData} />
                    </GlassCard>

                    <GlassCard className="p-6 space-y-4">
                      <h3 className="font-space font-bold text-lg">XP Growth</h3>
                      <XPLineChart data={xpChartData} />
                    </GlassCard>
                  </div>

                  <div className="lg:col-span-6 space-y-6">
                    <GlassCard className="p-6 space-y-4">
                      <h3 className="font-space font-bold text-lg">Activity Heatmap</h3>
                      <ActivityHeatmap data={heatmapData} />
                    </GlassCard>

                    <GlassCard className="p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-space font-bold text-lg">Recent Challenges</h3>
                        <button className="text-accent-cyan text-sm hover:underline" onClick={() => setActiveTab('challenges')}>View All</button>
                      </div>
                      <div className="space-y-3">
                        {challengeRows.slice(0, 3).map((challenge) => (
                          <div key={challenge.id} className="flex items-center justify-between p-3 rounded-md bg-bg-surface border border-border-subtle hover:border-border-accent transition-colors">
                            <div>
                              <p className="font-medium text-text-primary">{challenge.title}</p>
                              <p className="text-xs text-text-muted">{challenge.category} • {format(new Date(challenge.date), 'MMM d, yyyy')}</p>
                            </div>
                            <StatusBadge status={challenge.status} />
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>

                  <div className="lg:col-span-3 space-y-6">
                    <GlassCard className="p-6 flex items-center gap-4 relative overflow-hidden">
                      <motion.div
                        initial={profileUser.streakCount > 0 ? { rotate: 0 } : false}
                        animate={profileUser.streakCount > 0 ? { rotate: [0, -10, 10, -5, 5, 0] } : undefined}
                        transition={{ duration: 0.7, ease: 'easeInOut' }}
                        className={cn(
                          'text-4xl relative z-10',
                          profileUser.streakCount >= 7 && 'drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                        )}
                      >
                        🔥
                      </motion.div>
                      <div className="relative z-10">
                        <div className="font-space text-2xl font-bold text-text-primary">{profileUser.streakCount} Day</div>
                        <div className="text-sm text-text-secondary uppercase tracking-wider font-medium">Streak</div>
                      </div>
                      {profileUser.streakCount >= 7 && (
                        <motion.div
                          animate={{ opacity: [0.1, 0.3, 0.1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-gradient-to-r from-accent-amber/20 to-transparent pointer-events-none"
                        />
                      )}
                    </GlassCard>

                    <NextBestActionWidget
                      userId={profileUser._id}
                    />

                    <GlassCard className="p-6 space-y-4">
                      <h3 className="font-space font-bold text-lg">Stats Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Global Rank</span>
                          <span className="font-bold text-text-primary">#{(profileUser.role === 'admin' ? 1 : 42)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Challenges Won</span>
                          <span className="font-bold text-text-primary">{challengeRows.filter((challenge) => challenge.status === 'approved').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Events Attended</span>
                          <span className="font-bold text-text-primary">{xpHistory.filter((tx) => tx.sourceType === 'event_attended').length}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="mt-0 outline-none">
                <GlassCard className="p-6">
                  <h3 className="font-space font-bold text-xl mb-6">Challenge History</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Challenge</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {challengeRows.map((challenge) => (
                        <TableRow key={challenge.id}>
                          <TableCell className="font-medium text-text-primary">{challenge.title}</TableCell>
                          <TableCell><Badge variant="gray">{challenge.category}</Badge></TableCell>
                          <TableCell className="text-text-secondary">{format(new Date(challenge.date), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="font-space font-medium">{challenge.score > 0 ? challenge.score : '-'}</TableCell>
                          <TableCell><StatusBadge status={challenge.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </GlassCard>
              </TabsContent>

              <TabsContent value="projects" className="mt-0 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projectCards.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <GlassCard hover className="overflow-hidden flex flex-col h-full">
                        <div className={`h-40 w-full ${project.gradient} relative`}>
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow gap-4 -mt-10 relative z-10">
                          <h3 className="font-bold text-xl text-text-primary">{project.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {project.tech.map((tech) => (
                              <Badge key={tech} variant="gray">{tech}</Badge>
                            ))}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-0 outline-none">
                <GlassCard className="p-6 max-w-3xl">
                  <h3 className="font-space font-bold text-xl mb-8">Activity Timeline</h3>
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-subtle before:to-transparent">
                    {activityRows.map((activity) => (
                      <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle bg-bg-surface text-accent-cyan shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          {activity.type === 'challenge' && <CheckCircle2 size={18} />}
                          {activity.type === 'event' && <Calendar size={18} />}
                          {activity.type === 'streak' && <Flame size={18} />}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-md border border-border-subtle bg-bg-surface/50 shadow">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-text-primary text-sm">{activity.title}</h4>
                            <span className="text-xs font-medium text-accent-green">{activity.xp}</span>
                          </div>
                          <time className="text-xs text-text-muted">{activity.date}</time>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { TeamPage } from './pages/TeamPage';
import { EventsPage } from './pages/EventsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="challenges" element={<ChallengesPage />} />
          <Route path="challenges/:id" element={<ChallengeDetailPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="profile/:id" element={<ProfilePage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}



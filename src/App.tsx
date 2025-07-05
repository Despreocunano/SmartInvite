import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Layout } from './components/dashboard/Layout';
import { RequireLandingPage } from './components/auth/RequireLandingPage';
import { trackPageView } from './lib/analytics';
import './i18n';

// Lazy load pages
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const AttendeesPage = lazy(() => import('./pages/AttendeesPage').then(module => ({ default: module.AttendeesPage })));
const RsvpsPage = lazy(() => import('./pages/RsvpsPage').then(module => ({ default: module.RsvpsPage })));
const TablesPage = lazy(() => import('./pages/TablesPage').then(module => ({ default: module.TablesPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const PreviewPage = lazy(() => import('./pages/PreviewPage').then(module => ({ default: module.PreviewPage })));
const SongRecommendationsPage = lazy(() => import('./pages/SongRecommendationsPage').then(module => ({ default: module.SongRecommendationsPage })));
const RemindersPage = lazy(() => import('./pages/RemindersPage').then(module => ({ default: module.RemindersPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const PublicSitePage = lazy(() => import('./pages/PublicSitePage').then(module => ({ default: module.PublicSitePage })));
const WishListAdminPage = lazy(() => import('./pages/WishListAdminPage').then(module => ({ default: module.WishListAdminPage })));

// Lazy load example pages
const ExampleMinimalistaPage = lazy(() => import('./pages/examples/ExampleMinimalistaPage').then(module => ({ default: module.default })));
const ExampleBurdeosPage = lazy(() => import('./pages/examples/ExampleBurdeosPage').then(module => ({ default: module.default })));
const ExampleDeluxeJadePage = lazy(() => import('./pages/examples/ExampleDeluxeJadePage').then(module => ({ default: module.default })));
const ExampleEsmeraldaPage = lazy(() => import('./pages/examples/ExampleEsmeraldaPage').then(module => ({ default: module.default })));
const ExampleLatePage = lazy(() => import('./pages/examples/ExampleLatePage').then(module => ({ default: module.default })));
const ExamplePassportPage = lazy(() => import('./pages/examples/ExamplePassportPage').then(module => ({ default: module.default })));
const ExampleBohoPage = lazy(() => import('./pages/examples/ExampleBohoPage').then(module => ({ default: module.default })));
const ExampleBesoInfinitoDarkPage = lazy(() => import('./pages/examples/ExampleBesoInfinitoDarkPage').then(module => ({ default: module.default })));
const ExampleLatePetroPage = lazy(() => import('./pages/examples/ExampleLatePetroPage').then(module => ({ default: module.default })));
const ExampleLatePastelPage = lazy(() => import('./pages/examples/ExampleLatePastelPage').then(module => ({ default: module.default })));
const ExampleNaturalGreenPage = lazy(() => import('./pages/examples/ExampleNaturalGreenPage').then(module => ({ default: module.default })));
const ExampleAcuarelaPage = lazy(() => import('./pages/examples/ExampleAcuarelaPage').then(module => ({ default: module.default })));
const ExampleAcuarelaEnglishPage = lazy(() => import('./pages/examples/ExampleAcuarelaEnglishPage').then(module => ({ default: module.default })));
const ExampleBesoInfinitoDarkEnglishPage = lazy(() => import('./pages/examples/ExampleBesoInfinitoDarkEnglishPage').then(module => ({ default: module.default })));
const ExampleBohoEnglishPage = lazy(() => import('./pages/examples/ExampleBohoEnglishPage').then(module => ({ default: module.default })));
const ExampleMinimalistaEnglishPage = lazy(() => import('./pages/examples/ExampleMinimalistaEnglishPage').then(module => ({ default: module.default })));
const ExamplePassportEnglishPage = lazy(() => import('./pages/examples/ExamplePassportEnglishPage').then(module => ({ default: module.default })));
const ExampleNaturalGreenEnglishPage = lazy(() => import('./pages/examples/ExampleNaturalGreenEnglishPage').then(module => ({ default: module.default })));
const ExampleLatePastelEnglishPage = lazy(() => import('./pages/examples/ExampleLatePastelEnglishPage').then(module => ({ default: module.default })));
const ExampleLatePetroEnglishPage = lazy(() => import('./pages/examples/ExampleLatePetroEnglishPage').then(module => ({ default: module.default })));
const ExampleBohoBotanicoEnglishPage = lazy(() => import('./pages/examples/ExampleBohoBotanicoEnglishPage').then(module => ({ default: module.default })));
const ExampleBosqueEnglishPage = lazy(() => import('./pages/examples/ExampleBosqueEnglishPage').then(module => ({ default: module.default })));

// Loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
  </div>
);

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoading />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

// Public routes component (no auth required)
function PublicRoutes() {
  React.useEffect(() => {
    trackPageView(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public invitation routes */}
        <Route path="/invitacion/:slug" element={
          <Suspense fallback={<PageLoading />}>
            <PublicSitePage />
          </Suspense>
        } />
        
        {/* Example template routes */}
        <Route path="/ejemplos/minimalista" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleMinimalistaPage />
          </Suspense>
        } />
        <Route path="/ejemplos/beso-infinito" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleBurdeosPage />
          </Suspense>
        } />
        <Route path="/ejemplos/beso-infinito-dark" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleBesoInfinitoDarkPage />
          </Suspense>
        } />
        <Route path="/ejemplos/signature" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleDeluxeJadePage />
          </Suspense>
        } />
        <Route path="/ejemplos/bosque" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleEsmeraldaPage />
          </Suspense>
        } />
        <Route path="/ejemplos/late" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleLatePage />
          </Suspense>
        } />
        <Route path="/ejemplos/passport" element={
          <Suspense fallback={<PageLoading />}>
            <ExamplePassportPage />
          </Suspense>
        } />
        <Route path="/ejemplos/boho" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleBohoPage />
          </Suspense>
        } />
        <Route path="/ejemplos/late-petro" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleLatePetroPage />
          </Suspense>
        } />
        <Route path="/ejemplos/late-pastel" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleLatePastelPage />
          </Suspense>
        } />
        <Route path="/ejemplos/natural-green" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleNaturalGreenPage />
          </Suspense>
        } />
        <Route path="/ejemplos/acuarela" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleAcuarelaPage />
          </Suspense>
        } />
        <Route path="/ejemplos/acuarela-en" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleAcuarelaEnglishPage />
          </Suspense>
        } />
        <Route path="/ejemplos/beso-infinito-dark-en" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleBesoInfinitoDarkEnglishPage />
          </Suspense>
        } />
        <Route path="/ejemplos/boho-en" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleBohoEnglishPage />
          </Suspense>
        } />
        <Route path="/ejemplos/minimalista-en" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleMinimalistaEnglishPage />
          </Suspense>
        } />
        <Route path="/ejemplos/passport-en" element={
          <Suspense fallback={<PageLoading />}>
            <ExamplePassportEnglishPage />
          </Suspense>
        } />
        <Route path="/ejemplos/natural-green-en" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleNaturalGreenEnglishPage />
          </Suspense>
        } />
        <Route path="/ejemplos/late-pastel-en" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleLatePastelEnglishPage />
          </Suspense>
        } />
        <Route path="/ejemplos/late-petro-en" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleLatePetroEnglishPage />
          </Suspense>
        } />
        <Route path="/ejemplos/boho-botanico-en" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleBohoBotanicoEnglishPage />
          </Suspense>
        } />
        <Route path="/ejemplos/bosque-en" element={
          <Suspense fallback={<PageLoading />}>
            <ExampleBosqueEnglishPage />
          </Suspense>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Protected routes component (auth required)
function ProtectedRoutes() {
  React.useEffect(() => {
    trackPageView(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected routes - require authentication */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <RequireLandingPage>
                <Layout>
                  <Suspense fallback={<PageLoading />}>
                    <DashboardPage />
                  </Suspense>
                </Layout>
              </RequireLandingPage>
            </RequireAuth>
          }
        />
        <Route
          path="/attendees"
          element={
            <RequireAuth>
              <RequireLandingPage>
                <Layout>
                  <Suspense fallback={<PageLoading />}>
                    <AttendeesPage />
                  </Suspense>
                </Layout>
              </RequireLandingPage>
            </RequireAuth>
          }
        />
        <Route
          path="/rsvps"
          element={
            <RequireAuth>
              <RequireLandingPage>
                <Layout>
                  <Suspense fallback={<PageLoading />}>
                    <RsvpsPage />
                  </Suspense>
                </Layout>
              </RequireLandingPage>
            </RequireAuth>
          }
        />
        <Route
          path="/reminders"
          element={
            <RequireAuth>
              <RequireLandingPage>
                <Layout>
                  <Suspense fallback={<PageLoading />}>
                    <RemindersPage />
                  </Suspense>
                </Layout>
              </RequireLandingPage>
            </RequireAuth>
          }
        />
        <Route
          path="/tables"
          element={
            <RequireAuth>
              <RequireLandingPage>
                <Layout>
                  <Suspense fallback={<PageLoading />}>
                    <TablesPage />
                  </Suspense>
                </Layout>
              </RequireLandingPage>
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Layout>
                <Suspense fallback={<PageLoading />}>
                  <SettingsPage />
                </Suspense>
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/landing"
          element={
            <RequireAuth>
              <Layout>
                <Suspense fallback={<PageLoading />}>
                  <LandingPage />
                </Suspense>
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/songs"
          element={
            <RequireAuth>
              <RequireLandingPage>
                <Layout>
                  <Suspense fallback={<PageLoading />}>
                    <SongRecommendationsPage />
                  </Suspense>
                </Layout>
              </RequireLandingPage>
            </RequireAuth>
          }
        />
        <Route
          path="/contact"
          element={
            <RequireAuth>
              <Layout>
                <Suspense fallback={<PageLoading />}>
                  <ContactPage />
                </Suspense>
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/preview/:userId"
          element={
            <RequireAuth>
              <RequireLandingPage>
                <Suspense fallback={<PageLoading />}>
                  <PreviewPage />
                </Suspense>
              </RequireLandingPage>
            </RequireAuth>
          }
        />
        <Route
          path="/wishlist-admin"
          element={
            <RequireAuth>
              <Layout>
                <Suspense fallback={<PageLoading />}>
                  <WishListAdminPage />
                </Suspense>
              </Layout>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  // Check if we're on a public route
  const isPublicRoute = window.location.pathname.startsWith('/invitacion/') || 
                       window.location.pathname.startsWith('/ejemplos/');
  
  return (
    <>
      {isPublicRoute ? (
        <PublicRoutes />
      ) : (
        <AuthProvider>
          <ProtectedRoutes />
        </AuthProvider>
      )}
      <Toaster 
        position="bottom-center"
        reverseOrder={false} />
    </>
  );
}
import { AppNavbar } from './AppNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      <main className="min-h-screen">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
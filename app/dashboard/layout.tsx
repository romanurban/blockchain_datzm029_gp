// app/dashboard/layout.tsx
import ProtectedRoute from '@/components/ProtectedRoute';
import { SideMenu } from '@/components/SideMenu';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex justify-center">
        <div className="flex max-w-screen-lg w-full overflow-hidden rounded-[0.5rem] border bg-background shadow">
          {/* Side Menu */}
          <SideMenu />

          {/* Main Content */}
          <div className="flex-1 p-4">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <AuthProvider>
            <div className="flex justify-center m-4">
              <div className="flex-1">
                {children}
              </div>
            </div>
          </AuthProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
// components/SideMenu.tsx
import Link from "next/link";

export function SideMenu() {
  return (
    <nav className="w-64 bg-gray-100 p-4 rounded-[0.5rem] border shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Menu</h2>
      <ul className="space-y-2">
        <li className="text-center">
          <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
            Dashboard
          </Link>
        </li>
        <li className="text-center">
          <Link href="/auto-invest" className="text-gray-700 hover:text-gray-900">
            Auto-invest
          </Link>
        </li>
        <li className="text-center">
          <Link href="/my-documents" className="text-gray-700 hover:text-gray-900">
            My Documents
          </Link>
        </li>
        <li className="text-center">
          <Link href="/wallet" className="text-gray-700 hover:text-gray-900">
            Wallet
          </Link>
        </li>
      </ul>
    </nav>
  );
}
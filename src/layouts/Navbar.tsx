import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="w-full px-8 py-6">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Left Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/acheter" className="text-white hover:opacity-80 transition-opacity font-medium">
            Home
          </Link>
          <Link href="/vendre" className="text-white hover:opacity-80 transition-opacity font-medium">
            About
          </Link>
          <Link href="/ressources" className="text-white hover:opacity-80 transition-opacity font-medium">
            Teams
          </Link>
        </div>

        {/* Center Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image 
            src="/images/vertical.png" 
            alt="Phamily Logo" 
            width={90} 
            height={20}
            className="object-contain"
          />
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/a-propos" className="text-white hover:opacity-80 transition-opacity font-medium">
            Sponsor
          </Link>
          <Link href="/concept" className="text-white hover:opacity-80 transition-opacity font-medium">
            Activities
          </Link>
          <Link href="/contact" className="text-white hover:opacity-80 transition-opacity font-medium">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

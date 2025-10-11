import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="w-full px-8 py-6">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Left Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-white hover:opacity-80 transition-opacity font-medium">
            Home
          </Link>
          <Link href="/about" className="text-white hover:opacity-80 transition-opacity font-medium">
            About
          </Link>
          <Link href="/teams" className="text-white hover:opacity-80 transition-opacity font-medium">
            Our Team
          </Link>
        </div>

        {/* Center Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image 
            src="/images/vertical.png" 
            alt="RIVAL ITS Logo" 
            width={90} 
            height={20}
            className="object-contain"
            priority
          />
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/partners" className="text-white hover:opacity-80 transition-opacity font-medium">
            Partners
          </Link>
          <Link href="/activities" className="text-white hover:opacity-80 transition-opacity font-medium">
            Competitions
          </Link>
          <Link href="/contact" className="text-white hover:opacity-80 transition-opacity font-medium">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GitHubButton } from '@/components/github-button';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-blackshadow-sm">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo_bg.png"  // Asegúrate de tener un logo en la carpeta public
          alt="Logo"
          width={60}
          height={60}
        />
        <span className="ml-2 text-xl font-bold">Data Generator</span>
      </Link>
      <div className='flex items-end gap-2'>
        <GitHubButton href="https://github.com/BreisOne/data-generator">
          GitHub
        </GitHubButton>
        <Button asChild>
        <Link href="https://forms.gle/jCqYQgfUTUZcpr5E9" target="_blank">Feedback</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
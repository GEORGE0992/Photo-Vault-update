import Link from 'next/link';
import { PhotoVaultIcon } from '@/components/icons/PhotoVaultIcon';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <PhotoVaultIcon className="h-8 w-8" />
      <span className="text-2xl font-semibold">Photo Vault</span>
    </Link>
  );
}

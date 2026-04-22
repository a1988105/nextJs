import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4">
      <h2 className="text-4xl font-bold text-gray-300">404</h2>
      <p className="text-gray-600">Page not found</p>
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}

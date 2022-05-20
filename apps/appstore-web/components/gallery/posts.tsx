import Image from 'next/image';
import Link from 'next/link';

export default function Posts() {
  return (
    <div className="flex flex-col items-center justify-around gap-6 rounded-xl bg-gray-700 p-10 md:flex-row md:gap-2">
      <div className="flex flex-col">
        <div className="md:text text-xs font-medium uppercase tracking-wide text-gray-300">
          Featured Article
        </div>
        <div className="text-xl tracking-wide text-gray-50 md:text-5xl">WTF are xNFTs?</div>
        <div className="mt-4 text-sm text-gray-300 md:text-lg">
          Include a brief description of the article in this area
        </div>

        <Link
          className="item-center mt-4 w-40 rounded-xl bg-gray-100 py-3 px-2 text-center font-medium transition delay-100 ease-in-out hover:scale-110"
          href="/"
        >
          Read Article
        </Link>
      </div>

      <Image className="rounded-xl bg-cover" src="/article1.jpeg" width="600px" height="440px" />
    </div>
  );
}

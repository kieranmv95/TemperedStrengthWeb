import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <Image
            src="/logo_stacked.svg"
            alt="Tempered Strength"
            width={180}
            height={54}
            priority
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Coming soon
          </h1>
          <p className="text-sm md:text-base text-zinc-400">
            We&apos;re tempering something special. Check back soon to see what
            we&apos;ve been building.
          </p>
        </div>

        <div className="space-y-3 text-xs text-zinc-500">
          <p>
            No sign-ups or waitlists yet - just a promise we&apos;re working on
            it.
          </p>
          <p>&copy; {new Date().getFullYear()} localhostdevelopment ltd</p>
        </div>
      </div>
    </main>
  );
}

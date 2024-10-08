export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900 text-white">
      <header className="mb-12">
        <h1 className="text-4xl font-bold">Darotime</h1>
      </header>
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold">Welcome to Darotime Web Pay</h1>
        <p className="text-lg text-center max-w-2xl">
          Experience seamless and secure payment processing with Darotime. Get started by exploring our features and services.
        </p>
        <div className="flex gap-4">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/features"
          >
            Explore Features
          </a>
          <a
            className="rounded-full border border-solid border-white transition-colors flex items-center justify-center hover:bg-white hover:text-gray-900 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/docs"
          >
            Read Documentation
          </a>
        </div>
      </main>
      <footer className="mt-12 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/learn"
        >
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/examples"
        >
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://darotime.com"
        >
          Go to darotime.com →
        </a>
      </footer>
    </div>
  );
}

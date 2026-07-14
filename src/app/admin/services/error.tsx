"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#070707] flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-white text-4xl font-bebas mb-4">
          Ocorreu um erro
        </h1>

        <button
          onClick={reset}
          className="bg-[#006BFF] px-5 py-3 rounded-xl text-white"
        >
          Tentar novamente
        </button>

      </div>

    </main>
  );
}
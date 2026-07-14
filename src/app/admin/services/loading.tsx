export default function Loading() {
  return (
    <main className="min-h-screen bg-[#070707] flex items-center justify-center">

      <div className="text-center">

        <div className="w-14 h-14 rounded-full border-4 border-[#1F1F1F] border-t-[#006BFF] animate-spin mx-auto mb-6"/>

        <p className="text-slate-400">
          Carregando serviços...
        </p>

      </div>

    </main>
  );
}
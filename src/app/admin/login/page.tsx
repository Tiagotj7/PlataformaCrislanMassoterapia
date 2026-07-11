"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "@/app/actions/admin";
import { Lock, Mail, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await loginAdmin(email, password);
    if (res.success) {
      setSuccessMsg("Autenticação bem-sucedida! Redirecionando para o painel...");
      setTimeout(() => {
        router.push("/admin");
      }, 600);
    } else {
      setErrorMsg(res.message || "Credenciais inválidas. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070707] px-4 py-12 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#006BFF]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#003A7A]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0B0B0B] border border-[#1F1F1F] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-8">
        
        {/* Logo and Intro */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006BFF] to-[#003A7A] flex items-center justify-center text-white font-bebas text-4xl shadow-xl shadow-[#006BFF]/25 mx-auto">
            CM
          </div>
          <div>
            <h2 className="font-bebas text-3xl tracking-wider text-white">PAINEL ADMINISTRATIVO</h2>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#00A8FF]">Crislan Massoterapeuta</span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3 animate-shake">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => handleLoginSubmit(e)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">E-mail de Acesso</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#141414] border border-[#1F1F1F] focus:border-[#006BFF] focus:outline-none text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Senha de Segurança</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#141414] border border-[#1F1F1F] focus:border-[#006BFF] focus:outline-none text-white text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#006BFF] hover:bg-[#003A7A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#006BFF]/25 hover:scale-102 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            ) : (
              <>
                <span>Autenticar & Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-4 border-t border-[#1F1F1F]">
          <Link href="/" className="text-xs text-slate-500 hover:text-[#006BFF] transition-colors">
            ← Voltar para a Landing Page Oficial
          </Link>
        </div>

      </div>
    </div>
  );
}

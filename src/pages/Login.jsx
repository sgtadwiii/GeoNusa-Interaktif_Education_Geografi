import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-900 flex font-sans">
      {/* Sisi Kiri (Branding 3D) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-red-600 to-red-800 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-12"
        >
          <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-md inline-block mb-8 border border-white/30 shadow-2xl">
            <Map size={64} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Selamat Datang Kembali!</h1>
          <p className="text-red-100 text-lg">Lanjutkan petualangan geografimu dan kumpulkan lencana.</p>
        </motion.div>
      </div>

      {/* Sisi Kanan (Form Login) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 text-white text-2xl font-bold mb-10">
            <Map className="text-red-500 w-8 h-8" /> GeoNusa
          </Link>
          
          <h2 className="text-3xl font-bold text-white mb-2">Masuk ke Akun</h2>
          <p className="text-slate-400 mb-8">Belum punya akun? <Link to="#" className="text-red-400 hover:underline">Daftar gratis</Link></p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input type="email" placeholder="siswa@sekolah.com" className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input type="password" placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
              </div>
            </div>
            
            <Button className="w-full py-3 mt-4 bg-red-600 hover:bg-red-700 text-lg flex items-center justify-center gap-2">
              Masuk Sekarang <ArrowRight size={20} />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
import React from 'react';
import { motion } from "framer-motion";
import { Clock, MapPin, Phone, Mail, Users, Target, ScrollText, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";

// 1. Import foto dari assets
import FotoDesa1 from "../assets/foto1.jpeg";

function TentangDesa() {
    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900">
            <Navbar />

            {/* HERO SECTION */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-[#0f172a] text-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-600/10 blur-[120px] rounded-full"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black mb-4 tracking-tight"
                    >
                        Tentang Desa <span className="text-indigo-400">Kima Bajo</span>
                    </motion.h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-medium italic">
                        "Mengenal lebih dekat sejarah, visi, dan tata kelola Desa Kima Bajo demi pelayanan warga yang lebih baik."
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-6 py-16 space-y-24">

                {/* 1. SEJARAH SINGKAT */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="flex items-center gap-3 text-indigo-600 font-black uppercase tracking-[0.2em] mb-4 text-xs">
                            <ScrollText size={18} /> Sejarah Desa
                        </div>
                        <h2 className="text-3xl font-black mb-6">Asal-Usul Kima Bajo</h2>
                        <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                            <p>Desa Kima Bajo merupakan salah satu permukiman pesisir yang kaya akan nilai sejarah dan budaya di Kecamatan Wori, Minahasa Utara.</p>
                            <p>Dahulu, nama Kima Bajo diambil dari keberadaan kerang kima yang melimpah dan sejarah masyarakat suku Bajo yang dikenal sebagai pengembara laut yang tangguh.</p>
                        </div>
                    </motion.div>

                    {/* 2. UPDATE BAGIAN GAMBAR DI SINI */}
                    <div className="bg-slate-200 h-80 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white">
                        <img
                            src={FotoDesa1}
                            className="w-full h-full object-cover"
                            alt="Suasana Desa Kima Bajo"
                        />
                    </div>
                </section>

                {/* 2. VISI & MISI */}
                <section className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10"><Target size={300} /></div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Harapan Utama</h3>
                            <h2 className="text-4xl font-black mb-6 italic underline decoration-indigo-400 underline-offset-8 text-white">Visi Desa</h2>
                            <p className="text-xl font-medium leading-relaxed">"Mewujudkan Desa Kima Bajo yang Mandiri, Sejahtera, dan Berbasis Digital untuk Pelayanan Masyarakat yang Transparan."</p>
                        </div>
                        <div>
                            <h2 className="text-4xl font-black mb-6 text-white">Misi Desa</h2>
                            <ul className="space-y-4 text-indigo-100 font-medium overflow-hidden">
                                <li className="flex gap-3"><ChevronRight className="shrink-0 mt-1" size={16} /> Meningkatkan tata kelola pemerintahan desa yang jujur dan adil.</li>
                                <li className="flex gap-3"><ChevronRight className="shrink-0 mt-1" size={16} /> Mengoptimalkan potensi kelautan melalui teknologi informasi.</li>
                                <li className="flex gap-3"><ChevronRight className="shrink-0 mt-1" size={16} /> Mempercepat respon pengaduan warga secara online.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. STRUKTUR ORGANISASI */}
                <section className="text-center overflow-hidden">
                    <div className="flex justify-center items-center gap-3 text-indigo-600 font-black uppercase tracking-[0.2em] mb-4 text-xs">
                        <Users size={18} /> Tata Pamong Desa
                    </div>
                    <h2 className="text-4xl font-black mb-12">Perangkat Desa Kima Bajo</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { role: "Hukum Tua", name: "Nama Pejabat" },
                            { role: "Sekretaris Desa", name: "Nama Pejabat" },
                            { role: "Bendahara", name: "Nama Pejabat" },
                            { role: "Kaur Umum", name: "Nama Pejabat" },
                        ].map((staff, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 group-hover:bg-indigo-600 transition-colors duration-500 flex items-center justify-center text-slate-300">
                                    <Users size={32} />
                                </div>
                                <h4 className="font-black text-slate-800 tracking-tight">{staff.name}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase mt-1">{staff.role}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. JADWAL LAYANAN & 5. KONTAK */}
                <section className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm sticky top-28 h-fit">
                        <div className="flex items-center gap-3 text-indigo-600 mb-6 font-black uppercase text-xs tracking-widest">
                            <Clock size={20} /> Jam Operasional Kantor
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <span className="font-bold">Senin - Kamis</span>
                                <span className="text-slate-500 font-mono">08:00 - 16:00</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <span className="font-bold">Jumat</span>
                                <span className="text-slate-500 font-mono">08:00 - 15:30</span>
                            </div>
                            <div className="flex justify-between text-rose-500 font-bold uppercase text-[10px]">
                                <span>Sabtu - Minggu</span>
                                <span>Libur</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white">
                        <div className="flex items-center gap-3 text-indigo-400 mb-6 font-black uppercase text-xs tracking-widest">
                            <Phone size={20} /> Hubungi Kami
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><MapPin size={20} /></div>
                                <p className="text-sm font-medium">Jl. Raya Wori-Likupang, Desa Kima Bajo, Kecamatan Wori, Kabupaten Minahasa Utara, Kode Pos 95351</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><Mail size={20} /></div>
                                <p className="text-sm font-medium">pemerintah@kimabajo.desa.id</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <div className="py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-t border-slate-100 bg-white mt-16">
                © 2026 Pemerintah Desa Kima Bajo • Minahasa Utara
            </div>
        </div>
    );
}

export default TentangDesa;
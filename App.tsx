
import React, { useState, useCallback, useMemo } from 'react';
import { YouTubeVideo, Memory, Contact } from './types';

// Constants moved outside component to prevent re-creation on every render
const YOUTUBE_API_KEY = 'AIzaSyDLTzUs0pixyGO_NBfa6NkyskVc2Z9tbl4'; 

const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    to: 'A',
    message: 'terima kasih sudah jadi alasan aku tersenyum hari ini.',
    songTitle: 'Best Part - Daniel Caesar',
    songChannel: 'Daniel Caesar',
    videoId: 'b4r5iXM9G5c',
    timestamp: Date.now() - 86400000
  },
  {
    id: '2',
    to: 'diri sendiri',
    message: 'beristirahatlah, kamu tidak sendiri.',
    songTitle: 'Japanese Denim - Daniel Caesar',
    songChannel: 'Daniel Caesar',
    videoId: 'L3wKzyIN1yk',
    timestamp: Date.now() - 43200000
  }
];

const CONTACTS: Contact[] = [
  { name: "Nurul", title: "Ketua Divisi", role: "Koordinator Ruang Aman", description: "Mendengarkan tanpa menghakimi adalah bentuk keberanian.", instagram: "https://instagram.com/nurul" },
  { name: "Cahaya", title: "Peer Counselor", role: "Spesialis Emotional Support", description: "Setiap cerita layak didengar, setiap luka layak disembuhkan.", instagram: "https://instagram.com/cahaya" },
  { name: "Vera", title: "Peer Counselor", role: "Peer Listener", description: "Di sini tempatmu pulang saat dunia terasa berat.", instagram: "https://instagram.com/vera" },
  { name: "Khansa", title: "Peer Counselor", role: "Peer Listener", description: "Kamu tidak sendiri, aku di sini untukmu.", instagram: "https://instagram.com/khansa" },
  { name: "Evelyn", title: "Peer Counselor", role: "Peer Listener", description: "Mari kita lepaskan beban bersama.", instagram: "https://instagram.com/evelyn" },
  { name: "Astri", title: "Peer Counselor", role: "Peer Listener", description: "Setiap air mata punya cerita yang layak dihargai.", instagram: "https://instagram.com/astri" }
];

const App: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [nowPlaying, setNowPlaying] = useState<YouTubeVideo | null>({
    id: 'b4r5iXM9G5c',
    title: 'Best Part - Daniel Caesar',
    channel: 'Daniel Caesar',
    thumbnail: 'https://img.youtube.com/vi/b4r5iXM9G5c/default.jpg'
  });
  const [toName, setToName] = useState('');
  const [messageText, setMessageText] = useState('');

  // Optimized Particle Effect using useCallback
  const triggerExplosion = useCallback((e: React.MouseEvent<HTMLButtonElement>, emoji: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.innerHTML = emoji;
      p.style.left = `${x + (Math.random() * 80 - 40)}px`;
      p.style.top = `${y}px`;
      p.style.fontSize = `${Math.random() * (24 - 12) + 12}px`;
      p.style.transition = 'all 2s cubic-bezier(0.1, 0.8, 0.3, 1)';
      fragment.appendChild(p);
      setTimeout(() => p.remove(), 2000);
    }
    document.body.appendChild(fragment);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=8&key=${YOUTUBE_API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch from YouTube API');
      const data = await response.json();
      if (data.items) {
        const results = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.default.url
        }));
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search failed", error);
      alert("Gagal mencari lagu. Pastikan koneksi internet stabil atau limit API tercapai.");
    } finally {
      setIsSearching(false);
    }
  };

  const submitMemory = () => {
    if (!selectedVideo) {
      alert('Pilih lagu dulu dari hasil pencarian!');
      return;
    }
    if (!messageText.trim()) {
      alert('Tuliskan pesanmu terlebih dahulu.');
      return;
    }

    const newMemory: Memory = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
      to: toName.trim() || 'anonymous',
      message: messageText.trim(),
      songTitle: selectedVideo.title,
      songChannel: selectedVideo.channel,
      videoId: selectedVideo.id,
      timestamp: Date.now()
    };

    setMemories(prev => [newMemory, ...prev]);
    
    // Reset fields
    setToName('');
    setMessageText('');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedVideo(null);
  };

  const playSong = useCallback((video: YouTubeVideo) => {
    setNowPlaying(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const facts = useMemo(() => [
    { emoji: '😮‍💨', title: '82% Penyakit Berawal dari Stres', text: 'Penelitian selama 37 tahun menunjukkan bahwa stres yang berkepanjangan menurunkan kekebalan tubuh. Akibatnya? Jantung, kanker, dan berbagai penyakit kronis mengintai.', source: '— Prof. A Purba, Ketua Pusat Penelitian Kardiovaskuler FK Unpad [2]' },
    { emoji: '💊', title: 'Curhat = Obat Paling Ampuh', text: 'Saat kita bercerita dengan ikhlas — baik ke Tuhan maupun ke sesama — hormon adrenalin (pemicu stres) turun secara signifikan. Bahkan jika lawan bicara tidak memberi solusi, efek lega tetap terasa.', source: '[2]' },
    { emoji: '🧠', title: 'Menahan Cerita Merusak Tubuh', text: 'Psikolog Unair menjelaskan: menahan cerita menyebabkan daya tahan tubuh menurun, mudah lelah, sulit konsentrasi, dan meningkatnya sensitivitas (mudah marah, merasa kesepian).', source: '— Atika Dian Ariana, M.Psi., Psikolog Unair [1]' },
    { emoji: '🪞', title: 'Membuka Pintu Solusi', text: 'Dengan berbagi cerita, kita mendapat perspektif baru. Masalah dilihat lebih objektif. Orang yang diam cenderung terpaku pada sudut pandangnya sendiri, sehingga pintu solusi tertutup.', source: '[1]' },
    { emoji: '⚠️', title: 'Risiko Fatal Memendam Emosi', text: 'Penumpukan emosi bisa menyebabkan depresi klinis, kecemasan, penyalahgunaan zat, hingga agresi. Yang paling mengkhawatirkan: angka bunuh diri pria jauh lebih tinggi karena mereka enggan mencari bantuan.', source: '[3]' },
    { emoji: '🗣️', title: '"Laki-laki Tidak Bercerita" Itu Mitos', text: 'Norma gender tradisional mengajarkan pria harus kuat, jangan menangis. Akibatnya? Pria kesulitan mengidentifikasi emosi dan enggan mencari dukungan. Padahal, berbagi adalah keberanian, bukan kelemahan.', source: '[3][6]' }
  ], []);

  return (
    <div className="min-h-screen font-inter flex flex-col selection:bg-accent selection:text-white bg-background">
      {/* Header */}
      <header className="pt-24 pb-12 px-[10%] text-center">
        <h1 className="font-apple text-white text-5xl md:text-7xl lg:text-8xl mb-4 drop-shadow-[0_0_30px_rgba(212,163,115,0.4)] transition-all duration-700">
          Getaway Space
        </h1>
        <div className="font-instrument italic text-2xl md:text-3xl text-accent mb-6">
          "Your safe place has arrived."
        </div>
        <p className="opacity-50 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-light">
          Melepaskan beban bukan berarti menyerah, tapi memberi ruang bagi jiwa untuk bernapas kembali.
        </p>
      </header>

      {/* Mood Selector */}
      <section className="flex justify-center gap-6 md:gap-12 py-12 flex-wrap px-4">
        {[
          { emoji: '🔥', label: 'Overwhelmed' },
          { emoji: '🌊', label: 'Drowning' },
          { emoji: '✨', label: 'Healing' },
          { emoji: '☁️', label: 'Drifting' }
        ].map((m) => (
          <div key={m.label} className="flex flex-col items-center group">
            <button 
              type="button"
              onClick={(e) => triggerExplosion(e, m.emoji)}
              aria-label={`Mood: ${m.label}`}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-border bg-glass flex items-center justify-center text-3xl md:text-4xl transition-all duration-500 hover:border-accent hover:scale-110 hover:bg-[rgba(212,163,115,0.15)] shadow-xl shadow-black/20"
            >
              {m.emoji}
            </button>
            <span className="text-[10px] tracking-[2px] mt-4 opacity-40 group-hover:opacity-100 transition-opacity uppercase font-bold">{m.label}</span>
          </div>
        ))}
      </section>

      {/* Why Share Section */}
      <section className="py-24 px-[8%] bg-gradient-to-b from-black/50 to-background border-y border-border">
        <h2 className="font-playfair text-4xl md:text-6xl text-center text-accent mb-6 font-bold">why we need this space</h2>
        <p className="text-center font-instrument italic opacity-70 max-w-2xl mx-auto mb-20 text-xl leading-relaxed">
          "Bukan sekadar curhat. Ini tentang menyelamatkan diri sendiri, satu cerita pada satu waktu."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1300px] mx-auto">
          {facts.map((fact, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-border rounded-[30px] p-8 backdrop-blur-md transition-all duration-500 hover:border-accent/50 hover:bg-white/[0.04] hover:-translate-y-2 group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{fact.emoji}</div>
              <h3 className="font-playfair text-2xl text-white mb-4 leading-tight">{fact.title}</h3>
              <p className="opacity-70 leading-relaxed mb-6 text-sm md:text-base font-light">{fact.text}</p>
              <div className="opacity-40 text-xs italic text-accent group-hover:opacity-70 transition-opacity">{fact.source}</div>
            </div>
          ))}
        </div>

        <div className="max-w-[850px] mx-auto mt-20 bg-[rgba(212,163,115,0.08)] border border-accent/20 rounded-[40px] py-8 px-10 text-center backdrop-blur-sm">
          <p className="font-instrument italic text-xl md:text-2xl text-accent/90">
            "Kamu bukan penyakitmu. Kamu punya cerita individu untuk diceritakan. Kamu punya nama, sejarah, kepribadian."
            <span className="block mt-4 text-sm opacity-50 uppercase tracking-widest font-sans font-bold">— Julian Seifter [4]</span>
          </p>
        </div>

        <div className="mt-20 text-center opacity-30 text-[9px] tracking-[4px] uppercase font-bold">
          SUMBER: [1] PAKAR UNAIR, [2] KOMPAS.COM/PROF. PURBA, [3] KBR/PSIKOLOG MUTIARA MAHARINI, [4] PIKIRAN RAKYAT, [6] UNISBANK
        </div>
      </section>

      {/* Main Interaction Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1440px] mx-auto py-20 px-[5%] w-full items-start">
        {/* Left: Input Panel */}
        <div className="bg-[#0c0c0c] rounded-[40px] border border-border p-8 md:p-12 backdrop-blur-xl shadow-2xl shadow-black/50 sticky top-10">
          <div className="font-playfair text-3xl md:text-4xl text-white mb-10 border-l-4 border-accent pl-6 font-bold">Send The Song</div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Cari lagu di YouTube..."
                className="w-full bg-black/40 border border-border rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent transition-all placeholder:opacity-30"
              />
            </div>
            <button 
              type="button"
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="bg-accent rounded-2xl px-10 py-4 text-black font-bold hover:bg-[#e5b887] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap shadow-lg shadow-accent/10"
            >
              {isSearching ? 'Mencari...' : 'Cari Lagu'}
            </button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="max-h-[350px] overflow-y-auto mb-8 border border-border rounded-3xl p-3 bg-black/30 backdrop-blur-md">
              {searchResults.map((video) => (
                <button 
                  key={video.id} 
                  type="button"
                  onClick={() => setSelectedVideo(video)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-b border-white/5 last:border-0 text-left ${selectedVideo?.id === video.id ? 'bg-accent/20 border-accent/30' : 'hover:bg-white/5'}`}
                >
                  <img src={video.thumbnail} className="w-14 h-14 rounded-xl object-cover shadow-lg" alt="" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-white text-sm font-bold truncate">{video.title}</h4>
                    <p className="text-xs opacity-50 font-medium">{video.channel}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedVideo && (
            <div className="bg-accent/10 border border-accent/20 rounded-3xl p-5 mb-8 flex items-center gap-5 animate-slide-in-bottom">
               <div className="relative">
                 <img src={selectedVideo.thumbnail} className="w-16 h-16 rounded-2xl object-cover shadow-xl" alt="" />
                 <div className="absolute -top-2 -right-2 bg-accent text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase">Selected</div>
               </div>
               <div className="overflow-hidden">
                 <h4 className="text-white text-base font-bold truncate">{selectedVideo.title}</h4>
                 <p className="text-sm opacity-50 font-medium">{selectedVideo.channel}</p>
               </div>
            </div>
          )}

          <div className="space-y-6 mb-10">
            <div>
              <label className="block text-[11px] text-accent uppercase tracking-[3px] mb-3 font-bold opacity-80">To / Untuk:</label>
              <input 
                type="text" 
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                placeholder="Inisial atau nama..."
                className="w-full bg-transparent border-b border-border text-white py-3 focus:outline-none focus:border-accent transition-all text-lg font-light placeholder:opacity-20"
              />
            </div>

            <div>
              <label className="block text-[11px] text-accent uppercase tracking-[3px] mb-3 font-bold opacity-80">The Message / Pesan:</label>
              <textarea 
                rows={4} 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Apa yang ingin kamu sampaikan?"
                className="w-full bg-black/20 border border-border rounded-3xl p-6 text-white focus:outline-none focus:border-accent transition-all resize-none font-light leading-relaxed placeholder:opacity-20"
              />
            </div>
          </div>

          <button 
            type="button"
            onClick={submitMemory}
            className="w-full py-6 bg-white text-black rounded-3xl font-black text-lg hover:bg-accent hover:text-white active:scale-[0.98] transition-all duration-300 shadow-xl shadow-white/5"
          >
            Archive This Memory
          </button>

          {nowPlaying && (
            <div className="mt-12 p-6 bg-black/60 rounded-[35px] border border-border/50 shadow-inner">
              <div className="aspect-video relative rounded-2xl overflow-hidden mb-6 bg-black shadow-2xl">
                <iframe 
                  id="player"
                  key={nowPlaying.id}
                  src={`https://www.youtube.com/embed/${nowPlaying.id}?autoplay=1&playsinline=1&rel=0&modestbranding=1&color=white`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Now Playing"
                />
              </div>
              <div className="flex items-center gap-5 bg-white/5 p-5 rounded-3xl border border-white/5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-lg relative group">
                  <img src={nowPlaying.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                  <div className="absolute inset-0 bg-accent/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xl">▶</span>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-white text-base font-bold truncate leading-tight mb-1">{nowPlaying.title}</h4>
                  <p className="text-sm opacity-40 font-medium">{nowPlaying.channel}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Memory Wall */}
        <div className="bg-[#0c0c0c] rounded-[40px] border border-border p-8 md:p-12 backdrop-blur-xl shadow-2xl shadow-black/50 min-h-[600px] flex flex-col overflow-hidden">
          <div className="font-playfair text-3xl md:text-4xl text-white mb-10 border-l-4 border-accent pl-6 font-bold flex items-center justify-between w-full">
            <span>Memory Wall</span>
            <span className="text-xs font-sans font-bold bg-white/5 px-3 py-1 rounded-full opacity-40">{memories.length} Entries</span>
          </div>
          
          <div className="overflow-y-auto space-y-6 pr-3 custom-scrollbar flex-1 pb-10">
            {memories.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                <span className="text-6xl mb-4">📜</span>
                <p className="font-instrument italic text-xl">Belum ada memori tersimpan.</p>
              </div>
            ) : (
              memories.map((m) => (
                <div key={m.id} className="bg-white/[0.02] rounded-[30px] p-8 border border-white/[0.05] hover:bg-white/[0.04] hover:border-accent/20 transition-all duration-500 group animate-slide-in-right">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-accent text-[11px] uppercase tracking-[3px] font-black opacity-60">untuk {m.to}</div>
                    <div className="text-[9px] opacity-20 uppercase tracking-widest">{new Date(m.timestamp).toLocaleDateString('id-ID')}</div>
                  </div>
                  <div className="italic text-xl md:text-2xl text-white/90 leading-relaxed mb-8 font-instrument tracking-tight">"{m.message}"</div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-3 bg-black/40 py-3 px-5 rounded-2xl w-fit text-sm border border-white/5">
                      <span className="text-accent text-lg">🎵</span> 
                      <div className="flex flex-col">
                        <span className="font-bold text-white/80 line-clamp-1">{m.songTitle}</span>
                        <span className="text-[10px] opacity-40 uppercase tracking-widest">{m.songChannel}</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => playSong({ id: m.videoId, title: m.songTitle, channel: m.songChannel, thumbnail: `https://img.youtube.com/vi/${m.videoId}/default.jpg` })}
                      className="px-8 py-3 rounded-2xl bg-accent/5 border border-accent/20 text-white text-xs hover:bg-accent hover:text-black hover:border-accent transition-all duration-300 font-bold uppercase tracking-widest shadow-lg shadow-accent/5 active:scale-95"
                    >
                      Listen Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Rules Section */}
      <section className="py-24 px-[8%] bg-black/40 border-y border-border backdrop-blur-sm">
        <h2 className="font-playfair text-4xl md:text-6xl text-center text-accent mb-20 font-bold">Aturan Berbagi</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1200px] mx-auto">
          {/* Rule Box 1 */}
          <div className="bg-white/[0.01] border border-border rounded-[40px] p-10 md:p-14 hover:bg-white/[0.02] transition-all">
            <h3 className="font-playfair text-3xl text-accent mb-10 border-b border-dashed border-white/10 pb-6 flex items-center gap-4">
              <span className="text-4xl">📝</span> Aturan Menitip Pesan
            </h3>
            <ul className="space-y-12">
              <li className="flex gap-6">
                <span className="text-accent font-black text-2xl opacity-20 shrink-0">01</span>
                <div>
                  <strong className="block text-white text-xl mb-3 font-bold">Privacy</strong>
                  <p className="opacity-50 text-base leading-relaxed font-light">Kerahasiaan adalah prioritas. Jangan pernah mencantumkan data pribadi orang lain (nama lengkap, kontak, alamat) tanpa izin. Gunakan inisial atau samaran.</p>
                </div>
              </li>
              <li className="flex gap-6">
                <span className="text-accent font-black text-2xl opacity-20 shrink-0">02</span>
                <div>
                  <strong className="block text-white text-xl mb-3 font-bold">Kindness</strong>
                  <p className="opacity-50 text-base leading-relaxed font-light">Gunakan bahasa yang merangkul. Kritik boleh, tapi menghujat tidak punya tempat di sini. Kita semua datang untuk pulih, bukan dihakimi.</p>
                </div>
              </li>
              <li className="flex gap-6">
                <span className="text-accent font-black text-2xl opacity-20 shrink-0">03</span>
                <div>
                  <strong className="block text-white text-xl mb-3 font-bold">Support</strong>
                  <p className="opacity-50 text-base leading-relaxed font-light">Tujuan kita adalah melepaskan beban, bukan menambah beban orang lain. Pastikan pesanmu tidak memicu atau menyudutkan pihak lain.</p>
                </div>
              </li>
            </ul>
          </div>
          {/* Rule Box 2 */}
          <div className="bg-white/[0.01] border border-border rounded-[40px] p-10 md:p-14 hover:bg-white/[0.02] transition-all">
            <h3 className="font-playfair text-3xl text-accent mb-10 border-b border-dashed border-white/10 pb-6 flex items-center gap-4">
              <span className="text-4xl">💬</span> Aturan Menghubungi via IG
            </h3>
            <ul className="space-y-12">
              <li className="flex gap-6">
                <span className="text-accent font-black text-2xl opacity-20 shrink-0">01</span>
                <div>
                  <strong className="block text-white text-xl mb-3 font-bold">Perkenalkan Diri</strong>
                  <p className="opacity-50 text-base leading-relaxed font-light">Awali dengan sapaan ramah, beri tahu kalau kamu dari Getaway Space. Ini membantu peer counselor merespon dengan lebih personal.</p>
                </div>
              </li>
              <li className="flex gap-6">
                <span className="text-accent font-black text-2xl opacity-20 shrink-0">02</span>
                <div>
                  <strong className="block text-white text-xl mb-3 font-bold">Cerita Apa Saja Boleh</strong>
                  <p className="opacity-50 text-base leading-relaxed font-light">Peer counselor siap mendengar tanpa menghakimi. Tapi ingat, mereka juga manusia yang butuh waktu untuk membalas. Bersabarlah.</p>
                </div>
              </li>
              <li className="flex gap-6">
                <span className="text-accent font-black text-2xl opacity-20 shrink-0">03</span>
                <div>
                  <strong className="block text-white text-xl mb-3 font-bold">Batasan Sehat</strong>
                  <p className="opacity-50 text-base leading-relaxed font-light">Jika butuh bantuan darurat (krisis, ingin menyakiti diri), konselor sekolah adalah tujuan utama. Kita di sini sebagai teman, bukan pengganti profesional.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-[8%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 blur-[120px] rounded-full -z-10"></div>
        <h2 className="font-playfair text-4xl md:text-6xl mb-6 font-bold">Talk to Us</h2>
        <p className="font-instrument italic opacity-50 text-xl md:text-2xl mb-16 max-w-2xl mx-auto">Jika bebanmu terlalu berat, kami siap mendengar.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1300px] mx-auto">
          {CONTACTS.map((contact, idx) => (
            <a 
              key={idx} 
              href={contact.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white text-black p-10 rounded-[35px] no-underline transition-all duration-500 flex flex-col items-center gap-3 hover:bg-accent hover:-translate-y-3 hover:text-white shadow-2xl shadow-black/40 active:scale-95"
            >
              <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:bg-white/20 transition-colors">
                📱
              </div>
              <small className="text-[10px] uppercase opacity-40 tracking-[4px] font-black group-hover:opacity-100 transition-opacity">{contact.title}</small>
              <span className="text-3xl font-black tracking-tight">{contact.name}</span>
              <span className="text-sm font-bold text-accent group-hover:text-white transition-colors py-1 px-4 bg-accent/10 group-hover:bg-white/10 rounded-full">{contact.role}</span>
              <p className="text-sm opacity-60 mt-6 pt-6 border-t border-black/5 leading-relaxed font-medium italic group-hover:border-white/10 group-hover:opacity-90">
                "{contact.description}"
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-16 px-6 border-t border-white/5 bg-black/20">
        <div className="opacity-20 text-[10px] md:text-[11px] tracking-[6px] uppercase font-black hover:opacity-60 transition-opacity cursor-default mb-4">
          PIK-R SMANCIGO 2026 · RUANG AMAN UNTUK PULIH BERSAMA
        </div>
        <div className="flex justify-center gap-4 opacity-10">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          <div className="w-2 h-2 rounded-full bg-accent"></div>
        </div>
      </footer>
    </div>
  );
};

export default App;

import React from 'react';

const CompanyLogosSection = () => {
  const logos = [
    {
      id: 'netflix',
      render: () => (
        <span className="text-xl sm:text-2xl font-black text-[#E50914] tracking-tighter uppercase font-serif">
          NETFLIX
        </span>
      ),
    },
    {
      id: 'google',
      render: () => (
        <span className="text-xl sm:text-2xl font-bold tracking-tight">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
        </span>
      ),
    },
    {
      id: 'meta',
      render: () => (
        <img src="/meta-logo.png" alt="Meta" className="h-7 sm:h-8 w-auto object-contain" />
      ),
    },
    {
      id: 'microsoft',
      render: () => (
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
            <span className="bg-[#F25022] rounded-xs" />
            <span className="bg-[#7FBA00] rounded-xs" />
            <span className="bg-[#00A4EF] rounded-xs" />
            <span className="bg-[#FFB900] rounded-xs" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Microsoft
          </span>
        </div>
      ),
    },
    {
      id: 'amazon',
      render: () => (
        <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          amazon
        </span>
      ),
    },
    {
      id: 'onlyfans',
      render: () => (
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-[#00AFF0]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z" />
          </svg>
          <span className="text-xl sm:text-2xl font-bold text-[#00AFF0] tracking-tight">
            OnlyFans
          </span>
        </div>
      ),
    },
  ];

  // Duplicate for seamless infinite marquee scrolling
  const marqueeItems = [...logos, ...logos, ...logos];

  return (
    <section className="py-14 sm:py-20 bg-white relative overflow-hidden border-b border-slate-100">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-50/60 blur-3xl rounded-full -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Header Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-[#5B3DF5] text-[11px] font-extrabold uppercase tracking-wider border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B3DF5] animate-ping" />
            <span>Trusted Enterprise Partners</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by the best companies
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
            HireFlow AI is the choice of Fortune 500 recruiters and enterprise talent acquisition teams.
          </p>
        </div>

        {/* Animated Infinite Marquee Container */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Left & Right Edge Gradient Fade Overlay Masks */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling Marquee Row */}
          <div className="animate-marquee flex items-center gap-6 sm:gap-10">
            {marqueeItems.map((item, idx) => (
              <div
                key={idx}
                className="shrink-0 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs hover:shadow-md px-7 py-4 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:border-[#5B3DF5]/30 group"
              >
                {item.render()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyLogosSection;

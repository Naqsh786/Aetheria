
const MarqueeBand = () => {
  const words = ['DESIGN', '✦', 'DEVELOP', '✦', 'AUTOMATE', '✦', 'GROW', '✦'];
  const repeatCount = 8;
  const repeatedWords = Array(repeatCount).fill(words).flat();

  return (
    <div className="relative w-full overflow-hidden bg-brand-bg z-10">
      {/* Wave top */}
      <div className="absolute top-0 left-0 w-full h-5 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 20L1440 20L1440 6C1200 14 960 0 720 8C480 16 240 2 0 12Z" fill="var(--color-section-plum)" fillOpacity="0.4" />
        </svg>
      </div>

      <section className="relative w-full py-6 md:py-8 overflow-hidden border-y border-brand-accent/15">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none" />

        {/* KDM-style massive stroke text marquee */}
        <div className="marquee-ticker">
          {repeatedWords.map((word, i) => (
            <span key={i} className={`text-[3rem] md:text-[5rem] lg:text-[7rem] font-display font-extrabold uppercase tracking-wider mx-4 md:mx-8 ${
              word === '✦' 
                ? 'text-brand-accent text-[2rem] md:text-[3rem] lg:text-[4rem] self-center' 
                : i % 2 === 0 
                  ? 'stroke-text-filled text-brand-text/90' 
                  : 'stroke-text'
            }`}>
              {word}
            </span>
          ))}
        </div>

      </section>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 w-full h-5 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 0L1440 0L1440 14C1200 6 960 20 720 12C480 4 240 18 0 8Z" fill="#14101C" />
        </svg>
      </div>
    </div>
  );
};

export default MarqueeBand;

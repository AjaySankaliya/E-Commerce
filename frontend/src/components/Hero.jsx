const Hero = () => {
  return (
    <section className="pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[2rem] overflow-hidden relative min-h-125 flex items-center">
          
          {/* Background Tech Glow */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-600/20 to-transparent pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-8 p-8 md:p-16 items-center w-full">
            <div className="z-10 text-center lg:text-left">
              <h2 className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-4">
                Next-Gen Performance
              </h2>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                MacBook Pro <br />
                <span className="text-slate-400">M3 Max Chip.</span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto lg:mx-0">
                The most advanced chips ever built for a personal computer. Unbelievable battery life. The world's best laptop display.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition">
                  Buy Now
                </button>
                <button className="border border-slate-700 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition">
                  Learn More
                </button>
              </div>
            </div>

            <div className="relative flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
                alt="High-end Laptop"
                className="w-full max-w-lg drop-shadow-[0_20px_50px_rgba(37,99,235,0.3)] transform hover:scale-105 transition duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
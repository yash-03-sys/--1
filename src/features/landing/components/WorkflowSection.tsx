import { motion } from 'motion/react';

export const WorkflowSection = () => {
  const steps = [
    { step: "01", title: "Upload Document", desc: "Drag and drop your PDF or research material." },
    { step: "02", title: "AI Analysis", desc: "Our AI understands content and structure instantly." },
    { step: "03", title: "Deep Research", desc: "Ask questions and browse related web sources." },
    { step: "04", title: "Map & Save", desc: "Explore source maps and save your research notes." }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-xl mx-auto">A seamless 4-step workflow to master any document.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent -translate-y-12" />
          
          {steps.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple font-bold text-xl mb-6 purple-glow">
                {item.step}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

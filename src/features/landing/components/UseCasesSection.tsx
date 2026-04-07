import { motion } from 'motion/react';
import { GraduationCap, Beaker, Code2, Briefcase, Users } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

const useCases = [
  {
    icon: <GraduationCap size={24} />,
    title: "Students",
    description: "Master complex subjects by turning lecture notes and textbooks into interactive study guides."
  },
  {
    icon: <Beaker size={24} />,
    title: "Researchers",
    description: "Analyze vast amounts of material, find connections, and map out source intelligence effortlessly."
  },
  {
    icon: <Code2 size={24} />,
    title: "Developers",
    description: "Navigate technical documentation and API references with an AI that understands context."
  },
  {
    icon: <Briefcase size={24} />,
    title: "Professionals",
    description: "Organize reports, analyze market data, and build structured research for business decisions."
  },
  {
    icon: <Users size={24} />,
    title: "Teams",
    description: "Collaborate on shared research projects with structured knowledge maps and synced notes."
  }
];

export const UseCasesSection = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for Every Researcher</h2>
          <p className="text-gray-400 max-w-xl mx-auto">From students to professionals, ::-1 adapts to your research needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {useCases.map((useCase, idx) => (
            <Card
              key={idx}
              whileHover={{ scale: 1.05 }}
              padding="sm"
              className="text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-4 text-brand-purple">
                {useCase.icon}
              </div>
              <h3 className="font-bold mb-2">{useCase.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{useCase.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

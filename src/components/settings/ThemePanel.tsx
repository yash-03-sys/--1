import { motion } from 'motion/react';
import { useThemeStore, ThemeType } from '@/src/app/store/themeStore';
import { Check } from 'lucide-react';
import { cn } from '@/src/utils/cn';

const themes: { id: ThemeType; label: string; colors: string[] }[] = [
  { id: 'cream', label: 'Cream & Brown', colors: ['#F5F2ED', '#2D241E'] },
  { id: 'black', label: 'Deep Black', colors: ['#000000', '#111111'] },
  { id: 'white', label: 'Pure White', colors: ['#FFFFFF', '#F5F5F5'] },
  { id: 'grey', label: 'Modern Grey', colors: ['#E5E5E5', '#333333'] },
  { id: 'yellow-brown', label: 'Yellow & Brown', colors: ['#FFF9E6', '#4D2600'] },
  { id: 'warm-brown', label: 'Warm Brown', colors: ['#3D2B1F', '#261A13'] },
];

export const ThemePanel = () => {
  const { theme: currentTheme, setTheme } = useThemeStore();

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif font-medium text-text-primary">Interface Themes</h2>
        <p className="text-text-secondary">Personalize your research environment with our curated palettes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ y: -4 }}
            onClick={() => setTheme(t.id)}
            className={cn(
              "premium-card p-6 cursor-pointer relative overflow-hidden group",
              currentTheme === t.id ? "border-brand-primary ring-2 ring-brand-primary/20" : "hover:border-brand-primary/50"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-text-primary">{t.label}</span>
              {currentTheme === t.id && (
                <div className="bg-brand-primary text-white p-1 rounded-full">
                  <Check size={12} />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {t.colors.map((c, i) => (
                <div 
                  key={i}
                  className="w-full h-12 rounded-xl border border-border-soft"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Handcrafted detail overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity">
              <div className="absolute inset-2 border border-dashed border-brand-primary rounded-2xl" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

import { Link } from 'react-router-dom';
import { cn } from '@/src/utils/cn';

export const BrandMark = ({ size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg', showText?: boolean }) => {
  const sizes = {
    sm: { circle: 'w-6 h-6 text-xs', text: 'text-lg' },
    md: { circle: 'w-8 h-8 text-lg', text: 'text-xl' },
    lg: { circle: 'w-12 h-12 text-2xl', text: 'text-3xl' }
  };

  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className={cn(
        "rounded-full bg-brand-purple flex items-center justify-center text-white font-bold purple-glow group-hover:scale-110 transition-transform",
        sizes[size].circle
      )}>
        ::
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tighter", sizes[size].text)} aria-label="Colon Colon Minus One">
          ::-1
        </span>
      )}
    </Link>
  );
};

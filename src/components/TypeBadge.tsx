import { PokemonType, TYPE_COLORS, TYPE_LABELS } from '@/data/typeChart';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
}

export default function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const color = TYPE_COLORS[type];
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-block rounded-full font-semibold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: color }}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}

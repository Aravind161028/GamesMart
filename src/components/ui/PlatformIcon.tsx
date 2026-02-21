import { Smartphone, Monitor, Command, Terminal } from 'lucide-react';
import { PlatformType } from '../../types';
import { cn } from '../../lib/utils';

interface PlatformIconProps {
  type: PlatformType;
  className?: string;
  showLabel?: boolean;
}

const PlatformIcon = ({ type, className, showLabel = false }: PlatformIconProps) => {
  const getIcon = () => {
    switch (type) {
      case 'android': return { icon: <Smartphone />, label: 'Android', color: 'text-green-500' };
      case 'ios': return { icon: <Smartphone />, label: 'iOS', color: 'text-gray-400' };
      case 'windows': return { icon: <Monitor />, label: 'Windows', color: 'text-blue-400' };
      case 'mac': return { icon: <Command />, label: 'macOS', color: 'text-gray-300' };
      case 'linux': return { icon: <Terminal />, label: 'Linux', color: 'text-yellow-500' };
      default: return { icon: <Monitor />, label: 'Unknown', color: 'text-gray-500' };
    }
  };

  const { icon, label, color } = getIcon();

  return (
    <div className={cn("flex items-center gap-1.5", color, className)} title={label}>
      <span className="w-4 h-4">{icon}</span>
      {showLabel && <span className="text-xs font-medium">{label}</span>}
    </div>
  );
};

export default PlatformIcon;

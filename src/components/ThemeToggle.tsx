import { useTheme, type ThemeChoice } from '../lib/theme';
import { Icon, type IconName } from './Icon';

const icons: Record<ThemeChoice, IconName> = {
  system: 'monitorsys',
  light: 'sun',
  dark: 'moon',
};

const labels: Record<ThemeChoice, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

export function ThemeToggle() {
  const { theme, cycle } = useTheme();
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={cycle}
      aria-label={`Theme: ${labels[theme]}. Activate to change.`}
      title={`Theme: ${labels[theme]}`}
    >
      <Icon name={icons[theme]} size={18} />
    </button>
  );
}

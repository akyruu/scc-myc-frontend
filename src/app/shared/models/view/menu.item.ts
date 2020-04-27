export interface MenuItem {
  name: string;
  icon?: string;
  showAsAction?: 'always' | 'ifRoom' | 'never';
  action?: () => void;
  disabled?: boolean | (() => boolean);
  visible?: boolean | (() => boolean);
}

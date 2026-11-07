'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from './ThemeProvider';
import { isThemeMode } from '@/lib/theme';
import type { Dictionary } from '@/data/i18n/en';

const choices = [
  { value: 'system', Icon: Monitor },
  { value: 'dark', Icon: Moon },
  { value: 'light', Icon: Sun },
] as const;

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function ThemeSwitcher({ labels }: { labels: Dictionary['theme'] }) {
  // SSR controls should not accept a click before their handler is attached.
  const hydrated = useSyncExternalStore(subscribe, clientReady, serverReady);
  const { theme, selectTheme } = useTheme();
  const current = choices.find((choice) => choice.value === theme)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={!hydrated}
          className="theme-trigger size-9 rounded-full border-line bg-surface text-ink hover:bg-accent-soft hover:text-accent"
          aria-label={`${labels.label}: ${labels[current.value]}`}
          title={`${labels.label}: ${labels[current.value]}`}
        >
          <current.Icon className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="theme-menu min-w-44 rounded-xl border-line bg-surface p-1.5 text-ink shadow-xl"
      >
        <DropdownMenuLabel className="px-2 py-2 text-xs font-medium text-muted">
          {labels.appearance}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-line" />
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            if (isThemeMode(value)) selectTheme(value);
          }}
        >
          {choices.map(({ value, Icon }) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              className="gap-2.5 rounded-lg py-2.5 focus:bg-accent-soft focus:text-ink"
            >
              <Icon className="size-4 text-muted" aria-hidden="true" />
              {labels[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

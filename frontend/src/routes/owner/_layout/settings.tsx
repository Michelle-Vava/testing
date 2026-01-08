import { createFileRoute } from '@tanstack/react-router';
import { SettingsView } from '@/features/settings/components/SettingsView';

export const Route = createFileRoute('/owner/_layout/settings')({
  component: SettingsView,
});

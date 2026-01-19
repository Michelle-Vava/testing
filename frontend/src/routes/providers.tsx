import { createFileRoute } from '@tanstack/react-router'
import { ProviderLanding } from '@/features/marketing/components/ProviderLanding'

export const Route = createFileRoute('/providers')({
  component: ProviderLanding,
})

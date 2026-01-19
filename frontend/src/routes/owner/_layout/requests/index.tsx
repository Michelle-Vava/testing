import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { OwnerRequestsList } from '@/features/requests/components/views/OwnerRequestsList';

const requestsSearchSchema = z.object({
  page: z.number().optional().default(1),
  status: z.string().optional(),
  sort: z.string().optional(),
});

export const Route = createFileRoute('/owner/_layout/requests/')({
  validateSearch: (search) => requestsSearchSchema.parse(search),
  component: OwnerRequestsList,
});

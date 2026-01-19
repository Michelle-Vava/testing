import { createFileRoute } from '@tanstack/react-router';
import { CreateRequestForm } from '@/features/requests/components/forms/CreateRequestForm';
import { z } from 'zod';

const searchSchema = z.object({
  vehicleId: z.string().optional(),
});

export const Route = createFileRoute('/owner/_layout/requests/new')({
  validateSearch: (search) => searchSchema.parse(search),
  component: CreateRequestForm,
});

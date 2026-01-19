/**
 * Vehicles API Layer
 * 
 * This file wraps Orval-generated hooks with:
 * - Consistent error handling
 * - DTO normalization
 * - Cache invalidation patterns
 * - Domain-specific logic
 * 
 * WHY: Keeps the rest of the feature from directly importing generated hooks,
 * making patterns consistent and refactoring easier.
 */

import { useQueryClient } from '@tanstack/react-query';
import {
  useVehiclesControllerFindAll,
  useVehiclesControllerFindOne,
  useVehiclesControllerCreate,
  useVehiclesControllerUpdate,
  useVehiclesControllerRemove,
  getVehiclesControllerFindAllQueryKey,
  getVehiclesControllerFindOneQueryKey,
} from '@/services/generated/vehicles/vehicles';
import type { CreateVehicleDto, UpdateVehicleDto } from '@/services/generated/model';
import { useApiError } from '@/features/errors/hooks/useApiError';
import { eventBus, EVENTS } from '@/lib/event-bus';

/**
 * Normalized Vehicle type (UI-ready)
 * Adds computed fields and ensures consistent shape
 */
export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  vin?: string;
  licensePlate: string;
  color?: string;
  mileage?: number;
  displayName: string; // computed: "2020 Toyota Camry"
  createdAt: string;
  updatedAt: string;
}

/**
 * Normalize backend DTO to UI-ready Vehicle
 */
function normalizeVehicle(dto: any): Vehicle {
  return {

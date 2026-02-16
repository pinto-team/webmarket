import { CargoMethodResource } from '@/types/order.types';

export const calculateShippingCost = (
  cargoMethod: CargoMethodResource,
  weight: number,
  orderTotal: number = 0
): number => {
  // Check if shipping is free
  if (cargoMethod.free_over > 0 && orderTotal >= cargoMethod.free_over) {
    return 0;
  }

  // Calculate based on weight
  const weightCost = parseFloat(cargoMethod.per_kg_rate) * weight;
  const basePrice = parseFloat(cargoMethod.base_price);

  // Return maximum of the two
  return Math.max(weightCost, basePrice);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price);
};

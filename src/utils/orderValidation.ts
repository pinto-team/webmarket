import { CargoMethodSelection, ShipmentResource } from "@/types/order.types";

export const validateMobile = (mobile: string): boolean => {
  const pattern = /^9[0-9]{9}$/;
  return pattern.test(mobile);
};

export const validateCustomerName = (name: string): boolean => {
  return name.length > 0 && name.length <= 60;
};

export const validateCustomerEmail = (email: string): boolean => {
  if (!email) return true;
  return email.length <= 60;
};

export const validateCargoSelections = (
  shipments: ShipmentResource[],
  selections: CargoMethodSelection[]
): boolean => {
  const shipmentsWithCargo = shipments.filter(s => s.available_cargo_methods && s.available_cargo_methods.length > 0);
  
  if (shipmentsWithCargo.length === 0) return true;
  
  return shipmentsWithCargo.every(shipment =>
    selections.some(selection => selection.shipment_id === shipment.id)
  );
};

export const validateGatewaySelection = (
  gatewayType: string,
  gatewayId?: number,
  shopGatewayId?: number
): boolean => {
  if (gatewayType === "platform") {
    return !!gatewayId;
  }
  if (gatewayType === "shop") {
    return !!shopGatewayId;
  }
  return false;
};

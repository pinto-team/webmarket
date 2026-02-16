import { RegionResource } from "@/types/region.types";

export interface AddressResource {
  id: number;
  region: RegionResource;
  label?: string;
  title: string;
  mobile: string;
  district: string;
  street: string;
  postal: string;
  code: number;
  floor: number;
  room: number;
  lat: number;
  lng: number;
}

export interface AddressRequest {
  region_id: number;
  label?: string;
  title: string;
  mobile: string;
  district: string;
  street: string;
  postal: string;
  code?: number;
  floor?: number;
  room?: number;
  lat?: number;
  lng?: number;
}

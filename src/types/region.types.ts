// Region resource
export interface RegionResource {
  id: number;
  title: string;
  code: string | null;
  parent_id: number | null;
  parent?: RegionResource | null;
  children?: RegionResource[];
}

// Region list params
export interface RegionListParams {
  parent_id?: number;
}

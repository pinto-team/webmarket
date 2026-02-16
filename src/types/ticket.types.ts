export enum TicketStatusEnum {
  OPEN = 0,
  REPLIED = 1,
  PROGRESS = 2,
  CLOSED = 3
}

export interface TicketResource {
  id: number;
  status: TicketStatusEnum;
  status_label: string;
  ownerable: CustomerResource | null;
  replies: TicketReplyResource[] | null;
  created_at: string;
  updated_at: string;
}

export interface TicketReplyResource {
  id: number;
  ownerable: CustomerResource | null;
  description: string;
  uploads: UploadResource[] | null;
  created_at: string;
}

export interface CustomerResource {
  id: number;
  username: string;
  mobile: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  upload?: UploadResource | null;
}

export interface UploadResource {
  id: number;
  main_url: string;
  thumb_url?: string;
  title?: string;
  size?: number;
}

export interface TicketCreateRequest {
  description: string;
  upload_ids?: number[];
}

export interface UploadRequest {
  file: File;
  priority?: number;
}

import axiosInstance from "@/utils/axiosInstance";
import { ApiResponse } from "@/types/api.types";
import { UploadResource } from "@/types/ticket.types";

export const uploadFile = async (file: File, priority?: number): Promise<UploadResource> => {
  const formData = new FormData();
  formData.append("file", file);
  if (priority !== undefined) {
    formData.append("priority", priority.toString());
  }

  const response = await axiosInstance.post<ApiResponse<UploadResource>>(
    "/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
};

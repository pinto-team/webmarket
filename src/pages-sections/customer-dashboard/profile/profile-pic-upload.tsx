"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import CameraEnhance from "@mui/icons-material/CameraEnhance";
import FlexBox from "components/flex-box/flex-box";
import { useUpload } from "@/hooks/useUpload";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePicUpload({ image }: { image: string }) {
  const [avatarUrl, setAvatarUrl] = useState(image);
  const { upload, uploading } = useUpload();
  const { updateOptions } = useProfile();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("فرمت فایل نامعتبر است");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از 5 مگابایت باشد");
      return;
    }

    try {
      const result = await upload(file);
      await updateOptions({ email: "", upload_id: result.id });
      setAvatarUrl(result.main_url);
      toast.success("تصویر پروفایل با موفقیت آپلود شد");
    } catch {
      toast.error("خطا در آپلود تصویر");
    }
  };

  return (
    <FlexBox alignItems="flex-end" mb={4}>
      <Avatar sx={{ height: 60, width: 60 }}>
        <Image fill alt="user" src={avatarUrl} sizes="(60px, 60px)" />
      </Avatar>

      <IconButton
        size="small"
        component="label"
        color="secondary"
        htmlFor="profile-image"
        disabled={uploading}
        sx={{ bgcolor: "grey.300", ml: -2.5 }}>
        {uploading ? <CircularProgress size={20} /> : <CameraEnhance fontSize="small" />}
      </IconButton>

      <Box
        type="file"
        display="none"
        accept="image/*"
        component="input"
        id="profile-image"
        onChange={handleFileChange}
      />
    </FlexBox>
  );
}

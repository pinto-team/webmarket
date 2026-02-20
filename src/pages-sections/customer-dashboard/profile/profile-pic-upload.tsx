"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CameraEnhance from "@mui/icons-material/CameraEnhance";

import FlexBox from "components/flex-box/flex-box";

import { useUpload } from "@/hooks/useUpload";
import { useProfile } from "@/hooks/useProfile";
import { t } from "@/i18n/t";
import { getServerImageUrl } from "@/utils/imageUtils";

export default function ProfilePicUpload({ image }: { image: string }) {
    // image ممکنه URL مستقیم باشه یا خالی؛ helper خودش placeholder می‌دهد
    const [avatarUrl, setAvatarUrl] = useState(() => getServerImageUrl(image, "60x60"));

    const { upload, uploading } = useUpload();
    const { updateOptions } = useProfile();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

        if (!validTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
            toast.error(
                t("files.allowedFormatsWithMax", {
                    formats: t("files.allowedFormats"),
                    maxMb: 5,
                })
            );
            return;
        }

        try {
            const result = await upload(file);

            await updateOptions({
                email: "",
                upload_id: result.id,
            });

            // ✅ canonical: proxy_url
            setAvatarUrl(getServerImageUrl(result, "60x60"));

            toast.success(t("profile.avatarUploadSuccess"));
        } catch {
            toast.error(t("profile.avatarUploadFailed"));
        }
    };

    return (
        <FlexBox alignItems="flex-end" mb={4}>
            <Avatar sx={{ height: 60, width: 60, position: "relative", overflow: "hidden" }}>
                <Image fill alt="user" src={avatarUrl} sizes="60px" style={{ objectFit: "cover" }} />
            </Avatar>

            <IconButton
                size="small"
                component="label"
                color="secondary"
                htmlFor="profile-image"
                disabled={uploading}
                sx={{ bgcolor: "grey.300", ml: -2.5 }}
            >
                {uploading ? <CircularProgress size={20} /> : <CameraEnhance fontSize="small" />}
            </IconButton>

            <Box
                component="input"
                type="file"
                display="none"
                id="profile-image"
                accept="image/*"
                onChange={handleFileChange}
            />
        </FlexBox>
    );
}

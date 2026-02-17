"use client";

import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { ModalWrapper } from "./styles";

type Story = {
    url?: string;
    content?: any;
};

interface Props {
    open: boolean;
    handleClose: () => void;
    stories?: Story[];
    currentIndex?: number;
    width?: number;
    height?: number;
    defaultInterval?: number;
}

export default function StoryViewer({ open, handleClose, width = 360, height = 640 }: Props) {
    return (
        <Modal open={open} onClose={handleClose}>
            <ModalWrapper style={{ width, height }}>
                <Typography sx={{ p: 2, textAlign: "center" }}>
                    Stories is disabled (missing dependency).
                </Typography>
            </ModalWrapper>
        </Modal>
    );
}

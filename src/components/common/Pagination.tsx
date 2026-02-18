import { Box, Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { t } from "@/i18n/t";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       onPageChange,
                                   }: PaginationProps) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={4}>
            <Button
                variant="outlined"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                startIcon={<ChevronRight />}
            >
                {t("pagination.previous")}
            </Button>

            <Box>
                {t("pagination.pageInfo", {
                    current: currentPage,
                    total: totalPages,
                })}
            </Box>

            <Button
                variant="outlined"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                endIcon={<ChevronLeft />}
            >
                {t("pagination.next")}
            </Button>
        </Box>
    );
}

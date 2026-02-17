"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import { t } from "@/i18n/t";
import { getTransactions } from "@/services/transaction.service";
import type { TransactionResource } from "@/types/transaction.types";

import { formatPersianPrice, formatPersianDateTime, toPersianNumber } from "@/utils/persian";
import DashboardHeader from "pages-sections/customer-dashboard/dashboard-header";

const PER_PAGE = 10;

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<TransactionResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getTransactions({ paged: page, count: PER_PAGE });
            setTransactions(data.items || []);
            setTotalPages(data.pagination?.last_page || 1);
        } catch (error) {
            console.error(t("transactions.fetchError"), error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return (
        <>
            <DashboardHeader title={t("transactions.title")} />

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("transactions.table.id")}</TableCell>
                                <TableCell>{t("transactions.table.type")}</TableCell>
                                <TableCell>{t("transactions.table.amount")}</TableCell>
                                <TableCell>{t("transactions.table.status")}</TableCell>
                                <TableCell>{t("transactions.table.description")}</TableCell>
                                <TableCell>{t("transactions.table.date")}</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        {t("common.loading")}
                                    </TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        {t("transactions.noData")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{toPersianNumber(transaction.id)}</TableCell>

                                        <TableCell>{transaction.type_label}</TableCell>

                                        <TableCell>
                                            <Typography
                                                color={transaction.price > 0 ? "success.main" : "error.main"}
                                                fontWeight={600}
                                            >
                                                {formatPersianPrice(transaction.price)} {t("products.currencyLabel")}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={transaction.status_label}
                                                color={transaction.status === 1 ? "success" : "default"}
                                            />
                                        </TableCell>

                                        <TableCell>{transaction.description}</TableCell>

                                        <TableCell>{formatPersianDateTime(transaction.created_at)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {totalPages > 1 && (
                    <Box display="flex" justifyContent="center" p={3}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                        />
                    </Box>
                )}
            </Card>
        </>
    );
}

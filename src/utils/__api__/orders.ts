import { cache } from "react";
import axios from "utils/axiosInstance";
// CUSTOM DATA MODEL
import Order from "models/Order.model";
import { IdParams } from "models/Common";

const getOrders = cache(async (page = 0) => {
  const PAGE_SIZE = 5;
  const PAGE_NO = page - 1;

  try {
    const { data: orders } = await axios.get<Order[]>("/orders");
    const totalPages = Math.ceil(orders.length / PAGE_SIZE);
    const currentOrders = orders.slice(PAGE_NO * PAGE_SIZE, (PAGE_NO + 1) * PAGE_SIZE);
    return { orders: currentOrders, totalOrders: orders.length, totalPages };
  } catch (error: any) {
    if (error.response?.status === 404 || error.response?.status === 401) {
      return { orders: [], totalOrders: 0, totalPages: 0 };
    }
    throw error;
  }
});

const getIds = cache(async () => {
  const response = await axios.get<IdParams[]>("/api/users/order-ids");
  return response.data;
});

const getOrder = cache(async (id: string) => {
  const response = await axios.get<Order>("/api/users/order", { params: { id } });
  return response.data;
});

export default { getOrders, getOrder, getIds };

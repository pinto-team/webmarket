import axiosInstance from "@/utils/axiosInstance";
import { v4 as uuidv4 } from "uuid";

const TEMP_ID_KEY = "temp_cart_id";

// UUID v4 regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const cartService = {
  getTempId(): string {
    if (typeof window === "undefined") return "";
    let tempId = localStorage.getItem(TEMP_ID_KEY);
    if (!tempId || !UUID_REGEX.test(tempId)) {
      tempId = uuidv4();
      localStorage.setItem(TEMP_ID_KEY, tempId);
    }
    return tempId;
  },

  clearTempId(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TEMP_ID_KEY);
    }
  },

  ensureTempId(): string {
    return this.getTempId();
  },

  async getCartItems() {
    const response = await axiosInstance.get("/cart-items");
    return response.data;
  },

  async addToCart(params: { sku_id: number; quantity: number; temp_id?: string; product_code?: string }) {
    const tempId = this.getTempId();
    
    // Store product code mapping in localStorage
    if (params.product_code && typeof window !== "undefined") {
      const mappings = JSON.parse(localStorage.getItem("sku_product_map") || "{}");
      mappings[params.sku_id] = params.product_code;
      localStorage.setItem("sku_product_map", JSON.stringify(mappings));
    }
    
    const response = await axiosInstance.post("/cart-items", {
      sku_id: params.sku_id,
      quantity: params.quantity,
      temp_id: params.temp_id || tempId
    });
    return response.data;
  },

  getProductCodeForSku(skuId: number): string | null {
    if (typeof window === "undefined") return null;
    const mappings = JSON.parse(localStorage.getItem("sku_product_map") || "{}");
    return mappings[skuId] || null;
  },

  async updateCartItem(id: number, quantity: number) {
    const response = await axiosInstance.put(`/cart-items/${id}`, { quantity });
    return response.data;
  },

  async removeCartItem(id: number) {
    const response = await axiosInstance.delete(`/cart-items/${id}`);
    return response.data;
  },

  async syncCart(isAuthenticated: boolean) {
    // Cart migration now handled by login/register with temp_id
    // Clear temp_id after successful authentication
    if (isAuthenticated) {
      this.clearTempId();
    }
  },

  async clearCart() {
    const cartItems = await this.getCartItems();
    const items = cartItems.data || [];
    await Promise.all(items.map((item: { id: number; }) => this.removeCartItem(item.id)));
  }
};

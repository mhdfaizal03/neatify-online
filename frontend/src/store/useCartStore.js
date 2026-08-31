import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildCartOrderMessage, buildWhatsAppUrl } from "../utils/whatsapp";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const { items } = get();
        const pId = String(product.id || product._id);
        const existing = items.find((i) => String(i.id) === pId);
        const addQty = Math.max(1, Number(quantity) || 1);

        if (existing) {
          set({
            items: items.map((i) =>
              String(i.id) === pId ? { ...i, qty: i.qty + addQty } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: pId,
                name: product.name,
                price: Number(product.price) || 0,
                image: product.image,
                type: product.type || product.category || "Exterior",
                qty: addQty,
              },
            ],
          });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => String(i.id) !== String(id)) });
      },
      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (String(i.id) === String(id) ? { ...i, qty } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.qty, 0);
      },
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.qty, 0);
      },
      getWhatsAppOrderUrl: ({ customer = {}, shipping = 0, orderId = "", phone } = {}) => {
        const { items, getCartTotal } = get();
        const subtotal = getCartTotal();
        const total = subtotal + shipping;
        const msg = buildCartOrderMessage({
          items,
          subtotal,
          shipping,
          total,
          customer,
          orderId,
        });
        return buildWhatsAppUrl(msg, phone);
      },
    }),
    {
      name: "neatify-cart-v2",
    }
  )
);


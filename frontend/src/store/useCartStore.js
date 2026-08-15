import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const { items } = get();
        const existing = items.find((i) => i.id === product._id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product._id ? { ...i, qty: i.qty + 1 } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                qty: 1,
              },
            ],
          });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.qty, 0);
      },
    }),
    {
      name: "neatify-cart",
    }
  )
);

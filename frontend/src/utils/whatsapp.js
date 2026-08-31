/**
 * Neatify Car Care — WhatsApp Commerce & Messaging Utilities
 */

export const DEFAULT_WHATSAPP_NUMBER = "918113001959";

/**
 * Normalizes a phone number to pure digits suitable for wa.me URLs.
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return DEFAULT_WHATSAPP_NUMBER;
  const digits = String(phone).replace(/\D/g, "");
  return digits || DEFAULT_WHATSAPP_NUMBER;
}

/**
 * Constructs a wa.me URL with phone and URL-encoded message text.
 */
export function buildWhatsAppUrl(message, phone = DEFAULT_WHATSAPP_NUMBER) {
  const targetPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${targetPhone}?text=${encodedText}`;
}

/**
 * Builds a direct single product order message.
 */
export function buildProductOrderMessage(product, quantity = 1, customNotes = "") {
  if (!product) return "Hello Neatify, I would like to place an order.";
  const qty = Math.max(1, Number(quantity) || 1);
  const unitPrice = Number(product.price) || 0;
  const totalAmount = unitPrice * qty;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const productUrl = `${baseUrl}/product/${product.id || product._id}`;

  return `*NEW ORDER — NEATIFY CAR CARE* 🚗✨
------------------------------------
*Product:* ${product.name}
*Category:* ${product.type || product.category || "Exterior Care"}
*Quantity:* ${qty}
*Unit Price:* ₹${unitPrice}
*Total Amount:* ₹${totalAmount}
------------------------------------
*Product Link:* ${productUrl}${customNotes ? `\n*Note:* ${customNotes}` : ""}

Please confirm availability and dispatch details. Thank you!`;
}

/**
 * Builds a single product inquiry message.
 */
export function buildProductInquiryMessage(product) {
  if (!product) return "Hello Neatify, I would like to inquire about your products.";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const productUrl = `${baseUrl}/product/${product.id || product._id}`;

  return `*PRODUCT INQUIRY — NEATIFY CAR CARE* 🚗❓
------------------------------------
Hello Neatify! I have a question regarding:
*Product:* ${product.name} (₹${product.price})
*Link:* ${productUrl}

Could you please share more details about its application and recommended usage?`;
}

/**
 * Builds shareable text for a product.
 */
export function buildProductShareText(product) {
  if (!product) return "Check out Neatify Car Care products!";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const productUrl = `${baseUrl}/product/${product.id || product._id}`;
  return `Check out *${product.name}* (₹${product.price}) on Neatify Car Care:
${productUrl}`;
}

export const DELIVERY_STORAGE_KEY = "neatify_customer_delivery_details";

/**
 * Saves customer delivery details to browser localStorage for future auto-fill.
 */
export function saveCustomerDeliveryDetails(details) {
  if (typeof window === "undefined" || !details) return;
  try {
    localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(details));
  } catch (e) {
    console.warn("Could not save delivery details to localStorage:", e);
  }
}

/**
 * Retrieves saved customer delivery details from browser localStorage.
 */
export function loadCustomerDeliveryDetails() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DELIVERY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Formats the structured delivery details block according to exact specification.
 */
export function formatDeliveryDetailsBlock(customer = {}) {
  const lines = [];
  lines.push("📍 *NEATIFY — DELIVERY DETAILS*");
  lines.push(`• *Customer Name:* ${customer.name || "N/A"}`);
  lines.push(`• *Phone / WhatsApp Number:* ${customer.phone || "N/A"}`);
  if (customer.altPhone) {
    lines.push(`• *Alternative Number:* ${customer.altPhone}`);
  }

  lines.push("\n🏡 *Full Delivery Address:*");
  if (customer.house) lines.push(`• *House / Building Name:* ${customer.house}`);
  if (customer.street) lines.push(`• *Street / Road:* ${customer.street}`);
  if (customer.locality) lines.push(`• *Area / Locality:* ${customer.locality}`);
  if (customer.city) lines.push(`• *City / Town:* ${customer.city}`);
  if (customer.district) lines.push(`• *District:* ${customer.district}`);
  if (customer.state) lines.push(`• *State:* ${customer.state}`);
  if (customer.pin) lines.push(`• *PIN Code:* ${customer.pin}`);
  
  if (!customer.house && !customer.street && customer.address) {
    lines.push(`• *Address:* ${customer.address}`);
  }

  if (customer.landmark) {
    lines.push(`\n🚩 *Landmark:* ${customer.landmark}`);
  }
  if (customer.instructions || customer.notes) {
    lines.push(`📝 *Delivery Instructions:* ${customer.instructions || customer.notes}`);
  }

  return lines.join("\n");
}

/**
 * Builds a bundle / kit order message.
 */
export function buildKitOrderMessage(kit, includedItems = [], customer = {}) {
  if (!kit) return "Hello Neatify, I would like to order the kit.";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const productUrl = `${baseUrl}/product/${kit.id || kit._id}`;

  let itemsList = "";
  if (includedItems && includedItems.length > 0) {
    itemsList = includedItems.map((it, idx) => `  ${idx + 1}. ${it.name} (₹${it.price})`).join("\n");
  } else if (kit.points && kit.points.length > 0) {
    itemsList = kit.points.map((pt, idx) => `  ${idx + 1}. ${pt}`).join("\n");
  }

  const deliveryBlock = customer && customer.name ? `\n\n${formatDeliveryDetailsBlock(customer)}\n` : "";

  return `*FEATURED KIT ORDER — NEATIFY CAR CARE* 🧰✨
----------------------------------------
*Kit:* ${kit.name}
*Price:* ₹${kit.price}
${itemsList ? `*Included in kit:*\n${itemsList}\n` : ""}----------------------------------------
*Link:* ${productUrl}${deliveryBlock}
----------------------------------------
Please confirm my kit order and delivery schedule. Thank you!`;
}

/**
 * Builds a multi-item cart order manifest message with structured delivery details.
 */
export function buildCartOrderMessage({ items = [], subtotal = 0, shipping = 0, total = 0, customer = {}, orderId = "" }) {
  const lines = items.map((item, idx) => {
    const itemSub = (Number(item.price) || 0) * (Number(item.qty) || 1);
    return `${idx + 1}. *${item.name}* × ${item.qty} — ₹${itemSub}`;
  }).join("\n");

  const shippingText = shipping === 0 ? "FREE" : `₹${shipping}`;
  const deliveryBlock = formatDeliveryDetailsBlock(customer);

  return `*NEATIFY CAR CARE — ORDER ${orderId ? `#${orderId}` : ""}* 🛒🚗
----------------------------------------
*Ordered Items:*
${lines || "No items"}
----------------------------------------
*Subtotal:* ₹${subtotal}
*Shipping:* ${shippingText}
*Grand Total:* *₹${total}*
----------------------------------------

${deliveryBlock}

----------------------------------------
Please confirm my order and share payment / delivery schedule. Thank you!`;
}

/**
 * Builds a general support chat inquiry.
 */
export function buildSupportChatMessage(topic = "") {
  return `Hello Neatify Car Care! I would like to get more information about your automotive care products.${topic ? ` Topic: ${topic}` : ""}`;
}

/**
 * Opens WhatsApp with a given message and phone.
 */
export function openWhatsApp(message, phone = DEFAULT_WHATSAPP_NUMBER) {
  const url = buildWhatsAppUrl(message, phone);
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  return url;
}

/**
 * Shares text via Web Share API if supported, or opens WhatsApp web share.
 */
export async function shareToWhatsApp(text, url = "") {
  const fullText = url ? `${text}\n${url}` : text;
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: "Neatify Car Care",
        text: text,
        url: url || (typeof window !== "undefined" ? window.location.href : ""),
      });
      return true;
    } catch {
      // If user dismissed share sheet or failed, fallback to direct WhatsApp
    }
  }
  
  // Fallback to WhatsApp share link
  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
  if (typeof window !== "undefined") {
    window.open(waShareUrl, "_blank", "noopener,noreferrer");
  }
  return true;
}

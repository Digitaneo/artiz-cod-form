// WhatsApp Direct Order Adapter
// Places order into Shopify identically to COD, and generates a pre-filled Arabic WhatsApp summary link

export class WhatsAppGateway {
  constructor(env, config = {}) {
    this.env = env;
    this.storePhone = config.phone || config.storePhone || "9647700000000"; // default store whatsapp
  }

  /**
   * Builds the formatted Arabic WhatsApp message and wa.me redirect URL
   */
  generateWhatsAppLink({ orderNumber, customer, items, total, currency, shippingPrice, note }) {
    let cleanPhone = String(this.storePhone).replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("00")) {
      cleanPhone = cleanPhone.slice(2);
    }

    const itemsSummary = items
      .map((it, idx) => `▫️ *${idx + 1}. ${it.title}* ${it.variantTitle ? `(${it.variantTitle})` : ""} × ${it.quantity} - ${it.price} ${currency}`)
      .join("\n");

    const messageText = [
      `👋 مرحباً، أود تأكيد طلبي الجديد من المتجر:`,
      `📦 *رقم الطلب:* ${orderNumber}`,
      `----------------------------`,
      `👤 *الاسم:* ${customer.name || "-"}`,
      `📱 *رقم الهاتف:* ${customer.phone || "-"}`,
      `📍 *المدينة / المحافظة:* ${customer.city || customer.province || "-"}`,
      `🏠 *العنوان:* ${customer.address || "-"}`,
      note ? `📝 *ملاحظة التوصيل:* ${note}` : "",
      `----------------------------`,
      `🛍️ *المنتجات المطلوبة:*`,
      itemsSummary,
      `----------------------------`,
      Number(shippingPrice) > 0 ? `🚚 *سعر التوصيل:* ${shippingPrice} ${currency}` : `🚚 *التوصيل:* مجاني`,
      `💰 *المجموع الإجمالي:* ${total} ${currency}`,
      `----------------------------`,
      `يرجى تأكيد تجهيز الشحنة في أقرب وقت. شكراً لكم!`
    ].filter(Boolean).join("\n");

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    return {
      whatsappUrl,
      messageText
    };
  }
}

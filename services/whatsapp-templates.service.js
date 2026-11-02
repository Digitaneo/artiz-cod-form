// Shared WhatsApp Templates Service
// Single authoritative place for all WhatsApp customer communication templates
// Usable across Abandoned Cart recovery, Order Confirmations, Deliveries, and Bot Dispatch

export const WHATSAPP_TEMPLATE_LABELS = {
  abandoned_recovery: "استعادة السلة (مساعدة)",
  abandoned_discount: "استعادة السلة (عرض خصم)",
  confirmation: "تأكيد الدفع",
  credentials: "تسليم الاشتراك / الطلب",
  delay: "إشعار تأخير",
  follow_up: "متابعة الطلب",
  review_request: "طلب تقييم الخدمة",
  custom: "رسالة مخصّصة"
};

export const WHATSAPP_TEMPLATE_KEYS = Object.keys(WHATSAPP_TEMPLATE_LABELS);

export function normalizePhoneNumber(phone) {
  if (!phone) return "";
  let clean = String(phone).replace(/[^\d+]/g, "").replace(/^\+/, "");
  // If number starts with 00, strip it
  if (clean.startsWith("00")) {
    clean = clean.slice(2);
  }
  return clean;
}

export function buildWhatsappMessage(template, data = {}) {
  const name = (data.customer_name || "عميلنا الكريم").trim();
  const storeName = (data.store_name || "متجرنا").trim();
  const storeSign = `فريق ${storeName} 🌟`;
  const storeUrl = data.store_url || (data.shop === "iuq7xa-0g.myshopify.com" ? "https://aladdinfitness.com" : (data.shop ? `https://${data.shop}` : "https://aladdinfitness.com"));
  const currency = data.currency || "IQD";
  const eta = (data.time_estimate || "15-30 دقيقة").trim();

  const fmtPrice = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) return "";
    return `${amount.toLocaleString()} ${currency}`;
  };

  switch (template) {
    case "abandoned_recovery": {
      const checkoutUrl = data.checkout_url || storeUrl;
      const lines = [
        `السلام عليكم ${name} 👋`,
        "",
        `لاحظنا أنك بدأت طلب في متجر ${storeName} ولم تتمكن من إكمال الدفع.`
      ];
      if (data.product_name) lines.push(`🛒 *المنتج:* ${data.product_name}`);
      if (typeof data.total === "number") lines.push(`💰 *المبلغ:* ${fmtPrice(data.total)}`);
      lines.push("");
      lines.push("هل واجهتك أي مشكلة أثناء الدفع أو تحتاج مساعدة لإكمال طلبك؟");
      lines.push("يسعدنا الرد على استفسارك ومساعدتك في أي وقت 💬");
      lines.push("");
      lines.push(`🔗 رابط المتجر: ${checkoutUrl}`);
      lines.push("");
      lines.push(storeSign);
      return lines.join("\n");
    }

    case "abandoned_discount": {
      const code = (data.discount_code || "OFFER10").trim().toUpperCase();
      const pct = data.discount_percent ?? 10;
      const checkoutUrl = data.checkout_url || storeUrl;
      const lines = [
        `السلام عليكم ${name} 👋`,
        "",
        `لاحظنا أنك بدأت طلب في متجر ${storeName} ولم تتمكن من إكمال الدفع.`
      ];
      if (data.product_name) lines.push(`🛒 *المنتج:* ${data.product_name}`);
      if (typeof data.total === "number") lines.push(`💰 *المبلغ:* ${fmtPrice(data.total)}`);
      lines.push("");
      lines.push("ولأنك غالي علينا 🫶🏻");
      lines.push(`هذا كود خصم خاص ${pct}٪ لك وللي يعز عليك:`);
      lines.push(`الكود هو: *${code}*`);
      lines.push("أكمل طلبك الآن واستفد من الخصم الحصري.");
      lines.push("");
      lines.push(`🔗 رابط المتجر: ${checkoutUrl}`);
      lines.push("");
      lines.push("نحن هنا لمساعدتك في أي وقت 💬");
      lines.push(storeSign);
      return lines.join("\n");
    }

    case "confirmation": {
      const trackUrl = data.order_number
        ? `${storeUrl}/pages/track-order?orderNumber=${encodeURIComponent(data.order_number)}`
        : `${storeUrl}/pages/track-order`;
      const lines = [
        `السلام عليكم ${name} 👋`,
        "",
        `تم تأكيد الدفع والطلب بنجاح في متجر ${storeName} ✅`
      ];
      if (data.order_number) lines.push(`📦 *رقم الطلب:* #${data.order_number}`);
      if (data.product_name) lines.push(`🛒 *المنتج:* ${data.product_name}`);
      if (typeof data.total === "number") lines.push(`💰 *المبلغ:* ${fmtPrice(data.total)}`);
      lines.push("");
      lines.push(`سنبدأ بتجهيز طلبك وإرساله فوراً خلال ${eta}.`);
      lines.push(`📘 لمتابعة حالة الطلب: ${trackUrl}`);
      lines.push("");
      lines.push(`شكراً لثقتك بـ ${storeName} 🌟`);
      return lines.join("\n");
    }

    case "credentials": {
      const lines = [
        `السلام عليكم ${name} 👋`,
        "",
        `تم تجهيز طلبك / اشتراكك بنجاح في متجر ${storeName} ✅`
      ];
      if (data.order_number) lines.push(`📦 *رقم الطلب:* #${data.order_number}`);
      if (data.product_name) lines.push(`🛒 *المنتج:* ${data.product_name}`);
      lines.push("");
      lines.push("بيانات الطلب / الاشتراك:");
      if (data.username) lines.push(`🔑 *اسم المستخدم / الكود:* ${data.username}`);
      if (data.password) lines.push(`🔐 *كلمة المرور:* ${data.password}`);
      if (data.url) lines.push(`🔗 *الرابط:* ${data.url}`);
      lines.push("");
      lines.push("إذا كان لديك أي استفسار أو احتجت مساعدة، يسعدنا الرد عليك هنا في أي وقت 💬");
      lines.push(storeSign);
      return lines.join("\n");
    }

    case "delay": {
      const lines = [
        `السلام عليكم ${name} 👋`,
        "",
        `نعتذر منك — الطلب${data.order_number ? ` #${data.order_number}` : ""} يحتاج وقتاً إضافياً للتجهيز.`
      ];
      lines.push(`⏰ الوقت المتوقّع: ${eta}`);
      lines.push("");
      lines.push("شكراً جزيلاً لصبرك وتفهمك 🙏");
      lines.push(storeSign);
      return lines.join("\n");
    }

    case "follow_up": {
      const lines = [
        `السلام عليكم ${name} 👋`,
        "",
        `نتابع معك بخصوص الطلب${data.order_number ? ` #${data.order_number}` : ""}.`,
        "هل كل شيء يعمل معك ووصلك بشكل سليم وممتاز؟",
        "",
        `في خدمتك دائماً 💬 — ${storeSign}`
      ];
      return lines.join("\n");
    }

    case "review_request": {
      const revUrl = data.product_slug
        ? `${storeUrl}/products/${data.product_slug}#reviews`
        : storeUrl;
      const lines = [
        `مرحباً بك ${name} 🌟`,
        "",
        data.product_name
          ? `نتمنى أن تكون تجربتك مع طلب *(${data.product_name})* تجربة ممتازة وتليق بتطلعاتك!`
          : "نتمنى أن تكون تجربتك مع طلبك تجربة ممتازة وتليق بتطلعاتك!",
        "",
        "رأيك وملاحظاتك تهمنا كثيراً وتساعدنا على تطوير خدماتنا باستمرار.",
        "يسعدنا مشاركتنا تقييمك عبر الرابط المباشر:",
        `⭐ ${revUrl}`,
        "",
        `شكراً لاختيارك ${storeName}، ونحن في خدمتك دائماً في أي وقت 👋`,
        storeSign
      ];
      return lines.join("\n");
    }

    case "custom": {
      return (data.custom_text || "").trim() || `السلام عليكم ${name} 👋\n\n…\n\n${storeSign}`;
    }

    default:
      return `السلام عليكم ${name} 👋\n\n${storeSign}`;
  }
}

export function buildWhatsappLink(phone, message) {
  const cleanPhone = normalizePhoneNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}


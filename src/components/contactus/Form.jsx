import React, { useState, useEffect, useRef } from "react";
import { getContactPage, submitContactForm } from "../../Api/api";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function ContactSection() {
  const [contactFormData, setContactFormData] = useState(null);
  const [isVietnamese, setIsVietnamese] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  // ✅ Detect language (body class)
  useEffect(() => {
    const checkLang = () =>
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    checkLang();

    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  // ✅ Fetch contact form data
  useEffect(() => {
    getContactPage().then((res) => {
      if (res.data?.contactForm) {
        setContactFormData(res.data.contactForm);
      }
    });
  }, []);

  const isVideo = contactFormData?.contactFormImg
    ? /\.(mp4|webm|ogg)$/i.test(contactFormData.contactFormImg)
    : false;

  return (
    <section className="bg-white">
      <div className="mx-auto page-width pt-10 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-stretch">
          {/* LEFT: Image/Video */}
          <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm min-h-[520px] sm:aspect-[4/5] lg:aspect-auto">
            {contactFormData?.contactFormImg ? (
              isVideo ? (
                <video
                  src={getFullUrl(contactFormData.contactFormImg)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <img
                  src={getFullUrl(contactFormData.contactFormImg)}
                  alt="Contact"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              )
            ) : (
              <img
                src="/img/about/contact.png"
                alt="Contact"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            )}
          </div>

          {/* RIGHT: Form */}
          <div className="rounded-2xl ring-1 ring-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <ContactForm
              heading={
                isVietnamese
                  ? contactFormData?.contactForm?.vi ||
                    "Gửi tin nhắn cho chúng tôi"
                  : contactFormData?.contactForm?.en || "Send Us a Message"
              }
              isVietnamese={isVietnamese}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** ---------- Contact Form Component (with API submit) ---------- */
function ContactForm({ heading, isVietnamese }) {
  const [openProduct, setOpenProduct] = useState(false);
  const [values, setValues] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    product: "",
    message: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const firstErrorRef = useRef(null);
  const productRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (productRef.current && !productRef.current.contains(event.target)) {
        setOpenProduct(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const t = (en, vi) => (isVietnamese ? vi : en);

  const baseFieldClass =
    "mt-2 w-full h-13 rounded-lg bg-slate-50 border border-gray-200 px-4 text-[15px] text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-200";

  const getFieldClass = (name) =>
    `${baseFieldClass} ${
      errors[name] && touched[name]
        ? "border-red-400 focus:border-red-400 ring-2 ring-red-200"
        : ""
    }`;

  // ✅ Validators (no change)
  const validateName = (v) => {
    const val = v.trim();
    if (!val) return t("Name is required.", "Tên là bắt buộc.");
    if (val.length < 2)
      return t(
        "Name must be at least 2 characters.",
        "Tên phải có ít nhất 2 ký tự."
      );
    if (!/^[a-zA-Z\s.'-]+$/.test(val))
      return t(
        "Only letters, spaces, (.'-) allowed.",
        "Chỉ cho phép chữ cái và dấu (.'-)."
      );
    return "";
  };
  const validateEmail = (v) => {
    const val = v.trim();
    if (!val) return t("Email is required.", "Email là bắt buộc.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val))
      return t("Enter a valid email address.", "Nhập địa chỉ email hợp lệ.");
    return "";
  };
  const validatePhone = (v) => {
    const val = v.trim();
    if (!val) return t("Phone is required.", "Số điện thoại là bắt buộc.");
    const digits = val.replace(/\D/g, "");
    const isIN10 = digits.length === 10 && /^[6-9]/.test(digits);
    const isIN91 = digits.length === 12 && digits.startsWith("91");
    const genericOK = digits.length >= 7 && digits.length <= 15;
    if (!(isIN10 || isIN91 || genericOK))
      return t("Enter a valid phone number.", "Nhập số điện thoại hợp lệ.");
    return "";
  };
  const validateProduct = (v) =>
    !v ? t("Select a product interest.", "Chọn sản phẩm bạn quan tâm.") : "";
  const validateMessage = (v) => {
    const val = v.trim();
    if (!val) return t("Message is required.", "Nội dung là bắt buộc.");
    if (val.length < 20)
      return t(
        "Message must be at least 20 characters.",
        "Nội dung phải có ít nhất 20 ký tự."
      );
    return "";
  };
  const validateFile = (file) => {
    if (!file) return "";
    const maxSize = 5 * 1024 * 1024;
    const okTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ];
    if (!okTypes.includes(file.type))
      return t(
        "Allowed: PDF, DOC, DOCX, PNG, JPG.",
        "Cho phép: PDF, DOC, DOCX, PNG, JPG."
      );
    if (file.size > maxSize)
      return t("File must be ≤ 5 MB.", "Tệp phải nhỏ hơn hoặc bằng 5 MB.");
    return "";
  };

  const validators = {
    name: validateName,
    email: validateEmail,
    phone: validatePhone,
    product: validateProduct,
    message: validateMessage,
    file: validateFile,
  };

  const validateAll = (vals) => {
    const e = {};
    e.name = validateName(vals.name);
    e.email = validateEmail(vals.email);
    e.phone = validatePhone(vals.phone);
    e.product = validateProduct(vals.product);
    e.message = validateMessage(vals.message);
    e.file = validateFile(vals.file);
    Object.keys(e).forEach((k) => !e[k] && delete e[k]);
    return e;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    if (validators[name]) {
      const msg =
        name === "file"
          ? validators[name](values.file)
          : validators[name](values[name]);
      setErrors((er) => ({ ...er, [name]: msg || undefined }));
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      const file = files && files[0] ? files[0] : null;
      setValues((v) => ({ ...v, file }));
      if (touched.file) {
        const msg = validateFile(file);
        setErrors((er) => ({ ...er, file: msg || undefined }));
      }
    } else {
      setValues((v) => ({ ...v, [name]: value }));
      if (touched[name] && validators[name]) {
        const msg = validators[name](value);
        setErrors((er) => ({ ...er, [name]: msg || undefined }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      company: true,
      email: true,
      phone: true,
      product: true,
      message: true,
      file: true,
    });

    const newErrors = validateAll(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setSubmitting(true);
    setSuccess("");

    try {
      const formData = new FormData();
      for (const [key, val] of Object.entries(values)) {
        if (val) formData.append(key, val);
      }
      await submitContactForm(formData);

      setSuccess(
        t("✅ Message sent successfully.", "✅ Gửi tin nhắn thành công.")
      );
      setValues({
        name: "",
        company: "",
        email: "",
        phone: "",
        product: "",
        message: "",
        file: null,
      });
      setTouched({});
      setErrors({});
    } catch (err) {
      console.error(err);
      setSuccess(
        t("❌ Something went wrong.", "❌ Đã xảy ra lỗi. Vui lòng thử lại.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={firstErrorRef}>
      <h3 className="text-xl font-semibold text-slate-900">{heading}</h3>

      {success && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            success.startsWith("✅")
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {success}
        </div>
      )}

      <form className="mt-6 space-y-8" noValidate onSubmit={handleSubmit}>
        {/* Name + Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm !text-slate-700">
              {t("Name", "Tên")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClass("name")}
              placeholder={t("Enter your name", "Nhập tên của bạn")}
            />
            {errors.name && touched.name && (
              <p className="mt-2 text-xs text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm !text-slate-700">
              {t("Company", "Công ty")}
            </label>
            <input
              type="text"
              name="company"
              value={values.company}
              onChange={handleChange}
              className={baseFieldClass}
              placeholder={t("Company (optional)", "Công ty (tùy chọn)")}
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm !text-slate-700">
              {t("Email", "Email")} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClass("email")}
              placeholder="example@email.com"
            />
            {errors.email && touched.email && (
              <p className="mt-2 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm !text-slate-700">
              {t("Phone", "Số điện thoại")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClass("phone")}
              placeholder={t(
                "Enter your phone number",
                "Nhập số điện thoại của bạn"
              )}
            />
            {errors.phone && touched.phone && (
              <p className="mt-2 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Product */}
        <div className="relative" ref={productRef}>
          <label className="block text-sm !text-slate-700">
            {t("Product Interest", "Sản phẩm quan tâm")}
            <span className="text-red-500">*</span>
          </label>

          {/* Trigger box */}
          <div
            className="h-12 mt-1 w-full bg-white border border-slate-300 rounded-xl px-4 flex items-center justify-between cursor-pointer"
            onClick={() => setOpenProduct(!openProduct)}
          >
            <span className="text-sm text-slate-700">
              {values.product
                ? {
                    cotton: t("Cotton", "Bông"),
                    Fiber: t("Fiber", "Xơ"),
                    machinery: t("Machinery", "Máy móc"),
                  }[values.product]
                : t("Select an option", "Chọn một tuỳ chọn")}
            </span>

            <span className="text-slate-500">
              <RiArrowDropDownLine className="text-4xl" />
            </span>
          </div>

          {/* Dropdown panel */}
          {openProduct && (
            <div className="absolute mt-2 w-full bg-white shadow-xl rounded-xl border border-slate-200 py-2 z-20">
              {[
                { value: "cotton", label: t("Cotton", "Bông") },
                { value: "Fiber", label: t("Fiber", "Xơ") },
                { value: "machinery", label: t("Machinery", "Máy móc") },
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={`
            px-4 py-2 text-sm cursor-pointer
            ${
              values.product === opt.value
                ? "bg-slate-100 text-black rounded-md"
                : "hover:bg-slate-100"
            }
          `}
                  onClick={() => {
                    handleChange({
                      target: { name: "product", value: opt.value },
                    });
                    setOpenProduct(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}

          {errors.product && touched.product && (
            <p className="mt-2 text-xs text-red-600">{errors.product}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm !text-slate-700 mb-1">
            {t("Message / Inquiry Details", "Tin nhắn / Nội dung yêu cầu")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${getFieldClass("message")} h-36 resize-none py-2`}
            placeholder={t(
              "Write your message...",
              "Nhập nội dung yêu cầu của bạn..."
            )}
          />
          {errors.message && touched.message && (
            <p className="mt-2 text-xs text-red-600">{errors.message}</p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm !text-slate-700">
            {t("Upload Specifications (Optional)", "Tải lên tệp (tùy chọn)")}
          </label>
          <input
            name="file"
            type="file"
            onChange={handleChange}
            onBlur={handleBlur}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="mt-3 block w-full text-sm !text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
          />
          {errors.file && touched.file && (
            <p className="mt-2 text-xs text-red-600">{errors.file}</p>
          )}
          {values.file && !errors.file && (
            <p className="mt-2 text-xs text-slate-500">
              {t("Selected:", "Đã chọn:")} {values.file.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[#0E3A5B] hover:bg-[#0B2F49] disabled:opacity-70 !text-white text-[15px] font-medium py-4"
        >
          {submitting
            ? t("Sending...", "Đang gửi...")
            : t("Send Message", "Gửi tin nhắn")}
        </button>
      </form>
    </div>
  );
}

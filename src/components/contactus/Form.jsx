import React, { useState, useEffect, useRef } from "react";
import { getContactPage, submitContactForm } from "../../Api/api"; // ✅ Using both APIs

export default function ContactSection() {
  const [contactFormData, setContactFormData] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL;

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

  // ✅ Detect if uploaded media is video
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
              heading={contactFormData?.contactForm?.en || "Send Us a Message"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** ---------- Contact Form Component (with API submit) ---------- */
function ContactForm({ heading }) {
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

  const baseFieldClass =
    "mt-2 w-full h-13 rounded-lg bg-slate-50 border border-gray-200 px-4 text-[15px] text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-200";

  const getFieldClass = (name) =>
    `${baseFieldClass} ${
      errors[name] && touched[name]
        ? "border-red-400 focus:border-red-400 ring-2 ring-red-200"
        : ""
    }`;

  // ------- validators -------
  const validateName = (v) => {
    const val = v.trim();
    if (!val) return "Name is required.";
    if (val.length < 2) return "Name must be at least 2 characters.";
    if (!/^[a-zA-Z\s.'-]+$/.test(val))
      return "Only letters, spaces, (.'-) allowed.";
    return "";
  };

  const validateEmail = (v) => {
    const val = v.trim();
    if (!val) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val))
      return "Enter a valid email address.";
    return "";
  };

  const validatePhone = (v) => {
    const val = v.trim();
    if (!val) return "Phone is required.";
    const digits = val.replace(/\D/g, "");
    const isIN10 = digits.length === 10 && /^[6-9]/.test(digits);
    const isIN91 = digits.length === 12 && digits.startsWith("91");
    const genericOK = digits.length >= 7 && digits.length <= 15;
    if (!(isIN10 || isIN91 || genericOK)) return "Enter a valid phone number.";
    return "";
  };

  const validateProduct = (v) => (!v ? "Select a product interest." : "");

  const validateMessage = (v) => {
    const val = v.trim();
    if (!val) return "Message is required.";
    if (val.length < 20) return "Message must be at least 20 characters.";
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
      return "Allowed: PDF, DOC, DOCX, PNG, JPG.";
    if (file.size > maxSize) return "File must be ≤ 5 MB.";
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

  // ------- handlers -------
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

  // ✅ API Submission
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

    if (Object.keys(newErrors).length) {
      const firstKey = [
        "name",
        "company",
        "email",
        "phone",
        "product",
        "message",
        "file",
      ].find((k) => newErrors[k]);
      if (firstKey) {
        firstErrorRef.current?.querySelector(`[name="${firstKey}"]`)?.focus();
      }
      return;
    }

    setSubmitting(true);
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("company", values.company);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("product", values.product);
      formData.append("message", values.message);
      if (values.file) formData.append("file", values.file);

      // ✅ Real API call
      const res = await submitContactForm(formData);

      setSuccess("✅ Your message has been sent successfully.");
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
      console.error(err.response?.data || err.message);
      setSuccess("❌ Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={firstErrorRef}>
      <style>{`
        label {
          color: #314158 !important;
        }
      `}</style>

      <h3 className="text-xl font-semibold text-slate-900">{heading}</h3>

      {success && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            success.startsWith("✅")
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="status"
          aria-live="polite"
        >
          {success}
        </div>
      )}

      <form className="mt-6 space-y-8" noValidate onSubmit={handleSubmit}>
        {/* Name + Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClass("name")}
              required
            />
            {errors.name && touched.name && (
              <p className="mt-2 text-xs text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-700">Company</label>
            <input
              type="text"
              name="company"
              value={values.company}
              onChange={handleChange}
              className={baseFieldClass}
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClass("email")}
              required
            />
            {errors.email && touched.email && (
              <p className="mt-2 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-700">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClass("phone")}
              required
            />
            {errors.phone && touched.phone && (
              <p className="mt-2 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Product Interest */}
        <div>
          <label className="block text-sm text-slate-700">
            Product Interest <span className="text-red-500">*</span>
          </label>
          <select
            name="product"
            value={values.product}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${getFieldClass("product")} h-12`}
            required
          >
            <option value="">Select an option</option>
            <option value="cotton">Cotton</option>
            <option value="viscose">Viscose</option>
            <option value="machinery">Machinery</option>
          </select>
          {errors.product && touched.product && (
            <p className="mt-2 text-xs text-red-600">{errors.product}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm text-slate-700">
            Message/Inquiry Details <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${getFieldClass("message")} h-36 resize-none`}
            required
          />
          {errors.message && touched.message && (
            <p className="mt-2 text-xs text-red-600">{errors.message}</p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm text-slate-700">
            Upload Specifications (Optional)
          </label>
          <input
            name="file"
            type="file"
            onChange={handleChange}
            onBlur={handleBlur}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="mt-3 block w-full text-sm text-slate-600
                       file:mr-4 file:py-2.5 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-medium
                       file:bg-slate-100 file:text-slate-700
                       hover:file:bg-slate-200"
          />
          {errors.file && touched.file && (
            <p className="mt-2 text-xs text-red-600">{errors.file}</p>
          )}
          {values.file && !errors.file && (
            <p className="mt-2 text-xs text-slate-500">
              Selected: {values.file.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          style={{
            color: "#fff",
          }}
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[#0E3A5B] hover:bg-[#0B2F49] disabled:opacity-70 disabled:cursor-not-allowed text-white text-[15px] font-medium py-4 cursor-pointer"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

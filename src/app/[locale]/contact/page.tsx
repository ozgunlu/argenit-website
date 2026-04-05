"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import KvkkModal from "@/components/KvkkModal";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [subjects, setSubjects] = useState<{ id: string; label: string }[]>([]);
  const [kvkkChecked, setKvkkChecked] = useState(false);
  const [kvkkOpen, setKvkkOpen] = useState(false);
  const closeKvkk = useCallback(() => setKvkkOpen(false), []);

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/contact-subjects?locale=${locale}`)
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch(() => {});
  }, [locale]);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const errors = {
    name: !name.trim(),
    organization: !organization.trim(),
    email: !email.trim() || !isValidEmail(email),
    emailFormat: email.trim() && !isValidEmail(email),
    subject: !subject,
    kvkk: !kvkkChecked,
  };

  const hasErrors = errors.name || errors.organization || errors.email || errors.subject || errors.kvkk;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted(true);
    if (hasErrors) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          organization,
          email,
          phone,
          subject,
          message,
          kvkkConsent: kvkkChecked,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert(t("error"));
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "w-full px-4 py-3.5 bg-white border rounded-xl text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all duration-200";
  const inputOk = `${inputBase} border-slate-200 focus:border-primary focus:ring-primary/10`;
  const inputErr = `${inputBase} border-red-300 focus:border-red-400 focus:ring-red-100`;
  const selectBase =
    "appearance-none bg-[length:16px] bg-[right_16px_center] bg-no-repeat bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] pr-10";

  const ErrorMsg = ({ show, msg }: { show: boolean; msg: string }) =>
    show ? <p className="text-xs text-red-500 mt-1.5">{msg}</p> : null;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-24 pb-6 lg:pt-28 lg:pb-8 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[size:32px_32px]" />
        <div className="relative mx-auto px-5 sm:px-8 lg:px-[6.5%]">
          <p className="font-[family-name:var(--font-heading)] text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold mb-4">
            {t("title")}
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
            {t("subtitle")}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed">
            {t("heroDesc")}
          </p>
          <div className="w-12 h-[2px] bg-slate-400 mt-5" />
        </div>
      </section>

      {/* ── Content ── */}
      <section className="pt-4 pb-10 lg:pt-6 lg:pb-14 bg-white">
        <div className="mx-auto px-5 sm:px-8 lg:px-[6.5%]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Info */}
            <div className="lg:w-[320px] shrink-0 space-y-4">
              {/* Adres */}
              <div className="card-flat rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                      {t("address")}
                    </p>
                    <p className="text-sm text-slate-700 font-medium">
                      {t("addressValue")}<br />
                      {t("addressValue2")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Telefon & Faks */}
              <div className="card-flat rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                      {t("phoneLabel")} / {t("faxLabel")}
                    </p>
                    <a href={`tel:${t("phoneValue").replace(/\s/g, "")}`} className="text-sm text-slate-700 font-medium hover:text-primary transition-colors">
                      {t("phoneValue")}
                    </a>
                  </div>
                </div>
              </div>

              {/* E-posta */}
              <div className="card-flat rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                      {t("emailLabel")}
                    </p>
                    <a href={`mailto:${t("emailValue")}`} className="text-sm text-slate-700 font-medium hover:text-primary transition-colors block">
                      {t("emailValue")}
                    </a>
                    <a href={`mailto:${t("kepValue")}`} className="text-sm text-slate-700 font-medium hover:text-primary transition-colors block mt-1">
                      {t("kepValue")}
                    </a>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.123!2d29.0133161!3d41.105712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab5c496156a7d%3A0xbed6ae9a630f1186!2sARGENIT%20TECHNOLOGY%20AS!5e0!3m2!1str!2str!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Argenit Technology AS"
                />
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 min-w-0">
              {submitted ? (
                <div className="card rounded-2xl p-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <p className="text-lg text-slate-900 font-semibold mb-2">
                    {t("success")}
                  </p>
                </div>
              ) : (
                <div className="card rounded-2xl p-8 lg:p-10">
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Ad Soyad & Kurum */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">
                          {t("name")} *
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={attempted && errors.name ? inputErr : inputOk}
                        />
                        <ErrorMsg show={attempted && errors.name} msg={t("required")} />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">
                          {t("organization")} *
                        </label>
                        <input
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          className={attempted && errors.organization ? inputErr : inputOk}
                        />
                        <ErrorMsg show={attempted && errors.organization} msg={t("required")} />
                      </div>
                    </div>

                    {/* E-posta & Telefon */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">
                          {t("email")} *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={attempted && errors.email ? inputErr : inputOk}
                        />
                        <ErrorMsg
                          show={attempted && errors.email}
                          msg={errors.emailFormat ? t("emailInvalid") : t("required")}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">
                          {t("phone")}
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={inputOk}
                        />
                      </div>
                    </div>

                    {/* Konu (dropdown) */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">
                        {t("subject")} *
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className={`${selectBase} ${attempted && errors.subject ? inputErr : inputOk}`}
                      >
                        <option value="">{t("subjectPlaceholder")}</option>
                        {subjects.map((s) => (
                          <option key={s.id} value={s.label}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <ErrorMsg show={attempted && errors.subject} msg={t("required")} />
                    </div>

                    {/* Mesaj */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">
                        {t("message")}
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className={`${inputOk} resize-none`}
                      />
                    </div>

                    {/* KVKK Checkbox */}
                    <div>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="kvkk"
                          checked={kvkkChecked}
                          onChange={(e) => setKvkkChecked(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 shrink-0"
                        />
                        <label htmlFor="kvkk" className="text-sm text-slate-600 leading-relaxed">
                          {t.rich("kvkkText", {
                            link: (chunks) => (
                              <button
                                type="button"
                                onClick={() => setKvkkOpen(true)}
                                className="text-primary font-medium underline underline-offset-2 hover:text-primary-light transition-colors"
                              >
                                {chunks}
                              </button>
                            ),
                          })}
                        </label>
                      </div>
                      <ErrorMsg show={attempted && errors.kvkk} msg={t("kvkkRequired")} />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                    >
                      <Send size={16} />
                      {t("send")}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <KvkkModal open={kvkkOpen} onClose={closeKvkk} locale={locale} />
    </>
  );
}

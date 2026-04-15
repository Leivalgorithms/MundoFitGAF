import { useState, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import { Send, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { crearSolicitud } from "../lib/solicitudes";


const EMAILJS_SERVICE_ID  = "service_kcbzs7z";
const EMAILJS_TEMPLATE_ID = "template_weni1dp";
const EMAILJS_PUBLIC_KEY  = "ktcO8g1Wwhz91LjM2";


const RECAPTCHA_SITE_KEY = "6LfIQo8sAAAAAOF4dP_EMm2tkq-PaSr9_FKCLOCZ";



interface FormFields {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  captcha?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";


function validate(fields: FormFields, captchaToken: string | null): FormErrors {
  const errors: FormErrors = {};

  if (!fields.name.trim())
    errors.name = "El nombre es obligatorio.";
  else if (fields.name.trim().length < 2)
    errors.name = "El nombre debe tener al menos 2 caracteres.";

  if (!fields.email.trim())
    errors.email = "El correo es obligatorio.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = "Ingresá un correo válido.";

  if (fields.phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(fields.phone))
    errors.phone = "Número de teléfono inválido.";

  if (!fields.subject.trim())
    errors.subject = "El asunto es obligatorio.";

  if (!fields.message.trim())
    errors.message = "El mensaje es obligatorio.";
  else if (fields.message.trim().length < 10)
    errors.message = "El mensaje debe tener al menos 10 caracteres.";

  if (!captchaToken)
    errors.captcha = "Por favor completá el captcha.";

  return errors;
}


interface ContactFormProps {
  
  compact?: boolean;
}

export default function ContactForm({ compact = false }: ContactFormProps) {
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors]           = useState<FormErrors>({});
  const [touched, setTouched]         = useState<Set<keyof FormFields>>(new Set());
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus]           = useState<SubmitStatus>("idle");
  const recaptchaRef                  = useRef<ReCAPTCHA>(null);

  
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const key = name as keyof FormFields;
      const next = { ...fields, [key]: value };
      setFields(next);

      if (touched.has(key)) {
        const newErrors = validate(next, captchaToken);
        setErrors((prev) => ({ ...prev, [key]: newErrors[key] }));
      }
    },
    [fields, touched, captchaToken]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const key = e.target.name as keyof FormFields;
      setTouched((prev) => new Set(prev).add(key));
      const newErrors = validate(fields, captchaToken);
      setErrors((prev) => ({ ...prev, [key]: newErrors[key] }));
    },
    [fields, captchaToken]
  );

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token);
    if (token) setErrors((prev) => ({ ...prev, captcha: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched(new Set(Object.keys(fields) as (keyof FormFields)[]));
    const allErrors = validate(fields, captchaToken);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    setStatus("loading");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    fields.name,
          from_email:   fields.email,
          phone:        fields.phone || "No proporcionado",
          subject:      fields.subject,
          message:      fields.message,
          "g-recaptcha-response": captchaToken,
        },
        EMAILJS_PUBLIC_KEY
      );
      await crearSolicitud({
        nombre:   fields.name,
        correo:   fields.email,
        telefono: fields.phone || undefined,
        asunto:   fields.subject,
        mensaje:  fields.message,
        tipo:     "contacto",
      });
      setStatus("success");
      setFields({ name: "", email: "", phone: "", subject: "", message: "" });
      setTouched(new Set());
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch {
      setStatus("error");
    }
  };


  const inputBase =
    "w-full bg-neutral-800 border rounded px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-colors duration-200";
  const inputOk    = `${inputBase} border-neutral-700 focus:border-red-500 focus:ring-red-500/20`;
  const inputError = `${inputBase} border-red-500 focus:border-red-500 focus:ring-red-500/30`;

  const fieldClass = (key: keyof FormFields) =>
    errors[key] ? inputError : inputOk;

  
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
        <CheckCircle className="text-green-500" size={52} strokeWidth={1.5} />
        <h3 className="text-white text-xl font-bold">¡Mensaje enviado!</h3>
        <p className="text-neutral-400 text-sm max-w-xs">
          Gracias por contactarnos. Nos comunicaremos con vos a la brevedad.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-red-500 text-sm font-semibold hover:text-red-400 transition-colors"
        >
          Enviar otro mensaje →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Error global banner */}
      {status === "error" && (
        <div className="flex items-start gap-3 bg-red-900/30 border border-red-700 rounded-lg px-4 py-3">
          <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <p className="text-red-300 text-sm">
            Ocurrió un error al enviar el mensaje. Por favor intentá de nuevo o
            escribinos directo a{" "}
            <a href="mailto:info@mundofit.cr" className="underline">
              info@mundofit.cr
            </a>
            .
          </p>
        </div>
      )}

      {/* Row: Nombre + Email */}
      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "md:grid-cols-2"}`}>
        <div className="flex flex-col gap-1.5">
          <label className="text-white text-xs font-semibold tracking-wide uppercase">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={fields.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tu nombre completo"
            className={fieldClass("name")}
          />
          {errors.name && (
            <p className="text-red-400 text-xs">{errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-white text-xs font-semibold tracking-wide uppercase">
            Correo <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="tu@correo.com"
            className={fieldClass("email")}
          />
          {errors.email && (
            <p className="text-red-400 text-xs">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Row: Teléfono + Asunto */}
      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "md:grid-cols-2"}`}>
        <div className="flex flex-col gap-1.5">
          <label className="text-white text-xs font-semibold tracking-wide uppercase">
            Teléfono{" "}
            <span className="text-neutral-500 font-normal normal-case">(opcional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={fields.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="+506 0000-0000"
            className={fieldClass("phone")}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs">{errors.phone}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-white text-xs font-semibold tracking-wide uppercase">
            Asunto <span className="text-red-500">*</span>
          </label>
          <select
            name="subject"
            value={fields.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${fieldClass("subject")} appearance-none`}
          >
            <option value="" disabled>
              Seleccioná un asunto
            </option>
            <option value="Consulta sobre productos">Consulta sobre productos</option>
            <option value="Servicio técnico / Garantía">Servicio técnico / Garantía</option>
            <option value="Envío e instalación">Envío e instalación</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.subject && (
            <p className="text-red-400 text-xs">{errors.subject}</p>
          )}
        </div>
      </div>

      {/* Mensaje */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white text-xs font-semibold tracking-wide uppercase">
          Mensaje <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={fields.message}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={compact ? 4 : 5}
          placeholder="Contanos en qué podemos ayudarte..."
          className={`${fieldClass("message")} resize-none`}
        />
        {errors.message && (
          <p className="text-red-400 text-xs">{errors.message}</p>
        )}
      </div>

      {/* reCAPTCHA */}
      <div className="flex flex-col gap-1.5">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          theme="dark"
          onChange={handleCaptcha}
          onExpired={() => setCaptchaToken(null)}
        />
        {errors.captcha && (
          <p className="text-red-400 text-xs">{errors.captcha}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-3 rounded transition-colors duration-200"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            <Send size={16} />
            Enviar Mensaje
          </>
        )}
      </button>
    </form>
  );
}

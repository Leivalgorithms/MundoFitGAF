const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;
const ENDPOINT   = "https://api.web3forms.com/submit";

export interface SolicitudPayload {
  nombre: string;
  correo: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  tipo: "contacto" | "cotizacion";
  producto?: string;
}

export async function crearSolicitud(data: SolicitudPayload): Promise<void> {
  const subject =
    data.tipo === "cotizacion"
      ? `Cotización: ${data.producto ?? data.asunto}`
      : `Contacto: ${data.asunto}`;

  const body: Record<string, string> = {
    access_key: ACCESS_KEY,
    subject,
    from_name:  data.nombre,
    email:      data.correo,
    asunto:     data.asunto,
    mensaje:    data.mensaje,
    tipo:       data.tipo,
  };

  if (data.telefono) body.telefono = data.telefono;
  if (data.producto) body.producto = data.producto;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(`Web3Forms error: ${json.message ?? "desconocido"}`);
  }
}

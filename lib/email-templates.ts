import { formatDate, formatTime, formatCurrency } from "@/lib/utils";

interface BookingEmailData {
  clientName: string;
  serviceName: string;
  barberName: string;
  date: string;
  startTime: string;
  price: number;
  currency: string;
  cancellationToken: string;
  appUrl: string;
}

export function buildConfirmationEmail(data: BookingEmailData): string {
  const {
    clientName,
    serviceName,
    barberName,
    date,
    startTime,
    price,
    currency,
    cancellationToken,
    appUrl,
  } = data;

  const cancelUrl = `${appUrl}/cancelar/${cancellationToken}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de cita — BarberBook</title>
</head>
<body style="margin:0;padding:0;background:#FAFAFA;font-family:Inter,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #E4E4E7;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#F59E0B;padding:24px 32px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#0A0A0A;letter-spacing:-0.3px;">
                ✂ BarberBook
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0A0A0A;">
                ¡Tu cita está confirmada!
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.5;">
                Hola ${clientName}, te esperamos. Aquí están los detalles de tu cita:
              </p>

              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E4E4E7;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                ${row("Servicio", serviceName)}
                ${row("Barbero", barberName)}
                ${row("Fecha", formatDate(date))}
                ${row("Hora", formatTime(startTime))}
                ${rowLast("Total", formatCurrency(price, currency), true)}
              </table>

              <!-- Cancel link -->
              <p style="margin:0 0 8px;font-size:13px;color:#9CA3AF;text-align:center;">
                ¿No podrás asistir?
                <a href="${cancelUrl}" style="color:#F59E0B;text-decoration:none;font-weight:500;">
                  Cancela tu cita aquí
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #F4F4F5;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#D4D4D8;">
                © ${new Date().getFullYear()} BarberBook · Este email fue enviado a solicitud tuya.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:12px 16px;font-size:13px;color:#6B7280;border-bottom:1px solid #F4F4F5;width:120px;">
        ${label}
      </td>
      <td style="padding:12px 16px;font-size:13px;color:#0A0A0A;border-bottom:1px solid #F4F4F5;font-weight:500;">
        ${value}
      </td>
    </tr>
  `;
}

function rowLast(label: string, value: string, bold = false): string {
  return `
    <tr>
      <td style="padding:12px 16px;font-size:13px;color:#6B7280;width:120px;">
        ${label}
      </td>
      <td style="padding:12px 16px;font-size:${bold ? "15px" : "13px"};color:#0A0A0A;${bold ? "font-weight:700;" : "font-weight:500;"}">
        ${value}
      </td>
    </tr>
  `;
}

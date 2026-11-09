// Waitlist confirmation email (HTML + plain text). Inline styles only, for email clients.
const FOOTER = "© 2026 neb. All rights reserved.";
const ADDRESS = "Toronto, Canada · New York, USA";

export function confirmationEmail(site: string, sendToMe: boolean) {
  const icon = `${site}/brand/neb-icon-192.png`;
  const body = [
    "You're on the list.",
    "Something new is coming to your notebook. We'll tell you first.",
    ...(sendToMe ? [`Open neb on your computer: ${site}`] : []),
  ];

  const text = [...body, "— neb", "", FOOTER, ADDRESS].join("\n\n");

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#F4F0E6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F0E6;padding:32px 16px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFDF7;border:1px solid #DCD6C8;border-radius:12px;">
    <tr><td align="center" style="padding:32px 32px 8px;">
      <img src="${icon}" width="64" height="64" alt="neb" style="display:block;border-radius:14px;border:0;">
    </td></tr>
    <tr><td style="padding:16px 32px 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;color:#1E1D1A;text-align:center;">
      You're on the list.
    </td></tr>
    <tr><td style="padding:8px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#3C3A35;text-align:center;">
      Something new is coming to your notebook.<br>We'll tell you first.
    </td></tr>
    ${sendToMe ? `<tr><td align="center" style="padding:16px 32px 8px;">
      <a href="${site}" style="display:inline-block;background:#6B4EE6;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;padding:12px 22px;border-radius:8px;">Open neb on your computer</a>
    </td></tr>` : ""}
    <tr><td style="padding:16px 32px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1E1D1A;text-align:center;">— neb</td></tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
    <tr><td style="padding:20px 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#6E6A60;text-align:center;">
      ${FOOTER}<br>${ADDRESS}<br><a href="${site}" style="color:#6E6A60;">myneb.si</a> · <a href="${site}/privacy" style="color:#6E6A60;">privacy</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

  return { subject: "You're on the list.", text, html };
}

/**
 * "Email me the link" from /download (docs/LAUNCH.md): the download page's address, for opening
 * on the computer neb will run on. `mac`: neb is Windows-only for now, so it says that instead.
 */
export function downloadLinkEmail(site: string, mac: boolean) {
  const icon = `${site}/brand/neb-icon-192.png`;
  const link = `${site}/download`;
  const title = mac ? "neb for Mac is coming." : "Here's your neb download.";
  const line = mac
    ? "neb is Windows-only for now. We'll email you when the Mac version is ready."
    : "Open this on your Windows computer to install neb.";
  const text = [title, line, ...(mac ? [] : [link]), "— neb", "", FOOTER, ADDRESS].join("\n\n");
  const button = mac
    ? ""
    : `<tr><td align="center" style="padding:16px 32px 8px;">
      <a href="${link}" style="display:inline-block;background:#6B4EE6;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:999px;">Download neb</a>
    </td></tr>`;
  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#F4F0E6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F0E6;padding:32px 16px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFDF7;border:1px solid #DCD6C8;border-radius:12px;">
    <tr><td align="center" style="padding:32px 32px 8px;">
      <img src="${icon}" width="64" height="64" alt="neb" style="display:block;border-radius:14px;border:0;">
    </td></tr>
    <tr><td style="padding:16px 32px 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;color:#1E1D1A;text-align:center;">${title}</td></tr>
    <tr><td style="padding:8px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#3C3A35;text-align:center;">${line}</td></tr>
    ${button}
    <tr><td style="padding:16px 32px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1E1D1A;text-align:center;">— neb</td></tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
    <tr><td style="padding:20px 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#6E6A60;text-align:center;">
      ${FOOTER}<br>${ADDRESS}<br><a href="${site}" style="color:#6E6A60;">myneb.si</a> · <a href="${site}/privacy" style="color:#6E6A60;">privacy</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
  return { subject: title, html, text };
}

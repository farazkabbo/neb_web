import type { Metadata } from "next";

export const metadata: Metadata = { title: "privacy · neb", description: "How neb handles your information on myneb.si." };

const UPDATED = "October 28, 2026";
const CONTACT = "mynebsi@gmail.com";

export default function Privacy() {
  return (
    <main className="legal">
      <a href="/" className="legal-back">← myneb.si</a>
      <h1>Privacy Policy</h1>
      <p className="legal-meta">Website &amp; waitlist · Last updated {UPDATED}</p>

      <p>
        This policy explains what information neb (&ldquo;neb&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects when you visit <b>myneb.si</b> or join the
        waitlist, why we collect it, and the choices you have. The neb app will have its own privacy policy, published before launch. Short version:
        <b> we collect your email so we can tell you when neb launches. We don&apos;t sell it, we don&apos;t use it for ads, and you can ask us to delete it at any time.</b>
      </p>

      <h2>1. Who we are</h2>
      <p>
        neb is operated from Toronto, Canada and New York, USA. For anything related to privacy, contact us at{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. We are the controller of the personal information described here.
      </p>

      <h2>2. What we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li><b>Email address</b>: when you join the waitlist (from the main form, the setup form, or &ldquo;send this to your laptop&rdquo;).</li>
        <li><b>Role</b> (optional): e.g. student, teacher or parent, if a form asks and you choose to answer.</li>
        <li><b>Your messages</b>: if you email or reply to us, we receive what you send.</li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li><b>Signup details</b>: which form you used, any campaign tag in the link you followed (such as <code>utm_source</code>), and the date and time you joined.</li>
        <li><b>IP address, briefly</b>: we hold it in server memory for up to 10 minutes to stop spam and repeated signups. We do not store it in our database.</li>
        <li><b>Hosting logs</b>: our hosting provider automatically records standard request data (such as IP address, browser type, page requested and time) to run and secure the service.</li>
        <li><b>Device storage</b>: the site saves one small flag in your browser&apos;s session storage so the intro animation plays only once per visit. It never leaves your device and is cleared when you close the tab.</li>
      </ul>
      <p>
        We do <b>not</b> use cookies, advertising trackers, analytics tools, fingerprinting or social-media pixels on myneb.si.
      </p>

      <h2>3. How we use it</h2>
      <ul>
        <li>To add you to the waitlist and send a confirmation email.</li>
        <li>To email you on launch day with your invite and the launch film, plus occasional important updates about neb&apos;s launch.</li>
        <li>If you used &ldquo;send this to your laptop&rdquo;, to email you a link to open the site on another device.</li>
        <li>To understand, in total numbers, which links and forms bring people to the waitlist.</li>
        <li>To keep the site secure and prevent abuse.</li>
        <li>To reply to you when you contact us.</li>
      </ul>
      <p>
        We do not sell or rent your information, do not share it for cross-context behavioural advertising, and do not use it to train AI models.
      </p>

      <h2>4. Legal bases (EU, EEA &amp; UK visitors)</h2>
      <ul>
        <li><b>Consent</b>: joining the waitlist and receiving launch emails. You can withdraw consent at any time.</li>
        <li><b>Legitimate interests</b>: keeping the site secure, preventing spam, and understanding which links work, balanced against your rights.</li>
        <li><b>Legal obligation</b>: where we must keep or disclose information by law.</li>
      </ul>

      <h2>5. Who we share it with</h2>
      <p>We use a small number of service providers that process information only on our instructions:</p>
      <ul>
        <li><b>Supabase</b>: stores the waitlist database (hosted in the EU, Frankfurt).</li>
        <li><b>Resend</b>: sends our emails and keeps the mailing list (EU sending region, Ireland).</li>
        <li><b>Vercel</b>: hosts the website and runs the signup form (global network; signups processed in Frankfurt).</li>
        <li><b>Google Fonts</b>: delivers the site&apos;s typefaces; your browser connects to Google&apos;s servers to download them, which shares your IP address with Google.</li>
      </ul>
      <p>
        We may also disclose information if required by law, to protect the rights and safety of neb or others, or as part of a merger or acquisition (in which case
        this policy will continue to apply to your information).
      </p>

      <h2>6. International transfers</h2>
      <p>
        Some providers are based in the United States or other countries. Where information leaves the EU, EEA, UK or Canada, we rely on appropriate safeguards
        such as the European Commission&apos;s Standard Contractual Clauses or an adequacy framework, together with our providers&apos; security commitments.
      </p>

      <h2>7. How long we keep it</h2>
      <ul>
        <li><b>Waitlist entries</b>: until neb launches and for up to 12 months afterwards, or until you unsubscribe or ask us to delete them, whichever comes first.</li>
        <li><b>Emails you send us</b>: as long as needed to help you, then deleted.</li>
        <li><b>Rate-limit IP data</b>: up to 10 minutes, in memory only.</li>
        <li><b>Hosting logs</b>: kept for a short period under our hosting provider&apos;s standard retention.</li>
      </ul>

      <h2>8. Your rights and choices</h2>
      <p>Depending on where you live, you can:</p>
      <ul>
        <li>access the personal information we hold about you, or get a copy of it;</li>
        <li>correct it;</li>
        <li>delete it;</li>
        <li>withdraw your consent, or object to or restrict how we use it;</li>
        <li>receive it in a portable format.</li>
      </ul>
      <p>
        To use any of these rights, email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> from the address you signed up with. We&apos;ll respond within 30 days.
        Launch emails include an unsubscribe link. We won&apos;t treat you differently for exercising your rights.
      </p>
      <ul>
        <li><b>EU / EEA / UK</b>: you can complain to your local data-protection authority (in Slovenia, the Information Commissioner, <i>Informacijski pooblaščenec</i>).</li>
        <li><b>Canada</b>: we follow PIPEDA. You can contact the Office of the Privacy Commissioner of Canada.</li>
        <li><b>United States</b>: residents of California, New York and other states with privacy laws have the rights above. We do not sell or share personal information, and we honour Global Privacy Control signals.</li>
      </ul>

      <h2>9. Children and students</h2>
      <p>
        neb is built for learners, including high-school students. The waitlist is not intended for children under 13, and we don&apos;t knowingly collect their
        information. If you are under 16 (or under the age of digital consent where you live), please ask a parent or guardian to join the waitlist for you.
        If you believe a child has given us their information, email us and we will delete it.
      </p>

      <h2>10. Security</h2>
      <p>
        The site is served only over HTTPS. The waitlist database can be read and written only by our server, never directly from the browser. Access to our
        provider accounts is limited and protected. No method of transmission or storage is 100% secure, but we work to protect your information and will notify
        you and the authorities of a breach where the law requires it.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        If we change this policy, we&apos;ll update the date at the top. If a change is significant, we&apos;ll tell you by email before it takes effect.
      </p>

      <h2>12. Contact</h2>
      <p>
        neb · Toronto, Canada · New York, USA
        <br />
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>

      <p className="legal-meta">© 2026 neb. All rights reserved.</p>
    </main>
  );
}

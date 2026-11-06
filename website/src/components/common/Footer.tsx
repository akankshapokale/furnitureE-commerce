import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const shopLinks = [
  { label: "Office Furniture", to: "/category/office-furniture" },
  { label: "Home Furniture (Coming Soon)", to: "/category/home-furniture" },
  { label: "Seating Solutions", to: "/category/seating-solutions" },
  { label: "Cupboards & Almirahs", to: "/category/cupboards-almirahs" },
  { label: "Outdoor Furniture", to: "/category/outdoor-furniture" },
  { label: "Bunk Beds", to: "/category/bunk-beds" },
  { label: "Metal Racks", to: "/category/metal-racks" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "My Wishlist", to: "/wishlist" },
  { label: "My Cart", to: "/cart" },
];

const Footer = () => {
  const { content: footerContent } = useWebsiteContent("footer_content");
  const { content: contactContent } = useWebsiteContent("contact_content");
  const readLinks = (value: unknown, fallback: { label: string; to: string }[]) =>
    Array.isArray(value) ? value.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const row = item as Record<string, unknown>;
      return typeof row.label === "string" && typeof row.to === "string" ? [{ label: row.label, to: row.to }] : [];
    }) : fallback;
  const managedShopLinks = readLinks(footerContent?.categories, shopLinks);
  const managedCompanyLinks = readLinks(footerContent?.quick_links, companyLinks);
  const description = typeof footerContent?.description === "string" ? footerContent.description : "Thoughtfully designed furniture for the way you live, made to bring comfort, character and timeless style to your home and office.";
  const instagramUrl = typeof footerContent?.instagram_url === "string" ? footerContent.instagram_url : "https://www.instagram.com/staging_spaces__?rpxt=MnI0YXRndzJ5dmtn";
  const email = typeof contactContent?.email === "string" ? contactContent.email : "contactstagingspaces@gmail.com";
  const phone = typeof contactContent?.phone === "string" ? contactContent.phone : "+91 8669944932";
  const address = typeof contactContent?.address === "string" ? contactContent.address : "987, A,D Camp Chowk, Bhawani Peth, Pune, Maharashtra 411042";
  return (
  <footer className="site-footer">
    <div className="site-footer-main">
      <div className="site-footer-brand">
        <Link
  to="/"
  className="site-footer-logo ws-logo"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "13px",
    textDecoration: "none",
    flexShrink: 0,
  }}
>
  <img
    src="/logo-mark-dark.png"
    alt="Staging Spaces"
    className="site-footer-logo-img"
    style={{
      width: "49px",
      height: "49px",
      objectFit: "contain",
      flexShrink: 0,
    }}
  />

  <span
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "5px",
      lineHeight: 1,
    }}
  >
    <span
      style={{
        color: "#ffffff",
        fontSize: "17px",
        fontWeight: 750,
        letterSpacing: "1.7px",
        whiteSpace: "nowrap",
      }}
    >
      STAGING SPACES
    </span>

    <span
      style={{
        width: "100%",
        height: "1.5px",
        background: "linear-gradient(90deg, #c18b45, #e8d3ae, transparent)",
      }}
    />

    <span
      style={{
        color: "#fbbf24",
        fontSize: "8px",
        fontWeight: 700,
        letterSpacing: "1.35px",
        whiteSpace: "nowrap",
      }}
    >
      BY NARESH STEEL CORPORATION
    </span>
  </span>
</Link>
        <p>{description}</p>

        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              transition: "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e1306c";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <InstagramIcon size={18} />
          </a>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              transition: "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2563eb";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <Mail size={18} />
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            aria-label="Call"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              transition: "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#16a34a";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <Phone size={18} />
          </a>
        </div>
      </div>

      <nav aria-label="Shop">
        <h3>Categories</h3>
        <ul>
          {managedShopLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Company">
        <h3>Quick Links</h3>
        <ul>
          {managedCompanyLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <h3>Get in touch</h3>
        <ul className="site-footer-contact">
          <li>
            <Mail size={16} />
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {email}
            </a>
          </li>

          <li>
            <Phone size={16} />
            <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
          </li>


          <li>
            <MapPin size={16} />
            <span>{address}</span>
          </li>
        </ul>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} Staging Spaces. All rights reserved.</span>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;

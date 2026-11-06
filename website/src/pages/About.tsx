import { Link } from "react-router-dom";
import { Hammer, Leaf, HeartHandshake, Truck } from "lucide-react";

import LazyImage from "../components/common/LazyImage";
import { useWebsiteContent } from "../hooks/useWebsiteContent";
import { resolveCmsImage } from "../services/media";
import "./info.css";

const VALUES = [
  {
    icon: Hammer,
    title: "Built to last",
    text: "Solid materials and careful finishing, so your furniture looks good for years.",
  },
  {
    icon: Leaf,
    title: "Thoughtful design",
    text: "Clean, timeless pieces that fit real homes and don't chase trends.",
  },
  {
    icon: Truck,
    title: "Delivered with care",
    text: "Safe delivery and assembly, so it arrives ready to enjoy.",
  },
  {
    icon: HeartHandshake,
    title: "Here to help",
    text: "Real people behind every order, before and after it reaches you.",
  },
];

const STATS = [
  { value: "7", label: "Main Categories" },
  { value: "100%", label: "CRCA Prime Steel" },
  { value: "Pan-India", label: "Delivery" },
  { value: "10-Year", label: "Durability" },
];

const About = () => {
  const { content, loading } = useWebsiteContent("about_content");
  const values = Array.isArray(content?.values)
    ? content.values.flatMap((item, index) => {
        if (!item || typeof item !== "object") return [];
        const row = item as Record<string, unknown>;
        if (typeof row.title !== "string" || typeof row.text !== "string") return [];
        return [{ icon: VALUES[index % VALUES.length].icon, title: row.title, text: row.text }];
      })
    : VALUES;
  const stats = Array.isArray(content?.stats)
    ? content.stats.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const row = item as Record<string, unknown>;
        if (typeof row.value !== "string" || typeof row.label !== "string") return [];
        return [{ value: row.value, label: row.label }];
      })
    : STATS;
  const paragraphs = Array.isArray(content?.story_paragraphs)
    ? content.story_paragraphs.filter((item): item is string => typeof item === "string")
    : [];
  const value = (key: string, fallback: string) => typeof content?.[key] === "string" ? content[key] as string : fallback;
  const storyTitle = value("story_title", "Thoughtful furniture for spaces that work and feel better.").replace(/[.]+$/, "");
  const ctaHeading = value("cta_heading", "Ready to make your space beautiful?").replace(/[.]+$/, "");
  return (
  <>
    <main className="info-page about-page" aria-busy={loading}>
      <section className="info-section">
        <p className="about-breadcrumb"><Link to="/">Home</Link><span>/</span>About Us</p>
        <div className="info-wrap about-story">
          <div className="about-story-content">
            <p className="info-eyebrow">Our story</p>
            <h2>{storyTitle}</h2>
            {(paragraphs.length ? paragraphs : [
              "Staging Spaces brings together furniture designed to make homes and workplaces feel more comfortable, useful and considered.",
              "From executive chairs that make a confident statement to ergonomic seating made to support you through the workday, each piece balances comfort, function and lasting style.",
            ]).map((paragraph, index) => <p key={index}>{paragraph}</p>)}

            <div className="about-origin" aria-label="Our heritage">
              <strong className="about-origin-year">1985</strong>
              <div>
                <span>Our foundation</span>
                <p>Our parent company, Naresh Steel Corporation, was established in 1985. Its legacy of steel craftsmanship continues in the furniture we create for today’s spaces.</p>
              </div>
            </div>

            <div className="about-stats">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-story-image">
            <LazyImage
              src={resolveCmsImage(value("image", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80")) || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"}
              alt="A calm, modern living room"
              width={900}
            />
          </div>
        </div>
      </section>

      <section className="info-section what-we-build">
        <div className="info-wrap">
          <p className="info-eyebrow">What we build</p>
          <h2>Built for everyday living and work</h2>
          <p className="build-intro">
            We bring together practical design, lasting materials and everyday comfort to make spaces feel considered and work beautifully.
          </p>
          <div className="build-grid">
            <article className="build-card">
              <h3>Made for real spaces</h3>
              <p>From homes to busy workplaces, each piece is chosen to fit naturally into the way people use a room.</p>
            </article>
            <article className="build-card">
              <h3>Quality that lasts</h3>
              <p>Durable materials and careful finishing help our furniture stand up to everyday use.</p>
            </article>
            <article className="build-card">
              <h3>Comfort with purpose</h3>
              <p>Useful details, comfortable forms and thoughtful storage make daily routines easier.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="info-section alt">
        <div className="info-wrap">
          <p className="info-eyebrow">What we stand for</p>
          <h2>Our promise to you</h2>

          <div className="values-grid">
            {values.map(({ icon: Icon, title, text }) => (
              <div className="value-card" key={title}>
                <div className="value-icon">
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="info-cta">
        <div className="info-wrap">
          <h2>{ctaHeading}</h2>
          <p>{value("cta_description", "Browse the full collection and find the piece your room has been missing.")}</p>
          <Link to="/category/office-furniture" className="info-btn light">
            Shop the collection →
          </Link>
        </div>
      </section>
    </main>

    <style>{`
      .info-page {
        width: 100%;
        overflow: hidden;
      }

      .about-page {
        background: var(--site-warm-bg);
        color: #222222;
      }

      .about-page .info-hero,
      .about-page .info-section,
      .about-page .info-section.alt,
      .about-page .info-cta {
        background: var(--site-warm-bg);
      }

      .about-page .value-card,
      .about-page .build-card {
        background: #ffffff;
      }

      .about-page .info-cta {
        color: #222222;
      }

      .about-page h1,
      .about-page h2 {
        font-size: clamp(32px, 4vw, 46px);
        font-weight: 700;
        line-height: 1.15;
        letter-spacing: -1.5px;
        color: #222222;
      }

      .about-page .info-eyebrow {
        margin: 0 0 14px;
        color: #8b7865;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 3px;
      }

      .info-page *,
      .info-page *::before,
      .info-page *::after {
        box-sizing: border-box;
      }

      .info-wrap {
        width: 100%;
        max-width: none;
        margin: 0 auto;
      }

      .info-hero {
        padding: 64px 6%;
      }

      .about-page .info-hero h1 {
        max-width: none;
        white-space: nowrap;
        overflow-wrap: normal;
      }

      .info-lead {
        max-width: 680px;
        font-size: 17px;
        line-height: 1.8;
      }

      .info-section {
        padding: 46px 6%;
      }

      .about-story {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        align-items: stretch;
        gap: 48px;
      }

      .about-story-image {
        width: 100%;
        min-width: 0;
        aspect-ratio: auto;
        overflow: hidden;
        border-radius: 0;
      }

      .about-story-image img {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 0;
        max-height: none;
        object-fit: cover;
      }

      .about-story-content {
        min-width: 0;
      }

      .about-story-content h2 {
        margin: 0 0 20px;
        overflow-wrap: anywhere;
      }

      .about-story-content > p:not(.info-eyebrow) {
        font-size: 15px;
        line-height: 1.8;
      }

      .about-origin {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: 20px;
        margin-top: 26px;
        padding: 20px 22px;
        border-left: 4px solid #9a7b50;
        background: #f5f1e9;
      }

      .about-origin-year {
        color: #705a3b;
        font-size: clamp(30px, 4vw, 42px);
        font-weight: 800;
        line-height: 1;
        letter-spacing: -1.5px;
      }

      .about-origin span {
        color: #8b7865;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .about-origin p {
        margin: 6px 0 0;
        color: #5f574b;
        font-size: 13px;
        line-height: 1.65;
      }

      .what-we-build h2 {
        max-width: 900px;
        margin-right: 0;
        margin-left: 0;
        text-align: left;
      }

      .what-we-build > .info-wrap > .info-eyebrow {
        text-align: left;
      }

      .build-intro {
        max-width: none;
        margin: 16px 0 0;
        color: #77716b;
        font-size: 15px;
        line-height: 1.7;
        text-align: left;
        white-space: nowrap;
      }

      .build-grid {
        position: relative;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 24px;
        margin-top: 26px;
      }

      .build-grid::before {
        content: none;
      }

      .build-card {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 0;
        padding: 54px 0 0;
        border: 0;
        border-radius: 0;
        background: transparent;
        counter-increment: build-step;
        text-align: center;
      }

      .build-card:not(:last-child)::after {
        content: ">";
        position: absolute;
        top: 0;
        right: -18px;
        display: grid;
        width: 36px;
        height: 38px;
        place-items: center;
        color: #9a7b50;
        font-size: 28px;
        font-weight: 500;
      }

      .build-card::before {
        content: counter(build-step, decimal-leading-zero);
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        display: grid;
        width: 38px;
        height: 38px;
        place-items: center;
        border: 1px solid #b9aa96;
        border-radius: 50%;
        background: #fcfbf9;
        color: #66533c;
        font-size: 12px;
        font-weight: 700;
      }

      .build-grid {
        counter-reset: build-step;
      }

      .build-card h3 {
        margin: 0 0 10px;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.4;
      }

      .build-card p {
        margin: 0;
        color: #77716b;
        font-size: 14px;
        line-height: 1.8;
      }

      .about-stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 18px;
        margin-top: 26px;
      }

      .about-stats > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        min-width: 0;
        text-align: center;
      }

      .about-stats strong {
        font-size: clamp(20px, 2.3vw, 26px);
        font-weight: 700;
        line-height: 1.3;
        overflow-wrap: anywhere;
      }

      .about-stats span {
        color: #625a53;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }

      .values-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 24px;
        margin-top: 26px;
      }

      .value-card {
        min-width: 0;
        padding: 24px;
        border-radius: 0;
        transition: none;
        transform: none;
        box-shadow: none;
      }

      .about-page .value-card:hover {
        transform: none;
        box-shadow: none;
      }

      .about-page .value-card {
        border: 1px solid #111111;
      }

      .value-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
      }

      .value-card h3 {
        font-size: 18px;
        line-height: 1.4;
        overflow-wrap: anywhere;
      }

      .value-card p {
        font-size: 14px;
        line-height: 1.8;
        overflow-wrap: anywhere;
      }

      .info-cta {
        padding: 46px 6%;
        text-align: left;
      }

      .info-cta h2 {
        max-width: none;
        font-size: clamp(32px, 4vw, 46px);
        font-weight: 700;
        line-height: 1.15;
        letter-spacing: -1.5px;
      }

      .info-cta p {
        max-width: 720px;
        margin: 16px 0 24px;
        color: #77716b;
        font-size: 15px;
        line-height: 1.8;
      }

      .about-page .info-cta .info-btn.light {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: min(100%, 170px);
        min-height: 52px;
        padding: 8px 12px;
        border: 1px solid #111111;
        border-radius: 12px;
        background: #ffffff;
        color: #111111;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: normal;
        text-transform: none;
        text-decoration: none;
        box-shadow: 0 4px 14px rgba(31, 25, 18, 0.06);
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        white-space: nowrap;
      }

      .about-page .info-cta .info-btn.light:hover {
        border-color: #111111;
        background: #ffffff;
        color: #111111;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(31, 25, 18, 0.1);
      }

      .info-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        max-width: 100%;
        min-height: 48px;
        padding: 12px 24px;
        text-decoration: none;
      }

      @media (max-width: 1024px) {
        .info-hero {
          padding: 70px 5%;
        }

        .info-section {
          padding: 48px 5%;
        }

        .about-story {
          gap: 32px;
        }

        .about-story-image img {
          min-height: 320px;
        }

        .about-stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .values-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .build-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .info-cta {
          padding: 48px 5%;
        }
      }

      @media (max-width: 768px) {
        .about-page .info-hero h1 {
          white-space: normal;
        }

        .info-hero {
          padding: 55px 6%;
        }

        .build-card h3 {
          white-space: normal;
        }

        .build-grid {
          grid-template-columns: minmax(0, 1fr);
          gap: 40px;
          padding-left: 0;
        }

        .build-grid::before {
          content: none;
        }

        .build-card {
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr);
          column-gap: 14px;
          align-items: start;
          padding: 0;
          text-align: left;
        }

        .build-card::before {
          left: 0;
          transform: none;
        }

        .build-card h3,
        .build-card p {
          grid-column: 2;
          text-align: left;
        }

        .build-card h3 {
          margin: 4px 0 6px;
        }

        .build-card:not(:last-child)::after {
          content: "↓";
          top: auto;
          right: auto;
          bottom: -25px;
          left: 18px;
          transform: translateX(-50%);
          width: 24px;
          height: 24px;
          font-size: 22px;
        }

        .build-card:not(:last-child)::after {
          content: "\\2193";
          top: auto;
          right: auto;
          bottom: -32px;
          left: 19px;
          width: 24px;
          height: 24px;
          border: 0;
          color: #9a7b50;
          font-size: 22px;
          transform: translateX(-50%);
        }

        .build-intro {
          white-space: normal;
        }

        .info-lead {
          font-size: 15px;
        }

        .info-section {
          padding: 36px 6%;
        }

        .about-story {
          grid-template-columns: minmax(0, 1fr);
          gap: 28px;
        }

        .about-story-image {
          aspect-ratio: 1 / 1;
        }

        .about-story-image img {
          min-height: 280px;
          max-height: 420px;
        }

        .about-story-content h2 {
          font-size: clamp(27px, 5vw, 36px);
        }

        .about-origin {
          gap: 14px;
          padding: 16px;
        }

        .about-stats {
          margin-top: 26px;
          gap: 20px;
        }

        .values-grid {
          gap: 16px;
        }

        .value-card {
          padding: 20px;
        }

        .info-cta {
          padding: 42px 6%;
        }
      }

      @media (max-width: 480px) {
        .info-hero {
          padding: 42px 5%;
        }

        .info-hero h1 {
          font-size: clamp(32px, 9vw, 42px);
        }

        .info-lead {
          font-size: 14px;
          line-height: 1.7;
        }

        .info-section {
          padding: 30px 5%;
        }

        .about-story {
          gap: 22px;
        }

        .about-story-image img {
          min-height: 230px;
          max-height: 300px;
        }

        .about-story-content h2 {
          font-size: 27px;
        }

        .about-story-content > p:not(.info-eyebrow) {
          font-size: 14px;
          line-height: 1.75;
        }

        .about-stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px 14px;
        }

        .about-stats strong {
          font-size: 22px;
        }

        .about-stats span {
          font-size: 12px;
        }

        .values-grid {
          grid-template-columns: minmax(0, 1fr);
          gap: 14px;
          margin-top: 24px;
        }

        .build-grid {
          grid-template-columns: minmax(0, 1fr);
          gap: 40px;
          margin-top: 24px;
        }

        .value-card {
          padding: 20px;
        }

        .value-card h3 {
          font-size: 17px;
        }

        .value-card p {
          font-size: 13px;
        }

        .info-cta {
          padding: 34px 5%;
        }

        .info-cta h2 {
          font-size: 28px;
        }

        .info-cta p {
          font-size: 14px;
        }

        .info-btn {
          padding: 12px 18px;
          font-size: 13px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .info-page * {
          scroll-behavior: auto;
        }
      }
    `}</style>
  </>
  );
};

export default About;

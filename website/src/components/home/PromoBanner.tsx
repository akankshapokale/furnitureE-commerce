import { Link } from "react-router-dom";
import LazyImage from "../common/LazyImage";
import { useWebsiteContent } from "../../hooks/useWebsiteContent";
import { resolveCmsImage } from "../../services/media";

const PromoBanner = () => {
  const { content, loading, error } = useWebsiteContent("home_content");
  if (loading) return <section className="promo-section" aria-busy="true" />;
  if (error) return <section className="promo-section" aria-live="polite"><p className="promo-empty">Promotion is temporarily unavailable.</p></section>;
  if (!content?.promo_title || !content.promo_image) {
    return <section className="promo-section" aria-live="polite"><p className="promo-empty">Promotion currently unavailable.</p></section>;
  }
  const link = typeof content.promo_button_link === "string" ? content.promo_button_link : "/shop";
  return (
    <section className="promo-section">
      <div className="promo-image-wrapper">
        <LazyImage src={resolveCmsImage(content.promo_image) || String(content.promo_image)} alt={String(content.promo_title)} className="promo-image" />
        <div className="promo-overlay"></div>
        <div className="promo-content">
          {typeof content.promo_eyebrow === "string" && <p className="promo-eyebrow">{content.promo_eyebrow}</p>}
          <h2>{String(content.promo_title)}</h2>
          {typeof content.promo_description === "string" && <p className="promo-description">{content.promo_description}</p>}
          {typeof content.promo_button_text === "string" && <Link to={link} className="promo-button">{content.promo_button_text}<span aria-hidden="true">&rarr;</span></Link>}
        </div>
      </div>
    </section>
  );
};
export default PromoBanner;

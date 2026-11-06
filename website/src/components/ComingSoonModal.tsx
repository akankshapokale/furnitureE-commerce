
import { X } from "lucide-react";

interface ComingSoonModalProps {
  category: "office" | "home";
  onClose: () => void;
}

const content = {
  office: {
    title: "Office Furniture",
    description:
      "We're preparing an exclusive collection of office furniture to create productive and stylish workspaces. Stay tuned for our upcoming designs.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Modern office furniture and workspace",
  },
  home: {
    title: "Home Furniture",
    description:
      "We're curating a beautiful collection of home furniture to bring comfort and style to your space. Stay tuned for something special.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Elegant modern living room furniture",
  },
};

export default function ComingSoonModal({
  category,
  onClose,
}: ComingSoonModalProps) {
  const item = content[category];

  return (
    <>
      <style>{`
        .coming-soon-overlay {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 18, 24, 0.68);
          backdrop-filter: blur(5px);
        }

        .coming-soon-modal {
          position: relative;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          background: #f8f5f0;
          border-radius: 18px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
          animation: comingSoonEnter 0.25s ease-out;
        }

        .coming-soon-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2;
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: #fff;
          color: #222;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        }

        .coming-soon-image {
          display: block;
          width: 100%;
          height: 280px;
          object-fit: cover;
        }

        .coming-soon-content {
          padding: 30px 28px 34px;
          text-align: center;
        }

        .coming-soon-brand {
          color: #b47739;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .coming-soon-content h2 {
          margin: 12px 0 0;
          color: #202020;
          font-size: 28px;
          font-weight: 700;
        }

        .coming-soon-content h3 {
          margin: 2px 0 14px;
          color: #b47739;
          font-size: 30px;
        }

        .coming-soon-content p {
          max-width: 420px;
          margin: 0 auto 24px;
          color: #5f5b55;
          font-size: 15px;
          line-height: 1.7;
        }

        .coming-soon-label {
          display: inline-block;
          padding: 13px 30px;
          border-radius: 7px;
          background: #202020;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        @keyframes comingSoonEnter {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 480px) {
          .coming-soon-image {
            height: 210px;
          }

          .coming-soon-content {
            padding: 24px 18px 28px;
          }

          .coming-soon-content h2 {
            font-size: 23px;
          }

          .coming-soon-content h3 {
            font-size: 26px;
          }
        }
      `}</style>

      <div
        className="coming-soon-overlay"
        onClick={onClose}
      >
        <div
          className="coming-soon-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="coming-soon-close"
            onClick={onClose}
            aria-label="Close popup"
          >
            <X size={22} />
          </button>

          <img
            className="coming-soon-image"
            src={item.image}
            alt={item.imageAlt}
          />

          <div className="coming-soon-content">
            <span className="coming-soon-brand">
              STAGING SPACES
            </span>

            <h2 id="coming-soon-title">
              {item.title}
            </h2>

            <h3>Coming Soon</h3>

            <p>{item.description}</p>

            <span className="coming-soon-label">
              COMING SOON
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

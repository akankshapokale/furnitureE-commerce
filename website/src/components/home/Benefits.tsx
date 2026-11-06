
import { Truck, ShieldCheck, Award } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free delivery on selected orders across India.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Your payments are protected with secure checkout.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Thoughtfully designed furniture built to last.",
  },
];

const Benefits = () => {
  return (
    <section className="benefits-section">
      <style>{`
        .benefits-section {
          width: 100%;
          background: #ffffff;
          border-top: 1px solid #e9ddd5;
          border-bottom: 1px solid #e9ddd5;
          box-sizing: border-box;
          padding: 0 24px;
        }

        .benefits-section .benefits-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 12px 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 40px;
          box-sizing: border-box;
        }

        .benefits-section .benefit-item {
          display: flex;
          align-items: center;
          gap: 18px;
          min-width: 0;
        }

        .benefits-section .benefit-icon {
          width: 52px;
          height: 52px;
          flex: 0 0 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e2df;
          border-radius: 50%;
          background: #fffdfb;
          color: #222222;
        }

        .benefits-section .benefit-content {
          min-width: 0;
        }

        .benefits-section .benefit-content h3 {
          margin: 0 0 8px;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.4;
          color: #222222;
        }

        .benefits-section .benefit-content p {
          margin: 0;
          max-width: 280px;
          font-size: 13px;
          line-height: 1.65;
          color: #777777;
        }

        @media (max-width: 900px) {
          .benefits-section {
            padding: 0 24px;
          }

          .benefits-section .benefits-container {
            padding: 12px 0;
            gap: 24px;
          }

          .benefits-section .benefit-item {
            gap: 12px;
          }
        }

        @media (max-width: 600px) {
          .benefits-section {
            padding: 0 20px;
          }

          .benefits-section .benefits-container {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 12px 0;
          }

          .benefits-section .benefit-item {
            gap: 16px;
          }

          .benefits-section .benefit-content p {
            max-width: none;
          }
        }
      `}</style>

      <div className="benefits-container">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div className="benefit-item" key={benefit.title}>
              <div className="benefit-icon">
                <Icon size={24} strokeWidth={1.5} />
              </div>

              <div className="benefit-content">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Benefits;

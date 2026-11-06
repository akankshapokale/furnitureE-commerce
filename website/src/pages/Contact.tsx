import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Camera, Clock, Mail, Phone } from "lucide-react";
import { useWebsiteContent } from "../hooks/useWebsiteContent";

import "./info.css";

export default function Contact() {
  const { content } = useWebsiteContent("contact_content");
  const contactEmail = typeof content?.email === "string" ? content.email : (import.meta.env.VITE_CONTACT_EMAIL ?? "contactstagingspaces@gmail.com");
  const contactPhone = typeof content?.phone === "string" ? content.phone : "+91 8669944932";
  const responseTime = "Usually within 24 hours";
  
const [form, setForm] = useState({
  name: "",
  email: "",
  message: "",
});

  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // No contact API yet: open the visitor's mail app with the message filled in.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="info-page contact-page" aria-busy={!content}>
      <section className="info-section">
        <div className="info-wrap contact-layout">
          <p className="contact-breadcrumb"><Link to="/">Home</Link><span>/</span>Contact Us</p>
          <div className="contact-cards">
            <div className="contact-intro">
              <h2>Get in touch with us</h2>
              <p>Our team is here to help with your order, products and delivery questions.</p>
            </div>
            <div className="contact-card">
              <div className="value-icon">
                <Mail size={20} strokeWidth={1.6} />
              </div>
              <div>
                <h3>Email</h3>
                <a
                  className="contact-email-link"
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail.trim())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contactEmail}
                </a>
              </div>
            </div>

            <div className="contact-card">
              <div className="value-icon">
                <Clock size={20} strokeWidth={1.6} />
              </div>
              <div>
                <h3>Response time</h3>
                <p>{responseTime}</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="value-icon"><Phone size={20} strokeWidth={1.6} /></div>
              <div><h3>Phone</h3><a href={`tel:${contactPhone.replace(/\s/g, "")}`}>{contactPhone}</a></div>
            </div>

            <div className="contact-card">
              <div className="value-icon">
                <Camera size={20} strokeWidth={1.6} />
              </div>
              <div>
                <h3>Instagram</h3>
                <a href="https://www.instagram.com/staging_spaces__/" target="_blank" rel="noopener noreferrer">
                  Follow us on Instagram
                </a>
              </div>
            </div>

          </div>

          <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
            <h2>Send us a message</h2>
            <p>Fill in the form and your email app will open with it ready to send.</p>

            <div className="contact-row">
              <div className="contact-field">
                <label htmlFor="name">Your name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} />
              </div>

              <div className="contact-field">
                <label htmlFor="email">Your email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
              />
            </div>

            {error && <div className="contact-error">{error}</div>}

            <button type="submit" className="info-btn">
              Send message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

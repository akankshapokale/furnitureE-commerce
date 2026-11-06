import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../auth/authContext";
import { useToast } from "../components/Toast";

const furnitureImages = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [currentImage, setCurrentImage] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % furnitureImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleGoogleSuccess = async (credential: string) => {
    try {
      setGoogleLoading(true);
      setError("");

      const account = await loginWithGoogle(credential);
      const storedReturnTo = sessionStorage.getItem("customSizeReturnTo");
      const stateReturnTo = (location.state as { returnTo?: string } | null)?.returnTo;
      const requestedReturnTo = storedReturnTo || stateReturnTo;
      const returnTo = requestedReturnTo?.startsWith("/") && !requestedReturnTo.startsWith("//")
        ? requestedReturnTo
        : null;

      // Someone who already saved their details (mobile number) is a returning
      // customer: skip the sign-up form and just greet them.
      if (account.phone) {
        showToast("Welcome back", account.name);
        navigate(returnTo || "/");
      } else {
        navigate("/register", { state: returnTo ? { returnTo } : undefined });
      }
    } catch (error) {
      console.error("Google login error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <style>{`
  .auth-page {
    min-height: calc(100vh - 82px);
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 45px 60px;
    box-sizing: border-box;
  }

  .auth-card {
    width: 100%;
    max-width: 1180px;
    min-height: 500px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #ffffff;
    border: 1px solid #e8e8e8;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  }

  /* LEFT IMAGE */
  .auth-image-section {
    position: relative;
    min-height: 500px;
    overflow: hidden;
    background: #e9e5df;
  }

  .auth-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.8s ease;
  }

  .auth-image-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.12) 0%,
        rgba(0, 0, 0, 0.05) 45%,
        rgba(0, 0, 0, 0.55) 100%
      );
    z-index: 1;
  }

  .auth-brand {
    position: absolute;
    top: 38px;
    left: 42px;
    z-index: 2;
    color: #ffffff;
  }

  .auth-brand {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .auth-brand-logo {
    display: block;
    height: 52px;
    width: auto;
  }

  .auth-brand-name {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 6px;
    white-space: nowrap;
  }

  .auth-brand-subtitle {
    margin-top: 5px;
    font-size: 9px;
    letter-spacing: 5px;
  }

  .auth-image-content {
    position: absolute;
    left: 42px;
    bottom: 45px;
    right: 42px;
    z-index: 2;
    color: #ffffff;
  }

  .auth-image-content h1 {
    margin: 0;
    font-family: inherit;
    font-size: clamp(36px, 4vw, 58px);
    font-weight: 400;
    line-height: 1.05;
  }

  .auth-image-content p {
    max-width: 430px;
    margin: 18px 0 0;
    font-size: 14px;
    line-height: 1.7;
    opacity: 0.9;
  }

  .image-dots {
    display: flex;
    gap: 7px;
    margin-top: 25px;
  }

  .image-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.45);
    transition: all 0.3s ease;
  }

  .image-dot.active {
    width: 24px;
    border-radius: 10px;
    background: #ffffff;
  }

  /* RIGHT AUTH */
  .auth-form-section {
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 70px;
    box-sizing: border-box;
    background: #ffffff;
  }

  .auth-content {
    width: 100%;
    max-width: 400px;
  }

  .auth-heading {
    margin-bottom: 35px;
  }

  .auth-heading h2 {
    margin: 0;
    font-family: inherit;
    font-size: 42px;
    font-weight: 400;
    line-height: 1.15;
    color: #1f1f1f;
  }

  .auth-heading p {
    margin: 13px 0 0;
    font-size: 14px;
    color: #777777;
    line-height: 1.6;
  }

  .auth-google {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .auth-google > div {
    width: 100% !important;
  }

  .google-loading {
    width: 100%;
    height: 52px;
    border: 1px solid #dcdcdc;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666666;
    font-size: 14px;
    box-sizing: border-box;
  }

  .auth-error {
    margin-top: 18px;
    padding: 12px 14px;
    border: 1px solid #fecaca;
    background: #fef2f2;
    color: #dc2626;
    border-radius: 7px;
    font-size: 13px;
  }

  .auth-terms {
    margin-top: 28px;
    font-size: 12px;
    line-height: 1.7;
    color: #999999;
  }

  .auth-terms a {
    color: #555555;
    text-decoration: underline;
  }

  .auth-login {
    margin-top: 28px;
    padding-top: 25px;
    border-top: 1px solid #eeeeee;
    font-size: 14px;
    color: #777777;
  }

  .auth-login a {
    color: #1f1f1f;
    font-weight: 600;
    text-decoration: none;
  }

  .auth-login a:hover {
    text-decoration: underline;
  }

  .auth-back {
    margin-top: 30px;
    font-size: 13px;
  }

  .auth-back a {
    color: #777777;
    text-decoration: none;
  }

  .auth-back a:hover {
    color: #1f1f1f;
  }

  /* TABLET */
  @media (max-width: 900px) {
    .auth-page {
      padding: 30px;
    }

    .auth-card {
      grid-template-columns: 1fr;
      max-width: 600px;
    }

    .auth-image-section {
      min-height: 420px;
    }

    .auth-form-section {
      min-height: auto;
      padding: 55px 40px 60px;
    }
  }

  /* MOBILE */
  @media (max-width: 600px) {
    .auth-page {
      padding: 18px;
      min-height: calc(100vh - 70px);
    }

    .auth-card {
      border-radius: 16px;
    }

    .auth-image-section {
      min-height: 330px;
    }

    .auth-brand {
      top: 25px;
      left: 25px;
    }

    .auth-image-content {
      left: 25px;
      right: 25px;
      bottom: 28px;
    }

    .auth-image-content h1 {
      font-size: 34px;
    }

    .auth-image-content p {
      font-size: 12px;
    }

    .auth-form-section {
      padding: 45px 22px 55px;
    }

    .auth-heading h2 {
      font-size: 34px;
    }
  }
`}</style>

      <main className="auth-page">
         <div className="auth-card">

        {/* LEFT — CHANGING FURNITURE IMAGES */}
        <section className="auth-image-section">

          <img
            src={furnitureImages[currentImage]}
            alt="Staging Spaces furniture"
            className="auth-image"
          />

          <div className="auth-image-overlay" />

          <div className="auth-brand">
            <img
              src="/logo-mark-white.png"
              alt=""
              className="auth-brand-logo"
            />
            <p className="auth-brand-name">STAGING SPACES</p>
          </div>

          <div className="auth-image-content">
            <h1>
              Designed for
              <br />
              the way you live.
            </h1>

            <p>
              Discover timeless furniture crafted to bring
              comfort, character and warmth into your space.
            </p>

            <div className="image-dots">
              {furnitureImages.map((_, index) => (
                <span
                  key={index}
                  className={`image-dot ${
                    currentImage === index ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT — CREATE ACCOUNT + GOOGLE OAUTH */}
        <section className="auth-form-section">

          <div className="auth-content">

            <div className="auth-heading">
              <h2>Create your account</h2>

              <p>
                Sign up to discover our collection and
                manage your orders with ease.
              </p>
            </div>

            <div className="auth-google">

              {googleLoading ? (
                <div className="google-loading">
                  Signing in with Google...
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={(response) => {
                    if (!response.credential) {
                      setError(
                        "Google did not return a valid credential."
                      );
                      return;
                    }

                    handleGoogleSuccess(response.credential);
                  }}
                  onError={() => {
                    setError(
                      "Google sign-in failed. Please try again."
                    );
                  }}
                  theme="outline"
                  size="large"
                  width="100%"
                  text="continue_with"
                  shape="rectangular"
                />
              )}

            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <p className="auth-terms">
              By continuing, you agree to our{" "}
              <Link to="/terms">Terms & Conditions</Link>{" "}
              and{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>

            

            <div className="auth-back">
              <Link to="/">
                ← Back to website
              </Link>
            </div>

          </div>

        </section>
        </div>

      </main>
    </>
  );
};

export default Login;

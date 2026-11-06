import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    pincode: "",
    flat: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
  });

  // Prefill from the Google account once the session has loaded.
  useEffect(() => {
    if (!user) return;

    const [first = "", ...rest] = user.name.split(" ");

    setFormData((prev) => ({
      ...prev,
      firstName: prev.firstName || first,
      lastName: prev.lastName || rest.join(" "),
      mobile: prev.mobile || user.phone || "",
    }));
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.mobile ||
      !formData.pincode ||
      !formData.flat ||
      !formData.area ||
      !formData.city ||
      !formData.state
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!user?.id) {
        setError("User session not found. Please login with Google again.");
        return;
      }

      // Saves the details on the logged-in account; the navbar menu
      // picks up the new name straight away.
      await updateProfile({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: formData.mobile,
        pincode: formData.pincode,
        flat: formData.flat,
        area: formData.area,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
      });

      alert("Account details saved successfully!");

      // Go to home after successful update
      const requestedReturnTo =
        (location.state as { returnTo?: string } | null)?.returnTo ||
        sessionStorage.getItem("customSizeReturnTo");
      const returnTo = requestedReturnTo?.startsWith("/") && !requestedReturnTo.startsWith("//")
        ? requestedReturnTo
        : "/";
      navigate(returnTo);
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .register-page {
          min-height: calc(100vh - 80px);
          background: #f8f8f8;
          padding: 45px 24px 70px;
          font-family: Inter, Arial, sans-serif;
          box-sizing: border-box;
        }

        .register-container {
          max-width: 1180px;
          margin: 0 auto;
        }

        .register-card {
          background: #ffffff;
          border: 1px solid #e7e7e7;
          border-radius: 20px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }

        .register-header {
          padding: 28px 38px 20px;
          border-bottom: 1px solid #eeeeee;
        }

        .register-title {
          margin: 0;
          font-family: inherit;
          font-size: 40px;
          font-weight: 400;
          color: #1f1f1f;
          letter-spacing: -0.5px;
        }

        .register-subtitle {
          margin: 10px 0 0;
          color: #777777;
          font-size: 14px;
          line-height: 1.6;
        }

        .register-form-wrapper {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 280px;
          gap: 0;
          align-items: stretch;
        }

        .register-form {
          width: 100%;
          padding: 28px 38px 30px;
          box-sizing: border-box;
        }

        .form-section {
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f1f1f;
          margin: 0 0 22px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 18px;
        }

        .form-row.mobile-row {
          grid-template-columns: 1fr 1fr;
        }

        .field {
          width: 100%;
        }

        .field label {
          display: block;
          margin-bottom: 9px;
          font-size: 13px;
          font-weight: 600;
          color: #252525;
        }

        .required {
          color: #b07a52;
        }

        .field input,
        .field select {
          width: 100%;
          height: 50px;
          box-sizing: border-box;
          border: 1px solid #dddddd;
          border-radius: 9px;
          background: #ffffff;
          padding: 0 16px;
          font-size: 14px;
          color: #333333;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .field input:hover,
        .field select:hover {
          border-color: #cfcfcf;
        }

        .field input::placeholder {
          color: #b5b5b5;
        }

        .field input:focus,
        .field select:focus {
          border-color: #8a8a8a;
          box-shadow: 0 0 0 3px rgba(176, 122, 82, 0.08);
        }

        .full-field {
          margin-bottom: 18px;
        }

        .mobile-input-wrapper {
          display: grid;
          grid-template-columns: 75px 1fr;
          gap: 8px;
        }

        .country-code {
          height: 50px;
          border: 1px solid #dddddd;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666666;
          font-size: 14px;
          background: #fafafa;
        }

        .address-divider {
          height: 1px;
          background: #eeeeee;
          margin: 25px 0;
        }

        .password-note {
          margin: 7px 0 0;
          font-size: 12px;
          color: #999999;
        }

        .error-message {
          background: #fff5f5;
          border: 1px solid #f0caca;
          color: #c0392b;
          border-radius: 8px;
          padding: 12px 15px;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .register-button {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 9px;
          background: #1f1f1f;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.8px;
          cursor: pointer;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .register-button:hover {
          background: #333333;
          transform: translateY(-1px);
        }

        .register-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: #777777;
        }

        .login-link a {
          color: #1f1f1f;
          font-weight: 600;
          text-decoration: none;
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        .saved-address-box {
          border-left: 1px solid #eeeeee;
          min-height: 100%;
          padding: 28px 30px;
          box-sizing: border-box;
          background: #fcfcfc;
        }

        .saved-address-text {
          margin: 0;
          color: #aaaaaa;
          font-family: inherit;
          font-size: 17px;
          font-style: italic;
          line-height: 1.5;
        }

        .back-home {
          display: block;
          margin-top: 24px;
          text-align: center;
          color: #777777;
          font-size: 13px;
          text-decoration: none;
        }

        .back-home:hover {
          color: #1f1f1f;
        }

        @media (max-width: 850px) {
          .register-page {
            padding: 30px 20px 60px;
          }

          .register-header {
            padding: 32px 32px 25px;
          }

          .register-form-wrapper {
            grid-template-columns: 1fr;
          }

          .register-form {
            padding: 32px;
          }

          .saved-address-box {
            border-left: none;
            border-top: 1px solid #eeeeee;
            min-height: auto;
            padding: 28px 32px;
          }
        }

        @media (max-width: 600px) {
          .register-page {
            padding: 20px 14px 45px;
          }

          .register-card {
            border-radius: 15px;
          }

          .register-header {
            padding: 28px 22px 22px;
          }

          .register-title {
            font-size: 32px;
          }

          .register-subtitle {
            font-size: 13px;
          }

          .register-form {
            padding: 28px 22px 35px;
          }

          .form-row,
          .form-row.mobile-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .mobile-input-wrapper {
            grid-template-columns: 68px 1fr;
          }

          .saved-address-box {
            padding: 25px 22px;
          }
        }
      `}</style>

      <main className="register-page">
        <div className="register-container">
          <div className="register-card">

            <div className="register-header">
              <h1 className="register-title">
                Create your account
              </h1>

              <p className="register-subtitle">
                Add your details and delivery address to get started.
              </p>
            </div>

            <div className="register-form-wrapper">

              <form
                className="register-form"
                onSubmit={handleSubmit}
              >

                {/* PERSONAL DETAILS */}
                <section className="form-section">
                  <h2 className="section-title">
                    Personal Details
                  </h2>

                  <div className="form-row">

                    <div className="field">
                      <label htmlFor="firstName">
                        First name <span className="required">*</span>
                      </label>

                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="lastName">
                        Last name <span className="required">*</span>
                      </label>

                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  {user?.email && (
                    <p className="password-note" style={{ margin: "0 0 18px" }}>
                      Signed in as <strong>{user.email}</strong>
                    </p>
                  )}

                  <div className="field">
                    <label htmlFor="mobile">
                      Mobile number <span className="required">*</span>
                    </label>

                    <div className="mobile-input-wrapper">

                      <div className="country-code">
                        +91
                      </div>

                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        placeholder="10-digit number"
                        value={formData.mobile}
                        onChange={handleChange}
                        maxLength={10}
                      />

                    </div>
                  </div>
                </section>

                <div className="address-divider" />

                {/* ADDRESS */}
                <section className="form-section">

                  <h2 className="section-title">
                    Delivery Address
                  </h2>

                  <div className="form-row">

                    <div className="field">
                      <label htmlFor="pincode">
                        Pincode <span className="required">*</span>
                      </label>

                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        placeholder="6-digit pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        maxLength={6}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="city">
                        Town / City <span className="required">*</span>
                      </label>

                      <input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="Enter town / city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  <div className="full-field field">
                    <label htmlFor="flat">
                      Flat, House no., Building, Company, Apartment{" "}
                      <span className="required">*</span>
                    </label>

                    <input
                      id="flat"
                      name="flat"
                      type="text"
                      placeholder=""
                      value={formData.flat}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="full-field field">
                    <label htmlFor="area">
                      Area, Street, Sector, Village{" "}
                      <span className="required">*</span>
                    </label>

                    <input
                      id="area"
                      name="area"
                      type="text"
                      placeholder=""
                      value={formData.area}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="full-field field">
                    <label htmlFor="landmark">
                      Landmark
                    </label>

                    <input
                      id="landmark"
                      name="landmark"
                      type="text"
                      placeholder=""
                      value={formData.landmark}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-row">

                    <div className="field">
                      <label htmlFor="city">
                        Town / City <span className="required">*</span>
                      </label>

                      <input
                        id="city"
                        name="city"
                        type="text"
                        placeholder=""
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="state">
                        State <span className="required">*</span>
                      </label>

                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      >
                        <option value="">
                          Choose a state
                        </option>

                        <option value="Maharashtra">
                          Maharashtra
                        </option>

                        <option value="Gujarat">
                          Gujarat
                        </option>

                        <option value="Goa">
                          Goa
                        </option>

                        <option value="Karnataka">
                          Karnataka
                        </option>

                        <option value="Madhya Pradesh">
                          Madhya Pradesh
                        </option>

                        <option value="Rajasthan">
                          Rajasthan
                        </option>

                        <option value="Delhi">
                          Delhi
                        </option>

                        <option value="Tamil Nadu">
                          Tamil Nadu
                        </option>

                        <option value="Telangana">
                          Telangana
                        </option>

                        <option value="Kerala">
                          Kerala
                        </option>
                      </select>
                    </div>

                  </div>

                </section>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="register-button"
                  disabled={loading}
                >
                  {loading
                    ? "SAVING DETAILS..."
                    : "CREATE ACCOUNT"}
                </button>

                <div className="login-link">
                  Already have an account?{" "}
                  <Link to="/login">
                    Login
                  </Link>
                </div>

              </form>

              {/* RIGHT SIDE */}
              <aside className="saved-address-box">
                <p className="saved-address-text">
                  No saved addresses yet.
                </p>
              </aside>

            </div>

          </div>

          <Link
            to="/"
            className="back-home"
          >
            ← Back to Home
          </Link>

        </div>
      </main>
    </>
  );
};

export default Register;

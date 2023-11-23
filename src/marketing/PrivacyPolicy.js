import React from "react";
import { Helmet } from "react-helmet";

function PrivacyPolicy() {
  return (
    <div>
      <Helmet>
        <title>Privacy Policy - Company Name</title>
        <meta
          name="description"
          content="Our Privacy Policy. How Company Name protects and uses your information."
        />
        <meta property="og:title" content="Privacy Policy - Company Name" />
        <meta
          property="og:description"
          content="Understand your rights and how your information is used at Company Name."
        />
        <meta property="og:image" content="URL_to_image_privacy_policy.jpg" />
        <meta
          property="og:url"
          content="http://www.yourwebsite.com/privacy-policy"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1>Privacy Policy</h1>
      {/* Content for Privacy Policy */}
    </div>
  );
}

export default PrivacyPolicy;

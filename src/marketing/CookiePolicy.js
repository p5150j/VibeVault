import React from "react";
import { Helmet } from "react-helmet";

function CookiePolicy() {
  return (
    <div>
      <Helmet>
        <title>Cookie Policy - Company Name</title>
        <meta
          name="description"
          content="Read about our Cookie Policy. How we use cookies to improve user experience and site functionality."
        />
        <meta property="og:title" content="Cookie Policy - Company Name" />
        <meta
          property="og:description"
          content="Understand how Company Name uses cookies on our website."
        />
        <meta property="og:image" content="URL_to_image_cookie_policy.jpg" />
        <meta
          property="og:url"
          content="http://www.yourwebsite.com/cookie-policy"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1>Cookie Policy</h1>
      {/* Content for Cookie Policy */}
    </div>
  );
}

export default CookiePolicy;

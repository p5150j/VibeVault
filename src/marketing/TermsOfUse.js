import React from "react";
import { Helmet } from "react-helmet";

function TermsOfUse() {
  return (
    <div>
      <Helmet>
        <title>Terms of Use - Company Name</title>
        <meta
          name="description"
          content="Terms of Use for accessing and using Company Name's services."
        />
        <meta property="og:title" content="Terms of Use - Company Name" />
        <meta
          property="og:description"
          content="Legal terms and conditions for using Company Name's website and services."
        />
        <meta property="og:image" content="URL_to_image_terms_of_use.jpg" />
        <meta
          property="og:url"
          content="http://www.yourwebsite.com/terms-of-use"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1>Terms of Use</h1>
      {/* Content for Terms of Use */}
    </div>
  );
}

export default TermsOfUse;

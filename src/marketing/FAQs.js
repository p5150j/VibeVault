import React from "react";
import { Helmet } from "react-helmet";

function FAQs() {
  return (
    <div>
      <Helmet>
        <title>FAQs - Company Name</title>
        <meta
          name="description"
          content="Frequently Asked Questions (FAQs) about Company Name, our services, and policies."
        />
        <meta property="og:title" content="FAQs - Company Name" />
        <meta
          property="og:description"
          content="Find answers to common questions about Company Name."
        />
        <meta property="og:image" content="URL_to_image_faqs.jpg" />
        <meta property="og:url" content="http://www.yourwebsite.com/faqs" />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1>FAQs</h1>
      {/* Additional content */}
    </div>
  );
}

export default FAQs;

import React from "react";
import { Helmet } from "react-helmet";

function Pricing() {
  return (
    <div>
      <Helmet>
        <title>Pricing - Company Name</title>
        <meta
          name="description"
          content="View pricing plans for Company Name's services. Choose the plan that fits your needs."
        />
        <meta property="og:title" content="Pricing - Company Name" />
        <meta
          property="og:description"
          content="Affordable and flexible pricing plans at Company Name. Find your perfect fit."
        />
        <meta property="og:image" content="URL_to_image_pricing.jpg" />
        <meta property="og:url" content="http://www.yourwebsite.com/pricing" />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1>Pricing</h1>
      {/* Additional content */}
    </div>
  );
}

export default Pricing;

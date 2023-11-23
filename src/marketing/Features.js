import React from "react";
import { Helmet } from "react-helmet";

function Features() {
  return (
    <div>
      <Helmet>
        <title>Features - Company Name</title>
        <meta
          name="description"
          content="Explore the features of our products/services. How Company Name stands out in the market."
        />
        <meta property="og:title" content="Features - Company Name" />
        <meta
          property="og:description"
          content="Discover what makes Company Name's products/services unique and effective."
        />
        <meta property="og:image" content="URL_to_image_features.jpg" />
        <meta property="og:url" content="http://www.yourwebsite.com/features" />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1>Features</h1>
      {/* Additional content */}
    </div>
  );
}

export default Features;

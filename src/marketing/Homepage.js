import React from "react";
import { Helmet } from "react-helmet";

function Homepage() {
  return (
    <div>
      <Helmet>
        <title>VibeVault - Innovative Solutions for Your Needs</title>
        <meta
          name="description"
          content="Welcome to Company Name. We offer innovative solutions to help you achieve your goals."
        />
        <meta
          property="og:title"
          content="Company Name - Innovative Solutions for Your Needs"
        />
        <meta
          property="og:description"
          content="Discover Company Name's range of products/services designed for efficiency and success."
        />
        <meta property="og:image" content="URL_to_image_homepage.jpg" />
        <meta property="og:url" content="http://www.yourwebsite.com/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1>Welcome to VibeVault</h1>
      {/* Additional content */}
    </div>
  );
}

export default Homepage;

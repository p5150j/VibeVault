import React from "react";
import { Helmet } from "react-helmet";

function AboutUs() {
  return (
    <div>
      <Helmet>
        <title>About Us - Company Name</title>
        <meta
          name="description"
          content="Learn more about Company Name, our history, mission, and team."
        />
        <meta property="og:title" content="About Us - Company Name" />
        <meta
          property="og:description"
          content="Discover the story behind Company Name, our values, and our commitment to quality."
        />
        <meta property="og:image" content="URL_to_image_about_us.jpg" />
        <meta property="og:url" content="http://www.yourwebsite.com/about" />
        <meta property="og:type" content="website" />
      </Helmet>
      <h1>About Us</h1>
      {/* Additional content */}
    </div>
  );
}

export default AboutUs;

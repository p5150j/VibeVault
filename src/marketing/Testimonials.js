import React from "react";
import { Helmet } from "react-helmet";

function Testimonials() {
  return (
    <div>
      <Helmet>
        <title>Testimonials - Company Name</title>
        <meta
          name="description"
          content="Hear from our satisfied customers and their experiences with Company Name."
        />
        <meta property="og:title" content="Testimonials - Company Name" />
        <meta
          property="og:description"
          content="Real stories and testimonials from customers who have benefited from Company Name's services."
        />
        <meta property="og:image" content="URL_to_image_testimonials.jpg" />
        <meta
          property="og:url"
          content="http://www.yourwebsite.com/testimonials"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1>Success Stories</h1>
      {/* Additional content */}
    </div>
  );
}

export default Testimonials;

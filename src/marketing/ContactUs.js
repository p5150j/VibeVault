import React from "react";
import { Helmet } from "react-helmet";

function ContactUs() {
  return (
    <div>
      <Helmet>
        <title>Contact Us - Company Name</title>
        <meta
          name="description"
          content="Get in touch with Company Name. Contact details, location, and inquiry forms."
        />
        <meta property="og:title" content="Contact Us - Company Name" />
        <meta
          property="og:description"
          content="Reach out to Company Name for inquiries, support, or feedback."
        />
        <meta property="og:image" content="URL_to_image_contact_us.jpg" />
        <meta property="og:url" content="http://www.yourwebsite.com/contact" />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1>Contact Us</h1>
      {/* Additional content */}
    </div>
  );
}

export default ContactUs;

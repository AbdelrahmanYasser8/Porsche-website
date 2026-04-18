import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import wallpaper from "../../assets/images/wallpaper-porsche.png";

const About = () => {
  return (
    <div style={{ background: "#fff" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="position-relative" style={{ height: "60vh", background: "black" }}>
        <img
          src={wallpaper}
          alt="Porsche"
          className="w-100 h-100 position-absolute top-0 start-0"
          style={{ objectFit: "cover", opacity: 0.7 }}
        />
        <div className="container h-100 d-flex flex-column justify-content-center align-items-start position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-3 fw-bold text-white mb-3">About Us</h1>
          <p className="lead text-white" style={{ maxWidth: 500 }}>
            Engineering excellence since 1948. Porsche represents precision, performance, and timeless design. Every model is built to deliver an unforgettable driving experience.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="text-center mb-4">Our Story</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <p className="text-center">
                Founded in 1948, Porsche was built on a passion for performance and precision engineering. From the early days of the Porsche 356 to the iconic 911, the brand has always focused on creating sports cars that deliver pure driving emotion.<br /><br />
                Motorsport success helped shape Porsche’s innovation, pushing technology and design to new levels. Every generation of vehicles reflects this commitment to excellence, balance, and timeless style.<br /><br />
                Today, Porsche continues to evolve with modern electric and hybrid technology, while staying true to its heritage — building cars that connect the driver to the road in the most authentic way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Stats */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <div>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb8Pxc_d58zrnrKwDi26IKR6F9HTRRlacF5Q&s" alt="Excellence Icon" width={48} height={48} style={{ width: 48, height: 48, marginBottom: 12 }} />
                <h4 className="fw-bold mb-0">75+</h4>
                <div className="text-muted">Years of Excellence</div>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <div>
                <img src="https://icons.veryicon.com/png/o/miscellaneous/905-system/customer-management-3.png" alt="Customers Icon" width={48} height={48} style={{ width: 48, height: 48, marginBottom: 12 }} />
                <h4 className="fw-bold mb-0">1M+</h4>
                <div className="text-muted">Happy Customers</div>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <div>
                <img src="https://img.favpng.com/15/19/6/downwards-zigzag-arrow-downwards-zigzag-arrow-clip-art-png-favpng-q3DMQGg5DJfX5daFPzGdZD9tb.jpg" alt="Annual Sold Icon" width={48} height={48} style={{ width: 48, height: 48, marginBottom: 12 }} />
                <h4 className="fw-bold mb-0">50,000+</h4>
                <div className="text-muted">Vehicles Sold Annually</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div>
                <img src="https://www.iconpacks.net/icons/2/free-heart-icon-3510-thumb.png" alt="Customer Satisfaction Icon" width={48} height={48} style={{ width: 48, height: 48, marginBottom: 12 }} />
                <h4 className="fw-bold mb-0">98%</h4>
                <div className="text-muted">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="text-center mb-4">Our Values</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="bg-white p-4 rounded shadow-sm h-100">
                <h5 className="fw-bold mb-2">Quality First</h5>
                <div className="text-muted">
                  Every vehicle in our collection undergoes rigorous inspection to ensure it meets our exacting standards. We never compromise on quality.
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white p-4 rounded shadow-sm h-100">
                <h5 className="fw-bold mb-2">Customer Focused</h5>
                <div className="text-muted">
                  Your satisfaction is our priority. We’re committed to providing personalized service and support throughout your journey with us.
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white p-4 rounded shadow-sm h-100">
                <h5 className="fw-bold mb-2">Innovation Driven</h5>
                <div className="text-muted">
                  We embrace the latest automotive technologies and innovations, from electric vehicles to advanced safety features.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
    </div>
  );
};

export default About;
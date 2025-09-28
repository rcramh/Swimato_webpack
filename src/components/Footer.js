import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h3>Swimato</h3>
          <p>Delicious food delivered to your doorstep.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/restaurants">Restaurants</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Email: support@swimato.com</p>
          <p>Phone: +91 12345 67890</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Swimato. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
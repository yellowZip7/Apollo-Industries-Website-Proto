import { Link } from 'react-router-dom';
import { navItems, site } from '../content/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div className="site-footer__about">
          <img className="logo logo--light" src="/images/apollo-logo.png" alt="Apollo Industries" width={68} height={44} />
          <img className="logo logo--dark" src="/images/apollo-logo-light.png" alt="Apollo Industries" width={68} height={44} />
          <p>Custom software built around the way you work.</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="site-footer__heading">Pages</h2>
          <ul className="site-footer__list">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="site-footer__heading">Get in touch</h2>
          <ul className="site-footer__list">
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </li>
            <li>
              <span>{site.location}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap site-footer__legal">
        <p>
          &copy; {year} {site.name}
        </p>
      </div>
    </footer>
  );
}

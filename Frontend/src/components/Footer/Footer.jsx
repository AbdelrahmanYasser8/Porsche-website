
import linkedin from '../../assets/icons/linkedin.png';
import youtube from '../../assets/icons/youtube.png';
import instagram from '../../assets/icons/instagram.png';
import facebook from '../../assets/icons/facebook.png';

export default function Footer() {
  return (
    <>
      <footer>
        <div className="bg-dark text-white text-center d-flex justify-content-center align-items-center row g-0" style={{ height: '150px' }}>
          <div className="row d-flex justify-content-center align-items-center mt-4">
            <a href="#" className="col-auto text-white text-decoration-none mx-5">Home</a>
            <a href="#" className="col-auto text-white text-decoration-none mx-5">About</a>
            <p className="col-auto text-white text-decoration-none mx-5 mb-0">Contact</p>
          </div>
          <div className="row d-flex justify-content-center g-3 mt-0 m-4 me-2">
            <div className="col-3"></div>
            <a href="https://www.linkedin.com/company/porsche" target="_blank" className="col-auto">
              <img src={linkedin} className="col-auto" alt="Porsche Logo" style={{ height: "30px" }} />
            </a>
            <a href="https://www.youtube.com/user/Porsche" target="_blank" className="col-auto pt-2">
              <img src={youtube} className="col-auto" alt="Porsche Logo" style={{ height: "30px" }} />
            </a>
            <a href="https://www.instagram.com/porsche" target="_blank" className="col-auto">
              <img src={instagram} className="col-auto" alt="Porsche Logo" style={{ height: "30px" }} />
            </a>
            <a href="https://www.facebook.com/porsche" target="_blank" className="col-auto">
              <img src={facebook} className="col-auto" alt="Porsche Logo" style={{ height: "30px" }} />
            </a>
          </div>
        </div>
        <div className="bg-black text-white text-center p-3">
          <p className="mb-0">&copy; 2026 Porsche. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
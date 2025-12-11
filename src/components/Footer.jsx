import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-base-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ClubSphere</h3>
            <p className="text-base-content/70">
              Discover, join, and manage local clubs. Connect with like-minded people and create amazing experiences together.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-base-content/70 hover:text-primary transition">Home</a></li>
              <li><a href="/clubs" className="text-base-content/70 hover:text-primary transition">Clubs</a></li>
              <li><a href="/events" className="text-base-content/70 hover:text-primary transition">Events</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition">
                <FaGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition">
                <FaLinkedin />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition">
                <FaXTwitter />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-base-300 mt-8 pt-8 text-center text-base-content/70">
          <p>&copy; {new Date().getFullYear()} ClubSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



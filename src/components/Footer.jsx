import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-base-200 mt-auto"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants}>
            <motion.h3
              className="text-xl font-bold mb-4"
              whileHover={{ scale: 1.05, color: '#570df8' }}
            >
              ClubSphere
            </motion.h3>
            <p className="text-base-content/70">
              Discover, join, and manage local clubs. Connect with like-minded people and create amazing experiences together.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/clubs', label: 'Clubs' },
                { href: '/events', label: 'Events' },
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <a href={link.href} className="text-base-content/70 hover:text-primary transition">
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 360, color: '#570df8' }}
                transition={{ duration: 0.3 }}
                href="https://github.com/Arghya044"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl transition"
              >
                <FaGithub />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 360, color: '#570df8' }}
                transition={{ duration: 0.3 }}
                href="www.linkedin.com/in/-biswas-arghya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl transition"
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 360, color: '#570df8' }}
                transition={{ duration: 0.3 }}
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl transition"
              >
                <FaXTwitter />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-base-300 mt-8 pt-8 text-center text-base-content/70"
        >
          <p>&copy; {new Date().getFullYear()} ClubSphere. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;


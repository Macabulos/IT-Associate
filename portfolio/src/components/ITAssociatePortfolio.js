import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faComments, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './ITAssociatePortfolio.css';
import profileImage from './images/profile.png';
// Import project images (add your actual images in the images folder)
import project1Img from './images/profile.png';
import project2Img from './images/profile.png';
import project3Img from './images/profile.png';
import project4Img from './images/profile.png';
// Import resume file
import resumeFile from './Resume/Resume.pdf';
// Import certification files (add your certification PDFs in the Certifications folder)
import cssCert from '../Certifications/HTML_Essentials_certificate_johnlestermacabulos-gmail-com_1cc87cfe-6e13-4727-b6bb-d5c15ed06994.pdf';
import htmlCert from '../Certifications/HTML_Essentials_certificate_johnlestermacabulos-gmail-com_1cc87cfe-6e13-4727-b6bb-d5c15ed06994.pdf';
import ojtCert from '../Certifications/ojt.pdf';
import epasCert from '../Certifications/NCII.pdf';
import genaiCert from '../Certifications/GenAI_Certificate.pdf';
import powerpointCert from '../Certifications/PowerPoint_Certificate.pdf';

const ITAssociatePortfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! 👋 I\'m your AI assistant. How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const imageRef = useRef(null);
  const textRefs = useRef([]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Typing animation effect
  useEffect(() => {
    const roles = [
      'System Administrator',
      'Tech Support Specialist',
      'Programmer',
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const type = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        setTypedText(currentRole.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setTypedText(currentRole.substring(0, charIndex + 1));
        charIndex++;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        setIsTypingComplete(true);
        timeoutId = setTimeout(() => {
          isDeleting = true;
          setIsTypingComplete(false);
          timeoutId = setTimeout(type, 1000);
        }, 2000);
        return;
      }

      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeoutId = setTimeout(type, 500);
        return;
      }

      const speed = isDeleting ? 50 : 100;
      timeoutId = setTimeout(type, speed);
    };

    type();

    return () => clearTimeout(timeoutId);
  }, []);

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'skills', 'projects', 'certifications', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dark mode persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  // Animation on scroll effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    textRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showResumeModal || showCertModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showResumeModal, showCertModal]);

  const addToRefs = (el) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  const openCertModal = (cert) => {
    setSelectedCert(cert);
    setShowCertModal(true);
  };

  // AI Chatbot response function
  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! 👋 Nice to meet you! How can I assist you today?";
    }
    else if (msg.includes('name') || msg.includes('who are you')) {
      return "I'm your AI assistant here to help you learn more about John Lester Macabulos!";
    }
    else if (msg.includes('skills') || msg.includes('technologies')) {
      return "John specializes in System Administration, Cloud Computing (AWS/Azure), Network Security, Database Management, Technical Support, and Scripting (Python/Bash). He's proficient with 90%+ in these areas! 💪";
    }
    else if (msg.includes('experience') || msg.includes('experience')) {
      return "John has over 1 year of experience as an IT Associate, working on various projects including cloud migration, network security, help desk automation, and IT asset management! 🚀";
    }
    else if (msg.includes('project')) {
      return "John has completed 10+ projects including Cloud Migration, Network Security Overhaul, Help Desk Automation, and IT Asset Management. He has 15+ happy clients! Check out the Projects section for more details! 📁";
    }
    else if (msg.includes('certification') || msg.includes('certificate')) {
      return "John holds several certifications including HTML Essentials, CSS NC II, EPAS NC II, Microsoft GenAI, and PowerPoint Pro. You can view all certificates in the Certifications section! 🎓";
    }
    else if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) {
      return "You can contact John via email at johnlestermacabulos@gmail.com or through the contact form in the Contact section. He typically responds within 24 hours! 📧";
    }
    else if (msg.includes('resume')) {
      return "You can view John's complete resume by clicking the 'View Resume' button on the home page! 📄";
    }
    else if (msg.includes('github')) {
      return "John's GitHub profile is at https://github.com/Macabulos - check out his repositories! 💻";
    }
    else if (msg.includes('linkedin')) {
      return "Connect with John on LinkedIn: https://www.linkedin.com/in/john-lester-macabulos-4a6441334/ 🤝";
    }
    else if (msg.includes('location') || msg.includes('where')) {
      return "John is based in Tacloban City, Leyte, Philippines! 🇵🇭";
    }
    else if (msg.includes('education')) {
      return "John holds a BSIT degree in Information Technology! 🎓";
    }
    else if (msg.includes('thanks') || msg.includes('thank you')) {
      return "You're welcome! 😊 Feel free to ask me anything else about John or his work!";
    }
    else if (msg.includes('help')) {
      return "I can help you with information about John's skills, projects, certifications, experience, contact details, and more! Just ask me anything! 🤖";
    }
    else {
      return "I'm here to help! You can ask me about John's skills, projects, certifications, experience, or how to contact him. What would you like to know? 🤔";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: inputMessage }]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Navigation items
  const navItems = ['home', 'about', 'skills', 'projects', 'certifications', 'contact'];

  return (
    <div className={`portfolio-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* Custom Cursor Effect */}
      <div className="cursor-glow"></div>
      
      {/* Dark Mode Toggle */}
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Chatbot Toggle Button */}
      <button className="chatbot-toggle" onClick={() => setShowChatbot(!showChatbot)}>
        <FontAwesomeIcon icon={faComments} />
      </button>

      {/* Chatbot Window */}
      {showChatbot && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>AI Assistant 🤖</h3>
            <button className="chatbot-close" onClick={() => setShowChatbot(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.type}`}>
                <div className="message-bubble">
                  {message.type === 'bot' && <span className="bot-icon">🤖</span>}
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message bot">
                <div className="message-bubble typing">
                  <span className="bot-icon">🤖</span>
                  <span className="typing-dots">...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask me anything about John..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}
      
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">💻</span>
          <span className="brand-name">IT Associate</span>
        </div>
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item}>
              <button 
                onClick={() => {
                  setActiveSection(item);
                  document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`nav-link ${activeSection === item ? 'active' : ''}`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            </li>
          ))}
        </ul>
        <div className="nav-toggle">☰</div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-text" ref={addToRefs}>
            <div className="greeting-badge">
              <span className="wave-emoji">👋</span> Welcome to my digital space
            </div>
            <h1 className="hero-title">
              I'm <span className="highlight">John Lester M. Macabulos</span>
              <div className="typing-text">
                IT Associate & <span className="typed-word">{typedText}</span>
                <span className={`cursor ${isTypingComplete ? 'blinking' : ''}`}>|</span>
              </div>
            </h1>
            <p className="hero-description">
              Passionate IT professional specializing in system administration, 
              cloud solutions, and technical support. Turning complex problems into elegant solutions.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-primary"
                onClick={() => setShowResumeModal(true)}
              >
                View Resume <span className="btn-icon">📄</span>
              </button>
              <button 
                className="btn-secondary"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Me <span className="btn-icon">✉️</span>
              </button>
            </div>
            <div className="social-links">
              <a href="https://github.com/Macabulos" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={faGithub} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/john-lester-macabulos-4a6441334/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
              </a>
              <a href="https://www.facebook.com/jl.macabulos.M" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={faFacebook} /> Facebook
              </a>
            </div>
          </div>
          <div className="hero-image" ref={imageRef}>
            <div className="image-wrapper animate-image">
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
              <img 
                src={profileImage} 
                alt="John Lester Macabulos - IT Associate"
                className="profile-avatar"
              />
              <div className="tech-stack-badge">
                <span>⚡ 1 Year Experience</span>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <div className="arrow-down"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="section-header" ref={addToRefs}>
            <h2 className="section-title">About Me</h2>
            <div className="title-underline"></div>
          </div>
          <div className="about-content">
            <div className="about-text" ref={addToRefs}>
              <p>
                Seeking an IT Associate position where I can apply my knowledge of technical support, hardware and software troubleshooting, networking, and system administration. Equipped with strong problem-solving, analytical, and communication skills to provide efficient IT solutions, support business operations, and contribute to organizational success while continuously developing technical expertise.
              </p>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">📍 Location:</span>
                  <span className="info-value">Tacloban City, Leyte, Philippines</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📧 Email:</span>
                  <span className="info-value">johnlestermacabulos@gmail.com</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🎓 Education:</span>
                  <span className="info-value">BSIT in Information Technology</span>
                </div>
              </div>
            </div>
            <div className="about-stats" ref={addToRefs}>
              <div className="stat-card">
                <div className="stat-number">10+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">15+</div>
                <div className="stat-label">Happy Clients</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <div className="section-container">
          <div className="section-header" ref={addToRefs}>
            <h2 className="section-title">Technical Skills</h2>
            <div className="title-underline"></div>
          </div>
          <div className="skills-grid">
            {skillsData.map((skill, index) => (
              <div className="skill-card" key={index} ref={addToRefs} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="skill-icon">{skill.icon}</div>
                <h3 className="skill-name">{skill.name}</h3>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: `${skill.level}%` }}></div>
                </div>
                <span className="skill-level">{skill.level}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <div className="section-container">
          <div className="section-header" ref={addToRefs}>
            <h2 className="section-title">Featured Projects</h2>
            <div className="title-underline"></div>
          </div>
          <div className="projects-grid">
            {projectsData.map((project, index) => (
              <div className="project-card" key={index} ref={addToRefs}>
                <div className="project-image">
                  <img 
                    src={project.screenshot} 
                    alt={project.title}
                    className="project-screenshot"
                  />
                  <div className="project-overlay">
                    <div className="project-links">
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link-btn">
                        GitHub
                      </a>
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="project-link-btn">
                        Live Demo
                      </a>
                    </div>
                  </div>
                </div>
                <div className="project-info">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="certifications-section">
        <div className="section-container">
          <div className="section-header" ref={addToRefs}>
            <h2 className="section-title">Certifications & Achievements</h2>
            <div className="title-underline"></div>
          </div>
          <div className="certifications-grid">
            {certificationsData.map((cert, index) => (
              <div className="cert-card" key={index} ref={addToRefs} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="cert-icon">{cert.icon}</div>
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-description">{cert.description}</p>
                <div className="cert-date">
                  <span className="date-icon">📅</span>
                  <span>{cert.date}</span>
                </div>
                <button 
                  className="cert-view-btn"
                  onClick={() => openCertModal(cert)}
                >
                  View Certificate 
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <div className="section-header" ref={addToRefs}>
            <h2 className="section-title">Get In Touch</h2>
            <div className="title-underline"></div>
          </div>
          <div className="contact-content">
            <div className="contact-info" ref={addToRefs}>
              <h3>Let's Work Together!</h3>
              <p>Have a project in mind or just want to say hi? I'd love to hear from you.</p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <span>+63 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span>johnlestermacabulos@gmail.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <span>www.johnmacabulos.dev</span>
                </div>
              </div>
            
            </div>
            <form className="contact-form" ref={addToRefs}>
              <input type="text" placeholder="Your Name" className="form-input" />
              <input type="email" placeholder="Your Email" className="form-input" />
              <textarea placeholder="Your Message" rows="5" className="form-textarea"></textarea>
              <button type="submit" className="btn-primary submit-btn">
                Send Message <span className="btn-icon">🚀</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="resume-modal" onClick={() => setShowResumeModal(false)}>
          <div className="resume-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowResumeModal(false)}>
              ✕
            </button>
            <iframe 
              src={resumeFile} 
              title="Resume"
              className="resume-iframe"
            />
          </div>
        </div>
      )}

      {/* Certification Modal */}
      {showCertModal && selectedCert && (
        <div className="resume-modal" onClick={() => setShowCertModal(false)}>
          <div className="resume-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowCertModal(false)}>
              ✕
            </button>
            <div className="cert-modal-header">
              <h3>{selectedCert.title}</h3>
            </div>
            <iframe 
              src={selectedCert.file} 
              title={selectedCert.title}
              className="resume-iframe"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 John Lester M. Macabulos - IT Associate. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Data arrays
const skillsData = [
  { name: 'System Administration', icon: '🖥️', level: 90 },
  { name: 'Cloud Computing (AWS/Azure)', icon: '☁️', level: 85 },
  { name: 'Network Security', icon: '🔒', level: 80 },
  { name: 'Database Management', icon: '🗄️', level: 75 },
  { name: 'Technical Support', icon: '🔧', level: 95 },
  { name: 'Scripting (Python/Bash)', icon: '📜', level: 70 }
];

const projectsData = [
  {
    title: 'Cloud Migration Project',
    description: 'Successfully migrated on-premise infrastructure to AWS cloud, reducing costs by 30% and improving scalability.',
    screenshot: project1Img,
    githubLink: 'https://github.com/Macabulos/cloud-migration',
    liveLink: 'https://demo1.example.com',
    tech: ['AWS', 'Docker', 'Terraform']
  },
  {
    title: 'Network Security Overhaul',
    description: 'Implemented comprehensive security measures including firewalls, IDS/IPS, and VPN solutions for enterprise network.',
    screenshot: project2Img,
    githubLink: 'https://github.com/Macabulos/network-security',
    liveLink: 'https://demo2.example.com',
    tech: ['Cisco', 'Fortinet', 'Wireshark']
  },
  {
    title: 'Help Desk Automation',
    description: 'Developed automated ticketing system with AI-powered solutions, reducing response time by 60%.',
    screenshot: project3Img,
    githubLink: 'https://github.com/Macabulos/helpdesk-auto',
    liveLink: 'https://demo3.example.com',
    tech: ['Python', 'Django', 'React']
  },
  {
    title: 'IT Asset Management',
    description: 'Created comprehensive asset tracking system with real-time monitoring and reporting capabilities.',
    screenshot: project4Img,
    githubLink: 'https://github.com/Macabulos/it-asset-mgmt',
    liveLink: 'https://demo4.example.com',
    tech: ['PHP', 'MySQL', 'JavaScript']
  }
];

// Certifications Data with PDF files
const certificationsData = [
  {
    icon: '🌐',
    title: 'HTML Essentials Certificate',
    description: 'Comprehensive certification in HTML fundamentals, covering semantic markup, forms, tables, and modern HTML5 features for building structured web pages.',
    date: '2024',
    file: htmlCert
  },
  {
    icon: '💻',
    title: 'Computer Systems Servicing (CSS) NC II',
    description: 'National certification for computer systems servicing, demonstrating expertise in hardware installation, configuration, and maintenance.',
    date: '2023',
    file: cssCert
  },
  {
    icon: '🎓',
    title: 'On-the-Job Training Completion',
    description: 'Completed comprehensive on-the-job training program, gaining practical experience in IT operations and support.',
    date: '2024',
    file: ojtCert
  },
  {
    icon: '🔧',
    title: 'Electronic Products Assembly and Servicing (EPAS) NC II',
    description: 'Certification in electronic products assembly, troubleshooting, and servicing.',
    date: '2023',
    file: epasCert
  },
  {
    icon: '🤖',
    title: 'Microsoft GenAI - Internet Search and Beyond',
    description: 'Advanced certification in Generative AI applications and internet search optimization techniques.',
    date: '2024',
    file: genaiCert
  },
  {
    icon: '📊',
    title: 'PowerPoint Pro Certificate - Microsoft Essentials',
    description: 'Professional certification in Microsoft PowerPoint, demonstrating expertise in creating professional presentations.',
    date: '2024',
    file: powerpointCert
  }
];

// Mouse glow effect - only run in browser
if (typeof window !== 'undefined') {
  document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
  });
}

export default ITAssociatePortfolio;
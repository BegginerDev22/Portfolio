import { User, FolderGit2, Cpu, Terminal, FileLock2, Radio } from 'lucide-react';
import { AppConfig, Project, SkillCategory } from './types';

export const APPS: AppConfig[] = [
  {
    id: 'profile',
    title: 'AGENT_PROFILE.dat',
    icon: User,
    defaultWidth: 600,
    defaultHeight: 700,
    defaultX: 50,
    defaultY: 50,
  },
  {
    id: 'projects',
    title: 'MISSION_FILES.exe',
    icon: FolderGit2,
    defaultWidth: 800,
    defaultHeight: 600,
    defaultX: 100,
    defaultY: 80,
  },
  {
    id: 'skills',
    title: 'SKILL_MATRIX.sys',
    icon: Cpu,
    defaultWidth: 700,
    defaultHeight: 600,
    defaultX: 150,
    defaultY: 110,
  },
  {
    id: 'terminal',
    title: 'COMM_UPLINK.sh',
    icon: Terminal,
    defaultWidth: 600,
    defaultHeight: 400,
    defaultX: 400,
    defaultY: 200,
  },
  {
    id: 'resume',
    title: 'SECURE_RESUME.pdf',
    icon: FileLock2,
    defaultWidth: 600,
    defaultHeight: 700,
    defaultX: 550,
    defaultY: 100,
  },
  {
    id: 'contact',
    title: 'ENCRYPTED_CHANNEL.com',
    icon: Radio,
    defaultWidth: 500,
    defaultHeight: 600,
    defaultX: 300,
    defaultY: 150,
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'p_car',
    codename: 'OP_CAR_WALA',
    client: 'BCA Car Wala',
    description: 'Developed a comprehensive car trading system for buying and selling vehicles. Implemented a secure PHP backend for admin/user management and dynamic AJAX interactions for seamless navigation.',
    tech: ['PHP', 'MySQL', 'JQuery', 'AJAX'],
    status: 'CLASSIFIED',
    url: '#'
  },
  {
    id: 'p_sbt',
    codename: 'PROTOCOL_SBT',
    client: 'School Bus Tracking',
    description: 'Architected a real-time tracking system for school transport. Provides students with route info, location, and handler details. Built with core PHP and MySQL for reliable data retrieval.',
    tech: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
    status: 'CLASSIFIED',
    url: '#'
  },
  {
    id: 'p_broker',
    codename: 'PROJECT_MYBROKER',
    client: 'Real Estate App',
    description: 'Full-featured real estate application for property transactions in Surat. Includes property management, valuation tools, and direct buyer-seller communication channels.',
    tech: ['Real Estate Tech', 'Web App', 'User Comms'],
    status: 'CLASSIFIED',
    url: '#'
  },
  {
    id: 'p1',
    codename: 'OP_ORIZER_GRID',
    client: 'Orizer Digital',
    description: 'High-performance digital agency interface designed for maximum brand impact and conversion velocity.',
    tech: ['React', 'Next.js', 'Modern UI'],
    status: 'DECRYPTED',
    url: 'https://orizer.in/'
  },
  {
    id: 'p2',
    codename: 'PROTOCOL_DOCTORLY',
    client: 'HealthTech Solutions',
    description: 'Advanced medical administration dashboard providing real-time patient analytics and resource tracking.',
    tech: ['Dashboard UX', 'Healthcare IT', 'Data Viz'],
    status: 'DECRYPTED',
    url: 'https://doctorly.themesbrand.website/'
  }
];

export const SKILLS: SkillCategory[] = [
  {
    name: 'WEB_TECHNOLOGIES',
    skills: [
      { name: 'React.js', level: 90 },
      { name: 'Angular', level: 85 },
      { name: 'HTML5 / CSS3', level: 98 },
      { name: 'Web Architecture', level: 92 },
    ],
  },
  {
    name: 'PROGRAMMING_LANG',
    skills: [
      { name: 'JAVA', level: 90 },
      { name: 'PHP', level: 88 },
      { name: 'Python', level: 80 },
      { name: 'C', level: 75 },
    ],
  },
  {
    name: 'DATABASE_SYSTEMS',
    skills: [
      { name: 'MySQL', level: 95 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'MongoDB', level: 88 },
      { name: 'Oracle SQL', level: 82 },
    ],
  },
  {
    name: 'FRAMEWORKS',
    skills: [
      { name: 'Spring Boot', level: 88 },
      { name: 'Hibernate', level: 85 },
      { name: 'Bootstrap', level: 95 },
      { name: 'JDBC', level: 85 },
    ],
  },
  {
    name: 'TOOLS_&_SOFT_SKILLS',
    skills: [
      { name: 'GitHub', level: 92 },
      { name: 'Postman', level: 90 },
      { name: 'Team Leadership', level: 95 },
      { name: 'Problem Solving', level: 98 },
    ],
  }
];

export const RESUME_TEXT = `SARTHAK MAYANI
sarthakmayani2004@gmail.com | +91 78620 55445
Surat, Gujarat

PROFILE
Motivated software engineer Skilled in programming languages like Java, C, and Python. Comfortable with both front-end and back-end development and working with databases like SQL and MongoDB. Strong problem-solving skills with a focus on writing clean and efficient code. Enjoys learning new technologies and working in a team to create reliable software solutions.

SKILLS
- Web Technologies: HTML5, CSS3, React js, Angular
- Programming Language: JAVA, PHP
- Database: Oracle SQL, MySQL, MongoDB, PostgreSQL
- Frameworks: Bootstrap, Spring Boot, Spring, Hibernate, JDBC
- Tools: GitHub, Postman
- Soft Skills: Results Oriented, Team Leadership, Decision Making, Problem Solving

EDUCATION
- Bachelor of Computer Application (BCA)
  UKA TARSADIA UNIVERSITY | 2021 - 2024
- HSC
  Ashadeep Group of Schools, Surat | 2020 - 2021
- SSC
  Ashadeep Group of Schools, Surat | 2018 - 2019

PROJECTS
BCA CAR WALA
- Developed bca car wala system for customer to sell and purchase the car.
- Used core PHP for backend to handle the functionalities between admin, buyer and seller.
- Used HTML, CSS and JQuery for frontend and MySQL database.
- Features secure user authentication, optimized database design, and AJAX interactions.

SBT SYSTEM (School Bus Tracking System)
- Developed tracking system for bus, where students get info like route, location, handler.
- Used core PHP for backend, MySQL for database.
- Used Javascript, CSS and Bootstrap for frontend.
- Enhances convenience and ensures timely updates.

MYBROKER (Real Estate Web Application)
- Developed a comprehensive real estate application for property transaction in Surat city.
- Allows users to buy, sell and rent properties.
- Implemented property management, search functionality, valuation tools.
- Integrated user communication features for direct interaction.

CERTIFICATIONS
- Java Full Stack Certification By SEED Foundation
`;
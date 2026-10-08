require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freelance_marketplace';

const seedClients = [
  {
    name: 'Demo Client',
    email: 'demo.client@freelancehub.com',
    password: 'password123',
    title: 'Hiring Manager at TechBridge Solutions',
    location: 'Lagos, Nigeria',
    bio: 'We build software that helps African SMEs grow. Always looking for reliable freelancers.',
    rating: 4.6,
    totalReviews: 18,
    isVerified: true,
    avatar: 'https://ui-avatars.com/api/?name=Demo+Client&background=1d4ed8&color=fff&size=128&bold=true'
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@novastartup.io',
    password: 'password123',
    title: 'Founder & CEO at NovaStart',
    location: 'San Francisco, USA',
    bio: 'Building the future of personal wellness tech. Funded YC S24 startup, moving fast.',
    rating: 4.9,
    totalReviews: 27,
    isVerified: true,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=7c3aed&color=fff&size=128&bold=true'
  },
  {
    name: "Michael O'Brien",
    email: 'michael.obrien@brightwave.agency',
    password: 'password123',
    title: 'Marketing Director at BrightWave Agency',
    location: 'London, UK',
    bio: 'Full-service digital agency working with fintech and retail clients across Europe.',
    rating: 4.7,
    totalReviews: 41,
    isVerified: true,
    avatar: 'https://ui-avatars.com/api/?name=Michael+OBrien&background=059669&color=fff&size=128&bold=true'
  },
  {
    name: 'Amira Hassan',
    email: 'amira.hassan@shopkora.com',
    password: 'password123',
    title: 'E-commerce Operations Lead at ShopKora',
    location: 'Dubai, UAE',
    bio: 'Scaling an online marketplace across MENA. We hire specialists, not generalists.',
    rating: 4.8,
    totalReviews: 33,
    isVerified: true,
    avatar: 'https://ui-avatars.com/api/?name=Amira+Hassan&background=d97706&color=fff&size=128&bold=true'
  }
];

// clientEmail picks who posted the job. postedDaysAgo controls freshness (can be fractional).
// proposalsCount is a realistic number of bids each listing has attracted.
const seedJobs = [
  // ---------- Web Development ----------
  {
    title: 'Build a React E-commerce Store',
    description: 'Looking for a React developer to build a modern e-commerce storefront with cart, checkout, and Stripe payments. Must have experience with React, Tailwind CSS, and REST APIs.',
    category: 'Web Development',
    skillsRequired: ['React', 'Tailwind CSS', 'Node.js', 'Stripe'],
    budget: { type: 'fixed', min: 1500, max: 3000 },
    duration: '3-4 weeks',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'amira.hassan@shopkora.com',
    postedDaysAgo: 12,
    proposalsCount: 23
  },
  {
    title: 'Full-Stack Blog Platform',
    description: 'Build a full-stack blog platform with user authentication, post creation, comments, and an admin dashboard. Backend with Express and MongoDB, frontend with React.',
    category: 'Web Development',
    skillsRequired: ['React', 'Express', 'MongoDB', 'JWT'],
    budget: { type: 'fixed', min: 2500, max: 4500 },
    duration: '4-6 weeks',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'sarah.chen@novastartup.io',
    postedDaysAgo: 20,
    proposalsCount: 17
  },
  {
    title: 'Next.js Landing Page for Startup',
    description: 'Build a high-converting marketing landing page for a funded startup. Must be fast, SEO-ready, and visually polished. Next.js + Tailwind preferred.',
    category: 'Web Development',
    skillsRequired: ['Next.js', 'Tailwind CSS', 'SEO'],
    budget: { type: 'fixed', min: 1000, max: 2000 },
    duration: '2 weeks',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'sarah.chen@novastartup.io',
    postedDaysAgo: 2,
    proposalsCount: 11
  },
  {
    title: 'Restaurant Website with Online Ordering',
    description: 'Develop a restaurant website with menu display, online ordering, and table reservations. Responsive design and CMS-friendly structure required.',
    category: 'Web Development',
    skillsRequired: ['WordPress', 'PHP', 'JavaScript'],
    budget: { type: 'fixed', min: 700, max: 1500 },
    duration: '3 weeks',
    experienceLevel: 'entry',
    status: 'open',
    clientEmail: 'amira.hassan@shopkora.com',
    postedDaysAgo: 26,
    proposalsCount: 19
  },
  {
    title: 'WordPress Theme Customization',
    description: 'Customize an existing WordPress theme for a corporate client. Adjust layouts, colors, typography, and add custom post types.',
    category: 'Web Development',
    skillsRequired: ['WordPress', 'PHP', 'CSS'],
    budget: { type: 'hourly', min: 15, max: 30 },
    duration: '2-3 weeks',
    experienceLevel: 'entry',
    status: 'open',
    clientEmail: 'amira.hassan@shopkora.com',
    postedDaysAgo: 33,
    proposalsCount: 7
  },
  {
    title: 'Fix React Performance Issues in SaaS Dashboard',
    description: 'Our analytics dashboard has become sluggish with large datasets. Need an experienced React developer to profile and fix re-renders, memoize expensive computations, and get interactions under 100ms.',
    category: 'Web Development',
    skillsRequired: ['React', 'Performance', 'Profiling', 'Redux'],
    budget: { type: 'fixed', min: 400, max: 900 },
    duration: '1 week',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 0.5,
    proposalsCount: 4
  },
  {
    title: 'Migrate Legacy jQuery App to Vue 3',
    description: 'We have a 40k-line jQuery codebase powering our internal CRM. Looking for someone to incrementally migrate it to Vue 3 + Vite while keeping everything working. Experience with large migrations required.',
    category: 'Web Development',
    skillsRequired: ['Vue.js', 'JavaScript', 'Vite', 'Refactoring'],
    budget: { type: 'fixed', min: 4000, max: 7000 },
    duration: '8-10 weeks',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 9,
    proposalsCount: 14
  },
  {
    title: 'Build REST API for Food Delivery Service',
    description: 'Design and build the backend REST API for a food delivery platform: restaurants, menus, orders, riders, and real-time status updates. Node.js/Express/MongoDB. Postman collection as deliverable.',
    category: 'Web Development',
    skillsRequired: ['Node.js', 'Express', 'MongoDB', 'REST API'],
    budget: { type: 'fixed', min: 1800, max: 3500 },
    duration: '4 weeks',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 5,
    proposalsCount: 16
  },
  {
    title: 'Shopify Store Setup & Customization',
    description: 'Set up a new Shopify store for a skincare brand: theme customization, product variants, subscription upsells (Recharge), and Klaviyo integration. Liquid template edits expected.',
    category: 'Web Development',
    skillsRequired: ['Shopify', 'Liquid', 'JavaScript', 'Klaviyo'],
    budget: { type: 'fixed', min: 500, max: 1200 },
    duration: '2 weeks',
    experienceLevel: 'entry',
    status: 'open',
    clientEmail: 'amira.hassan@shopkora.com',
    postedDaysAgo: 1,
    proposalsCount: 9
  },
  {
    title: 'Real-time Collaboration Features (Socket.io)',
    description: 'Add live cursors, presence indicators, and collaborative editing to our project management tool. You will work alongside our in-house team. Strong WebSocket experience required.',
    category: 'Web Development',
    skillsRequired: ['Socket.io', 'Node.js', 'Redis', 'React'],
    budget: { type: 'hourly', min: 30, max: 55 },
    duration: '3 weeks',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'sarah.chen@novastartup.io',
    postedDaysAgo: 17,
    proposalsCount: 12
  },

  // ---------- Mobile Apps ----------
  {
    title: 'iOS Fitness App (React Native)',
    description: 'Build a fitness tracking mobile app with workout plans, progress charts, and push notifications. React Native or Flutter experience needed.',
    category: 'Mobile Apps',
    skillsRequired: ['React Native', 'Flutter', 'Firebase'],
    budget: { type: 'fixed', min: 3000, max: 6000 },
    duration: '6-8 weeks',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'sarah.chen@novastartup.io',
    postedDaysAgo: 10,
    proposalsCount: 34
  },
  {
    title: 'Android Inventory Management App',
    description: 'Create an Android app for small businesses to track inventory, sales, and generate reports. Offline-first with sync to cloud.',
    category: 'Mobile Apps',
    skillsRequired: ['Android', 'Kotlin', 'SQLite'],
    budget: { type: 'fixed', min: 2000, max: 4000 },
    duration: '4 weeks',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 18,
    proposalsCount: 12
  },
  {
    title: 'Cross-platform Booking App (Flutter)',
    description: 'Develop a booking app for a salon chain that works on iOS and Android. Features include calendar scheduling, payments, and staff management across 6 locations.',
    category: 'Mobile Apps',
    skillsRequired: ['Flutter', 'Firebase', 'Stripe'],
    budget: { type: 'fixed', min: 3500, max: 5500 },
    duration: '6 weeks',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'amira.hassan@shopkora.com',
    postedDaysAgo: 7,
    proposalsCount: 26
  },
  {
    title: 'Flutter App Bug Fixes & Optimization',
    description: 'Our Flutter delivery rider app crashes on some Android devices and drains battery. Need someone to fix crashlytics-reported issues, optimize background location tracking, and improve cold start time.',
    category: 'Mobile Apps',
    skillsRequired: ['Flutter', 'Dart', 'Android', 'Crashlytics'],
    budget: { type: 'hourly', min: 25, max: 45 },
    duration: '1-2 weeks',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'amira.hassan@shopkora.com',
    postedDaysAgo: 3,
    proposalsCount: 8
  },
  {
    title: 'React Native Dating App MVP',
    description: 'Build an MVP dating app with swipe matching, in-app chat, photo verification, and geolocation-based discovery. Design files ready in Figma. React Native + Firebase preferred stack.',
    category: 'Mobile Apps',
    skillsRequired: ['React Native', 'Firebase', 'WebSockets', 'Figma'],
    budget: { type: 'fixed', min: 5000, max: 9000 },
    duration: '8-12 weeks',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'sarah.chen@novastartup.io',
    postedDaysAgo: 13,
    proposalsCount: 21
  },
  {
    title: 'Publish & Optimize Android App on Play Store',
    description: 'Help us publish our finished APK to Google Play: developer account setup guidance, store listing copy, screenshots, ASO keywords, and passing review. Small task, fast turnaround needed.',
    category: 'Mobile Apps',
    skillsRequired: ['Google Play Console', 'ASO', 'App Publishing'],
    budget: { type: 'fixed', min: 200, max: 500 },
    duration: 'Less than 1 week',
    experienceLevel: 'entry',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 0.2,
    proposalsCount: 2
  },

  // ---------- Design ----------
  {
    title: 'Mobile App UI Design (Figma)',
    description: 'Need a talented UI/UX designer to create a complete mobile app design in Figma. The app is a fitness tracking application for iOS and Android. Deliverables include wireframes, high-fidelity screens, and a design system.',
    category: 'Design',
    skillsRequired: ['Figma', 'UI/UX', 'Prototyping'],
    budget: { type: 'fixed', min: 800, max: 1200 },
    duration: '2 weeks',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'sarah.chen@novastartup.io',
    postedDaysAgo: 8,
    proposalsCount: 31
  },
  {
    title: 'Brand Identity & Logo Design',
    description: 'Create a complete brand identity for a new coffee brand: logo, color palette, typography, business cards, and social media kit.',
    category: 'Design',
    skillsRequired: ['Illustrator', 'Photoshop', 'Branding'],
    budget: { type: 'fixed', min: 400, max: 900 },
    duration: '10 days',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'sarah.chen@novastartup.io',
    postedDaysAgo: 1,
    proposalsCount: 38
  },
  {
    title: 'Presentation Deck Design (30 Slides)',
    description: 'Design a professional investor pitch deck with 30 slides. Modern, clean layout with charts and infographics. Source files required.',
    category: 'Design',
    skillsRequired: ['PowerPoint', 'Figma', 'Infographics'],
    budget: { type: 'fixed', min: 300, max: 700 },
    duration: '1 week',
    experienceLevel: 'entry',
    status: 'open',
    clientEmail: 'michael.obrien@brightwave.agency',
    postedDaysAgo: 4,
    proposalsCount: 16
  },
  {
    title: 'Website Redesign for Law Firm',
    description: 'Redesign the website of a 40-person law firm to look modern and trustworthy. Deliverables: Figma mockups for desktop/mobile of 6 key pages plus a component library for handoff to developers.',
    category: 'Design',
    skillsRequired: ['Figma', 'Web Design', 'Responsive Design', 'UX Research'],
    budget: { type: 'fixed', min: 1200, max: 2500 },
    duration: '3 weeks',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'michael.obrien@brightwave.agency',
    postedDaysAgo: 11,
    proposalsCount: 13
  },
  {
    title: 'Custom Icon Set (50 Icons)',
    description: 'Design a consistent set of 50 custom line icons for our finance app (transactions, accounts, charts, etc.). Delivered as SVG on a 24px grid with editable strokes.',
    category: 'Design',
    skillsRequired: ['Illustrator', 'SVG', 'Icon Design'],
    budget: { type: 'fixed', min: 300, max: 600 },
    duration: '2 weeks',
    experienceLevel: 'entry',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 6,
    proposalsCount: 10
  },
  {
    title: 'SaaS Landing Page Design in Figma',
    description: 'Design a polished landing page for our AI writing tool. You will get brand guidelines and copy; we need hero section, feature highlights, pricing, testimonials, and footer. Motion specs are a plus.',
    category: 'Design',
    skillsRequired: ['Figma', 'Landing Page', 'UI/UX', 'Motion Design'],
    budget: { type: 'fixed', min: 600, max: 1100 },
    duration: '10 days',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'sarah.chen@novastartup.io',
    postedDaysAgo: 24,
    proposalsCount: 18
  },

  // ---------- Writing ----------
  {
    title: 'SEO Content Writing (10 Articles)',
    description: 'Write 10 SEO-optimized blog articles for a fintech company. Each article 1200-1500 words, keyword research provided. Native English writers preferred.',
    category: 'Writing',
    skillsRequired: ['SEO', 'Copywriting', 'Finance'],
    budget: { type: 'fixed', min: 500, max: 900 },
    duration: '1-2 weeks',
    experienceLevel: 'entry',
    status: 'open',
    clientEmail: 'michael.obrien@brightwave.agency',
    postedDaysAgo: 15,
    proposalsCount: 28
  },
  {
    title: 'Technical Documentation Writer',
    description: 'Write clear developer documentation and API reference guides for a fintech SDK. Must understand REST APIs and markdown.',
    category: 'Writing',
    skillsRequired: ['Technical Writing', 'Markdown', 'APIs'],
    budget: { type: 'hourly', min: 30, max: 50 },
    duration: '3 weeks',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 22,
    proposalsCount: 8
  },
  {
    title: 'Email Newsletter Copywriting',
    description: 'Write weekly email newsletter copy for an ecommerce brand. 6 months of engaging subject lines and body copy that converts.',
    category: 'Writing',
    skillsRequired: ['Copywriting', 'Email Marketing', 'CRO'],
    budget: { type: 'fixed', min: 800, max: 1400 },
    duration: 'Ongoing',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'michael.obrien@brightwave.agency',
    postedDaysAgo: 9,
    proposalsCount: 21
  },
  {
    title: 'Grant Writing for Non-Profit Organization',
    description: 'Experienced grant writer needed to research and apply for 3 foundation grants supporting our youth coding program. Proven track record of awarded grants strongly preferred.',
    category: 'Writing',
    skillsRequired: ['Grant Writing', 'Research', 'Non-profit'],
    budget: { type: 'fixed', min: 700, max: 1500 },
    duration: '3-4 weeks',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 19,
    proposalsCount: 6
  },
  {
    title: 'Product Descriptions for 100 SKUs',
    description: 'Write compelling, SEO-friendly product descriptions for 100 fashion SKUs. 80-120 words each. We provide spec sheets and photos; you make them sell.',
    category: 'Writing',
    skillsRequired: ['Copywriting', 'SEO', 'E-commerce'],
    budget: { type: 'fixed', min: 400, max: 800 },
    duration: '2 weeks',
    experienceLevel: 'entry',
    status: 'open',
    clientEmail: 'amira.hassan@shopkora.com',
    postedDaysAgo: 2,
    proposalsCount: 15
  },
  {
    title: 'YouTube Script Writer (Tech Channel)',
    description: 'Write engaging 8-12 minute video scripts for a tech review channel (150k subscribers). 2 scripts per week. Must study our existing videos to match tone. Long-term collaboration.',
    category: 'Writing',
    skillsRequired: ['Scriptwriting', 'YouTube', 'Storytelling'],
    budget: { type: 'hourly', min: 20, max: 40 },
    duration: 'Ongoing',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 28,
    proposalsCount: 11
  },

  // ---------- Marketing ----------
  {
    title: 'Social Media Marketing Campaign',
    description: 'Run a 30-day social media marketing campaign for a new SaaS product. Create content calendar, manage Instagram/LinkedIn, and report on KPIs.',
    category: 'Marketing',
    skillsRequired: ['Social Media', 'Content Creation', 'Analytics'],
    budget: { type: 'fixed', min: 600, max: 1000 },
    duration: '1 month',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'michael.obrien@brightwave.agency',
    postedDaysAgo: 3,
    proposalsCount: 14
  },
  {
    title: 'Google Ads Campaign Management',
    description: 'Set up and manage Google Ads campaigns for a local real estate agency. Optimize for leads with a monthly budget of $3000.',
    category: 'Marketing',
    skillsRequired: ['Google Ads', 'Analytics', 'Landing Pages'],
    budget: { type: 'fixed', min: 500, max: 900 },
    duration: 'Monthly',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'michael.obrien@brightwave.agency',
    postedDaysAgo: 6,
    proposalsCount: 13
  },
  {
    title: 'Email Marketing Funnel Setup',
    description: 'Build an automated email funnel in Mailchimp/Klaviyo for a D2C brand. Includes welcome series, abandoned cart, and post-purchase flows.',
    category: 'Marketing',
    skillsRequired: ['Klaviyo', 'Mailchimp', 'Automation'],
    budget: { type: 'fixed', min: 400, max: 800 },
    duration: '2 weeks',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'michael.obrien@brightwave.agency',
    postedDaysAgo: 14,
    proposalsCount: 10
  },
  {
    title: 'TikTok Content Strategy & Management',
    description: 'Own our TikTok presence end-to-end: 4 videos per week (we film, you edit/direct), trend-jacking captions, posting schedule, and monthly growth report. Our last video hit 400k views - help us do it consistently.',
    category: 'Marketing',
    skillsRequired: ['TikTok', 'Video Editing', 'Content Strategy', 'CapCut'],
    budget: { type: 'fixed', min: 800, max: 1600 },
    duration: 'Monthly',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'amira.hassan@shopkora.com',
    postedDaysAgo: 5,
    proposalsCount: 19
  },
  {
    title: 'Influencer Outreach Campaign (Fitness Niche)',
    description: 'Identify and negotiate with 20 micro-influencers (10k-100k followers) in the fitness niche for a protein supplement launch. Handle outreach, contracts, and track deliverables.',
    category: 'Marketing',
    skillsRequired: ['Influencer Marketing', 'Negotiation', 'Outreach'],
    budget: { type: 'fixed', min: 500, max: 900 },
    duration: '3 weeks',
    experienceLevel: 'entry',
    status: 'open',
    clientEmail: 'amira.hassan@shopkora.com',
    postedDaysAgo: 8,
    proposalsCount: 12
  },
  {
    title: 'Content Marketing Strategy + Blog Calendar',
    description: 'Audit our existing blog (60 posts), identify gaps versus competitors, and deliver a 6-month content calendar with target keywords and brief outlines for writers.',
    category: 'Marketing',
    skillsRequired: ['Content Strategy', 'SEO', 'Competitor Analysis', 'Ahrefs'],
    budget: { type: 'fixed', min: 1000, max: 2000 },
    duration: '3 weeks',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'michael.obrien@brightwave.agency',
    postedDaysAgo: 21,
    proposalsCount: 9
  },

  // ---------- Data Science ----------
  {
    title: 'Data Analysis Dashboard (Python)',
    description: 'Create an interactive data analytics dashboard in Python for sales data. Use pandas for cleaning and a visualization library for charts. Deliverable is a web-based dashboard with filters.',
    category: 'Data Science',
    skillsRequired: ['Python', 'Pandas', 'Plotly', 'Dash'],
    budget: { type: 'hourly', min: 25, max: 45 },
    duration: '3 weeks',
    experienceLevel: 'entry',
    status: 'open',
    clientEmail: 'michael.obrien@brightwave.agency',
    postedDaysAgo: 5,
    proposalsCount: 9
  },
  {
    title: 'Machine Learning Model (Churn Prediction)',
    description: 'Train and deploy a churn prediction model for a subscription business. Provide accuracy metrics and a simple API endpoint.',
    category: 'Data Science',
    skillsRequired: ['Python', 'Scikit-learn', 'MLflow'],
    budget: { type: 'fixed', min: 2500, max: 4500 },
    duration: '4 weeks',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 16,
    proposalsCount: 15
  },
  {
    title: 'Web Scraping & Data Collection',
    description: 'Build a scraper to collect competitor pricing data from 5 ecommerce sites, run weekly, and export to CSV/Google Sheets.',
    category: 'Data Science',
    skillsRequired: ['Python', 'Scrapy', 'Selenium'],
    budget: { type: 'fixed', min: 900, max: 1600 },
    duration: '3 weeks',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 29,
    proposalsCount: 6
  },
  {
    title: 'SQL Reporting & Dashboard Analyst',
    description: 'Create reusable SQL queries and an automated monthly reporting dashboard for sales performance across regions.',
    category: 'Data Science',
    skillsRequired: ['SQL', 'Tableau', 'Excel'],
    budget: { type: 'hourly', min: 20, max: 40 },
    duration: 'Ongoing',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'demo.client@freelancehub.com',
    postedDaysAgo: 41,
    proposalsCount: 5
  },
  {
    title: 'Time Series Forecasting for Demand Planning',
    description: 'Build demand forecasts for 800+ retail SKUs using historical sales data. Compare Prophet vs classical approaches, backtest accuracy, and deliver predictions via CSV plus a short methodology write-up.',
    category: 'Data Science',
    skillsRequired: ['Python', 'Prophet', 'Time Series', 'Statistics'],
    budget: { type: 'fixed', min: 2200, max: 4000 },
    duration: '4 weeks',
    experienceLevel: 'expert',
    status: 'open',
    clientEmail: 'amira.hassan@shopkora.com',
    postedDaysAgo: 12,
    proposalsCount: 7
  },
  {
    title: 'ETL Pipeline with Apache Airflow',
    description: 'Design and deploy an Airflow DAG pipeline that ingests data from PostgreSQL, Stripe, and HubSpot into our warehouse nightly, with alerting on failures and basic data quality checks.',
    category: 'Data Science',
    skillsRequired: ['Airflow', 'Python', 'PostgreSQL', 'ETL'],
    budget: { type: 'fixed', min: 1500, max: 2800 },
    duration: '3 weeks',
    experienceLevel: 'intermediate',
    status: 'open',
    clientEmail: 'sarah.chen@novastartup.io',
    postedDaysAgo: 23,
    proposalsCount: 8
  },
  {
    title: 'Power BI Sales Dashboard',
    description: 'Build a Power BI dashboard from our SQL Server data showing regional sales, rep leaderboards, and month-over-month trends. Include row-level security by region manager.',
    category: 'Data Science',
    skillsRequired: ['Power BI', 'DAX', 'SQL Server'],
    budget: { type: 'fixed', min: 600, max: 1200 },
    duration: '2 weeks',
    experienceLevel: 'entry',
    status: 'open',
    clientEmail: 'michael.obrien@brightwave.agency',
    postedDaysAgo: 0.8,
    proposalsCount: 3
  }
];

const daysAgoDate = days => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

async function upsertUser({ name, email, password, role = 'client', ...profile }) {
  let user = await User.findOne({ email });
  if (!user) {
    const hashed = await bcrypt.hash(password || 'password123', 10);
    user = await User.create({ name, email, password: hashed, role, ...profile });
    console.log(`Created ${role}:`, email);
  } else {
    const patch = {};
    for (const [key, value] of Object.entries(profile)) {
      if (value !== undefined && value !== null && !user[key]) patch[key] = value;
    }
    if (Object.keys(patch).length) {
      await User.updateOne({ _id: user._id }, { $set: patch });
      console.log(`Updated ${role} profile fields:`, email);
    } else {
      console.log(`${role} already exists:`, email);
    }
  }
  return user;
}

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
  .then(async () => {
    console.log('Connected. Seeding...');

    const clientMap = {};
    for (const c of seedClients) {
      const user = await upsertUser(c);
      clientMap[c.email] = user;
    }

    let added = 0;
    let refreshed = 0;
    for (const { clientEmail, postedDaysAgo = 1, proposalsCount = 0, ...data } of seedJobs) {
      const client = clientMap[clientEmail] || clientMap['demo.client@freelancehub.com'];
      const createdAt = daysAgoDate(postedDaysAgo);
      const existing = await Job.findOne({ title: data.title });
      if (existing) {
        // Refresh realism fields on previously seeded jobs without touching user-created ones
        await Job.updateOne(
          { _id: existing._id },
          { $set: { proposalsCount, createdAt } },
          { overwriteImmutable: true }
        );
        refreshed++;
        continue;
      }
      await Job.create({ ...data, client: client._id, proposalsCount, createdAt });
      added++;
    }

    console.log(`Added ${added} new jobs, refreshed ${refreshed}. Total jobs:`, await Job.countDocuments());
    process.exit(0);
  })
  .catch(err => { console.error('FAILED:', err); process.exit(1); });

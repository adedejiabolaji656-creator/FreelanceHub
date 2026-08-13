require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');

const seedJobs = [
  {
    title: 'Build a React E-commerce Store',
    description: 'Looking for a React developer to build a modern e-commerce storefront with cart, checkout, and Stripe payments. Must have experience with React, Tailwind CSS, and REST APIs.',
    category: 'Web Development',
    skillsRequired: ['React', 'Tailwind CSS', 'Node.js', 'Stripe'],
    budget: { type: 'fixed', min: 1500, max: 3000 },
    duration: '3-4 weeks',
    experienceLevel: 'intermediate',
    status: 'open'
  },
  {
    title: 'Mobile App UI Design (Figma)',
    description: 'Need a talented UI/UX designer to create a complete mobile app design in Figma. The app is a fitness tracking application for iOS and Android. Deliverables include wireframes, high-fidelity screens, and a design system.',
    category: 'Design',
    skillsRequired: ['Figma', 'UI/UX', 'Prototyping'],
    budget: { type: 'fixed', min: 800, max: 1200 },
    duration: '2 weeks',
    experienceLevel: 'expert',
    status: 'open'
  },
  {
    title: 'Full-Stack Blog Platform',
    description: 'Build a full-stack blog platform with user authentication, post creation, comments, and an admin dashboard. Backend with Express and MongoDB, frontend with React.',
    category: 'Web Development',
    skillsRequired: ['React', 'Express', 'MongoDB', 'JWT'],
    budget: { type: 'fixed', min: 2500, max: 4500 },
    duration: '4-6 weeks',
    experienceLevel: 'intermediate',
    status: 'open'
  },
  {
    title: 'Data Analysis Dashboard (Python)',
    description: 'Create an interactive data analytics dashboard in Python for sales data. Use pandas for cleaning and a visualization library for charts. Deliverable is a web-based dashboard with filters.',
    category: 'Data Science',
    skillsRequired: ['Python', 'Pandas', 'Plotly', 'Dash'],
    budget: { type: 'hourly', min: 25, max: 45 },
    duration: '3 weeks',
    experienceLevel: 'entry',
    status: 'open'
  },
  {
    title: 'SEO Content Writing (10 Articles)',
    description: 'Write 10 SEO-optimized blog articles for a fintech company. Each article 1200-1500 words, keyword research provided. Native English writers preferred.',
    category: 'Writing',
    skillsRequired: ['SEO', 'Copywriting', 'Finance'],
    budget: { type: 'fixed', min: 500, max: 900 },
    duration: '1-2 weeks',
    experienceLevel: 'entry',
    status: 'open'
  },
  {
    title: 'Social Media Marketing Campaign',
    description: 'Run a 30-day social media marketing campaign for a new SaaS product. Create content calendar, manage Instagram/LinkedIn, and report on KPIs.',
    category: 'Marketing',
    skillsRequired: ['Social Media', 'Content Creation', 'Analytics'],
    budget: { type: 'fixed', min: 600, max: 1000 },
    duration: '1 month',
    experienceLevel: 'intermediate',
    status: 'open'
  },
  {
    title: 'Next.js Landing Page for Startup',
    description: 'Build a high-converting marketing landing page for a funded startup. Must be fast, SEO-ready, and visually polished. Next.js + Tailwind preferred.',
    category: 'Web Development',
    skillsRequired: ['Next.js', 'Tailwind CSS', 'SEO'],
    budget: { type: 'fixed', min: 1000, max: 2000 },
    duration: '2 weeks',
    experienceLevel: 'intermediate',
    status: 'open'
  },
  {
    title: 'Restaurant Website with Online Ordering',
    description: 'Develop a restaurant website with menu display, online ordering, and table reservations. Responsive design and CMS-friendly structure required.',
    category: 'Web Development',
    skillsRequired: ['WordPress', 'PHP', 'JavaScript'],
    budget: { type: 'fixed', min: 700, max: 1500 },
    duration: '3 weeks',
    experienceLevel: 'entry',
    status: 'open'
  },
  {
    title: 'WordPress Theme Customization',
    description: 'Customize an existing WordPress theme for a corporate client. Adjust layouts, colors, typography, and add custom post types.',
    category: 'Web Development',
    skillsRequired: ['WordPress', 'PHP', 'CSS'],
    budget: { type: 'hourly', min: 15, max: 30 },
    duration: '2-3 weeks',
    experienceLevel: 'entry',
    status: 'open'
  },
  {
    title: 'iOS Fitness App (React Native)',
    description: 'Build a fitness tracking mobile app with workout plans, progress charts, and push notifications. React Native or Flutter experience needed.',
    category: 'Mobile Apps',
    skillsRequired: ['React Native', 'Flutter', 'Firebase'],
    budget: { type: 'fixed', min: 3000, max: 6000 },
    duration: '6-8 weeks',
    experienceLevel: 'expert',
    status: 'open'
  },
  {
    title: 'Android Inventory Management App',
    description: 'Create an Android app for small businesses to track inventory, sales, and generate reports. Offline-first with sync to cloud.',
    category: 'Mobile Apps',
    skillsRequired: ['Android', 'Kotlin', 'SQLite'],
    budget: { type: 'fixed', min: 2000, max: 4000 },
    duration: '4 weeks',
    experienceLevel: 'intermediate',
    status: 'open'
  },
  {
    title: 'Cross-platform Booking App (Flutter)',
    description: 'Develop a booking app for a salon that works on iOS and Android. Features include calendar scheduling, payments, and staff management.',
    category: 'Mobile Apps',
    skillsRequired: ['Flutter', 'Firebase', 'Stripe'],
    budget: { type: 'fixed', min: 3500, max: 5500 },
    duration: '6 weeks',
    experienceLevel: 'expert',
    status: 'open'
  },
  {
    title: 'Brand Identity & Logo Design',
    description: 'Create a complete brand identity for a new coffee brand: logo, color palette, typography, business cards, and social media kit.',
    category: 'Design',
    skillsRequired: ['Illustrator', 'Photoshop', 'Branding'],
    budget: { type: 'fixed', min: 400, max: 900 },
    duration: '10 days',
    experienceLevel: 'intermediate',
    status: 'open'
  },
  {
    title: 'Presentation Deck Design (30 Slides)',
    description: 'Design a professional investor pitch deck with 30 slides. Modern, clean layout with charts and infographics. Source files required.',
    category: 'Design',
    skillsRequired: ['PowerPoint', 'Figma', 'Infographics'],
    budget: { type: 'fixed', min: 300, max: 700 },
    duration: '1 week',
    experienceLevel: 'entry',
    status: 'open'
  },
  {
    title: 'Technical Documentation Writer',
    description: 'Write clear developer documentation and API reference guides for a fintech SDK. Must understand REST APIs and markdown.',
    category: 'Writing',
    skillsRequired: ['Technical Writing', 'Markdown', 'APIs'],
    budget: { type: 'hourly', min: 30, max: 50 },
    duration: '3 weeks',
    experienceLevel: 'expert',
    status: 'open'
  },
  {
    title: 'Email Newsletter Copywriting',
    description: 'Write weekly email newsletter copy for an ecommerce brand. 6 months of engaging subject lines and body copy that converts.',
    category: 'Writing',
    skillsRequired: ['Copywriting', 'Email Marketing', 'CRO'],
    budget: { type: 'fixed', min: 800, max: 1400 },
    duration: 'Ongoing',
    experienceLevel: 'intermediate',
    status: 'open'
  },
  {
    title: 'Google Ads Campaign Management',
    description: 'Set up and manage Google Ads campaigns for a local real estate agency. Optimize for leads with a monthly budget of $3000.',
    category: 'Marketing',
    skillsRequired: ['Google Ads', 'Analytics', 'Landing Pages'],
    budget: { type: 'fixed', min: 500, max: 900 },
    duration: 'Monthly',
    experienceLevel: 'expert',
    status: 'open'
  },
  {
    title: 'Email Marketing Funnel Setup',
    description: 'Build an automated email funnel in Mailchimp/Klaviyo for a D2C brand. Includes welcome series, abandoned cart, and post-purchase flows.',
    category: 'Marketing',
    skillsRequired: ['Klaviyo', 'Mailchimp', 'Automation'],
    budget: { type: 'fixed', min: 400, max: 800 },
    duration: '2 weeks',
    experienceLevel: 'intermediate',
    status: 'open'
  },
  {
    title: 'Machine Learning Model (Churn Prediction)',
    description: 'Train and deploy a churn prediction model for a subscription business. Provide accuracy metrics and a simple API endpoint.',
    category: 'Data Science',
    skillsRequired: ['Python', 'Scikit-learn', 'MLflow'],
    budget: { type: 'fixed', min: 2500, max: 4500 },
    duration: '4 weeks',
    experienceLevel: 'expert',
    status: 'open'
  },
  {
    title: 'Web Scraping & Data Collection',
    description: 'Build a scraper to collect competitor pricing data from 5 ecommerce sites, run weekly, and export to CSV/Google Sheets.',
    category: 'Data Science',
    skillsRequired: ['Python', 'Scrapy', 'Selenium'],
    budget: { type: 'fixed', min: 900, max: 1600 },
    duration: '3 weeks',
    experienceLevel: 'intermediate',
    status: 'open'
  },
  {
    title: 'SQL Reporting & Dashboard Analyst',
    description: 'Create reusable SQL queries and an automated monthly reporting dashboard for sales performance across regions.',
    category: 'Data Science',
    skillsRequired: ['SQL', 'Tableau', 'Excel'],
    budget: { type: 'hourly', min: 20, max: 40 },
    duration: 'Ongoing',
    experienceLevel: 'intermediate',
    status: 'open'
  }
];

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
  .then(async () => {
    let client = await User.findOne({ email: 'demo.client@freelancehub.com' });
    if (!client) {
      const hashed = await bcrypt.hash('password123', 10);
      client = new User({
        name: 'Demo Client',
        email: 'demo.client@freelancehub.com',
        password: hashed,
        role: 'client',
        title: 'Hiring Manager',
        location: 'Lagos, Nigeria'
      });
      await client.save();
      console.log('Created demo client:', client.email);
    } else {
      console.log('Demo client already exists');
    }

    let added = 0;
    for (const data of seedJobs) {
      const exists = await Job.findOne({ title: data.title });
      if (exists) {
        console.log('Skipped (exists):', data.title);
        continue;
      }
      await Job.create({ ...data, client: client._id });
      added++;
    }
    console.log(`Added ${added} new jobs. Total jobs:`, await Job.countDocuments());
    process.exit(0);
  })
  .catch(err => { console.error('FAILED:', err); process.exit(1); });
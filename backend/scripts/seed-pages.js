import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Page from '../models/Page.model.js'

dotenv.config()

const seedPages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudintellect')
    console.log('✅ Connected to MongoDB')

    const pages = [
      {
        slug: 'home',
        title: 'Home',
        description: 'Homepage of Cloud Intellect',
        navbarLabel: 'Home',
        showInNavbar: true,
        navbarOrder: 1,
        order: 1,
        isActive: true,
        content: {}
      },
      {
        slug: 'about',
        title: 'About Us',
        description: 'About Cloud Intellect',
        navbarLabel: 'About',
        showInNavbar: true,
        navbarOrder: 2,
        order: 2,
        isActive: true,
        content: {}
      },
      {
        slug: 'why-choose-us',
        title: 'Why Choose Us',
        description: 'Why choose Cloud Intellect',
        navbarLabel: 'Why Choose Us',
        showInNavbar: true,
        navbarOrder: 3,
        order: 3,
        isActive: true,
        content: {}
      },
      {
        slug: 'salesforce-developer',
        title: 'Salesforce Developer',
        description: 'Salesforce Developer Course',
        navbarLabel: 'SFDC',
        showInNavbar: true,
        navbarOrder: 4,
        order: 4,
        isActive: true,
        content: {}
      },
      {
        slug: 'salesforce-marketing-cloud',
        title: 'Salesforce Marketing Cloud',
        description: 'Salesforce Marketing Cloud Course',
        navbarLabel: 'SFMC',
        showInNavbar: true,
        navbarOrder: 5,
        order: 5,
        isActive: true,
        content: {}
      },
      {
        slug: 'sfmc-sfdc',
        title: 'SFMC & SFDC',
        description: 'SFMC and SFDC Combined Course',
        navbarLabel: 'SFMC & SFDC',
        showInNavbar: true,
        navbarOrder: 6,
        order: 6,
        isActive: true,
        content: {}
      },
      {
        slug: 'alumni-success',
        title: 'Alumni Success',
        description: 'Alumni Success Stories',
        navbarLabel: 'Alumni',
        showInNavbar: true,
        navbarOrder: 7,
        order: 7,
        isActive: true,
        content: {}
      },
      {
        slug: 'webinars',
        title: 'Webinars',
        description: 'Upcoming Webinars',
        navbarLabel: 'Webinars',
        showInNavbar: true,
        navbarOrder: 8,
        order: 8,
        isActive: true,
        content: {}
      },
      {
        slug: 'placements',
        title: 'Placements',
        description: 'Student Placements and Career Outcomes',
        navbarLabel: 'Placements',
        showInNavbar: true,
        navbarOrder: 9,
        order: 9,
        isActive: true,
        content: {
          hero: {
            tag: '100% PLACEMENT SUPPORT',
            heading: 'Our Students Work at Top Companies.',
            description: 'Meet our recent students now working in real Salesforce roles at leading companies.',
            backgroundImage: '/images/BG (1).webp',
            primaryButtonText: 'Explore Programs',
            primaryButtonHref: '#programs',
            secondaryButtonText: 'View Placements',
            secondaryButtonHref: '#placements'
          },
          stats: {
            stats: [
              { value: '5000+', label: 'Learners Trained' },
              { value: '1400+', label: 'Placed' },
              { value: '90%', label: 'Satisfaction' },
              { value: '100%', label: 'Compliance' }
            ]
          }
        }
      },
      {
        slug: 'gallery',
        title: 'Gallery',
        description: 'Life at Cloud Intellect - Gallery',
        navbarLabel: 'Gallery',
        showInNavbar: true,
        navbarOrder: 10,
        order: 10,
        isActive: true,
        content: {
          hero: {
            tag: 'GLIMPSE OF OUR CAMPUS',
            heading: 'Life at Cloud Intellect',
            description: 'A glimpse into our vibrant learning ecosystem. From intense classroom sessions to celebratory moments, see what makes our community special.',
            backgroundImage: '/images/BG (2).webp',
            primaryButtonText: 'Explore Programs',
            primaryButtonHref: '#programs',
            secondaryButtonText: 'View Placements',
            secondaryButtonHref: '#placements'
          }
        }
      },
      {
        slug: 'testimonials',
        title: 'Testimonials',
        description: 'Real Stories. Real Careers.',
        navbarLabel: 'Testimonials',
        showInNavbar: true,
        navbarOrder: 11,
        order: 11,
        isActive: true,
        content: {
          hero: {
            tag: 'SPECIALIZATION PROGRAM',
            heading: 'Real Stories. Real Careers.',
            description: 'These are real students from Cloud Intellect who started from different backgrounds and built their careers in Salesforce.',
            backgroundImage: '/images/BG (2).webp',
            primaryButtonText: 'Explore Programs',
            primaryButtonHref: '#programs',
            secondaryButtonText: 'View Placements',
            secondaryButtonHref: '#placements'
          },
          beNextSuccessStory: {
            heading: 'Be Our Next Success Story',
            description: 'Join 5000+ learners who have successfully transitioned into the Salesforce ecosystem. Your journey starts here.',
            buttonText: 'Apply Today',
            buttonHref: '#apply'
          }
        }
      },
      {
        slug: 'leadership',
        title: 'Leadership',
        description: 'Leadership at Cloud Intellect',
        navbarLabel: 'Leadership',
        showInNavbar: false,
        navbarOrder: 0,
        order: 13,
        isActive: true,
        content: {
          hero: {
            tag: 'LEADERSHIP MESSAGE',
            heading: 'Leadership at',
            headingAccent: 'Cloud Intellect',
            description: 'Vision-driven leadership backed by real industry experience.',
            primaryButtonText: 'Explore Programs',
            primaryButtonHref: '#programs',
            secondaryButtonText: 'Download Brochure',
            secondaryButtonHref: '#brochure',
            backgroundImage: '/images/BG (7).webp',
            bgImage: '/images/BG (7).webp'
          }
        }
      },
      {
        slug: 'contact',
        title: 'Contact Us',
        description: 'Get in touch with Cloud Intellect',
        navbarLabel: 'Contact',
        showInNavbar: true,
        navbarOrder: 12,
        order: 12,
        isActive: true,
        content: {
          hero: {
            tag: 'GET IN TOUCH',
            heading: 'Start Your Journey With Cloud Intellect',
            description: 'Whether you have questions about our courses, placements, or just want to say hello, we\'re here to help you navigate your Salesforce career.',
            backgroundImage: '/images/BG (2).webp',
            primaryButtonText: 'Explore Programs',
            primaryButtonHref: '#programs',
            secondaryButtonText: 'View Placements',
            secondaryButtonHref: '#placements'
          },
          contactInfo: {
            email: 'info@cloudintellect.in',
            phoneNumbers: [
              { number: '+91 876-699-6944', label: 'Call Us' },
              { number: '+91 876-699-6945', label: 'Call Us' }
            ],
            programs: ['SFDC', 'SFMC'],
            mapEmbedUrl: ''
          },
          locations: {
            locations: [
              {
                city: 'Pune',
                address: '3rd floor block 306, Baner Biz Bay, Laxman Nagar, Baner, Pune, Maharashtra 411045',
                mapUrl: ''
              },
              {
                city: 'Nagpur',
                address: 'Cloud Intellect, Plot no. 5, Sanjay Heights, Beltarodi Rd, near ICICI Bank, Besa, Nagpur, Maharashtra 440037',
                mapUrl: ''
              }
            ]
          }
        }
      },
      {
        slug: 'landing',
        title: 'Landing Page',
        description: 'Standalone landing page (no header/footer)',
        navbarLabel: '',
        showInNavbar: false,
        navbarOrder: 0,
        order: 99,
        isActive: true,
        content: {
          hero: {
            backgroundImage: '',
            topBar: {
              logoUrl: '/images/Logo (1).webp',
              tagline: 'IT Training | Placements | Consulting',
              phone: '8766996944',
              contactButtonText: 'Contact Us',
              contactButtonHref: '/contact'
            },
            eventBar: {
              date: '8th November',
              time: '08:30 AM'
            },
            headline: 'Become a Salesforce Developer in 90 Days & Land a ₹5-22 LPA IT Job.',
            headlineAccent1: '90 Days',
            headlineAccent2: '₹5-22 LPA IT Job',
            subHeadline: 'Even if You\'re from Non-IT.',
            supportingText: 'Join 1200+ students who transformed their career with Salesforce. Live Masterclass + Guaranteed Placement Assistance.',
            stats: [
              { value: '2000+', label: 'Students Placed' },
              { value: '200+', label: 'Hiring Partners' },
              { value: '₹8 LPA', label: 'Avg Salary' }
            ],
            video: {
              thumbnailUrl: '',
              videoUrl: ''
            },
            cta: {
              buttonText: 'Register for a free 3-day Masterclass',
              buttonTextAccent: '3-day Masterclass',
              buttonHref: '#register'
            }
          }
        }
      }
    ]

    // Clear existing pages
    await Page.deleteMany({})
    console.log('🗑️  Cleared existing pages')

    // Insert pages
    await Page.insertMany(pages)
    console.log(`✅ Seeded ${pages.length} pages`)

    console.log('🎉 Pages seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding pages:', error)
    process.exit(1)
  }
}

seedPages()

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Alumni from '../models/Alumni.model.js'
import Batch from '../models/Batch.model.js'
import SuccessStory from '../models/SuccessStory.model.js'
import WebinarTopic from '../models/WebinarTopic.model.js'
import WhoShouldAttend from '../models/WhoShouldAttend.model.js'
import User from '../models/User.model.js'

dotenv.config()

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudintellect')
    console.log('✅ Connected to MongoDB')

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Alumni.deleteMany({})
    await Batch.deleteMany({})
    await SuccessStory.deleteMany({})
    await WebinarTopic.deleteMany({})
    await WhoShouldAttend.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Seed Alumni
    const alumniData = [
      {
        name: 'Shivam Armarkar',
        company: 'Cognizant',
        specialization: 'SF MARKETING CLOUD',
        description: 'Shivam strengthened his Marketing Cloud skills through structured training and hands-on projects. He now works on campaign execution and automation workflows for enterprise clients.',
        image: '/images/Alumni/Icon Background.webp',
        order: 1
      },
      {
        name: 'Shubham Khanorkar',
        company: 'Meta Cube, Jaipur',
        specialization: 'SALESFORCE DEVELOPER',
        description: 'Shubham transitioned into Salesforce development with focused training and practical exposure. He is now working on real-world implementations and custom solutions.',
        image: '/images/Alumni/Icon Background-1.webp',
        order: 2
      },
      {
        name: 'Vaibhav Kawate',
        company: 'Deloitte',
        specialization: 'SF MARKETING CLOUD',
        description: 'With focused training and practical exposure, Vaibhav built strong expertise in Marketing Cloud. He now delivers Salesforce solutions for large organizations.',
        image: '/images/Alumni/Icon Background-2.webp',
        order: 3
      }
    ]
    await Alumni.insertMany(alumniData)
    console.log('✅ Seeded Alumni data')

    // Seed Batches
    const batchesData = [
      {
        id: 'sfdc',
        icon: '/images/Icon Container.svg',
        bannerBg: '#1A202C',
        title: 'Salesforce Developer Cloud (SFDC)',
        description: 'Build apps, automate business processes & work with real CRM development tools used by global companies.',
        batchStart: '17th January',
        nextBatch: '31st January',
        linkText: 'Learn Salesforce Development',
        linkHref: '/salesforce-developer',
        isOpen: true
      },
      {
        id: 'sfmc',
        icon: '/images/Icon Container copy.svg',
        bannerBg: '#007BFF',
        title: 'Salesforce Marketing Cloud (SFMC)',
        description: 'Master email journeys, automations, segmentation & AI-powered marketing used by top global brands.',
        batchStart: '18th January',
        nextBatch: '1st February',
        linkText: 'Explore Marketing Cloud Career',
        linkHref: '/salesforce-marketing-cloud',
        isOpen: true
      }
    ]
    await Batch.insertMany(batchesData)
    console.log('✅ Seeded Batches data')

    // Seed Success Stories
    const successStoriesData = [
      {
        name: 'Ganesh More',
        time: '1 year ago',
        profileImage: '/images/More_Students/Profile Image.webp',
        rating: 5,
        text: 'For those aspiring to kickstart their careers in the IT field, I highly recommend joining Cloud Intellect. The trainers adapt their teaching to your learning pace, addressing every doubt.',
        readMoreUrl: '#',
        order: 1
      },
      {
        name: 'Saurabh Ganvir',
        time: '1 year ago',
        profileImage: '/images/More_Students/Profile Image-1.webp',
        rating: 5,
        text: 'The teaching was excellent. Training session was outstanding! The knowledge of the subject matter was evident, and you delivered the material in a way that was easy to understand.',
        readMoreUrl: '#',
        order: 2
      }
    ]
    await SuccessStory.insertMany(successStoriesData)
    console.log('✅ Seeded Success Stories data')

    // Seed Webinar Topics
    const webinarTopicsData = [
      {
        title: 'Real-World Scenarios',
        description: 'Learn from actual project examples and case studies',
        icon: '/images/Weninar_Cover/assignment_globe.svg',
        order: 1
      },
      {
        title: 'SFDC SFMC',
        description: 'Comprehensive overview of both Salesforce platforms',
        icon: '/images/Weninar_Cover/cloud.svg',
        order: 2
      }
    ]
    await WebinarTopic.insertMany(webinarTopicsData)
    console.log('✅ Seeded Webinar Topics data')

    // Seed Who Should Attend
    const whoShouldAttendData = [
      {
        title: 'Students',
        description: 'Perfect for students looking to start their career',
        icon: '/images/Webinar_Attend/school.svg',
        order: 1
      },
      {
        title: 'Professionals',
        description: 'For professionals seeking career advancement',
        icon: '/images/Webinar_Attend/business.svg',
        order: 2
      }
    ]
    await WhoShouldAttend.insertMany(whoShouldAttendData)
    console.log('✅ Seeded Who Should Attend data')

    // Create default admin user (if doesn't exist)
    const adminExists = await User.findOne({ email: 'admin@cloudintellect.com' })
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@cloudintellect.com',
        password: 'admin123', // Change this in production!
        role: 'admin'
      })
      console.log('✅ Created default admin user (admin@cloudintellect.com / admin123)')
    } else {
      console.log('ℹ️  Admin user already exists')
    }

    console.log('🎉 Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seedData()

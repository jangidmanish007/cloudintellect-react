import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.model.js'

dotenv.config()

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudintellect')
    console.log('✅ Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@cloudintellect.com' })
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists')
      console.log('Email:', existingAdmin.email)
      console.log('Username:', existingAdmin.username)
      console.log('Role:', existingAdmin.role)
      console.log('Is Active:', existingAdmin.isActive)
      process.exit(0)
    }

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@cloudintellect.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    })

    console.log('✅ Admin user created successfully!')
    console.log('Email:', admin.email)
    console.log('Username:', admin.username)
    console.log('Password: admin123')
    console.log('Role:', admin.role)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin:', error.message)
    process.exit(1)
  }
}

createAdmin()

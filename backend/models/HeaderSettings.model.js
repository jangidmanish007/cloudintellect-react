import mongoose from 'mongoose'

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['facebook', 'linkedin', 'youtube', 'instagram', 'twitter']
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false })

const dropdownItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  href: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false })

const navItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  href: {
    type: String,
    required: true,
    trim: true
  },
  hasDropdown: {
    type: Boolean,
    default: false
  },
  dropdownItems: [dropdownItemSchema],
  showOnHomePageOnly: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false })

const headerSettingsSchema = new mongoose.Schema({
  // Top Bar Settings
  registerButton: {
    text: {
      type: String,
      default: 'REGISTER NOW',
      trim: true
    },
    link: {
      type: String,
      default: '#',
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  whatsapp: {
    text: {
      type: String,
      default: 'WhatsApp',
      trim: true
    },
    link: {
      type: String,
      default: '#',
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  callUs: {
    text: {
      type: String,
      default: 'Call Us',
      trim: true
    },
    link: {
      type: String,
      default: '#',
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  socialLinks: [socialLinkSchema],

  // Main Navigation Settings
  mainNavItems: [navItemSchema],
  loginButton: {
    text: {
      type: String,
      default: 'Login Portals',
      trim: true
    },
    link: {
      type: String,
      default: '#',
      trim: true
    },
    hasDropdown: {
      type: Boolean,
      default: false
    },
    dropdownItems: [dropdownItemSchema],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  helpline: {
    label: {
      type: String,
      default: 'Admission Helpline',
      trim: true
    },
    phoneNumber: {
      type: String,
      default: '+91 8766 9969 44',
      trim: true
    },
    link: {
      type: String,
      default: '#',
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },

  // Secondary Navigation Settings
  secondaryNavItems: [navItemSchema]
}, {
  timestamps: true
})

// Ensure only one document exists
headerSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne()
  if (!settings) {
    settings = await this.create({})
  }
  return settings
}

const HeaderSettings = mongoose.model('HeaderSettings', headerSettingsSchema)

export default HeaderSettings

// ─── Static Navigation Data ──────────────────────────────────────────────────

export const topBar = {
  registerButton: { text: 'REGISTER NOW', link: '/register' },
  whatsapp: { text: 'WhatsApp', link: 'https://wa.me/918766996944' },
  callUs: { text: 'Call Us', link: 'tel:+918766996944' },
  socialLinks: [
    { platform: 'facebook', url: 'https://facebook.com/cloudintellect' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/cloudintellect' },
    { platform: 'youtube', url: 'https://youtube.com/@cloudintellect' },
    { platform: 'instagram', url: 'https://instagram.com/cloudintellect' },
  ],
};

export const mainNav = [
  { label: 'ECOSYSTEM', href: '/#ecosystem' },
  { label: 'COURSE', href: '/#course' },
  { label: 'PLACEMENT', href: '/#placement' },
  { label: 'SUCCESS STORIES', href: '/#success-stories' },
  { label: 'REVIEWS', href: '/#reviews' },
  { label: 'NEWS AND EVENTS', href: '/#news' },
];

export const loginButton = {
  text: 'Login Portals',
  link: '/login',
  dropdownItems: [
    { label: 'Student Portal', href: '/login/student' },
    { label: 'Admin Portal', href: '/login/admin' },
  ],
};

export const helpline = {
  label: 'Admission Helpline',
  phoneNumber: '+91 8766 9969 44',
  link: 'tel:+918766996944',
};

export const secondaryNav = [
  {
    label: 'ABOUT US',
    href: '/about-us',
    children: [
      { label: 'About Cloud Intellect', href: '/about-us' },
      { label: 'Leadership', href: '/about-us/leadership' },
      { label: 'Our Mission', href: '/about-us#mission' },
    ],
  },
  {
    label: 'COURSES',
    href: '/courses',
    children: [
      { label: 'Salesforce Administrator', href: '/courses/salesforce-administrator' },
      { label: 'Salesforce Developer', href: '/courses/salesforce-developer' },
      { label: 'Salesforce + AI', href: '/courses/salesforce-ai' },
      { label: 'Marketing Cloud', href: '/courses/marketing-cloud' },
    ],
  },
  { label: 'BLOG', href: '/blog' },
  { label: 'TESTIMONIALS', href: '/testimonials' },
  {
    label: 'PLACEMENT',
    href: '/placement',
    children: [
      { label: 'Placement Overview', href: '/placement' },
      { label: 'Alumni', href: '/placement/alumni' },
      { label: 'Success Stories', href: '/placement/success-stories' },
    ],
  },
  { label: 'WEBINAR', href: '/webinar' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'CONTACT US', href: '/contact-us' },
];

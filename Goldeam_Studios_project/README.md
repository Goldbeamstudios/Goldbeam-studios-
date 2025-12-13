# Goldbeam Studios Website

A modern, beautiful, and fully responsive podcast studio website built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Modern Design**: Dark theme with gold/amber accents matching the Goldbeam brand
- **Fully Responsive**: Perfect experience on all devices (mobile, tablet, desktop)
- **Smooth Animations**: Beautiful transitions, scroll animations, and interactive effects
- **Fast Performance**: Built with Vite for lightning-fast development and optimized production builds
- **Type-Safe**: TypeScript for reliability and maintainability
- **SEO-Friendly**: Optimized structure for search engines

## 📄 Pages

1. **Home** - Hero section, features, pricing preview, and trust indicators
2. **How It Works** - Step-by-step process from booking to delivery
3. **Pricing** - Transparent pricing plans and add-on services
4. **Studios** - Detailed studio information with virtual tour
5. **Book a Session** - Square payment integration for bookings
6. **Build** - Technology stack and development timeline
7. **More** - Quick links and comprehensive information hub
8. **Contact** - Contact form and location information
9. **FAQs** - Frequently asked questions with collapsible sections
10. **Resources/Blog** - Blog posts, guides, and podcasting tips

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.17
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite 7.2.4
- **Animations**: Custom CSS animations + Tailwind transitions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The development server will start at `http://localhost:5173`

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/         # Reusable components
│   ├── ui/            # shadcn/ui components
│   ├── Navbar.tsx     # Navigation component
│   └── Footer.tsx     # Footer component
├── pages/             # Page components
│   ├── Home.tsx
│   ├── HowItWorks.tsx
│   ├── Pricing.tsx
│   ├── Studios.tsx
│   ├── Book.tsx
│   ├── Build.tsx
│   ├── More.tsx
│   ├── Contact.tsx
│   ├── FAQs.tsx
│   └── Resources.tsx
├── lib/               # Utility functions
├── assets/            # Images and static assets
├── App.tsx            # Main app component with routing
├── main.tsx           # App entry point
└── index.css          # Global styles and animations
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Amber/Gold (#f59e0b, #d97706)
- **Background**: Pure Black (#000000)
- **Text**: White (#ffffff) and Gray variations
- **Accents**: Amber gradients for CTAs and highlights

### Animations
- Fade-in effects on scroll
- Smooth hover transitions
- Gradient animations
- Pulse effects for live indicators
- Transform effects on cards and buttons

### Typography
- Clean, modern sans-serif fonts
- Bold uppercase headings
- Excellent readability with proper contrast

## 🔧 Customization

### Changing Brand Colors

Edit `src/index.css` to modify the color scheme:

```css
.dark {
  --primary: oklch(0.75 0.15 75); /* Amber/Gold */
  --background: oklch(0.05 0 0);  /* Black */
  /* ... other color variables */
}
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Update navigation in `src/components/Navbar.tsx`

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔌 Integration Points

### Square Payment Integration
The booking page (`src/pages/Book.tsx`) includes a placeholder for Square's booking and payment widget. Replace the placeholder with your Square integration code.

### Supabase Backend (Future)
Ready for Supabase integration for:
- Blog post management
- Contact form submissions
- User authentication
- Booking data storage

## 🚢 Deployment

### Recommended: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Alternative: Netlify, GitHub Pages, or any static hosting

```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## 📝 Future Enhancements

- [ ] Admin dashboard for blog management
- [ ] Supabase backend integration
- [ ] Square booking widget integration
- [ ] Email notification system
- [ ] Analytics integration
- [ ] Social media feed integration
- [ ] Customer testimonials section
- [ ] Advanced animation library (Framer Motion)

## 🤝 Contributing

This is a custom project for Goldbeam Studios. For modifications or enhancements, please contact the development team.

## 📄 License

Copyright © 2024 Goldbeam Studios. All rights reserved.

## 🙏 Acknowledgments

- Design inspiration from modern podcast studios
- UI components from shadcn/ui
- Icons from Lucide React
- Images from Unsplash (placeholder images)

---

**Built with ❤️ for content creators**

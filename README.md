# Neha Negi - Portfolio Website

A modern, minimalist portfolio website for Neha Negi, a Taxation & Legal Associate specializing in accounting, taxation, and corporate law.

## 🌟 Features

### Design & Layout
- **Modern Minimalist Design**: Clean, professional layout with pastel color palette
- **Responsive Design**: Fully responsive across all devices (desktop, tablet, mobile)
- **Smooth Animations**: Subtle transitions and hover effects
- **Professional Typography**: Inter font family for optimal readability

### Color Palette
- **Primary**: Soft Peach (#f4a6cd)
- **Secondary**: Sage Green (#a8d5ba)
- **Accent**: Lavender (#c8b5d9)
- **Text**: Dark (#2c3e50) and Light (#6c757d)

### Sections
1. **Home**: Hero section with professional introduction and call-to-action buttons
2. **About**: Detailed bio and education background
3. **Experience**: Current role and responsibilities
4. **Skills & Expertise**: Core competencies with icons
5. **Services**: Comprehensive service offerings
6. **Projects**: Key achievements and accomplishments
7. **Contact**: Contact information and contact form

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Download or clone the repository
2. Open `index.html` in your web browser
3. The website will load with all features enabled

### File Structure
```
portfolio-website/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🎨 Customization

### Adding a Professional Photo
Replace the placeholder in the hero section:
```html
<div class="profile-placeholder">
    <!-- Replace with actual image -->
    <img src="path/to/your/photo.jpg" alt="Neha Negi" class="profile-image">
</div>
```

### Updating Content
- Edit the HTML file to update personal information
- Modify the CSS variables in `styles.css` to change colors
- Update contact information in the contact section

### Adding New Sections
1. Add the HTML structure in `index.html`
2. Style the section in `styles.css`
3. Add any JavaScript functionality in `script.js`

## 📱 Responsive Features

### Mobile Navigation
- Hamburger menu for mobile devices
- Smooth transitions and animations
- Touch-friendly interface

### Responsive Grid Layouts
- Skills grid adapts to screen size
- Services and projects display optimally on all devices
- Contact form is mobile-friendly

## ⚡ Interactive Features

### Navigation
- Smooth scrolling between sections
- Active state highlighting
- Mobile-responsive menu

### Animations
- Scroll-triggered animations
- Hover effects on cards and buttons
- Typing animation for hero title
- Parallax effect on hero section

### Contact Form
- Form validation
- Success/error notifications
- Email format validation
- Responsive design

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Interactive features and animations
- **Font Awesome**: Icons for skills and services
- **Google Fonts**: Inter font family

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Features
- Optimized CSS with CSS variables
- Efficient JavaScript with event delegation
- Smooth animations with hardware acceleration
- Minimal external dependencies

## 📧 Contact Information

**Email**: nehanegihld21@gmail.com

## � EmailJS / Contact Form Configuration

If you are using EmailJS for client-side email delivery, avoid committing keys or template/service IDs to the repository. Exposing these values can allow third parties to send messages using your templates.

Recommended approaches:

- Preferred: Implement a small server endpoint (for example, `/send-email`) that accepts the form payload and forwards email using your EmailJS (or other) API key stored securely on the server. This keeps secret keys out of client-side code and repository history.
- If you must use EmailJS client-side, provide only a public key and service/template IDs through a secure configuration step (build-time environment variables, CI secrets, or local non-committed meta tags). The project is configured to look for the following meta tags in `index.html`:

    ```html
    <!-- Example (do not commit secrets) -->
    <meta name="emailjs-key" content="YOUR_PUBLIC_KEY_HERE">
    <meta name="emailjs-service-id" content="your_service_id">
    <meta name="emailjs-template-id" content="your_template_id">
    ```

    Note: Meta tags are visible in the published HTML and are not secure for secrets. Use only if you understand the risk and restrict template usage in EmailJS.

If you want help wiring a secure server-side endpoint (Node/Express, serverless function), tell me which environment you prefer and I can add a minimal implementation and instructions.

## �🔧 Future Enhancements

### Optional Add-ons (as mentioned in requirements)
- Testimonials section
- Downloadable resume (PDF)
- Blog section for insights
- LinkedIn integration
- Portfolio gallery
- Client testimonials

### Technical Improvements
- SEO optimization
- Performance optimization
- Accessibility improvements
- Progressive Web App features

## 📄 License

This project is created for Neha Negi's personal portfolio. All rights reserved.

---

**Note**: This is a static website that can be hosted on any web server or static hosting service like GitHub Pages, Netlify, or Vercel. 
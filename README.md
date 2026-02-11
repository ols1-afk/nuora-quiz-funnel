# Nuora Quiz Funnel

A fully-functional, responsive quiz funnel for Nuora with two personalized pathways based on user responses.

## Features

- **Two-Path Routing System**: Routes users to Path A (Odor/Freshness) or Path B (Dryness/Comfort) based on their symptom selection
- **Single-Page Application**: Smooth transitions between questions with no page reloads
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Charts**: Powered by Chart.js to display effectiveness comparisons and progress timelines
- **Color Palette**: Uses the official Nuora color scheme (warm yellows/golds and rich browns)
- **Loading Animation**: Engaging loading screen before results
- **Progress Bar**: Visual indicator of quiz completion

## File Structure

```
nuora-quiz-funnel/
├── index.html      # Main HTML structure with all quiz steps
├── style.css       # Styling with Nuora color palette
├── script.js       # Quiz logic, routing, and Chart.js initialization
└── README.md       # This file
```

## Exit URLs

- **Path A** (Odor/Discharge/Freshness): https://mynuora.com/products/feminine-balance-gummies-1
- **Path B** (Dryness/Discomfort): https://mynuora.com/products/gummies

## Quiz Flow

### Shared Steps (1-2)
1. Age range selection
2. Symptom selection (determines path routing)

### Path A - Odor/Discharge/Freshness
- Steps 3A-8A with specific questions about odor and freshness concerns
- Proof elements showing 4.5x effectiveness
- Timeline expectations (1 week to 1 month)
- Results page with predicted timeline and recommendations

### Path B - Dryness/Discomfort
- Steps 3B-8B with specific questions about dryness and discomfort
- Proof elements showing 4.5x effectiveness at restoring moisture
- Timeline expectations (2-3 weeks to 2-3 months)
- Results page with predicted timeline and recommendations

## How to Use

### Local Testing

1. Open `index.html` directly in a web browser
2. Or use a local server:
   ```bash
   # Python 3
   python3 -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js
   npx http-server
   ```
3. Navigate to `http://localhost:8000`

### Deployment

The quiz is built with vanilla HTML, CSS, and JavaScript, so it can be deployed anywhere:

- **GitHub Pages**: Enable in repository settings
- **Netlify**: Drag and drop the files
- **Vercel**: Connect your GitHub repository
- **Any web host**: Upload via FTP

## Color Palette

### Primary Colors - Warm Yellows/Golds
- Yellow-25: #FEFDF0 (Lightest background)
- Yellow-50: #FEEBE8 (Light background)
- Yellow-100: #FEF7C3 (Soft highlight)
- Yellow-200: #FDE272 (Light accent)
- Yellow-400: #FAC515 (Primary brand yellow)
- Yellow-500: #EAAA08 (Primary hover state)
- Yellow-600: #CA8504 (Dark accent)

### Secondary Colors - Rich Browns
- Brown-800: #854A0E (Text on light backgrounds)
- Brown-900: #713B12 (Headings, emphasis)
- Brown-950: #542C0D (Darkest - footer, high contrast)

### Path B Colors - Teal
- Teal-400: #5DADE2
- Teal-500: #4A9FD8
- Teal-600: #3B8BC2

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- Chart.js v4.4.0 (loaded from CDN)

## Customization

### Changing Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --yellow-400: #FAC515;
    --brown-900: #713B12;
    /* ... etc */
}
```

### Modifying Questions
Edit the HTML content in `index.html` for each step.

### Adjusting Routing Logic
Modify the `routeToPath()` function in `script.js` to change how users are routed between paths.

## Analytics

To add analytics tracking:

1. Add your analytics script to `index.html` (e.g., Google Analytics, Mixpanel)
2. Track events in `script.js` by adding tracking calls in:
   - `handleSingleSelect()` - for answer selections
   - `navigateToStep()` - for step progression
   - `routeToPath()` - for path routing

Example:
```javascript
function navigateToStep(stepId) {
    // ... existing code ...

    // Add analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quiz_step', {
            'step_id': stepId,
            'path': quizState.selectedPath
        });
    }
}
```

## License

Proprietary - Nuora

## Support

For questions or issues, contact the Nuora development team.

# Design System Color Contrast Rules

## CRITICAL: Prevent Same-Color-on-Same-Color Issues

### Rules to Follow:

1. **NEVER use the same color for text and background**
   - ❌ `text-white` on `bg-white`
   - ❌ `text-foreground` on `bg-foreground`
   - ❌ Transparent backgrounds with same-color text

2. **Button Variants Must Always Have Proper Contrast**
   - Hero buttons: White background + blue text
   - Hero-outline: White text + transparent background (only on dark backgrounds)
   - Footer-ghost: White text + transparent/subtle hover
   - Ghost: Always specify text color explicitly

3. **Use Semantic Color Tokens from Design System**
   - Always use HSL colors defined in index.css
   - Use `--patriot-blue`, `--patriot-red`, `--democracy-blue`, etc.
   - Never use direct colors like `white`, `black`, `gray-500`

4. **Test Color Combinations**
   - Light text requires dark backgrounds
   - Dark text requires light backgrounds  
   - Semi-transparent backgrounds need high contrast text

5. **Component-Specific Rules**
   - Headers on gradients: Use white text with proper button variants
   - Footers on dark backgrounds: Use white text with subtle hover effects
   - Cards: Ensure text contrasts with card background
   - Overlays: Always test text visibility

### Button Variant Guidelines:

- `hero`: White background, blue text (for CTAs on colored backgrounds)
- `hero-outline`: White text, transparent background (only on dark/gradient backgrounds)
- `footer-ghost`: White text, subtle hover (for dark footer backgrounds)
- `ghost`: Must specify text color explicitly
- `outline`: Ensure border and text contrast with background

### Before Adding Any Button or Text:
1. What is the background color?
2. What text color provides best contrast?
3. Does the hover state maintain good contrast?
4. Is the button variant appropriate for the context?
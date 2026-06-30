INDIQUAD CONTACT SOLUTION

1. Copy these folders into your project.
2. Ensure index.html:
   - form id="contactForm"
   - input name attributes
   - include css/contact.css
   - include js/contact.js before </body>
3. Set Vercel Environment Variable:
   RESEND_API_KEY=re_xxxxxxxxx
4. Verify sender domain in Resend.
5. Deploy to GitHub and Vercel.

Folder layout:
api/contact.js
templates/adminEmail.js
templates/customerEmail.js
utils/*.js
css/contact.css
js/contact.js
package.json
vercel.json

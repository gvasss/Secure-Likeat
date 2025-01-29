import { Container } from 'react-bootstrap';

const Terms = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
        <div className>
            <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
            
            <h2 className="text-xl font-semibold mt-4">1. Introduction</h2>
              <p>Welcome to our restaurant review app "LikEat". By using the App, you agree to comply with these Terms of Service.</p> 
              <p>If you do not agree with any part of these terms, please <b>do not use</b> the App.</p>
            
            <h2 className="text-xl font-semibold mt-4">2. Use of the App</h2>
              <p>The App allows users to post reviews and ratings of restaurants.</p>
              <p>You must be at least 18 years old or have parental consent to use the App.</p>
              <p>You are responsible for any content you post and must ensure it is accurate and lawful.</p>
            
            <h2 className="text-xl font-semibold mt-4">3. User Conduct</h2>
              <p>Do not post offensive, false, or misleading reviews.</p>
              <p>Do not spam, harass, or impersonate others.</p>
              <p>Do not attempt to hack, exploit, or disrupt the App.</p>

            <h2 className="text-xl font-semibold mt-4">4. Content Ownership</h2>
              <p>You retain ownership of the content you post but grant the App a non-exclusive, royalty-free license to use, display, and distribute it.</p>
              <p>The App is not responsible for user-generated content but reserves the right to remove any content that violates these Terms.</p>
            
            <h2 className="text-xl font-semibold mt-4">5. Limitation of Liability</h2>
              <p>The App is provided "as is" without warranties of any kind.</p>
              <p>We are not responsible for the accuracy of reviews or any harm resulting from the use of the App.</p>

            <h2 className="text-xl font-semibold mt-4">6. Changes to Terms</h2>
              <p>We may update these Terms at any time. Continued use of the App after changes are posted constitutes acceptance of the new terms.</p>
            
            <h2 className="text-xl font-semibold mt-4">7. Contact</h2>
              <p>For questions or concerns, please contact us at [support-likeat@protonmail.com].</p>


            <h6>By using the App, you acknowledge that you have read, understood, and agreed to these Terms of Service.</h6>
        </div>
    </div>
  );
};
export default Terms;

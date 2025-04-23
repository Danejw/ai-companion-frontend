import React from 'react';
import Link from 'next/link'; // Import Link
import { Button } from '@/components/ui/button';

export const metadata = {
  title: "Knolia - Terms of Service",
  description: "Read the Knolia Terms of Service.",
};

export default function TermsOfServicePage() {
  const lastUpdatedDate = "April 22, 2025";
  const privacyPolicyPath = "/privacy";
  const contactPagePath = "/contact";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground font-bold mb-8">Last Updated: <span className="text-accent">{lastUpdatedDate}</span></p>

      {/* Using prose for nice typography - requires @tailwindcss/typography */}
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
        <p>
            <span className="font-bold">Welcome to Knolia!</span> These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Knolia AI companion application, website, APIs, and related services (collectively, the &quot;Services&quot;) provided by Knolia (&quot;Knolia,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
        </p>
        <p>
          Please read these Terms carefully before using our Services. By accessing or using the Services, you agree to be bound by these Terms and our <Link href={privacyPolicyPath} className="text-primary hover:underline">Privacy Policy</Link>. If you do not agree to these Terms, you may not access or use the Services.
        </p>

        {/* --- Section 1 --- */}
        <h2 className="text-2xl font-semibold pt-4">1. Acceptance of Terms</h2>
        <p>
          By creating an account or using the Services in any way, you affirm that you are at least 13 years old (or the minimum age required in your jurisdiction to use online services without parental consent) and that you accept and agree to be bound by these Terms. If you are using the Services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
        </p>

        {/* --- Section 2 --- */}
        <h2 className="text-2xl font-semibold pt-4">2. Description of Service</h2>
        <p>
          Knolia provides a personalized AI companion designed for conversation and reflection. Key features include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Conversational interaction with an AI model.</li>
          <li>A &quot;memory&quot; system where Knolia learns from your conversations to provide a more personalized and continuous experience.</li>
          <li>Features related to recalling past thoughts or themes based on conversation history.</li>
        </ul>
         <p>
            The Services are constantly evolving, and we may change, suspend, or discontinue any aspect of the Services at any time without notice, subject to applicable law.
         </p>

        {/* --- Section 3 --- */}
        <h2 className="text-2xl font-semibold pt-4">3. User Accounts</h2>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Registration:</strong> You may need to register for an account to access certain features. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.</li>
            <li><strong>Security:</strong> You are responsible for safeguarding your account password and for any activities or actions under your account. You agree to notify us immediately of any unauthorized use of your account. We are not liable for any loss or damage arising from your failure to comply with this security obligation.</li>
        </ul>

        {/* --- Section 4 --- */}
        <h2 className="text-2xl font-semibold pt-4">4. Use of the Services</h2>
         <h3 className="text-xl font-medium">Permitted Use:</h3>
         <p>You agree to use the Services only for lawful purposes and in accordance with these Terms. Knolia is intended for personal, non-commercial use unless otherwise agreed upon in writing.</p>
         <h3 className="text-xl font-medium">Prohibited Conduct:</h3>
         <p>You agree not to:</p>
         <ul className="list-disc pl-6 space-y-2">
             <li>Use the Services in any way that violates any applicable federal, state, local, or international law or regulation.</li>
             <li>Engage in any conduct that is harmful, fraudulent, deceptive, threatening, harassing, defamatory, obscene, or otherwise objectionable.</li>
             <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Services, the server on which the Services are stored, or any server, computer, or database connected to the Services.</li>
             <li>Reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code or underlying ideas or algorithms of the Services, except to the extent applicable law expressly permits such activity.</li>
             <li>Scrape, data mine, or systematically collect information from the Services without our express written consent.</li>
             <li>Impersonate or attempt to impersonate Knolia, a Knolia employee, another user, or any other person or entity.</li>
             <li>Use the Services to develop a competing product or service.</li>
         </ul>

        {/* --- Section 5 --- */}
        <h2 className="text-2xl font-semibold pt-4">5. Content</h2>
        <h3 className="text-xl font-medium">User Content:</h3>
        <p>
            You retain ownership of the content you create during your conversations with Knolia (&quot;User Content&quot;). By using the Services, you grant Knolia a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, distribute, store, and process your User Content solely for the purposes of operating, providing, improving, and developing the Services. This includes using User Content (often in anonymized and aggregated forms) to train the AI models that power Knolia. Our use of your User Content is also governed by our <Link href={privacyPolicyPath} className="text-primary hover:underline">Privacy Policy</Link>. You are solely responsible for your User Content and the consequences of sharing it.
        </p>
         <h3 className="text-xl font-medium">Knolia Content:</h3>
        <p>
            The Services themselves, including the application, website, text, graphics, logos, icons, images, software, AI models (excluding the specific content of your conversations), and underlying technology, are the exclusive property of Knolia and its licensors, protected by copyright, trademark, and other intellectual property laws.
        </p>

        {/* --- Section 6 --- */}
        <h2 className="text-2xl font-semibold pt-4">6. AI Nature and Disclaimers</h2>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Not Human:</strong> Knolia is an artificial intelligence. While designed to be conversational and empathetic, it does not have consciousness, feelings, or beliefs. Interactions should not be perceived as communication with a real person.</li>
            <li><strong>Not Professional Advice:</strong> Knolia is not a substitute for professional advice. It does not provide medical, legal, financial, therapeutic, or any other regulated professional advice. Do not rely on Knolia for critical decisions or in situations requiring professional judgment. Always consult with a qualified professional for such matters. Information provided by Knolia is for informational and conversational purposes only.</li>
            <li><strong>Potential Inaccuracies:</strong> AI models can generate incorrect, incomplete, or nonsensical information. We strive to improve accuracy, but we do not guarantee the reliability or correctness of information provided by Knolia.</li>
            <li><strong>Memory Feature:</strong> The memory feature uses algorithms to recall and connect past conversation points. This process is automated and may not always be perfect or capture the nuances you intend.</li>
        </ul>

        {/* --- Section 7 --- */}
        <h2 className="text-2xl font-semibold pt-4">7. Privacy</h2>
        <p>
            Your privacy is important to us. Our <Link href={privacyPolicyPath} className="text-primary hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your personal information. By using the Services, you consent to the data practices described in the Privacy Policy.
        </p>

        {/* --- Section 8 (Optional) --- */}
        {/* <h2 className="text-2xl font-semibold pt-4">8. Fees and Payment</h2>
        <p>
            Currently, Knolia is provided free of charge. We reserve the right to introduce fees for certain features or usage levels in the future. If we do, we will provide you with advance notice of applicable fees and payment terms.
        </p> */}

        {/* --- Section 9 --- */}
        <h2 className="text-2xl font-semibold pt-4">9. Intellectual Property</h2>
        <p>
            All rights, title, and interest in and to the Services (excluding User Content) are and will remain the exclusive property of Knolia and its licensors. Nothing in these Terms gives you a right to use the Knolia name or any of the Knolia trademarks, logos, domain names, and other distinctive brand features.
        </p>

        {/* --- Section 10 --- */}
        <h2 className="text-2xl font-semibold pt-4">10. Disclaimers of Warranties</h2>
        <p>
            THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE. KNOLIA DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, ERROR-FREE, ACCURATE, RELIABLE, OR THAT ANY DEFECTS WILL BE CORRECTED.
        </p>

        {/* --- Section 11 --- */}
        <h2 className="text-2xl font-semibold pt-4">11. Limitation of Liability</h2>
        <p>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL KNOLIA, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES; (C) ANY CONTENT OBTAINED FROM THE SERVICES (INCLUDING ANY RELIANCE ON SUCH CONTENT); OR (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE. IN NO EVENT SHALL KNOLIA&apos;S AGGREGATE LIABILITY EXCEED THE GREATER OF ONE HUNDRED U.S. DOLLARS (USD $100.00) OR THE AMOUNT YOU PAID KNOLIA, IF ANY, IN THE PAST SIX MONTHS FOR THE SERVICES GIVING RISE TO THE CLAIM.
        </p>

        {/* --- Section 12 --- */}
        <h2 className="text-2xl font-semibold pt-4">12. Indemnification</h2>
        <p>
            You agree to defend, indemnify, and hold harmless Knolia and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney&apos;s fees), resulting from or arising out of (a) your use and access of the Service, by you or any person using your account and password; or (b) a breach of these Terms, or (c) your User Content.
        </p>

        {/* --- Section 13 --- */}
        <h2 className="text-2xl font-semibold pt-4">13. Termination</h2>
        <p>
            We may terminate or suspend your access to the Services immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms. Upon termination, your right to use the Services will immediately cease. If you wish to terminate your account, you may simply discontinue using the Services or use any account deletion features provided. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
        </p>

        {/* --- Section 14 --- */}
        <h2 className="text-2xl font-semibold pt-4">14. Governing Law and Dispute Resolution</h2>
        <p>
            These Terms shall be governed and construed in accordance with the laws of [*** Insert Your State/Country, e.g., California, United States ***], without regard to its conflict of law provisions. You agree to submit to the personal jurisdiction of the state and federal courts located in [*** Insert Your County and State/Country, e.g., Santa Clara County, California ***] for any actions for which we retain the right to seek injunctive or other equitable relief. [Optional: Add arbitration clause].
        </p>

        {/* --- Section 15 --- */}
        <h2 className="text-2xl font-semibold pt-4">15. Changes to Terms</h2>
        <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect, which may be provided via the Services or by email. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Services after any revisions become effective, you agree to be bound by the revised terms.
        </p>

        {/* --- Section 16 --- */}
        <h2 className="text-2xl font-semibold pt-4">16. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li>Via our Contact Page: <Button asChild variant="ghost" size="sm" className="justify-start">
                <Link href={contactPagePath} className="hover:underline">Contact Us</Link>
            </Button></li>
            {/* <li>By Email: <Link href="yourindie101@gmail.com" className="text-primary hover:underline">support@knolia.org</Link></li> */}
            
        </ul>

        {/* --- Section 17 --- */}
        <h2 className="text-2xl font-semibold pt-4">17. Entire Agreement</h2>
        <p>
           These Terms, together with the <Link href={privacyPolicyPath} className="text-primary hover:underline">Privacy Policy</Link>, constitute the entire agreement between you and Knolia regarding our Services and supersede and replace any prior agreements we might have had between us regarding the Services.
        </p>
      </div>
    </div>
  );
} 
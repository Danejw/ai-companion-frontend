import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


// You can keep metadata here or in the layout
export const metadata = {
  title: "Knolia - Privacy Policy",
  description: "Read the Knolia Privacy Policy.",
};

export default function PrivacyPolicyPage() {
  const lastUpdatedDate = "April 22, 2025"; 

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8 font-bold">Last Updated: <span className="font-bold text-accent">{lastUpdatedDate}</span></p>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
        <p>
          Welcome to Knolia! We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, store, share, and protect your information when you interact with Knolia, our AI companion application, website, and related services (collectively, the &quot;Services&quot;).
        </p>
        <p>
          By using our Services, you agree to the collection and use of information in accordance with this policy.
        </p>

        <h2 className="text-2xl font-semibold pt-4">1. Information We Collect</h2>
        <p>
          We collect information to provide and improve our Services to you. The types of information we collect depend on how you interact with Knolia:
        </p>
        <h3 className="text-xl font-medium">Information You Provide Directly:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Conversations:</strong> The core of Knolia involves your conversations with the AI. We collect the content of these interactions, including text, voice input (if applicable, after processing), and any feedback you provide.
          </li>
          <li>
            <strong>Account Information:</strong> If you create an account, we may collect information such as your name, email address, password, and other details you provide during sign-up or in your profile settings.
          </li>
          <li>
            <strong>Feedback and Support:</strong> Information you provide when you contact us for support, provide feedback, or participate in surveys.
          </li>
        </ul>
        <h3 className="text-xl font-medium">Information Collected Automatically:</h3>
         <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Usage Data:</strong> We collect information about how you interact with our Services, such as features used, frequency and duration of conversations, interaction times, crash reports, and performance data.
          </li>
          <li>
            <strong>Device Information:</strong> We may collect information about the device you use to access Knolia, such as device type, operating system, unique device identifiers, IP address, browser type, and language settings.
          </li>
          <li>
            <strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to track activity on our Services, hold certain information, maintain your session, and improve your experience. You can control the use of cookies at the individual browser level.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold pt-4">2. How We Use Your Information</h2>
        <p>
          We use the information we collect for various purposes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>To Provide and Maintain Our Services:</strong> To operate Knolia, enable conversations, personalize your experience, and provide customer support.</li>
            <li><strong>To Improve Our Services:</strong> To understand how users interact with Knolia, analyze usage patterns, train our AI models (using anonymized and aggregated data where possible), develop new features, and fix bugs.</li>
            <li><strong>To Personalize Your Experience:</strong> Knolia uses your past interactions (your &quot;memory&quot;) to provide more relevant, contextual, and personalized conversations over time. This memory is core to the Knolia experience.</li>
            <li><strong>To Communicate With You:</strong> To send you important updates, security alerts, support messages, and information about features or changes (you can opt-out of non-essential communications).</li>
            <li><strong>For Safety and Security:</strong> To detect and prevent fraud, abuse, security risks, and technical issues.</li>
            <li><strong>To Comply with Legal Obligations:</strong> To comply with applicable laws, regulations, legal processes, or enforceable governmental requests.</li>
        </ul>

        <h2 className="text-2xl font-semibold pt-4">3. How We Store and Protect Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Data Storage:</strong> Your conversation data and account information are stored on secure servers. We utilize cloud infrastructure providers known for their robust security practices.</li>
            <li><strong>Security Measures:</strong> We implement industry-standard technical and organizational security measures designed to protect your information from unauthorized access, disclosure, alteration, and destruction. These include encryption (both in transit and at rest where appropriate), access controls, and regular security reviews. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.</li>
            <li><strong>Data Retention:</strong> We retain your personal information for as long as necessary to provide the Services, fulfill the purposes outlined in this policy, comply with our legal obligations, resolve disputes, and enforce our agreements. Conversation history may be retained to maintain Knolia&apos;s memory unless you choose to delete specific interactions or your entire account.</li>
        </ul>

        <h2 className="text-2xl font-semibold pt-4">4. How We Share Your Information</h2>
        <p>
            We do not sell your personal information. We may share your information only in the following limited circumstances:
        </p>
         <ul className="list-disc pl-6 space-y-2">
            <li><strong>With Service Providers:</strong> We may share information with third-party vendors and service providers who perform services on our behalf, such as cloud hosting, data analytics, customer support tools, and payment processing (if applicable). These providers are obligated to protect your information and use it only for the services they provide to us.</li>
            <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law, subpoena, or other legal process, or if we have a good faith belief that disclosure is reasonably necessary to (a) comply with a legal obligation, (b) protect the safety of any person, (c) address fraud, security, or technical issues, or (d) protect our rights or property.</li>
            <li><strong>In Case of Business Transfer:</strong> If Knolia is involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction. We will provide notice before your information is transferred and becomes subject to a different privacy policy.</li>
            <li><strong>With Your Consent:</strong> We may share your information for other purposes if you have explicitly consented to it.</li>
            <li><strong>Anonymized/Aggregated Data:</strong> We may share anonymized or aggregated data (which cannot reasonably identify you) for research, analysis, or improving our services.</li>
        </ul>

        <h2 className="text-2xl font-semibold pt-4">5. Your Choices and Rights</h2>
        <p>
            Depending on your location, you may have certain rights regarding your personal information:
        </p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> You may have the right to access the personal information we hold about you.</li>
            <li><strong>Correction:</strong> You may have the right to request correction of inaccurate information.</li>
            <li><strong>Deletion:</strong> You may have the right to request the deletion of your personal information or specific conversations, subject to certain exceptions (e.g., legal requirements). Deleting your account will typically remove associated personal data and conversation history.</li>
            <li><strong>Objection/Restriction:</strong> You may have the right to object to or request restriction of certain processing activities.</li>
            <li><strong>Data Portability:</strong> You may have the right to receive your data in a portable format.</li>
            <li><strong>Managing Cookies:</strong> You can usually modify your browser setting to decline cookies.</li>
        </ul>
        <p>
          To exercise these rights, please contact us using the details below. Account management features within the application may also allow you to directly manage some of your data.
        </p>

        <h2 className="text-2xl font-semibold pt-4">6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies (like web beacons or pixels) to operate and personalize the Services, analyze usage, and manage sessions. {/* Optional: Our Cookie Policy [Link] provides more detail. */}
        </p>

        <h2 className="text-2xl font-semibold pt-4">7. Children&apos;s Privacy</h2>
        <p>
          Knolia is not intended for use by individuals under the age of 13 (or a higher age threshold depending on the jurisdiction). We do not knowingly collect personal information from children under this age. If we become aware that we have collected such information, we will take steps to delete it.
        </p>

        <h2 className="text-2xl font-semibold pt-4">8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date. We may also provide notice through the Services or via email. We encourage you to review this Privacy Policy periodically.
        </p>

        <h2 className="text-2xl font-semibold pt-4">9. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>

        <p className="italic">
          <div className="flex justify-start mt-4">
            <Button variant="outline" size="sm">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
          <br />
        </p>

      </div>
    </div>
  );
} 
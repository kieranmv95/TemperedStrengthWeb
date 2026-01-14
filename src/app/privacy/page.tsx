"use client";

import Image from "next/image";
import Link from "next/link";

export default function PrivacyPage() {
  const lastUpdated = "14 January 2026";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Subtle grid background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex justify-center mb-12">
          <Link href="/">
            <Image
              src="/logo_stacked.svg"
              alt="Tempered Strength"
              width={140}
              height={40}
              priority
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-neutral-400 text-sm mb-8">
            Last updated: {lastUpdated}
          </p>

          <div className="space-y-8 text-neutral-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Introduction
              </h2>
              <p className="leading-relaxed">
                LOCALHOSTDEVELOPMENT LTD (&quot;Company&quot;, &quot;we&quot;,
                &quot;us&quot;, or &quot;our&quot;) is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use,
                and safeguard your information when you use the Tempered
                Strength mobile application (&quot;App&quot;) and our website at
                temperedstrength.app (&quot;Website&quot;).
              </p>
              <p className="leading-relaxed mt-4">
                We are registered in England with our registered address at Unit
                44, OL2 8PU, United Kingdom. By using our App or Website, you
                consent to the practices described in this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                2.1 Information Collected Through the App
              </h3>
              <p className="leading-relaxed">
                <strong className="text-white">
                  We collect minimal personal information.
                </strong>{" "}
                The App is designed to function without requiring you to create
                an account or provide personal details.
              </p>
              <p className="leading-relaxed mt-4">
                <strong className="text-white">Subscription Data:</strong> If
                you subscribe to our Pro service, payment and subscription
                management is handled entirely by Apple (via the App Store) and
                RevenueCat. We do not have access to your payment card details
                or Apple ID credentials. We receive only:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  An anonymous identifier to verify your subscription status
                </li>
                <li>Subscription type (monthly or yearly)</li>
                <li>Subscription status (active, expired, cancelled)</li>
              </ul>

              <p className="leading-relaxed mt-4">
                <strong className="text-white">Crash Reports:</strong> If you
                have opted in to share crash data with app developers through
                your device settings, Apple may provide us with anonymised crash
                reports to help us improve the App. These reports do not contain
                personally identifiable information.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                2.2 Information Collected Through the Website
              </h3>
              <p className="leading-relaxed">
                <strong className="text-white">Email Addresses:</strong> If you
                sign up for our waitlist or newsletter on the Website, we
                collect your email address. This data is stored and processed by
                Resend, our email service provider. We use this information
                solely to send you updates about the App, new features, and
                relevant content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                3. Information We Do NOT Collect
              </h2>
              <p className="leading-relaxed">
                We want to be transparent about the data we do not collect:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <strong className="text-white">No Account Required:</strong>{" "}
                  We do not require you to create an account or provide personal
                  information to use the App
                </li>
                <li>
                  <strong className="text-white">No Analytics:</strong> We do
                  not use third-party analytics services to track your behaviour
                  within the App
                </li>
                <li>
                  <strong className="text-white">No Location Data:</strong> We
                  do not collect or track your location
                </li>
                <li>
                  <strong className="text-white">No Health Data:</strong> We do
                  not integrate with Apple Health or collect health-related data
                  from your device
                </li>
                <li>
                  <strong className="text-white">No Advertising:</strong> We do
                  not serve advertisements or share data with advertising
                  networks
                </li>
                <li>
                  <strong className="text-white">No Social Features:</strong> We
                  do not collect social media data or require social logins
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                4. How We Use Your Information
              </h2>
              <p className="leading-relaxed">
                The limited information we collect is used for the following
                purposes:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <strong className="text-white">
                    Subscription Management:
                  </strong>{" "}
                  To verify your subscription status and provide access to Pro
                  features
                </li>
                <li>
                  <strong className="text-white">App Improvement:</strong> To
                  analyse crash reports and fix bugs to improve the App
                  experience
                </li>
                <li>
                  <strong className="text-white">Communications:</strong> To
                  send you updates, newsletters, and information about the App
                  (if you opted in via our Website)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Third-Party Services
              </h2>
              <p className="leading-relaxed">
                We use the following third-party services to operate our App and
                Website:
              </p>

              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                  <p className="font-semibold text-white">Apple App Store</p>
                  <p className="text-sm mt-1">
                    Handles all payment processing for subscriptions. Subject to{" "}
                    <a
                      href="https://www.apple.com/legal/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c9b072] hover:underline"
                    >
                      Apple&apos;s Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                  <p className="font-semibold text-white">RevenueCat</p>
                  <p className="text-sm mt-1">
                    Manages subscription status and entitlements. Subject to{" "}
                    <a
                      href="https://www.revenuecat.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c9b072] hover:underline"
                    >
                      RevenueCat&apos;s Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                  <p className="font-semibold text-white">Resend</p>
                  <p className="text-sm mt-1">
                    Email service provider for website communications. Subject
                    to{" "}
                    <a
                      href="https://resend.com/legal/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c9b072] hover:underline"
                    >
                      Resend&apos;s Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                  <p className="font-semibold text-white">Supabase</p>
                  <p className="text-sm mt-1">
                    Hosts our exercise database (app content only, no user
                    data). Subject to{" "}
                    <a
                      href="https://supabase.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c9b072] hover:underline"
                    >
                      Supabase&apos;s Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                6. Data Storage and Security
              </h2>
              <p className="leading-relaxed">
                We do not store personal user data on our own servers. All
                subscription data is managed by Apple and RevenueCat. Email
                addresses collected via our Website are stored securely by
                Resend.
              </p>
              <p className="leading-relaxed mt-4">
                Workout progress and preferences are stored locally on your
                device and are not transmitted to our servers. If you delete the
                App, this local data will be removed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                7. Data Retention
              </h2>
              <p className="leading-relaxed">
                <strong className="text-white">Subscription Data:</strong>{" "}
                Retained by Apple and RevenueCat according to their respective
                privacy policies and legal requirements.
              </p>
              <p className="leading-relaxed mt-4">
                <strong className="text-white">Email Addresses:</strong>{" "}
                Retained until you unsubscribe from our mailing list or request
                deletion. You can unsubscribe at any time using the link in our
                emails.
              </p>
              <p className="leading-relaxed mt-4">
                <strong className="text-white">Crash Reports:</strong> Retained
                by Apple according to their data retention policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                8. Your Rights
              </h2>
              <p className="leading-relaxed">
                Under applicable data protection laws, including the UK GDPR,
                you have the following rights:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <strong className="text-white">Right of Access:</strong> You
                  can request information about the personal data we hold about
                  you
                </li>
                <li>
                  <strong className="text-white">Right to Rectification:</strong>{" "}
                  You can request correction of inaccurate personal data
                </li>
                <li>
                  <strong className="text-white">Right to Erasure:</strong> You
                  can request deletion of your personal data
                </li>
                <li>
                  <strong className="text-white">Right to Restriction:</strong>{" "}
                  You can request restriction of processing of your personal
                  data
                </li>
                <li>
                  <strong className="text-white">Right to Portability:</strong>{" "}
                  You can request transfer of your personal data
                </li>
                <li>
                  <strong className="text-white">Right to Object:</strong> You
                  can object to processing of your personal data
                </li>
                <li>
                  <strong className="text-white">Right to Withdraw Consent:</strong>{" "}
                  You can withdraw consent at any time where processing is based
                  on consent
                </li>
              </ul>
              <p className="leading-relaxed mt-4">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:kieran.venison@icloud.com"
                  className="text-[#c9b072] hover:underline"
                >
                  kieran.venison@icloud.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                9. Children&apos;s Privacy
              </h2>
              <p className="leading-relaxed">
                The App is intended for users aged 13 and above. We do not
                knowingly collect personal information from children under 13.
                If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us
                immediately so we can take appropriate action.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                10. International Data Transfers
              </h2>
              <p className="leading-relaxed">
                Our third-party service providers may process data outside of
                the United Kingdom. Where this occurs, appropriate safeguards
                are in place to protect your data in accordance with applicable
                data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any significant changes by posting the new Privacy
                Policy on this page and updating the &quot;Last updated&quot;
                date. We encourage you to review this Privacy Policy
                periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                12. Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <div className="mt-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                <p className="font-semibold text-white">
                  LOCALHOSTDEVELOPMENT LTD
                </p>
                <p>Unit 44, OL2 8PU</p>
                <p>United Kingdom</p>
                <p className="mt-2">
                  Email:{" "}
                  <a
                    href="mailto:kieran.venison@icloud.com"
                    className="text-[#c9b072] hover:underline"
                  >
                    kieran.venison@icloud.com
                  </a>
                </p>
              </div>
              <p className="leading-relaxed mt-4">
                You also have the right to lodge a complaint with the
                Information Commissioner&apos;s Office (ICO) if you believe your
                data protection rights have been violated:{" "}
                <a
                  href="https://ico.org.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c9b072] hover:underline"
                >
                  https://ico.org.uk/
                </a>
              </p>
            </section>
          </div>
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
            <p>&copy; {new Date().getFullYear()} LOCALHOSTDEVELOPMENT LTD</p>
            <div className="flex gap-6">
              <Link
                href="/terms"
                className="hover:text-[#c9b072] transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/"
                className="hover:text-[#c9b072] transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}


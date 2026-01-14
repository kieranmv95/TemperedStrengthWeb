"use client";

import Image from "next/image";
import Link from "next/link";

export default function TermsPage() {
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
            Terms and Conditions
          </h1>
          <p className="text-neutral-400 text-sm mb-8">
            Last updated: {lastUpdated}
          </p>

          <div className="space-y-8 text-neutral-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Agreement to Terms
              </h2>
              <p className="leading-relaxed">
                By downloading, installing, or using the Tempered Strength
                mobile application (&quot;App&quot;), you agree to be bound by
                these Terms and Conditions (&quot;Terms&quot;). The App is owned
                and operated by LOCALHOSTDEVELOPMENT LTD, a company registered
                in England (Company Number: pending), with registered address at
                Unit 44, OL2 8PU, United Kingdom (&quot;Company&quot;,
                &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              </p>
              <p className="leading-relaxed mt-4">
                If you do not agree to these Terms, please do not use the App.
                We reserve the right to modify these Terms at any time, and such
                modifications will be effective immediately upon posting.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Eligibility
              </h2>
              <p className="leading-relaxed">
                You must be at least 13 years of age to use the App. By using
                the App, you represent and warrant that you are at least 13
                years old and have the legal capacity to enter into these Terms.
                If you are under 18, you confirm that you have obtained parental
                or guardian consent to use the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                3. Description of Service
              </h2>
              <p className="leading-relaxed">
                Tempered Strength is a fitness application that provides:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Structured gym training programs</li>
                <li>On-demand workout library</li>
                <li>
                  Educational content including fitness articles and gym
                  terminology glossary
                </li>
                <li>Smart exercise swapping functionality</li>
                <li>Curated Apple Music playlists</li>
              </ul>
              <p className="leading-relaxed mt-4">
                The App is available in both free and premium (&quot;Pro&quot;)
                versions. Free users have access to selected programs and
                limited features, while Pro subscribers gain access to the full
                content library and unlimited features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                4. Subscriptions and Payments
              </h2>
              <p className="leading-relaxed">
                <strong className="text-white">4.1 Subscription Options:</strong>{" "}
                Pro subscriptions are available on a monthly or yearly basis.
                Pricing is displayed within the App prior to purchase.
              </p>
              <p className="leading-relaxed mt-4">
                <strong className="text-white">4.2 Payment Processing:</strong>{" "}
                All payments are processed through Apple&apos;s App Store. By
                subscribing, you agree to Apple&apos;s Terms of Service and
                payment terms. We use RevenueCat to manage subscription status.
              </p>
              <p className="leading-relaxed mt-4">
                <strong className="text-white">4.3 Auto-Renewal:</strong>{" "}
                Subscriptions automatically renew unless cancelled at least 24
                hours before the end of the current billing period. Your account
                will be charged for renewal within 24 hours prior to the end of
                the current period.
              </p>
              <p className="leading-relaxed mt-4">
                <strong className="text-white">4.4 Cancellation:</strong> You may
                cancel your subscription at any time through your Apple ID
                account settings. Cancellation will take effect at the end of
                the current billing period. No refunds will be provided for
                partial subscription periods.
              </p>
              <p className="leading-relaxed mt-4">
                <strong className="text-white">4.5 Price Changes:</strong> We
                reserve the right to change subscription prices. Any price
                changes will be communicated in advance and will apply to the
                next billing cycle following notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                5. User Responsibilities
              </h2>
              <p className="leading-relaxed">You agree to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  Use the App only for lawful purposes and in accordance with
                  these Terms
                </li>
                <li>
                  Not reproduce, distribute, modify, or create derivative works
                  from any content within the App
                </li>
                <li>
                  Not attempt to reverse engineer, decompile, or disassemble the
                  App
                </li>
                <li>
                  Not use the App in any way that could damage, disable, or
                  impair the service
                </li>
                <li>
                  Not share your subscription access with others
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                6. Health and Fitness Disclaimer
              </h2>
              <p className="leading-relaxed">
                <strong className="text-white">
                  IMPORTANT: The App is intended for informational and
                  educational purposes only.
                </strong>
              </p>
              <p className="leading-relaxed mt-4">
                The workout programs, exercises, and fitness information
                provided through the App are not intended to be a substitute for
                professional medical advice, diagnosis, or treatment. Always
                consult your physician or qualified healthcare provider before
                starting any new exercise program, particularly if you have any
                pre-existing medical conditions, injuries, or health concerns.
              </p>
              <p className="leading-relaxed mt-4">
                You acknowledge that:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  Physical exercise involves inherent risks of injury
                </li>
                <li>
                  You are voluntarily participating in these activities at your
                  own risk
                </li>
                <li>
                  You are solely responsible for determining whether any
                  exercise or program is appropriate for your fitness level
                </li>
                <li>
                  The Company is not responsible for any injuries or health
                  issues that may result from using the App
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                7. Intellectual Property
              </h2>
              <p className="leading-relaxed">
                All content within the App, including but not limited to text,
                graphics, logos, images, workout programs, and software, is the
                property of LOCALHOSTDEVELOPMENT LTD or its licensors and is
                protected by copyright, trademark, and other intellectual
                property laws.
              </p>
              <p className="leading-relaxed mt-4">
                Your subscription grants you a limited, non-exclusive,
                non-transferable, revocable license to access and use the App
                for personal, non-commercial purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                8. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by applicable law, the Company
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or
                revenues, whether incurred directly or indirectly, or any loss
                of data, use, goodwill, or other intangible losses resulting
                from:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Your use or inability to use the App</li>
                <li>Any unauthorised access to or use of our servers</li>
                <li>Any interruption or cessation of transmission to or from the App</li>
                <li>Any bugs, viruses, or similar issues transmitted through the App</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Our total liability to you for any claims arising from or
                related to these Terms or your use of the App shall not exceed
                the amount you paid us in the twelve (12) months preceding the
                claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                9. Indemnification
              </h2>
              <p className="leading-relaxed">
                You agree to indemnify, defend, and hold harmless
                LOCALHOSTDEVELOPMENT LTD, its officers, directors, employees,
                and agents from and against any claims, liabilities, damages,
                losses, costs, or expenses (including reasonable legal fees)
                arising out of or related to your use of the App or violation of
                these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                10. Termination
              </h2>
              <p className="leading-relaxed">
                We reserve the right to suspend or terminate your access to the
                App at any time, with or without cause, and with or without
                notice. Upon termination, your right to use the App will
                immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                11. Changes to the App
              </h2>
              <p className="leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the App
                or any part thereof at any time without notice. We shall not be
                liable to you or any third party for any modification,
                suspension, or discontinuation of the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                12. Governing Law
              </h2>
              <p className="leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of England and Wales, without regard to its
                conflict of law provisions. Any disputes arising under these
                Terms shall be subject to the exclusive jurisdiction of the
                courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                13. Severability
              </h2>
              <p className="leading-relaxed">
                If any provision of these Terms is found to be unenforceable or
                invalid, that provision shall be limited or eliminated to the
                minimum extent necessary so that these Terms shall otherwise
                remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                14. Contact Information
              </h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms, please contact us
                at:
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
            </section>
          </div>
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
            <p>&copy; {new Date().getFullYear()} LOCALHOSTDEVELOPMENT LTD</p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-[#c9b072] transition-colors"
              >
                Privacy Policy
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


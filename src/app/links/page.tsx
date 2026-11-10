import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Atmosphere } from "@/components/motion/Atmosphere";
import conic from "@/components/motion/ConicBorder.module.css";
import { Monogram } from "@/components/links/Monogram";
import { SmartDownload } from "@/components/store/SmartDownload";
import { getRequestPlatform } from "@/lib/platform";
import {
  APP_STORE_URL,
  CROSSFIT_FIXUS_URL,
  DRIATHLON_URL,
  GOOGLE_PLAY_URL,
  INSTAGRAM_URL,
  PUBLIC_SITE_URL,
  TIKTOK_URL,
  YOUTUBE_URL,
} from "@/lib/site";
import {
  ArrowRightIcon,
  ExternalIcon,
  GlobeIcon,
  HandshakeIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "./icons";
import { LinksMotion } from "./LinksMotion";
import styles from "./links.module.css";

export const metadata: Metadata = {
  title: "Links | Tempered Strength",
  description:
    "Download Tempered Strength free, then find the app, socials, and partners in one place.",
};

const STAGGER_MS = 60;
const SITE_HOST = new URL(PUBLIC_SITE_URL).host.replace(/^www\./, "");

function rise(index: number): CSSProperties {
  return { "--links-delay": `${index * STAGGER_MS}ms` } as CSSProperties;
}

function withLinkInBioUtm(url: string) {
  const next = new URL(url);
  next.searchParams.set("utm_source", "linkinbio");
  next.searchParams.set("utm_medium", "social");
  return next.toString();
}

function Eyebrow({
  children,
  as: Tag = "p",
  id,
}: {
  children: ReactNode;
  as?: "p" | "h2";
  id?: string;
}) {
  return (
    <Tag id={id} className={styles.eyebrow}>
      <span>{children}</span>
      <span className={styles.eyebrowLine} aria-hidden="true" />
    </Tag>
  );
}

const socials = [
  { href: INSTAGRAM_URL, label: "Tempered Strength on Instagram", Icon: InstagramIcon },
  { href: TIKTOK_URL, label: "Tempered Strength on TikTok", Icon: TikTokIcon },
  { href: YOUTUBE_URL, label: "Tempered Strength on YouTube", Icon: YouTubeIcon },
] as const;

const mentions = [
  {
    href: DRIATHLON_URL,
    initials: "DR",
    name: "Driathlon",
    description: "Prize-pool sponsor, 26/27 season",
    tag: "Sponsor",
  },
  {
    href: CROSSFIT_FIXUS_URL,
    initials: "CF",
    name: "CrossFit Fixus",
    description: "Middleton, Manchester · thanks for filming with us",
    tag: "Filmed with",
  },
] as const;

export default async function LinksPage() {
  const platform = await getRequestPlatform();
  const year = new Date().getFullYear();

  return (
    <main className={styles.page}>
      <LinksMotion>
        <div className={styles.heroCluster}>
          <Atmosphere tone="focus" />
          <div className={styles.heroInner}>
            <div className={styles.item} style={rise(0)}>
              <Link href="/" className={styles.logoLink} aria-label="Tempered Strength">
                <Image
                  src="/logo_stacked.svg"
                  alt=""
                  width={104}
                  height={31}
                  priority
                  className={styles.logo}
                />
              </Link>
            </div>

            <div className={`${styles.item} ${styles.intro}`} style={rise(1)}>
              <Eyebrow>Everything in one place</Eyebrow>
              <h1 className={styles.headline}>Train with a plan that adapts to you.</h1>
              <p className={styles.lede}>7 programmes free, forever.</p>
            </div>

            <div className={`${styles.item} ${styles.downloadItem}`} style={rise(2)}>
              <SmartDownload
                platform={platform}
                appStoreHref={withLinkInBioUtm(APP_STORE_URL)}
                googlePlayHref={withLinkInBioUtm(GOOGLE_PLAY_URL)}
                trust="Free to start · 7 programmes free, forever"
              />
            </div>
          </div>
        </div>

        <nav className={styles.item} style={rise(3)} aria-label="Social media">
          <div className={styles.socialBlock}>
            <ul className={styles.socials}>
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    className={styles.social}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.handle}>@temperedstrength</p>
          </div>
        </nav>

        <div className={styles.item} style={rise(4)}>
          <div className={styles.dailyShell}>
            <div className={conic.border} aria-hidden="true" />
            <Link
              href="/#tempered-daily"
              className={styles.dailyCard}
              data-spotlight=""
            >
              <span className={styles.spot} aria-hidden="true" />
              <span className={styles.dailyBody}>
                <span>
                  <span className={styles.badge}>Coming soon</span>
                  <p className={styles.dailyName}>Tempered Daily</p>
                  <h2 className={styles.dailyTitle}>A new week, every Monday</h2>
                </span>
                <ArrowRightIcon className={styles.arrow} />
              </span>
            </Link>
          </div>
        </div>

        <div className={styles.item} style={rise(5)}>
          <Link href="/" className={`${styles.card} ${styles.web}`} data-spotlight="">
            <span className={styles.spot} aria-hidden="true" />
            <span className={styles.webBody}>
              <span className={styles.iconTile}>
                <GlobeIcon />
              </span>
              <span className={styles.webCopy}>
                <span className={styles.webTitle}>Explore the full app</span>
                <span className={styles.webHost}>{SITE_HOST}</span>
              </span>
              <ArrowRightIcon className={styles.arrow} />
            </span>
          </Link>
        </div>

        <section className={`${styles.item} ${styles.mentions}`} style={rise(6)} aria-labelledby="supporting-heading">
          <Eyebrow as="h2" id="supporting-heading">
            Proudly supporting
          </Eyebrow>
          <div className={styles.tilesWrap}>
            <ul className={styles.tiles}>
              {mentions.map((mention) => (
                <li key={mention.name}>
                  <a
                    href={mention.href}
                    className={`${styles.card} ${styles.tile}`}
                    data-spotlight=""
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.spot} aria-hidden="true" />
                    <span className={styles.tileBody}>
                      <ExternalIcon className={styles.ext} />
                      <Monogram initials={mention.initials} />
                      <span className={styles.mentionName}>{mention.name}</span>
                      <span className={styles.mentionDesc}>{mention.description}</span>
                      <span className={styles.tag}>{mention.tag}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className={styles.item} style={rise(7)}>
          <div className={styles.card} data-spotlight="">
            <span className={styles.spot} aria-hidden="true" />
            <div className={styles.partnerBody}>
              <span className={styles.iconTile}>
                <HandshakeIcon />
              </span>
              <div className={styles.partnerCopy}>
                <h2 className={styles.partnerTitle}>For our partners</h2>
                <p className={styles.partnerLinks}>
                  <Link href="/partners" className={styles.inlineLink}>
                    Brand assets <span className={styles.nudge} aria-hidden="true">→</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className={styles.item} style={rise(8)}>
          <div className={styles.footer}>
            <p className={styles.copy}>&copy; {year} Localhost Development Ltd</p>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
              </li>
              <li>
                <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </li>
              <li>
                <Link href="/partners">Partners</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
            </ul>
          </div>
        </footer>
      </LinksMotion>
    </main>
  );
}

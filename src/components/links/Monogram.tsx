import Image from "next/image";
import styles from "./Monogram.module.css";

type MonogramProps = {
  initials: string;
  /** Real logo. When set, it replaces the initials inside the same badge. */
  src?: string;
  alt?: string;
  className?: string;
};

export function Monogram({ initials, src, alt = "", className }: MonogramProps) {
  const classNames = [styles.monogram, className].filter(Boolean).join(" ");

  return (
    <span data-monogram="" className={classNames}>
      {src ? (
        <Image src={src} alt={alt} width={48} height={48} className={styles.image} />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {initials}
        </span>
      )}
    </span>
  );
}

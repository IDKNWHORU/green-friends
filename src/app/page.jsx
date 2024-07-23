import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import CheckInstall from "./CheckInstall";

export default function Home() {
  return (
    <main className={styles.main}>
      <Image
        className="background"
        src="/background.png"
        alt="background"
        fill={true}
      />
      <Link className="link" href="/classify">
        시작하기
      </Link>
      <CheckInstall />
    </main>
  );
}

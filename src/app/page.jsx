import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <Image
        className="background"
        src="/background.png"
        alt="background"
        // width={0}
        // height={0}
        fill={true}
      />
      <Link className="link" href="https://32c4c8a4ea4504350d.gradio.live/">
        시작하기
      </Link>
    </main>
  );
}

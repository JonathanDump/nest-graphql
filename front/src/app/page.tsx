"use client";
import Party from "./components/Party/Party";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Party id="party1" />
    </main>
  );
}

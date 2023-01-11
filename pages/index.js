import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  //deklarasi variabel yang digunakan
  const [essaiInput, setEssaiInput] = useState("");
  const [essaiOutput, setEssaiOutput] = useState("");
  const [result, setResult] = useState();

  //function submit dan fetch ke controller
  async function onSubmit(event) {
    event.preventDefault();
    try {
      //request ke route /api/essai untuk mendapatkan data yang dibuat
      const response = await fetch("/api/essai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ essai: essaiInput }),
      });

      const data = await response.json();
      // error handling jika response dari API error
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      //set result
      setResult(data.result);
      setEssaiOutput("This Outline for topic " + essaiInput);
      setEssaiInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Essay Outline Generator</title>
        <link rel="icon" href="/favicon.png" sizes="32x32" />
      </Head>

      <main className={styles.main}>
        <img src="/idea-topic.png" className={styles.icon} />
        <h3>Essay Outline Generator</h3>
        <span>Generate an outline for a research topic.</span>
        <br></br>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="essai"
            placeholder="Enter an Research Topic"
            value={essaiInput}
            onChange={(e) => setEssaiInput(e.target.value)}
          />
          <input type="submit" value="Generate Outline" />
        </form>
        <div className={styles.result}>
          <span className={styles.HeadingOutput}>{essaiOutput}</span>
          <span className={styles.essaiResult}>{result}</span>
        </div>
      </main>
    </div>
  );
}

"use client";
import TextField from "@mui/material/TextField";
import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

// const Context = createContext()

const inter = Inter({ subsets: ["latin"] });

//useSWR allows the use of SWR inside function components
import { TResponse } from "@/pages/api/hello";
import { Card, CardContent, Typography } from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import DefinitionCard from "@/app/shared/component/DefinitionCard";

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const foo = (word: string) => {
  return word;
};

export default function Home() {
  const [inputWord, setInputWord] = useState("");
  const [resultData, setResultData] = useState([] as TResponse[]);

  const debounced = useDebouncedCallback(
    (value) => {
      setInputWord(value);
    },
    // delay in ms
    500
  );

  const formHandler = async (word: string) => {
    if (word === ''){
      return;
    }
    const data = {
      word,
    };
    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);

    // API endpoint where we send form data.
    const endpoint = "/api/hello ";

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
    setResultData(result.data);
  };

  useEffect(() => {
    formHandler(inputWord);
  }, [inputWord]);

  const wordAndDefinitions = resultData?.map(({ word, definitionList }: TResponse, index: number) => {
    return (
      <DefinitionCard key={`${word}_${index}`} word={word} definitionList={definitionList}/>
    );
  });

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <TextField
          name="word"
          id="standard-basic"
          label="Word"
          variant="standard"
          onChange={(e) => debounced(e.target.value)}
        />
      </div>
      {wordAndDefinitions}
    </main>
  );
}

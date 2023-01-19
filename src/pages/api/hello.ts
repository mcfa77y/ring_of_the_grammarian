// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import memoize from "memoizee";
import { Definition } from "@/types";
const wordnet = require("wordnet");
const alphabet = "abcdefghijklmnopqrstuvwxyz";

const createWordSet = async function () {
  const wordList = await wordnet.list();
  if (wordList.length == 0) {
    await wordnet.init();
  }
  const wordSet = new Set(wordList);
  return wordSet;
};

/**
 * This gets all the possibilities for a word with a single character changed
 * by swapping out single letters with each letter from the alphabet
 *
 * @param {string} word
 * @returns {string[]} word list
 */
function getPossibilities(word: string): string[] {
  const resultSet = new Set<string>();
  for (const index in word as any) {
    for (const letter of alphabet) {
      const updatedWord = setCharacterAt(word, parseInt(index), letter);
      resultSet.add(updatedWord);
    }
  }
  return Array.from(resultSet);
}

/**
 * Set a character in a word at a particular index
 *
 * @param {string} word word to swap characters of
 * @param {number} index which index to swap
 * @param {string} character which character to use
 * @returns {string} new word with swapped character
 */
function setCharacterAt(
  word: string,
  index: number,
  character: string
): string {
  if (index > word.length - 1) return word;
  return word.substring(0, index) + character + word.substring(index + 1);
}

const createWordSetMemo = memoize(createWordSet, { async: true });

export type TResponse = {
  word: string;
  definitionList: Definition[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const wordSet = await createWordSetMemo();
  // Get data submitted in request's body.
  const { word } = req.body;

  if (!word) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "word not found" });
  }

  const wordList: string[] = getPossibilities(word);
  const promiseList: Promise<TResponse>[] = wordList
    .filter((potentialWord) => wordSet.has(potentialWord))
    .map((potentialWord) => {
      return wordnet
        .lookup(potentialWord, true)
        .then((definitionList: Definition[]) => {
          return {
            word: potentialWord,
            definitionList,
          };
        });
    });
  const definitionListList =
    ((await Promise.all(promiseList).catch((err) => {
      console.log(err);
      return [];
    })) as Array<TResponse>) || [];

  const glossarySet = new Set();
  const result = [];
  definitionListList.forEach((response) => {
    response.definitionList = response.definitionList.filter((definition) => {
      let hasWord = glossarySet.has(definition.glossary);
      if (!hasWord) {
        glossarySet.add(definition.glossary);
      }
      return !hasWord;
    });
  });
  definitionListList.sort((a, b) => {
    var x = a.word.toLowerCase();
    var y = b.word.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  })
  res.status(200).json({
    data: definitionListList
  });
}

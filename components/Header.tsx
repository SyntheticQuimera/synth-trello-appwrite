"use client";

import fetchSuggestion from "@/lib/fetchSuggestion";
import { useBoardStore } from "@/store/BoardStore";
import { useSetTheme, useTheme, useThemeStore } from "@/store/useThemeStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiMiniRectangleGroup } from "react-icons/hi2";
import { IoMoon, IoMoonSharp, IoSearchOutline, IoSunny } from "react-icons/io5";

export default function Header() {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);

  const board = useBoardStore((state) => state.board);
  const setTheme = useSetTheme();
  const theme = useTheme();

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    setLoading(true);

    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };
    fetchSuggestionFunc();
  }, [board]);

  return (
    <header className='flex flex-col items-center'>
      <div className='navbar p-4 flex-col md:flex-row gap-6 md:gap-0 max-w-7xl'>
        {/* Logo */}
        <div className='flex-1 w-full justify-center md:justify-start'>
          <a
            href='/'
            className='flex items-center normal-case font-extrabold text-4xl'
          >
            <HiMiniRectangleGroup className='text-primary' />
            <span className='ml-2'>SynthScribe</span>
          </a>
        </div>

        {/* Search & Avatar */}
        <div className='flex-none md:flex w-full md:w-fit gap-2 items-center justify-center md:justify-start'>
          <form className='form-control relative w-full'>
            <IoSearchOutline className='text-lg text-neutral-400 absolute bottom-[0.85rem] left-4' />
            <input
              type='text'
              placeholder='Search'
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className='input md:w-48 md:focus:w-96 pl-12 w-full transition-all ease-in-out rounded-full'
            />
            <button type='submit' hidden>
              Search
            </button>
          </form>
          <div className='btn btn-disabled btn-circle overflow-hidden'>
            <Image src='/avatar.jpg' width={100} height={100} alt='avatar' />
          </div>

          <button
            className='btn btn-ghost btn-circle text-2xl'
            onClick={setTheme}
          >
            {theme === "cupcake" ? <IoSunny /> : <IoMoon />}
          </button>
        </div>
      </div>
      <div className='chat chat-start w-full justify-center flex p-4 max-w-7xl'>
        <div className={`chat-image avatar ${loading && "animate-spin"}`}>
          <div
            className={`w-10 rounded-full p-[0.35rem] ${
              theme === "cupcake" ? "bg-neutral" : "bg-base-100"
            }`}
          >
            <img src='/gpt-logo.svg' alt='avatar' className='invert' />
          </div>
        </div>
        <div
          className={`chat-bubble ${
            theme === "cupcake" ? "bg-neutral" : "bg-base-100"
          }`}
        >
          {suggestion && !loading
            ? suggestion.split("\n").map((line, index) => (
                <p key={index}>
                  {line}
                  <br />
                </p>
              ))
            : "GPT is summarizing your task for the day..."}
        </div>
      </div>
    </header>
  );
}

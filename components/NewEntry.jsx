<<<<<<< HEAD
=======
"use client";
import React from "react";
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
import Image from "next/image";
import Link from "next/link";

import food from "@/public/img/food.png";
import mood from "@/public/img/mood.png";
import meds from "@/public/img/meds.png";
import bowel from "@/public/img/bowel.png";

<<<<<<< HEAD
export default function Newentry({ test }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center py-6">New Entry</h2>
      <div className="flex justify-center ">
        <div className="flex flex-col mx-4 w-32 ">
          <Link
            href="/food_entry"
            as="food_entry"
            className="bg-food rounded-full hover:bg-food_hover text-center py-2"
          >
            <button>
              <Image src={food} alt="food icon" height={35} width={35}></Image>
            </button>
          </Link>
        </div>
        <div className="flex flex-col mx-4 w-32 ">
          <Link
            href="/mood_entry"
            as="mood_entry"
            className="bg-mood hover:bg-mood_hover rounded-full text-center py-2"
          >
            <button>
              <Image src={mood} alt="mood icon" height={35} width={35}></Image>
            </button>
          </Link>
        </div>
        <div className="flex flex-col mx-4 w-32 ">
          <Link
            href="/meds_entry"
            as="meds_entry"
            className="bg-meds hover:bg-meds_hover rounded-full text-center py-2"
          >
            <button>
              <Image src={meds} alt="meds icon" height={35} width={35}></Image>
            </button>
          </Link>
        </div>
        <div className="flex flex-col mx-4 w-32 ">
          <Link
            href="/bowel_entry"
            as="bowel_entry"
            className="bg-bowel hover:bg-bowel_hover rounded-full text-center py-2"
          >
            <button>
              <Image
                src={bowel}
                alt="bowel icon"
                height={35}
                width={35}
              ></Image>
            </button>
=======
export default function NewEntry() {
  return (
    <div className="new-entry">
      <h2 className="text-2xl md:text-3xl font-bold text-center py-4 text-black">New Entry</h2>

      <div className="flex justify-center pb-4 flex-wrap gap-4">
        <div className="flex flex-col items-center w-40">
          <Link
            href="/food_entry"
            className="inline-flex items-center justify-center w-full h-16 rounded-full bg-[var(--food)] hover:brightness-95 transition"
            aria-label="New food entry"
          >
            <Image src={food} alt="food icon" height={32} width={32} className="object-contain" />
          </Link>
        </div>

        <div className="flex flex-col items-center w-40">
          <Link
            href="/mood_entry"
            className="inline-flex items-center justify-center w-full h-16 rounded-full bg-[var(--mood)] hover:brightness-95 transition"
            aria-label="New mood entry"
          >
            <Image src={mood} alt="mood icon" height={32} width={32} className="object-contain" />
          </Link>
        </div>

        <div className="flex flex-col items-center w-40">
          <Link
            href="/meds_entry"
            className="inline-flex items-center justify-center w-full h-16 rounded-full bg-[var(--meds)] hover:brightness-95 transition"
            aria-label="New meds entry"
          >
            <Image src={meds} alt="meds icon" height={32} width={32} className="object-contain" />
          </Link>
        </div>

        <div className="flex flex-col items-center w-40">
          <Link
            href="/bowel_entry"
            className="inline-flex items-center justify-center w-full h-16 rounded-full bg-[var(--bowel)] hover:brightness-95 transition"
            aria-label="New bowel entry"
          >
            <Image src={bowel} alt="bowel icon" height={32} width={32} className="object-contain" />
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
          </Link>
        </div>
      </div>
    </div>
  );
}

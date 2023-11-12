import Image from "next/image";
import Link from "next/link";

import food from "../public/img/food.png";
import mood from "../public/img/mood.png";
import meds from "../public/img/meds.png";
import bowel from "../public/img/bowel.png";

export default function Newentry() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center py-9">New Entry</h2>
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
            href="/food_entry"
            as="food_entry"
            className="bg-mood hover:bg-mood_hover rounded-full text-center py-2"
          >
            <button>
              <Image src={mood} alt="mood icon" height={35} width={35}></Image>
            </button>
          </Link>
        </div>
        <div className="flex flex-col mx-4 w-32 ">
          <Link
            href="/food_entry"
            as="food_entry"
            className="bg-meds hover:bg-meds_hover rounded-full text-center py-2"
          >
            <button>
              <Image src={meds} alt="meds icon" height={35} width={35}></Image>
            </button>
          </Link>
        </div>
        <div className="flex flex-col mx-4 w-32 ">
          <Link
            href="/food_entry"
            as="food_entry"
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
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";
import BellTypoGraphy from "@/components/BellTypoGraphy";
import MainHeader from "@/components/mobile/Header/MainHeader";
import Button from "@/components/ui/Button/Button";
import { useWindowSize } from "@/hooks/useWindowSize";
import { LineIcon, OneLineIcon } from "@/icons/Icons";
import {
  AnimalsEatIcon,
  BaghdariIcon,
  BehdashtIcon,
  CakeIcon,
  CleaingIcon,
  ColdDrinkIcon,
  HeramMazehIcon,
  OneUseabelIcon,
  SiniMazehIcon,
  TabkhIcon,
  TasisatIcon,
  WarmDrinkIcon,
} from "@/icons/mainIcons";
import Image from "next/image";
interface Item {
  icon: JSX.Element;
  label: string;
}
const data: Item[] = [
  {
    icon: <TabkhIcon />,
    label: "غذای آماده طبخ",
  },
  {
    icon: <AnimalsEatIcon />,
    label: "غذای حیوانات",
  },
  {
    icon: <BehdashtIcon />,
    label: "بهداشت و سلامت",
  },
  {
    icon: <OneUseabelIcon />,
    label: "لوازم یکبار مصرف",
  },
];
export default function Home() {
  const { width } = useWindowSize();
  const isMobile = width ? width < 1024 : false;

  if (isMobile) {
    return (
      <>
        <MainHeader noBorder={true} />
        <div className="mt-32">
          <div className="relative -top-8 w-full flex flex-col justify-start items-center">
            <div className="relative w-full max-w-[300px]">
              {/* <div className="relative bg-emerald-400 rounded-t-[160px] pt-8 pb-4 px-4">
              </div> */}
              <Image
                className="absolute top-[3.5rem] right-[-10px] w-[40px] z-30 rotate-90"
                src={"/images/main/waiw.svg"}
                width={1080}
                height={1080}
                quality={100}
                alt=""
              />
              <Image
                className="absolute top-[3.5rem] left-[-10px] w-[40px] z-30"
                src={"/images/main/waiw.svg"}
                width={1080}
                height={1080}
                quality={100}
                alt=""
              />
              <Image
                className="w-[300px] h-auto relative z-30"
                src={"/images/main/bg-main.svg"}
                width={1080}
                height={1080}
                quality={100}
                alt=""
                priority
              />
            </div>

            {/* Text and emoji section */}
            <div className="w-full flex flex-col justify-start items-center mt-4 relative">
              <h2 className="text-4xl font-black text-center leading-relaxed">
                تجربه‌ای شگفت‌انگیز
              </h2>
              <h2 className="text-4xl font-black w-[14rem] ml-5">در اقامت ویلا</h2>
              <Image
                className="w-[50px] h-auto absolute right-[calc(50%+80px)] top-[3.2rem]"
                src={"/images/main/imo.png"}
                width={1080}
                height={1080}
                quality={100}
                alt=""
              />
            </div>
            <div className="w-full flex flex-col justify-start items-center my-6">
              <OneLineIcon />
            </div>
            <p className="text-md text-gray-600 mt-4 text-center max-w-[400px]">
              بِل‌بوی با خدمات متمرکز در مناطق ویلایی
              <br />
              تجربه‌ای متفاوت برای&nbsp;
              <strong>میزبان</strong>&nbsp; و&nbsp;
              <strong>میهمان</strong>&nbsp; می‌سازد
            </p>
          </div>
          <div className="w-full flex flex-col justify-start items-center mt-10">
            <span className="text-4xl relative inline-block mr-1">
              <span className="relative z-10">خدمات بِل‌بوی</span>
              <span className="absolute bottom-2.5 left-0 w-full h-[8px] bg-[#FFFF00]"></span>
            </span>
          </div>
          <LineIcon />
          <div>
            <BellTypoGraphy farsi="بِل‌شاپ" english="Bell Shop" />
          </div>
          <div className="grid grid-cols-2 mt-8 gap-y-8">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col justify-start items-center gap-5">
                {item.icon}
                <p className="w-[4.6rem] text-center">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-start items-center my-8">
            <Button onXsIsText icon="left">
              مشاهده
            </Button>
          </div>
          <LineIcon className="rotate-180" />
          <div>
            <BellTypoGraphy farsi="بِل‌مزه" english="Bell Mazeh" className="!rotate-[3deg]" />
          </div>
          <div className="grid grid-cols-2 mt-8 gap-y-8">
            <div className="flex flex-col justify-start items-center gap-5">
              <HeramMazehIcon className="w-16 h-16" />
              <p className="w-[4.6rem] text-center">هرم مزه</p>
            </div>
            <div className="flex flex-col justify-start items-center gap-5">
              <SiniMazehIcon className="w-16 h-16" />
              <p className="w-[4.6rem] text-center">سینی مزه</p>
            </div>
          </div>
          <div className="flex flex-col justify-start items-center my-8">
            <Button onXsIsText icon="left">
              مشاهده
            </Button>
          </div>
          <LineIcon />
          <div>
            <BellTypoGraphy farsi="بِل‌کافه" english="Bell Cafeh" className="!rotate-[3deg]" />
          </div>
          <div className="grid grid-cols-3 mt-8 gap-y-8">
            <div className="flex flex-col justify-start items-center gap-5">
              <WarmDrinkIcon />
              <p className="w-[4.6rem] text-center">نوشیدنی گرم</p>
            </div>
            <div className="flex flex-col justify-start items-center gap-5">
              <ColdDrinkIcon />
              <p className="w-[4.6rem] text-center">نوشیدنی سرد</p>
            </div>
            <div className="flex flex-col justify-start items-center gap-5">
              <CakeIcon />
              <p className="w-[5rem] text-center">کیک و دسر</p>
            </div>
          </div>
          <div className="flex flex-col justify-start items-center my-8">
            <Button onXsIsText icon="left">
              مشاهده
            </Button>
          </div>
          <LineIcon className="rotate-180" />
          <div>
            <BellTypoGraphy farsi="بِل‌سرویس" english="Bell Service" />
          </div>
          <div className="grid grid-cols-3 mt-8 gap-y-8">
            <div className="flex flex-col justify-start items-center gap-5">
              <TasisatIcon />
              <p className="w-[5.8rem] text-center">تأسیسات</p>
            </div>
            <div className="flex flex-col justify-start items-center gap-5">
              <CleaingIcon />
              <p className="w-[5.8rem] text-center">نظافت داخلی و خارجی</p>
            </div>
            <div className="flex flex-col justify-start items-center gap-5">
              <BaghdariIcon />
              <p className="w-[5rem] text-center">باغداری و آبیاری</p>
            </div>
          </div>
          <div className="flex flex-col justify-start items-center my-8">
            <Button onXsIsText icon="left">
              مشاهده
            </Button>
          </div>
          <LineIcon />
          <div>
            <BellTypoGraphy farsi="بِل‌رنت" english="Bell Rent" />
          </div>
          <div className="flex flex-col justify-start items-center">
            <div className="px-2 rounded-full font-bold bg-[#FFFF00] border-[2.4px] border-black rotate-6">
              بزودی
            </div>
          </div>
          <LineIcon className="rotate-180" />
          <div className="w-full flex flex-col justify-start items-center mt-10">
            <span className="text-4xl relative inline-block mr-1">
              <span className="relative z-10">مزایا</span>
              <span className="absolute bottom-2.5 left-0 w-full h-[8px] bg-[#FFFF00]"></span>
            </span>
          </div>
          <div className="w-full flex flex-col justify-between px-8 mt-8">
            <div className="w-full flex justify-start">test</div>
            <div className="w-full flex justify-end">test</div>
            <div className="w-full flex justify-start">test</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mt-20">is windows</div>
    </>
  );
}
// const ThemeSelectorCheckBox = ({ darkMode, setDarkMode }: any) => {
//   return (
//     <section className="mb-6">
//       <h3 className="text-md font-medium mb-2">ظاهر</h3>
//       <div className="flex items-center justify-between">
//         <span className="flex items-center">
//           <Moon size={20} className="ml-2" />
//           حالت تاریک
//         </span>
//         <label className="relative inline-flex items-center cursor-pointer">
//           <input
//             type="checkbox"
//             className="sr-only peer"
//             checked={darkMode}
//             onChange={() => setDarkMode(!darkMode)}
//           />
//           <CheckMark isChecked={darkMode} />
//         </label>
//       </div>
//     </section>
//   );
// };
// const CheckMark = ({ isChecked }: any) => {
//   return (
//     <div
//       className={`w-6 h-6 rounded-md border-2 border-black flex items-center justify-center ${
//         isChecked ? "bg-primary-400" : "bg-white"
//       }`}
//     >
//       {isChecked && (
//         <svg
//           className="w-4 h-4 text-black"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//         </svg>
//       )}
//     </div>
//   );
// };

{
  /* <section className="mb-6">
<h3 className="text-md font-medium mb-2">ظاهر</h3>
<div className="flex items-center justify-between">
  <span className="flex items-center">
    <Moon size={20} className="ml-2" />
    حالت تاریک
  </span>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={darkMode}
      onChange={() => setDarkMode(!darkMode)}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-400"></div>
  </label>
</div>
</section> */
}

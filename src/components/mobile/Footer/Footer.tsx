import {
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
  TwoLineIcon,
  WhatsAppIcon,
  XIcon,
} from "@/icons/Icons";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center bg-black text-white px-8 text-center w-full relative bottom-0 h-[110vh]">
      <div className="w-full max-w-3xl  flex flex-col justify-center items-center gap-16">
        <div className="w-full md:max-w-lg flex flex-col gap-8 mt-16">
          <p className="text-md font-light">ما را دنبال کنید</p>
          <div className="w-full flex flex-row justify-between items-center gap-3">
            <InstagramIcon />
            <TelegramIcon />
            <LinkedinIcon />
            <XIcon />
            <WhatsAppIcon />
          </div>
        </div>
        <div className="w-full">
          <TwoLineIcon />
          {/* <Image
            width={1080}
            height={150}
            className="w-full"
            src="/images/icons/oneline.svg"
            alt=""
          /> */}
        </div>
        <div className="w-full flex flex-col items-start gap-8">
          <Link className="text-sm" href={""}>
            پرسش‌های شما
          </Link>
          <Link className="text-sm" href={""}>
            شعبه‌های ما
          </Link>
          <Link className="text-sm" href={""}>
            درباره میزبانو
          </Link>
          <Link className="text-sm" href={""}>
            قوانین و شرایط استفاده
          </Link>
          <Link className="text-sm" href={""}>
            حریم خصوصی
          </Link>
        </div>
        <div className="w-full">
          <TwoLineIcon />
          {/* <Image
            width={1080}
            height={150}
            className="w-full"
            src="/images/icons/oneline.svg"
            alt=""
          /> */}
        </div>
        {/* <div className="text-sm font-light">
          <p>© کلیه حقوق برای میزبانو محفوظ است</p>
          <p>
            طراحی شده توسط <span className="text-blue-500">استودیو نیوا</span>
          </p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;

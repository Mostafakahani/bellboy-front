import Image from "next/image";

interface HandTypeItem {
  bold: string;
  normal: string;
}

interface HandTypeProps {
  items: HandTypeItem[];
}

const HandType: React.FC<HandTypeProps> = ({ items }) => {
  return (
    <div className="p-4">
      {items.map((item, index) => (
        <div key={index} className="flex flex-row items-start gap-2 mb-4">
          <Image src="/images/icons/hand.png" width={24} height={24} alt="hand" />
          <p className="text-sm text-black font-light text-right">
            <span className="font-bold relative inline-block mr-1">
              <span className="relative z-10">{item.bold}</span>
              <span className="absolute bottom-1 left-0 w-full h-[4px] bg-yellow-200"></span>
            </span>
            {item.normal}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HandType;

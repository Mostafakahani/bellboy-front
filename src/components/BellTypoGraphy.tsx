const BellTypoGraphy = ({
  farsi,
  english,
  className,
}: {
  farsi: string;
  english: string;
  className?: string;
}) => {
  return (
    <div className="w-full bg-white p-4 inline-block">
      <div className="text-center flex justify-center flex-col items-center">
        <h1 className="text-3xl font-black mb-1">{farsi}</h1>
        <p
          className={
            "relative w-fit bg-black px-1 rounded-lg text-2xl font-lobester text-white transform rotate-[-3deg] -top-1 transition-transform duration-500 hover:rotate-12 " +
            className
          }
        >
          {english}
        </p>
      </div>
    </div>
  );
};

export default BellTypoGraphy;

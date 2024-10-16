export const InputRadio = ({ darkMode, setDarkMode, className }: any) => {
  return (
    <section className={className}>
      <div className="flex flex-col">
        <label
          key={darkMode}
          className={`inline-flex items-center cursor-pointer ${
            darkMode === darkMode ? "opacity-100" : "opacity-90"
          }`}
        >
          <input
            type="radio"
            name="theme"
            value={darkMode}
            className="sr-only peer"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <div className="relative w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">
            <div
              className={`w-4 h-4 rounded-full peer-checked:bg-primary-400 border-black ${
                darkMode ? "bg-primary-400 border-2" : "bg-white border-0 "
              }`}
            ></div>
          </div>
        </label>
      </div>
    </section>
  );
};

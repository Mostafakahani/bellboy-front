// types.ts
type PathConfig = {
  [key: string]: {
    type: string;
    pattern: string;
  };
};

export const pathConfigs: PathConfig = {
  "/bell-shop": {
    type: "shop",
    pattern: "^/bell-shop/?.*", // الگو رو تغییر دادیم تا اسلش اختیاری باشه
  },
  "/bell-mazeh": {
    type: "mazeh",
    pattern: "^/bell-mazeh/?.*", // الگو رو تغییر دادیم تا اسلش اختیاری باشه
  },
  // می‌توانید پترن‌های دیگر را اینجا اضافه کنید
};

export const getPathType = (path: string): string | null => {
  // حذف اسلش‌های اضافی از ابتدا و انتها
  const normalizedPath = path.replace(/\/+$/, "").replace(/^\/+/, "/");

  for (const [basePath, config] of Object.entries(pathConfigs)) {
    const regex = new RegExp(config.pattern);
    console.log(basePath);
    if (regex.test(normalizedPath)) {
      return config.type;
    }
  }

  return null;
};

// یک تابع کمکی برای استخراج base path
export const getBasePath = (path: string): string | null => {
  const normalizedPath = path.replace(/\/+$/, "").replace(/^\/+/, "/");

  for (const basePath of Object.keys(pathConfigs)) {
    if (normalizedPath.startsWith(basePath)) {
      return basePath;
    }
  }

  return null;
};

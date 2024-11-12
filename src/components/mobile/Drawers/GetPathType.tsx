type PathConfig = {
  [key: string]: {
    type: string;
    pattern: string;
  };
};

export const pathConfigs: PathConfig = {
  "/bell-shop": {
    type: "shop",
    pattern: "^/bell-shop/?.*",
  },
  "/bell-mazeh": {
    type: "shop",
    pattern: "^/bell-mazeh/?.*",
  },
  "/bell-clean": {
    type: "clean",
    pattern: "^/bell-clean/?.*",
  },
  "/bell-service": {
    type: "service",
    pattern: "^/bell-service/?.*",
  },
};

export const getPathType = (path: string): string | null => {
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

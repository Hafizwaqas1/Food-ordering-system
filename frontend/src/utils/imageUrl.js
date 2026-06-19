const BASE_URL = "https://hafiz899.pythonanywhere.com";

export const getImageUrl = (path) => {
  if (!path) return "/default.jpg";

  if (path.startsWith("http")) {
    return path;
  }

  return `${BASE_URL}${path}`;
};
// const BASE_URL = "https://hafiz899.pythonanywhere.com";

// export const getImageUrl = (path) => {
//   if (!path) return "/default.jpg";

//   if (path.startsWith("http")) {
//     return path;
//   }

//   return `${BASE_URL}${path}`;
// };

const BASE_URL = "https://hafiz899.pythonanywhere.com";

export const getImageUrl = (path) => {
  if (!path) return "/default.jpg";

  if (path.startsWith("http")) {
    return path;
  }

  // FIX DOUBLE /MEDIA/ ISSUE
  let cleanPath = path;

  if (cleanPath.startsWith("/media/media/")) {
    cleanPath = cleanPath.replace("/media/media/", "/media/");
  }

  return `${BASE_URL}${cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath}`;
};
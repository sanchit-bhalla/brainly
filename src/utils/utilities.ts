export const extractEmbeddId = (url: string) => {
  let embeddId;
  if (url.includes("youtube.com/watch?v=")) {
    embeddId = url.split("v=")[1];
    const ampersandPosition = embeddId.indexOf("&");
    if (ampersandPosition !== -1) {
      embeddId = embeddId.substring(0, ampersandPosition);
    }
  } else if (url.includes("youtu.be/")) {
    embeddId = url.split("youtu.be/")[1];
    const questionmarkPosition = embeddId.indexOf("?");
    if (questionmarkPosition !== -1) {
      embeddId = embeddId.substring(0, questionmarkPosition);
    }
  }
  return embeddId;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB");
};

export const getYTVideoUrl = (embeddUrl: string) => {
  if (embeddUrl.startsWith("https://www.youtube.com/embed")) {
    const embedId = embeddUrl.split("embed/")?.[1];
    return `https://youtu.be/${embedId}`;
  }
  return null;
};

export const copyToClipboard = async (link: string | null) => {
  if (!link) return false;
  try {
    await navigator.clipboard.writeText(link);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const extractTwitterPostId = (url: string | null) => {
  if (!url) return null;

  const splitArr = url.split("/");
  return splitArr[splitArr.length - 1];
};

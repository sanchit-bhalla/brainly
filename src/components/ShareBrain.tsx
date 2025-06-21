import { useEffect, useState } from "react";
import { ShareIcon } from "../icons/ShareIcon";
import Button from "./Button";
import useAxios from "../hooks/useAxios";
import { copyToClipboard } from "../utils/utilities";
import { useNotification } from "../hooks/useNotification";
import { BACKEND_HOST } from "../constants";

interface ShareBrainProps {
  published: boolean;
  setPublished: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareBrain: React.FC<ShareBrainProps> = ({ published, setPublished }) => {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const axios = useAxios();
  const { addNotification } = useNotification();

  const getSharableLink = async () => {
    if (link) {
      copyToClipboard(link);
      addNotification("Link Copied to clipboad", 2000, 300, "success");
      return;
    }

    try {
      setLoading(true);

      const response = await axios({
        url: `${BACKEND_HOST}/api/v1/brain/share`,
        method: "POST",
        data: {
          share: true,
        },
        withCredentials: true, // Ensure credentials are sent with the request
      });

      const newLink = `https://brainlydotai.netlify.app/brain/${response?.data?.data?.hash}`;
      setLink(newLink);
      copyToClipboard(newLink);
      setPublished(true);
      addNotification("Link Copied to clipboad", 2000, 300, "success");
    } catch (err) {
      console.log(err);
      addNotification("Link Not Copied", 2000, 300, "fail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!published) setLink("");
  }, [published]);

  return (
    <Button
      title="Share Brain"
      size="md"
      variant="secondary"
      startIcon={!loading ? <ShareIcon size="md" /> : null}
      loading={loading}
      onClick={getSharableLink}
    />
  );
};

export default ShareBrain;

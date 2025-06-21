import React, { useState } from "react";
import { BrainContent } from "../../types/types";
import Button from "./Button";
import YoutubeIcon from "../icons/YoutubeIcon";
import TwitterIcon from "../icons/TwitterIcon";
import { ShareIcon } from "../icons/ShareIcon";
import DeleteIcon from "../icons/DeleteIcon";
import {
  copyToClipboard,
  extractTwitterPostId,
  formatDate,
  getYTVideoUrl,
} from "../utils/utilities";
import Modal from "./Modal";
import DeleteContent from "./DeleteContent";
import { useNotification } from "../hooks/useNotification";
import { Tweet } from "react-tweet";
// import PdfIcon from "../icons/PdfIcon";
// import TextImageIcon from "../icons/TextImageIcon";
import { useLocation } from "react-router-dom";
import TextIcon2 from "../icons/TextIcon2";
import PdfIcon2 from "../icons/PdfIcon2";

interface ContentCardProps {
  content: BrainContent;
}

const IconColor = "oklch(0.446 0.043 257.281)";

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const { addNotification } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const { pathname } = useLocation();
  const closeModal = () => setShowModal(false);

  const creationDate = formatDate(content.createdAt);
  const renderIcon = () => {
    return null; // as of now
    if (content.type === "youtube")
      return <YoutubeIcon width={30} height={30} color={IconColor} />;
    else if (content.type === "tweet")
      return <TwitterIcon width={30} height={30} color={IconColor} />;
    else return null;
  };

  const renderContent = () => {
    if (content.type === "youtube") {
      return (
        <iframe
          width="100%"
          //   height="315"
          src={content.link}
          title={content.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          //   className="w-full h-64 md:h-80"
          className="w-full"
        ></iframe>
      );
    } else if (content.type === "tweet") {
      const postId = extractTwitterPostId(content.link);
      if (postId) return <Tweet id={postId} />;
      else
        return (
          <div className="h-32 bg-slate-100 flex justify-center items-center">
            <p className="opacity-50">Could not load post</p>
          </div>
        );
    } else if (content.type === "pdf") {
      return (
        <div className="w-full p-2 bg-slate-100 flex justify-center items-center">
          {/* <PdfIcon width={80} height={80} /> */}
          {/* <PdfIcon width={150} /> */}
          <PdfIcon2 width={150} />
        </div>
      );
    } else if (content.type === "text") {
      return (
        <div className="w-full p-2 bg-slate-100 flex justify-center items-center">
          {/* <TextImageIcon width={150} height={150} /> */}
          {/* <TextIcon2 width={150} /> */}
          <TextIcon2 width={150} color="#0076cd" />
        </div>
      );
    } else {
      return null;
    }
  };

  const handleShare = async () => {
    let link: string | null = content.link;
    if (content.type === "youtube") {
      link = getYTVideoUrl(content.link);
    }
    const isCopied = await copyToClipboard(link);
    if (isCopied)
      addNotification("Link copied to clipboard", 2000, 300, "neutral");
  };

  return (
    <div className="bg-whites rounded-lg px-3 py-4 mb-6 border border-slate-200 break-inside-avoid max-h-fit_">
      <div className="flex justify-between items-center mb-5 gap-3 pb-1 border-b border-b-slate-100">
        <div className="flex items-center gap-2">
          <span></span>
          {renderIcon()}
          <h3 className="text-2xl font-semibold_">{content.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="p-2 rounded-full cursor-pointer hover:bg-slate-100"
            onClick={handleShare}
          >
            <ShareIcon size="md" color={IconColor} />
          </div>
          {!pathname.includes("/brain/") && (
            <div
              className="p-2 rounded-full cursor-pointer hover:bg-slate-100"
              onClick={() => setShowModal(true)}
            >
              <DeleteIcon width={20} height={20} color={IconColor} />
            </div>
          )}
        </div>
      </div>
      {renderContent()}
      {content.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {content.tags.map((tag) => (
            <Button
              key={tag}
              title={`# ${tag}`}
              size="sm"
              variant="secondary"
            />
          ))}
        </div>
      )}
      <p className="text-md  mt-4">
        Added on <span className="text-slate-600">{creationDate}</span>
      </p>

      {showModal && (
        <Modal isOpen={showModal} onClose={closeModal}>
          <DeleteContent content={content} closeModal={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ContentCard;

import { useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";
import Button from "./Button";
import useAxios from "../hooks/useAxios";
import useBrain from "../hooks/useBrain";
import { BACKEND_HOST } from "../constants";
import { BrainContent } from "../../types/types";
import { useNotification } from "../hooks/useNotification";

interface DeleteContentProps {
  content: BrainContent;
  closeModal: () => void;
}

const DeleteContent: React.FC<DeleteContentProps> = ({
  content,
  closeModal,
}) => {
  const axios = useAxios();
  const { refetchBrain } = useBrain();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      await axios({
        url: `${BACKEND_HOST}/api/v2/content/${content._id}`,
        method: "DELETE",
        withCredentials: true,
      });

      addNotification("Content Deleted successfully.", 2000, 300, "success");

      refetchBrain();

      closeModal();
    } catch (err) {
      console.log(err);
      setError("Some error occured while deleting the content!");
    }
  };
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{content.title}</h2>
      <p className="mb-2">Are you sure, you want to delete ?</p>
      {error && (
        <p className="mb-2 text-red-500">{`Could Not Delete the content. ${error}`}</p>
      )}
      <div className="flex items-center gap-4">
        <Button
          title="Delete"
          size="md"
          variant="danger"
          startIcon={!loading ? <DeleteIcon width={25} height={25} /> : null}
          loading={loading}
          onClick={handleDelete}
        />
        <Button
          title="Cancel"
          size="md"
          variant="neutral"
          onClick={closeModal}
        />
      </div>
    </div>
  );
};

export default DeleteContent;

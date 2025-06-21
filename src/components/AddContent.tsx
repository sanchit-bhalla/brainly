import React, { useEffect, useState } from "react";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import Input from "./Input";
import Button from "./Button";
import { extractEmbeddId } from "../utils/utilities";
import useAxios from "../hooks/useAxios";
import useBrain from "../hooks/useBrain";
import { BACKEND_HOST } from "../constants";
import { useNotification } from "../hooks/useNotification";
import FileUploadIcon from "../icons/FileUploadIcon";

type contentType = "youtube" | "tweet" | "pdf" | "text" | "";
interface FormType {
  title: string;
  link?: string;
  type: contentType;
  file: File | null;
}

const AddContent: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { addNotification } = useNotification();
  const axios = useAxios();
  const { refetchBrain } = useBrain();
  const [formData, setFormData] = useState<FormType>({
    title: "",
    link: "",
    type: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileId, setFileId] = useState("");

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  const handleFileSelect = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");

    if (formData.type === "pdf") el.setAttribute("accept", "application/pdf");
    else if (formData.type === "text") el.setAttribute("accept", "text/plain");

    el.addEventListener("change", async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        console.log(file);
        if (
          (formData.type === "pdf" && file?.type !== `application/pdf`) ||
          (formData.type === "text" && file?.type !== `text/plain`)
        ) {
          setFormData((prev) => ({ ...prev, file: null }));
          setErrMsg("Please select the correct file type");
          return;
        }
        setFormData((prev) => ({ ...prev, file }));
        setErrMsg("");
      }
    });
    el.click();
  };

  const handleUpload = async () => {
    const file = formData.file;

    if (!file) {
      setErrMsg("File not selected!");
      return;
    }

    // Retrieve authentication parameters for the upload.
    let authParams, publicKey;
    try {
      const response = await axios({
        url: `${BACKEND_HOST}/api/v1/imagekit/auth`,
        method: "GET",
        withCredentials: true, // Ensure credentials are sent with the request
      });
      authParams = response.data?.data?.authParams;
      publicKey = response.data?.data?.publicKey;
      // console.log(authParams, publicKey);
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      setErrMsg("Failed to authenticate for upload");
      return;
    }

    const { signature, expire, token } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      // console.log("Upload response:", uploadResponse);

      setFileId(uploadResponse?.fileId || "");
      setFormData((prev) => ({ ...prev, link: uploadResponse?.url }));
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
      setErrMsg("Some error occured while uploading file");
    }
  };

  const handleDelete = async () => {
    if (!fileId) return;

    try {
      await axios({
        url: `${BACKEND_HOST}/api/v1/imagekit`,
        method: "DELETE",
        data: { fileId },
        withCredentials: true, // Ensure credentials are sent with the request
      });
      // console.log(authParams, publicKey);
    } catch (authError) {
      console.error(
        `Failed to delete the uploaded file with id: ${fileId} \n`,
        authError
      );
    } finally {
      setFileId("");
    }
  };

  const addContent = async () => {
    const { title, link, type } = formData;
    let embeddUrl;
    if (type === "youtube") {
      const embeddId = extractEmbeddId(link || "");

      if (!embeddId) {
        setFormData((prev) => ({ ...prev, link: "" }));
        setErrMsg("Please provide correct Youtube url");
        return;
      }
      embeddUrl = `https://www.youtube.com/embed/${embeddId}`;
    } else if (type === "tweet") {
      if (link?.startsWith("https://x.com/")) embeddUrl = link;
      else {
        setFormData((prev) => ({ ...prev, link: "" }));
        setErrMsg("Please provide correct twitter post url");
        return;
      }
    } else {
      embeddUrl = link;
    }
    try {
      setLoading(true);

      // const formData = new FormData();
      // formData.append("type", type);
      // formData.append("title", title);
      // formData.append("link", embeddUrl || "");
      // formData.append("tags", JSON.stringify([]));

      // if (file) formData.append("uploaded_file", file);
      // await axios({
      //   url: `${BACKEND_HOST}/api/v1/content`,
      //   method: "POST",
      //   data: formData,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      //   withCredentials: true,
      // });

      await axios({
        url: `${BACKEND_HOST}/api/v2/content`,
        method: "POST",
        data: {
          type,
          title,
          link: embeddUrl || "",
          tags: JSON.stringify([]),
          fileId: fileId || undefined,
        },
        withCredentials: true,
      });

      addNotification("Content Added successfully.", 2000, 300, "success");

      refetchBrain();

      closeModal();
    } catch (err) {
      console.log(err);
      addNotification("Content Not Added.", 2000, 300, "fail");
      setErrMsg("Some error occured while adding new content!");
    }
  };

  const handleClear = () => {
    setFormData({
      title: "",
      link: "",
      type: "",
      file: null,
    });
    // setFileId(""); // Don't set FileId = "" here else we can't be able to delete file from cloud
    setErrMsg("");
    setProgress(0);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string
  ) => {
    if (key === "type") {
      setFormData({
        type: e?.target?.value as contentType,
        title: "",
        link: "",
        file: null,
      });
      setErrMsg("");
      setProgress(0);
      return;
    }

    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    const deletePreviousAndUploadNewFile = async () => {
      // File changed or removed. We first need to delete the previous uploaded file
      if (fileId) await handleDelete();

      const file = formData.file;
      if (file) {
        // console.log(file);
        await handleUpload();
      }
    };

    deletePreviousAndUploadNewFile();
  }, [formData.file]);

  const { title, link, type, file } = formData;
  let isAddButtonDisabled =
    type.trim().length === 0 || title.trim()?.length === 0;

  if (type === "pdf" || type === "text") {
    if (!file || progress < 100 || link?.trim()?.length === 0)
      isAddButtonDisabled = true;
  } else if (link?.trim().length === 0) isAddButtonDisabled = true;

  return (
    <div>
      <h2 className="text-xl mb-4">Add Content</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => handleChange(e, "type")}
            className="block w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
          >
            <option value="">Select Type</option>
            <option value="youtube">YouTube</option>
            <option value="tweet">Tweet</option>
            <option value="pdf">PDF</option>
            <option value="text">Text</option>
          </select>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => handleChange(e, "title")}
          />
        </div>
        {(type === "tweet" || type === "youtube") && (
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Link"
              value={link || ""}
              onChange={(e) => handleChange(e, "link")}
            />
          </div>
        )}
        {(type === "pdf" || type === "text") && (
          <div className="mb-4">
            <section
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-white"
              style={{
                backgroundImage: "radial-gradient(gray 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
              onClick={handleFileSelect}
            >
              <FileUploadIcon width={50} height={50} color="gray" />
              <span className="my-2 text-lg text-slate-500">Upload File</span>
            </section>
            {file && (
              <div>
                {progress != 100 ? (
                  <span className="text-sm">
                    ({progress} % completed) Uploading...
                  </span>
                ) : (
                  <span className="text-sm text-purple-600">
                    ✅ {file.name} <i>selected</i>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        {errMsg && <p className="text-red-500">{errMsg}</p>}
        <div className="mt-4 flex gap-4">
          <Button
            title="Add"
            size="md"
            variant="primary"
            loading={!errMsg && loading}
            disabled={isAddButtonDisabled}
            onClick={addContent}
          />
          <Button
            title="Clear"
            size="md"
            variant="secondary"
            onClick={handleClear}
          />
        </div>
      </form>
    </div>
  );
};

export default AddContent;

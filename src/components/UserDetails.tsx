import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import { BACKEND_HOST } from "../constants";
import { useNotification } from "../hooks/useNotification";

interface UserDetailsProps {
  published: boolean;
  setPublished: React.Dispatch<React.SetStateAction<boolean>>;
}

function UserDetails({ published, setPublished }: UserDetailsProps) {
  const axios = useAxios();
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();

  const unpublishBrain = async () => {
    try {
      await axios({
        url: `${BACKEND_HOST}/api/v1/brain/share`,
        method: "POST",
        data: {
          share: false,
        },
        withCredentials: true, // Ensure credentials are sent with the request
      });
      setPublished(false);
      addNotification("Brain Unpublished successfully!", 2000, 300, "success");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="absolute  right-0 top-14 bg-white px-4 py-2 rounded-md min-w-[150px] shadow-lg">
      <div className=" py-2 border-b border-b-slate-200">
        Welcome {user?.username || "Guest"} !
      </div>
      {published && (
        <div
          className="py-2 cursor-pointer border-b border-b-slate-200"
          onClick={unpublishBrain}
        >
          Unpublish Brain
        </div>
      )}
      <div className="py-2 text-purple-600 cursor-pointer" onClick={logout}>
        Logout
      </div>
    </div>
  );
}

export default UserDetails;

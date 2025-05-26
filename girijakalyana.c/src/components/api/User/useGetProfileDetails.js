import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { del, get, post, put } from "../authHooks";
import TokenService from "../../token/tokenService";
import axios from "axios";

// Get all user profiles
export const useGetAllUsersProfiles = () => {
  return useQuery({
    queryKey: ["allUsersProfiles"],
    queryFn: async () => {
      const response = await get("/api/user/all-users-profiles");
      if (response?.success) {
        return response.users || [];
      } else {
        throw new Error(
          response?.message || "Failed to fetch all users profiles"
        );
      }
    },
  });
};

// Get single member details
export const useGetMemberDetails = (reg_No) => {
  return useQuery({
    queryKey: ["userDetails", reg_No],
    queryFn: async () => {
      const response = await get(`/api/user/profile/${reg_No}`);
      if (response?.success) {
        return response.data;
      } else {
        throw new Error(response?.message || "Failed to fetch member details");
      }
    },
    enabled: !!reg_No,
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const reg_No = TokenService.getRegistrationNo();

  return useMutation({
    mutationFn: async (data) => {
      return await put(`/api/user/update-profile/${reg_No}`, data);
    },
    onSuccess: (response) => {
      if (response?.success) {
        toast.success(response.message)
        queryClient.invalidateQueries({ queryKey: ["userDetails", reg_No] });
      }
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};

// Express interest mutation
export const useExpressInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sender,
      recipient,
      message,
    }) => {
      const { data } = await post("/api/user/interest", {
        sender,
        recipient,
        message,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Interest expressed successfully!');
      queryClient.invalidateQueries(['interestStatus','get-interes']);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error.message;

      if (errorMessage.includes('already expressed') || errorMessage.includes('Interest already exists')) {
        toast.info('You have already expressed interest to this user.');
      } else {
        toast.error('Failed to express interest. Please try again.');
      }
    }
  });
};

export const useGetReceivedInterests = (recipient) => {
  return useQuery({
    queryKey: ["receivedInterests", recipient],
    queryFn: async () => {
      const response = await get(
        `/api/user/interest/received/${recipient}`
      );

      return response;
    },
    enabled: !!recipient,
    staleTime: 1000 * 60 * 5,
  });
};

// Get interest status query
// api/User/useGetProfileDetails.js
export const useGetSentInterests = (sender) => {
  return useSuspenseQuery({
    queryKey: ["sentInterests", sender],
    queryFn: async () => {
      const data = await get(`/api/user/interest/sent/${sender}`);
      return data || { data: [], totalPages: 0 };
    },
  });
};

export const useUpdateInterestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sender,
      recipient,
      status,
    }) => {
      const { data } = await put(`/api/user/interest/${sender}`, {
        recipient,
        status,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Interest updated successfully!');
      queryClient.invalidateQueries(['interestStatus']);
      queryClient.invalidateQueries(['interests']);
    },
    onError: (error) => {
      toast.error('Failed to update interest. Please try again.');
    }
  });
};

export const useGetAcceptedInterests = (recipient) => {
  return useQuery({
    queryKey: ["acceptedInterests", recipient],
    queryFn: async () => {
      const response = await get(`/api/user/interest/accepted/${recipient}`);
      return response;
    },
    enabled: !!recipient,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error(error?.message || "Failed to fetch accepted interests.");
    }
  });
};


export const useCancelSentInterest = () => {
  return useMutation({
    mutationFn: ({ sender, recipient }) => {
      return del("/api/user/cancel", {
        data: {
          sender,
          recipient,
        },
      });
    },
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error("Failed to cancel interest");
    },
  });
};

export const getCloudinaryUrl = () => {
  return useMutation({
    mutationFn: async (file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
      const response = await axios.post(import.meta.env.VITE_CLOUDINARY_BASE_URL, data);
      return response.data;
    },
  });
};

const changePasswordAPI = async ({ registrationNo, oldPassword, newPassword }) => {
  return await post(`/api/user/change-password/${registrationNo}`, {
    oldPassword,
    newPassword,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePasswordAPI,
  });
};

export const useGetInterestCounts = (reg_No) => {
  return useSuspenseQuery({
    queryKey: ["sentInterests","acceptedInterests","receivedInterests", reg_No],
    queryFn: async () => {
      const data = await get(`/api/user/interest-counts/${reg_No}`);
      return data;
    },
  });
};

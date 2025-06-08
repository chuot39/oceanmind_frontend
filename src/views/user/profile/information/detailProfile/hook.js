import { useQuery } from "react-query";
import { API_BASE_URL } from "../../../../../constants";
import apiClient from "../../../../../utils/api";

// Fetch user profile by alias
export const useUserProfileByAlias = (alias) => {
    const fetchUserProfileByAlias = async () => {
        // TODO: Replace with actual API endpoint to fetch user by alias
        const response = await apiClient.get(`${API_BASE_URL}/users?username=${alias}`);
        const userData = response?.data?.data?.[0];

        // Fetch user social links
        const userSocialLinks = await apiClient.get(`${API_BASE_URL}/user-socials?userId=${userData?.documentId}&sortBy=createdAt&sortOrder=DESC`);
        const userSocialLinksData = userSocialLinks?.data?.data;

        return {
            ...userData,
            socialLinks: userSocialLinksData
        };

    };

    return useQuery(['user-profile-by-alias', alias], fetchUserProfileByAlias, {
        enabled: !!alias,
        refetchOnWindowFocus: false,
    });
};

export const useUserProjectsByUserId = (userId) => {
    const fetchUserProjectsByUserId = async () => {
        // TODO: Replace with actual API endpoint to fetch user projects by userId
        const response = await apiClient.get(`${API_BASE_URL}/projects/users/${userId}?sortBy=createdAt&sortOrder=DESC&limit=100`);
        return response?.data;
    };

    return useQuery(['user-projects-by-userId', userId], fetchUserProjectsByUserId, {
        enabled: !!userId,
        refetchOnWindowFocus: false,
    });
};

// Fetch user posts by alias
export const useUserPostsByAlias = (alias) => {
    const fetchUserPostsByAlias = async () => {
        // TODO: Replace with actual API endpoint to fetch user posts by alias
        // const response = await apiClient.get(`${API_BASE_URL}/posts?filters[author][alias][$eq]=${alias}&populate=*&sort=createdAt:DESC`);
        // return response?.data;

        // Mock data for development
        return {
            data: [
                {
                    id: 1,
                    title: "Getting Started with React",
                    content: "React is a JavaScript library for building user interfaces. It's declarative, efficient, and flexible.",
                    createdAt: "2023-10-15T10:30:00Z",
                    likes: 42,
                    comments: 8,
                    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop"
                },
                {
                    id: 2,
                    title: "Tailwind CSS Tips and Tricks",
                    content: "Tailwind CSS is a utility-first CSS framework that can speed up your development process.",
                    createdAt: "2023-09-20T14:15:00Z",
                    likes: 35,
                    comments: 5,
                    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2031&auto=format&fit=crop"
                }
            ]
        };
    };

    return useQuery(['user-posts-by-alias', alias], fetchUserPostsByAlias, {
        enabled: !!alias,
        refetchOnWindowFocus: false,
    });
};

// Fetch user achievements by alias
export const useUserAchievementsByAlias = (alias) => {
    const fetchUserAchievementsByAlias = async () => {
        // TODO: Replace with actual API endpoint to fetch user achievements by alias
        // const response = await apiClient.get(`${API_BASE_URL}/achievements?filters[user][alias][$eq]=${alias}&populate=*`);
        // return response?.data;

        // Mock data for development
        return {
            data: [
                {
                    id: 1,
                    title: "First Place in Hackathon 2023",
                    organization: "Tech Club",
                    date: "2023-05-15",
                    description: "Won first place in the annual hackathon with a project focused on education technology."
                },
                {
                    id: 2,
                    title: "Outstanding Student Award",
                    organization: "Thuy Loi University",
                    date: "2022-12-10",
                    description: "Recognized for academic excellence and contributions to the university community."
                }
            ]
        };
    };

    return useQuery(['user-achievements-by-alias', alias], fetchUserAchievementsByAlias, {
        enabled: !!alias,
        refetchOnWindowFocus: false,
    });
};

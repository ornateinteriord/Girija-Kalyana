export const isSilverOrPremiumUser = (role = " ") => {
     const normalizedRole = role.toLowerCase();
    return normalizedRole === "silveruser" || normalizedRole === "premiumuser";
}
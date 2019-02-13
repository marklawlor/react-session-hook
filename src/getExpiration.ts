import { Profile } from "./interfaces";

interface GetExpirationOptions {
  expiration?: Date | null;
  profile?: Profile;
}

const getExpiration = ({ expiration, profile }: GetExpirationOptions) => {
  if (expiration || expiration === null) {
    return expiration;
  }

  if (profile && profile.exp) {
    return new Date(profile.exp * 1000);
  }

  return new Date(Date.now() + 10 * 60 * 60 * 1000); // 10 hours
};

export default getExpiration;

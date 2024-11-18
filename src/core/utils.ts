import { GOOGLE_CLIENT_ID } from "./constants";

export const collapseAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const googleLogin = (nonce: string)=> {
  const baseUrl = import.meta.env.VITE_BASE_URL || '/';
  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     *
     * window.location.origin == http://localhost:5173
     */
    redirect_uri: `${window.location.origin}${baseUrl}callback`,
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: nonce,
  });
  redirectUrl.search = searchParams.toString();
  console.log(`${redirectUrl.toString()}`);
  window.location.href = redirectUrl.toString();
};
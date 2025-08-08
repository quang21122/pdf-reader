import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { supabase } from "@/utils/supabaseClient";

// Create HTTP link to your GraphQL endpoint
// You can use Hasura, Postgraphile, or custom GraphQL server
const httpLink = createHttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/api/graphql`
      : process.env.NODE_ENV === "production"
      ? "https://pdf-reader-gold.vercel.app/api/graphql"
      : "http://localhost:3000/api/graphql"),
});

// Auth link to add authorization header
const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create Apollo Client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

export { apolloClient };
export default apolloClient;

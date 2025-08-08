import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable GraphQL Playground in development
  includeStacktraceInErrorResponses: process.env.NODE_ENV === "development",
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    // Get authorization token from headers
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    return {
      token,
      req,
      headers: req.headers,
    };
  },
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

"use server";
import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = "7m7pmhda3pcj";
const apiKeySecret =
  "meevbeubtfs2pfhwk57kj7gcywmqb3mwh7pv4zaje4j9vhpmfbq69z3a357xkn8v";

export const tokenProvider = async () => {
  const user = await currentUser();
  if (!user) throw new Error("User is not logged");
  if (!apiKey) throw new Error("Api key error");
  if (!apiKeySecret) throw new Error("Api secret error");
  const streamClient = new StreamClient(apiKey, apiKeySecret);

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  const token = streamClient.createToken(user.id, expirationTime, issuedAt);

  return token;
};

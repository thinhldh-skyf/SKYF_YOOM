"use client";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { StreamChat } from "stream-chat";
import { tokenProvider } from "@/actions/stream";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader } from "@/components/ui/loader";

const apiKey = `${process.env.NEXT_PUBLIC_STREAM_API_KEY}`;

export const StreamVideoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const setup = async () => {
      if (!isLoaded || !user) return;
      if (!apiKey) throw new Error("Stream API key is missing");

      // 👇 Khởi tạo chat client
      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(
        {
          id: user.id,
          name: user.username || user.id,
          image: user.imageUrl,
        },
        tokenProvider
      );

      const client = new StreamVideoClient({
        apiKey: apiKey,
        user: {
          id: user.id,
          name: user.username || user.id,
          image: user.imageUrl,
        },
        tokenProvider,
      });

      // 👇 Gắn chatClient vào videoClient
      (client as any).chatClient = chatClient;

      setVideoClient(client);
    };

    setup();
  }, [user, isLoaded]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

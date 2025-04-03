import { useEffect, useState } from "react";
import {
  StreamVideoClient,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { StreamChat, Channel } from "stream-chat";

export function useChatChannel(callId: string) {
  const client = useStreamVideoClient();
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    if (!client || !callId) return;

    const videoClientWithChat = client as StreamVideoClient & {
      chatClient?: StreamChat;
    };

    const chatClient = videoClientWithChat.chatClient;
    if (!chatClient) return;

    const channel = chatClient.channel("messaging", callId, {
      name: `Chat for ${callId}`,
    });

    const init = async () => {
      await channel.watch();
      setChannel(channel);
    };  

    init();
  }, [client, callId]);

  const chatClient = (client as any)?.chatClient as StreamChat | undefined;

  return { channel, chatClient };
}

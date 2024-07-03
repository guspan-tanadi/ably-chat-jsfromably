import Ably from 'ably';

import { ChatClient } from '../../src/Chat.js';
import { ClientOptions, normaliseClientOptions } from '../../src/config.js';
import { testLoggingLevel } from './logger.js';
import { ablyRealtimeClientWithToken } from './realtimeClient.js';

export const newChatClient = (options?: ClientOptions, realtimeClient?: Ably.Realtime): ChatClient => {
  const normalisedOptions = normaliseClientOptions({
    ...options,
    logLevel: options?.logLevel ?? testLoggingLevel(),
  });
  realtimeClient = realtimeClient ?? ablyRealtimeClientWithToken();

  return new ChatClient(realtimeClient, normalisedOptions);
};

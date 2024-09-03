import { ChatClient, OccupancyEvent, OccupancyListener, RoomOptionsDefaults } from '@ably/chat';
import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { useOccupancy } from '../../../src/react/hooks/use-occupancy.ts';
import { ChatClientProvider } from '../../../src/react/providers/chat-client-provider.tsx';
import { ChatRoomProvider } from '../../../src/react/providers/chat-room-provider.tsx';
import { newChatClient } from '../../helper/chat.ts';
import { waitForExpectedInbandOccupancy } from '../../helper/common.ts';

describe('useOccupancy', () => {
  it('should receive occupancy updates', async () => {
    // create new clients
    const chatClient = newChatClient() as unknown as ChatClient;
    const chatClientTwo = newChatClient() as unknown as ChatClient;
    const chatClientThree = newChatClient() as unknown as ChatClient;

    // create two more rooms and attach to contribute towards occupancy metrics
    const roomTwo = chatClientTwo.rooms.get('room-id', RoomOptionsDefaults);
    const roomThree = chatClientThree.rooms.get('room-id', RoomOptionsDefaults);
    await roomTwo.attach();
    await roomThree.attach();

    // join presence to contribute to present members metric
    await roomTwo.presence.enter();
    await roomThree.presence.enter();

    // store for the state received from the hook
    let occupancyState: { connections: number; presenceMembers: number } = { connections: 0, presenceMembers: 0 };

    const TestComponent = ({ listener }: { listener: OccupancyListener }) => {
      const { connections, presenceMembers } = useOccupancy({ listener: listener });

      occupancyState = { connections, presenceMembers };

      return null;
    };

    // store the received occupancy metrics
    const occupancyEvents: OccupancyEvent[] = [];

    const TestProvider = () => (
      <ChatClientProvider client={chatClient}>
        <ChatRoomProvider
          id="room-id"
          options={RoomOptionsDefaults}
        >
          <TestComponent listener={(occupancyEvent) => occupancyEvents.push(occupancyEvent)} />
        </ChatRoomProvider>
      </ChatClientProvider>
    );

    render(<TestProvider />);

    // wait for the occupancy events to be received
    await waitForExpectedInbandOccupancy(occupancyEvents, { connections: 3, presenceMembers: 2 }, 20000);

    // check the occupancy metrics
    expect(occupancyState.connections).toBe(3);
    expect(occupancyState.presenceMembers).toBe(2);
  }, 20000);
});
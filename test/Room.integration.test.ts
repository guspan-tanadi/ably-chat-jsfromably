import { beforeEach, describe, expect, it } from 'vitest';

import { ChatClient } from '../src/Chat.ts';
import { Room } from '../src/Room.ts';
import { RoomStatus } from '../src/RoomStatus.ts';
import { newChatClient } from './helper/chat.ts';
import { getRandomRoom } from './helper/room.ts';

interface TestContext {
  chat: ChatClient;
  room: Room;
}

describe('Room', () => {
  beforeEach<TestContext>((context) => {
    context.chat = newChatClient();
    context.room = getRandomRoom(context.chat);
  });

  it<TestContext>('should be attachable', async ({ room }) => {
    await room.attach();

    // We should be attached
    expect(room.status.currentStatus).toEqual(RoomStatus.Attached);

    // If we check the underlying channels, they should be attached too
    expect(room.messages.channel.state).toEqual('attached');
    expect(room.reactions.channel.state).toEqual('attached');
    expect(room.typing.channel.state).toEqual('attached');
    expect(room.presence.channel.state).toEqual('attached');
    expect(room.occupancy.channel.state).toEqual('attached');
  });

  it<TestContext>('should be detachable', async ({ room }) => {
    await room.attach();
    await room.detach();

    // We should be detached
    expect(room.status.currentStatus).toEqual(RoomStatus.Detached);

    // If we check the underlying channels, they should be detached too
    expect(room.messages.channel.state).toEqual('detached');
    expect(room.reactions.channel.state).toEqual('detached');
    expect(room.typing.channel.state).toEqual('detached');
    expect(room.presence.channel.state).toEqual('detached');
    expect(room.occupancy.channel.state).toEqual('detached');
  });
});

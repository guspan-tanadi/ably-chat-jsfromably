import Ably from 'ably';
import { ChatApi } from './ChatApi.js';
import { Messages, DefaultMessages } from './Messages.js';
import { Presence } from './Presence.js';
import { DefaultSubscriptionManager } from './SubscriptionManager.js';
import { DEFAULT_CHANNEL_OPTIONS } from './version.js';
import { DefaultTypingIndicator, TypingIndicators } from './TypingIndicator.js';
import { DefaultOccupancy, Occupancy } from './Occupancy.js';
import { ClientOptions } from './config.js';
import { RoomReactions, DefaultRoomReactions } from './RoomReactions.js';

export class Room {
  private readonly _roomId: string;
  private readonly chatApi: ChatApi;

  /**
   * Allows you to send, subscribe-to and query messages in the room.
   */
  readonly messages: Messages;
  private readonly _typingIndicators: TypingIndicators;
  readonly presence: Presence;
  readonly reactions: RoomReactions;
  private readonly _occupancy: Occupancy;
  private readonly realtimeChannelName: string;

  constructor(roomId: string, realtime: Ably.Realtime, chatApi: ChatApi, clientOptions: ClientOptions) {
    this._roomId = roomId;
    this.chatApi = chatApi;
    this.realtimeChannelName = `${this._roomId}::$chat::$chatMessages`;

    const subscriptionManager = new DefaultSubscriptionManager(
      realtime.channels.get(this.realtimeChannelName, DEFAULT_CHANNEL_OPTIONS),
    );
    this.messages = new DefaultMessages(roomId, subscriptionManager, this.chatApi, realtime.auth.clientId);
    this.presence = new Presence(subscriptionManager, realtime.auth.clientId);
    this._typingIndicators = new DefaultTypingIndicator(
      roomId,
      realtime,
      realtime.auth.clientId,
      clientOptions.typingTimeoutMs,
    );

    const reactionsManagedChannel = new DefaultSubscriptionManager(
      realtime.channels.get(`${this._roomId}::$chat::$reactions`, DEFAULT_CHANNEL_OPTIONS),
    );
    this.reactions = new DefaultRoomReactions(roomId, reactionsManagedChannel, realtime.auth.clientId);
    this._occupancy = new DefaultOccupancy(roomId, subscriptionManager, this.chatApi);
  }

  get roomId(): string {
    return this._roomId;
  }

  get typingIndicators(): TypingIndicators {
    return this._typingIndicators;
  }

  get occupancy(): Occupancy {
    return this._occupancy;
  }
}

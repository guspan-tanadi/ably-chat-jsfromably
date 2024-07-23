import { ConnectionStatusChange, RoomStatusChange } from '@ably/chat';
import * as Ably from 'ably';

/**
 * Parameters for registering callbacks to receive status changes from
 * different chat features.
 *
 * Most hooks provided in this library accept this parameter to allow you to
 * listen to status changes.
 *
 * It's an alternative to {@link ChatStatusResponse} which provide this
 * information via a callback.
 */
export interface StatusParams {
  /**
   * Register a callback for when the room status changes.
   * @param change Object representing the change in room status.
   */
  onRoomStatusChange?: (change: RoomStatusChange) => void;

  /**
   * Register a callback for when the connection status to Ably changes.
   * @param change Object representing the change in connection status.
   */
  onConnectionStatusChange?: (change: ConnectionStatusChange) => void;

  /**
   * Register a callback to detect and respond to discontinuities. For example,
   * you might choose to fetch missing messages.
   * @param error The error that caused the discontinuity.
   */
  onDiscontinuity?: (error?: Ably.ErrorInfo) => void;
}

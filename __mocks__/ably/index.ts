import Ably from 'ably'

const MOCK_CLIENT_ID = 'MOCK_CLIENT_ID';

const mockPromisify = <T>(expectedReturnValue): Promise<T> => new Promise((resolve) => resolve(expectedReturnValue));
const methodReturningVoidPromise = () => mockPromisify<void>((() => {})());

function createMockPresence() {
  return {
    get: () => mockPromisify<Ably.PresenceMessage[]>([]),
    update: () => mockPromisify<void>(undefined),
    enter: methodReturningVoidPromise,
    leave: methodReturningVoidPromise,
    subscriptions: {
      once: (_: unknown, fn: Function) => {
        fn();
      },
    },
    subscribe: () => {},
    unsubscribe: () => {},
  };
}

function createMockEmitter() {
  return {
    any: [],
    events: {},
    anyOnce: [],
    eventsOnce: {},
  };
}

function createMockChannel() {
  return {
    presence: createMockPresence(),
    subscribe: () => {},
    unsubscribe: () => {},
    on: () => {},
    off: () => {},
    publish: () => {},
    subscriptions: createMockEmitter(),
  };
}

class MockRealtime {
  public channels: {
    get: () => ReturnType<typeof createMockChannel>;
  };
  public auth: {
    clientId: string;
    requestToken(): void;
  };
  public connection: {
    id?: string;
    state: string;
  };

  public time() {}

  constructor(data) {
    const client_id = data.clientId || MOCK_CLIENT_ID;
    this.channels = {
      get: (() => {
        const mockChannel = createMockChannel();
        return () => mockChannel;
      })(),
    };
    this.auth = {
      clientId: client_id,
      requestToken: () => {},
    };
    this.connection = {
      id: '1',
      state: 'connected',
    };

    this['options'] = {};
  }
}

export { MockRealtime as Realtime };
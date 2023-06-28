import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { EventBridgeDetails } from '../interfaces/Event';

import { MissingEnvVarsError } from '../errors/MissingEnvVarsError';

/**
 * @description Factory function to return freshly minted EventBridge instance.
 */
export const createNewEventBridgeEmitter = () => {
  return new EventBridgeEmitter();
};

/**
 * @description An EventBridge implementation of the `EventEmitter`.
 */
class EventBridgeEmitter {
  private readonly eventBridge: EventBridgeClient;
  private readonly eventBusName: string;
  private readonly source: string;

  constructor() {
    const region = process.env.REGION;
    const eventBusName = process.env.EVENT_BUS_NAME;
    const source = process.env.EVENT_SOURCE;

    if (!region || !eventBusName || !source)
      throw new MissingEnvVarsError(
        JSON.stringify([
          { key: 'REGION', value: process.env.REGION },
          { key: 'EVENT_BUS_NAME', value: process.env.EVENT_BUS_NAME },
          { key: 'EVENT_SOURCE', value: process.env.EVENT_SOURCE }
        ])
      );

    this.eventBridge = new EventBridgeClient({ region: process.env.REGION || '' });
    this.eventBusName = eventBusName;
    this.source = source;
  }

  /**
   * @description Utility to emit events with the AWS EventBridge library.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html
   * @see https://www.npmjs.com/package/@aws-sdk/client-eventbridge
   */
  public async emit(events: EventBridgeDetails[]): Promise<void> {
    const entries = events.map((event: EventBridgeDetails) => {
      const { DetailType, Detail } = event;

      return {
        EventBusName: this.eventBusName,
        Source: this.source,
        DetailType: DetailType,
        Detail: Detail
      };
    });

    const command = new PutEventsCommand({ Entries: entries });
    if (process.env.NODE_ENV !== 'test') await this.eventBridge.send(command);
  }
}

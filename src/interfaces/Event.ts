/**
 * @description The shape of an input into EventBridge.
 */
export type EventBridgeEvent = {
  /**
   * @description Name of the EventBridge bus.
   */
  EventBusName: string;
  /**
   * @description Source of the event.
   */
  Source: string;
  /**
   * @description The type of event.
   */
  DetailType: string;
  /**
   * @description Input data as string.
   */
  Detail: string;
};

/**
 * @description Required details for our EventBridge emitter's `emit` method.
 */
export type EventBridgeDetails = Pick<EventBridgeEvent, 'DetailType' | 'Detail'>;

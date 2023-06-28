import { createNewEventBridgeEmitter } from '../infrastructure/EventEmitter';

import { MissingOptInOutEventParametersError } from '../errors/MissingOptInOutEventParametersError';

/**
 * @description Emit a single event representing the user being opted in/out.
 */
export async function emitEvent(detailType: string, message: Record<string, any>) {
  if (!detailType || !message) throw new MissingOptInOutEventParametersError();
  await createNewEventBridgeEmitter().emit([
    {
      DetailType: detailType,
      Detail: JSON.stringify(message)
    }
  ]);
}

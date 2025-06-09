import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

const eventbridge = new EventBridgeClient();

/**
 * Publishes an event to Amazon EventBridge
 * @param eventBusName The name of the event bus to publish to
 * @param source The source of the event
 * @param detailType The detail-type of the event
 * @param detail The event detail object
 * @returns Promise containing the result of the PutEvents operation
 */
async function publishToEventBridge(
  eventBusName: string,
  source: string,
  detailType: string,
  detail: Record<string, any>
): Promise<any> {
  try {
    const command = new PutEventsCommand({
      Entries: [
        {
          EventBusName: eventBusName,
          Source: source,
          DetailType: detailType,
          Detail: JSON.stringify(detail),
        },
      ],
    });

    const response = await eventbridge.send(command);
    return response;
  } catch (error) {
    console.error("Error publishing to EventBridge:", error);
    throw error;
  }
}

export { publishToEventBridge };

// Utility for BroadcastChannel
export class BroadcastChannelUtil {
  private channel: BroadcastChannel | null = null;
  private channelName: string;

  constructor(channelName: string) {
    this.channelName = channelName;
    this.init();
  }

  private init() {
    if (
      typeof window !== "undefined" &&
      typeof BroadcastChannel !== "undefined"
    ) {
      this.channel = new BroadcastChannel(this.channelName);
    }
  }

  // Send a message
  send(type: string, data: any) {
    if (this.channel) {
      const message = { type, data };
      this.channel.postMessage(message);
    } else {
      console.warn("Broadcast channel not available");
    }
  }

  // Listen to messages
  onMessage(callback: (type: string, data: any) => void) {
    if (this.channel) {
      this.channel.onmessage = (event) => {
        const { type, data } = event.data;
        callback(type, data);
      };
    }
  }

  // Close the channel
  close() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }

  // Check if the channel is available
  isAvailable(): boolean {
    return this.channel !== null;
  }
}

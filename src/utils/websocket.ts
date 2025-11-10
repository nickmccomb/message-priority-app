import type { Message } from "../types/message";
import { generateRandomMessage } from "./api";

type WebSocketStatus = "connecting" | "connected" | "disconnected" | "error";

interface WebSocketCallbacks {
  onMessage: (message: Message) => void;
  onStatusChange?: (status: WebSocketStatus) => void;
  onError?: (error: Error) => void;
}

/**
 * Mock WebSocket implementation for development
 * Simulates real-time message delivery by periodically generating random messages
 */
export class MockWebSocket {
  private callbacks: WebSocketCallbacks;
  private status: WebSocketStatus = "disconnected";
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private messageInterval: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseReconnectDelay = 1000; // 1 second

  constructor(callbacks: WebSocketCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Connect to the WebSocket (mocked)
   */
  connect(): void {
    if (this.status === "connected" || this.status === "connecting") {
      return;
    }

    this.setStatus("connecting");

    // Simulate connection delay
    setTimeout(() => {
      // Simulate occasional connection failures (10% chance)
      if (Math.random() < 0.1) {
        this.setStatus("error");
        this.callbacks.onError?.(new Error("Connection failed"));
        this.scheduleReconnect();
        return;
      }

      this.setStatus("connected");
      this.reconnectAttempts = 0;

      // Start receiving messages periodically
      this.startReceivingMessages();
    }, 500);
  }

  /**
   * Disconnect from the WebSocket
   */
  disconnect(): void {
    this.setStatus("disconnected");
    this.stopReceivingMessages();
    this.cancelReconnect();
  }

  /**
   * Start receiving messages periodically (simulates real-time delivery)
   */
  private startReceivingMessages(): void {
    this.stopReceivingMessages();

    let isFirstMessage = true;

    // Receive a message every 3-8 seconds (first message arrives in 1-2 seconds)
    const getNextDelay = () => {
      if (isFirstMessage) {
        isFirstMessage = false;
        return Math.random() * 1000 + 1000; // 1-2 seconds for first message
      }
      return Math.random() * 5000 + 3000; // 3-8 seconds for subsequent messages
    };

    const scheduleNext = () => {
      this.messageInterval = setTimeout(() => {
        if (this.status === "connected") {
          // Generate a random message with current timestamp to ensure unique ID
          const message = generateRandomMessage(Date.now());
          console.log(
            "WebSocket generating message:",
            message.id,
            message.subject
          );
          this.callbacks.onMessage(message);

          // Schedule next message
          scheduleNext();
        }
      }, getNextDelay());
    };

    // Start immediately with first message
    scheduleNext();
  }

  /**
   * Stop receiving messages
   */
  private stopReceivingMessages(): void {
    if (this.messageInterval) {
      clearTimeout(this.messageInterval);
      this.messageInterval = null;
    }
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setStatus("error");
      this.callbacks.onError?.(new Error("Max reconnection attempts reached"));
      return;
    }

    this.cancelReconnect();

    const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Cancel scheduled reconnection
   */
  private cancelReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Update status and notify callback
   */
  private setStatus(status: WebSocketStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.callbacks.onStatusChange?.(status);
    }
  }

  /**
   * Get current connection status
   */
  getStatus(): WebSocketStatus {
    return this.status;
  }
}

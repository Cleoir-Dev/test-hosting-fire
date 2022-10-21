export interface MessageFCM {
  message?: Message
}

export interface Message {
  notification?: Notification
  token?: string
}

export interface Notification {
  title?: string
  body?: string
}

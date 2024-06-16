export interface IUser {
  id: string | null
  username: string
  avatar?: string
  has_unread_messages?: boolean
  active?: boolean
}
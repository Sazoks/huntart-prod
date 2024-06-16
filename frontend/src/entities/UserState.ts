import { IUser } from "./User"
import { IProfile } from "./Profile"

export interface IUserState {
  id: string | null
  username: string
  is_active: boolean
  profile: IProfile | null
  followers: IUser[] | null
  followers_count: number | null
  subscriptions:  IUser[] | [] | null
  subscriptions_count: number | null
}
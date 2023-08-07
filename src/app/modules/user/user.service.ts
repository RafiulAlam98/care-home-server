import { IUser } from './user.interface'
import { User } from './user.model'

const createUser = async (user: IUser) => {
  user.role = 'user'
  const result = await User.create(user)
  return result
}
export const UserService = {
  createUser,
}

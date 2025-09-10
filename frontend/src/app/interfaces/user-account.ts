export interface UserAccountResponse {
  status: string
  data: Data
}

export interface Data {
  user: User
}

export interface User {
  address: Address
  _id: string
  username: string
  email: string
  role: string
  phone: string
  is_confirmed: boolean
  createdAt: string
  updatedAt: string
}

export interface Address {
  city: string
  street: string
}

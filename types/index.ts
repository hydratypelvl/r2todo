export interface User {
    id: number
    name: string
    surname: string
    username: string
    email: string
    email_verified_at: string
    phone_number: string
    password: string
    gender: string
    remember_token: string
    lastActivityTime: string
    enabled: number
    created_at: string
    updated_at: string
  }
    
  export interface Slots {
    date: string
    takenby: string
    iorder:string
    queue_id: string
  }
    
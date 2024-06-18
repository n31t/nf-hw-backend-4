import { CreateUserDto } from './dtos/CreateUser.dto'
import User, { IUser } from './models/User'
import UserModel from './models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import RefreshTokenModel from './models/RefreshToken'

dotenv.config()

class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET!
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!

  async registerUser(createUserDto: CreateUserDto): Promise<IUser> {
    const { email, password, username, avatar } = createUserDto
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({
      email,
      username,
      password: hashedPassword,
      avatar
    })

    await newUser.save()
    return newUser
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{
    user: IUser
    accessToken: string
    refreshToken: string
  } | null> {
    const user = await UserModel.findOne({ email })
    if (!user) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return null

    const accessToken = this.generateJwt(user)
    const refreshToken = this.generateRefreshToken(user)

    const refreshTokenDoc = new RefreshTokenModel({
      token: refreshToken,
      user: user._id
    })
    await refreshTokenDoc.save()

    return { user, accessToken, refreshToken }
  }

  private generateJwt(user: IUser): string {
    return jwt.sign({ id: user._id, email: user.email }, this.jwtSecret, {
      expiresIn: '1h'
    })
  }

  private generateRefreshToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, email: user.email },
      this.jwtRefreshSecret,
      { expiresIn: '7d' }
    )
  }

  verifyJwt(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret)
    } catch (err) {
      return null
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtRefreshSecret)
    } catch (err) {
      return null
    }
  }

  async refreshToken(
    oldToken: string
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const payload = this.verifyRefreshToken(oldToken)
    if (!payload) return null

    const user = await UserModel.findById(payload.id)
    if (!user) return null

    const newAccessToken = this.generateJwt(user)
    const newRefreshToken = this.generateRefreshToken(user)

    const refreshTokenDoc = new RefreshTokenModel({
      token: newRefreshToken,
      user: user._id
    })
    await refreshTokenDoc.save()

    await RefreshTokenModel.deleteOne({ token: oldToken })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async updateAvatar(userId: string, avatar: string): Promise<IUser | null> {
    const user = await UserModel.findById(userId)
    if (!user) {
      return null
    }
    user.avatar = avatar
    await user.save()
    return user
  }

  async getUserByToken(token: string): Promise<IUser | null> {
    const payload = this.verifyJwt(token)
    if (!payload) return null
  
    const user = await UserModel.findById(payload.id)
    return user
  }

  async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find({}).exec()
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id)
  }

  async searchUsersByKeywords(keywords: string): Promise<IUser[]> {
    const keywordArray = keywords.split(' ');
    const queryArray = keywordArray.map(keyword => ({ username: { $regex: keyword, $options: 'i' } }));
    return await User.find({ $or: queryArray }).exec();
  }

  async updateUsername(userId: string, username: string): Promise<IUser | null> {
    const user = await UserModel.findById(userId)
    if (!user) {
      return null
    }
    user.username = username
    await user.save()
    return user
  }
  
}

export default AuthService
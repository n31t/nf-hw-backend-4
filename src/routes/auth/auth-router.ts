import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth-middleware'
import AuthController from './auth-controller'
import AuthService from './auth-service'

const authRouter = Router()

const authService = new AuthService()
const authController = new AuthController(authService)

authRouter.post('/register', authController.registerUser)
authRouter.post('/login', authController.loginUser)
authRouter.post('/refresh-token', authController.refreshToken)

authRouter.get('/users', authController.getAllUsers)
authRouter.get('/users/:id', authController.getUserById)
authRouter.put('/users/:id/image', authController.uploadAvatar)
authRouter.put('/users/:id/username', authController.updateUsername)
authRouter.post('/users/search/keywords', authController.searchUsersByKeywords)

// Example protected route
authRouter.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You have access to this route!' })
})



export default authRouter

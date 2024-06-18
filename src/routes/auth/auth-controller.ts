import { Request, Response } from 'express'
import { CreateUserDto } from './dtos/CreateUser.dto'
import AuthService from './auth-service'
import Busboy from 'busboy'
import { uploadFile } from '../../middlewares/s3-middleware'

class AuthController {
  private authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const createUserDto: CreateUserDto = req.body
      const user = await this.authService.registerUser(createUserDto)
      res.status(201).json(user)
    } catch (err) {
      res.status(500).json({ message: 'Error registering user' })
    }
  }

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body
      const result = await this.authService.loginUser(email, password)
      if (!result) {
        res.status(401).json({ message: 'Invalid email or password' })
        return
      }
      res.status(200).json(result)
    } catch (err) {
      res.status(500).json({ message: 'Error logging in' })
    }
  }

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body
      const result = await this.authService.refreshToken(token)
      if (!result) {
        res.status(401).json({ message: 'Invalid or expired refresh token' })
        return
      }
      res.status(200).json(result)
    } catch (err) {
      res.status(500).json({ message: 'Error refreshing token' })
    }
  }

  uploadAvatar = async (req: Request, res: Response): Promise<void> => {
    try{
        const { id } = req.params;
        const busboy = new Busboy({ headers: req.headers});

        busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
            const url = await uploadFile('nf-spotify-hw', filename, file);
            console.log('File uploaded successfully');
            const updatedPlaylist = await this.authService.updateAvatar(id, url);

            if (!updatedPlaylist) {
              res.status(404).json({ message: 'User not found' });
              return;
            }
            res.status(201).json({ message: 'File uploaded successfully', playlist: updatedPlaylist })
        });
        return req.pipe(busboy);
    }
    catch (error: any) {
        res.status(500).send({ error: error.message });
    }
  }
  getUserByToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body
      if(!token){
        res.status(401).json({ message: 'No token provided' })
        return
      }
      const user = await this.authService.getUserByToken(token)
      if (!user) {
        res.status(401).json({ message: 'Invalid token' })
        return
      }
      res.status(200).json(user)
    } catch (err) {
      res.status(500).json({ message: 'Error getting user' })
    }
  }

  getUserById = async (req : Request, res : Response): Promise<void> => {
    try {
      const { id } = req.params
      const user = await this.authService.getUserById(id)
      if (!user) {
        res.status(404).json({ message: 'User not found' })
        return
      }
      res.status(200).json(user)
    }
    catch (err) {
      res.status(500).json({ message: 'Error getting user' })
    }
  }

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.authService.getAllUsers()
      res.status(200).json(users)
    } catch (err) {
      res.status(500).json({ message: 'Error getting users' })
    }
  }

  updateUsername = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { username } = req.body
      const user = await this.authService.updateUsername(id, username)
      if (!user) {
        res.status(404).json({ message: 'User not found' })
        return
      }
      res.status(200).json(user)
    } catch (err) {
      res.status(500).json({ message: 'Error updating user' })
    }
  }

  

  searchUsersByKeywords = async (req: Request, res: Response): Promise<void> => {
    try {
      const { keywords } = req.body
      const users = await this.authService.searchUsersByKeywords(keywords)
      res.status(200).json(users)
    } catch (err) {
      res.status(500).json({ message: 'Error searching users' })
    }
  }
}

export default AuthController

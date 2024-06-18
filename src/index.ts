import 'dotenv/config'
import express from 'express'
import { createServer } from 'node:http'
import connectDB from './db'
import globalRouter from './routes/global-router'
import { logger } from './logger'
import { createBucket, deleteBucket, listBuckets, putFile, uploadFile } from './middlewares/s3-middleware'
import cors from 'cors'

connectDB()

const app = express()

app.use(cors({
  origin: 'https://nf-hw-backend-4-omega.vercel.app',
  methods: ['GET', 'POST','PUT', 'DELETE'],
  allowedHeaders: '*', 
  exposedHeaders: '*',
  credentials: true
}));

app.use(express.json())
app.use(logger)
app.use('/api/v5', globalRouter)



const server = createServer(app)

listBuckets()
  .then(()=> {
    uploadFile('nf-spotify-hw', 'test.txt', 't')
  });

server.listen(3000, () => {
  console.log('server running at http://localhost:3000/api/v5')
})

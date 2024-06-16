import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const s3 = new S3({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
})

export const listBuckets = async() => {
    await s3
    .listBuckets()
    .then((res) => console.log(res.Buckets))
    .catch((err) => console.log(err))

}

export const createBucket = async( bucketName: string) => {
    await s3
    .createBucket({Bucket : bucketName})
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
}

export const deleteBucket = async( bucketName: string) => {
    await s3
    .deleteBucket({Bucket : bucketName})
    .then((res)=> console.log(res))
    .catch((err) => console.log(err))
}

export const uploadFile = async (bucketName : string, key : string, body : any) => {
    try {
    const upload = new Upload({
        client: s3,
        params: {
            Bucket: bucketName,
            Key: key,
            Body: body
        }
    })

    await upload.done()
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

    const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
    return url;
    }
    catch (err) {
        console.log(err)
        throw new Error('Error uploading file')
    }
}



export const putFile = async (bucketName: string, key: string, body: any) => {
    await s3
    .putObject({
        Bucket: bucketName,
        Key: key,
        Body: body
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
}


export const deleteFile = async (Bucket: string, name: string) => {
    await s3
    .deleteObject({ Bucket, Key: name })
    .then((res) => console.log(res))
    .catch((err) => console.log(`Error deleting a file: ${err.Code}`))
}

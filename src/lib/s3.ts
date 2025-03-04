import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadToS3 = async (
  file: Buffer,
  fileName: string,
  contentType: string
) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: fileName,
    Body: file,
    ContentType: contentType,
  };

  try {
    const data = await s3.upload(params).promise();
    return { success: true, url: data.Location };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return { success: false, error };
  }
};

export const getSignedUrl = (key: string) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: key,
    Expires: 60 * 5, // URL expires in 5 minutes
  };

  return s3.getSignedUrl('getObject', params);
};
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { filename, contentType } = req.body || {};
    if (!filename || !contentType) {
      return res.status(400).json({ error: "filename e contentType são obrigatórios" });
    }

    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME, S3_REGION } = process.env;
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !S3_BUCKET_NAME || !S3_REGION) {
      return res.status(500).json({ error: "S3 não configurado. Defina AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME e S3_REGION no .env" });
    }

    const client = new S3Client({
      region: S3_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    // create a key safe filename (prefix with timestamp)
    const key = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9_.-]/g, "-")}`;

    const cmd = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(client, cmd, { expiresIn: 60 * 5 });

    // public URL (depends on bucket policy); user can adjust as needed
    const publicUrl = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${key}`;

    return res.status(200).json({ uploadUrl, key, publicUrl });
  } catch (err) {
    console.error("upload-url error:", err);
    return res.status(500).json({ error: "Erro ao gerar presigned URL" });
  }
}

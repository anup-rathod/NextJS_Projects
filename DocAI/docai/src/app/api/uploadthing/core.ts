import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "4MB",
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
        const {getUser} = getKindeServerSession()
        const user = await getUser()

        if(!user || !user.id) throw new Error('Unauthorize')
        
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file?.url,
          uploadStatus: 'PROCESSING',
        }, 
      })
    }),
  } satisfies FileRouter;
  
export type OurFileRouter = typeof ourFileRouter;

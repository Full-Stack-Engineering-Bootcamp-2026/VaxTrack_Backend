import B2 from "backblaze-b2";

import { Service } from "typedi";
import { UploadResponseDto } from "../../domains/user/types/user.dto";


@Service()
export class B2Service {

    private b2: B2;

    constructor() {

        this.b2 = new B2({
            applicationKeyId:
                process.env.B2_KEY_ID as string,

            applicationKey:
                process.env.B2_APPLICATION_KEY as string,
        });
    }

    private async authorize(): Promise<void> {

        await this.b2.authorize();
    }

    public async uploadTempProfileImage(file: Express.Multer.File): Promise<UploadResponseDto> {

        await this.authorize();

        const uploadUrl = await this.b2.getUploadUrl({
            bucketId:
                process.env.B2_BUCKET_ID as string,
        });

        const fileName = `temp/profile/${Date.now()}-${file.originalname}`;

        await this.b2.uploadFile({
            uploadUrl:
                uploadUrl.data.uploadUrl,

            uploadAuthToken:
                uploadUrl.data.authorizationToken,

            fileName,

            data: file.buffer,
        });

        const imageUrl = `${process.env.B2_ENDPOINT}/file/${process.env.B2_BUCKET_NAME}/${fileName}`;

        return {
            imageUrl,
            fileName,
        };
    }
    public async deleteFile(fileName: string): Promise<void> {

        await this.authorize();

        const files = await this.b2.listFileNames({
            bucketId: process.env.B2_BUCKET_ID as string,

            startFileName: "",

            prefix: fileName,

            delimiter: "",

            maxFileCount: 1,
        });

        const file = files.data.files[0];

        if (!file) {
            return;
        }

        await this.b2.deleteFileVersion({
            fileId: file.fileId,

            fileName: file.fileName,
        });
    }
}
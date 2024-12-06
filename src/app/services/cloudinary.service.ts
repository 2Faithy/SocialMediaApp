import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios'; // Import axios and AxiosResponse

interface CloudinaryResponse {
  secure_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudName = 'dklsxkw0r'; // Replace with your Cloudinary Cloud Name
  private uploadPreset = 'unsigned_preset'; // Replace with your Upload Preset

  constructor() {}

  /**
   * Upload an image to Cloudinary
   * @param file - File object to upload
   * @returns A Promise resolving to the uploaded image URL
   */
  async uploadImage(file: File): Promise<string> {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    try {
      const response: AxiosResponse<CloudinaryResponse> = await axios.post<CloudinaryResponse>(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw error;
    }
  }
}

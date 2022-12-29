import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  ImageOptions,
} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, map, take, tap } from 'rxjs';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import { Photo } from 'src/app/shared/interfaces/photo';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  #photos$ = new BehaviorSubject<Photo[]>([]);
  photos$ = this.#photos$.pipe(
    tap((photos) => this.storageService.save(photos))
  );

  hasTakenPhotoToday$ = this.#photos$.pipe(
    map((photos) =>
      photos.find(
        (photo) =>
          new Date().setHours(0, 0, 0, 0) ===
          new Date(photo.dateTaken).setHours(0, 0, 0, 0)
      )
        ? true
        : false
    )
  );

  // Receive a fileName and filePath
  private addPhoto(fileName: string, filePath: string) {
    // Create new photo using current date
    const newPhotos = [
      {
        name: fileName,
        path: filePath,
        dateTaken: new Date().toISOString(),
      },
      // Add photo into the existing photos array
      ...this.#photos$.value,
    ];

    // Emit it on the stream
    this.#photos$.next(newPhotos);
  }

  constructor(
    private platform: Platform,
    private storageService: StorageService
  ) {}

  async takePhoto() {
    const options: ImageOptions = {
      quality: 50,
      width: 600,
      allowEditing: false,
      resultType: this.platform.is('capacitor')
        ? CameraResultType.Uri
        : CameraResultType.DataUrl,
      source: CameraSource.Camera,
    };

    try {
      // Call the camera plugin
      const photo = await Camera.getPhoto(options);

      const uniqueName = Date.now().toString();

      if (this.platform.is('capacitor') && photo.path) {
        const photoOnFileSystem = await Filesystem.readFile({
          path: photo.path,
        });

        const fileName = uniqueName + '.jpeg';
        const permanentFile = await Filesystem.writeFile({
          data: photoOnFileSystem.data,
          path: fileName,
          directory: Directory.Data,
        });

        this.addPhoto(fileName, Capacitor.convertFileSrc(permanentFile.uri));
      } else if (photo.dataUrl) {
        this.addPhoto(uniqueName, photo.dataUrl);
      }
    } catch (err) {
      console.log(err);
      throw new Error('Could not save photo');
    }
  }

  load() {
    this.storageService.load$.pipe(take(1)).subscribe((photos) => {
      this.#photos$.next(photos);
    });
  }
}

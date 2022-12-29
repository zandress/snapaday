import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Photo } from "src/app/shared/interfaces/photo";

@Injectable({
    providedIn: 'root',
})
export class PhotoService {
    #photos$ = new BehaviorSubject<Photo[]>([]);
    photos$ = this.#photos$.asObservable();

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
}